/* ============================================================
   SYNTHETIC DEMO DATA — "Maple"

   Every record below is invented for this demonstration. Maple is not a
   real dog, and no observation here comes from the GuideAI pilot, from
   Canine Companions, or from any pilot participant. The pilot outcome
   numbers quoted in the case study are separate and are not derived from
   this file.

   The set is shaped so the workflow has something real to show over four
   weeks: settling that improves, distraction concentrated in
   high-stimulation contexts, and one behavior that is worth a trainer's
   attention rather than a confident answer.
   ============================================================ */

import type { Frequency, ObservationType } from './rules';

export type Observation = {
  id: string;
  /** ISO date, oldest first */
  date: string;
  observation_type: ObservationType;
  behavior: string;
  context: string;
  frequency: Frequency;
  /** the raiser's own note */
  note?: string;
  /** only meaningful on positive observations */
  positive_support_context?: string;
};

export const DOG = {
  name: 'Maple',
  age_group: '7-9 months',
  breed: 'Labrador Retriever',
  first_time_raiser: true,
};

/** Week 1 is the oldest. Dates are fixed so the demo is deterministic. */
export const SEED_OBSERVATIONS: Observation[] = [
  /* ---------- Week 1 ---------- */
  {
    id: 'obs-01',
    date: '2026-08-03',
    observation_type: 'challenge / concern',
    behavior: 'barking',
    context: 'crowded public space',
    frequency: 'once',
    note: 'Barked at a cart in the hardware store. Settled after we stepped outside.',
  },
  {
    id: 'obs-02',
    date: '2026-08-04',
    observation_type: 'challenge / concern',
    behavior: 'low focus or engagement',
    context: 'training class',
    frequency: 'intermittent',
    note: 'Struggled to hold attention when the other dogs moved.',
  },
  {
    id: 'obs-03',
    date: '2026-08-06',
    observation_type: 'challenge / concern',
    behavior: 'jumping on people',
    context: 'home environment',
    frequency: 'repeated',
    note: 'Jumped on both visitors at the door.',
  },
  {
    id: 'obs-04',
    date: '2026-08-07',
    observation_type: 'positive progress',
    behavior: 'successful settling',
    context: 'home environment',
    frequency: 'once',
    note: 'Settled on the mat for about ten minutes while we ate.',
    positive_support_context: 'Same mat, same corner of the room, TV off.',
  },

  /* ---------- Week 2 ---------- */
  {
    id: 'obs-05',
    date: '2026-08-10',
    observation_type: 'challenge / concern',
    behavior: 'low focus or engagement',
    context: 'crowded public space',
    frequency: 'repeated',
    note: 'Lost focus repeatedly near the store entrance.',
  },
  {
    id: 'obs-06',
    date: '2026-08-11',
    observation_type: 'positive progress',
    behavior: 'successful settling',
    context: 'home environment',
    frequency: 'intermittent',
    note: 'Settled twice without being asked.',
    positive_support_context: 'Used the mat again before things got busy.',
  },
  {
    id: 'obs-07',
    date: '2026-08-13',
    observation_type: 'challenge / concern',
    behavior: 'jumping on people',
    context: 'home environment',
    frequency: 'repeated',
    note: 'Still jumping at arrivals, though recovered faster.',
  },
  {
    id: 'obs-08',
    date: '2026-08-15',
    observation_type: 'positive progress',
    behavior: 'recovered well after challenge',
    context: 'crowded public space',
    frequency: 'once',
    note: 'Startled by a dropped tray, recovered in about five seconds.',
    positive_support_context: 'Stepped away and let her watch before re-approaching.',
  },

  /* ---------- Week 3 ---------- */
  {
    id: 'obs-09',
    date: '2026-08-18',
    observation_type: 'positive progress',
    behavior: 'successful settling',
    context: 'training class',
    frequency: 'intermittent',
    note: 'Settled between exercises for the first time in class.',
    positive_support_context: 'Sat off to the side rather than in the middle of the room.',
  },
  {
    id: 'obs-10',
    date: '2026-08-19',
    observation_type: 'challenge / concern',
    behavior: 'low focus or engagement',
    context: 'crowded public space',
    frequency: 'repeated',
    note: 'Same pattern near the entrance. Better once we moved farther in.',
  },
  {
    id: 'obs-11',
    date: '2026-08-21',
    observation_type: 'positive progress',
    behavior: 'successful settling',
    context: 'home environment',
    frequency: 'repeated',
    note: 'Settling is becoming the default at home.',
    positive_support_context: 'Consistent mat and a predictable evening routine.',
  },
  {
    id: 'obs-12',
    date: '2026-08-22',
    observation_type: 'challenge / concern',
    behavior: 'growling',
    context: 'unfamiliar person',
    frequency: 'once',
    note: 'Low growl when a stranger reached over her head. Backed off and she stopped.',
  },

  /* ---------- Week 4 ---------- */
  {
    id: 'obs-13',
    date: '2026-08-25',
    observation_type: 'positive progress',
    behavior: 'successful settling',
    context: 'crowded public space',
    frequency: 'intermittent',
    note: 'Settled at a cafe table for about fifteen minutes.',
    positive_support_context: 'Brought the same mat out with us.',
  },
  {
    id: 'obs-14',
    date: '2026-08-26',
    observation_type: 'challenge / concern',
    behavior: 'low focus or engagement',
    context: 'crowded public space',
    frequency: 'intermittent',
    note: 'Still distracted at the entrance, but shorter.',
  },
  {
    id: 'obs-15',
    date: '2026-08-28',
    observation_type: 'positive progress',
    behavior: 'successful settling',
    context: 'home environment',
    frequency: 'repeated',
    note: 'Settled through a whole visit from family.',
    positive_support_context: 'Mat by the door before anyone arrived.',
  },
  {
    id: 'obs-16',
    date: '2026-08-29',
    observation_type: 'positive progress',
    behavior: 'ignored distraction',
    context: 'training class',
    frequency: 'once',
    note: 'Held a sit while another dog walked past.',
    positive_support_context: 'Rewarded the check-in before the other dog got close.',
  },
];
