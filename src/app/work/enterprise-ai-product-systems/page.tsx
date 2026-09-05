import type { Metadata } from 'next';
import {
  PageShell,
  CaseStudyHero,
  CaseGlance,
  CaseStudyNav,
  CaseStudyFooter,
  Section,
  MetricStrip,
  InfoPanel,
  ArtifactCard,
  DeeperDetail,
  DecisionCallout,
  InsightCallout,
  ProcessFlow,
  ArchitectureDiagram,
  DataTable,
  Tag,
  KeyValueRows,
  Matrix2x2,
  SystemTrace,
  DefinitionGrid,
  ProvenanceNote,
} from '@/components';

export const metadata: Metadata = {
  title: 'Enterprise AI Product Systems — Isabella Bider',
  description:
    'AI product ownership on a 10,000-user enterprise platform: evaluation harness, production-data diagnosis, and prioritization.',
  openGraph: { title: 'Enterprise AI Product Systems — Isabella Bider', description: 'AI product ownership on a 10,000-user enterprise platform: evaluation harness, production-data diagnosis, and prioritization.' },
  alternates: { canonical: '/work/enterprise-ai-product-systems' },
};

/* TODO (verify before sending to employers): the synthetic dashboard figures,
   the root-cause validation-failure percentages, and the "hours to minutes"
   claim in section 04 are illustrative reconstructions of client work. They are
   labelled as such on the page. Replace with confirmed figures only if you are
   permitted to publish them; otherwise leave the framing as it stands.
   The V1 → V2 evaluation percentages from the earlier draft were REMOVED
   because they could read as historical production results. */

const NAV = [
  { id: 'system', label: 'System' },
  { id: 'evaluation', label: 'AI evaluation' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'prioritization', label: 'Prioritization' },
  { id: 'diagnosis', label: 'Diagnosis' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'learned', label: 'What I learned' },
];

export default function EnterpriseAIPage() {
  return (
    <PageShell
      nav={<CaseStudyNav title="Enterprise AI Product Systems" items={NAV} />}
    >
      <CaseStudyHero
        eyebrow="02 · Internship case study · Accenture Applied Intelligence"
        title="Enterprise AI Product Systems"
        statement="Technical product ownership during an Applied Intelligence internship, inside a production AI platform serving more than 10,000 users — where a single customer complaint could originate in retrieval, in the data pipeline, or in the workflow itself."
        roles={[
          'Applied Intelligence Technology Summer Analyst (AI Product Management)',
          'AI evaluation',
          'SQL / BigQuery',
          'Production-data investigation',
          'Prioritization',
          'UAT / release support',
        ]}
      >
        <MetricStrip
          variant="band"
          columns={3}
          items={[
            { value: '10,000+', label: 'platform users' },
            { value: '1M+', label: 'records analyzed' },
            { value: '~50', label: 'question golden evaluation suite' },
            { value: '40+', label: 'enhancements triaged' },
            { value: '4', label: 'proposals adopted for Phase 2' },
          ]}
        />
        <ProvenanceNote>
          Client-specific examples, interfaces, datasets, and workflows on this
          page are reconstructed with synthetic data to protect confidentiality.
        </ProvenanceNote>
      </CaseStudyHero>

      <CaseGlance
        status="internal"
        problem={
          <>
            One customer-facing AI symptom could originate in any of six system
            layers, and every report arrived already phrased as a feature
            request.
          </>
        }
        role={
          <>
            I owned requirements and enhancement prioritization, supported
            release and UAT, investigated production data issues, and built the
            AI evaluation and reporting that had been ad hoc.
          </>
        }
        decision={
          <>
            <strong>Diagnose the layer before scheduling the fix.</strong> The
            validation failures traced upstream, so the intervention went there
            rather than into the screen where the complaint appeared.
          </>
        }
        outcome={
          <>
            10,000+ users · 1M+ records analyzed · ~50-question golden evaluation
            suite · 40+ enhancements triaged, 4 adopted for Phase 2.
          </>
        }
      />

      {/* ---------------- SYSTEM ---------------- */}
      <Section
        id="system"
        label="01 · System complexity"
        title="“The AI gave a wrong answer” was never a single bug."
        intro="The same symptom could originate in six layers. Most of the work was deciding which one was responsible before anything got scheduled."
      >
        <ArtifactCard
          title="Platform map"
          meta="Where a reported defect can actually live"
          caption="Reconstructed system map. Decisions moved vertically through these layers rather than treating every report as a feature request."
        >
          <ArchitectureDiagram
            rows={[
              {
                nodes: [
                  {
                    name: 'Customer workflow',
                    sub: 'The operational job the user is trying to finish',
                    tone: 'accent',
                  },
                ],
              },
              {
                connector: 'fan',
                nodes: [
                  { name: 'Product UI', sub: 'Dashboards, saved views, alerts' },
                  {
                    name: 'AI assistant',
                    sub: 'Retrieval + generation over operational data',
                    tone: 'blue',
                  },
                ],
              },
              {
                connector: 'fan',
                nodes: [
                  { name: 'Reporting layer', sub: 'BigQuery + SQL transformations' },
                  { name: 'Data pipelines', sub: 'Ingestion, validation, business logic' },
                  { name: 'Cloud infrastructure', sub: 'Compute, cost, performance' },
                ],
              },
              {
                connector: 'line',
                nodes: [
                  {
                    name: 'Engineering & data teams',
                    sub: 'Where the fix is actually implemented',
                    tone: 'gray',
                  },
                ],
              },
            ]}
          />
        </ArtifactCard>
      </Section>

      {/* ---------------- AI EVALUATION ---------------- */}
      <Section
        id="evaluation"
        label="02 · AI evaluation harness"
        title="From “ask it some questions” to repeatable AI regression testing."
        intro="Release testing meant asking the assistant questions by hand. Releases could not be compared, failures could not be reproduced, and no one could say which layer had regressed."
      >
        <ArtifactCard title="Evaluation pipeline" meta="Run on every release candidate">
          <ProcessFlow
            steps={[
              'Golden set',
              'Run version',
              'Capture retrieval + generation',
              'Score dimensions',
              'Classify failure',
              'Compare releases',
              'Prioritize fixes',
            ]}
            highlight={[4]}
          />
        </ArtifactCard>

        <DeeperDetail summary="See a golden scenario and how it was scored" hint="evaluation detail">
  <div className="grid grid--2">
            <ArtifactCard title="One golden scenario" meta="~50 in the suite">
              <KeyValueRows
                rows={[
                  { key: 'Question', value: 'Which workloads drove this week’s cost increase?' },
                  { key: 'Expected answer', value: 'Named workloads with contribution to the increase' },
                  { key: 'Expected source', value: 'Cost + usage tables for the current period' },
                  { key: 'Expected behavior', value: 'Cite the source; do not answer if the period is incomplete' },
                  { key: 'Scoring criteria', value: 'Correctness · groundedness · completeness · usefulness' },
                ]}
              />
            </ArtifactCard>
            <ArtifactCard title="Scored dimensions" meta="Every scenario, every release">
              <DefinitionGrid
                columns={2}
                items={[
                  { term: 'Correctness', desc: 'Is the answer right?' },
                  { term: 'Completeness', desc: 'Does it cover what was asked?' },
                  { term: 'Groundedness', desc: 'Is it supported by retrieved data?' },
                  { term: 'Hallucination', desc: 'Did it assert what it could not know?' },
                  { term: 'Usefulness', desc: 'Does it advance the operational task?' },
                  { term: 'Latency', desc: 'Is it fast enough to be used?' },
                ]}
              />
            </ArtifactCard>
          </div>
        </DeeperDetail>

        <ArtifactCard
          title="Failure taxonomy → owner"
          meta="The routing table that made regressions assignable"
        >
          <DataTable
            columns={['Failure class', 'Signal', 'How I diagnosed it', 'Owner']}
            rows={[
              [
                <Tag key="t">Retrieval</Tag>,
                'Relevant source never surfaced',
                'Inspect retrieved context for the scenario',
                'AI / engineering',
              ],
              [
                <Tag key="t">Generation</Tag>,
                'Right evidence, wrong synthesis',
                'Compare output against the supplied context',
                'AI / product',
              ],
              [
                <Tag key="t">Source data</Tag>,
                'The underlying record is stale or wrong',
                'Validate against the upstream system',
                'Data team',
              ],
              [
                <Tag key="t">Product</Tag>,
                'Technically correct but not usable',
                'Observe workflow / task success',
                'Product / design',
              ],
              [
                <Tag key="t" tone="gray">
                  Performance
                </Tag>,
                'Good answer, too slow to use',
                'Trace latency through the stack',
                'Engineering',
              ],
            ]}
          />
        </ArtifactCard>

        <DecisionCallout
          label="What this changed"
          note="Release comparison became a scored diff rather than an argument. Quality improved across correctness, groundedness and retrieval success between the releases I evaluated, at a small latency cost — and every regression arrived with an owner attached."
        >
          Make AI quality a release gate with named failure classes, not a
          subjective impression.
        </DecisionCallout>
      </Section>

      {/* ---------------- ANALYTICS ---------------- */}
      <Section
        id="analytics"
        label="03 · Operational analytics"
        title="Teams were rebuilding the same weekly analysis by hand."
        intro="Cost, usage, validation health and production issues lived in separate systems, reassembled by hand every week before anyone could decide anything."
      >
        <div className="grid grid--2">
          <ArtifactCard title="Before" tone="plain">
            <ProcessFlow
              direction="vertical"
              steps={[
                'Multiple source systems',
                'Manual extraction',
                'Spreadsheet reconciliation',
                'Repeated weekly analysis',
                'Stakeholder review',
              ]}
            />
          </ArtifactCard>
          <ArtifactCard title="After" tone="plain">
            <ProcessFlow
              direction="vertical"
              tone="blue"
              steps={[
                'BigQuery',
                'SQL transformations',
                'Consolidated reporting layer',
                'Automated Power BI / HTML reporting',
                'Reporting logic reused by the AI assistant',
                'Natural-language operational insight',
              ]}
              highlight={[5]}
            />
          </ArtifactCard>
        </div>

        <DeeperDetail summary="See the consolidated operational view" hint="synthetic figures">
  <ArtifactCard
            title="Operational view"
            meta="Synthetic reconstruction"
            caption="Illustrative figures. The artifact is the shape of the decision: cost, workload concentration and validation health in one place, queryable in natural language."
          >
            <MetricStrip
              variant="plain"
              columns={3}
              size="sm"
              caps
              items={[
                { value: '$184K', label: 'Weekly compute spend' },
                { value: '+7.3%', label: 'Week over week' },
                { value: '428', label: 'Active workloads' },
                { value: '96.4%', label: 'Validation success' },
                { value: '14', label: 'Open anomalies' },
                { value: '9', label: 'High-cost workloads' },
              ]}
            />
            <div style={{ marginTop: 'var(--s3)' }}>
              <InfoPanel tone="blue" label="Asked in natural language">
                <p>
                  <strong>“Which workloads contributed most to this week’s cost
                  increase?”</strong>
                </p>
                <p>
                  Three workloads accounted for the majority of the increase, driven
                  by higher execution frequency and longer runtime.
                </p>
              </InfoPanel>
            </div>
          </ArtifactCard>
        </DeeperDetail>

        <DecisionCallout
          label="What this changed"
          note="The same SQL layer that fed the dashboard became the assistant's grounding for operational questions, so the answer a stakeholder read in a report and the answer the assistant gave came from one source."
        >
          Recurring manual assembly became a scheduled reporting layer teams and
          the AI assistant could both query.
        </DecisionCallout>
      </Section>

      {/* ---------------- PRIORITIZATION ---------------- */}
      <Section
        id="prioritization"
        label="04 · Prioritization"
        title="40+ requests, finite engineering capacity, four things that shipped."
        intro="Workshops, demos, UAT and production feedback produced 40+ candidate enhancements. The job was not maintaining the backlog — it was arguing for the few with real leverage."
      >
        <ArtifactCard
          title="Prioritization matrix"
          meta="Strategic leverage × effort"
          caption="Enhancements were scored on impact, reach, urgency, existing workaround, strategic leverage, dependency and effort — then placed here to make the tradeoff arguable in a room."
        >
          <Matrix2x2
            yAxis="Strategic leverage"
            xAxis={['Lower effort', 'Higher effort']}
            quadrants={[
              {
                head: 'High leverage · lower effort — Phase 2',
                items: ['Saved operational views', 'Recurring report automation'],
                emphasis: 'priority',
              },
              {
                head: 'High leverage · higher effort — Phase 2',
                items: ['Automated dependency visibility', 'Upstream validation alerts'],
              },
              {
                head: 'Low leverage · lower effort — defer',
                items: ['Additional dashboard filter', 'Cosmetic label changes'],
                emphasis: 'mute',
              },
              {
                head: 'Low leverage · higher effort — decline',
                items: ['Bespoke one-team view'],
                emphasis: 'mute',
              },
            ]}
          />
        </ArtifactCard>

        <DeeperDetail summary="See how three candidates actually scored" hint="scoring table">
  <ArtifactCard title="How three candidates scored" meta="1–5, my scoring framework">
            <DataTable
              columns={[
                'Enhancement',
                'Impact',
                'Reach',
                'Urgency',
                'Workaround',
                'Leverage',
                'Effort',
                'Call',
              ]}
              rows={[
                [
                  'Automated dependency visibility',
                  '5',
                  '5',
                  '4',
                  '1',
                  '5',
                  '3',
                  <Tag key="a">Phase 2</Tag>,
                ],
                [
                  'Saved operational views',
                  '4',
                  '4',
                  '3',
                  '3',
                  '4',
                  '2',
                  <Tag key="b">Phase 2</Tag>,
                ],
                [
                  'Additional dashboard filter',
                  '3',
                  '2',
                  '2',
                  '4',
                  '2',
                  '3',
                  <Tag key="c" tone="gray">
                    Defer
                  </Tag>,
                ],
              ]}
              caption="A low workaround score moved dependency visibility to the top: it was the only pain with no manual escape hatch."
            />
          </ArtifactCard>
        </DeeperDetail>
      </Section>

      {/* ---------------- DIAGNOSIS ---------------- */}
      <Section
        id="diagnosis"
        label="05 · Root-cause investigation"
        title="Trace the symptom before proposing the intervention."
        intro="Validation failures rose sharply across the platform. The request that arrived was for a dashboard filter; the actual problem was upstream."
      >
        <DeeperDetail summary="Follow the full diagnostic trace" hint="step by step">
  <ArtifactCard
            title="Diagnostic trace"
            meta="Synthetic reconstruction"
            caption="Figures are illustrative; the sequence is the real method — segment, hypothesize, test against records, then propose an intervention."
          >
            <SystemTrace
              title="Validation failure investigation"
              id="incident · reconstructed"
              rows={[
                { step: 'Symptom', value: 'Validation failures increased from 2.4% to 8.9%' },
                { step: 'Segment', value: 'Concentrated in 3 source pipelines, not platform-wide' },
                { step: 'Dependency', value: 'Shared upstream schema change detected in the same window' },
                {
                  step: 'Hypothesis',
                  value: 'An unexpected field-type change is failing downstream validation',
                },
                { step: 'Test', value: 'Compare pre-change and post-change records for affected fields' },
                {
                  step: 'Root cause',
                  value: '87% of new failures traced to the affected fields',
                  decision: true,
                },
                { step: 'Fix', value: 'Schema handling updated; upstream validation added' },
                { step: 'Validation', value: 'Post-fix validation failure rate 2.7%' },
              ]}
            />
          </ArtifactCard>
        </DeeperDetail>

        <DecisionCallout label="What this changed">
          The fix belonged upstream, not in the product surface where the
          complaint appeared.
        </DecisionCallout>
      </Section>

      {/* ---------------- STAKEHOLDERS ---------------- */}
      <Section
        id="stakeholders"
        label="06 · Customer + product leadership"
        title="What a stakeholder asked for was rarely what the workflow needed."
        intro="I led and co-led customer workshops, design sessions and demos, then translated each request into a workflow problem, a dependency, and a decision."
      >
        <ProcessFlow
          tone="blue"
          steps={[
            'Request',
            'Questions',
            'Underlying problem',
            'Evidence',
            'Prioritization',
            'Delivery',
          ]}
          highlight={[2]}
        />
      </Section>

      {/* ---------------- LEARNED ---------------- */}
      <Section
        id="learned"
        label="07 · What I learned"
        title="A fluent answer can hide a broken system."
      >
        <InsightCallout>
          The useful question is not “is the AI accurate?” It is “where does the
          system fail, how consequential is that failure, and what intervention
          actually improves the user outcome?”
        </InsightCallout>
        <p className="body-text">
          Working across retrieval, data, product and infrastructure changed how I
          evaluate AI products: I now assume a confident output is a claim to be
          traced, and I want the failure taxonomy before I want the demo.
        </p>
      </Section>

      <CaseStudyFooter current="/work/enterprise-ai-product-systems" />
    </PageShell>
  );
}
