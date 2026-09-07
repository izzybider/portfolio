/* ============================================================
   COMMONGROUND — conflict diagnosis and relaxation search

   What this file answers: when nothing fits everyone, *why*, and what is
   the smallest thing that would change it.

   The whole search is deterministic and enumerable. There is no model
   anywhere in it. A relaxation is only ever reported as unlocking an
   option if re-running the real feasibility check with that relaxation
   applied actually puts the option in the shortlist — the counts are
   measured, never estimated.

   Three ideas do the work:

     1. A relaxation is a concrete, minimal edit to one person's stated
        constraint: a budget raised to exactly the price of the cheapest
        option it would unlock, a veto dropped, a setting requirement
        released. Candidate thresholds come from the activity set itself,
        so we never propose a change larger than something needs.

     2. Relaxations are ranked by how small the ask is and how much it
        opens up — not by group score. Optimising total score is what
        produces the option that three people love and one person hates.

     3. The person being asked matters. Compromise load is tracked across
        the session, and a suggestion that lands on someone already
        carrying the group's compromises gets demoted in favour of a
        comparable one that does not. When that happens the UI says so.
   ============================================================ */

import type { Activity, Category, Participant, Scored, Setting } from './types';
import { CATEGORY_LABELS, TRAVEL_LABELS } from './activities';
import { hardFailures, satisfaction, rank, type RankInput, type RankOutput } from './rank';

/* ============================================================
   1 · DIAGNOSIS
   ============================================================ */

export type BlockedOption = {
  activityId: string;
  name: string;
  /** hard constraints that eliminate it, per person */
  hardBlocks: { participant: string; reason: string }[];
  /** vetoes that eliminate it */
  vetoes: string[];
  /** people whose soft preferences drag its score down */
  softDrags: { participant: string; value: number }[];
};

export type Severity = 'none' | 'compromise' | 'infeasible';

export type Diagnosis = {
  severity: Severity;
  shortlistCount: number;
  infeasibleCount: number;
  vetoedCount: number;
  blocked: BlockedOption[];
  /** which constraint eliminates the most options, most damaging first */
  topBlockers: { label: string; count: number }[];
  /** one line, derived */
  summary: string;
};

/** Below this the least-satisfied person is being asked to carry the choice. */
export const COMPROMISE_FLOOR = 0.45;

const reasonLabel: Record<string, string> = {
  'over budget': 'budget ceilings',
  'takes too long': 'time limits',
  'too far': 'travel limits',
  'wrong setting': 'indoor/outdoor requirements',
  'group too large': 'group size',
  'group too small': 'group size',
};

export function diagnose(out: RankOutput): Diagnosis {
  const blocked: BlockedOption[] = [...out.infeasible, ...out.vetoed].map((s) => ({
    activityId: s.activity.id,
    name: s.activity.name,
    hardBlocks: s.blockers.map((b) => ({ participant: b.participant, reason: b.reason })),
    vetoes: s.vetoedBy,
    softDrags: s.satisfaction
      .filter((x) => x.value < 0.4)
      .map((x) => ({ participant: x.participant, value: x.value })),
  }));

  /* Count how many options each kind of constraint removes. A veto is
     counted separately because it is a different kind of no. */
  const counts = new Map<string, number>();
  out.infeasible.forEach((s) => {
    const kinds = new Set(s.blockers.map((b) => reasonLabel[b.reason] ?? b.reason));
    kinds.forEach((k) => counts.set(k, (counts.get(k) ?? 0) + 1));
  });
  if (out.vetoed.length > 0) counts.set('vetoes', out.vetoed.length);

  const topBlockers = [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const top = out.shortlist[0];
  const severity: Severity =
    out.shortlist.length === 0
      ? 'infeasible'
      : top && top.minSatisfaction < COMPROMISE_FLOOR
        ? 'compromise'
        : 'none';

  let summary: string;
  if (severity === 'infeasible') {
    const worst = topBlockers[0];
    summary = worst
      ? `${out.infeasible.length + out.vetoed.length} options are out, and ${worst.label} account${
          worst.label === 'vetoes' ? '' : 's'
        } for ${worst.count} of them.`
      : 'Every option has been removed or rejected.';
  } else if (severity === 'compromise') {
    const worstOff = [...top.satisfaction].sort((a, b) => a.value - b.value)[0];
    summary = `${top.activity.name} works on paper, but ${worstOff.participant} is carrying most of the compromise.`;
  } else {
    summary = 'Nothing is blocking agreement.';
  }

  return {
    severity,
    shortlistCount: out.shortlist.length,
    infeasibleCount: out.infeasible.length,
    vetoedCount: out.vetoed.length,
    blocked,
    topBlockers,
    summary,
  };
}

/* ============================================================
   2 · RELAXATION CANDIDATES
   ============================================================ */

export type RelaxationKind = 'budget' | 'time' | 'travel' | 'setting' | 'veto';

export type Relaxation = {
  id: string;
  participantId: number;
  participantLabel: string;
  kind: RelaxationKind;
  /** the edit itself, applied to that one participant */
  patch: Partial<Participant>;
  from: string;
  to: string;
  /** 0–1, how large an ask this is */
  effort: number;
  /** activity ids that enter the shortlist when this is applied */
  unlocks: string[];
  unlockedNames: string[];
  /** measured against the current best option */
  beneficiaries: string[];
  additionalCompromise: string[];
  /** derived sentence, not written by hand */
  sentence: string;
  tradeoff: string;
};

/** How large an ask each kind of change is, on one 0–1 scale. */
const EFFORT = {
  travelStep: 0.35,
  setting: 0.5,
  veto: 0.8,
} as const;

const SETTING_WORD: Record<Setting, string> = {
  indoor: 'indoor',
  outdoor: 'outdoor',
  mixed: 'mixed',
};

/** Apply relaxations to produce the participant list the ranker should see. */
export function applyRelaxations(
  participants: Participant[],
  relaxations: Relaxation[],
): Participant[] {
  return participants.map((p) => {
    const mine = relaxations.filter((r) => r.participantId === p.id);
    return mine.reduce((acc, r) => ({ ...acc, ...r.patch }), p);
  });
}

/** Shortlist ids for a given participant list — the real check, re-run. */
function shortlistIds(input: RankInput): Set<string> {
  return new Set(rank(input).shortlist.map((s) => s.activity.id));
}

/**
 * Every minimal single-constraint edit worth considering. Thresholds come
 * from the activity set, so a budget is only ever raised to the exact
 * price of something it would unlock.
 */
function candidates(
  participants: Participant[],
  activities: Activity[],
  blockedIds: Set<string>,
): Omit<Relaxation, 'unlocks' | 'unlockedNames' | 'beneficiaries' | 'additionalCompromise' | 'sentence' | 'tradeoff'>[] {
  const out: ReturnType<typeof candidates> = [];
  const blocked = activities.filter((a) => blockedIds.has(a.id));

  /* Effort is measured against the spread of the activity set, not against
     the person's own ceiling. Relative-to-self makes a $1 raise on a $4
     budget look like the same concession as $10 on a $40 one. */
  const costSpread = Math.max(
    1,
    Math.max(...activities.map((a) => a.cost)) - Math.min(...activities.map((a) => a.cost)),
  );
  const timeSpread = Math.max(
    1,
    Math.max(...activities.map((a) => a.duration)) -
      Math.min(...activities.map((a) => a.duration)),
  );

  participants.forEach((p) => {
    /* --- budget: raise to the exact cost of something it blocks --- */
    const costs = [...new Set(blocked.filter((a) => a.cost > p.maxCost).map((a) => a.cost))].sort(
      (a, b) => a - b,
    );
    costs.forEach((c) => {
      out.push({
        id: `p${p.id}-budget-${c}`,
        participantId: p.id,
        participantLabel: p.label,
        kind: 'budget',
        patch: { maxCost: c },
        from: `$${p.maxCost}`,
        to: `$${c}`,
        effort: Math.min(1, (c - p.maxCost) / costSpread),
      });
    });

    /* --- time --- */
    const times = [
      ...new Set(blocked.filter((a) => a.duration > p.maxMinutes).map((a) => a.duration)),
    ].sort((a, b) => a - b);
    times.forEach((t) => {
      out.push({
        id: `p${p.id}-time-${t}`,
        participantId: p.id,
        participantLabel: p.label,
        kind: 'time',
        patch: { maxMinutes: t },
        from: fmtMinutes(p.maxMinutes),
        to: fmtMinutes(t),
        effort: Math.min(1, (t - p.maxMinutes) / timeSpread),
      });
    });

    /* --- travel --- */
    ([1, 2, 3] as const)
      .filter((lvl) => lvl > p.maxTravel)
      .forEach((lvl) => {
        out.push({
          id: `p${p.id}-travel-${lvl}`,
          participantId: p.id,
          participantLabel: p.label,
          kind: 'travel',
          patch: { maxTravel: lvl },
          from: TRAVEL_LABELS[p.maxTravel],
          to: TRAVEL_LABELS[lvl],
          effort: Math.min(1, (lvl - p.maxTravel) * EFFORT.travelStep),
        });
      });

    /* --- setting requirement --- */
    if (p.settingNeed !== 'no preference') {
      out.push({
        id: `p${p.id}-setting`,
        participantId: p.id,
        participantLabel: p.label,
        kind: 'setting',
        patch: { settingNeed: 'no preference' },
        from: `${SETTING_WORD[p.settingNeed]} only`,
        to: 'either is fine',
        effort: EFFORT.setting,
      });
    }

    /* --- vetoes: one per category that actually blocks something --- */
    p.vetoes.forEach((cat) => {
      if (!blocked.some((a) => a.category === cat)) return;
      out.push({
        id: `p${p.id}-veto-${cat}`,
        participantId: p.id,
        participantLabel: p.label,
        kind: 'veto',
        patch: { vetoes: p.vetoes.filter((v) => v !== cat) },
        from: `${CATEGORY_LABELS[cat].toLowerCase()} ruled out`,
        to: 'back on the table',
        effort: EFFORT.veto,
      });
    });
  });

  /* Stable order so equal-effort candidates never shuffle between runs. */
  return out.sort((a, b) => a.effort - b.effort || a.id.localeCompare(b.id));
}

function fmtMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h === 0) return `${rest}m`;
  return rest === 0 ? `${h}h` : `${h}h${String(rest).padStart(2, '0')}`;
}

/* ============================================================
   3 · FAIRNESS
   ============================================================ */

export type CompromiseLoad = {
  participantLabel: string;
  /** relaxations this person has already accepted this session */
  accepted: number;
  /** how often they are the one compromising across ranked options */
  compromiseRate: number;
  /** 0–1 combined */
  load: number;
};

/**
 * Who is already absorbing the group's compromises. Two inputs: how often
 * the ranker names them as a compromiser on the options it produced, and
 * how many constraint relaxations they have already agreed to.
 */
export function compromiseLoads(
  participants: Participant[],
  out: RankOutput,
  applied: Relaxation[],
): CompromiseLoad[] {
  const considered = [...out.shortlist, ...out.vetoed].slice(0, 8);
  return participants.map((p) => {
    const appearances = considered.filter((s) => s.compromisers.includes(p.label)).length;
    const compromiseRate = considered.length ? appearances / considered.length : 0;
    const accepted = applied.filter((r) => r.participantId === p.id).length;
    return {
      participantLabel: p.label,
      accepted,
      compromiseRate,
      /* An accepted relaxation is concrete, so it weighs more than being
         modelled as the compromiser on options nobody chose. */
      load: Math.min(1, accepted * 0.4 + compromiseRate * 0.6),
    };
  });
}

/* ============================================================
   4 · THE SEARCH
   ============================================================ */

export type Suggestion = Relaxation & {
  /** ordering on size-of-ask and options-unlocked alone */
  rawScore: number;
  /** rawScore plus the fairness term — what the list is actually sorted by */
  score: number;
  /** set when spreading the compromise moved this down */
  demotedForFairness: boolean;
};

export type Resolution = {
  diagnosis: Diagnosis;
  suggestions: Suggestion[];
  /** present when fairness changed the order */
  fairnessNote: string | null;
  /** set when no single change is enough and a pair is needed */
  pairNote: string | null;
  loads: CompromiseLoad[];
};

/** Ranking weights. Deliberately not "maximise group score". */
const W_EFFORT = 0.45;
const W_UNLOCK = 0.35;
const W_FAIRNESS = 0.2;

/** A suggestion within this much of the best is a fair swap for it. */
const FAIRNESS_SWAP_BAND = 0.12;
/** Above this load, we would rather ask somebody else. */
const OVERLOADED = 0.5;

export function resolveConflict(
  input: RankInput,
  applied: Relaxation[] = [],
  maxSuggestions = 3,
): Resolution {
  const base = rank(input);
  const diagnosis = diagnose(base);
  const loads = compromiseLoads(input.participants, base, applied);
  const loadByLabel = new Map(loads.map((l) => [l.participantLabel, l.load]));

  const baseShortlist = new Set(base.shortlist.map((s) => s.activity.id));
  const blockedIds = new Set(
    [...base.infeasible, ...base.vetoed].map((s) => s.activity.id),
  );

  const raw = candidates(input.participants, input.activities, blockedIds);

  /* Measure each candidate by actually re-running the ranker. */
  const measured: Relaxation[] = [];
  raw.forEach((c) => {
    const participants = applyRelaxations(input.participants, [c as Relaxation]);
    const after = shortlistIds({ ...input, participants });
    const unlocks = [...after].filter((id) => !baseShortlist.has(id));
    if (unlocks.length === 0) return;
    measured.push(finish(c, unlocks, input, base));
  });

  /* Among changes that unlock exactly the same options, keep the smallest
     ask — asking for more than the situation needs is never right. */
  const bySignature = new Map<string, Relaxation>();
  measured.forEach((r) => {
    const sig = `${r.participantId}|${r.kind}|${[...r.unlocks].sort().join(',')}`;
    const held = bySignature.get(sig);
    if (!held || r.effort < held.effort) bySignature.set(sig, r);
  });
  let pool = [...bySignature.values()];

  /* Nothing single-handedly works: look for the smallest pair. */
  let pairNote: string | null = null;
  if (pool.length === 0 && diagnosis.severity === 'infeasible') {
    const pair = findPair(input, raw, baseShortlist);
    if (pair) {
      pool = pair.relaxations;
      pairNote =
        'No single change is enough here. These two together are the smallest combination that opens anything up.';
    }
  }

  const maxUnlock = Math.max(1, ...pool.map((r) => r.unlocks.length));

  const scored: Suggestion[] = pool.map((r) => {
    const load = loadByLabel.get(r.participantLabel) ?? 0;
    const rawScore = W_EFFORT * (1 - r.effort) + W_UNLOCK * (r.unlocks.length / maxUnlock);
    return {
      ...r,
      rawScore,
      score: rawScore + W_FAIRNESS * (1 - load),
      demotedForFairness: false,
    };
  });

  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  /* Fairness pass. If the best suggestion lands on somebody already
     carrying the compromise, and another comparable one does not, take
     the other one and say why. */
  let fairnessNote: string | null = null;
  if (scored.length > 1) {
    /* Who would lead if we only cared about the size of the ask. */
    const rawBest = [...scored].sort(
      (a, b) => b.rawScore - a.rawScore || a.id.localeCompare(b.id),
    )[0];
    const rawBestLoad = loadByLabel.get(rawBest.participantLabel) ?? 0;

    if (rawBestLoad > OVERLOADED) {
      if (scored[0].participantLabel !== rawBest.participantLabel) {
        /* The fairness term already moved somebody else to the front. */
        rawBest.demotedForFairness = true;
        fairnessNote = `CommonGround is avoiding another recommendation that requires the same person to absorb the compromise. ${rawBest.participantLabel} has already given ground here, so a change from ${scored[0].participantLabel} is offered first.`;
      } else {
        /* It did not, so look for a comparable ask on somebody else. */
        const alt = scored
          .slice(1)
          .find(
            (s) =>
              (loadByLabel.get(s.participantLabel) ?? 0) < rawBestLoad &&
              scored[0].score - s.score <= FAIRNESS_SWAP_BAND,
          );
        if (alt) {
          scored[0].demotedForFairness = true;
          const moved = scored[0];
          scored.splice(scored.indexOf(alt), 1);
          scored.splice(0, 0, alt);
          fairnessNote = `CommonGround is avoiding another recommendation that requires the same person to absorb the compromise. ${moved.participantLabel} has already given ground here, so a comparable change from ${alt.participantLabel} is offered first.`;
        }
      }
    }
  }

  return {
    diagnosis,
    suggestions: scored.slice(0, maxSuggestions),
    fairnessNote,
    pairNote,
    loads,
  };
}

/** Smallest two-change combination, searched only when one is not enough. */
function findPair(
  input: RankInput,
  raw: ReturnType<typeof candidates>,
  baseShortlist: Set<string>,
): { relaxations: Relaxation[] } | null {
  /* Cheapest asks first, and capped — this is a fallback, not a solver. */
  const pool = raw.slice(0, 12);
  let best: { a: number; b: number; unlocks: string[]; effort: number } | null = null;

  for (let i = 0; i < pool.length; i += 1) {
    for (let j = i + 1; j < pool.length; j += 1) {
      if (pool[i].participantId === pool[j].participantId && pool[i].kind === pool[j].kind) continue;
      const participants = applyRelaxations(input.participants, [
        pool[i] as Relaxation,
        pool[j] as Relaxation,
      ]);
      const after = shortlistIds({ ...input, participants });
      const unlocks = [...after].filter((id) => !baseShortlist.has(id));
      if (unlocks.length === 0) continue;
      const effort = pool[i].effort + pool[j].effort;
      if (!best || effort < best.effort) best = { a: i, b: j, unlocks, effort };
    }
  }
  if (!best) return null;

  const baseOut = rank(input);
  return {
    relaxations: [
      finish(pool[best.a], best.unlocks, input, baseOut),
      finish(pool[best.b], best.unlocks, input, baseOut),
    ],
  };
}

/* ============================================================
   5 · SENTENCES — templated from the measured result
   ============================================================ */

function finish(
  c: ReturnType<typeof candidates>[number],
  unlocks: string[],
  input: RankInput,
  base: RankOutput,
): Relaxation {
  const byId = new Map(input.activities.map((a) => [a.id, a]));
  const unlockedNames = unlocks
    .map((id) => byId.get(id)?.name)
    .filter((n): n is string => Boolean(n))
    .sort();

  /* Who is better and worse off, measured against what the group has now. */
  const bestUnlocked = unlocks
    .map((id) => byId.get(id))
    .filter((a): a is Activity => Boolean(a))
    .sort((x, y) => x.id.localeCompare(y.id))[0];
  const currentTop: Scored | undefined = base.shortlist[0];

  const beneficiaries: string[] = [];
  const additionalCompromise: string[] = [];
  if (bestUnlocked) {
    input.participants.forEach((p) => {
      const now = currentTop ? satisfaction(currentTop.activity, p) : 0;
      const then = satisfaction(bestUnlocked, p);
      if (then - now > 0.05) beneficiaries.push(p.label);
      else if (now - then > 0.05) additionalCompromise.push(p.label);
    });
  }
  /* The person relaxing is giving something up by definition. */
  if (!additionalCompromise.includes(c.participantLabel)) {
    additionalCompromise.unshift(c.participantLabel);
  }

  const n = unlocks.length;
  const optionWord = `${n} option${n === 1 ? '' : 's'}`;
  const becomes = n === 1 ? 'becomes feasible' : 'become feasible';

  let sentence: string;
  switch (c.kind) {
    case 'budget':
      sentence = `If ${c.participantLabel} raises budget from ${c.from} to ${c.to}, ${optionWord} ${becomes}.`;
      break;
    case 'time':
      sentence = `If ${c.participantLabel} allows up to ${c.to}, ${optionWord} ${becomes}.`;
      break;
    case 'travel':
      sentence = `If ${c.participantLabel} accepts ${c.to.toLowerCase()}, ${optionWord} ${becomes}.`;
      break;
    case 'setting':
      sentence = `If ${c.participantLabel} allows ${
        c.from.startsWith('indoor') ? 'outdoor' : 'indoor'
      } activities, ${optionWord} ${becomes}.`;
      break;
    case 'veto':
      sentence = `If ${c.participantLabel} removes the ${c.from.replace(
        ' ruled out',
        '',
      )} veto, ${optionWord} ${becomes}.`;
      break;
  }

  /* The person relaxing is named as giving ground, so listing them among
     the winners as well reads as a contradiction. */
  const others = beneficiaries.filter((b) => b !== c.participantLabel);
  const tradeoff = !currentTop
    ? `Nothing was feasible before, so this creates the first real options. ${c.participantLabel} gives ground to do it.`
    : others.length > 0
      ? `${others.join(', ')} ${others.length === 1 ? 'gains' : 'gain'}; ${
          c.participantLabel
        } gives ground.`
      : `${c.participantLabel} gives ground; nobody else is worse off.`;

  return { ...c, unlocks, unlockedNames, beneficiaries, additionalCompromise, sentence, tradeoff };
}
