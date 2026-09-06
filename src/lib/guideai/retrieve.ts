/* ============================================================
   RETRIEVAL

   Query construction, vector search and the grounded response.

   The query is not the latest note. It is assembled from the structured
   behaviour context — behaviour, dominant setting, how often, the trend
   direction, recovery signal and the task the raiser is doing — because
   that is what the retrieval actually needs to be relevant to.

   Generation is *extractive and grounded*: the response is composed from
   the retrieved resources, and every line can be traced to one. Nothing is
   free-form, so the system cannot produce training advice that is not in
   the corpus. That is a product decision as much as a technical one — the
   application this demo is modelled on states that it does not give
   official training guidance, and an ungrounded generator would.
   ============================================================ */

import { CORPUS, SENSITIVE_BEHAVIORS, type Resource } from './corpus';
import { INDEX, cosine, embedQuery, type ResourceIndex } from './embed';
import { contextLabel } from './derive';
import type { Observation } from './demo-data';

export const TOP_K = 4;
/** Below this, retrieval is treated as weak and the product asks for more. */
export const WEAK_RETRIEVAL = 0.12;

export type BehaviorContext = {
  behavior: string;
  dominantContext: string;
  contextCount: number;
  observationCount: number;
  strongestFrequency: string;
  trend: 'improving' | 'watch' | 'steady';
  positive: boolean;
  recentNotes: string[];
  task: string;
};

/** Everything the retrieval step is allowed to see, in one place. */
export function buildContext(
  behavior: string,
  observations: Observation[],
  trend: 'improving' | 'watch' | 'steady',
  contexts: { key: string; count: number }[],
  task = 'wants a next-step recommendation',
): BehaviorContext {
  const rank = { once: 0, intermittent: 1, repeated: 2 } as const;
  const strongest = observations.reduce((acc, o) =>
    rank[o.frequency] > rank[acc.frequency] ? o : acc,
  );
  return {
    behavior,
    dominantContext: contexts[0]?.key ?? '',
    contextCount: contexts.length,
    observationCount: observations.length,
    strongestFrequency: strongest.frequency,
    trend,
    positive: observations[0].observation_type === 'positive progress',
    recentNotes: observations
      .slice(-3)
      .map((o) => o.note ?? '')
      .filter(Boolean),
    task,
  };
}

/** The sentence that actually gets embedded. Shown verbatim in the trace. */
export function buildQuery(c: BehaviorContext): string {
  const spread =
    c.contextCount > 1
      ? `across ${c.contextCount} settings, most often ${contextLabel(c.dominantContext)}`
      : `in ${contextLabel(c.dominantContext)}`;
  const direction =
    c.trend === 'improving'
      ? 'the pattern is moving in a good direction'
      : c.trend === 'watch'
        ? 'the pattern is appearing more often lately'
        : 'the pattern is steady';
  return [
    `${c.behavior} logged ${c.observationCount} times ${spread};`,
    `${c.strongestFrequency} at its strongest;`,
    `${direction};`,
    `raiser ${c.task}.`,
    c.recentNotes.length ? `Recent notes: ${c.recentNotes.join(' ')}` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export type Retrieved = {
  resource: Resource;
  score: number;
  /** 'high' | 'medium' | 'low' — a band, not a calibrated probability */
  relevance: 'high' | 'medium' | 'low';
  /** which tags actually matched, for "why this was retrieved" */
  matchedOn: string[];
};

const band = (score: number, top: number): Retrieved['relevance'] => {
  if (top <= 0) return 'low';
  const ratio = score / top;
  if (ratio >= 0.8) return 'high';
  if (ratio >= 0.5) return 'medium';
  return 'low';
};

export type RetrievalResult = {
  query: string;
  embedder: string;
  dimension: number;
  corpusSize: number;
  topK: number;
  results: Retrieved[];
  /** true when nothing scored above the weak-retrieval floor */
  weak: boolean;
  sensitive: boolean;
  whyRetrieved: string;
};

export function retrieve(
  c: BehaviorContext,
  index: ResourceIndex = INDEX,
  k: number = TOP_K,
): RetrievalResult {
  const query = buildQuery(c);
  const sensitive = SENSITIVE_BEHAVIORS.has(c.behavior);

  /* The application never runs loose automated matching on sensitive
     observations. Here that means retrieval is restricted to the
     escalation material and the product asks for a trainer. */
  const pool = sensitive
    ? CORPUS.filter((r) => r.category === 'escalation')
    : CORPUS;

  const qv = embedQuery(query, index);
  const scored = pool
    .map((resource) => {
      const v = index.vectors[resource.id];
      const score = v ? cosine(qv, v) : 0;
      const matchedOn = [
        ...resource.behavior_tags.filter((t) => t === c.behavior),
        ...resource.context_tags.filter((t) => t === c.dominantContext),
      ];
      return { resource, score, matchedOn, relevance: 'low' as const };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  const top = scored[0]?.score ?? 0;
  const results = scored.map((r) => ({ ...r, relevance: band(r.score, top) }));
  const weak = top < WEAK_RETRIEVAL;

  const matchedTags = [...new Set(results.flatMap((r) => r.matchedOn))];
  const whyRetrieved = matchedTags.length
    ? `Matched on ${matchedTags
        .map((t) => (t === c.dominantContext ? contextLabel(t).toLowerCase() : t))
        .join(' + ')}, ranked by cosine similarity to the query above.`
    : 'Ranked by cosine similarity to the query above; no exact behaviour or setting tag matched.';

  return {
    query,
    embedder: index.embedder_label,
    dimension: index.dimension,
    corpusSize: pool.length,
    topK: k,
    results,
    weak,
    sensitive,
    whyRetrieved,
  };
}

/* ---------------- escalation policy ---------------- */

export type Escalation = {
  required: boolean;
  reason: string | null;
};

/**
 * Deterministic, and checked after retrieval rather than being left to a
 * generator. Any one of these is enough on its own.
 */
export function escalationCheck(c: BehaviorContext): Escalation {
  if (SENSITIVE_BEHAVIORS.has(c.behavior)) {
    return {
      required: true,
      reason: `${c.behavior} is treated as a signal to involve a trainer directly rather than something to work through from a suggestion.`,
    };
  }
  if (!c.positive && c.contextCount > 1 && c.trend !== 'improving') {
    return {
      required: true,
      reason: `${c.behavior} is appearing in ${c.contextCount} different settings and is not trending better — spreading across contexts is the point to bring a trainer in.`,
    };
  }
  if (!c.positive && c.strongestFrequency === 'repeated' && c.trend === 'watch') {
    return {
      required: true,
      reason: `${c.behavior} is logged as repeated and is appearing more often lately.`,
    };
  }
  return { required: false, reason: null };
}

/* ---------------- grounded response ---------------- */

export type GroundedResponse = {
  noticing: string;
  whyItMayMatter: string;
  suggestedNextStep: string;
  whenToAskTrainer: string;
  basedOn: string;
  sources: Retrieved[];
  /** true when the system declined to suggest a step */
  deferred: boolean;
};

/**
 * Composed from the retrieved resources. `whyItMayMatter` and
 * `suggestedNextStep` are taken from the highest-scoring resource, and
 * `whenToAskTrainer` from the escalation policy or the resource's own
 * escalation note — so every line is attributable to something in the
 * corpus or to a rule.
 */
export function compose(
  c: BehaviorContext,
  retrieval: RetrievalResult,
  escalation: Escalation,
): GroundedResponse {
  const spread =
    c.contextCount > 1
      ? `across ${c.contextCount} settings, most often ${contextLabel(c.dominantContext)}`
      : `in one setting: ${contextLabel(c.dominantContext)}`;
  const noticing = `${c.behavior} has been logged ${c.observationCount} time${
    c.observationCount === 1 ? '' : 's'
  } ${spread}, ${c.strongestFrequency} at its strongest.`;

  const top = retrieval.results[0];

  /* Weak retrieval, or a sensitive behaviour, means the product does not
     suggest a step. It asks for more observation or for a trainer. */
  if (retrieval.weak || retrieval.sensitive) {
    return {
      noticing,
      whyItMayMatter: retrieval.sensitive
        ? 'This is the kind of observation that goes to a trainer directly rather than being worked through from a suggestion.'
        : 'Nothing in the resource set matched this pattern closely enough to say anything useful about it yet.',
      suggestedNextStep: retrieval.sensitive
        ? 'Record what happened, what preceded it and what you did next, and contact a trainer.'
        : 'Keep logging this behaviour with the setting and what preceded it. A second or third observation is usually what makes the pattern readable.',
      whenToAskTrainer: escalation.reason ?? 'Bring it to a trainer if it happens again.',
      basedOn: `${c.observationCount} observation${c.observationCount === 1 ? '' : 's'} · retrieval ${
        retrieval.sensitive ? 'restricted to escalation material' : 'below the relevance floor'
      }`,
      sources: retrieval.results,
      deferred: true,
    };
  }

  return {
    noticing,
    whyItMayMatter: top.resource.content.split('. ')[0] + '.',
    suggestedNextStep: top.resource.content.split('. ').slice(1).join('. ').trim() ||
      top.resource.content,
    whenToAskTrainer: escalation.required
      ? (escalation.reason as string)
      : top.resource.escalation_note,
    basedOn: `${c.observationCount} observation${
      c.observationCount === 1 ? '' : 's'
    } · ${retrieval.results.length} retrieved resources`,
    sources: retrieval.results,
    deferred: false,
  };
}
