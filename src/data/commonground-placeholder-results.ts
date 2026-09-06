/* ============================================================
   COMMONGROUND — RESULTS DATA

   Every number the results section renders comes from this file, and
   nothing here has been observed. `isPlaceholder: true` means the values
   below are invented to design the layout, and the UI says so on every
   block it draws from them.

   To publish real results later:
     1. replace the numbers in RAW with what the sessions actually produced
     2. fill in `sampleSize`
     3. rewrite `insight`, `mixedFinding` and `loop` to match what happened
     4. set `isPlaceholder: false`

   Step 4 does two things on its own: it removes every ILLUSTRATIVE label
   and placeholder disclosure, and it makes the section render on the
   deployed site. While `isPlaceholder` is true the section is hidden in
   production and only appears with NEXT_PUBLIC_SHOW_CG_PLACEHOLDER=true
   (npm run dev:results). See resultsAreVisible() at the bottom.

   No layout change is needed for any of that.
   ============================================================ */

export type MetricKind = 'duration' | 'percent' | 'scale5' | 'count';

/* ---------------- the raw values ---------------- */

/**
 * Flat and named so they can be swapped one line at a time. Everything
 * below is derived from these — including the deltas on the result cards,
 * which are computed, never typed in.
 */
export const RAW = {
  /** minutes, median */
  medianDecisionTimeBaseline: 8.4,
  medianDecisionTimeCommonGround: 4.9,

  /** percent of rounds that ended in a chosen option */
  completionBaseline: 72,
  completionCommonGround: 94,

  /** 1-5, the least satisfied person in the group */
  minSatisfactionBaseline: 3.2,
  minSatisfactionCommonGround: 4.1,

  /** 1-5, group average — kept for the fairness comparison */
  avgSatisfactionBaseline: 3.8,
  avgSatisfactionCommonGround: 4.3,

  /** 1-5 */
  fairnessBaseline: 3.5,
  fairnessCommonGround: 4.3,

  /** 1-5, lower is better */
  frustrationBaseline: 3.8,
  frustrationCommonGround: 2.3,

  /** median count of distinct options weighed */
  optionsConsideredBaseline: 6,
  optionsConsideredCommonGround: 3,

  /** percent of rounds where a veto blocked the leading option */
  vetoConflictBaseline: 18,
  vetoConflictCommonGround: 4,

  /** median rounds of back-and-forth before the group converged */
  convergenceRoundsBaseline: 5,
  convergenceRoundsCommonGround: 2,

  /** single-sided: percent answering yes */
  reuseIntent: 79,
  /** single-sided: percent of rounds where the top option was taken */
  recommendationAcceptance: 74,

  /** minutes, median, split by how much the group disagreed */
  lowConflictBaseline: 4.1,
  lowConflictCommonGround: 3.6,
  moderateConflictBaseline: 9.2,
  moderateConflictCommonGround: 4.8,
  highConflictBaseline: 12.6,
  highConflictCommonGround: 9.8,
} as const;

/* ---------------- metric definitions ---------------- */

export type ComparisonMetric = {
  id: string;
  label: string;
  /** the product question the metric is standing in for */
  question: string;
  kind: MetricKind;
  baseline: number;
  commonground: number;
  betterWhen: 'lower' | 'higher';
};

export type SingleMetric = {
  id: string;
  label: string;
  question: string;
  value: number;
  kind: MetricKind;
};

/** The four that carry the section. */
export const PRIMARY: ComparisonMetric[] = [
  {
    id: 'time',
    label: 'Time to decision',
    question: 'Did coordination get faster?',
    kind: 'duration',
    baseline: RAW.medianDecisionTimeBaseline,
    commonground: RAW.medianDecisionTimeCommonGround,
    betterWhen: 'lower',
  },
  {
    id: 'completion',
    label: 'Decision completion',
    question: 'Did groups actually converge?',
    kind: 'percent',
    baseline: RAW.completionBaseline,
    commonground: RAW.completionCommonGround,
    betterWhen: 'higher',
  },
  {
    id: 'min-satisfaction',
    label: 'Minimum-participant satisfaction',
    question: 'Did the least-satisfied person improve?',
    kind: 'scale5',
    baseline: RAW.minSatisfactionBaseline,
    commonground: RAW.minSatisfactionCommonGround,
    betterWhen: 'higher',
  },
  {
    id: 'fairness',
    label: 'Perceived fairness',
    question: 'Did the process feel balanced?',
    kind: 'scale5',
    baseline: RAW.fairnessBaseline,
    commonground: RAW.fairnessCommonGround,
    betterWhen: 'higher',
  },
];

/** Supporting, deliberately quieter. */
export const SECONDARY: ComparisonMetric[] = [
  {
    id: 'options',
    label: 'Options considered',
    question: 'median',
    kind: 'count',
    baseline: RAW.optionsConsideredBaseline,
    commonground: RAW.optionsConsideredCommonGround,
    betterWhen: 'lower',
  },
  {
    id: 'veto',
    label: 'Veto-conflict rate',
    question: 'of rounds',
    kind: 'percent',
    baseline: RAW.vetoConflictBaseline,
    commonground: RAW.vetoConflictCommonGround,
    betterWhen: 'lower',
  },
  {
    id: 'rounds',
    label: 'Back-and-forth rounds',
    question: 'median, before converging',
    kind: 'count',
    baseline: RAW.convergenceRoundsBaseline,
    commonground: RAW.convergenceRoundsCommonGround,
    betterWhen: 'lower',
  },
  {
    id: 'frustration',
    label: 'Coordination frustration',
    question: 'lower is better',
    kind: 'scale5',
    baseline: RAW.frustrationBaseline,
    commonground: RAW.frustrationCommonGround,
    betterWhen: 'lower',
  },
];

export const SINGLE: SingleMetric[] = [
  {
    id: 'reuse',
    label: 'Reuse intent',
    question: 'answered yes',
    value: RAW.reuseIntent,
    kind: 'percent',
  },
  {
    id: 'acceptance',
    label: 'Recommendation acceptance',
    question: 'top option taken',
    value: RAW.recommendationAcceptance,
    kind: 'percent',
  },
];

/* ---------------- segmentation ---------------- */

export type Segment = {
  id: string;
  label: string;
  baseline: number;
  commonground: number;
  /** what the split is meant to expose */
  reading: string;
};

export const SEGMENTS: Segment[] = [
  {
    id: 'low',
    label: 'Low conflict',
    baseline: RAW.lowConflictBaseline,
    commonground: RAW.lowConflictCommonGround,
    reading: 'Little to coordinate. Structure has almost nothing to remove.',
  },
  {
    id: 'moderate',
    label: 'Moderate conflict',
    baseline: RAW.moderateConflictBaseline,
    commonground: RAW.moderateConflictCommonGround,
    reading: 'Enough disagreement to be costly, enough overlap to be solvable.',
  },
  {
    id: 'high',
    label: 'High conflict',
    baseline: RAW.highConflictBaseline,
    commonground: RAW.highConflictCommonGround,
    reading: 'Structure exposes the conflict quickly but cannot settle it.',
  },
];

export const SEGMENT_READING =
  'The product appears most valuable in moderate-conflict decisions.';

/* ---------------- fairness ---------------- */

export const FAIRNESS = {
  baseline: { average: RAW.avgSatisfactionBaseline, minimum: RAW.minSatisfactionBaseline },
  commonground: {
    average: RAW.avgSatisfactionCommonGround,
    minimum: RAW.minSatisfactionCommonGround,
  },
  argument:
    'Average satisfaction can hide a bad group decision. I track the least-satisfied person separately because a recommendation is not truly successful if one person consistently absorbs the compromise.',
};

/* ---------------- narrative ---------------- */

export const INSIGHT = {
  claim:
    'Structured preference capture appears most useful when groups have moderate disagreement — enough conflict that unstructured discussion creates friction, but still enough overlap to produce feasible options.',
  consequence:
    'High-conflict groups expose a different problem: recommendation quality is not the bottleneck. The product needs to help people negotiate constraints.',
};

export const MIXED_FINDING = {
  finding:
    'CommonGround does not eliminate decision friction when hard constraints produce no feasible option. In those rounds, structured ranking surfaces the conflict faster but cannot resolve it.',
  productResponse:
    'Add constraint negotiation rather than generating more recommendations.',
  leadsTo: 'Resolve the conflict',
};

export type LoopStep = { label: string; body: string };

export const LOOP: LoopStep[] = [
  {
    label: 'Observed',
    body: 'Veto conflicts and hidden hard constraints cause repeated recommendation churn.',
  },
  {
    label: 'Interpreted',
    body: 'Group decisions fail differently from individual recommendations.',
  },
  {
    label: 'Decision',
    body: 'Separate hard constraints, soft preferences and vetoes.',
  },
  {
    label: 'Result to measure',
    body: 'Time to decision, minimum-participant satisfaction, perceived fairness.',
  },
  {
    label: 'Next iteration',
    body: 'Resolve the conflict — negotiate constraints instead of re-ranking.',
  },
];

/* ---------------- the object the UI reads ---------------- */

export type ResultsData = {
  isPlaceholder: boolean;
  /** null until sessions have actually been run */
  sampleSize: { groups: number; rounds: number } | null;
  /** null until sessions have actually been run */
  collectedAt: string | null;
  headlineQuestion: string;
  primary: ComparisonMetric[];
  secondary: ComparisonMetric[];
  single: SingleMetric[];
  segments: Segment[];
  segmentReading: string;
  fairness: typeof FAIRNESS;
  insight: typeof INSIGHT;
  mixedFinding: typeof MIXED_FINDING;
  loop: LoopStep[];
};

export const RESULTS: ResultsData = {
  isPlaceholder: true,
  sampleSize: null,
  collectedAt: null,
  headlineQuestion:
    'Does CommonGround reduce coordination friction without sacrificing fairness?',
  primary: PRIMARY,
  secondary: SECONDARY,
  single: SINGLE,
  segments: SEGMENTS,
  segmentReading: SEGMENT_READING,
  fairness: FAIRNESS,
  insight: INSIGHT,
  mixedFinding: MIXED_FINDING,
  loop: LOOP,
};

/* ---------------- formatting and derivation ---------------- */

export function formatValue(kind: MetricKind, n: number): string {
  switch (kind) {
    case 'duration':
      return `${n} min`;
    case 'percent':
      return `${n}%`;
    case 'scale5':
      return `${n} / 5`;
    case 'count':
      return `${n}`;
  }
}

export type Delta = {
  /** e.g. "42%", "22 pp", "0.9 / 5", "3" */
  magnitude: string;
  direction: 'up' | 'down';
  /** true when the movement is the direction the product wants */
  improved: boolean;
};

/**
 * Derived, never written by hand — so replacing a number in RAW moves the
 * headline delta with it and the two can never disagree.
 */
export function delta(m: ComparisonMetric): Delta {
  const diff = m.commonground - m.baseline;
  const direction: Delta['direction'] = diff < 0 ? 'down' : 'up';
  const improved = m.betterWhen === 'lower' ? diff < 0 : diff > 0;
  const size = Math.abs(diff);

  let magnitude: string;
  if (m.kind === 'duration') {
    magnitude = `${Math.round((size / m.baseline) * 100)}%`;
  } else if (m.kind === 'percent') {
    magnitude = `${Math.round(size * 10) / 10} pp`;
  } else if (m.kind === 'scale5') {
    magnitude = `${Math.round(size * 10) / 10} / 5`;
  } else {
    magnitude = `${Math.round(size * 10) / 10}`;
  }

  return { magnitude, direction, improved };
}

/* ---------------- production safety ---------------- */

/**
 * Real results always render. Placeholder values render only behind an
 * explicit opt-in, so invented numbers cannot be read as evidence by
 * someone skimming the deployed site.
 */
export const PLACEHOLDER_PREVIEW_ENABLED =
  process.env.NEXT_PUBLIC_SHOW_CG_PLACEHOLDER === 'true';

export function resultsAreVisible(data: ResultsData = RESULTS): boolean {
  return !data.isPlaceholder || PLACEHOLDER_PREVIEW_ENABLED;
}
