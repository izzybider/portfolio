/* ============================================================
   DERIVED VIEWS

   Everything the demo displays is computed here from the observation
   list. Nothing is hardcoded, so adding an observation in the UI changes
   the counts, the trend, the recommendation and the trainer-prep summary
   the same way it would in the product.

   The trainer-prep sections mirror export_service.generate_trainer_summary
   in the GuideAI app: window, totals, most-logged behaviors, common
   contexts, frequency pattern, recent observations, and discussion topics.
   ============================================================ */

import { matchObservation, getTrainingPlan, CONTEXTS, type Rule } from './rules';
import type { Observation } from './demo-data';

export const contextLabel = (value: string) =>
  CONTEXTS.find((c) => c.value === value)?.label ?? value;

const byDateAsc = (a: Observation, b: Observation) => a.date.localeCompare(b.date);

export const sorted = (obs: Observation[]) => [...obs].sort(byDateAsc);

export function counts<T extends string>(values: T[]): { key: T; count: number }[] {
  const map = new Map<T, number>();
  values.forEach((v) => map.set(v, (map.get(v) ?? 0) + 1));
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

/** Calendar weeks since the first observation, 1-indexed. */
export function weekIndex(obs: Observation[], o: Observation): number {
  const first = sorted(obs)[0];
  if (!first) return 1;
  const days =
    (new Date(o.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24);
  return Math.floor(days / 7) + 1;
}

export type WeekBucket = {
  week: number;
  total: number;
  positive: number;
  challenge: number;
};

export function weeklyBuckets(obs: Observation[]): WeekBucket[] {
  const buckets = new Map<number, WeekBucket>();
  sorted(obs).forEach((o) => {
    const w = weekIndex(obs, o);
    const b = buckets.get(w) ?? { week: w, total: 0, positive: 0, challenge: 0 };
    b.total += 1;
    if (o.observation_type === 'positive progress') b.positive += 1;
    else b.challenge += 1;
    buckets.set(w, b);
  });
  return [...buckets.values()].sort((a, b) => a.week - b.week);
}

export type BehaviorTrend = {
  behavior: string;
  total: number;
  firstHalf: number;
  secondHalf: number;
  /** direction of change across the window */
  direction: 'improving' | 'watch' | 'steady';
  /** the sentence that makes the direction checkable */
  evidence: string;
  positive: boolean;
};

/**
 * Direction is computed by splitting the window in half and comparing
 * counts. A positive behavior appearing more often later is "improving";
 * a challenge behavior appearing more often later is "watch". Anything
 * within one observation is "steady", because a single log should not
 * flip a trend.
 */
export function behaviorTrends(obs: Observation[]): BehaviorTrend[] {
  const list = sorted(obs);
  if (list.length === 0) return [];
  const mid = Math.floor(list.length / 2);
  const first = list.slice(0, mid);
  const second = list.slice(mid);

  const behaviors = [...new Set(list.map((o) => o.behavior))];
  return behaviors
    .map((behavior) => {
      const all = list.filter((o) => o.behavior === behavior);
      const positive = all[0].observation_type === 'positive progress';
      const f = first.filter((o) => o.behavior === behavior).length;
      const s = second.filter((o) => o.behavior === behavior).length;
      const delta = s - f;
      let direction: BehaviorTrend['direction'] = 'steady';
      /* One observation is not a trend. A behavior needs at least two before
         the demo will call it a direction, which keeps a single log from
         flipping the trainer-prep summary. */
      if (all.length >= 2 && Math.abs(delta) >= 1) {
        if (positive) direction = delta > 0 ? 'improving' : 'watch';
        else direction = delta > 0 ? 'watch' : 'improving';
      }
      const half = `${f} in the first half of the window, ${s} in the second`;
      return {
        behavior,
        total: all.length,
        firstHalf: f,
        secondHalf: s,
        direction,
        evidence: `Logged ${all.length} time${all.length === 1 ? '' : 's'} — ${half}.`,
        positive,
      };
    })
    .sort((a, b) => b.total - a.total);
}

/** The behavior the demo surfaces a recommendation for: the most-logged concern. */
export function focusBehavior(obs: Observation[]): string | null {
  const concerns = obs.filter((o) => o.observation_type === 'challenge / concern');
  if (concerns.length === 0) return null;
  return counts(concerns.map((o) => o.behavior))[0].key;
}

export type Recommendation = {
  behavior: string;
  rule: Rule;
  noticing: string;
  whyItMayMatter: string;
  suggestedNextStep: string;
  whenToAskTrainer: string;
  basedOn: Observation[];
  contexts: { key: string; count: number }[];
  plan: ReturnType<typeof getTrainingPlan>;
};

/**
 * A structured recommendation for one behavior, built from the rows that
 * behavior actually produced. `basedOn` is returned so every line in the
 * card can be traced back to the observations underneath it.
 */
export function buildRecommendation(
  obs: Observation[],
  behavior: string,
): Recommendation | null {
  const relevant = sorted(obs).filter((o) => o.behavior === behavior);
  if (relevant.length === 0) return null;

  const latest = relevant[relevant.length - 1];
  const contextCounts = counts(relevant.map((o) => o.context));
  const dominantContext = contextCounts[0];
  /* Frequency shown to the matcher is the strongest one logged, so a
     repeated pattern is not interpreted as a one-off. */
  const freqRank = { once: 0, intermittent: 1, repeated: 2 } as const;
  const strongest = relevant.reduce((acc, o) =>
    freqRank[o.frequency] > freqRank[acc.frequency] ? o : acc,
  );

  const rule = matchObservation(
    latest.observation_type,
    behavior,
    dominantContext.key,
    strongest.frequency,
  );
  if (!rule) return null;

  const spread =
    contextCounts.length > 1
      ? `across ${contextCounts.length} contexts, most often ${contextLabel(dominantContext.key)}`
      : `in one context: ${contextLabel(dominantContext.key)}`;

  return {
    behavior,
    rule,
    noticing: `${behavior} has been logged ${relevant.length} time${
      relevant.length === 1 ? '' : 's'
    } ${spread}.`,
    whyItMayMatter: rule.why_it_matters,
    suggestedNextStep: rule.immediate_action,
    whenToAskTrainer: rule.escalate_when,
    basedOn: relevant,
    contexts: contextCounts,
    plan: getTrainingPlan(behavior),
  };
}

/* ---------------- trainer prep ---------------- */

export type TrainerPrep = {
  dogName: string;
  window: string;
  total: number;
  improved: BehaviorTrend[];
  stillDifficult: BehaviorTrend[];
  contextPatterns: { key: string; count: number }[];
  questions: string[];
  representative: Observation[];
  needsTrainerJudgment: { behavior: string; reason: string }[];
};

export function buildTrainerPrep(obs: Observation[], dogName: string): TrainerPrep {
  const list = sorted(obs);
  const trends = behaviorTrends(obs);
  const first = list[0];
  const last = list[list.length - 1];

  const fmt = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  /* A behavior needs trainer judgment when its interpretation row is
     medium/high risk, or when a concern is spreading across contexts. */
  const needsTrainerJudgment = trends
    .filter((t) => !t.positive)
    .map((t) => {
      const rec = buildRecommendation(obs, t.behavior);
      if (!rec) return null;
      const contexts = rec.contexts.length;
      const risky = rec.rule.risk === 'medium' || rec.rule.risk === 'high';
      const spreading = contexts > 1 && t.direction !== 'improving';
      if (!risky && !spreading) return null;
      return {
        behavior: t.behavior,
        reason: risky
          ? `Interpretation row is ${rec.rule.risk} risk — ${rec.rule.escalate_when.toLowerCase()}`
          : `Appearing in ${contexts} different contexts rather than one.`,
      };
    })
    .filter((x): x is { behavior: string; reason: string } => x !== null);

  return {
    dogName,
    window: list.length ? `${fmt(first.date)} to ${fmt(last.date)}` : 'No observations yet',
    total: list.length,
    improved: trends.filter((t) => t.direction === 'improving'),
    /* Only concerns can "remain difficult". A positive behavior appearing
       less often is not the same product situation and should not be
       reported as a problem. */
    stillDifficult: trends.filter((t) => t.direction === 'watch' && !t.positive),
    contextPatterns: counts(list.map((o) => o.context)),
    questions: [
      'Which of these patterns seems most important to watch next?',
      'Which contexts should I describe in more detail?',
      'Are there routines or resources you would want used before the next session?',
      ...needsTrainerJudgment.map(
        (n) => `How would you like me to handle ${n.behavior} if it happens again?`,
      ),
    ],
    representative: list.slice(-6).reverse(),
    needsTrainerJudgment,
  };
}

/** Plain-text version for the copy button. */
export function trainerPrepText(prep: TrainerPrep): string {
  const lines: string[] = [];
  lines.push(`Observation summary for ${prep.dogName}`);
  lines.push('');
  lines.push(
    'Purpose: a structured reflection summary for a trainer conversation. It is not a diagnosis or an official training assessment.',
  );
  lines.push('');
  lines.push(`Observation window: ${prep.window}`);
  lines.push(`Total observations logged: ${prep.total}`);
  lines.push('');
  lines.push('What improved:');
  if (prep.improved.length === 0) lines.push('- Nothing has moved far enough to call a change yet');
  prep.improved.forEach((t) => lines.push(`- ${t.behavior}: ${t.evidence}`));
  lines.push('');
  lines.push('What remains difficult:');
  if (prep.stillDifficult.length === 0) lines.push('- No behavior is currently trending the wrong way');
  prep.stillDifficult.forEach((t) => lines.push(`- ${t.behavior}: ${t.evidence}`));
  lines.push('');
  lines.push('Context patterns:');
  prep.contextPatterns.forEach((c) => lines.push(`- ${contextLabel(c.key)}: ${c.count}`));
  lines.push('');
  lines.push('Items I would like trainer judgment on:');
  if (prep.needsTrainerJudgment.length === 0) lines.push('- None flagged from this window');
  prep.needsTrainerJudgment.forEach((n) => lines.push(`- ${n.behavior}: ${n.reason}`));
  lines.push('');
  lines.push('Questions for the trainer:');
  prep.questions.forEach((q) => lines.push(`- ${q}`));
  lines.push('');
  lines.push('Representative observations:');
  prep.representative.forEach((o) => {
    lines.push(`- ${o.date} · ${o.behavior} · ${contextLabel(o.context)} · ${o.frequency}`);
    if (o.note) lines.push(`  Note: ${o.note}`);
  });
  lines.push('');
  lines.push('Generated from synthetic demonstration data.');
  return lines.join('\n');
}
