/* ============================================================
   SYNTHETIC / GENERALIZED DEMO RESOURCE CORPUS

   Written for this demonstration. Nothing here is Canine Companions
   material, official training guidance, or a real organisation's
   curriculum, and none of it should be followed as instruction. Every
   entry carries source_type: 'synthetic_demo_resource'.

   The shape is taken from the GuideAI application's own resource layer
   (`guideai/services/resource_service.py`): behaviour tags, context tags
   and a short reason, plus the app's rule that sensitive behaviours are
   never matched automatically. That rule is preserved here.

   Content is deliberately about *what to observe and record* and *when to
   involve a trainer*, not about what to do with the dog.
   ============================================================ */

export type ResourceCategory =
  | 'engagement'
  | 'settling'
  | 'public-access'
  | 'arousal'
  | 'recovery'
  | 'dog-interaction'
  | 'people-interaction'
  | 'escalation'
  | 'observation-quality';

export type Resource = {
  id: string;
  title: string;
  category: ResourceCategory;
  behavior_tags: string[];
  context_tags: string[];
  content: string;
  escalation_note: string;
  source_type: 'synthetic_demo_resource';
};

const R = (
  id: string,
  title: string,
  category: ResourceCategory,
  behavior_tags: string[],
  context_tags: string[],
  content: string,
  escalation_note: string,
): Resource => ({
  id,
  title,
  category,
  behavior_tags,
  context_tags,
  content,
  escalation_note,
  source_type: 'synthetic_demo_resource',
});

export const CORPUS: Resource[] = [
  R('res-01', 'Recording settling in a busy place', 'settling',
    ['successful settling', 'low focus or engagement'],
    ['crowded public space', 'new environment'],
    'Settling in a high-stimulation setting is worth recording precisely: where the dog settled, how long it took, and what the surroundings were doing at the time. A settle that took four minutes in a quiet corner and a settle that took thirty seconds beside a doorway are different observations even though both are successes.',
    'Bring it to a trainer if settling is getting slower over several weeks rather than faster.'),

  R('res-02', 'What a settling pattern looks like over time', 'settling',
    ['successful settling'],
    ['home environment', 'training class'],
    'A single settle says little. A pattern is visible when the same setting produces the same result several times, or when the time to settle moves consistently in one direction. Logging the setting each time is what makes the trend readable later.',
    'Ask a trainer which settling conditions are the ones worth repeating.'),

  R('res-03', 'Distraction in public settings', 'public-access',
    ['low focus or engagement', 'poor eye contact', 'poor responsivity'],
    ['crowded public space', 'new environment'],
    'Distraction that appears only in public settings is a different observation from distraction that appears everywhere. Recording the level of activity nearby, and how close the dog was to it, separates a setting problem from a general engagement problem.',
    'Involve a trainer if the same distraction begins appearing in quiet settings too.'),

  R('res-04', 'Distance and distraction', 'public-access',
    ['low focus or engagement', 'poor responsivity'],
    ['crowded public space', 'unfamiliar person'],
    'Distance to whatever is competing for attention is one of the most useful things to write down. Two observations of the same behaviour at very different distances tell a trainer far more than two observations without it.',
    'Raise it with a trainer if the workable distance is increasing rather than shrinking.'),

  R('res-05', 'Recovery time as an observation', 'recovery',
    ['recovered well after challenge', 'low focus or engagement'],
    ['crowded public space', 'new environment', 'unfamiliar person'],
    'How long the dog takes to re-engage after something interrupts them is often more informative than the interruption itself. Recording roughly how many seconds it took, and what helped, gives a trainer a measure that can be compared across weeks.',
    'Flag it if recovery is getting longer, or if the dog does not recover within the session.'),

  R('res-06', 'When recovery is improving', 'recovery',
    ['recovered well after challenge'],
    ['crowded public space', 'training class'],
    'Improving recovery usually shows up before the triggering behaviour disappears. Logging the successful recoveries, not only the difficulties, is what makes that visible.',
    'Ask a trainer whether the recovery pattern is strong enough to increase difficulty.'),

  R('res-07', 'Leash attention and engagement', 'engagement',
    ['poor eye contact', 'low focus or engagement', 'poor responsivity'],
    ['home training', 'training class', 'crowded public space'],
    'Attention is the foundation most other work depends on, which is why it is worth recording separately from the behaviour it affects. Note whether attention was offered or asked for, and what else was happening.',
    'Bring it to a trainer if attention is inconsistent across several sessions in the same setting.'),

  R('res-08', 'Engagement in quiet versus busy settings', 'engagement',
    ['poor eye contact', 'low focus or engagement'],
    ['home environment', 'home training', 'crowded public space'],
    'Comparing the same engagement behaviour in a quiet and a busy setting is one of the clearest signals a raiser can produce. The contrast between them is usually the thing a trainer wants to hear about.',
    'Discuss it with a trainer if the gap between quiet and busy settings is widening.'),

  R('res-09', 'Vocalisation: what to note', 'arousal',
    ['barking'],
    ['crowded public space', 'training class', 'home environment'],
    'When recording vocalisation, the useful details are what preceded it, how long it lasted, and what the surroundings were doing. Frequency alone rarely tells a trainer enough to act on.',
    'Involve a trainer if vocalisation is happening across several different settings.'),

  R('res-10', 'Vocalisation in training sessions', 'arousal',
    ['barking', 'impulsivity'],
    ['training class', 'home training'],
    'Vocalisation during structured sessions is worth separating from vocalisation elsewhere, because it affects what the session can cover. Note where in the session it happened.',
    'Raise it if it happens in most sessions or interrupts the session repeatedly.'),

  R('res-11', 'Greeting behaviour around people', 'people-interaction',
    ['excitable greetings', 'jumping on people', 'impulsivity'],
    ['home environment', 'unfamiliar person', 'excitable greeting'],
    'Greetings depend heavily on setup: who was there, how the greeting began, and whether the dog had space. Logging the setup is what makes a greeting pattern legible rather than anecdotal.',
    'Ask a trainer if greetings are becoming harder to interrupt or appearing in new places.'),

  R('res-12', 'Familiar versus unfamiliar people', 'people-interaction',
    ['excitable greetings', 'jumping on people'],
    ['unfamiliar person', 'home environment'],
    'Whether a greeting behaviour differs between familiar and unfamiliar people is a distinction worth capturing explicitly, because it points at different underlying situations.',
    'Bring the comparison to a trainer rather than drawing a conclusion from it.'),

  R('res-13', 'Around other dogs', 'dog-interaction',
    ['low focus or engagement', 'impulsivity', 'plays well with dogs'],
    ['dog interaction', 'training class', 'crowded public space'],
    'Behaviour around other dogs is easiest to interpret when the record includes distance, whether the other dog was moving, and whether the interaction was expected or sudden.',
    'Involve a trainer before increasing exposure if the pattern is inconsistent.'),

  R('res-14', 'Recording a positive dog interaction', 'dog-interaction',
    ['plays well with dogs', 'ignored distraction'],
    ['dog interaction', 'training class'],
    'Successful interactions are worth as much record-keeping as difficult ones, because they identify the conditions worth repeating.',
    'Ask a trainer which of those conditions are the ones to generalise.'),

  R('res-15', 'Public access: what changes in a new setting', 'public-access',
    ['low focus or engagement', 'good public access behaviour'],
    ['new environment', 'crowded public space'],
    'A first visit to a new setting is a different observation from a repeat visit. Recording which it was prevents a novelty response from being read as a pattern.',
    'Bring it to a trainer if the same response persists on repeat visits.'),

  R('res-16', 'Duration and fatigue', 'public-access',
    ['low focus or engagement', 'successful settling'],
    ['crowded public space', 'training class'],
    'How long the dog had already been working is context that changes how an observation should be read. Noting session length alongside the behaviour keeps that available later.',
    'Discuss it if difficulty consistently appears at the same point in a session.'),

  R('res-17', 'Arousal that builds gradually', 'arousal',
    ['impulsivity', 'barking', 'excitable greetings'],
    ['crowded public space', 'excitable greeting', 'training class'],
    'Behaviour that builds over minutes is a different observation from behaviour that appears instantly. Recording which one happened is often the detail that changes a trainer\'s read.',
    'Raise it with a trainer if it is becoming harder to interrupt once it starts.'),

  R('res-18', 'Impulse control observations', 'arousal',
    ['impulsivity'],
    ['excitable greeting', 'home environment', 'training class'],
    'Impulse-control moments are easiest to compare when the record says what the dog was waiting for and how long the wait was.',
    'Involve a trainer if the same situation is getting harder rather than easier.'),

  R('res-19', 'Signals worth escalating early', 'escalation',
    ['growling', 'fear and anxiety'],
    ['unfamiliar person', 'new environment', 'dog interaction'],
    'Some observations should go to a trainer promptly rather than accumulating into a pattern first. Anything involving a warning signal, avoidance, or a response that seems out of proportion to the situation belongs in that group.',
    'Contact a trainer after the first occurrence rather than waiting for a second.'),

  R('res-20', 'Behaviour appearing in new contexts', 'escalation',
    ['barking', 'growling', 'low focus or engagement', 'jumping on people'],
    ['new environment', 'crowded public space', 'unfamiliar person'],
    'A behaviour spreading from one setting into others is one of the clearer escalation signals available to a raiser, and it is visible only if the setting is recorded every time.',
    'Bring it to a trainer once the same behaviour appears in a second distinct context.'),

  R('res-21', 'When a pattern is getting harder to interrupt', 'escalation',
    ['barking', 'impulsivity', 'excitable greetings'],
    ['crowded public space', 'excitable greeting', 'training class'],
    'Interruptibility is a useful thing to track over time. A behaviour that used to stop easily and now does not is worth raising even if its frequency has not changed.',
    'Raise it with a trainer at the point interruptibility changes, not later.'),

  R('res-22', 'Trainer conversation: what to bring', 'observation-quality',
    ['low focus or engagement', 'barking', 'successful settling'],
    ['training class', 'home environment', 'crowded public space'],
    'A useful trainer conversation usually starts from a small number of specific observations rather than a general impression. Dates, settings and what happened immediately before are the parts that get used.',
    'This is the material a trainer needs in order to give a useful answer.'),

  R('res-23', 'Questions worth asking a trainer', 'observation-quality',
    ['low focus or engagement', 'successful settling', 'recovered well after challenge'],
    ['training class'],
    'Good questions tend to be about which patterns matter most, which settings to describe in more detail, and what to watch next. Questions framed that way get more actionable answers than asking whether something is normal.',
    'Bring the questions with the observations rather than separately.'),

  R('res-24', 'Making an observation specific', 'observation-quality',
    ['low focus or engagement', 'barking', 'jumping on people'],
    ['home environment', 'crowded public space', 'training class'],
    'The difference between a usable and an unusable observation is usually one line: what was happening immediately before. Adding it at the time is far easier than reconstructing it a week later.',
    'A trainer will ask for this first.'),

  R('res-25', 'Frequency, intensity and duration are different', 'observation-quality',
    ['barking', 'impulsivity', 'low focus or engagement'],
    ['crowded public space', 'training class', 'home environment'],
    'How often, how strongly and how long are three separate measures that often move independently. Recording them separately keeps a change in one from being hidden by another.',
    'Point out to a trainer which of the three actually changed.'),

  R('res-26', 'One-off versus recurring', 'observation-quality',
    ['barking', 'growling', 'jumping on people', 'low focus or engagement'],
    ['home environment', 'new environment', 'crowded public space'],
    'Whether something has happened once, occasionally or repeatedly changes how it should be read, and it is the field raisers most often skip. It is worth answering even when the answer is uncertain.',
    'A trainer will read a repeated pattern very differently from a single event.'),

  R('res-27', 'Recording what helped', 'observation-quality',
    ['successful settling', 'recovered well after challenge', 'ignored distraction'],
    ['home environment', 'crowded public space', 'training class'],
    'When something goes well, the conditions that produced it are the useful part of the record: the place, the routine, the distance, who was present.',
    'Ask a trainer which of those conditions are worth deliberately repeating.'),

  R('res-28', 'Consistency across people and places', 'engagement',
    ['poor responsivity', 'poor eye contact', 'good public access behaviour'],
    ['home environment', 'crowded public space', 'training class', 'unfamiliar person'],
    'Whether a behaviour holds up across different handlers, settings and levels of distraction is usually the question a trainer is working toward. Recording which of those varied makes the answer available.',
    'Bring the comparison to a trainer before concluding a behaviour is established.'),
];

/**
 * From the application's own resource_service: sensitive observations are
 * never matched automatically. Retrieval for these returns the escalation
 * material only, and the product asks for a trainer rather than suggesting
 * a next step.
 */
export const SENSITIVE_BEHAVIORS = new Set(['growling', 'fear and anxiety']);
