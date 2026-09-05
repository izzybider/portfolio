/* ============================================================
   GUIDEAI RULES AND PLANS — DEMO CONTENT

   PUBLICATION-SAFETY NOTE.
   The *structure* here is GuideAI's: the behavior vocabularies, the
   frequency values, the context groups, the interpretation-row schema
   (behavior x context x frequency -> interpretation, risk, why it matters,
   next step, when to involve a trainer), the match-scoring function and the
   positive-progress branch all come from the application
   (`guideai_data.csv`, `guideai/services/observation_service.py`,
   `guideai/utils/normalization.py`, `guideai/ui/observation_form.py`).

   The *interpretation text and the plan text are not*. The application's
   own rows read as specific handling guidance, and their provenance cannot
   be established well enough to publish them on a public site. They were
   replaced with generalized, non-prescriptive wording written for this
   demonstration, which keeps the product logic identical — the same rows
   match, the same risk levels drive the trainer-judgment flag, the same
   escalation slot governs "when to ask a trainer" — without publishing
   organization-specific training instruction.

   Nothing here should be read as training guidance. In the product this
   slot is filled from a trainer-approved resource set; here it is
   illustrative placeholder copy about what to *observe and record*, which
   is what the demo needs in order to show the workflow.

   GuideAI does not diagnose, does not score the dog, and does not replace a
   trainer. That positioning is the product's, and this module keeps it.
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

/** Same shape as the rows in guideai_data.csv; generalized copy. */
export const RULES: Rule[] = [
  {
    "behavior": "barking",
    "context": "crowded public space",
    "frequency": "once",
    "likely_issue": "possible response to novelty",
    "risk": "low",
    "why_it_matters": "A single instance in a busy place is usually situational rather than a pattern.",
    "immediate_action": "Note what was happening at the time and give the dog room to settle.",
    "long_term_support": "Keep logging the same context to see whether it recurs.",
    "escalate_when": "If it happens several times in one outing, or starts appearing in other places."
  },
  {
    "behavior": "barking",
    "context": "crowded public space",
    "frequency": "repeated",
    "likely_issue": "recurring pattern in a high-stimulation context",
    "risk": "medium",
    "why_it_matters": "Repetition in the same setting is a pattern rather than a one-off, and patterns are what a trainer needs to see.",
    "immediate_action": "Record what the environment was like each time, including what helped afterwards.",
    "long_term_support": "Track whether the same context keeps producing it as weeks go on.",
    "escalate_when": "If it continues across several outings, or begins appearing in different environments."
  },
  {
    "behavior": "barking",
    "context": "training class",
    "frequency": "repeated",
    "likely_issue": "recurring pattern during structured sessions",
    "risk": "medium",
    "why_it_matters": "A pattern that shows up during training affects what the session is able to cover.",
    "immediate_action": "Note where in the session it happened and what the class was doing.",
    "long_term_support": "Compare sessions to see whether the pattern is tied to particular activities.",
    "escalate_when": "If it happens in most sessions, or the dog stops responding to familiar cues."
  },
  {
    "behavior": "fear and anxiety",
    "context": "new environment",
    "frequency": "once",
    "likely_issue": "possible response to an unfamiliar setting",
    "risk": "low",
    "why_it_matters": "A first reaction to somewhere new is common and is worth recording rather than acting on.",
    "immediate_action": "Note the setting and how long the dog took to settle.",
    "long_term_support": "Log the next few unfamiliar settings to see whether it repeats.",
    "escalate_when": "If the same response appears in familiar places, or the dog avoids the setting entirely."
  },
  {
    "behavior": "fear and anxiety",
    "context": "new environment",
    "frequency": "repeated",
    "likely_issue": "recurring response across unfamiliar settings",
    "risk": "high",
    "why_it_matters": "A response that repeats across settings is the kind of pattern a trainer should see early.",
    "immediate_action": "Record the settings involved and stop adding new ones until you have talked to a trainer.",
    "long_term_support": "Keep the log specific about place, duration and recovery.",
    "escalate_when": "Bring this to a trainer now rather than waiting for more observations."
  },
  {
    "behavior": "growling",
    "context": "unfamiliar person",
    "frequency": "once",
    "likely_issue": "communication signal worth recording",
    "risk": "medium",
    "why_it_matters": "Growling is information. It is worth logging accurately rather than interpreting on your own.",
    "immediate_action": "Note who was present, what happened just before, and what you did next.",
    "long_term_support": "Keep a precise record of any further instances and their triggers.",
    "escalate_when": "If it happens more than once, or with a different kind of trigger."
  },
  {
    "behavior": "poor eye contact",
    "context": "training class",
    "frequency": "repeated",
    "likely_issue": "recurring engagement pattern under distraction",
    "risk": "medium",
    "why_it_matters": "Engagement is the thing most other training depends on, so a pattern here shapes what a session can do.",
    "immediate_action": "Note the level of distraction present each time.",
    "long_term_support": "Track whether engagement differs between quiet and busy settings.",
    "escalate_when": "If it persists across several sessions, or in quiet settings too."
  },
  {
    "behavior": "poor responsivity",
    "context": "home training",
    "frequency": "repeated",
    "likely_issue": "recurring pattern in familiar surroundings",
    "risk": "medium",
    "why_it_matters": "A pattern that appears at home, where distractions are lowest, is worth a trainer's read.",
    "immediate_action": "Record which cues were involved and what else was happening.",
    "long_term_support": "Compare home sessions with sessions elsewhere.",
    "escalate_when": "If it appears across different environments, or over several sessions."
  },
  {
    "behavior": "impulsivity",
    "context": "excitable greeting",
    "frequency": "repeated",
    "likely_issue": "recurring pattern around greetings",
    "risk": "medium",
    "why_it_matters": "Greetings come up constantly in public-access work, so a repeated pattern here is worth raising.",
    "immediate_action": "Note who was greeting and how the greeting was set up.",
    "long_term_support": "Track whether it differs between familiar and unfamiliar people.",
    "escalate_when": "If it becomes harder to interrupt, or appears in more contexts."
  },
  {
    "behavior": "excitable greetings",
    "context": "unfamiliar person",
    "frequency": "intermittent",
    "likely_issue": "intermittent pattern around new people",
    "risk": "medium",
    "why_it_matters": "Something that happens some of the time is often about the setup, which is worth capturing.",
    "immediate_action": "Note what was different on the occasions it did not happen.",
    "long_term_support": "Keep logging both the difficult and the easy greetings.",
    "escalate_when": "If it increases over time, or you cannot tell what makes the difference."
  },
  {
    "behavior": "jumping on people",
    "context": "home environment",
    "frequency": "repeated",
    "likely_issue": "recurring pattern at home",
    "risk": "low",
    "why_it_matters": "Home patterns are the easiest to observe carefully, which makes them useful evidence.",
    "immediate_action": "Note who was involved and what happened immediately before.",
    "long_term_support": "Track whether it also shows up away from home.",
    "escalate_when": "If it continues over several weeks, or starts happening in new environments."
  }
];

/** Same branch as observation_service.POSITIVE_RESULT — positive observations
 *  are not run through the challenge rows; generalized copy. */
export const POSITIVE_RESULT: Rule = {
  behavior: 'positive progress',
  context: '',
  frequency: '',
  likely_issue: 'Positive progress or successful behavior',
  risk: 'protective',
  why_it_matters:
    'Recording what went well helps identify the settings and routines that may be worth repeating.',
  immediate_action:
    'Note what may have contributed, and keep watching whether it holds in other settings.',
  long_term_support:
    'Track whether it becomes consistent across people, places and levels of distraction.',
  escalate_when:
    'Ask a trainer which of these conditions are the ones worth repeating.',
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
};

/** Same slot as observation_service._TRAINING_PLANS; generalized copy. */
export const TRAINING_PLANS: Record<string, TrainingPlan> = {
  "barking": {
    "command": "observation focus",
    "routine": "Record the setting, what preceded it, and how long recovery took.",
    "why": "A trainer can act on a specific pattern far more easily than on a general description."
  },
  "growling": {
    "command": "observation focus",
    "routine": "Record the trigger, the distance involved, and what you did next.",
    "why": "This is the detail a trainer will ask for first, and it is easy to lose by the next session."
  },
  "jumping on people": {
    "command": "observation focus",
    "routine": "Record who was present and how the greeting began.",
    "why": "Greeting patterns usually depend on the setup, which only shows up across several logs."
  },
  "excitable greetings": {
    "command": "observation focus",
    "routine": "Record both the difficult greetings and the easy ones.",
    "why": "The contrast between them is often the most useful thing to bring to a trainer."
  },
  "low focus or engagement": {
    "command": "observation focus",
    "routine": "Record the distraction level and the length of the session.",
    "why": "Engagement varies with context, so a single number would hide what is actually happening."
  },
  "poor eye contact": {
    "command": "observation focus",
    "routine": "Record the environment and what else was competing for attention.",
    "why": "It shows whether the pattern follows the setting or the dog."
  },
  "poor responsivity": {
    "command": "observation focus",
    "routine": "Record which cues were involved and how familiar the setting was.",
    "why": "It separates a cue problem from an environment problem before a trainer is asked."
  },
  "impulsivity": {
    "command": "observation focus",
    "routine": "Record what the dog was waiting for and how long it lasted.",
    "why": "Specifics here are what make the pattern legible in a short trainer conversation."
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
