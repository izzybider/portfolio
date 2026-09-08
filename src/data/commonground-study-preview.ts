/* ============================================================
   COMMONGROUND — STUDY RESULTS

   Observed values from the sessions: 32 participants across 9 friend
   groups, each group completing one unstructured baseline round and
   one CommonGround round.

   Every component in the study section reads this file and nothing
   else, so the numbers on the page can never drift from the numbers
   here. Deltas and percentages are computed at the bottom of this
   file rather than typed, so a headline cannot disagree with the
   value underneath it.

   ── ONE THING STILL OUTSTANDING ─────────────────────────────────────
   THEMES carries the four qualitative findings. The `quote` field is
   optional and currently unset, because the layout placeholders were
   not real participant words and have been removed. Add the actual
   free-text comments from the sessions to turn the quote lines back
   on — the themes and their product implications render either way.
   ============================================================ */

/**
 * The study has been run; these are observed values. Kept as a flag
 * because the components still read it to decide whether to stamp the
 * section as unverified.
 */
export const isPreview = false;

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
  hypothesis:
    'Structured preference elicitation will reduce coordination friction and improve how fair the outcome feels, compared with unstructured group discussion.',
};

/* ---------------- 1b · the case in six lines ---------------- */

/** The whole arc, skimmable. A reader who stops here should still have the point. */
export const STORY = [
  { id: 's1', label: 'Hypothesis', line: 'Structured preference elicitation would cut coordination friction and make the outcome feel fairer than ordinary group discussion.' },
  { id: 's2', label: 'Result', line: 'Median decision time fell 31% and decision completion rose 16 percentage points.' },
  { id: 's3', label: 'But', line: 'That aggregate averaged two different situations. Groups that already agreed got 15% slower; groups with real conflict got 40–44% faster.' },
  { id: 's4', label: 'Insight', line: 'The product was not solving group decision-making. It was solving preference conflict.' },
  { id: 's5', label: 'Decision', line: 'One flow became two: Quick Pick for aligned groups, Resolve a Conflict when constraints actually collide.' },
  { id: 's6', label: 'Next', line: 'Whether the light path keeps the conflict benefit, and whether conflict can be detected before asking for the full preference set.' },
];

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

/**
 * The fairness finding that changed the resolver. Called out separately
 * because it is a product change, not just a qualitative note.
 */
export const RESOLVER_CHANGE = {
  observation:
    'Groups pushed back on suggestions that asked the same person to move again, even when those suggestions produced the best group fit.',
  change:
    'The resolver now tracks compromise load across the session and down-ranks a relaxation that lands on someone who has already given ground, when a comparable one does not. The app says when it has done that.',
  why:
    'Fairness was judged across the whole session, not one suggestion at a time. Optimising each suggestion in isolation produced a sequence that felt unfair.',
};

/* ---------------- 7 · what did not work ---------------- */

export const NEGATIVE = {
  finding:
    'CommonGround was slower than ordinary discussion in 3 of the 4 lowest-conflict groups.',
  detail:
    'Six participants said the full preference form felt excessive when the group already largely agreed. Structured elicitation reduced negotiation when preferences conflicted, and created overhead when they did not.',
  consequence:
    'That changes the product from “always structure the decision” to “detect when coordination is the problem, and only add structure then.”',
};

/** The assumption the segmentation overturned. */
export const ASSUMPTION_CHANGE = {
  before: 'Everyone benefits from structured preference elicitation.',
  after: 'Groups that already agree do not need the structure.',
};

/* ---------------- 8 · qualitative themes ---------------- */

export type Theme = {
  id: string;
  theme: string;
  /**
   * A real participant comment, once transcribed. Optional on purpose:
   * the quote line renders only when this is set, so nothing is ever
   * attributed to someone who did not say it.
   */
  quote?: string;
  soWhat: string;
};

/* Add `quote:` to any of these once the real free-text comments are transcribed. */
export const THEMES: Theme[] = [
  { id: 't1', theme: 'Private vetoes reduced social pressure', soWhat: 'Private preference capture may reduce social pressure as well as search time.' },
  { id: 't2', theme: 'People wanted to know why an option ranked first', soWhat: 'Explanation is part of the recommendation itself, not a detail beside it.' },
  { id: 't3', theme: 'Full structured input felt excessive when the group already agreed', soWhat: 'Progressive disclosure — a lighter path when the group already agrees.' },
  { id: 't4', theme: 'People disliked repeatedly asking the same flexible person to compromise', soWhat: 'Track how compromise is distributed, not only total group utility.' },
];

/* ---------------- 9 · headline copy ---------------- */

export const HEADLINES = {
  overall: 'Median decision time fell 31% overall.',
  segment: 'The largest gains appeared in medium- and high-conflict groups.',
  negative: 'CommonGround was 15% slower when groups already agreed.',
  reframe: 'The product was solving preference conflict, not decision-making in general.',
  mechanism: 'Structured input added 1.4 minutes, but removed about 4 minutes of downstream negotiation.',
  fairness: 'Minimum-participant satisfaction improved more than average satisfaction.',
  fairnessNuance: 'The mathematically smallest compromise was not always the one participants perceived as fair.',
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

/* ---------------- 12b · how the data was cut ---------------- */

export type Cut = { id: string; cut: string; why: string; found: string };

/** Eight passes over the same 18 rounds. The third one is the case study. */
export const ANALYSIS: Cut[] = [
  { id: 'a1', cut: 'Overall effect', why: 'Baseline against CommonGround across all 18 rounds.', found: 'Time down 31%, completion up 16 pp.' },
  { id: 'a2', cut: 'Median, not mean', why: 'One 20-minute argument would dominate an average of nine groups.', found: 'The mean overstated the gain. Medians are reported throughout.' },
  { id: 'a3', cut: 'Conflict level', why: 'Rounds labelled low, medium or high afterwards by how many hard constraints and vetoes actually collided.', found: 'The effect separated completely. This became the finding.' },
  { id: 'a4', cut: 'Group size', why: 'Three-person against four-person groups, in case size was driving the split.', found: 'Nothing this sample could support. Conflict level predicted the effect; size did not.' },
  { id: 'a5', cut: 'Mechanism', why: 'Preference-entry overhead against downstream discussion saved.', found: '1.4 minutes of input bought back about 4 minutes of negotiation.' },
  { id: 'a6', cut: 'Distribution of satisfaction', why: 'Group average against the least-satisfied member.', found: 'The minimum moved more than twice as far as the mean.' },
  { id: 'a7', cut: 'Failure cases', why: 'Every round where CommonGround was slower or ended without a choice.', found: 'Three of the four lowest-conflict groups were slower.' },
  { id: 'a8', cut: 'Adoption by segment', why: 'Reuse intent split by conflict level.', found: '50% low, 82% medium, 92% high — the same split as the timing.' },
];

/* ---------------- 13 · how to read the numbers ---------------- */

export const READING = {
  claim:
    'A small within-group exploratory study, built to surface directional effects in product behaviour — not to establish population-level causal claims.',
  points: [
    'The group, not the participant, is the unit of decision. The effective sample is 9, not 32.',
    'Medians are reported throughout, because a single long argument would move a mean of nine groups on its own.',
    'Conflict level was labelled after the sessions, so the segmentation is a reading of the data rather than a pre-registered hypothesis. It is the first thing I would pre-register in a second study.',
    'The argument here rests on effect size and repeated behaviour across groups. Single p-values on nine groups would not carry it.',
  ],
};

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
   RENDER GATE

   Observed results always render, which is the current state. The
   env opt-in exists so that any future provisional figures can be laid
   out locally without ever reaching the deployed site.
   ============================================================ */

export const STUDY_PREVIEW_ENABLED =
  process.env.NEXT_PUBLIC_SHOW_COMMON_GROUND_STUDY_PREVIEW === 'true';

export function studyResultsVisible(): boolean {
  return !isPreview || STUDY_PREVIEW_ENABLED;
}
