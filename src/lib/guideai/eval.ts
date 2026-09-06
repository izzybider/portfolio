/* ============================================================
   SYNTHETIC EVALUATION SET

   Thirty labelled scenarios written for this demo. Each carries the
   behaviour context, the resources that should be retrieved for it, and
   whether the product should escalate. Labels were written against the
   corpus, by the same person who wrote the corpus — which is a real
   limitation and is stated wherever the numbers appear.

   The harness in scripts/guideai-eval.ts runs these and prints what it
   measures. No number in this project is written by hand.
   ============================================================ */

export type EvalCase = {
  id: string;
  behavior: string;
  dominantContext: string;
  contextCount: number;
  observationCount: number;
  strongestFrequency: 'once' | 'intermittent' | 'repeated';
  trend: 'improving' | 'watch' | 'steady';
  positive: boolean;
  /** any one of these in the top-k counts as a hit */
  expectedResources: string[];
  expectedEscalation: boolean;
  note: string;
};

export const EVAL_SET: EvalCase[] = [
  { id: 'e01', behavior: 'low focus or engagement', dominantContext: 'crowded public space', contextCount: 1, observationCount: 3, strongestFrequency: 'repeated', trend: 'watch', positive: false, expectedResources: ['res-03', 'res-04', 'res-15'], expectedEscalation: true, note: 'repeated and worsening in one setting' },
  { id: 'e02', behavior: 'low focus or engagement', dominantContext: 'training class', contextCount: 1, observationCount: 2, strongestFrequency: 'intermittent', trend: 'steady', positive: false, expectedResources: ['res-07', 'res-08', 'res-03'], expectedEscalation: false, note: 'engagement in a session' },
  { id: 'e03', behavior: 'low focus or engagement', dominantContext: 'crowded public space', contextCount: 3, observationCount: 5, strongestFrequency: 'repeated', trend: 'watch', positive: false, expectedResources: ['res-20', 'res-03', 'res-08'], expectedEscalation: true, note: 'spreading across contexts' },
  { id: 'e04', behavior: 'successful settling', dominantContext: 'home environment', contextCount: 1, observationCount: 4, strongestFrequency: 'repeated', trend: 'improving', positive: true, expectedResources: ['res-02', 'res-01', 'res-27'], expectedEscalation: false, note: 'settling improving at home' },
  { id: 'e05', behavior: 'successful settling', dominantContext: 'crowded public space', contextCount: 2, observationCount: 3, strongestFrequency: 'intermittent', trend: 'improving', positive: true, expectedResources: ['res-01', 'res-02', 'res-16'], expectedEscalation: false, note: 'settling generalising to public' },
  { id: 'e06', behavior: 'barking', dominantContext: 'crowded public space', contextCount: 1, observationCount: 1, strongestFrequency: 'once', trend: 'steady', positive: false, expectedResources: ['res-09', 'res-26'], expectedEscalation: false, note: 'single vocalisation' },
  { id: 'e07', behavior: 'barking', dominantContext: 'crowded public space', contextCount: 2, observationCount: 4, strongestFrequency: 'repeated', trend: 'watch', positive: false, expectedResources: ['res-20', 'res-21', 'res-09'], expectedEscalation: true, note: 'vocalisation spreading' },
  { id: 'e08', behavior: 'barking', dominantContext: 'training class', contextCount: 1, observationCount: 3, strongestFrequency: 'repeated', trend: 'watch', positive: false, expectedResources: ['res-10', 'res-09', 'res-21'], expectedEscalation: true, note: 'vocalisation in sessions' },
  { id: 'e09', behavior: 'growling', dominantContext: 'unfamiliar person', contextCount: 1, observationCount: 1, strongestFrequency: 'once', trend: 'steady', positive: false, expectedResources: ['res-19'], expectedEscalation: true, note: 'sensitive behaviour, first occurrence' },
  { id: 'e10', behavior: 'growling', dominantContext: 'dog interaction', contextCount: 2, observationCount: 2, strongestFrequency: 'intermittent', trend: 'watch', positive: false, expectedResources: ['res-19', 'res-20'], expectedEscalation: true, note: 'sensitive behaviour, recurring' },
  { id: 'e11', behavior: 'fear and anxiety', dominantContext: 'new environment', contextCount: 1, observationCount: 1, strongestFrequency: 'once', trend: 'steady', positive: false, expectedResources: ['res-19'], expectedEscalation: true, note: 'sensitive behaviour in a new setting' },
  { id: 'e12', behavior: 'jumping on people', dominantContext: 'home environment', contextCount: 1, observationCount: 3, strongestFrequency: 'repeated', trend: 'improving', positive: false, expectedResources: ['res-11', 'res-12', 'res-24'], expectedEscalation: false, note: 'greetings improving at home' },
  { id: 'e13', behavior: 'jumping on people', dominantContext: 'unfamiliar person', contextCount: 2, observationCount: 4, strongestFrequency: 'repeated', trend: 'watch', positive: false, expectedResources: ['res-12', 'res-11', 'res-20'], expectedEscalation: true, note: 'greetings spreading to new people' },
  { id: 'e14', behavior: 'excitable greetings', dominantContext: 'excitable greeting', contextCount: 1, observationCount: 2, strongestFrequency: 'intermittent', trend: 'steady', positive: false, expectedResources: ['res-11', 'res-17'], expectedEscalation: false, note: 'intermittent greeting excitement' },
  { id: 'e15', behavior: 'excitable greetings', dominantContext: 'unfamiliar person', contextCount: 1, observationCount: 3, strongestFrequency: 'repeated', trend: 'watch', positive: false, expectedResources: ['res-12', 'res-21', 'res-11'], expectedEscalation: true, note: 'greeting excitement increasing' },
  { id: 'e16', behavior: 'impulsivity', dominantContext: 'excitable greeting', contextCount: 1, observationCount: 3, strongestFrequency: 'repeated', trend: 'steady', positive: false, expectedResources: ['res-18', 'res-17', 'res-11'], expectedEscalation: false, note: 'impulse control at greetings' },
  { id: 'e17', behavior: 'impulsivity', dominantContext: 'training class', contextCount: 2, observationCount: 4, strongestFrequency: 'repeated', trend: 'watch', positive: false, expectedResources: ['res-17', 'res-20', 'res-18'], expectedEscalation: true, note: 'arousal building across settings' },
  { id: 'e18', behavior: 'poor eye contact', dominantContext: 'training class', contextCount: 1, observationCount: 3, strongestFrequency: 'repeated', trend: 'watch', positive: false, expectedResources: ['res-07', 'res-08', 'res-28'], expectedEscalation: true, note: 'attention under distraction' },
  { id: 'e19', behavior: 'poor eye contact', dominantContext: 'home training', contextCount: 1, observationCount: 2, strongestFrequency: 'intermittent', trend: 'improving', positive: false, expectedResources: ['res-07', 'res-08'], expectedEscalation: false, note: 'attention improving at home' },
  { id: 'e20', behavior: 'poor responsivity', dominantContext: 'home training', contextCount: 1, observationCount: 3, strongestFrequency: 'repeated', trend: 'steady', positive: false, expectedResources: ['res-07', 'res-28', 'res-08'], expectedEscalation: false, note: 'cue response at home' },
  { id: 'e21', behavior: 'poor responsivity', dominantContext: 'crowded public space', contextCount: 3, observationCount: 5, strongestFrequency: 'repeated', trend: 'watch', positive: false, expectedResources: ['res-20', 'res-28', 'res-04'], expectedEscalation: true, note: 'cue response failing everywhere' },
  { id: 'e22', behavior: 'recovered well after challenge', dominantContext: 'crowded public space', contextCount: 1, observationCount: 2, strongestFrequency: 'intermittent', trend: 'improving', positive: true, expectedResources: ['res-05', 'res-06', 'res-27'], expectedEscalation: false, note: 'recovery improving' },
  { id: 'e23', behavior: 'recovered well after challenge', dominantContext: 'new environment', contextCount: 2, observationCount: 3, strongestFrequency: 'intermittent', trend: 'improving', positive: true, expectedResources: ['res-05', 'res-06', 'res-15'], expectedEscalation: false, note: 'recovery in new settings' },
  { id: 'e24', behavior: 'ignored distraction', dominantContext: 'training class', contextCount: 1, observationCount: 2, strongestFrequency: 'once', trend: 'improving', positive: true, expectedResources: ['res-14', 'res-27', 'res-13'], expectedEscalation: false, note: 'positive around distraction' },
  { id: 'e25', behavior: 'plays well with dogs', dominantContext: 'dog interaction', contextCount: 1, observationCount: 2, strongestFrequency: 'intermittent', trend: 'improving', positive: true, expectedResources: ['res-14', 'res-13'], expectedEscalation: false, note: 'positive dog interaction' },
  { id: 'e26', behavior: 'low focus or engagement', dominantContext: 'dog interaction', contextCount: 1, observationCount: 3, strongestFrequency: 'repeated', trend: 'watch', positive: false, expectedResources: ['res-13', 'res-03', 'res-04'], expectedEscalation: true, note: 'distraction around other dogs' },
  { id: 'e27', behavior: 'good public access behaviour', dominantContext: 'crowded public space', contextCount: 2, observationCount: 3, strongestFrequency: 'intermittent', trend: 'improving', positive: true, expectedResources: ['res-15', 'res-28', 'res-27'], expectedEscalation: false, note: 'public access improving' },
  { id: 'e28', behavior: 'successful settling', dominantContext: 'training class', contextCount: 1, observationCount: 1, strongestFrequency: 'once', trend: 'steady', positive: true, expectedResources: ['res-02', 'res-01', 'res-26'], expectedEscalation: false, note: 'first settle in class' },
  { id: 'e29', behavior: 'low focus or engagement', dominantContext: 'new environment', contextCount: 1, observationCount: 2, strongestFrequency: 'once', trend: 'steady', positive: false, expectedResources: ['res-15', 'res-03', 'res-26'], expectedEscalation: false, note: 'novelty response' },
  { id: 'e30', behavior: 'barking', dominantContext: 'home environment', contextCount: 1, observationCount: 2, strongestFrequency: 'intermittent', trend: 'improving', positive: false, expectedResources: ['res-09', 'res-24', 'res-25'], expectedEscalation: false, note: 'vocalisation improving at home' },
];
