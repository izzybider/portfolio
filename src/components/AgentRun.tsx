'use client';

import { useEffect, useMemo, useState } from 'react';
import { applyToolResults } from '@/lib/trustlayer/engine';
import type { Run } from '@/lib/trustlayer/pipeline';
import type { StructuredState, ToolResult } from '@/lib/trustlayer/types';

/**
 * AgentRun — one request executed through the policy layer, drawn as the
 * sequence it actually is:
 *
 *   request -> interpret -> evidence -> authorization -> risk -> decision
 *   -> [tool, tool] -> updated state -> re-decision -> final behavior
 *
 * Every value comes from the Run the pipeline produced. The per-tool state
 * change is computed by applying tool results cumulatively through the
 * engine's own applyToolResults, so what is shown is what the engine did,
 * not a description of it.
 */

type StageKind = 'stage' | 'decision' | 'tool' | 'final';

type Stage = {
  id: string;
  kind: StageKind;
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
};

const READABLE = (v: string) => v.replace(/_/g, ' ');

/**
 * Fields worth surfacing when a tool changes the decision state.
 * `tool_available` is included deliberately: an authorization denial leaves
 * authorization_status where it already was and instead closes off the
 * system-of-record route, which is the thing that sends the request to a
 * human. Without it the re-decision looks unmotivated.
 */
const TRACKED: (keyof StructuredState)[] = [
  'evidence_status',
  'authorization_status',
  'information_gap',
  'tool_available',
];

const FIELD_LABEL: Partial<Record<keyof StructuredState, string>> = {
  tool_available: 'system of record can still resolve this',
};

const fmtValue = (v: unknown) =>
  typeof v === 'boolean' ? (v ? 'yes' : 'no') : READABLE(String(v));

function diff(before: StructuredState, after: StructuredState) {
  return TRACKED.filter((k) => before[k] !== after[k]).map((k) => ({
    field: FIELD_LABEL[k] ?? READABLE(String(k)),
    from: fmtValue(before[k]),
    to: fmtValue(after[k]),
  }));
}

export default function AgentRun({ run }: { run: Run }) {
  const stages = useMemo<Stage[]>(() => {
    const s = run.state;
    const list: Stage[] = [
      {
        id: 'request',
        kind: 'stage',
        label: 'Request',
        value: `“${run.user_request}”`,
      },
      {
        id: 'interpret',
        kind: 'stage',
        label: 'Interpret request',
        value: `${READABLE(s.task_type)} · ${s.domain}`,
        detail: `Classified deterministically at ${(s.classification_confidence * 100).toFixed(0)}% confidence. The classifier describes the request; it never picks the behavior.`,
      },
      {
        id: 'evidence',
        kind: 'stage',
        label: 'Check evidence',
        value: READABLE(s.evidence_status),
        detail: `${s.available_evidence.length} item(s) supplied · gap: ${READABLE(s.information_gap)}${
          s.missing_information.length ? ` · missing: ${s.missing_information.join(', ')}` : ''
        }`,
      },
      {
        id: 'authorization',
        kind: 'stage',
        label: 'Check authorization',
        value: s.authorization_required ? READABLE(s.authorization_status) : 'not required',
        detail: s.authorization_required
          ? `This action is permission-sensitive${s.actor_role ? `; acting role is ${s.actor_role}` : ''}.`
          : 'Nothing about this request needs a permission check.',
      },
      {
        id: 'risk',
        kind: 'stage',
        label: 'Check risk / reversibility',
        value: `${s.risk_level} risk · ${READABLE(s.reversible)}`,
        detail: s.requires_professional_judgment
          ? 'A licensed human owns this decision, which outranks every other factor.'
          : undefined,
      },
      {
        id: 'decision',
        kind: 'decision',
        label: run.post_verification_decision ? 'Policy decision' : 'Policy decision',
        value: run.decision.decision,
        detail: (
          <>
            {run.decision.reason}{' '}
            <span className="agentrun__rule">rule {run.decision.rule_id}</span>
          </>
        ),
      },
    ];

    /* Tool calls, each with the state change it produced. */
    let cursor = run.state;
    run.tool_calls.forEach((call, i) => {
      const result: ToolResult | undefined = run.tool_results[i];
      if (!result) return;
      const applied = applyToolResults(cursor, [result]);
      const next = applied.state;
      const changes = diff(cursor, next);
      const notes = applied.notes;
      cursor = next;
      list.push({
        id: call.id,
        kind: 'tool',
        label: `Simulated tool ${i + 1}`,
        value: `${call.tool}()`,
        detail: (
          <div className="toolcard">
            <div className="toolcard__row">
              <span className="toolcard__key">Input</span>
              <span className="toolcard__val toolcard__val--mono">
                {Object.entries(call.args)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('  ·  ')}
              </span>
            </div>
            <div className="toolcard__row">
              <span className="toolcard__key">Returned evidence</span>
              <span className="toolcard__val">
                {result.summary}{' '}
                <span className="toolcard__status">{result.status}</span>
              </span>
            </div>
            <div className="toolcard__row">
              <span className="toolcard__key">Policy update</span>
              <span className="toolcard__val">
                {notes.map((n) => (
                  <span key={n} className="toolcard__delta toolcard__note">
                    {n}
                  </span>
                ))}
                {changes.map((c) => (
                  <span key={c.field} className="toolcard__delta">
                    {c.field}: {c.from} → <strong>{c.to}</strong>
                  </span>
                ))}
                {notes.length === 0 && changes.length === 0 ? (
                  <em>No change to the decision state.</em>
                ) : null}
              </span>
            </div>
          </div>
        ),
      });
    });

    if (run.post_verification_decision) {
      list.push({
        id: 're-decision',
        kind: 'decision',
        label: 'Re-decision',
        value: run.post_verification_decision.decision,
        detail: (
          <>
            {run.post_verification_decision.reason}{' '}
            <span className="agentrun__rule">
              rule {run.post_verification_decision.rule_id}
            </span>
          </>
        ),
      });
    }

    list.push({
      id: 'final',
      kind: 'final',
      label: 'Final behavior',
      value: run.final.behavior,
      detail: (
        <>
          <strong>{run.final.headline}.</strong> {run.final.body}
        </>
      ),
    });

    return list;
  }, [run]);

  /* Progressive reveal, with a route around it for reduced-motion users and
     for anyone who would rather just read the whole thing. */
  const [shown, setShown] = useState(stages.length);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || instant) {
      setShown(stages.length);
      return;
    }
    setShown(1);
    let i = 1;
    const timer = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= stages.length) window.clearInterval(timer);
    }, 260);
    return () => window.clearInterval(timer);
  }, [stages, instant]);

  const running = shown < stages.length;

  return (
    <div className="agentrun">
      <div className="agentrun__head">
        <p className="caps agentrun__label">Agent run</p>
        {running ? (
          <button
            type="button"
            className="button button--quiet"
            onClick={() => {
              setInstant(true);
              setShown(stages.length);
            }}
          >
            Show instantly
          </button>
        ) : (
          <span className="meta">{stages.length} steps · deterministic</span>
        )}
      </div>

      <ol className="agentrun__list">
        {stages.slice(0, shown).map((stage, index) => (
          <li
            key={stage.id}
            className={`agentstage agentstage--${stage.kind}${
              index === shown - 1 && running ? ' agentstage--active' : ''
            }`}
          >
            <div className="agentstage__marker" aria-hidden="true" />
            <div className="agentstage__body">
              <p className="agentstage__label">{stage.label}</p>
              <p className="agentstage__value">{stage.value}</p>
              {stage.detail ? (
                <div className="agentstage__detail">{stage.detail}</div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <p className="visually-hidden" role="status">
        {running
          ? `Running: step ${shown} of ${stages.length}.`
          : `Run complete. Final behavior ${run.final.behavior}.`}
      </p>
    </div>
  );
}
