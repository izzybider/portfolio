'use client';

import { useMemo, useState } from 'react';
import DemoTabs from '@/components/DemoTabs';
import DeeperDetail from '@/components/DeeperDetail';
import AgentRun from '@/components/AgentRun';
import RunSummary from '@/components/RunSummary';
import Arrow from '@/components/Arrow';
import { runSystem, type Run } from '@/lib/trustlayer/pipeline';
import { POLICY_PROFILES, type PolicyProfile } from '@/lib/trustlayer/config';
import {
  DEMO_SCENARIOS,
  FAILURE_LAB_SCENARIOS,
  CATEGORY_LABELS,
  CATEGORY_TESTS,
  RECOMMENDED_SCENARIO_ID,
} from '@/lib/trustlayer/scenarios';
import { TOOL_CATALOG } from '@/lib/trustlayer/tools';
import type { Scenario, SystemVariant } from '@/lib/trustlayer/types';

type Tab = 'run' | 'compare' | 'lab' | 'policy';

const TABS: { id: Tab; label: string }[] = [
  { id: 'run', label: 'Agent run' },
  { id: 'compare', label: 'Compare systems' },
  { id: 'lab', label: 'Failure lab' },
  { id: 'policy', label: 'Policy' },
];

const PROFILES: PolicyProfile[] = ['conservative', 'balanced', 'autonomous'];

const SYSTEM_LABELS: Record<SystemVariant, string> = {
  direct_llm: 'Direct LLM',
  rag_agent: 'RAG agent',
  trustlayer: 'TrustLayer',
};

/* The trace has a fixed shape: request, interpret, evidence, authorization,
   risk, decision, one row per tool call, an optional re-decision, and the
   final behavior. Counting it here keeps the disclosure label honest when a
   scenario calls a different number of tools. */
function runStepCount(run: Run): number {
  return 7 + run.tool_calls.length + (run.post_verification_decision ? 1 : 0);
}

const RECOMMENDED =
  DEMO_SCENARIOS.find((s) => s.id === RECOMMENDED_SCENARIO_ID) ?? DEMO_SCENARIOS[0];

function ScenarioPicker({
  scenarios,
  selectedId,
  onSelect,
  idPrefix,
}: {
  scenarios: Scenario[];
  selectedId: string;
  onSelect: (s: Scenario) => void;
  idPrefix: string;
}) {
  return (
    <div className="scenariogrid">
      {scenarios.map((s) => (
        <button
          key={`${idPrefix}-${s.id}`}
          type="button"
          className="scenariocard"
          aria-pressed={s.id === selectedId}
          onClick={() => onSelect(s)}
        >
          <span className="scenariocard__cat">
            {CATEGORY_LABELS[s.category] ?? s.category} · {s.risk_level} risk
          </span>
          <span className="scenariocard__req">&ldquo;{s.user_request}&rdquo;</span>
          <span className="scenariocard__tests">
            {CATEGORY_TESTS[s.category] ?? 'Tests policy behavior'}
          </span>
        </button>
      ))}
    </div>
  );
}

/** Observable decision state — never model reasoning text. */
function AgentStatePanel({
  scenario,
  profile,
}: {
  scenario: Scenario;
  profile: PolicyProfile;
}) {
  const run = useMemo(
    () =>
      runSystem(
        'trustlayer',
        { user_request: scenario.user_request, context: scenario.context },
        POLICY_PROFILES[profile],
      ),
    [scenario, profile],
  );
  const s = run.state;
  const effective = run.post_verification_decision ?? run.decision;
  const rows: [string, string][] = [
    ['Task type', s.task_type.replace(/_/g, ' ')],
    ['Domain', s.domain],
    ['Risk', s.risk_level],
    ['Reversibility', s.reversible.replace(/_/g, ' ')],
    ['Evidence sufficiency', s.evidence_status.replace(/_/g, ' ')],
    [
      'Authorization',
      s.authorization_required ? s.authorization_status.replace(/_/g, ' ') : 'not required',
    ],
    ['Information gap', s.information_gap.replace(/_/g, ' ')],
    [
      'Classification confidence',
      `${(s.classification_confidence * 100).toFixed(0)}% (threshold ${(
        POLICY_PROFILES[profile].min_confidence_for_autonomy * 100
      ).toFixed(0)}%)`,
    ],
    ['Rule triggered', run.decision.rule_id],
    ['Current route', effective.decision],
  ];

  return (
    <DeeperDetail summary="Inspect agent state" hint="observable decision state">
      <dl className="factorlist">
        {rows.map(([k, v]) => (
          <div className="factorlist__row" key={k}>
            <dt className="factorlist__label">{k}</dt>
            <dd className="factorlist__value factorlist__value--supporting">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="meta">
        These are product-policy facts the system acts on. The source
        implementation never requests, stores or displays model reasoning text,
        so there is none to show.
      </p>
    </DeeperDetail>
  );
}

export default function TrustLayerDemo() {
  const [tab, setTab] = useState<Tab>('run');
  const [profile, setProfile] = useState<PolicyProfile>('balanced');
  const [scenario, setScenario] = useState<Scenario>(RECOMMENDED);
  const [labScenario, setLabScenario] = useState<Scenario>(FAILURE_LAB_SCENARIOS[0]);
  const [started, setStarted] = useState(false);
  /* bumped on every run so the reveal restarts even for the same scenario */
  const [runKey, setRunKey] = useState(0);

  const run = useMemo(
    () =>
      runSystem(
        'trustlayer',
        { user_request: scenario.user_request, context: scenario.context },
        POLICY_PROFILES[profile],
      ),
    [scenario, profile],
  );

  const labRun = useMemo(
    () =>
      runSystem(
        'trustlayer',
        { user_request: labScenario.user_request, context: labScenario.context },
        POLICY_PROFILES[profile],
      ),
    [labScenario, profile],
  );

  const profileRuns = useMemo(
    () =>
      PROFILES.map((p) => ({
        profile: p,
        run: runSystem(
          'trustlayer',
          { user_request: scenario.user_request, context: scenario.context },
          POLICY_PROFILES[p],
        ),
      })),
    [scenario],
  );
  const profileVaries =
    new Set(profileRuns.map((r) => `${r.run.decision.decision}/${r.run.final.behavior}`)).size > 1;

  const systemRuns = useMemo(
    () =>
      (['direct_llm', 'rag_agent', 'trustlayer'] as SystemVariant[]).map((system) => ({
        system,
        run: runSystem(
          system,
          { user_request: scenario.user_request, context: scenario.context },
          POLICY_PROFILES[profile],
        ),
      })),
    [scenario, profile],
  );

  const select = (s: Scenario) => {
    setScenario(s);
    setStarted(true);
    setRunKey((k) => k + 1);
  };

  const reset = () => {
    setProfile('balanced');
    setScenario(RECOMMENDED);
    setLabScenario(FAILURE_LAB_SCENARIOS[0]);
    setStarted(false);
    setTab('run');
    setRunKey((k) => k + 1);
  };

  const profileSwitch = (
    <div className="demo__actions" style={{ marginBottom: 'var(--s2)' }}>
      <div className="profileswitch" role="group" aria-label="Autonomy profile">
        {PROFILES.map((p) => (
          <button
            key={p}
            type="button"
            className="profileswitch__btn"
            aria-pressed={p === profile}
            onClick={() => {
              setProfile(p);
              setRunKey((k) => k + 1);
            }}
          >
            {POLICY_PROFILES[p].label}
          </button>
        ))}
      </div>
      <button type="button" className="button button--quiet" onClick={reset}>
        Reset demo
      </button>
    </div>
  );

  return (
    <>
      {profileSwitch}
      <p className="meta" style={{ marginBottom: 'var(--s4)' }}>
        {POLICY_PROFILES[profile].summary}
      </p>

      <DemoTabs tabs={TABS} active={tab} onChange={setTab} label="TrustLayer demo sections" />

      {/* ---------------- AGENT RUN ---------------- */}
      {tab === 'run' && (
        <div id="panel-run" role="tabpanel" aria-labelledby="tab-run">
          {!started ? (
            <>
              <div className="firstrun">
                <p className="caps" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                  Try a 30-second run
                </p>
                <h2 className="firstrun__title">{RECOMMENDED.title}</h2>
                <p className="firstrun__req">&ldquo;{RECOMMENDED.user_request}&rdquo;</p>
                <p className="reccard__value" style={{ marginBottom: 'var(--s3)' }}>
                  Watch the policy check the evidence, the authorization and the reversibility,
                  route to <strong>VERIFY</strong>, call two simulated tools, fold what they return
                  back into its state, and decide again — ending in{' '}
                  <strong>ESCALATE</strong> because the acting role is not permitted to make this
                  change.
                </p>
                <div className="demo__actions">
                  <button
                    type="button"
                    className="button button--primary"
                    onClick={() => select(RECOMMENDED)}
                  >
                    Run this scenario <Arrow />
                  </button>
                  <button
                    type="button"
                    className="button button--quiet"
                    onClick={() => setStarted(true)}
                  >
                    Explore all scenarios
                  </button>
                </div>
              </div>

              <p className="meta">
                Eight requests are available, spanning all four behaviors. Nothing external is
                called and no model runs — the classifier and the policy are both deterministic.
              </p>
            </>
          ) : (
            <>
              <p className="caps" style={{ color: 'var(--ink-muted)', marginBottom: 10 }}>
                Pick a request
              </p>
              <ScenarioPicker
                scenarios={DEMO_SCENARIOS}
                selectedId={scenario.id}
                onSelect={select}
                idPrefix="main"
              />

              {/* Plain-English account first, the ten-step trace behind a
                  disclosure — recruiter comprehension before inspectability. */}
              <div style={{ marginTop: 'var(--s4)' }}>
                <RunSummary key={`sum-${scenario.id}-${profile}-${runKey}`} run={run} />
              </div>

              <div style={{ marginTop: 'var(--s3)' }}>
                <DeeperDetail
                  summary={`Inspect the full ${runStepCount(run)}-step trace`}
                  hint="every check, tool call and state change"
                >
                  <AgentRun key={`${scenario.id}-${profile}-${runKey}`} run={run} />
                </DeeperDetail>
              </div>

              <div style={{ marginTop: 'var(--s3)' }}>
                <AgentStatePanel scenario={scenario} profile={profile} />
              </div>

              <div className="demopanel" style={{ marginTop: 'var(--s3)' }}>
                <div className="demopanel__head">
                  <h2 className="demopanel__title">Same request, three autonomy profiles</h2>
                  <span className="meta">
                    {profileVaries ? 'the profile changes the outcome here' : 'unchanged here'}
                  </span>
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
                      More autonomy does not automatically improve task completion when evidence or
                      authorization is missing — on the benchmark reported in the case study,
                      loosening the policy changed where the system escalated rather than whether it
                      did.
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Profile</th>
                        <th scope="col">Initial behavior</th>
                        <th scope="col">Tool use</th>
                        <th scope="col">Final behavior</th>
                        <th scope="col">Changed?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profileRuns.map(({ profile: p, run: r }, i) => {
                        const base = profileRuns[1].run; /* Balanced is the default */
                        const changed =
                          i !== 1 &&
                          (r.decision.decision !== base.decision.decision ||
                            r.final.behavior !== base.final.behavior);
                        return (
                          <tr key={p}>
                            <td>
                              {POLICY_PROFILES[p].label}
                              {p === profile ? ' ·' : ''}
                            </td>
                            <td>{r.decision.decision}</td>
                            <td>
                              {r.tool_calls.length
                                ? `${r.tool_calls.length} tool${r.tool_calls.length === 1 ? '' : 's'}`
                                : 'none'}
                            </td>
                            <td>
                              <strong>{r.final.behavior}</strong>
                            </td>
                            <td>{i === 1 ? 'baseline' : changed ? 'yes' : 'no'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="demopanel" style={{ marginTop: 'var(--s3)' }}>
                <div className="demopanel__head">
                  <h2 className="demopanel__title">The label on this scenario</h2>
                  <span className="meta">expected: {scenario.expected_behavior}</span>
                </div>
                <p className="reccard__value">{scenario.explanation}</p>
                <p className="meta" style={{ marginTop: 'var(--s2)' }}>
                  Labels were written before the engine was tuned against them. Where the engine
                  disagrees, the disagreement is shown rather than relabelled.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------------- COMPARE ---------------- */}
      {tab === 'compare' && (
        <div id="panel-compare" role="tabpanel" aria-labelledby="tab-compare">
          <p className="caps" style={{ color: 'var(--ink-muted)', marginBottom: 10 }}>
            Pick a request
          </p>
          <ScenarioPicker
            scenarios={DEMO_SCENARIOS}
            selectedId={scenario.id}
            onSelect={select}
            idPrefix="cmp"
          />

          <div className="demopanel" style={{ marginTop: 'var(--s4)' }}>
            <div className="demopanel__head">
              <h2 className="demopanel__title">Same request, three systems</h2>
              <span className="meta">Synthetic comparison</span>
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
                  Behavior on one synthetic scenario with simulated tools. Not production
                  performance and not a user outcome. &ldquo;Supported&rdquo; means the user did not
                  end up with an answer the scenario says was not answerable.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">System</th>
                    <th scope="col">Initial behavior</th>
                    <th scope="col">Evidence used?</th>
                    <th scope="col">Tool use?</th>
                    <th scope="col">Final behavior</th>
                    <th scope="col">Supported?</th>
                  </tr>
                </thead>
                <tbody>
                  {systemRuns.map(({ system, run: r }) => {
                    const usedEvidence =
                      r.tool_results.some((t) => t.status === 'ok') ||
                      r.state.available_evidence.length > 0;
                    const unsupported =
                      r.final.behavior === 'ANSWER' &&
                      !scenario.acceptable_behaviors.includes('ANSWER') &&
                      !(r.decision.decision === 'VERIFY' && r.tool_results.length > 0);
                    return (
                      <tr key={system}>
                        <td>
                          <strong>{SYSTEM_LABELS[system]}</strong>
                        </td>
                        <td>{r.decision.decision}</td>
                        <td>{usedEvidence ? 'yes' : 'no'}</td>
                        <td>
                          {r.tool_calls.length
                            ? `${r.tool_calls.length} tool${r.tool_calls.length === 1 ? '' : 's'}`
                            : 'no'}
                        </td>
                        <td>{r.final.behavior}</td>
                        <td>{unsupported ? 'unsupported' : 'supported'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="demogrid demogrid--3" style={{ marginTop: 'var(--s3)' }}>
            {systemRuns.map(({ system, run: r }) => (
              <div className="demopanel" key={system}>
                <div className="demopanel__head">
                  <h2 className="demopanel__title">{SYSTEM_LABELS[system]}</h2>
                </div>
                <p className="meta" style={{ marginBottom: 8 }}>
                  {r.decision.rule_id}
                </p>
                <p className="reccard__value">{r.final.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- FAILURE LAB ---------------- */}
      {tab === 'lab' && (
        <div id="panel-lab" role="tabpanel" aria-labelledby="tab-lab">
          <p className="reccard__value" style={{ maxWidth: 'var(--measure)' }}>
            Harder requests where the correct product behavior is usually <em>not</em> to act:
            irreversible actions, authorization that cannot be established, and requests where
            nothing is known yet. Not every case resolves into an answer, and that is the point.
          </p>
          <div style={{ marginTop: 'var(--s3)', marginBottom: 'var(--s4)' }}>
            <ScenarioPicker
              scenarios={FAILURE_LAB_SCENARIOS}
              selectedId={labScenario.id}
              onSelect={(s) => {
                setLabScenario(s);
                setRunKey((k) => k + 1);
              }}
              idPrefix="lab"
            />
          </div>
          <AgentRun key={`${labScenario.id}-${profile}-${runKey}`} run={labRun} />
          <div style={{ marginTop: 'var(--s3)' }}>
            <AgentStatePanel scenario={labScenario} profile={profile} />
          </div>
        </div>
      )}

      {/* ---------------- POLICY ---------------- */}
      {tab === 'policy' && (
        <div id="panel-policy" role="tabpanel" aria-labelledby="tab-policy">
          <div className="demogrid demogrid--2">
            <div className="demopanel">
              <div className="demopanel__head">
                <h2 className="demopanel__title">The four behaviors</h2>
              </div>
              <dl className="factorlist">
                <div className="factorlist__row">
                  <dt className="factorlist__label">
                    <strong>ANSWER</strong>
                  </dt>
                  <dd className="factorlist__value factorlist__value--supporting">
                    evidence covers it, risk in band
                  </dd>
                </div>
                <div className="factorlist__row">
                  <dt className="factorlist__label">
                    <strong>ASK</strong>
                  </dt>
                  <dd className="factorlist__value factorlist__value--supporting">
                    the user can close the gap
                  </dd>
                </div>
                <div className="factorlist__row">
                  <dt className="factorlist__label">
                    <strong>VERIFY</strong>
                  </dt>
                  <dd className="factorlist__value factorlist__value--supporting">
                    a system of record can
                  </dd>
                </div>
                <div className="factorlist__row">
                  <dt className="factorlist__label">
                    <strong>ESCALATE</strong>
                  </dt>
                  <dd className="factorlist__value factorlist__value--supporting">
                    a human owns this decision
                  </dd>
                </div>
              </dl>
              <p className="meta" style={{ marginTop: 'var(--s3)' }}>
                VERIFY is not a refusal. It is an evidence-gathering state that can unlock a
                supported action inside the same turn.
              </p>
            </div>

            <div className="demopanel">
              <div className="demopanel__head">
                <h2 className="demopanel__title">Autonomy profiles</h2>
              </div>
              {PROFILES.map((p) => (
                <div className="trend" key={p}>
                  <div className="trend__top">
                    <span className="trend__name">{POLICY_PROFILES[p].label}</span>
                    {p === profile && (
                      <span className="trend__dir trend__dir--improving">active</span>
                    )}
                  </div>
                  <p className="trend__evidence">{POLICY_PROFILES[p].summary}</p>
                </div>
              ))}
              <p className="meta" style={{ marginTop: 'var(--s3)' }}>
                Switch profiles above and re-run a scenario. More autonomy does not automatically
                improve task completion when evidence or authorization is missing.
              </p>
            </div>
          </div>

          <div className="demopanel" style={{ marginTop: 'var(--s3)' }}>
            <div className="demopanel__head">
              <h2 className="demopanel__title">Simulated tool registry</h2>
              <span className="meta">closed set of {TOOL_CATALOG.length} functions</span>
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
                  Each tool reads a local JSON fixture, validates its own arguments and reports a
                  status rather than throwing. The tool plan is derived from structured state, never
                  from free-form model output, so nothing outside this registry can be called.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Tool</th>
                    <th scope="col">What it reads</th>
                  </tr>
                </thead>
                <tbody>
                  {TOOL_CATALOG.map((t) => (
                    <tr key={t.name}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{t.name}</td>
                      <td>{t.dataSource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
