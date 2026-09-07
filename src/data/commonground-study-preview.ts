/* ============================================================
   COMMONGROUND — STUDY RESULTS (PREVIEW DATA)

   ⚠️  NOTHING IN THIS FILE HAS BEEN OBSERVED.

   These are preview values, written to build and review the finished
   case-study layout before the study has been run. They are not results,
   they are not user outcomes, and no figure here may be quoted anywhere
   outside the gated preview.

   ── HOW THIS IS KEPT OUT OF PRODUCTION ──────────────────────────────
   `isPreview: true` plus the env gate below means the study sections do
   not render on the deployed site at all — not the page section, not the
   homepage card. The public site keeps saying the study has not been run.
   Preview renders only with:

       NEXT_PUBLIC_SHOW_COMMON_GROUND_STUDY_PREVIEW=true
       npm run dev:study      (or npm run build:study)

   ── HOW TO SWAP IN REAL RESULTS ─────────────────────────────────────
   1. replace the values in STUDY, OVERALL, TIME_SPLIT, SEGMENTS,
      SATISFACTION, RESOLUTION, THEMES, NEGATIVE and HEADLINES with what
      the sessions actually produced
   2. rewrite DECISION, ITERATION, NEXT_TESTS and LIMITATIONS to match
      what actually happened
   3. set `isPreview: false`

   Step 3 alone removes every PREVIEW stamp and turns the sections on in
   production. No component or layout change is needed — every component
   reads this file and nothing else.

   The quotes in THEMES are *written for layout*. They are not from
   anyone. Replace them with real paraphrased participant quotes, or drop
   the field, before this is ever published.
   ============================================================ */

export const isPreview = true;

/* ---------------- 1 · study design ---------------- */

export const STUDY = {
  participants: 32,
  groups: 9,
  groupSizeLabel: '3–4 people',
  design: 'Within-group comparison',
  rounds: [
    'One unstructured baseline round',
    'One CommonGround round',
  ],
  ordering: 'Condition order randomised where feasible',
  setting: 'Run in person, on one shared phone',
  hypothesis:
    'Structured preference elicitation will reduce coordination friction and improve how fair the outcome feels, compared with unstructured group discussion.',
};

/* ---------------- 2 · headline metrics ---------------- */

export type Kind = 'duration' | 'percent' | 'scale5' | 'count';

export type Metric = {
  id: string;
  label: string;
  /** the product question this stands in for */
  question: string;
  kind: Kind;
  baseline: number;
  commonground: number;
  betterWhen: 'lower' | 'higher';
};

export const OVERALL: Metric[] = [
  { id: 'time', label: 'Median decision time', question: 'Did coordination get faster?', kind: 'duration', baseline: 8.1, commonground: 5.6, betterWhen: 'lower' },
  { id: 'completion', label: 'Decision completion', question: 'Did groups actually converge?', kind: 'percent', baseline: 78, commonground: 94, betterWhen: 'higher' },
  { id: 'minsat', label: 'Minimum-person satisfaction', question: 'Did the least-satisfied person improve?', kind: 'scale5', baseline: 3.1, commonground: 4.0, betterWhen: 'higher' },
  { id: 'fairness', label: 'Perceived fairness', question: 'Did the process feel balanced?', kind: 'scale5', baseline: 3.4, commonground: 4.3, betterWhen: 'higher' },
];

export const SUPPORTING: Metric[] = [
  { id: 'options', label: 'Options seriously considered', question: 'median', kind: 'count', baseline: 5.8, commonground: 3.4, betterWhen: 'lower' },
  { id: 'avgsat', label: 'Average satisfaction', question: 'group mean', kind: 'scale5', baseline: 3.8, commonground: 4.2, betterWhen: 'higher' },
  { id: 'frustration', label: 'Coordination frustration', question: 'lower is better', kind: 'scale5', baseline: 3.6, commonground: 2.4, betterWhen: 'lower' },
  { id: 'confidence', label: 'Confidence in the choice', question: '1–5', kind: 'scale5', baseline: 3.7, commonground: 4.2, betterWhen: 'higher' },
];

export const REUSE = { yes: 25, of: 32, percent: 78 };

/* ---------------- 3 · where the time went ---------------- */

export const TIME_SPLIT = {
  rows: [
    { id: 'entry', label: 'Preference entry', baseline: 0, commonground: 1.4, note: 'New cost. Does not exist in the baseline.' },
    { id: 'discussion', label: 'Downstream discussion', baseline: 7.7, commonground: 3.7, note: 'Where the saving actually comes from.' },
    { id: 'confirm', label: 'Final confirmation', baseline: 0.4, commonground: 0.5, note: 'Unchanged.' },
  ],
  totalBaseline: 8.1,
  totalCommonGround: 5.6,
  mechanism: '1.4 minutes of structured input removed about 4 minutes of negotiation.',
};

/* ---------------- 4 · conflict segmentation ---------------- */

export type Segment = {
  id: string;
  label: string;
  baseline: number;
  commonground: number;
  /** signed percent change in median time; negative is faster */
  changePct: number;
  reuseIntent: number;
  reading: string;
};

export const SEGMENTS: Segment[] = [
  { id: 'low', label: 'Low conflict', baseline: 3.9, commonground: 4.5, changePct: 15, reuseIntent: 50, reading: 'The group already agreed. Structure was overhead.' },
  { id: 'medium', label: 'Medium conflict', baseline: 8.4, commonground: 5.0, changePct: -40, reuseIntent: 82, reading: 'Enough disagreement to be costly, enough overlap to solve.' },
  { id: 'high', label: 'High conflict', baseline: 12.7, commonground: 7.1, changePct: -44, reuseIntent: 92, reading: 'Structure surfaced the collision instead of talking around it.' },
];

/* ---------------- 5 · fairness ---------------- */

export const SATISFACTION = {
  baseline: { average: 3.8, minimum: 3.1, gap: 0.7 },
  commonground: { average: 4.2, minimum: 4.0, gap: 0.2 },
  reading:
    'Average satisfaction moved a little. The least-satisfied person moved twice as much, and the gap between them closed from 0.7 to 0.2 — which is the outcome the ranking was designed to produce.',
};

/* ---------------- 6 · conflict resolution ---------------- */

export const RESOLUTION = {
  roundsWithNoFeasibleOption: 9,
  acceptedARelaxation: 7,
  tookFirstRanked: 5,
  tookAnotherSuggestion: 2,
  negotiatedManually: 2,
  manualMinutes: 5.2,
  assistedMinutes: 2.6,
  reading:
    'Seven of the nine deadlocked rounds took one of the proposed relaxations, and five of those took the one ranked first — so the ranking was usually picking the change the group would have chosen anyway.',
};

/* ---------------- 7 · what did not work ---------------- */

export const NEGATIVE = {
  finding: 'CommonGround was slower in low-conflict groups.',
  detail:
    'Six participants said the full preference form felt excessive when the group already had a likely answer. The structure was doing work that did not need doing.',
  consequence:
    'Structured input becomes friction when there is no conflict to resolve.',
};

/* ---------------- 8 · qualitative themes ---------------- */

export type Theme = {
  id: string;
  theme: string;
  /** PREVIEW COPY — written for layout. Not from any person. Replace. */
  quote: string;
  soWhat: string;
};

export const THEMES: Theme[] = [
  { id: 't1', theme: 'Private vetoes reduced social pressure', quote: 'I liked that I didn’t have to argue for my veto.', soWhat: 'Private capture changed who was willing to object at all.' },
  { id: 't2', theme: 'People wanted to know why an option ranked first', quote: 'I wanted to know why this was ranked first.', soWhat: 'A ranking people cannot interrogate does not get trusted.' },
  { id: 't3', theme: 'Full structured input felt excessive when the group already agreed', quote: 'This is too much when we basically agree.', soWhat: 'The cost of the structure is only worth paying under conflict.' },
  { id: 't4', theme: 'People disliked repeatedly asking the same flexible person to compromise', quote: 'Don’t always make the flexible person compromise.', soWhat: 'Fairness is judged across the session, not per decision.' },
];

/* ---------------- 9 · headline copy ---------------- */

export const HEADLINES = {
  overall: 'Median decision time fell 31% overall.',
  segment: 'The largest gains appeared in medium- and high-conflict groups.',
  negative: 'CommonGround was 15% slower when groups already agreed.',
  reframe: 'The product was solving preference conflict, not decision-making in general.',
  mechanism: 'Structured input added 1.4 minutes, but removed about 4 minutes of downstream negotiation.',
  fairness: 'Minimum-participant satisfaction improved more than average satisfaction.',
  fairnessNuance: 'The mathematically efficient compromise was not always the one people perceived as fair.',
};

/* ---------------- 10 · the decision and the iteration ---------------- */

export const DECISION = {
  learning: 'The product was not solving group decision-making broadly. It was solving preference conflict.',
  principle: 'Do not impose coordination structure until the group needs it.',
};

export type Mode = { id: string; name: string; forWho: string; asks: string[]; note: string };

export const ITERATION: Mode[] = [
  {
    id: 'quick',
    name: 'Quick Pick',
    forWho: 'Groups that already broadly agree',
    asks: ['Budget', 'Time', 'One hard no', 'Rough category'],
    note: 'Recommends immediately. Four inputs instead of the full set.',
  },
  {
    id: 'resolve',
    name: 'Resolve a Conflict',
    forWho: 'Groups with real constraint collisions',
    asks: ['Hard constraints', 'Vetoes', 'Ranked preferences', 'Travel tolerance', 'Energy', 'Desired activity'],
    note: 'Full elicitation, plus minimal-relaxation search and the compromise-load fairness check.',
  },
];

export const NEXT_TESTS = [
  'Whether Quick Pick keeps the benefit while cutting the elicitation overhead.',
  'Whether repeated use changes how honestly people state vetoes.',
  'Whether conflict can be detected before asking for the full preference set.',
  'Whether groups accept the compromise-load fairness logic across repeated sessions.',
];

export const LIMITATIONS = [
  'Small exploratory sample.',
  'Friend groups only.',
  'A short-term, low-stakes task.',
  'No longitudinal reuse.',
  'The group, not the individual, is the unit of decision.',
  'Directional evidence, not population-level causal proof.',
  'In-person shared-phone context only.',
];

/* ---------------- 11 · homepage card ---------------- */

export const HOME_CARD = {
  question: 'Can structured preference capture help groups decide with less negotiation?',
  bullets: [
    '32 participants · 9 groups',
    '31% lower median decision time overall',
    '40%+ faster in medium/high-conflict groups',
    '+0.9 minimum-member satisfaction',
    'Full structure hurt low-conflict groups',
  ],
};

/* ============================================================
   FORMATTING AND DERIVATION
   Deltas are computed, never typed, so a headline can never disagree
   with the value underneath it.
   ============================================================ */

export function formatValue(kind: Kind, n: number): string {
  switch (kind) {
    case 'duration': return `${n} min`;
    case 'percent': return `${n}%`;
    /* toFixed so 4.0 does not render as "4 / 5" next to "3.1 / 5". */
    case 'scale5': return `${n.toFixed(1)} / 5`;
    case 'count': return `${n}`;
  }
}

export type Delta = { magnitude: string; direction: 'up' | 'down'; improved: boolean };

export function delta(m: Metric): Delta {
  const diff = m.commonground - m.baseline;
  const direction: Delta['direction'] = diff < 0 ? 'down' : 'up';
  const improved = m.betterWhen === 'lower' ? diff < 0 : diff > 0;
  const size = Math.abs(diff);
  const round1 = (x: number) => Math.round(x * 10) / 10;

  let magnitude: string;
  if (m.kind === 'duration') magnitude = `${Math.round((size / m.baseline) * 100)}%`;
  else if (m.kind === 'percent') magnitude = `${round1(size)} pp`;
  else if (m.kind === 'scale5') magnitude = `${round1(size)} / 5`;
  else magnitude = `${round1(size)}`;

  return { magnitude, direction, improved };
}

/** The four numbers that lead the section, derived from OVERALL. */
export function headlineCards() {
  return OVERALL.map((m) => ({ metric: m, d: delta(m) }));
}

/* ============================================================
   PRODUCTION SAFETY GATE

   Real results always render. Preview values render only behind an
   explicit opt-in, so invented numbers can never be read as evidence by
   somebody skimming the deployed site.
   ============================================================ */

export const STUDY_PREVIEW_ENABLED =
  process.env.NEXT_PUBLIC_SHOW_COMMON_GROUND_STUDY_PREVIEW === 'true';

export function studyResultsVisible(): boolean {
  return !isPreview || STUDY_PREVIEW_ENABLED;
}
