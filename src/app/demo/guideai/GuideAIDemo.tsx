'use client';

import { useMemo, useState } from 'react';
import DemoTabs from '@/components/DemoTabs';
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

type Tab = 'overview' | 'log' | 'trends' | 'recommendation' | 'prep';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'log', label: 'Log observation' },
  { id: 'trends', label: 'Trends' },
  { id: 'recommendation', label: 'Recommendation' },
  { id: 'prep', label: 'Trainer prep' },
];

export default function GuideAIDemo() {
  const [observations, setObservations] = useState<Observation[]>(SEED_OBSERVATIONS);
  const [tab, setTab] = useState<Tab>('overview');
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedBehavior, setSelectedBehavior] = useState<string | null>(null);

  const trends = useMemo(() => behaviorTrends(observations), [observations]);
  const weeks = useMemo(() => weeklyBuckets(observations), [observations]);
  const focus = useMemo(() => focusBehavior(observations), [observations]);
  const recBehavior = selectedBehavior ?? focus;
  const recommendation = useMemo(
    () => (recBehavior ? buildRecommendation(observations, recBehavior) : null),
    [observations, recBehavior],
  );
  const prep = useMemo(() => buildTrainerPrep(observations, DOG.name), [observations]);
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
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const maxWeek = Math.max(1, ...weeks.map((w) => w.total));

  return (
    <>
      <div className="demo__actions" style={{ marginBottom: 'var(--s4)' }}>
        <button type="button" className="button button--quiet" onClick={reset}>
          Reset demo
        </button>
        <span className="meta">
          {observations.length} observations · {DOG.name} · {DOG.age_group} · {DOG.breed}
        </span>
      </div>

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

              <div className="demo__actions">
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => setTab('log')}
                >
                  Log an observation
                </button>
                <button type="button" className="button" onClick={() => setTab('prep')}>
                  Prepare for trainer
                </button>
              </div>
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
          {!recommendation ? (
            <div className="demopanel">
              <p className="reccard__value">
                No concern has been logged yet, so there is nothing to interpret.
              </p>
            </div>
          ) : (
            <div className="demogrid demogrid--sidebar">
              <div>
                <div className="demopanel__head">
                  <h2 className="demopanel__title">
                    Structured recommendation — {recommendation.behavior}
                  </h2>
                </div>
                <div className="reccard">
                  <div className="reccard__row">
                    <span className="reccard__label">What I&rsquo;m noticing</span>
                    <span className="reccard__value">{recommendation.noticing}</span>
                  </div>
                  <div className="reccard__row">
                    <span className="reccard__label">Why it may matter</span>
                    <span className="reccard__value">{recommendation.whyItMayMatter}</span>
                  </div>
                  <div className="reccard__row">
                    <span className="reccard__label">Suggested next step</span>
                    <span className="reccard__value">
                      {recommendation.suggestedNextStep}
                      {recommendation.plan && (
                        <>
                          {' '}
                          <strong>Also worth recording:</strong> {recommendation.plan.routine}
                        </>
                      )}
                    </span>
                  </div>
                  <div className="reccard__row">
                    <span className="reccard__label">When to ask a trainer</span>
                    <span className="reccard__value">{recommendation.whenToAskTrainer}</span>
                  </div>
                  <div className="reccard__row">
                    <span className="reccard__label">Based on</span>
                    <span className="reccard__value">
                      {recommendation.basedOn.length} observation
                      {recommendation.basedOn.length === 1 ? '' : 's'} ·{' '}
                      {recommendation.contexts
                        .map((c) => `${contextLabel(c.key)} (${c.count})`)
                        .join(', ')}
                    </span>
                  </div>
                </div>
                <p className="meta" style={{ marginTop: 'var(--s2)' }}>
                  The wording in this card is illustrative copy written for the demonstration. In
                  the product this slot is filled from a trainer-approved resource set; nothing here
                  is training guidance.
                </p>

                <div className="demopanel" style={{ marginTop: 'var(--s3)' }}>
                  <div className="demopanel__head">
                    <h2 className="demopanel__title">The observations underneath</h2>
                  </div>
                  <ul className="obslist">
                    {[...recommendation.basedOn].reverse().map((o) => (
                      <li key={o.id}>
                        <div className="obslist__top">
                          <span className="obslist__behavior">{o.behavior}</span>
                          <span className="obstag">{contextLabel(o.context)}</span>
                          <span className="obstag">{o.frequency}</span>
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

              <div className="demogrid">
                <div className="demopanel">
                  <div className="demopanel__head">
                    <h2 className="demopanel__title">What this is not</h2>
                  </div>
                  <p className="reccard__value">
                    GuideAI does not diagnose the dog, does not compute a behavioral or risk score,
                    and does not issue training commands. It reads the observations the raiser
                    logged, matches the closest interpretation, and names the point at which a
                    trainer should be involved.
                  </p>
                  <p className="reccard__value" style={{ marginTop: 'var(--s2)' }}>
                    That constraint is the product decision. It is why the last row of the card is
                    always &ldquo;when to ask a trainer&rdquo; rather than a verdict.
                  </p>
                </div>
                <div className="demopanel">
                  <div className="demopanel__head">
                    <h2 className="demopanel__title">Another behavior</h2>
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
              {copied ? 'Copied' : 'Copy summary'}
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
              <span className="reccard__label">Context patterns</span>
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
    </>
  );
}
