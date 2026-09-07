/* ============================================================
   GUIDEAI — conversational follow-up

   The piloted product let a raiser ask follow-up questions about the
   pattern, the recommendation and the trainer conversation. This is the
   publication-safe version of that: the same four questions, answered
   deterministically from the structured state the pipeline already
   produced — the behaviour context, the trend, the retrieved resources,
   the escalation check and the observations themselves.

   No model, no network, no key. Every answer is traceable to a value the
   demo is already showing somewhere else, which is the point: a follow-up
   that cannot be checked against the record is not worth much.
   ============================================================ */

import type { Observation } from './demo-data';
import type { BehaviorContext, Escalation, GroundedResponse, RetrievalResult } from './retrieve';
import type { BehaviorTrend } from './derive';
import { contextLabel } from './derive';

export type FollowUp = {
  id: string;
  question: string;
  answer: string;
  /** where the answer came from, shown so it stays checkable */
  basedOn: string;
};

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export function buildFollowUps({
  context,
  retrieval,
  escalation,
  response,
  trend,
  observations,
}: {
  context: BehaviorContext;
  retrieval: RetrievalResult;
  escalation: Escalation;
  response: GroundedResponse;
  trend?: BehaviorTrend;
  observations: Observation[];
}): FollowUp[] {
  const forBehavior = observations.filter((o) => o.behavior === context.behavior);
  const spread =
    context.contextCount > 1
      ? `across ${context.contextCount} settings, most often ${contextLabel(context.dominantContext)}`
      : `in one setting: ${contextLabel(context.dominantContext)}`;

  /* 1 · why bring it to a trainer */
  const whyTrainer = escalation.required
    ? `${escalation.reason} That is why this one is flagged for a trainer rather than worked through from a suggestion.`
    : `Nothing here forces a trainer conversation yet. ${response.whenToAskTrainer} Bringing the pattern anyway is still useful, because ${context.observationCount} logged observations ${spread} is more than either of you would reconstruct from memory.`;

  /* 2 · direction */
  const direction = trend
    ? `${trend.evidence} ${
        trend.direction === 'improving'
          ? 'That is the direction you want.'
          : trend.direction === 'watch'
            ? 'It is appearing more often lately, which is what makes it worth raising.'
            : 'It is holding steady rather than moving either way.'
      }`
    : `Not enough logged yet to call a direction. ${context.observationCount} observation${
        context.observationCount === 1 ? '' : 's'
      } is where it stands.`;

  /* 3 · what is driving it */
  const driving = forBehavior.length
    ? `${forBehavior.length} observation${forBehavior.length === 1 ? '' : 's'} of ${
        context.behavior
      }: ${forBehavior
        .slice(-3)
        .map(
          (o) =>
            `${dateLabel(o.date)} — ${contextLabel(o.context)}, ${o.frequency}${
              o.note ? ` (“${o.note}”)` : ''
            }`,
        )
        .join('; ')}. The strongest of them was logged as ${context.strongestFrequency}.`
    : 'No observations of this behaviour are logged yet.';

  /* 4 · what to ask */
  const sources = retrieval.results
    .slice(0, 2)
    .map((r) => r.resource.title)
    .join(' and ');
  const toAsk = escalation.required
    ? `Bring the pattern, not the conclusion: ${context.behavior} logged ${context.observationCount} times ${spread}. Ask what they are seeing that you are not, whether this reads as one problem or several, and what would tell you it is getting worse.`
    : `Ask whether ${context.behavior} ${spread} matches what they see in sessions, and what they would want logged between now and the next one.${
        sources ? ` The guidance behind this recommendation was ${sources} — worth asking whether they agree it applies here.` : ''
      }`;

  return [
    {
      id: 'why-trainer',
      question: 'Why is this pattern worth bringing to my trainer?',
      answer: whyTrainer,
      basedOn: escalation.required ? 'escalation policy' : 'retrieved guidance',
    },
    {
      id: 'direction',
      question: 'Has this been getting better or worse?',
      answer: direction,
      basedOn: 'counted from the observation window',
    },
    {
      id: 'driving',
      question: 'Which observations are driving this?',
      answer: driving,
      basedOn: 'the logged records themselves',
    },
    {
      id: 'ask',
      question: 'What should I ask my trainer?',
      answer: toAsk,
      basedOn: 'behaviour context + retrieved sources',
    },
  ];
}
