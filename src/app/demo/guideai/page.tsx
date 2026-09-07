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
            Turn repeated behavior observations into patterns, grounded recommendations, and better
            trainer conversations. <strong>GuideAI supports trainer judgment — it does not replace
            it.</strong>
          </>
        }
        disclosure="This demo reconstructs the GuideAI workflow with synthetic data and local retrieval. The piloted product ran over approved training resources, the raiser's own longitudinal dog history, and an AI synthesis layer. Maple is not a real dog and no record here comes from the pilot; the case-study metrics refer to that pilot, not to this reconstruction."
        caseStudyHref="/work/guideai"
        caseStudyLabel="Read the full case study"
      >
        <GuideAIDemo />
      </DemoShell>
    </PageShell>
  );
}
