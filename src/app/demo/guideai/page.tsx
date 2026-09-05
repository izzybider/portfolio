import type { Metadata } from 'next';
import { PageShell } from '@/components';
import DemoShell from '@/components/DemoShell';
import GuideAIDemo from './GuideAIDemo';

export const metadata: Metadata = {
  title: 'GuideAI Interactive Demo — Isabella Bider',
  description:
    'An interactive demonstration of the GuideAI workflow: log a behavioral observation, watch the patterns update, and generate a trainer-prep summary. Synthetic example data.',
  openGraph: {
    title: 'GuideAI Interactive Demo — Isabella Bider',
    description:
      'Log an observation, watch the patterns update, and generate a trainer-prep summary. Synthetic example data.',
  },
  alternates: { canonical: '/demo/guideai' },
};

export default function GuideAIDemoPage() {
  return (
    <PageShell>
      <DemoShell
        eyebrow="Interactive demo · GuideAI"
        title="GuideAI"
        lede={
          <>
            GuideAI helps service-dog raisers turn repeated behavioral observations into structured
            patterns, a grounded recommendation, and a summary they can hand a trainer. Log one
            observation and every view below recalculates.
          </>
        }
        disclosure="This demonstration uses synthetic dog and observation data to illustrate the GuideAI workflow. Maple is not a real dog and no record here comes from the pilot. The outcome metrics in the case study come from that pilot and are separate from this demo."
        caseStudyHref="/work/guideai"
        caseStudyLabel="Read the full case study"
      >
        <GuideAIDemo />
      </DemoShell>
    </PageShell>
  );
}
