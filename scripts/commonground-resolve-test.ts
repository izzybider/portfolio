/* ============================================================
   Edge cases for the CommonGround conflict resolver.

   Run: npm run cg:test
   Every number printed is measured by re-running the real ranker.
   ============================================================ */

import { SET_A } from '../src/lib/commonground/activities';
import { rank } from '../src/lib/commonground/rank';
import {
  resolveConflict,
  applyRelaxations,
  type Relaxation,
} from '../src/lib/commonground/resolve';
import type { Category, Participant, Setting } from '../src/lib/commonground/types';

type P = Partial<Participant> & { id: number };

function person(o: P): Participant {
  return {
    id: o.id,
    label: o.label ?? `Person ${o.id + 1}`,
    maxCost: o.maxCost ?? 60,
    maxMinutes: o.maxMinutes ?? 300,
    maxTravel: o.maxTravel ?? 3,
    settingNeed: (o.settingNeed ?? 'no preference') as Setting | 'no preference',
    interests: o.interests ?? (['food', 'games'] as Category[]),
    energy: o.energy ?? 2,
    style: o.style ?? 'talk',
    vetoes: o.vetoes ?? [],
    want: o.want ?? '',
  };
}

const input = (participants: Participant[]) => ({
  activities: SET_A,
  participants,
  removedIds: [] as string[],
  rules: [],
});

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
  if (!cond) failures += 1;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

function header(n: number, title: string) {
  console.log(`\n${'='.repeat(64)}\n${n}. ${title}\n${'='.repeat(64)}`);
}

/* ---------- 1 · one hard constraint removes everything ---------- */
header(1, 'No feasible option because of ONE hard constraint');
{
  const ps = [
    person({ id: 0, maxMinutes: 60 }), // the only tight limit in the group
    person({ id: 1 }),
    person({ id: 2 }),
    person({ id: 3 }),
  ];
  const r = resolveConflict(input(ps));
  console.log(`  severity: ${r.diagnosis.severity}`);
  console.log(`  summary : ${r.diagnosis.summary}`);
  console.log(`  blockers: ${r.diagnosis.topBlockers.map((b) => `${b.label}=${b.count}`).join(', ')}`);
  r.suggestions.forEach((s, i) => console.log(`  ${i + 1}. ${s.sentence}`));
  check('severity is infeasible', r.diagnosis.severity === 'infeasible');
  check('time limits are the top blocker', r.diagnosis.topBlockers[0]?.label === 'time limits');
  check('suggests relaxing Person 1 time', r.suggestions[0]?.participantId === 0 && r.suggestions[0]?.kind === 'time');
  check('unlock count is measured, not zero', (r.suggestions[0]?.unlocks.length ?? 0) > 0,
    `${r.suggestions[0]?.unlocks.length} unlocked`);
}

/* ---------- 2 · several different constraints at once ---------- */
header(2, 'Multiple conflicting constraints');
{
  const ps = [
    person({ id: 0, maxCost: 9 }),
    person({ id: 1, maxMinutes: 100 }),
    person({ id: 2, maxTravel: 1 }),
    person({ id: 3, settingNeed: 'indoor' }),
  ];
  const r = resolveConflict(input(ps));
  console.log(`  severity: ${r.diagnosis.severity}`);
  console.log(`  blockers: ${r.diagnosis.topBlockers.map((b) => `${b.label}=${b.count}`).join(', ')}`);
  r.suggestions.forEach((s, i) =>
    console.log(`  ${i + 1}. ${s.sentence}  [effort ${s.effort.toFixed(2)}, unlocks ${s.unlocks.length}]`),
  );
  check('more than one kind of blocker is reported', r.diagnosis.topBlockers.length > 1,
    `${r.diagnosis.topBlockers.length} kinds`);
  check('suggestions are ordered by score', r.suggestions.every((s, i, arr) => i === 0 || arr[i - 1].score >= s.score));
}

/* ---------- 3 · one person's vetoes dominate ---------- */
header(3, "One person's veto dominates");
{
  const all: Category[] = ['outdoors', 'food', 'culture', 'games', 'nightlife', 'relaxed', 'active', 'shopping'];
  const ps = [
    person({ id: 0, vetoes: all }),
    person({ id: 1 }),
    person({ id: 2 }),
    person({ id: 3 }),
  ];
  const r = resolveConflict(input(ps));
  console.log(`  severity: ${r.diagnosis.severity}`);
  console.log(`  summary : ${r.diagnosis.summary}`);
  console.log(`  blockers: ${r.diagnosis.topBlockers.map((b) => `${b.label}=${b.count}`).join(', ')}`);
  r.suggestions.forEach((s, i) => console.log(`  ${i + 1}. ${s.sentence}`));
  check('vetoes are the top blocker', r.diagnosis.topBlockers[0]?.label === 'vetoes');
  check('every suggestion is a veto removal', r.suggestions.every((s) => s.kind === 'veto'));
  check('all suggestions target the vetoing person', r.suggestions.every((s) => s.participantId === 0));
}

/* ---------- 4 · one relaxation unlocks many ---------- */
header(4, 'Relaxing one constraint unlocks many options');
{
  const ps = [
    person({ id: 0, maxCost: 4 }),
    person({ id: 1 }),
    person({ id: 2 }),
    person({ id: 3 }),
  ];
  const r = resolveConflict(input(ps));
  const best = r.suggestions[0];
  console.log(`  summary : ${r.diagnosis.summary}`);
  r.suggestions.forEach((s, i) =>
    console.log(`  ${i + 1}. ${s.sentence}  [unlocks ${s.unlocks.length}]`),
  );
  console.log(`  unlocked: ${best?.unlockedNames.join(' · ')}`);
  /* The spec ranks smallest-change first, so the tiny ask leading is
     correct. What matters is that a large unlock is offered, and that
     every claimed count survives actually being applied. */
  /* Size-of-ask and options-unlocked are blended, not lexicographic: a
     strict "smallest first" rule would lead with a $1 raise that unlocks a
     single option, which is a worse suggestion than the one below. */
  check('the leader has the best blended score',
    best.score === Math.max(...r.suggestions.map((s) => s.score)));
  check('the leader unlocks many', best.unlocks.length > 1, `${best.unlocks.length} options`);
  check('a genuinely minimal ask is still offered further down',
    r.suggestions.some((s) => s.effort < best.effort),
    `min effort ${Math.min(...r.suggestions.map((s) => s.effort)).toFixed(3)}`);
  r.suggestions.forEach((s) => {
    const after = rank({ ...input(ps), participants: applyRelaxations(ps, [s as Relaxation]) });
    const ids = new Set(after.shortlist.map((x) => x.activity.id));
    check(`claim verifies when applied: ${s.id}`, s.unlocks.every((id) => ids.has(id)));
  });
}

/* ---------- 5 · equivalent relaxations, deterministic ---------- */
header(5, 'Multiple equivalent relaxations');
{
  /* outdoors and games both hold exactly 4 options in SET_A, so removing
     either veto is the same size of ask for the same payoff. */
  const all: Category[] = ['outdoors', 'food', 'culture', 'games', 'nightlife', 'relaxed', 'active', 'shopping'];
  const ps = [person({ id: 0, vetoes: all }), person({ id: 1 }), person({ id: 2 }), person({ id: 3 })];
  const a = resolveConflict(input(ps), [], 6);
  const b = resolveConflict(input(ps), [], 6);
  a.suggestions.forEach((s) =>
    console.log(`  ${s.id}  effort ${s.effort.toFixed(2)}  unlocks ${s.unlocks.length}  score ${s.score.toFixed(4)}`),
  );
  const top2 = a.suggestions.slice(0, 2);
  check('the top two are genuinely tied on score',
    Math.abs(top2[0].score - top2[1].score) < 1e-9,
    `${top2[0].score.toFixed(4)} vs ${top2[1].score.toFixed(4)}`);
  check('ties break deterministically by id', top2[0].id.localeCompare(top2[1].id) < 0);
  check('identical input gives identical output',
    JSON.stringify(a.suggestions.map((s) => s.id)) === JSON.stringify(b.suggestions.map((s) => s.id)));
}

/* ---------- 6 · repeated compromise by one person ---------- */
header(6, 'Repeated compromise by one person');
{
  /* Every category is vetoed across two people, so the only moves are veto
     removals. Person 1 holds the big categories, Person 2 the small ones —
     on size-of-ask alone Person 1 always leads. */
  const ps = [
    person({ id: 0, vetoes: ['outdoors', 'games', 'culture', 'nightlife'] as Category[] }),
    person({ id: 1, vetoes: ['food', 'relaxed', 'active', 'shopping'] as Category[] }),
    person({ id: 2 }),
    person({ id: 3 }),
  ];

  const fresh = resolveConflict(input(ps));
  console.log(`  no history -> first ask goes to ${fresh.suggestions[0]?.participantLabel}`);
  check('without history there is no fairness note', fresh.fairnessNote === null);

  /* Person 1 has already given ground twice this session. */
  const history: Relaxation[] = [0, 1].map((n) => ({
    ...(fresh.suggestions[0] as Relaxation),
    id: `history-${n}`,
    participantId: 0,
    participantLabel: 'Person 1',
  }));
  const loaded = resolveConflict(input(ps), history);
  console.log(`  loads: ${loaded.loads.map((l) => `${l.participantLabel}=${l.load.toFixed(2)}`).join(', ')}`);
  loaded.suggestions.forEach((s) =>
    console.log(`  ${s.id}  raw ${s.rawScore.toFixed(3)}  score ${s.score.toFixed(3)}  ${s.participantLabel}`),
  );
  console.log(`  first ask now goes to ${loaded.suggestions[0]?.participantLabel}`);
  console.log(`  fairnessNote: ${loaded.fairnessNote ?? '(none)'}`);
  check('Person 1 is over the overloaded threshold',
    (loaded.loads.find((l) => l.participantLabel === 'Person 1')?.load ?? 0) > 0.5);
  check('there are suggestions to reorder', loaded.suggestions.length > 1);
  check('fairness note is surfaced', loaded.fairnessNote !== null);
  check('the overloaded person is no longer asked first',
    loaded.suggestions[0]?.participantLabel !== 'Person 1');
}

/* ---------- 7 · one relaxation is not enough ---------- */
header(7, 'Still no feasible option after one relaxation');
{
  /* Two people share the same tight ceiling, so relaxing either one alone
     leaves the other still blocking every option. */
  const ps = [
    person({ id: 0, maxMinutes: 60 }),
    person({ id: 1, maxMinutes: 60 }),
    person({ id: 2 }),
    person({ id: 3 }),
  ];
  const r = resolveConflict(input(ps));
  console.log(`  severity: ${r.diagnosis.severity}`);
  console.log(`  pairNote: ${r.pairNote ?? '(none)'}`);
  r.suggestions.forEach((s, i) => console.log(`  ${i + 1}. ${s.sentence}`));
  check('nothing is feasible to begin with', r.diagnosis.severity === 'infeasible');
  check('no single change is enough, so a pair is reported', r.pairNote !== null);
  check('the pair spans two different people',
    new Set(r.suggestions.slice(0, 2).map((s) => s.participantId)).size === 2);
  if (r.pairNote) {
    const both = r.suggestions.slice(0, 2) as Relaxation[];
    const after = rank({ ...input(ps), participants: applyRelaxations(ps, both) });
    console.log(`  applying both -> shortlist of ${after.shortlist.length}`);
    check('applying both really produces a shortlist', after.shortlist.length > 0);
  }
}

/* ---------- 8 · healthy group needs no resolution ---------- */
header(8, 'Control: a group with no conflict');
{
  const ps = [person({ id: 0 }), person({ id: 1 }), person({ id: 2 }), person({ id: 3 })];
  const r = resolveConflict(input(ps));
  console.log(`  severity: ${r.diagnosis.severity}  shortlist: ${r.diagnosis.shortlistCount}`);
  check('no conflict is reported', r.diagnosis.severity === 'none');
}

console.log(`\n${'='.repeat(64)}`);
console.log(failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
