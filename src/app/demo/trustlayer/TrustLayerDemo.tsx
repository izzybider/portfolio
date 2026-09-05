'use client';

import { useMemo, useState } from 'react';
import DemoTabs from '@/components/DemoTabs';
import DeeperDetail from '@/components/DeeperDetail';
import { runSystem } from '@/lib/trustlayer/pipeline';
import { POLICY_PROFILES, type PolicyProfile } from '@/lib/trustlayer/config';
import {
  DEMO_SCENARIOS,
  FAILURE_LAB_SCENARIOS,
  CATEGORY_LABELS,
} from '@/lib/trustlayer/scenarios';
import { TOOL_CATALOG } from '@/lib/trustlayer/tools';
import type { Scenario, SystemVariant } from '@/lib/trustlayer/types';

type Tab = 'decide' | 'compare' | 'lab' | 'policy';

const TABS: { id: Tab; label: string }[] = [
  { id: 'decide', label: 'Decide' },
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

function DecisionBadge({ behavior }: { behavior: string }) {
  return (
    <div className={`decisionbig${behavior === 'ANSWER' ? '' : ' decisionbig--accent'}`}>
      <span className="decisionbig__route">{behavior}</span>
    </div>
  );
}

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
        </button>
      ))}
    </div>
  );
}

function RunView({ scenario, profile }: { scenario: Scenario; profile: PolicyProfile }) {
  const run = useMemo(
    () =>
      runSystem(
        'trustlayer',
        { user_request: scenario.user_request, context: scenario.context },
        POLICY_PROFILES[profile],
      ),
    [scenario, profile],
  );

  const initial = run.decision;
  const post = run.post_verification_decision;
  const effective = post ?? initial;

  return (
    <>
      <div className="demopanel">
        <div className="demopanel__head">
          <h2 className="demopanel__title">Request</h2>
          <span className="meta">{CATEGORY_LABELS[scenario.category] ?? scenario.category}</span>
        </div>
        <p className="reccard__value">&ldquo;{scenario.user_request}&rdquo;</p>
      </div>

      <div className="demogrid demogrid--sidebar" style={{ marginTop: 'var(--s3)' }}>
        <div>
          <div className="demopanel">
            <div className="demopanel__head">
              <h2 className="demopanel__title">Policy check</h2>
              <span className="meta">what the policy reads before generating</span>
            </div>
            <dl className="factorlist">
              {initial.factors.map((f) => (
                <div className="factorlist__row" key={f.label}>
                  <dt className="factorlist__label">
                    <span className={`factorflag factorflag--${f.weight}`} aria-hidden="true" />
                    {f.label}
                  </dt>
                  <dd className={`factorlist__value factorlist__value--${f.weight}`}>
                    {f.value}
                    <span className="visually-hidden"> ({f.weight})</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {run.tool_results.length > 0 && (
            <div className="demopanel" style={{ marginTop: 'var(--s3)' }}>
              <div className="demopanel__head">
                <h2 className="demopanel__title">Simulated tools</h2>
                <span className="meta">local fixtures — nothing external is called</span>
              </div>
              {run.tool_calls.map((call, i) => {
                const result = run.tool_results[i];
                return (
                  <div className="trend" key={call.id}>
                    <div className="trend__top">
                      <span className="trend__name" style={{ fontFamily: 'var(--font-mono)' }}>
                        {call.tool}(
                        {Object.entries(call.args)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                        )
                      </span>
                      <span className="trend__dir">{result?.status}</span>
                    </div>
                    <p className="trend__evidence">{result?.summary}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="demogrid">
          <div>
            <p className="caps" style={{ color: 'var(--ink-muted)', marginBottom: 8 }}>
              {post ? 'Initial route' : 'Route'}
            </p>
            <DecisionBadge behavior={initial.decision} />
            <p className="meta" style={{ marginTop: 8 }}>
              Rule {initial.rule_id}
            </p>
          </div>

          {post && (
            <div>
              <p className="caps" style={{ color: 'var(--ink-muted)', marginBottom: 8 }}>
                After verification
              </p>
              <DecisionBadge behavior={post.decision} />
              <p className="meta" style={{ marginTop: 8 }}>
                Rule {post.rule_id}
              </p>
            </div>
          )}

          <div className="demopanel">
            <div className="demopanel__head">
              <h2 className="demopanel__title">Why this route</h2>
            </div>
            <p className="reccard__value">{effective.reason}</p>
            <p className="reccard__value" style={{ marginTop: 'var(--s2)' }}>
              <strong>Next:</strong> {effective.next_step}
            </p>
          </div>

          <div className="demopanel">
            <div className="demopanel__head">
              <h2 className="demopanel__title">What the user gets</h2>
              <span className="meta">{run.final.behavior}</span>
            </div>
            <p className="reccard__value">
              <strong>{run.final.headline}.</strong> {run.final.body}
            </p>
          </div>
        </div>
      </div>

      <DeeperDetail summary="Show decision trace" hint="every step, in order">
        <div className="trace">
          <div className="trace__head">
            <span className="trace__title">{scenario.id}</span>
            <span className="trace__id">
              {POLICY_PROFILES[profile].label} policy · deterministic
            </span>
          </div>
          {run.trace.map((event) => (
            <div
              className={`trace__row${event.step === 'decision' ? ' trace__row--decision' : ''}`}
              key={event.id}
            >
              <span className="trace__step">{event.title}</span>
              <span className="trace__value">{event.detail}</span>
            </div>
          ))}
        </div>
        <p className="meta">
          The trace records observable policy inputs and the rule that fired. It never contains
          model reasoning text — the source system does not request or store any.
        </p>
      </DeeperDetail>

      <div className="demopanel" style={{ marginTop: 'var(--s3)' }}>
        <div className="demopanel__head">
          <h2 className="demopanel__title">The label on this scenario</h2>
          <span className="meta">expected: {scenario.expected_behavior}</span>
        </div>
        <p className="reccard__value">{scenario.explanation}</p>
        <p className="meta" style={{ marginTop: 'var(--s2)' }}>
          Labels were written before the engine was tuned against them. Where the engine disagrees,
          the disagreement is shown rather than relabelled.
        </p>
      </div>
    </>
  );
}

export default function TrustLayerDemo() {
  const [tab, setTab] = useState<Tab>('decide');
  const [profile, setProfile] = useState<PolicyProfile>('balanced');
  const [scenario, setScenario] = useState<Scenario>(DEMO_SCENARIOS[3]);
  const [labScenario, setLabScenario] = useState<Scenario>(FAILURE_LAB_SCENARIOS[0]);

  /* the same scenario under all three profiles */
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
  const profileVaries = new Set(profileRuns.map((r) => r.run.final.behavior)).size > 1;

  /* the same scenario through all three systems */
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

  const reset = () => {
    setProfile('balanced');
    setScenario(DEMO_SCENARIOS[3]);
    setLabScenario(FAILURE_LAB_SCENARIOS[0]);
    setTab('decide');
  };

  return (
    <>
      <div className="demo__actions" style={{ marginBottom: 'var(--s3)' }}>
        <div
          className="profileswitch"
          role="group"
          aria-label="Autonomy profile"
        >
          {PROFILES.map((p) => (
            <button
              key={p}
              type="button"
              className="profileswitch__btn"
              aria-pressed={p === profile}
              onClick={() => setProfile(p)}
            >
              {POLICY_PROFILES[p].label}
            </button>
          ))}
        </div>
        <button type="button" className="button button--quiet" onClick={reset}>
          Reset demo
        </button>
      </div>
      <p className="meta" style={{ marginBottom: 'var(--s4)' }}>
        {POLICY_PROFILES[profile].summary}
      </p>

      <DemoTabs tabs={TABS} active={tab} onChange={setTab} label="TrustLayer demo sections" />

      {/* ---------------- DECIDE ---------------- */}
      {tab === 'decide' && (
        <div id="panel-decide" role="tabpanel" aria-labelledby="tab-decide">
          <p className="caps" style={{ color: 'var(--ink-muted)', marginBottom: 10 }}>
            Pick a request
          </p>
          <ScenarioPicker
            scenarios={DEMO_SCENARIOS}
            selectedId={scenario.id}
            onSelect={setScenario}
            idPrefix="main"
          />
          <div style={{ marginTop: 'var(--s4)' }}>
            <RunView scenario={scenario} profile={profile} />
          </div>

          {profileVaries && (
            <div className="demopanel" style={{ marginTop: 'var(--s3)' }}>
              <div className="demopanel__head">
                <h2 className="demopanel__title">This scenario changes with the profile</h2>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Profile</th>
                      <th scope="col">Route</th>
                      <th scope="col">Rule</th>
                      <th scope="col">User ends with</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileRuns.map(({ profile: p, run }) => (
                      <tr key={p}>
                        <td>{POLICY_PROFILES[p].label}</td>
                        <td>{run.decision.decision}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                          {run.decision.rule_id}
                        </td>
                        <td>{run.final.behavior}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
            onSelect={setScenario}
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
                  Behavior on one synthetic scenario with simulated tools. This is not production
                  performance and not a user outcome.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">System</th>
                    <th scope="col">Route</th>
                    <th scope="col">Used evidence</th>
                    <th scope="col">Escalated</th>
                    <th scope="col">Ends in an unsupported answer</th>
                  </tr>
                </thead>
                <tbody>
                  {systemRuns.map(({ system, run }) => {
                    const usedEvidence =
                      run.tool_results.some((r) => r.status === 'ok') ||
                      run.state.available_evidence.length > 0;
                    const escalated = run.final.behavior === 'ESCALATE';
                    /* "Unsupported" mirrors the source harness: the user ends
                       with an answer where the label says answering was not an
                       acceptable behavior. */
                    const unsupported =
                      run.final.behavior === 'ANSWER' &&
                      !scenario.acceptable_behaviors.includes('ANSWER') &&
                      !(run.decision.decision === 'VERIFY' && run.tool_results.length > 0);
                    return (
                      <tr key={system}>
                        <td>
                          <strong>{SYSTEM_LABELS[system]}</strong>
                        </td>
                        <td>{run.final.behavior}</td>
                        <td>{usedEvidence ? 'yes' : 'no'}</td>
                        <td>{escalated ? 'yes' : 'no'}</td>
                        <td>{unsupported ? 'yes' : 'no'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="demogrid demogrid--3" style={{ marginTop: 'var(--s3)' }}>
            {systemRuns.map(({ system, run }) => (
              <div className="demopanel" key={system}>
                <div className="demopanel__head">
                  <h2 className="demopanel__title">{SYSTEM_LABELS[system]}</h2>
                </div>
                <p className="meta" style={{ marginBottom: 8 }}>
                  {run.decision.rule_id}
                </p>
                <p className="reccard__value">{run.final.body}</p>
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
              onSelect={setLabScenario}
              idPrefix="lab"
            />
          </div>
          <RunView scenario={labScenario} profile={profile} />
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
                    {p === profile && <span className="trend__dir trend__dir--improving">active</span>}
                  </div>
                  <p className="trend__evidence">{POLICY_PROFILES[p].summary}</p>
                </div>
              ))}
              <p className="meta" style={{ marginTop: 'var(--s3)' }}>
                Switch profiles above and re-run a scenario. On the benchmark reported in the case
                study, loosening the policy did not buy autonomy back on this scenario set — it
                changed where the system escalated rather than whether it did.
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
