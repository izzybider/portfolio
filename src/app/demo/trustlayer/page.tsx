import type { Metadata } from 'next';
import { PageShell } from '@/components';
import DemoShell from '@/components/DemoShell';
import TrustLayerDemo from './TrustLayerDemo';

export const metadata: Metadata = {
  title: 'TrustLayer Interactive Experiment — Isabella Bider',
  description:
    'An interactive AI policy experiment: watch a request routed to ANSWER, ASK, VERIFY or ESCALATE before anything is generated. Synthetic scenarios and simulated tools.',
  openGraph: {
    title: 'TrustLayer Interactive Experiment — Isabella Bider',
    description:
      'Watch a request routed to ANSWER, ASK, VERIFY or ESCALATE before anything is generated. Synthetic scenarios.',
  },
  alternates: { canonical: '/demo/trustlayer' },
};

export default function TrustLayerDemoPage() {
  return (
    <PageShell>
      <DemoShell
        eyebrow="Interactive experiment · TrustLayer"
        title="TrustLayer"
        badge="Interactive demo · synthetic scenarios"
        lede={
          <>
            Most assistants decide what to say. TrustLayer is the decision layer in front of an
            agent: it decides <strong>what behavior is appropriate</strong> before anything is
            generated — routing a request to ANSWER, ASK, VERIFY or ESCALATE on the evidence,
            authorization and reversibility actually available, and calling tools only when the
            route calls for them.
          </>
        }
        disclosure="Scenarios, tool results, and benchmark results are synthetic and test policy behavior, not production performance. Tools are simulated over local fixtures, the escalation handoff is simulated, and no model is called — the classifier and the policy are both deterministic."
        caseStudyHref="/work/trustlayer"
        caseStudyLabel="Read the full case study"
      >
        <TrustLayerDemo />
      </DemoShell>
    </PageShell>
  );
}
