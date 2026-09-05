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
        lede={
          <>
            Most assistants decide what to say. TrustLayer decides{' '}
            <strong>what behavior is appropriate</strong> first — routing a request to ANSWER, ASK,
            VERIFY or ESCALATE based on the evidence, authorization and reversibility actually
            available. Pick a request and watch the policy run.
          </>
        }
        disclosure="Interactive demo · synthetic scenarios. Scenarios and results here are synthetic and designed to test policy behavior, not production performance. Tools are simulated over local fixtures, the escalation handoff is simulated, and no model is called — the classifier and the policy are both deterministic."
        caseStudyHref="/work/trustlayer"
        caseStudyLabel="Read the full case study"
      >
        <TrustLayerDemo />
      </DemoShell>
    </PageShell>
  );
}
