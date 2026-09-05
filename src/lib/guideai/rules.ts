/* ============================================================
   GUIDEAI RULES AND PLANS

   Ported from the GuideAI application (`guideai_data.csv`,
   `guideai/services/observation_service.py`, `guideai/utils/normalization.py`
   and `guideai/ui/observation_form.py`). The behavior vocabularies,
   frequency values, context groups, interpretation rows, positive-progress
   block, training plans and the match-scoring function are the app's own —
   the demo reaches the same interpretation the product would.

   One repair: two rows in guideai_data.csv contain unescaped commas inside
   a field, which shifts their columns when the CSV is parsed naively
   (barking / crowded public space / repeated, and fear and anxiety / new
   environment / repeated). The full sentences are present in the source
   file; they are restored here.

   GuideAI does not diagnose, does not score the dog, and does not replace
   a trainer. That positioning is the product's, and this module keeps it.
   ============================================================ */

export type Frequency = 'once' | 'intermittent' | 'repeated';
export type ObservationType = 'challenge / concern' | 'positive progress';

/** From guideai/ui/observation_form.py */
export const CHALLENGE_BEHAVIORS = [
  'barking',
  'growling',
  'jumping on people',
  'excitable greetings',
  'impulsivity',
  'low focus or engagement',
  'poor eye contact',
  'poor responsivity',
  'nighttime crying / sleep disruption',
] as const;

export const POSITIVE_BEHAVIORS = [
  'positive demeanor',
  'strong focus or engagement',
  'successful settling',
  'good public access behavior',
  'ignored distraction',
  'recovered well after challenge',
  'plays well with dogs',
] as const;

export const FREQUENCIES: Frequency[] = ['once', 'intermittent', 'repeated'];

/** Context groups from guideai/utils/normalization.py, as pickable options. */
export const CONTEXTS = [
  { value: 'home environment', group: 'home', label: 'Home' },
  { value: 'crowded public space', group: 'public_space', label: 'Store / public space' },
  { value: 'training class', group: 'training_environment', label: 'Training class' },
  { value: 'home training', group: 'training_environment', label: 'Home training' },
  { value: 'unfamiliar person', group: 'people_interaction', label: 'Around a new person' },
  { value: 'excitable greeting', group: 'people_interaction', label: 'Greeting someone' },
  { value: 'new environment', group: 'public_space', label: 'Somewhere new' },
  { value: 'dog interaction', group: 'dog_interaction', label: 'Around another dog' },
] as const;

export type Rule = {
  behavior: string;
  context: string;
  frequency: string;
  likely_issue: string;
  risk: string;
  why_it_matters: string;
  immediate_action: string;
  long_term_support: string;
  escalate_when: string;
};

/** The interpretation rows from guideai_data.csv. */
export const RULES: Rule[] = [
  {
    "behavior": "barking",
    "context": "crowded public space",
    "frequency": "once",
    "likely_issue": "excitement or novelty response",
    "risk": "low",
    "why_it_matters": "Single-instance vocalization is common and often context-driven",
    "immediate_action": "Increase distance slightly and reward calm behavior",
    "long_term_support": "Gradually reintroduce similar environments with reinforcement",
    "escalate_when": "If this happens multiple times in one outing or starts happening in different environments"
  },
  {
    "behavior": "barking",
    "context": "crowded public space",
    "frequency": "repeated",
    "likely_issue": "overarousal in stimulating environment",
    "risk": "medium",
    "why_it_matters": "Repeated vocalization reduces focus and may generalize",
    "immediate_action": "Move farther from the trigger and reward calm check-ins before re-engaging",
    "long_term_support": "Build tolerance through short, repeated exposures with reinforcement",
    "escalate_when": "If barking continues across multiple environments or becomes harder to interrupt"
  },
  {
    "behavior": "barking",
    "context": "training class",
    "frequency": "repeated",
    "likely_issue": "training-context overarousal",
    "risk": "medium",
    "why_it_matters": "Overarousal can interfere with learning and responsiveness",
    "immediate_action": "Pause the activity and regain focus using simple cues",
    "long_term_support": "Shorten sessions and gradually increase difficulty",
    "escalate_when": "If barking happens in most sessions or prevents the dog from responding to cues"
  },
  {
    "behavior": "fear and anxiety",
    "context": "new environment",
    "frequency": "once",
    "likely_issue": "novelty sensitivity",
    "risk": "low",
    "why_it_matters": "Initial fear responses are common in new environments",
    "immediate_action": "Give space and allow the dog to observe without pressure",
    "long_term_support": "Introduce low-intensity exposure with positive reinforcement",
    "escalate_when": "If the dog avoids the situation completely or shows the same response in familiar environments"
  },
  {
    "behavior": "fear and anxiety",
    "context": "new environment",
    "frequency": "repeated",
    "likely_issue": "persistent fear pattern",
    "risk": "high",
    "why_it_matters": "Repeated fear responses can generalize and become harder to reverse",
    "immediate_action": "Reduce exposure intensity and create more distance from the trigger",
    "long_term_support": "Use gradual desensitization with consistent positive reinforcement",
    "escalate_when": "If the dog shuts down, refuses to engage, or shows fear in multiple environments"
  },
  {
    "behavior": "growling",
    "context": "unfamiliar person",
    "frequency": "once",
    "likely_issue": "defensive discomfort",
    "risk": "medium",
    "why_it_matters": "Growling signals discomfort and should be respected",
    "immediate_action": "Increase distance and avoid forcing interaction",
    "long_term_support": "Pair controlled exposure with positive associations",
    "escalate_when": "If growling happens more than once with similar triggers or begins occurring in new situations"
  },
  {
    "behavior": "poor eye contact",
    "context": "training class",
    "frequency": "repeated",
    "likely_issue": "low engagement under distraction",
    "risk": "medium",
    "why_it_matters": "Low engagement reduces training effectiveness",
    "immediate_action": "Simplify the environment and reinforce attention frequently",
    "long_term_support": "Gradually increase distractions while maintaining engagement",
    "escalate_when": "If the dog consistently fails to engage across multiple sessions"
  },
  {
    "behavior": "poor responsivity",
    "context": "home training",
    "frequency": "repeated",
    "likely_issue": "low cue responsiveness",
    "risk": "medium",
    "why_it_matters": "Poor responsiveness limits training progress",
    "immediate_action": "Use simpler cues and reward fast responses",
    "long_term_support": "Increase consistency and reduce competing stimuli",
    "escalate_when": "If the dog ignores cues across different environments or over multiple sessions"
  },
  {
    "behavior": "impulsivity",
    "context": "excitable greeting",
    "frequency": "repeated",
    "likely_issue": "impulse control difficulty",
    "risk": "medium",
    "why_it_matters": "Impulsivity can interfere with service dog behavior standards",
    "immediate_action": "Wait for calm behavior before giving attention",
    "long_term_support": "Practice structured greeting routines consistently",
    "escalate_when": "If the behavior becomes harder to interrupt or appears in multiple contexts"
  },
  {
    "behavior": "excitable greetings",
    "context": "unfamiliar person",
    "frequency": "intermittent",
    "likely_issue": "excitement-driven response",
    "risk": "medium",
    "why_it_matters": "Excitable greetings are common but should decrease over time",
    "immediate_action": "Reward calm behavior before interaction begins",
    "long_term_support": "Gradually increase exposure to new people",
    "escalate_when": "If excitement increases over time or becomes difficult to manage"
  },
  {
    "behavior": "jumping on people",
    "context": "home environment",
    "frequency": "repeated",
    "likely_issue": "unstructured greeting behavior",
    "risk": "low",
    "why_it_matters": "Jumping is common but should reduce with consistent reinforcement",
    "immediate_action": "Ignore jumping and reward calm posture",
    "long_term_support": "Practice consistent greeting routines",
    "escalate_when": "If jumping continues despite consistent training or occurs in new environments"
  }
];

/** From observation_service.POSITIVE_RESULT — positive observations are not
 *  run through the challenge rules; they get their own interpretation. */
export const POSITIVE_RESULT: Rule = {
  behavior: 'positive progress',
  context: '',
  frequency: '',
  likely_issue: 'Positive progress or successful behavior',
  risk: 'protective',
  why_it_matters:
    'Recording successful behavior helps identify the environments, routines, and supports that may be worth repeating.',
  immediate_action:
    'Note what may have contributed to the success and continue observing whether it appears in additional settings.',
  long_term_support:
    'Track whether the behavior becomes consistent across people, places, and levels of distraction.',
  escalate_when:
    'Ask a trainer which successful conditions are most important to repeat, reinforce, or generalize.',
};

/** observation_service.FALLBACK_BEHAVIOR_MAP */
export const FALLBACK_BEHAVIOR_MAP: Record<string, string> = {
  'low focus or engagement': 'poor eye contact',
  'poor responsivity': 'poor eye contact',
  'nighttime crying / sleep disruption': 'barking',
};

export type TrainingPlan = {
  command: string;
  routine: string;
  why: string;
  progression: string[];
};

/** observation_service._TRAINING_PLANS */
export const TRAINING_PLANS: Record<string, TrainingPlan> = {
  "barking": {
    "command": "quiet + calm settle",
    "routine": "Reward calm pauses before barking escalates.",
    "why": "This gives the raiser a concrete behavior to reinforce instead of only reacting after barking has already built up.",
    "progression": [
      "Quiet home environment with few distractions",
      "Home with a visitor, door sound, or mild trigger",
      "Public environment with moderate distractions"
    ]
  },
  "growling": {
    "command": "distance + calm disengagement",
    "routine": "Increase distance from the trigger, avoid forcing interaction, and reward calm disengagement or check-ins.",
    "why": "Growling can be an important communication signal. The goal is to respect discomfort, reduce pressure, and bring patterns to a trainer rather than suppressing the warning.",
    "progression": [
      "Observe the trigger from a comfortable distance in a calm setting",
      "Controlled exposure with more movement or proximity",
      "Busier environment while maintaining calm responses"
    ]
  },
  "jumping on people": {
    "command": "sit for greeting",
    "routine": "Reward four paws on the floor before attention.",
    "why": "A predictable greeting routine helps the puppy learn what to do with excitement instead of rehearsing jumping.",
    "progression": [
      "Familiar person at home",
      "New visitor entering calmly",
      "Public greeting or training-class greeting"
    ]
  },
  "excitable greetings": {
    "command": "calm greeting routine",
    "routine": "Pause the greeting and reward calm engagement before interaction continues.",
    "why": "Greeting moments can be highly reinforcing, so building a pause-before-greeting routine helps prevent excitement from becoming the default pattern.",
    "progression": [
      "Calm greeting at home",
      "Controlled greeting with a visitor",
      "Greeting in a busier public or class setting"
    ]
  },
  "low focus or engagement": {
    "command": "focus / check-in",
    "routine": "Mark and reward voluntary attention, eye contact, and quick check-ins.",
    "why": "Focus and engagement are foundation skills. Tracking them across environments shows whether the puppy can stay connected as distractions increase.",
    "progression": [
      "Quiet room",
      "Outside with mild distractions",
      "Busy public setting"
    ]
  },
  "poor eye contact": {
    "command": "name response + focus",
    "routine": "Reward voluntary eye contact and quick response to name.",
    "why": "Eye contact and name response make it easier for the raiser to redirect before the puppy becomes too distracted.",
    "progression": [
      "Inside home",
      "Training environment",
      "Public space with people or dogs nearby"
    ]
  },
  "poor responsivity": {
    "command": "name response + engagement",
    "routine": "Reward quick responses to cues and reset if the dog is too distracted.",
    "why": "Responsiveness is often environment-dependent, so separating calm, mild, and busy settings makes progress easier to discuss with a trainer.",
    "progression": [
      "Quiet home environment",
      "Mild distraction setting",
      "Busy public environment"
    ]
  },
  "impulsivity": {
    "command": "settle + delayed reward",
    "routine": "Practice waiting calmly before food, attention, doors, or greetings.",
    "why": "Impulse-control practice helps the puppy learn that calm waiting leads to access, attention, or rewards.",
    "progression": [
      "Low distraction",
      "Mild excitement",
      "Higher-distraction environments"
    ]
  }
};

export function getTrainingPlan(behavior: string): TrainingPlan | null {
  return TRAINING_PLANS[behavior] ?? null;
}

/**
 * observation_service.pick_best_row — context word overlap, plus a frequency
 * score that lets an adjacent frequency partially match.
 */
function rowScore(rule: Rule, userContext: string, userFrequency: string): number {
  let score = 0;
  const rowWords = new Set(rule.context.toLowerCase().split(/\s+/).filter(Boolean));
  const userWords = new Set(userContext.toLowerCase().split(/\s+/).filter(Boolean));
  rowWords.forEach((w) => {
    if (userWords.has(w)) score += 1;
  });
  if (userFrequency === rule.frequency) score += 3;
  else if (userFrequency === 'repeated' && ['intermittent', 'repeated'].includes(rule.frequency))
    score += 2;
  else if (userFrequency === 'intermittent' && ['once', 'intermittent'].includes(rule.frequency))
    score += 1;
  return score;
}

/**
 * observation_service.match_observation — the closest interpretation row for
 * a challenge observation, or the positive block for a positive one.
 * Returns null when no row covers the behavior at all, which the UI shows
 * rather than inventing an interpretation.
 */
export function matchObservation(
  observationType: ObservationType,
  behavior: string,
  context: string,
  frequency: string,
): Rule | null {
  if (observationType === 'positive progress') return POSITIVE_RESULT;
  let matches = RULES.filter((r) => r.behavior === behavior);
  if (matches.length === 0 && FALLBACK_BEHAVIOR_MAP[behavior]) {
    matches = RULES.filter((r) => r.behavior === FALLBACK_BEHAVIOR_MAP[behavior]);
  }
  if (matches.length === 0) return null;
  return matches
    .map((r) => ({ r, s: rowScore(r, context, frequency) }))
    .sort((a, b) => b.s - a.s)[0].r;
}
