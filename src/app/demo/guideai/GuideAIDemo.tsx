'use client';

import { useEffect, useMemo, useState } from 'react';
import DemoTabs from '@/components/DemoTabs';
import DeeperDetail from '@/components/DeeperDetail';
import Arrow from '@/components/Arrow';
import {
  CHALLENGE_BEHAVIORS,
  POSITIVE_BEHAVIORS,
  CONTEXTS,
  FREQUENCIES,
  type Frequency,
  type ObservationType,
} from '@/lib/guideai/rules';
import { SEED_OBSERVATIONS, DOG, type Observation } from '@/lib/guideai/demo-data';
import {
  behaviorTrends,
  buildRecommendation,
  buildTrainerPrep,
  contextLabel,
  counts,
  focusBehavior,
  sorted,
  trainerPrepText,
  weeklyBuckets,
} from '@/lib/guideai/derive';
import {
  buildContext,
  compose,
  escalationCheck,
  retrieve,
  TOP_K,
} from '@/lib/guideai/retrieve';
import { INDEX } from '@/lib/guideai/embed';
import { CORPUS } from '@/lib/guideai/corpus';
import { track } from '@/lib/guideai/analytics';

type Tab = 'overview' | 'log' | 'trends' | 'recommendation' | 'prep';

/* Ordered for the path a recruiter actually takes: see what changed, read the
   recommendation and its evidence, end at the trainer-prep summary. Logging
   and trends stay available but are not the first thing offered. */
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'recommendation', label: 'Recommendation' },
  { id: 'prep', label: 'Trainer prep' },
  { id: 'log', label: 'Log observation' },
  { id: 'trends', label: 'Trends' },
];

/* A behaviour the product deliberately refuses to advise on: retrieval is
   restricted to escalation material and the response defers to a trainer. */
const HIGHER_RISK_BEHAVIOR = 'growling';

export default function GuideAIDemo() {
  const [observations, setObservations] = useState<Observation[]>(SEED_OBSERVATIONS);
  const [tab, setTab] = useState<Tab>('overview');
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedBehavior, setSelectedBehavior] = useState<string | null>(null);
  const [whySources, setWhySources] = useState(false);
  const hasHigherRisk = useMemo(
    () => observations.some((o) => o.behavior === HIGHER_RISK_BEHAVIOR),
    [observations],
  );

  const trends = useMemo(() => behaviorTrends(observations), [observations]);
  const weeks = useMemo(() => weeklyBuckets(observations), [observations]);
  const focus = useMemo(() => focusBehavior(observations), [observations]);
  const recBehavior = selectedBehavior ?? focus;
  const recommendation = useMemo(
    () => (recBehavior ? buildRecommendation(observations, recBehavior) : null),
    [observations, recBehavior],
  );
  const prep = useMemo(() => buildTrainerPrep(observations, DOG.name), [observations]);

  /* Retrieval pipeline for the behaviour currently in view. */
  const pipeline = useMemo(() => {
    if (!recommendation) return null;
    const trend = trends.find((t) => t.behavior === recommendation.behavior);
    const context = buildContext(
      recommendation.behavior,
      recommendation.basedOn,
      trend?.direction ?? 'steady',
      recommendation.contexts,
    );
    const retrieval = retrieve(context);
    const escalation = escalationCheck(context);
    const response = compose(context, retrieval, escalation);
    return { context, retrieval, escalation, response };
  }, [recommendation, trends]);
  const recent = useMemo(() => sorted(observations).slice(-4).reverse(), [observations]);
  const contextCounts = useMemo(() => counts(observations.map((o) => o.context)), [observations]);

  /* ---- log form ---- */
  const [type, setType] = useState<ObservationType>('challenge / concern');
  const [behavior, setBehavior] = useState<string>(CHALLENGE_BEHAVIORS[0]);
  const [context, setContext] = useState<string>(CONTEXTS[1].value);
  const [frequency, setFrequency] = useState<Frequency>('intermittent');
  const [note, setNote] = useState('');

  const behaviorOptions: readonly string[] =
    type === 'positive progress' ? POSITIVE_BEHAVIORS : CHALLENGE_BEHAVIORS;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Observation = {
      id: `obs-new-${observations.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      observation_type: type,
      behavior,
      context,
      frequency,
      note: note.trim() || undefined,
    };
    const priorCount = observations.filter((o) => o.behavior === behavior).length;
    setObservations((prev) => [...prev, next]);
    track('observation_logged', { behavior, context, frequency, type });
    setNote('');
    setSelectedBehavior(behavior);
    setConfirmation(
      `Observation added. ${DOG.name}'s pattern summary has been updated — ${behavior} has now been logged ${priorCount + 1} time${priorCount === 0 ? '' : 's'}.`,
    );
  };

  const reset = () => {
    setObservations(SEED_OBSERVATIONS);
    setSelectedBehavior(null);
    setConfirmation(null);
    setCopied(false);
    setNote('');
  };

  const copyPrep = async () => {
    try {
      await navigator.clipboard.writeText(trainerPrepText(prep));
      track('demo_completed', { observations: observations.length });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const maxWeek = Math.max(1, ...weeks.map((w) => w.total));

  useEffect(() => {
    track('guideai_demo_started');
  }, []);

  useEffect(() => {
    if (tab === 'trends') track('trend_viewed');
    if (tab === 'prep') track('trainer_prep_generated');
  }, [tab]);

  useEffect(() => {
    if (!pipeline) return;
    track('recommendation_generated', {
      behavior: pipeline.context.behavior,
      retrieved: pipeline.retrieval.results.length,
      weak_retrieval: pipeline.retrieval.weak,
      deferred: pipeline.response.deferred,
    });
    if (pipeline.escalation.required) {
      track('escalation_shown', { behavior: pipeline.context.behavior });
    }
  }, [pipeline]);

  return (
    <>
      {tab === 'overview' && (
        <div className="leadin">
            <p className="leadin__line">
              Four weeks of {DOG.name}&rsquo;s observations are already logged.
            </p>
            <div className="demo__actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  setSelectedBehavior(null);
                  setTab('recommendation');
                }}
              >
                See what changed with {DOG.name} <Arrow />
              </button>
              <button
                type="button"
                className="button button--quiet"
                onClick={() => setTab('log')}
              >
                Log an observation
              </button>
            </div>
          </div>
      )}

      <DemoTabs tabs={TABS} active={tab} onChange={setTab} label="GuideAI demo sections" />

      {/* ---------------- OVERVIEW ---------------- */}
      {tab === 'overview' && (
        <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">
          <div className="demogrid demogrid--sidebar">
            <div className="demopanel">
              <div className="demopanel__head">
                <h2 className="demopanel__title">Pattern summary</h2>
                <span className="meta">{prep.window}</span>
              </div>
              {trends.slice(0, 4).map((t) => (
                <div className="trend" key={t.behavior}>
                  <div className="trend__top">
                    <span className="trend__name">{t.behavior}</span>
                    <span className={`trend__dir trend__dir--${t.direction}`}>{t.direction}</span>
                  </div>
                  <p className="trend__evidence">{t.evidence}</p>
                </div>
              ))}
              <p className="meta" style={{ marginTop: 'var(--s2)' }}>
                Every line here is counted from the observations below — nothing is scored or
                predicted.
              </p>
            </div>

            <div className="demogrid">
              <div className="demopanel">
                <div className="demopanel__head">
                  <h2 className="demopanel__title">Three things to discuss</h2>
                </div>
                <ol className="stack-2" style={{ paddingLeft: '1.1em', margin: 0 }}>
                  {prep.questions.slice(0, 3).map((q) => (
                    <li key={q} className="reccard__value">
                      {q}
                    </li>
                  ))}
                </ol>
              </div>

              {prep.needsTrainerJudgment.length > 0 && (
                <div className="demopanel" style={{ borderColor: 'var(--border-strong)' }}>
                  <div className="demopanel__head">
                    <h2 className="demopanel__title">Watch item</h2>
                  </div>
                  <p className="reccard__value">
                    <strong>{prep.needsTrainerJudgment[0].behavior}</strong> —{' '}
                    {prep.needsTrainerJudgment[0].reason}
                  </p>
                  <p className="meta" style={{ marginTop: 'var(--s2)' }}>
                    GuideAI raises this for a trainer conversation. It does not decide what it means.
                  </p>
                </div>
              )}

            </div>
          </div>

          <div className="demopanel" style={{ marginTop: 'var(--s3)' }}>
            <div className="demopanel__head">
              <h2 className="demopanel__title">Latest observations</h2>
              <button
                type="button"
                className="button button--quiet"
                onClick={() => setTab('trends')}
              >
                See all {observations.length}
              </button>
            </div>
            <ul className="obslist">
              {recent.map((o) => (
                <li key={o.id}>
                  <div className="obslist__top">
                    <span className="obslist__behavior">{o.behavior}</span>
                    <span className="obstag">{contextLabel(o.context)}</span>
                    <span className="obstag">{o.frequency}</span>
                    {o.observation_type === 'positive progress' && (
                      <span className="obstag obstag--positive">positive</span>
                    )}
                    <span className="meta" style={{ marginLeft: 'auto' }}>
                      {o.date}
                    </span>
                  </div>
                  {o.note && <p className="obslist__note">{o.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ---------------- LOG ---------------- */}
      {tab === 'log' && (
        <div id="panel-log" role="tabpanel" aria-labelledby="tab-log">
          <div className="demogrid demogrid--sidebar">
            <div className="demopanel">
              <div className="demopanel__head">
                <h2 className="demopanel__title">Log an observation</h2>
                <span className="meta">about 20 seconds</span>
              </div>
              <form className="demoform" onSubmit={submit}>
                <div className="demofield">
                  <label className="demofield__label" htmlFor="obs-type">
                    Observation type
                  </label>
                  <select
                    id="obs-type"
                    value={type}
                    onChange={(e) => {
                      const value = e.target.value as ObservationType;
                      setType(value);
                      setBehavior(
                        value === 'positive progress'
                          ? POSITIVE_BEHAVIORS[0]
                          : CHALLENGE_BEHAVIORS[0],
                      );
                    }}
                  >
                    <option value="challenge / concern">challenge / concern</option>
                    <option value="positive progress">positive progress</option>
                  </select>
                </div>

                <div className="demofield">
                  <label className="demofield__label" htmlFor="obs-behavior">
                    {type === 'positive progress' ? 'Positive observation' : 'Observed behavior'}
                  </label>
                  <select
                    id="obs-behavior"
                    value={behavior}
                    onChange={(e) => setBehavior(e.target.value)}
                  >
                    {behaviorOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="demofield">
                  <label className="demofield__label" htmlFor="obs-context">
                    Context
                  </label>
                  <select
                    id="obs-context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  >
                    {CONTEXTS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="demofield">
                  <label className="demofield__label" htmlFor="obs-frequency">
                    How often has this happened?
                  </label>
                  <select
                    id="obs-frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as Frequency)}
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="demofield">
                  <label className="demofield__label" htmlFor="obs-note">
                    Note (optional)
                  </label>
                  <textarea
                    id="obs-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What happened, and what did you do?"
                  />
                </div>

                <div>
                  <button type="submit" className="button button--primary">
                    Save observation
                  </button>
                </div>
              </form>

              {confirmation && (
                <p className="demo__confirm" role="status">
                  {confirmation}
                </p>
              )}
            </div>

            <div className="demopanel">
              <div className="demopanel__head">
                <h2 className="demopanel__title">Why these fields</h2>
              </div>
              <p className="reccard__value">
                Behavior, context and frequency are the three things the interpretation depends on.
                A behavior logged once in one place and the same behavior logged repeatedly across
                several places are different product situations, and the recommendation changes
                accordingly.
              </p>
              <p className="reccard__value" style={{ marginTop: 'var(--s2)' }}>
                Free text stays optional. It is useful in the trainer conversation, but the patterns
                are built from the structured fields so they stay countable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TRENDS ---------------- */}
      {tab === 'trends' && (
        <div id="panel-trends" role="tabpanel" aria-labelledby="tab-trends">
          <div className="demogrid demogrid--2">
            <div className="demopanel">
              <div className="demopanel__head">
                <h2 className="demopanel__title">Observations by week</h2>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <caption
                    style={{
                      captionSide: 'bottom',
                      textAlign: 'left',
                      padding: '10px 0 0',
                      fontSize: 'var(--fs-micro)',
                      color: 'var(--ink-muted)',
                    }}
                  >
                    Positive observations are counted alongside concerns, so progress is visible and
                    not just problems.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Week</th>
                      <th scope="col">Total</th>
                      <th scope="col">Positive</th>
                      <th scope="col">Concern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeks.map((w) => (
                      <tr key={w.week}>
                        <td>Week {w.week}</td>
                        <td>{w.total}</td>
                        <td>{w.positive}</td>
                        <td>{w.challenge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 'var(--s3)' }}>
                {weeks.map((w) => (
                  <div className="trend" key={w.week}>
                    <div className="trend__top">
                      <span className="trend__name">Week {w.week}</span>
                      <span className="trend__evidence">
                        {w.positive} positive · {w.challenge} concern
                      </span>
                    </div>
                    <span className="trend__bar" aria-hidden="true">
                      {Array.from({ length: maxWeek }).map((_, i) => (
                        <span
                          key={i}
                          className={`trend__unit${
                            i < w.positive
                              ? ' trend__unit--pos'
                              : i < w.total
                                ? ' trend__unit--on'
                                : ''
                          }`}
                        />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="demopanel">
              <div className="demopanel__head">
                <h2 className="demopanel__title">Context breakdown</h2>
              </div>
              <div className="bars">
                {contextCounts.map((c) => (
                  <div className="bars__row" key={c.key}>
                    <span className="bars__label">{contextLabel(c.key)}</span>
                    <span className="bars__track">
                      <span
                        className="bars__fill"
                        style={{ width: `${(c.count / observations.length) * 100}%` }}
                      />
                    </span>
                    <span className="bars__value">{c.count}</span>
                  </div>
                ))}
              </div>
              <p className="meta" style={{ marginTop: 'var(--s3)' }}>
                Where a behavior happens is often more informative than how often. A concern in one
                context is a different problem from the same concern everywhere.
              </p>
            </div>
          </div>

          <div className="demopanel" style={{ marginTop: 'var(--s3)' }}>
            <div className="demopanel__head">
              <h2 className="demopanel__title">Behavior trends</h2>
              <span className="meta">every claim carries its count</span>
            </div>
            {trends.map((t) => (
              <div className="trend" key={t.behavior}>
                <div className="trend__top">
                  <span className="trend__name">
                    {t.behavior}{' '}
                    {t.positive && <span className="obstag obstag--positive">positive</span>}
                  </span>
                  <span className={`trend__dir trend__dir--${t.direction}`}>{t.direction}</span>
                </div>
                <p className="trend__evidence">{t.evidence}</p>
                {!t.positive && (
                  <button
                    type="button"
                    className="button button--quiet"
                    style={{ justifySelf: 'start', marginTop: 4 }}
                    onClick={() => {
                      setSelectedBehavior(t.behavior);
                      setTab('recommendation');
                    }}
                  >
                    See recommendation
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- RECOMMENDATION ---------------- */}
      {tab === 'recommendation' && (
        <div id="panel-recommendation" role="tabpanel" aria-labelledby="tab-recommendation">
          {!recommendation || !pipeline ? (
            <div className="demopanel">
              <p className="reccard__value">
                No concern has been logged yet, so there is nothing to interpret.
              </p>
            </div>
          ) : (
            <div className="demogrid demogrid--sidebar">
              <div>
                {pipeline.escalation.required && (
                  <div className="escalate">
                    <p className="escalate__title">Trainer review recommended</p>
                    <p className="caps escalate__label">Why escalated</p>
                    <ul className="escalate__list">
                      <li>{pipeline.escalation.reason}</li>
                      {pipeline.context.contextCount > 1 && (
                        <li>
                          Appearing in {pipeline.context.contextCount} different settings rather
                          than one.
                        </li>
                      )}
                      {pipeline.context.strongestFrequency === 'repeated' && (
                        <li>Logged as repeated at its strongest, not a one-off.</li>
                      )}
                      {pipeline.response.deferred && (
                        <li>
                          The retrieved resources do not confidently support a next-step
                          recommendation for this pattern.
                        </li>
                      )}
                    </ul>
                    <p className="caps escalate__label">Next step</p>
                    <p className="escalate__reason">
                      Bring this pattern to the trainer rather than relying on an automated
                      recommendation.
                    </p>
                  </div>
                )}

                <div className="demopanel__head">
                  <h2 className="demopanel__title">
                    Grounded recommendation — {recommendation.behavior}
                  </h2>
                  <span className="meta">
                    {pipeline.response.deferred ? 'deferred' : 'retrieval-grounded'}
                  </span>
                </div>
                <div className="reccard">
                  <div className="reccard__row">
                    <span className="reccard__label">What I&rsquo;m noticing</span>
                    <span className="reccard__value">{pipeline.response.noticing}</span>
                  </div>
                  <div className="reccard__row">
                    <span className="reccard__label">Why it may matter</span>
                    <span className="reccard__value">{pipeline.response.whyItMayMatter}</span>
                  </div>
                  <div className="reccard__row">
                    <span className="reccard__label">Suggested next step</span>
                    <span className="reccard__value">{pipeline.response.suggestedNextStep}</span>
                  </div>
                  <div className="reccard__row">
                    <span className="reccard__label">When to ask a trainer</span>
                    <span className="reccard__value">{pipeline.response.whenToAskTrainer}</span>
                  </div>
                  <div className="reccard__row">
                    <span className="reccard__label">Based on</span>
                    <span className="reccard__value">
                      {pipeline.context.observationCount} recent observation
                      {pipeline.context.observationCount === 1 ? '' : 's'} ·{' '}
                      {recommendation.contexts
                        .map((c) => `${contextLabel(c.key)} (${c.count})`)
                        .join(', ')}{' '}
                      · trend {pipeline.context.trend} ·{' '}
                      {pipeline.retrieval.results.length} retrieved resources
                    </span>
                  </div>
                </div>

                {/* ---- sources ---- */}
                <div className="demopanel" style={{ marginTop: 'var(--s3)' }}>
                  <div className="demopanel__head">
                    <h2 className="demopanel__title">Sources used</h2>
                    <span className="meta">
                      top {pipeline.retrieval.topK} of {pipeline.retrieval.corpusSize}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="whysources"
                    aria-expanded={whySources}
                    onClick={() => setWhySources((v) => !v)}
                  >
                    <span className="whysources__mark" aria-hidden="true" />
                    Why these sources?
                  </button>
                  {whySources && (
                    <p className="whysources__body">{pipeline.retrieval.whyRetrieved}</p>
                  )}
                  <ul className="sources">
                    {pipeline.retrieval.results.map((r) => (
                      <li key={r.resource.id}>
                        <details
                          className="source"
                          onToggle={(e) => {
                            if ((e.currentTarget as HTMLDetailsElement).open) {
                              track('source_opened', { resource_id: r.resource.id });
                            }
                          }}
                        >
                          <summary className="source__head">
                            <span className="source__title">{r.resource.title}</span>
                            <span className="source__cat">{r.resource.category}</span>
                            <span className={`source__rel source__rel--${r.relevance}`}>
                              {r.relevance} relevance
                            </span>
                          </summary>
                          <p className="source__body">{r.resource.content}</p>
                          <p className="source__meta">
                            {r.resource.id} · tags: {r.resource.behavior_tags.join(', ')} ·{' '}
                            {r.resource.source_type}
                          </p>
                        </details>
                      </li>
                    ))}
                  </ul>
                  <p className="meta" style={{ marginTop: 'var(--s2)' }}>
                    Synthetic, generalized demo resources written for this demonstration. Not
                    official training guidance and not any organisation&rsquo;s material.
                  </p>
                </div>

                {/* ---- pipeline trace ---- */}
                <div
                  onClick={() => track('retrieval_inspected', { behavior: recommendation.behavior })}
                  role="presentation"
                >
                  <DeeperDetail summary="Inspect how GuideAI reached this" hint="observable steps">
                    <ol className="pipeline">
                      <li>
                        <span className="pipeline__step">Structured behavior context assembled</span>
                        <span className="pipeline__val">
                          {pipeline.context.behavior} · {pipeline.context.observationCount}{' '}
                          observations · {pipeline.context.contextCount} setting
                          {pipeline.context.contextCount === 1 ? '' : 's'} ·{' '}
                          {pipeline.context.strongestFrequency} · trend {pipeline.context.trend}
                          <span className="pipestat pipestat--complete">complete</span>
                        </span>
                      </li>
                      <li>
                        <span className="pipeline__step">Retrieval query created</span>
                        <span className="pipeline__val pipeline__val--mono">
                          {pipeline.retrieval.query}
                          <span className="pipestat pipestat--complete">complete</span>
                        </span>
                      </li>
                      <li>
                        <span className="pipeline__step">Query vector built</span>
                        <span className="pipeline__val">
                          {pipeline.retrieval.embedder} · {pipeline.retrieval.dimension} dimensions
                          <span className="pipestat pipestat--complete">complete</span>
                        </span>
                      </li>
                      <li>
                        <span className="pipeline__step">Relevant resources retrieved</span>
                        <span className="pipeline__val">
                          cosine similarity over {pipeline.retrieval.corpusSize} indexed resources ·
                          top-{pipeline.retrieval.topK}
                          {pipeline.retrieval.sensitive
                            ? ' · restricted to escalation material for this behaviour'
                            : ''}
                          <span
                            className={`pipestat pipestat--${
                              pipeline.retrieval.weak ? 'weak' : 'matched'
                            }`}
                          >
                            {pipeline.retrieval.weak ? 'no strong match' : 'matched'}
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="pipeline__step">Retrieved context added</span>
                        <span className="pipeline__val pipeline__val--mono">
                          {pipeline.retrieval.results
                            .map((r) => `${r.resource.id} ${r.score.toFixed(3)}`)
                            .join('  ·  ')}
                          <span className="pipestat pipestat--complete">
                            {pipeline.retrieval.results.length} added
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="pipeline__step">Recommendation composed</span>
                        <span className="pipeline__val">
                          {pipeline.response.deferred
                            ? 'Retrieval below the relevance floor or behaviour is sensitive — asked for more observation instead of suggesting a step.'
                            : `Grounded in ${pipeline.response.sources.length} retrieved resources; every line traces to one of them.`}
                          <span
                            className={`pipestat pipestat--${
                              pipeline.response.deferred ? 'weak' : 'complete'
                            }`}
                          >
                            {pipeline.response.deferred ? 'deferred' : 'complete'}
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="pipeline__step">Escalation policy checked</span>
                        <span className="pipeline__val">
                          {pipeline.escalation.required
                            ? `Trainer review required — ${pipeline.escalation.reason}`
                            : 'No escalation condition met.'}
                          <span
                            className={`pipestat pipestat--${
                              pipeline.escalation.required ? 'escalate' : 'continue'
                            }`}
                          >
                            {pipeline.escalation.required ? 'escalate' : 'continue'}
                          </span>
                        </span>
                      </li>
                    </ol>
                    <p className="meta">
                      Observable system state only. No model reasoning text is requested, stored or
                      shown — the response is composed from retrieved resources rather than
                      generated freely, so there is none.
                    </p>
                  </DeeperDetail>
                </div>
              </div>

              <div className="demogrid">
                <div className="demopanel">
                  <div className="demopanel__head">
                    <h2 className="demopanel__title">What this is not</h2>
                  </div>
                  <p className="reccard__value">
                    GuideAI detects patterns, retrieves relevant resources, structures a next step
                    and prepares the trainer conversation. It does not diagnose, does not score the
                    dog, does not replace a trainer, and does not make autonomous decisions on
                    anything high-risk.
                  </p>
                  <p className="reccard__value" style={{ marginTop: 'var(--s2)' }}>
                    When retrieval is weak or the behaviour is one the product treats as sensitive,
                    it declines to suggest a step and asks for a trainer instead. That path is
                    exercised by the evaluation set, not just described.
                  </p>
                </div>
                <div className="demopanel">
                  <div className="demopanel__head">
                    <h2 className="demopanel__title">Index</h2>
                  </div>
                  <dl className="factorlist">
                    <div className="factorlist__row">
                      <dt className="factorlist__label">Embedder</dt>
                      <dd className="factorlist__value factorlist__value--supporting">
                        {INDEX.embedder}
                      </dd>
                    </div>
                    <div className="factorlist__row">
                      <dt className="factorlist__label">Dimension</dt>
                      <dd className="factorlist__value factorlist__value--supporting">
                        {INDEX.dimension}
                      </dd>
                    </div>
                    <div className="factorlist__row">
                      <dt className="factorlist__label">Corpus</dt>
                      <dd className="factorlist__value factorlist__value--supporting">
                        {CORPUS.length} resources
                      </dd>
                    </div>
                    <div className="factorlist__row">
                      <dt className="factorlist__label">Top-k</dt>
                      <dd className="factorlist__value factorlist__value--supporting">{TOP_K}</dd>
                    </div>
                  </dl>
                </div>
                <div className="demopanel">
                  <div className="demopanel__head">
                    <h2 className="demopanel__title">Another behaviour</h2>
                  </div>
                  <div className="demo__actions">
                    {trends
                      .filter((t) => !t.positive)
                      .map((t) => (
                        <button
                          key={t.behavior}
                          type="button"
                          className="button button--quiet"
                          aria-pressed={t.behavior === recommendation.behavior}
                          onClick={() => setSelectedBehavior(t.behavior)}
                        >
                          {t.behavior}
                        </button>
                      ))}
                  </div>
                  {hasHigherRisk && (
                    <>
                      <p className="meta" style={{ marginTop: 'var(--s2)' }}>
                        One of these is handled differently on purpose.
                      </p>
                      <button
                        type="button"
                        className="button"
                        onClick={() => setSelectedBehavior(HIGHER_RISK_BEHAVIOR)}
                      >
                        Try a higher-risk example <Arrow />
                      </button>
                    </>
                  )}
                </div>

                <div className="demopanel demopanel--payoff">
                  <div className="demopanel__head">
                    <h2 className="demopanel__title">Then prepare for the trainer</h2>
                  </div>
                  <p className="reccard__value">
                    The recommendation is the middle of the workflow. The end of it is a summary the
                    raiser can hand over, with the judgment calls named rather than answered.
                  </p>
                  <button
                    type="button"
                    className="button button--primary"
                    onClick={() => setTab('prep')}
                  >
                    Prepare for trainer <Arrow />
                  </button>
                </div>

                <div className="demopanel">
                  <div className="demopanel__head">
                    <h2 className="demopanel__title">How this is evaluated</h2>
                  </div>
                  <p className="reccard__value">
                    Recommendations are evaluated on retrieval relevance, groundedness, escalation
                    behavior and unsupported-output rate using a synthetic test set.
                  </p>
                  <p>
                    <a className="button button--quiet" href="/work/guideai#evaluation">
                      See evaluation methodology <Arrow />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- TRAINER PREP ---------------- */}
      {tab === 'prep' && (
        <div id="panel-prep" role="tabpanel" aria-labelledby="tab-prep">
          <div className="demopanel__head">
            <h2 className="demopanel__title">Trainer-prep summary — {prep.dogName}</h2>
            <button type="button" className="button button--primary" onClick={copyPrep}>
              {copied ? 'Copied' : 'Copy trainer-prep summary'}
            </button>
          </div>
          <p className="meta" style={{ marginBottom: 'var(--s3)' }}>
            {prep.window} · {prep.total} observations · generated from the list above, not written in
            advance.
          </p>

          <div className="reccard">
            <div className="reccard__row">
              <span className="reccard__label">What improved</span>
              <span className="reccard__value">
                {prep.improved.length === 0 ? (
                  <em>Nothing has moved far enough to call a change yet.</em>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
                    {prep.improved.map((t) => (
                      <li key={t.behavior}>
                        <strong>{t.behavior}</strong> — {t.evidence}
                      </li>
                    ))}
                  </ul>
                )}
              </span>
            </div>
            <div className="reccard__row">
              <span className="reccard__label">What remains difficult</span>
              <span className="reccard__value">
                {prep.stillDifficult.length === 0 ? (
                  <em>No behavior is currently trending the wrong way.</em>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
                    {prep.stillDifficult.map((t) => (
                      <li key={t.behavior}>
                        <strong>{t.behavior}</strong> — {t.evidence}
                      </li>
                    ))}
                  </ul>
                )}
              </span>
            </div>
            <div className="reccard__row">
              <span className="reccard__label">Patterns by context</span>
              <span className="reccard__value">
                {prep.contextPatterns.map((c) => `${contextLabel(c.key)} (${c.count})`).join(' · ')}
              </span>
            </div>
            <div className="reccard__row">
              <span className="reccard__label">Items requiring trainer judgment</span>
              <span className="reccard__value">
                {prep.needsTrainerJudgment.length === 0 ? (
                  <em>None flagged from this window.</em>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
                    {prep.needsTrainerJudgment.map((n) => (
                      <li key={n.behavior}>
                        <strong>{n.behavior}</strong> — {n.reason}
                      </li>
                    ))}
                  </ul>
                )}
              </span>
            </div>
            <div className="reccard__row">
              <span className="reccard__label">Questions for trainer</span>
              <span className="reccard__value">
                <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
                  {prep.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </span>
            </div>
            <div className="reccard__row">
              <span className="reccard__label">Sources / evidence used</span>
              <span className="reccard__value">
                {pipeline ? (
                  <>
                    Recommendation for <strong>{pipeline.context.behavior}</strong> drew on{' '}
                    {pipeline.retrieval.results.length} retrieved resources:{' '}
                    {pipeline.retrieval.results.map((r) => r.resource.title).join(' · ')}.{' '}
                    <em>
                      Synthetic demo resources, not official training guidance.
                    </em>
                  </>
                ) : (
                  <em>No recommendation has been generated in this session yet.</em>
                )}
              </span>
            </div>
            <div className="reccard__row">
              <span className="reccard__label">Representative observations</span>
              <span className="reccard__value">
                <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
                  {prep.representative.map((o) => (
                    <li key={o.id}>
                      {o.date} · {o.behavior} · {contextLabel(o.context)} · {o.frequency}
                    </li>
                  ))}
                </ul>
              </span>
            </div>
          </div>

          <p className="meta" style={{ marginTop: 'var(--s3)' }}>
            This is the artifact the original workflow was missing: weeks of individual observations
            turned into something a raiser can hand a trainer, with the judgment calls named rather
            than answered.
          </p>
        </div>
      )}
      <div className="demo__actions demo__actions--footer">
        <button type="button" className="button button--quiet" onClick={reset}>
          Reset demo
        </button>
        <span className="meta">
          {observations.length} observations · {DOG.name} · {DOG.age_group} · {DOG.breed}
        </span>
      </div>
    </>
  );
}
