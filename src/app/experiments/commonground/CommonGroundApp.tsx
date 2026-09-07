'use client';

import { useMemo, useRef, useState } from 'react';
import Arrow from '@/components/Arrow';
import DeeperDetail from '@/components/DeeperDetail';
import {
  ACTIVITY_SETS,
  CATEGORY_LABELS,
  ENERGY_LABELS,
  STYLE_LABELS,
  TRAVEL_LABELS,
} from '@/lib/commonground/activities';
import { describeRule, rank } from '@/lib/commonground/rank';
import {
  applyRelaxations,
  resolveConflict,
  type Relaxation,
} from '@/lib/commonground/resolve';
import ResolveConflict from './ResolveConflict';
import {
  download,
  emptyRound,
  mailtoHref,
  newSessionId,
  summaryCsv,
  summaryJson,
  summaryText,
} from '@/lib/commonground/study';
import type {
  Activity,
  Category,
  Condition,
  GroupRule,
  Level,
  Participant,
  RoundResult,
  SessionSummary,
  Setting,
  SocialStyle,
  VetoReason,
} from '@/lib/commonground/types';

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
const STYLES = Object.keys(STYLE_LABELS) as SocialStyle[];
const VETO_REASONS: VetoReason[] = [
  'too expensive',
  'too far',
  'wrong vibe',
  'wrong timing',
  'not interested',
  'other',
];

type Stage =
  | 'setup'
  | 'prefs'
  | 'handoff'
  | 'results'
  | 'baseline'
  | 'survey'
  | 'between'
  | 'done';

const blankParticipant = (i: number): Participant => ({
  id: i,
  label: `Person ${i + 1}`,
  maxCost: 25,
  maxMinutes: 180,
  maxTravel: 2,
  settingNeed: 'no preference',
  interests: [],
  energy: 2,
  style: 'talk',
  vetoes: [],
  want: '',
});

/** A short, honest scale. */
function Scale({
  label,
  value,
  onChange,
  low,
  high,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  low: string;
  high: string;
}) {
  return (
    <fieldset className="cg-scale">
      <legend className="cg-field__label">{label}</legend>
      <div className="cg-scale__row">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className="cg-scale__btn"
            aria-pressed={value === n}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="cg-scale__ends">
        <span>{low}</span>
        <span>{high}</span>
      </p>
    </fieldset>
  );
}

export default function CommonGroundApp() {
  /* ---------------- session config ---------------- */
  const [groupSize, setGroupSize] = useState(4);
  const [studyMode, setStudyMode] = useState(false);
  const [twoRound, setTwoRound] = useState(false);
  const [condition, setCondition] = useState<Condition>('commonground');
  const [roundIndex, setRoundIndex] = useState(0);

  const [stage, setStage] = useState<Stage>('setup');
  const [sessionId] = useState(() => newSessionId());
  const [rounds, setRounds] = useState<RoundResult[]>([]);

  /* ---------------- round state ---------------- */
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [current, setCurrent] = useState(0);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [rules, setRules] = useState<GroupRule[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [shortlistSeen, setShortlistSeen] = useState<Set<string>>(new Set());
  const [vetoCount, setVetoCount] = useState(0);
  const [chosen, setChosen] = useState<Activity | null>(null);
  const [pendingVeto, setPendingVeto] = useState<{ id: string; name: string } | null>(null);
  /* baseline condition */
  const [baselineConsidered, setBaselineConsidered] = useState<Set<string>>(new Set());
  const [baselineRemoved, setBaselineRemoved] = useState<Set<string>>(new Set());

  const startedAt = useRef<number>(0);
  const [round, setRound] = useState<RoundResult | null>(null);

  const setId = roundIndex === 0 ? 'A' : 'B';
  const activities = ACTIVITY_SETS[setId].items;

  /* Provisional constraint relaxations the group is trying out. These layer
     on top of what people actually answered — the stated preferences are
     never edited, so Undo is just dropping one off the end. */
  const [relaxations, setRelaxations] = useState<Relaxation[]>([]);

  const effectiveParticipants = useMemo(
    () => applyRelaxations(participants, relaxations),
    [participants, relaxations],
  );

  const rankInput = useMemo(
    () => ({ activities, participants: effectiveParticipants, removedIds, rules }),
    [activities, effectiveParticipants, removedIds, rules],
  );

  const ranked = useMemo(
    () => (participants.length ? rank(rankInput) : null),
    [participants.length, rankInput],
  );

  const top3 = useMemo(() => ranked?.shortlist.slice(0, 3) ?? [], [ranked]);

  /* Diagnosis and relaxation search. Deterministic, and only run when the
     group is actually stuck or the best option is lopsided. */
  const resolution = useMemo(
    () => (participants.length ? resolveConflict(rankInput, relaxations) : null),
    [participants.length, rankInput, relaxations],
  );

  /* The panel also stays up once a relaxation has been applied, even when
     that resolved the conflict — otherwise applying a change unmounts the
     only route back to undoing it. */
  const showResolve =
    stage === 'results' &&
    resolution !== null &&
    (resolution.diagnosis.severity !== 'none' || relaxations.length > 0);

  const applyRelaxation = (r: Relaxation) => {
    setRelaxations((prev) => (prev.some((x) => x.id === r.id) ? prev : [...prev, r]));
    setLastUpdate(`Trying: ${r.sentence} Nothing was saved to anyone's answers.`);
  };
  const undoRelaxation = () => {
    setRelaxations((prev) => prev.slice(0, -1));
    setLastUpdate('Undid the last change. Back to what everyone actually said.');
  };
  const resetRelaxations = () => {
    setRelaxations([]);
    setLastUpdate('Cleared every provisional change.');
  };

  /* ---------------- flow ---------------- */

  const beginRound = (cond: Condition) => {
    setCondition(cond);
    setParticipants(Array.from({ length: groupSize }, (_, i) => blankParticipant(i)));
    setCurrent(0);
    setRemovedIds([]);
    setRules([]);
    setRelaxations([]);
    setLastUpdate(null);
    setShortlistSeen(new Set());
    setVetoCount(0);
    setChosen(null);
    setBaselineConsidered(new Set());
    setBaselineRemoved(new Set());
    setRound(emptyRound(cond, roundIndex === 0 ? 'A' : 'B', groupSize));
    startedAt.current = Date.now();
    setStage(cond === 'baseline' ? 'baseline' : 'prefs');
  };

  const startSession = () => {
    const first: Condition = studyMode
      ? condition
      : 'commonground';
    setRoundIndex(0);
    setRounds([]);
    beginRound(first);
  };

  const updateParticipant = (patch: Partial<Participant>) =>
    setParticipants((prev) =>
      prev.map((p, i) => (i === current ? { ...p, ...patch } : p)),
    );

  const finishParticipant = () => {
    if (current + 1 < participants.length) setStage('handoff');
    else {
      setStage('results');
      setShortlistSeen(new Set());
    }
  };

  /* record which options the group has actually been shown */
  const notedShortlist = useMemo(() => {
    if (stage !== 'results') return shortlistSeen;
    const next = new Set(shortlistSeen);
    top3.forEach((s) => next.add(s.activity.id));
    return next;
  }, [stage, top3, shortlistSeen]);

  const applyVeto = (reason: VetoReason) => {
    if (!pendingVeto) return;
    const activity = activities.find((a) => a.id === pendingVeto.id)!;
    const by = participants[Math.min(current, participants.length - 1)]?.label ?? 'Someone';
    const rule: GroupRule = {
      id: `${pendingVeto.id}-${reason}`,
      by,
      reason,
      activityId: activity.id,
      activityName: activity.name,
      effect: describeRule(reason, activity),
    };
    setRules((prev) => [...prev, rule]);
    setRemovedIds((prev) => [...prev, activity.id]);
    setVetoCount((n) => n + 1);
    setShortlistSeen(notedShortlist);
    setLastUpdate(
      reason === 'other'
        ? `Recommendations updated because ${by} rejected ${activity.name}.`
        : `Recommendations updated because ${by} rejected ${activity.name} — now down-ranking ${rule.effect}.`,
    );
    setPendingVeto(null);
  };

  const finishRound = (choice: Activity | null, considered: number, vetoes: number) => {
    setChosen(choice);
    setRound((r) =>
      r
        ? {
            ...r,
            timeToDecisionMs: Date.now() - startedAt.current,
            decisionReached: choice !== null,
            chosenActivityId: choice?.id ?? null,
            optionsConsidered: considered,
            vetoCount: vetoes,
          }
        : r,
    );
    setStage(studyMode ? 'survey' : 'done');
  };

  const submitSurvey = () => {
    if (!round) return;
    const finished = [...rounds, round];
    setRounds(finished);
    if (twoRound && finished.length === 1) {
      setStage('between');
    } else {
      setStage('done');
    }
  };

  const startSecondRound = () => {
    const next: Condition = condition === 'baseline' ? 'commonground' : 'baseline';
    setRoundIndex(1);
    /* beginRound reads roundIndex for the set id, so set it explicitly here */
    setCondition(next);
    setParticipants(Array.from({ length: groupSize }, (_, i) => blankParticipant(i)));
    setCurrent(0);
    setRemovedIds([]);
    setRules([]);
    setRelaxations([]);
    setLastUpdate(null);
    setShortlistSeen(new Set());
    setVetoCount(0);
    setChosen(null);
    setBaselineConsidered(new Set());
    setBaselineRemoved(new Set());
    setRound(emptyRound(next, 'B', groupSize));
    startedAt.current = Date.now();
    setStage(next === 'baseline' ? 'baseline' : 'prefs');
  };

  const resetAll = () => {
    setStage('setup');
    setRounds([]);
    setRound(null);
    setRoundIndex(0);
    setParticipants([]);
    setChosen(null);
    setStudyMode(false);
    setTwoRound(false);
    setCondition('commonground');
  };

  const summary: SessionSummary = {
    sessionId,
    createdAt: new Date().toISOString(),
    twoRound,
    rounds: round && stage === 'done' && !rounds.includes(round) ? [...rounds, round] : rounds,
  };

  const p = participants[current];

  /* ================= render ================= */

  return (
    <div className="cg">
      {/* ---------------- SETUP ---------------- */}
      {stage === 'setup' && (
        <div className="cg-panel">
          <h2 className="cg-h2">Start a group</h2>
          <p className="cg-lede">
            One phone, passed around. Each person answers privately, then the group sees where it
            actually overlaps.
          </p>

          <div className="cg-field">
            <span className="cg-field__label">How many people?</span>
            <div className="cg-chips">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="cg-chip"
                  aria-pressed={groupSize === n}
                  onClick={() => setGroupSize(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="cg-field">
            <label className="cg-toggle">
              <input
                type="checkbox"
                checked={studyMode}
                onChange={(e) => {
                  setStudyMode(e.target.checked);
                  if (!e.target.checked) setTwoRound(false);
                }}
              />
              <span>
                <strong>Study mode</strong> — record timing and a short questionnaire at the end
              </span>
            </label>
          </div>

          {studyMode && (
            <div className="cg-sub">
              <div className="cg-field">
                <span className="cg-field__label">Condition for this round</span>
                <div className="cg-chips">
                  <button
                    type="button"
                    className="cg-chip"
                    aria-pressed={condition === 'baseline'}
                    onClick={() => setCondition('baseline')}
                  >
                    A · Unstructured baseline
                  </button>
                  <button
                    type="button"
                    className="cg-chip"
                    aria-pressed={condition === 'commonground'}
                    onClick={() => setCondition('commonground')}
                  >
                    B · CommonGround
                  </button>
                  <button
                    type="button"
                    className="cg-chip"
                    onClick={() =>
                      setCondition(Math.random() < 0.5 ? 'baseline' : 'commonground')
                    }
                  >
                    Randomise
                  </button>
                </div>
              </div>
              <label className="cg-toggle">
                <input
                  type="checkbox"
                  checked={twoRound}
                  onChange={(e) => setTwoRound(e.target.checked)}
                />
                <span>
                  <strong>Two-round study</strong> — run the other condition afterwards on a
                  different activity set
                </span>
              </label>
              <p className="cg-note">
                Nothing is uploaded. No names, emails or demographics are collected — participants
                are Person 1 to Person {groupSize}.
              </p>
            </div>
          )}

          <button type="button" className="button button--primary" onClick={startSession}>
            {studyMode
              ? condition === 'baseline'
                ? 'Start baseline round'
                : 'Start CommonGround round'
              : 'Start'}{' '}
            <Arrow />
          </button>
        </div>
      )}

      {/* ---------------- PREFERENCES ---------------- */}
      {stage === 'prefs' && p && (
        <div className="cg-panel">
          <p className="cg-step">
            {p.label} of {participants.length} · answer privately
          </p>
          <h2 className="cg-h2">What would work for you?</h2>

          <div className="cg-grid2">
            <div className="cg-field">
              <label className="cg-field__label" htmlFor="cost">
                Most you want to spend — ${p.maxCost}
              </label>
              <input
                id="cost"
                type="range"
                min={0}
                max={60}
                step={5}
                value={p.maxCost}
                onChange={(e) => updateParticipant({ maxCost: Number(e.target.value) })}
              />
            </div>
            <div className="cg-field">
              <label className="cg-field__label" htmlFor="time">
                Time you have — {Math.floor(p.maxMinutes / 60)}h{' '}
                {p.maxMinutes % 60 ? `${p.maxMinutes % 60}m` : ''}
              </label>
              <input
                id="time"
                type="range"
                min={60}
                max={300}
                step={30}
                value={p.maxMinutes}
                onChange={(e) => updateParticipant({ maxMinutes: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="cg-field">
            <span className="cg-field__label">How far will you go?</span>
            <div className="cg-chips">
              {([1, 2, 3] as Level[]).map((n) => (
                <button
                  key={n}
                  type="button"
                  className="cg-chip"
                  aria-pressed={p.maxTravel === n}
                  onClick={() => updateParticipant({ maxTravel: n })}
                >
                  {TRAVEL_LABELS[n]}
                </button>
              ))}
            </div>
          </div>

          <div className="cg-field">
            <span className="cg-field__label">Indoors or outdoors?</span>
            <div className="cg-chips">
              {(['no preference', 'indoor', 'outdoor'] as (Setting | 'no preference')[]).map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    className="cg-chip"
                    aria-pressed={p.settingNeed === s}
                    onClick={() => updateParticipant({ settingNeed: s })}
                  >
                    {s === 'no preference' ? 'Either' : s === 'indoor' ? 'Indoors' : 'Outdoors'}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="cg-field">
            <span className="cg-field__label">
              What sounds good? Tap in order of preference.
            </span>
            <div className="cg-chips">
              {CATEGORIES.map((c) => {
                const idx = p.interests.indexOf(c);
                return (
                  <button
                    key={c}
                    type="button"
                    className="cg-chip"
                    aria-pressed={idx !== -1}
                    onClick={() =>
                      updateParticipant({
                        interests:
                          idx === -1
                            ? [...p.interests, c]
                            : p.interests.filter((x) => x !== c),
                        vetoes: p.vetoes.filter((x) => x !== c),
                      })
                    }
                  >
                    {idx !== -1 && <span className="cg-chip__rank">{idx + 1}</span>}
                    {CATEGORY_LABELS[c]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="cg-grid2">
            <div className="cg-field">
              <span className="cg-field__label">Energy today</span>
              <div className="cg-chips">
                {([1, 2, 3] as Level[]).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="cg-chip"
                    aria-pressed={p.energy === n}
                    onClick={() => updateParticipant({ energy: n })}
                  >
                    {ENERGY_LABELS[n]}
                  </button>
                ))}
              </div>
            </div>
            <div className="cg-field">
              <span className="cg-field__label">You mostly want to be…</span>
              <div className="cg-chips">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="cg-chip"
                    aria-pressed={p.style === s}
                    onClick={() => updateParticipant({ style: s })}
                  >
                    {STYLE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="cg-field">
            <span className="cg-field__label">
              Absolutely not — up to two. These are treated as hard nos, not low scores.
            </span>
            <div className="cg-chips">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="cg-chip cg-chip--veto"
                  aria-pressed={p.vetoes.includes(c)}
                  disabled={!p.vetoes.includes(c) && p.vetoes.length >= 2}
                  onClick={() =>
                    updateParticipant({
                      vetoes: p.vetoes.includes(c)
                        ? p.vetoes.filter((x) => x !== c)
                        : [...p.vetoes, c],
                      interests: p.interests.filter((x) => x !== c),
                    })
                  }
                >
                  {CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          <div className="cg-field">
            <label className="cg-field__label" htmlFor="want">
              Anything you actually want to do? (optional)
            </label>
            <input
              id="want"
              type="text"
              value={p.want}
              maxLength={80}
              placeholder="One line"
              onChange={(e) => updateParticipant({ want: e.target.value })}
            />
          </div>

          <button type="button" className="button button--primary" onClick={finishParticipant}>
            {current + 1 < participants.length ? 'Done — pass to next person' : 'Done — see results'}{' '}
            <Arrow />
          </button>
        </div>
      )}

      {/* ---------------- HANDOFF ---------------- */}
      {stage === 'handoff' && (
        <div className="cg-panel cg-panel--center">
          <h2 className="cg-h2">Pass the phone</h2>
          <p className="cg-lede">
            Hand it to <strong>Person {current + 2}</strong>. Nobody sees anyone else&rsquo;s
            answers until everyone has finished.
          </p>
          <button
            type="button"
            className="button button--primary"
            onClick={() => {
              setCurrent((c) => c + 1);
              setStage('prefs');
            }}
          >
            I&rsquo;m Person {current + 2} <Arrow />
          </button>
        </div>
      )}

      {/* ---------------- RESULTS ---------------- */}
      {stage === 'results' && ranked && (
        <div className="cg-results">
          {lastUpdate && (
            <p className="cg-update" role="status">
              {lastUpdate}
            </p>
          )}

          <div className="cg-grid2">
            <div className="cg-panel">
              <h3 className="cg-h3">Common ground</h3>
              {ranked.sharedInterests.length > 0 ? (
                <p className="cg-body">
                  Everyone listed{' '}
                  <strong>
                    {ranked.sharedInterests.map((c) => CATEGORY_LABELS[c].toLowerCase()).join(', ')}
                  </strong>
                  .
                </p>
              ) : (
                <p className="cg-body">
                  No category was picked by everyone — the overlap here is in the constraints rather
                  than the interests.
                </p>
              )}
              <p className="cg-body">
                Budget everyone clears: <strong>${Math.min(...participants.map((x) => x.maxCost))}</strong>
                . Time everyone has:{' '}
                <strong>
                  {Math.floor(Math.min(...participants.map((x) => x.maxMinutes)) / 60)}h
                </strong>
                .
              </p>
              {participants.some((x) => x.want.trim()) && (
                <ul className="cg-wants">
                  {participants
                    .filter((x) => x.want.trim())
                    .map((x) => (
                      <li key={x.id}>
                        <span className="cg-who">{x.label}</span> {x.want.trim()}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div className="cg-panel">
              <h3 className="cg-h3">Where you differ</h3>
              {ranked.conflicts.length === 0 ? (
                <p className="cg-body">Nothing is pulling in opposite directions.</p>
              ) : (
                <ul className="cg-conflicts">
                  {ranked.conflicts.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {top3.length === 0 ? (
            <div className="cg-results">
              {showResolve && resolution && (
                <ResolveConflict
                  resolution={resolution}
                  applied={relaxations}
                  onApply={applyRelaxation}
                  onUndo={undoRelaxation}
                  onReset={resetRelaxations}
                />
              )}
              <div className="cg-panel cg-panel--warn">
                <p className="cg-note">
                  {ranked.infeasible.length} option
                  {ranked.infeasible.length === 1 ? '' : 's'} removed by hard constraints,{' '}
                  {ranked.vetoed.length} blocked by a veto.
                </p>
                <button type="button" className="button" onClick={() => setStage('setup')}>
                  Start over
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="cg-h3 cg-h3--section">Three best options</h3>
              <ol className="cg-options">
                {top3.map((s, i) => (
                  <li className="cg-option" key={s.activity.id}>
                    <div className="cg-option__head">
                      <span className="cg-option__rank">{i + 1}</span>
                      <h4 className="cg-option__name">{s.activity.name}</h4>
                      <span className="cg-option__fit" title="Group fit">
                        {s.fit}
                        <span className="cg-option__fitlabel">group fit</span>
                      </span>
                    </div>

                    <dl className="cg-why">
                      <div>
                        <dt>Why it fits</dt>
                        <dd>
                          {s.withinBudget}/{participants.length} within budget ·{' '}
                          {s.withinTime}/{participants.length} have the time ·{' '}
                          {s.interested}/{participants.length} listed the category · no vetoes ·{' '}
                          {TRAVEL_LABELS[s.activity.travel].toLowerCase()}
                        </dd>
                      </div>
                      <div>
                        <dt>Who compromises</dt>
                        <dd>
                          {s.compromisers.length === 0
                            ? 'Nobody is notably below the group average on this one.'
                            : `${s.compromisers.join(', ')} — this is further from what they picked than it is for the others.`}
                        </dd>
                      </div>
                      {s.risks.length > 0 && (
                        <div>
                          <dt>Constraint risk</dt>
                          <dd>{s.risks.slice(0, 2).join(' · ')}</dd>
                        </div>
                      )}
                      <div>
                        <dt>Strongest shared reason</dt>
                        <dd>{s.sharedReason}</dd>
                      </div>
                    </dl>

                    <div className="cg-react">
                      <button
                        type="button"
                        className="button button--primary"
                        onClick={() =>
                          finishRound(s.activity, notedShortlist.size, vetoCount)
                        }
                      >
                        Love it — pick this
                      </button>
                      <button
                        type="button"
                        className="button button--quiet"
                        onClick={() => setShortlistSeen(notedShortlist)}
                      >
                        Maybe
                      </button>
                      <button
                        type="button"
                        className="button button--quiet"
                        onClick={() =>
                          setPendingVeto({ id: s.activity.id, name: s.activity.name })
                        }
                      >
                        Veto
                      </button>
                    </div>

                    {pendingVeto?.id === s.activity.id && (
                      <div className="cg-vetoreason">
                        <p className="cg-field__label">Why not this one?</p>
                        <div className="cg-chips">
                          {VETO_REASONS.map((r) => (
                            <button
                              key={r}
                              type="button"
                              className="cg-chip"
                              onClick={() => applyVeto(r)}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ol>

              {showResolve && resolution && (
                <ResolveConflict
                  resolution={resolution}
                  applied={relaxations}
                  onApply={applyRelaxation}
                  onUndo={undoRelaxation}
                  onReset={resetRelaxations}
                />
              )}

              <div className="cg-panel">
                <p className="cg-body">
                  <strong>CommonGround does not pick the highest average.</strong> An option one
                  person strongly rejects loses to an option everyone can live with, even when the
                  average would say otherwise. Ranking maximises the least satisfied person first,
                  then the group.
                </p>
                <p className="cg-note">
                  {ranked.infeasible.length} option
                  {ranked.infeasible.length === 1 ? '' : 's'} removed by hard constraints ·{' '}
                  {ranked.vetoed.length} blocked by a veto · {ranked.shortlist.length} still in play
                </p>
              </div>

              {rules.length > 0 && (
                <DeeperDetail summary="What the group has ruled out so far" hint="learning loop">
                  <ul className="cg-conflicts">
                    {rules.map((r) => (
                      <li key={r.id}>
                        <strong>{r.by}</strong> rejected {r.activityName} ({r.reason}) — now
                        down-ranking {r.effect}.
                      </li>
                    ))}
                  </ul>
                </DeeperDetail>
              )}

              <button
                type="button"
                className="button button--quiet"
                onClick={() => finishRound(null, notedShortlist.size, vetoCount)}
              >
                We couldn&rsquo;t agree — end without a decision
              </button>
            </>
          )}
        </div>
      )}

      {/* ---------------- BASELINE CONDITION ---------------- */}
      {stage === 'baseline' && (
        <div className="cg-results">
          <div className="cg-panel">
            <h2 className="cg-h2">Decide as a group</h2>
            <p className="cg-lede">
              Here is the same list of options. Talk it over and pick one however you normally
              would. Tick anything you seriously consider; cross off anything you rule out.
            </p>
            <p className="cg-note">
              Condition A · unstructured baseline. Timing starts when this screen opens.
            </p>
          </div>

          <ul className="cg-baselist">
            {activities.map((a) => (
              <li key={a.id} className={baselineRemoved.has(a.id) ? 'is-out' : undefined}>
                <div className="cg-baselist__main">
                  <span className="cg-baselist__name">{a.name}</span>
                  <span className="cg-baselist__meta">
                    {CATEGORY_LABELS[a.category]} · ${a.cost} · {Math.round(a.duration / 60)}h ·{' '}
                    {ENERGY_LABELS[a.energy].toLowerCase()} energy
                  </span>
                </div>
                <div className="cg-baselist__acts">
                  <button
                    type="button"
                    className="cg-chip"
                    aria-pressed={baselineConsidered.has(a.id)}
                    onClick={() =>
                      setBaselineConsidered((prev) => {
                        const next = new Set(prev);
                        if (next.has(a.id)) next.delete(a.id);
                        else next.add(a.id);
                        return next;
                      })
                    }
                  >
                    Considering
                  </button>
                  <button
                    type="button"
                    className="cg-chip cg-chip--veto"
                    aria-pressed={baselineRemoved.has(a.id)}
                    onClick={() =>
                      setBaselineRemoved((prev) => {
                        const next = new Set(prev);
                        if (next.has(a.id)) next.delete(a.id);
                        else next.add(a.id);
                        return next;
                      })
                    }
                  >
                    Ruled out
                  </button>
                  <button
                    type="button"
                    className="button button--quiet"
                    onClick={() =>
                      finishRound(a, baselineConsidered.size, baselineRemoved.size)
                    }
                  >
                    Choose this
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="button button--quiet"
            onClick={() => finishRound(null, baselineConsidered.size, baselineRemoved.size)}
          >
            We couldn&rsquo;t agree — end without a decision
          </button>
        </div>
      )}

      {/* ---------------- SURVEY ---------------- */}
      {stage === 'survey' && round && (
        <div className="cg-panel">
          <h2 className="cg-h2">Four quick questions</h2>
          <p className="cg-lede">
            Answer as a group, out loud. This is the only thing recorded besides timing.
          </p>

          <Scale
            label="How confident are you the group chose something everyone can live with?"
            value={round.confidence}
            onChange={(v) => setRound((r) => (r ? { ...r, confidence: v } : r))}
            low="Not confident"
            high="Very confident"
          />
          <Scale
            label="How fair did the process feel?"
            value={round.fairness}
            onChange={(v) => setRound((r) => (r ? { ...r, fairness: v } : r))}
            low="Unfair"
            high="Very fair"
          />
          <Scale
            label="How frustrating was the coordination?"
            value={round.frustration}
            onChange={(v) => setRound((r) => (r ? { ...r, frustration: v } : r))}
            low="Not at all"
            high="Very"
          />
          <Scale
            label="How satisfied are you with how you got there?"
            value={round.satisfaction}
            onChange={(v) => setRound((r) => (r ? { ...r, satisfaction: v } : r))}
            low="Not satisfied"
            high="Very satisfied"
          />

          <div className="cg-field">
            <span className="cg-field__label">
              Would you use this for another group decision?
            </span>
            <div className="cg-chips">
              {(['yes', 'maybe', 'no'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className="cg-chip"
                  aria-pressed={round.reuse === v}
                  onClick={() => setRound((r) => (r ? { ...r, reuse: v } : r))}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="cg-field">
            <label className="cg-field__label" htmlFor="comment">
              What was annoying or useful? (optional)
            </label>
            <textarea
              id="comment"
              value={round.comment}
              maxLength={400}
              onChange={(e) => setRound((r) => (r ? { ...r, comment: e.target.value } : r))}
            />
          </div>

          <button type="button" className="button button--primary" onClick={submitSurvey}>
            Save this round <Arrow />
          </button>
        </div>
      )}

      {/* ---------------- BETWEEN ROUNDS ---------------- */}
      {stage === 'between' && (
        <div className="cg-panel cg-panel--center">
          <h2 className="cg-h2">Round 1 saved</h2>
          <p className="cg-lede">
            Round 2 uses the <strong>other</strong> condition and a{' '}
            <strong>different activity set</strong>, so the group is not re-deciding between options
            it has already argued about.
          </p>
          <button type="button" className="button button--primary" onClick={startSecondRound}>
            Start round 2 —{' '}
            {condition === 'baseline' ? 'CommonGround' : 'unstructured baseline'} <Arrow />
          </button>
        </div>
      )}

      {/* ---------------- DONE ---------------- */}
      {stage === 'done' && (
        <div className="cg-results">
          <div className="cg-panel">
            <h2 className="cg-h2">
              {chosen ? `You picked ${chosen.name}` : 'No decision this time'}
            </h2>
            {!studyMode && (
              <p className="cg-lede">
                {chosen
                  ? 'That is the whole loop: private preferences in, overlap and conflict made visible, three explainable options out.'
                  : 'Ending without a decision is a real outcome, and worth recording as one.'}
              </p>
            )}
          </div>

          {studyMode && summary.rounds.length > 0 && (
            <>
              {summary.rounds.length === 2 && (
                <div className="cg-panel">
                  <h3 className="cg-h3">Round comparison</h3>
                  <div className="table-wrap">
                    <table className="table">
                      <caption className="cg-caption">
                        Two rounds with one group. This is a single session, not a result —
                        differences here are not evidence of anything on their own.
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Measure</th>
                          {summary.rounds.map((r, i) => (
                            <th scope="col" key={i}>
                              {r.condition === 'baseline' ? 'Baseline' : 'CommonGround'}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          [
                            ['Time to decision', (r: RoundResult) => r.timeToDecisionMs === null ? '—' : `${Math.round(r.timeToDecisionMs / 1000)}s`],
                            ['Decision reached', (r: RoundResult) => (r.decisionReached ? 'yes' : 'no')],
                            ['Options considered', (r: RoundResult) => r.optionsConsidered],
                            ['Vetoes / removals', (r: RoundResult) => r.vetoCount],
                            ['Confidence', (r: RoundResult) => r.confidence ?? '—'],
                            ['Fairness', (r: RoundResult) => r.fairness ?? '—'],
                            ['Frustration', (r: RoundResult) => r.frustration ?? '—'],
                            ['Satisfaction', (r: RoundResult) => r.satisfaction ?? '—'],
                          ] as [string, (r: RoundResult) => React.ReactNode][]
                        ).map(([label, get]) => (
                          <tr key={label}>
                            <td>{label}</td>
                            {summary.rounds.map((r, i) => (
                              <td key={i}>{get(r)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="cg-panel">
                <h3 className="cg-h3">Session record</h3>
                <p className="cg-note">
                  Session {summary.sessionId}. Nothing is uploaded automatically. No names, emails
                  or demographics are in this record.
                </p>
                <pre className="cg-pre">{summaryText(summary)}</pre>
                <div className="cg-actions">
                  <button
                    type="button"
                    className="button button--primary"
                    onClick={() => navigator.clipboard?.writeText(summaryText(summary))}
                  >
                    Copy study result
                  </button>
                  <a
                    className="button"
                    href={mailtoHref(summary, 'isabella.bider@gmail.com')}
                  >
                    Email result
                  </a>
                  <button
                    type="button"
                    className="button button--quiet"
                    onClick={() =>
                      download(
                        `commonground-${summary.sessionId}.json`,
                        summaryJson(summary),
                        'application/json',
                      )
                    }
                  >
                    Download JSON
                  </button>
                  <button
                    type="button"
                    className="button button--quiet"
                    onClick={() =>
                      download(
                        `commonground-${summary.sessionId}.csv`,
                        summaryCsv(summary),
                        'text/csv',
                      )
                    }
                  >
                    Download CSV
                  </button>
                </div>
              </div>
            </>
          )}

          <button type="button" className="button button--quiet" onClick={resetAll}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
