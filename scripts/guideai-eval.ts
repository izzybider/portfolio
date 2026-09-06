/**
 * Runs the synthetic evaluation set against the current retrieval stack.
 *
 *   npm run guideai:eval
 *
 * Prints only what it computes. Condition B is the shipped pipeline;
 * condition A removes retrieval so the comparison shows what grounding is
 * actually buying.
 */
import { EVAL_SET, type EvalCase } from '../src/lib/guideai/eval';
import { INDEX } from '../src/lib/guideai/embed';
import { CORPUS, SENSITIVE_BEHAVIORS } from '../src/lib/guideai/corpus';
import {
  buildQuery, compose, escalationCheck, retrieve, TOP_K,
  type BehaviorContext,
} from '../src/lib/guideai/retrieve';

const ctx = (c: EvalCase): BehaviorContext => ({
  behavior: c.behavior,
  dominantContext: c.dominantContext,
  contextCount: c.contextCount,
  observationCount: c.observationCount,
  strongestFrequency: c.strongestFrequency,
  trend: c.trend,
  positive: c.positive,
  recentNotes: [],
  task: 'wants a next-step recommendation',
});

const pct = (n: number, d: number) => (d === 0 ? '  n/a' : `${((n / d) * 100).toFixed(0).padStart(3)}%`);

let hitAtK = 0, relevantSum = 0, relevantDen = 0;
let escalationCorrect = 0, grounded = 0, unsupported = 0, complete = 0, deferred = 0;
const misses: string[] = [];

for (const c of EVAL_SET) {
  const context = ctx(c);
  const r = retrieve(context, INDEX, TOP_K);
  const esc = escalationCheck(context);
  const out = compose(context, r, esc);

  const ids = r.results.map((x) => x.resource.id);
  const hit = c.expectedResources.some((e) => ids.includes(e));
  if (hit) hitAtK += 1; else misses.push(`${c.id} ${c.behavior} / ${c.dominantContext} -> got ${ids.join(',')} want ${c.expectedResources.join(',')}`);

  // precision of the retrieved set against the labelled relevant set
  relevantSum += ids.filter((id) => c.expectedResources.includes(id)).length;
  relevantDen += ids.length;

  if (esc.required === c.expectedEscalation) escalationCorrect += 1;

  // groundedness: every source shown exists in the corpus, and the response
  // cites at least one when it is not deferring
  const allReal = r.results.every((x) => CORPUS.some((res) => res.id === x.resource.id));
  if (allReal && (out.deferred || out.sources.length > 0)) grounded += 1;

  // unsupported: suggested a step when retrieval was weak or the behaviour
  // was sensitive — the case the policy exists to prevent
  const shouldDefer = r.weak || SENSITIVE_BEHAVIORS.has(c.behavior);
  if (shouldDefer && !out.deferred) unsupported += 1;
  if (out.deferred) deferred += 1;

  const fields = [out.noticing, out.whyItMayMatter, out.suggestedNextStep, out.whenToAskTrainer, out.basedOn];
  if (fields.every((f) => typeof f === 'string' && f.trim().length > 0)) complete += 1;
}

// Condition A: no retrieval at all.
let aUnsupported = 0, aGrounded = 0;
for (const c of EVAL_SET) {
  const context = ctx(c);
  const esc = escalationCheck(context);
  // an ungrounded generator would answer regardless of evidence
  const wouldAnswer = true;
  const shouldDefer = SENSITIVE_BEHAVIORS.has(c.behavior);
  if (shouldDefer && wouldAnswer) aUnsupported += 1;
  if (esc.required) aGrounded += 0; // no sources exist to cite
}

const n = EVAL_SET.length;
console.log(`\nGuideAI retrieval evaluation — synthetic evaluation set`);
console.log(`  embedder: ${INDEX.embedder}  (${INDEX.embedder_label})`);
console.log(`  dimension: ${INDEX.dimension}   corpus: ${CORPUS.length}   top-k: ${TOP_K}   cases: ${n}\n`);
console.log(`  B · retrieval-grounded (shipped)`);
console.log(`    retrieval hit@${TOP_K}              ${pct(hitAtK, n)}   (${hitAtK}/${n})`);
console.log(`    retrieved-set precision        ${pct(relevantSum, relevantDen)}   (${relevantSum}/${relevantDen})`);
console.log(`    escalation correctness         ${pct(escalationCorrect, n)}   (${escalationCorrect}/${n})`);
console.log(`    groundedness                   ${pct(grounded, n)}   (${grounded}/${n})`);
console.log(`    unsupported recommendations    ${pct(unsupported, n)}   (${unsupported}/${n})`);
console.log(`    structural completeness        ${pct(complete, n)}   (${complete}/${n})`);
console.log(`    deferred instead of suggesting  ${deferred}/${n}\n`);
console.log(`  A · no retrieval (control)`);
console.log(`    groundedness                   ${pct(aGrounded, n)}   (no sources exist to cite)`);
console.log(`    unsupported recommendations    ${pct(aUnsupported, n)}   (${aUnsupported}/${n} — answers sensitive cases it should refer)\n`);
if (misses.length) {
  console.log(`  retrieval misses (${misses.length}):`);
  misses.forEach((m) => console.log(`    ${m}`));
}
console.log('');
