/* ============================================================
   TRUSTLAYER TYPES

   Ported from ~/Documents/trustlayer `lib/schemas/index.ts`, where these
   are zod schemas with types inferred from them. The portfolio demo runs
   entirely on fixture data that ships with it, so there is no untrusted
   input to validate at runtime and no reason to pull zod in — the shapes
   below are the same, expressed as plain TypeScript.
   ============================================================ */

export type Behavior = 'ANSWER' | 'ASK' | 'VERIFY' | 'ESCALATE';

export type RiskLevel = 'low' | 'medium' | 'high';

export type EvidenceStatus =
  | 'sufficient'
  | 'partially_sufficient'
  | 'insufficient';

export type AuthorizationStatus = 'not_required' | 'present' | 'missing';

export type Reversibility =
  | 'reversible'
  | 'partially_reversible'
  | 'irreversible';

export type InformationGap =
  | 'none'
  | 'resolvable_by_user'
  | 'resolvable_by_verification'
  | 'unresolved';

export type TaskType =
  | 'informational'
  | 'analysis'
  | 'reservation_action'
  | 'refund_request'
  | 'account_action'
  | 'access_control'
  | 'clinical_judgment'
  | 'healthcare_operations'
  | 'legal_judgment'
  | 'financial_advice'
  | 'support_action'
  | 'other';

export type Domain =
  | 'general'
  | 'commerce'
  | 'support'
  | 'analytics'
  | 'identity'
  | 'healthcare'
  | 'finance'
  | 'legal';

/** Context that comes from the system of record, not from the model. */
export type ScenarioContext = {
  task_type?: TaskType;
  domain?: Domain;
  available_evidence: string[];
  missing_information: string[];
  risk_level?: RiskLevel;
  authorization_required?: boolean;
  authorization_present?: boolean;
  reversible?: Reversibility;
  tool_available?: boolean;
  tool_hint?: string;
  tool_args?: Record<string, string>;
  actor_role?: string;
};

/** What the classifier is allowed to produce. It never picks a behavior. */
export type Classification = {
  task_type: TaskType;
  domain: Domain;
  risk_level: RiskLevel;
  reversible: Reversibility;
  authorization_required: boolean;
  requires_professional_judgment: boolean;
  missing_information: string[];
  information_gap: InformationGap;
  evidence_status: EvidenceStatus;
  rationale: string;
  confidence: number;
};

export type ClassifierSource = 'model' | 'heuristic' | 'fixture';

export type StructuredState = {
  user_request: string;
  task_type: TaskType;
  domain: Domain;
  available_evidence: string[];
  missing_information: string[];
  risk_level: RiskLevel;
  evidence_status: EvidenceStatus;
  authorization_required: boolean;
  authorization_status: AuthorizationStatus;
  reversible: Reversibility;
  information_gap: InformationGap;
  requires_professional_judgment: boolean;
  tool_available: boolean;
  tool_hint?: string;
  tool_args?: Record<string, string>;
  actor_role?: string;
  classification_confidence: number;
  classifier_source: ClassifierSource;
  classifier_rationale: string;
};

/** An observable factor behind a decision — never model chain-of-thought. */
export type DecisionFactor = {
  label: string;
  value: string;
  weight: 'blocking' | 'supporting' | 'neutral';
};

export type PolicyDecision = {
  decision: Behavior;
  rule_id: string;
  risk_level: RiskLevel;
  evidence_status: EvidenceStatus;
  authorization_status: AuthorizationStatus;
  reversibility: Reversibility;
  information_gap: InformationGap;
  missing_information: string[];
  reason: string;
  next_step: string;
  confidence: number;
  factors: DecisionFactor[];
  escalation_category?: string;
};

export type ToolName =
  | 'lookupTransaction'
  | 'lookupAccount'
  | 'lookupReservation'
  | 'getProductMetrics'
  | 'checkAuthorization'
  | 'lookupPatientRecord';

export type ToolCall = {
  id: string;
  tool: ToolName;
  args: Record<string, string>;
  label: string;
};

export type ToolResult = {
  call_id: string;
  tool: ToolName;
  status: 'ok' | 'not_found' | 'error' | 'denied';
  summary: string;
  data?: unknown;
  latency_ms: number;
};

/** The three systems compared in the TrustLayer experiment. */
export type SystemVariant = 'direct_llm' | 'rag_agent' | 'trustlayer';

export type Scenario = {
  id: string;
  category: string;
  title: string;
  user_request: string;
  context: ScenarioContext;
  expected_behavior: Behavior;
  acceptable_behaviors: Behavior[];
  risk_level: RiskLevel;
  explanation: string;
};
