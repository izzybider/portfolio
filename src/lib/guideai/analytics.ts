/* ============================================================
   PRODUCT INSTRUMENTATION

   The same event names the GuideAI application uses, extended for the
   surfaces this demo adds. Events go to PostHog when
   NEXT_PUBLIC_POSTHOG_KEY is configured and are a no-op otherwise, so the
   demo behaves identically with or without analytics.

   No usage number anywhere in this portfolio is derived from these events.
   They exist so the instrumentation is real and reviewable, not to produce
   a metric.
   ============================================================ */

export type GuideAIEvent =
  | 'guideai_demo_started'
  | 'observation_logged'
  | 'trend_viewed'
  | 'recommendation_generated'
  | 'retrieval_inspected'
  | 'source_opened'
  | 'trainer_prep_generated'
  | 'escalation_shown'
  | 'demo_completed';

/** Documented in one place so the instrumentation surface is reviewable. */
export const EVENT_CATALOG: { name: GuideAIEvent; when: string }[] = [
  { name: 'guideai_demo_started', when: 'The demo is opened.' },
  { name: 'observation_logged', when: 'An observation is saved.' },
  { name: 'trend_viewed', when: 'The trends view is opened.' },
  { name: 'recommendation_generated', when: 'A grounded recommendation is produced.' },
  { name: 'retrieval_inspected', when: 'The AI pipeline trace is expanded.' },
  { name: 'source_opened', when: 'A retrieved source card is expanded.' },
  { name: 'trainer_prep_generated', when: 'The trainer-prep summary is produced.' },
  { name: 'escalation_shown', when: 'Trainer review is recommended for a behaviour.' },
  { name: 'demo_completed', when: 'The trainer-prep summary is copied.' },
];

const host = () =>
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

export function track(event: GuideAIEvent, properties: Record<string, unknown> = {}) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || typeof window === 'undefined') return;
  try {
    /* Fire and forget. A failed analytics call must never affect the demo. */
    void fetch(`${host()}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        api_key: key,
        event,
        properties: { ...properties, surface: 'portfolio_demo', $lib: 'guideai-demo' },
        timestamp: new Date().toISOString(),
        distinct_id: sessionId(),
      }),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

/** Per-tab, random, not persisted and not linked to anything. */
let cached: string | null = null;
function sessionId(): string {
  if (cached) return cached;
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  cached = `anon-${Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')}`;
  return cached;
}
