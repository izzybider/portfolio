import type { Metadata } from 'next';
import {
  PageShell,
  CaseStudyHero,
  CaseStudyFooter,
  Section,
  ArtifactCard,
  DecisionCallout,
  InsightCallout,
  ProcessFlow,
  DataTable,
  Tag,
  ExperimentComparison,
  InfoPanel,
  ProvenanceNote,
} from '@/components';

export const metadata: Metadata = {
  title: 'KosiSonic — Isabella “Izzy” Bider',
  description:
    'A supporting mini case: when a better technical metric did not mean a better listening experience.',
  openGraph: { title: 'KosiSonic — Isabella “Izzy” Bider', description: 'A supporting mini case: when a better technical metric did not mean a better listening experience.' },
  alternates: { canonical: '/work/kosisonic' },
};

/* CONTENT INTEGRITY NOTE — Phase 2 edit.
   Removed the exact signal and preference figures from the earlier draft
   (input SNR, per-configuration dB gains, clarity / naturalness / listening-
   effort scores and preference percentages). The qualitative finding — the
   configuration with the largest noise reduction was not the one listeners
   preferred — is retained. Restore specific figures only if you can publish
   them. */

const WAVE = [30, 62, 44, 88, 52, 70, 38, 96, 46, 74, 34, 58, 80, 42, 66, 50];
const SPEC_IN = [0, 0, 1, 2, 2, 1, 0, 0, 1, 0];
const SPEC_OUT = [0, 0, 0, 1, 2, 2, 1, 0, 0, 0];

export default function KosiSonicPage() {
  return (
    <PageShell>
      <CaseStudyHero
        eyebrow="Supporting mini case · KosiSonic"
        title="When better signal processing did not mean better UX"
        statement="I worked on signal-processing systems for AI hearing technology and interviewed the people using them. The configuration that scored best technically was not the one listeners preferred — and reconciling that was the actual product problem."
        roles={[
          'Software Engineering Intern',
          'Python / MATLAB',
          'Signal processing',
          '25 user + clinician interviews',
        ]}
      />

      {/* ---------------- SIGNAL ---------------- */}
      <Section
        id="signal"
        label="01 · From signal to experience"
        title="The algorithm was only one layer of the product."
        intro="Processing changes the audio. Whether that change is an improvement is decided several layers later, by a person in a room with background noise."
      >
        <ArtifactCard
          title="Processing pipeline"
          meta="Reconstructed — proprietary implementation not shown"
        >
          <ProcessFlow
            steps={[
              'Raw audio',
              'Preprocessing',
              'Signal analysis',
              'Enhancement',
              'Processed audio',
              'Listener',
              'Perceived clarity / naturalness',
            ]}
            highlight={[5, 6]}
          />
          <p className="meta" style={{ marginTop: 'var(--s3)' }}>
            Engineering evaluation stops at the fifth box. The product only exists
            after the sixth.
          </p>
        </ArtifactCard>

        <div className="grid grid--3">
          <InfoPanel tone="white" label="Engineering question">
            <p className="insight__text">What did the algorithm change?</p>
          </InfoPanel>
          <InfoPanel tone="blue" label="Product question">
            <p className="insight__text">
              Did that change improve the listening experience?
            </p>
          </InfoPanel>
          <InfoPanel tone="gray" label="User question">
            <p className="insight__text">Would someone choose to listen to this?</p>
          </InfoPanel>
        </div>
      </Section>

      {/* ---------------- CONFLICT ---------------- */}
      <Section
        id="conflict"
        label="02 · The conflict"
        title="The highest-scoring configuration was not the preferred one."
        intro="I compared processing configurations on the signal metric the system was designed to optimize, then compared the same configurations on what listeners actually reported."
      >
        <div className="grid grid--2">
          <ArtifactCard title="Input" meta="Speech + background noise">
            <div className="waveform" aria-hidden="true">
              {WAVE.map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <p className="meta" style={{ marginTop: 'var(--s2)' }}>
              Speech in noise — the case the enhancement exists for.
            </p>
          </ArtifactCard>
          <ArtifactCard title="Input vs processed" meta="Reconstructed spectrogram">
            <p className="caps">Input</p>
            <div className="spectrogram" aria-hidden="true">
              {SPEC_IN.map((density, index) => (
                <span
                  key={index}
                  className={
                    density === 2 ? 'is-dense' : density === 1 ? 'is-mid' : undefined
                  }
                />
              ))}
            </div>
            <p className="caps" style={{ marginTop: 'var(--s2)' }}>
              Processed
            </p>
            <div className="spectrogram" aria-hidden="true">
              {SPEC_OUT.map((density, index) => (
                <span
                  key={index}
                  className={
                    density === 2 ? 'is-dense' : density === 1 ? 'is-mid' : undefined
                  }
                />
              ))}
            </div>
          </ArtifactCard>
        </div>

        <ArtifactCard
          title="Configuration comparison"
          meta="Signal metric vs listener response"
          caption="Directional comparison. Exact per-configuration values are not published here."
        >
          <ExperimentComparison
            metricLabel="Measure"
            columns={[
              { name: 'Baseline', sub: 'No enhancement' },
              { name: 'Conservative' },
              { name: 'Aggressive', sub: 'Best on the signal metric' },
              { name: 'Balanced', sub: 'Listener preference', win: true },
            ]}
            rows={[
              {
                metric: 'Noise reduction',
                values: ['None', 'Moderate', 'Highest', 'High'],
              },
              {
                metric: 'Clarity',
                values: ['Lowest', 'Improved', 'High', 'Highest'],
              },
              {
                metric: 'Naturalness',
                values: ['High', 'High', 'Degraded', 'High'],
              },
              {
                metric: 'Listening effort',
                values: ['High', 'Moderate', 'Moderate', 'Lowest'],
              },
              {
                metric: 'Listener preference',
                values: ['Lowest', 'Moderate', 'Moderate', 'Strongest'],
              },
            ]}
          />
        </ArtifactCard>

        <ProvenanceNote>
          Noise reduction alone did not predict a better listening experience.
        </ProvenanceNote>
      </Section>

      {/* ---------------- RESEARCH ---------------- */}
      <Section
        id="research"
        label="03 · User + clinician research"
        title="A signal can look better and still sound worse."
        intro="My job was to turn what listeners said into something an engineering team could act on: a technical hypothesis and a product implication."
      >
        <DataTable
          columns={[
            'What users and clinicians reported',
            'Technical hypothesis',
            'Product implication',
          ]}
          rows={[
            [
              'Speech is clearer, but voices sound less natural.',
              'Aggressive processing suppresses cues that carry naturalness.',
              <span key="a">
                <Tag>Evaluate clarity and naturalness separately</Tag>
              </span>,
            ],
            [
              'The improvement is most noticeable in noisy rooms.',
              'Value depends heavily on environmental signal-to-noise ratio.',
              <span key="b">
                <Tag>Evaluate by listening context</Tag>
              </span>,
            ],
            [
              'Lower noise, but more effort to follow speech.',
              'Noise reduction introduces artifacts or alters speech cues.',
              <span key="c">
                <Tag>Add listening effort as a quality measure</Tag>
              </span>,
            ],
            [
              'One setting works here but feels unnecessary in a quiet room.',
              'Optimal processing strength varies by environment.',
              <span key="d">
                <Tag>Explore adaptive, context-sensitive settings</Tag>
              </span>,
            ],
            [
              'Clinician: two people with similar profiles prefer different settings.',
              'Objective profile alone does not predict perceptual preference.',
              <span key="e">
                <Tag>Personalization and user-adjustable settings</Tag>
              </span>,
            ],
          ]}
        />
      </Section>

      {/* ---------------- DECISION ---------------- */}
      <Section
        id="decision"
        label="04 · What changed"
        title="Technical improvement and product improvement were not the same thing."
      >
        <DecisionCallout note="Before: algorithm → technical metric → choose the best configuration. After: technical metrics + listening context + user perception + clinician feedback → tradeoff analysis → product decision.">
          Stop optimizing noise reduction independently. Evaluate configurations
          on signal performance, clarity, naturalness, listening effort and
          preference together.
        </DecisionCallout>

        <InsightCallout>
          Technical metrics are evidence. They are not the user outcome.
        </InsightCallout>

        <p className="body-text">
          This became a pattern in how I work: pair technical evidence with
          evidence from the people using the system, and treat the disagreement
          between them as the most informative thing available — not as noise.
        </p>
      </Section>

      <CaseStudyFooter current="/work/kosisonic" />
    </PageShell>
  );
}
