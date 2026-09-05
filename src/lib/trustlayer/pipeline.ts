/* ============================================================
   TRUSTLAYER PIPELINE (portfolio demo)

   Adapted from ~/Documents/trustlayer `lib/pipeline.ts`. That version is
   async because it can optionally call a model; this one is synchronous
   and deterministic, because the demo never calls anything. The stages,
   the ordering, the trace events and the three system variants are
   otherwise the same:

     classify -> decide -> [tools] -> updated state -> re-decide -> generate

   Answer text in the source repo is model-written when a key is present
   and templated when it is not. The demo always uses the templates, which
   is exactly the offline path that repo ships.
   ============================================================ */

import { decide, applyToolResults } from './engine';
import { policyLabel, type PolicyConfig } from './config';
import { heuristicClassify, deriveEvidenceStatus, deriveInformationGap } from './heuristic';
import { planToolCalls, runTool, TOOL_CATALOG } from './tools';
import type {
  Behavior,
  Classification,
  ClassifierSource,
  PolicyDecision,
  ScenarioContext,
  StructuredState,
  SystemVariant,
  ToolCall,
  ToolResult,
} from './types';

export type TraceEvent = {
  id: string;
  step: string;
  title: string;
  detail: string;
  status: 'ok' | 'warn' | 'fail';
};

export type FinalBehavior = {
  behavior: Behavior;
  headline: string;
  body: string;
  bullets: string[];
  grounded_in: string[];
  handoff_category?: string;
};

export type Run = {
  system: SystemVariant;
  user_request: string;
  state: StructuredState;
  updated_state?: StructuredState;
  decision: PolicyDecision;
  post_verification_decision?: PolicyDecision;
  tool_calls: ToolCall[];
  tool_results: ToolResult[];
  final: FinalBehavior;
  trace: TraceEvent[];
  policy_profile: string;
};

/* ---------- state assembly (ported from lib/ai/classify.ts) ---------- */

export function buildState(
  userRequest: string,
  context: ScenarioContext,
  classification: Classification,
  source: ClassifierSource,
): StructuredState {
  const available_evidence = context.available_evidence ?? [];
  const missing_information = context.missing_information?.length
    ? context.missing_information
    : classification.missing_information;
  const tool_available = context.tool_available ?? false;

  const evidence_status = context.missing_information?.length
    ? deriveEvidenceStatus(available_evidence, missing_information)
    : classification.evidence_status;

  const information_gap =
    classification.information_gap === 'none' && missing_information.length > 0
      ? deriveInformationGap(missing_information, tool_available)
      : classification.information_gap;

  const authorization_required =
    context.authorization_required ?? classification.authorization_required;
  const authorization_status = !authorization_required
    ? 'not_required'
    : context.authorization_present
      ? 'present'
      : 'missing';

  return {
    user_request: userRequest,
    task_type: context.task_type ?? classification.task_type,
    domain: context.domain ?? classification.domain,
    available_evidence,
    missing_information,
    risk_level: context.risk_level ?? classification.risk_level,
    evidence_status,
    authorization_required,
    authorization_status,
    reversible: context.reversible ?? classification.reversible,
    information_gap,
    requires_professional_judgment: classification.requires_professional_judgment,
    tool_available,
    tool_hint: context.tool_hint,
    tool_args: context.tool_args,
    actor_role: context.actor_role,
    classification_confidence: classification.confidence,
    classifier_source: source,
    classifier_rationale: classification.rationale,
  };
}

/* ---------- response text (ported from lib/ai/generate.ts templates) ---------- */

function clarificationText(state: StructuredState): string {
  const missing = state.missing_information[0] ?? 'one more detail';
  const because =
    state.task_type === 'refund_request'
      ? 'before I can check whether the charge was duplicated'
      : state.task_type === 'reservation_action'
        ? 'so I cancel the right booking and not another one'
        : state.task_type === 'account_action' || state.task_type === 'access_control'
          ? 'before I can confirm who is permitted to make this change'
          : state.task_type === 'analysis'
            ? 'so I can pull the right data rather than estimate'
            : 'before I can complete this accurately';
  return `I need ${missing} ${because}. Once you share it, I can continue.`;
}

function templateAnswer(state: StructuredState, results: ToolResult[]): string {
  const retrieved = results.filter((r) => r.status === 'ok');
  if (retrieved.length > 0) {
    return `Based on the retrieved records: ${retrieved.map((r) => r.summary).join(' ')}`;
  }
  if (state.available_evidence.length > 0) {
    return `Answered from the evidence supplied with the request: ${state.available_evidence.join(' ')}`;
  }
  return 'This request is inside the autonomous band and nothing is outstanding, so the assistant answers directly.';
}

function buildFinalBehavior(
  state: StructuredState,
  decision: PolicyDecision,
  toolResults: ToolResult[],
): FinalBehavior {
  /* De-duplicated: the source repo appends the same tool summary to both
     bullets and grounded_in and can list a result twice. */
  const groundedIn = Array.from(
    new Set([
      ...state.available_evidence,
      ...toolResults.filter((r) => r.status === 'ok').map((r) => `${r.tool}: ${r.summary}`),
    ]),
  );

  if (decision.decision === 'ANSWER') {
    return {
      behavior: 'ANSWER',
      headline: toolResults.length
        ? 'Answered with verified evidence'
        : 'Answered from supplied evidence',
      body: templateAnswer(state, toolResults),
      bullets: groundedIn.slice(0, 4),
      grounded_in: groundedIn,
    };
  }
  if (decision.decision === 'ASK') {
    return {
      behavior: 'ASK',
      headline: 'Clarification required before proceeding',
      body: clarificationText(state),
      bullets: state.missing_information.slice(0, 4),
      grounded_in: groundedIn,
    };
  }
  if (decision.decision === 'VERIFY') {
    return {
      behavior: 'VERIFY',
      headline: 'Evidence required before action',
      body: decision.next_step,
      bullets: state.missing_information.slice(0, 4),
      grounded_in: groundedIn,
    };
  }
  const category = decision.escalation_category ?? 'Human reviewer';
  return {
    behavior: 'ESCALATE',
    headline: 'This request requires human judgment or authorization',
    body: `${decision.reason} The request is routed to: ${category}. No human is actually connected in this demo — the handoff is simulated, and the assistant stops here rather than producing an answer it cannot support.`,
    bullets: [
      `Handoff category: ${category}`,
      ...(state.missing_information.length
        ? [`Outstanding: ${state.missing_information.join(', ')}`]
        : []),
      ...(groundedIn.length ? [`Context already gathered: ${groundedIn.length} item(s)`] : []),
    ],
    handoff_category: category,
    grounded_in: groundedIn,
  };
}

/* ---------- trace ---------- */

class TraceBuilder {
  private events: TraceEvent[] = [];
  add(step: string, title: string, detail: string, status: TraceEvent['status'] = 'ok') {
    this.events.push({ id: `t${this.events.length + 1}`, step, title, detail, status });
  }
  get all() {
    return this.events;
  }
}

const decisionDetail = (d: PolicyDecision) => `${d.decision} — ${d.reason}`;

function baselineDecision(
  state: StructuredState,
  ruleId: string,
  reason: string,
): PolicyDecision {
  return {
    decision: 'ANSWER',
    rule_id: ruleId,
    risk_level: state.risk_level,
    evidence_status: state.evidence_status,
    authorization_status: state.authorization_status,
    reversibility: state.reversible,
    information_gap: state.information_gap,
    missing_information: state.missing_information,
    reason,
    next_step: 'Generate a response.',
    confidence: state.classification_confidence,
    factors: [],
  };
}

/* ---------- the run ---------- */

export function runSystem(
  system: SystemVariant,
  input: { user_request: string; context: ScenarioContext },
  policy: PolicyConfig,
): Run {
  const trace = new TraceBuilder();
  trace.add('user_request', 'User request', input.user_request);

  const classification = heuristicClassify(input.user_request, input.context);
  const state = buildState(input.user_request, input.context, classification, 'heuristic');

  trace.add(
    'task_classification',
    'Task classification',
    `${state.task_type.replace(/_/g, ' ')} · ${state.domain} · classified by deterministic classifier at ${(state.classification_confidence * 100).toFixed(0)}% confidence`,
  );
  trace.add(
    'risk_assessment',
    'Risk assessment',
    `Risk ${state.risk_level} · ${state.reversible.replace(/_/g, ' ')}${
      state.requires_professional_judgment ? ' · professional judgment required' : ''
    }`,
  );
  trace.add(
    'evidence_assessment',
    'Evidence assessment',
    `${state.evidence_status.replace(/_/g, ' ')} · ${state.available_evidence.length} item(s) supplied · gap: ${state.information_gap.replace(/_/g, ' ')}`,
    state.evidence_status === 'sufficient' ? 'ok' : 'warn',
  );
  trace.add(
    'authorization_requirement',
    'Authorization requirement',
    state.authorization_required
      ? `Required · currently ${state.authorization_status}`
      : 'Not required for this task',
    state.authorization_required && state.authorization_status !== 'present' ? 'warn' : 'ok',
  );

  const executeTools = (calls: ToolCall[]): ToolResult[] => {
    const results: ToolResult[] = [];
    for (const call of calls) {
      trace.add(
        'tool_call',
        `Tool call — ${call.label}`,
        `${call.tool}(${Object.entries(call.args)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')})`,
      );
      const result = runTool(call);
      results.push(result);
      trace.add(
        'tool_result',
        `Tool result — ${call.label}`,
        result.summary,
        result.status === 'ok' ? 'ok' : result.status === 'not_found' ? 'warn' : 'fail',
      );
    }
    return results;
  };

  /* ---- System A: Direct LLM. No decision layer, no retrieval. ---- */
  if (system === 'direct_llm') {
    const decision = baselineDecision(
      state,
      'baseline_direct_llm',
      'Baseline A has no decision layer: every request is treated as something to answer.',
    );
    trace.add('decision', 'Baseline decision', decisionDetail(decision), 'warn');
    trace.add('final_behavior', 'Final behaviour', 'ANSWER (no policy gate)', 'warn');
    trace.add(
      'outcome',
      'Outcome',
      'Answer returned without evidence or authorization checks.',
      'warn',
    );
    return {
      system,
      user_request: input.user_request,
      state,
      decision,
      tool_calls: [],
      tool_results: [],
      final: {
        behavior: 'ANSWER',
        headline: 'Answered immediately',
        body: templateAnswer(state, []),
        bullets: [],
        grounded_in: [],
      },
      trace: trace.all,
      policy_profile: 'none (baseline)',
    };
  }

  /* ---- System B: RAG agent. Retrieves, then always answers. ---- */
  if (system === 'rag_agent') {
    const calls = planToolCalls(state).filter((c) => c.tool !== 'checkAuthorization');
    let finalState = state;
    let results: ToolResult[] = [];
    if (calls.length > 0) {
      results = executeTools(calls);
      const applied = applyToolResults(state, results);
      finalState = applied.state;
      trace.add('state_update', 'Updated system state', applied.notes.join(' ') || 'No change.');
    } else {
      trace.add(
        'state_update',
        'Updated system state',
        'No retrieval source matched this request; answering from general knowledge.',
        'warn',
      );
    }
    const decision = baselineDecision(
      finalState,
      'baseline_rag_agent',
      'Baseline B retrieves what it can and then always answers. It has no ASK, VERIFY or ESCALATE behaviour.',
    );
    trace.add('decision', 'Baseline decision', decisionDetail(decision), 'warn');
    const retrievedOk = results.some((r) => r.status === 'ok');
    trace.add(
      'final_behavior',
      'Final behaviour',
      'ANSWER (retrieval-backed, no policy gate)',
      'warn',
    );
    trace.add(
      'outcome',
      'Outcome',
      retrievedOk
        ? 'Answer returned using retrieved evidence.'
        : 'Answer returned even though retrieval produced nothing usable.',
      retrievedOk ? 'ok' : 'warn',
    );
    return {
      system,
      user_request: input.user_request,
      state,
      updated_state: results.length > 0 ? finalState : undefined,
      decision,
      tool_calls: calls,
      tool_results: results,
      final: {
        behavior: 'ANSWER',
        headline: retrievedOk ? 'Answered after retrieval' : 'Answered without usable retrieval',
        body: templateAnswer(finalState, results),
        bullets: results.map((r) => r.summary).slice(0, 3),
        grounded_in: results.filter((r) => r.status === 'ok').map((r) => r.summary),
      },
      trace: trace.all,
      policy_profile: 'none (baseline)',
    };
  }

  /* ---- System C: TrustLayer. Decide first, retrieve only if asked to. ---- */
  const decision = decide(state, policy);
  trace.add(
    'decision',
    'TrustLayer decision',
    decisionDetail(decision),
    decision.decision === 'ANSWER' ? 'ok' : 'warn',
  );

  let calls: ToolCall[] = [];
  let results: ToolResult[] = [];
  let finalState = state;
  let postDecision: PolicyDecision | undefined;

  if (decision.decision === 'VERIFY') {
    calls = planToolCalls(state);
    if (calls.length === 0) {
      trace.add(
        'tool_call',
        'Tool call',
        'Verification was required but no registered tool covers this request.',
        'fail',
      );
      finalState = { ...state, tool_available: false, information_gap: 'unresolved' };
      postDecision = decide(finalState, policy, { postVerification: true });
    } else {
      results = executeTools(calls);
      const applied = applyToolResults(state, results);
      finalState = applied.state;
      trace.add(
        'state_update',
        'Updated system state',
        applied.notes.join(' ') || 'No change.',
        results.every((r) => r.status === 'ok') ? 'ok' : 'warn',
      );
      postDecision = decide(finalState, policy, { postVerification: true });
      trace.add(
        'decision',
        'Post-verification decision',
        decisionDetail(postDecision),
        postDecision.decision === 'ANSWER' ? 'ok' : 'warn',
      );
    }
  }

  const effective = postDecision ?? decision;
  const final = buildFinalBehavior(finalState, effective, results);

  trace.add(
    'final_behavior',
    'Final behaviour',
    `${final.behavior} — ${final.headline}`,
    final.behavior === 'ANSWER' ? 'ok' : 'warn',
  );
  trace.add(
    'outcome',
    'Outcome',
    decision.decision === 'VERIFY' && effective.decision === 'ANSWER'
      ? 'Verification completed and the action is now supported by retrieved evidence.'
      : effective.decision === 'ESCALATE'
        ? `Stopped and handed off: ${final.handoff_category ?? 'human reviewer'}.`
        : effective.decision === 'ASK'
          ? 'Paused for one clarifying question rather than guessing.'
          : 'Answered within the autonomous band.',
    effective.decision === 'ANSWER' ? 'ok' : 'warn',
  );

  return {
    system,
    user_request: input.user_request,
    state,
    updated_state: finalState === state ? undefined : finalState,
    decision,
    post_verification_decision: postDecision,
    tool_calls: calls,
    tool_results: results,
    final,
    trace: trace.all,
    policy_profile: policyLabel(policy),
  };
}

export { TOOL_CATALOG };
