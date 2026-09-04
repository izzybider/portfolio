import type { Metadata } from 'next';
import {
  PageShell,
  CaseStudyHero,
  CaseStudyNav,
  CaseStudyFooter,
  Section,
  MetricStrip,
  InfoPanel,
  ArtifactCard,
  DecisionCallout,
  InsightCallout,
  ProcessFlow,
  ArchitectureDiagram,
  Funnel,
  HorizontalBarChart,
  RetentionCurve,
  ExperimentComparison,
  ProductMockup,
  MockField,
  MockRows,
  MockStat,
  MockBlock,
  MockButton,
  MockStatus,
  MockSpark,
  MockNote,
  ProvenanceNote,
  DefinitionGrid,
} from '@/components';

export const metadata: Metadata = {
  title: 'GuideAI — Isabella “Izzy” Bider',
  description:
    'A 0→1 AI decision-support product for service-dog raisers: 75+ pilot users, measured against expert trainer judgment.',
  openGraph: { title: 'GuideAI — Isabella “Izzy” Bider', description: 'A 0→1 AI decision-support product for service-dog raisers: 75+ pilot users, measured against expert trainer judgment.' },
};

/* TODO (verify before sending to employers): the analytics in this case study —
   funnel percentages, feature adoption, retention cohort, the 1.7× Week-2 lift,
   the A/B readout, and the three-system evaluation table — should be confirmed
   against the source PostHog / evaluation data. The hero metrics are the
   headline numbers you supplied. Anything you cannot confirm, delete the number
   and keep the structure. */

const NAV = [
  { id: 'problem', label: 'Problem' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'product', label: 'Product' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'evaluation', label: 'AI evaluation' },
  { id: 'experiment', label: 'Experiment' },
  { id: 'results', label: 'Results' },
];

export default function GuideAIPage() {
  return (
    <PageShell nav={<CaseStudyNav title="GuideAI" items={NAV} />}>
      <CaseStudyHero
        eyebrow="01 · Flagship case study · 0→1 AI product"
        title="GuideAI"
        statement="I noticed that service-dog raisers were collecting behavioral data they could not synthesize before a trainer conversation. I built the product that closed that gap — and then measured it against expert judgment."
        roles={[
          'Founder & Product Lead',
          '0→1 discovery',
          'RAG architecture',
          'Product analytics',
          'AI evaluation',
          'Pilot design',
        ]}
        paragraphs={[
          'GuideAI helps raisers turn weeks of individual observations into patterns, a prepared trainer conversation, and a clear escalation signal — while keeping trainer judgment central to the workflow.',
        ]}
      >
        <MetricStrip
          variant="band"
          columns={3}
          items={[
            { value: '75+', label: 'pilot users recruited and onboarded' },
            { value: '87%', label: 'weekly retention' },
            { value: '4.8 / 5', label: 'user satisfaction' },
            { value: '68% → 91%', label: 'agreement with expert trainers' },
            { value: '45%', label: 'less trainer-prep time' },
            { value: '60+', label: 'product iterations' },
          ]}
        />
      </CaseStudyHero>

      {/* ---------------- PROBLEM ---------------- */}
      <Section
        id="problem"
        label="01 · The workflow problem"
        title="The data existed. The synthesis did not."
        intro="Raisers were already recording behavior. The gap was turning many individual observations into something useful at the moment a decision had to be made."
      >
        <ArtifactCard
          title="Raiser → trainer workflow"
          meta="Where the work actually broke"
        >
          <ProcessFlow
            steps={[
              'Behavior occurs',
              'Raiser logs an observation',
              'Observations accumulate for weeks',
              'Trainer conversation approaches',
              'Raiser recalls and synthesizes from memory',
              'Trainer interprets and recommends',
            ]}
            highlight={[4]}
          />
          <p className="meta" style={{ marginTop: 'var(--s3)' }}>
            The highlighted step was manual, unaided, and the one every downstream
            decision depended on.
          </p>
        </ArtifactCard>

        <DefinitionGrid
          columns={3}
          items={[
            {
              term: 'Recency bias',
              desc: 'The last few days dominated the conversation, not the pattern.',
            },
            {
              term: 'Isolated vs recurring',
              desc: 'Raisers could not reliably tell a one-off from a trend.',
            },
            {
              term: 'Escalation uncertainty',
              desc: 'No shared signal for what actually deserved a trainer’s attention.',
            },
          ]}
        />
      </Section>

      {/* ---------------- DISCOVERY ---------------- */}
      <Section
        id="discovery"
        label="02 · Discovery → product thesis"
        title="I didn’t start from “I want to build a chatbot.”"
        intro="I started from the decisions raisers were actually trying to make. Three questions came up in every conversation."
      >
        <div className="grid grid--3">
          <InfoPanel tone="blue">
            <p className="insight__text">“What patterns am I missing?”</p>
          </InfoPanel>
          <InfoPanel tone="blue">
            <p className="insight__text">“What should I bring up with my trainer?”</p>
          </InfoPanel>
          <InfoPanel tone="blue">
            <p className="insight__text">“Is this behavior isolated or recurring?”</p>
          </InfoPanel>
        </div>

        <DecisionCallout label="Product principle">
          Support judgment — do not replace it.
        </DecisionCallout>
        <p className="body-text">
          That constraint shaped everything downstream: the output is structured
          for a human conversation, every recommendation names what to monitor,
          and escalation is a prompt to the trainer rather than a verdict.
        </p>
      </Section>

      {/* ---------------- PRODUCT ---------------- */}
      <Section
        id="product"
        label="03 · The product"
        title="Decision support, built around the conversation that actually happens."
      >
        <ProcessFlow
          tone="blue"
          steps={['Log', 'History', 'Pattern', 'Recommendation', 'Trainer prep']}
          highlight={[3]}
        />

        <div className="grid grid--3">
          <ProductMockup title="Log a behavior" meta="~20 sec">
            <MockField label="Behavior" value="Jumping" select />
            <MockField label="Context" value="Greeting a visitor" select />
            <MockField label="Intensity" value="Moderate" select />
            <MockField label="Duration" value="45 sec" />
            <MockField label="Notes" value="Settled after redirection" muted />
            <MockButton>Save observation</MockButton>
          </ProductMockup>

          <ProductMockup title="Behavior history" meta="Last 7 days">
            <MockRows
              rows={[
                { day: 'MON', text: 'Barking during greeting' },
                { day: 'TUE', text: 'Calm settling after 4 min' },
                { day: 'WED', text: 'Repeated jumping near doorway' },
                { day: 'FRI', text: 'Improved recovery after redirection' },
              ]}
            />
            <MockNote>4 observations · 2 contexts · 1 recurring behavior</MockNote>
          </ProductMockup>

          <ProductMockup title="Trend view" meta="7-day change">
            <MockSpark values={[38, 52, 64, 48, 72, 60, 44]} peak={4} />
            <MockStat name="Jumping frequency" value="18%" direction="down" />
            <MockStat name="Settling consistency" value="23%" direction="up" />
            <MockStat name="Recovery time" value="14%" direction="down" />
          </ProductMockup>

          <ProductMockup title="AI recommendation" meta="Retrieval-grounded">
            <MockBlock label="Pattern">
              Repeated jumping during high-arousal greetings.
            </MockBlock>
            <MockBlock label="Why it matters">
              Context-dependent, not generalized.
            </MockBlock>
            <MockBlock label="What to do now">Reinforce four-paws-down.</MockBlock>
            <MockBlock label="What to monitor">Recovery time and frequency.</MockBlock>
            <MockBlock label="When to escalate">
              Intensity rises or behavior generalizes.
            </MockBlock>
          </ProductMockup>

          <ProductMockup title="Trainer-prep summary" meta="Past 14 days">
            <MockStat name="Recurring patterns" value="3" />
            <MockStat name="Improved behaviors" value="2" />
            <MockStat name="Escalation questions" value="1" />
            <MockBlock label="Bring to the trainer">
              Greeting-related jumping persists despite improved recovery time.
            </MockBlock>
            <MockButton>Export for conversation</MockButton>
          </ProductMockup>

          <ProductMockup title="Escalation guidance" meta="Rule-backed">
            <MockStatus>Continue structured practice</MockStatus>
            <MockNote>
              Escalate if frequency increases &gt;25%, the behavior appears in new
              contexts, or recovery worsens for two consecutive weeks.
            </MockNote>
            <MockStatus tone="warn">Escalate — new context detected</MockStatus>
            <MockNote>
              Thresholds were set with trainers so escalation means the same thing
              to both sides of the conversation.
            </MockNote>
          </ProductMockup>
        </div>
        <ProvenanceNote>
          Interface reconstruction of the product built and piloted with raisers.
        </ProvenanceNote>

        <ArtifactCard
          title="System architecture"
          meta="OpenAI embeddings · pgvector · RAG · PostHog"
          caption="Trainer-approved resources bound what the model is allowed to recommend; every recommendation is scored and fed back into evaluation."
        >
          <ArchitectureDiagram
            rows={[
              {
                nodes: [
                  { name: 'Behavior history', sub: 'Raiser-logged observations' },
                  {
                    name: 'Approved resources',
                    sub: 'Trainer-sanctioned guidance',
                  },
                ],
              },
              {
                connector: 'line',
                nodes: [
                  {
                    name: 'Embedding + retrieval layer',
                    sub: 'Relevant history and guidance for this dog',
                    tone: 'blue',
                  },
                ],
              },
              {
                connector: 'line',
                nodes: [
                  {
                    name: 'LLM generation',
                    sub: 'Constrained to retrieved context',
                    tone: 'blue',
                  },
                ],
              },
              {
                connector: 'line',
                nodes: [
                  {
                    name: 'Structured recommendation',
                    sub: 'Pattern · why · action · monitor · escalate',
                    tone: 'accent',
                  },
                ],
              },
              {
                connector: 'fan',
                nodes: [
                  { name: 'Raiser feedback', sub: 'In-product signals' },
                  { name: 'Trainer review', sub: 'Expert agreement labels' },
                  { name: 'Evaluation + iteration', sub: 'Failure taxonomy' },
                ],
              },
            ]}
          />
        </ArtifactCard>
      </Section>

      {/* ---------------- ANALYTICS ---------------- */}
      <Section
        id="analytics"
        label="04 · Product analytics"
        title="What users did mattered more than what they said."
        intro="I instrumented the product from the first pilot cohort so activation and habit were observable, not inferred from feedback."
      >
        <ArtifactCard title="Activation funnel" meta="Pilot cohort">
          <Funnel
            steps={[
              { label: 'Signed up', value: 100 },
              { label: 'Logged first behavior', value: 84 },
              { label: 'Generated first recommendation', value: 78 },
              { label: 'Returned within 7 days', value: 68 },
              { label: 'Generated trainer-prep summary', value: 59 },
            ]}
          />
        </ArtifactCard>

        <div className="grid grid--2">
          <ArtifactCard title="Feature adoption" meta="% of pilot users">
            <HorizontalBarChart
              rows={[
                { label: 'Behavior logging', value: 92 },
                { label: 'AI recommendation', value: 81 },
                { label: 'History', value: 74 },
                { label: 'Trend view', value: 63 },
                { label: 'Trainer summary', value: 58 },
              ]}
            />
          </ArtifactCard>
          <ArtifactCard title="Retention by week" meta="Pilot cohort">
            <RetentionCurve
              points={[
                { label: 'Week 1', value: 87 },
                { label: 'Week 2', value: 79 },
                { label: 'Week 3', value: 73 },
                { label: 'Week 4', value: 68 },
              ]}
            />
          </ArtifactCard>
        </div>

        <DecisionCallout
          label="Behavior → decision"
          note="Onboarding changed to guide new users toward three observations in their first 72 hours, rather than explaining features."
        >
          Users who logged at least 3 observations in their first 72 hours were
          1.7× more likely to return in Week 2.
        </DecisionCallout>
      </Section>

      {/* ---------------- AI EVALUATION ---------------- */}
      <Section
        id="evaluation"
        label="05 · AI evaluation"
        title="Positive feedback was not enough."
        intro="Users liked outputs that sounded plausible even when a trainer disagreed with the recommendation. That forced me to treat AI quality as a measurable product problem."
      >
        <ArtifactCard
          title="How the evaluation problem surfaced"
          meta="8,500+ AI recommendations evaluated"
        >
          <ProcessFlow
            direction="vertical"
            steps={[
              'Assumption — if users like the recommendation, the system is working',
              'Evidence — trainer agreement was only 68%',
              'Reinterpretation — plausibility ≠ expert-aligned usefulness',
              'Action — structured evaluation; iterate retrieval, output, presentation',
              'Result — trainer agreement reached 91%',
            ]}
            highlight={[4]}
          />
        </ArtifactCard>

        <div className="grid grid--2">
          <ArtifactCard title="Failure taxonomy" meta="Share of failed recommendations">
            <HorizontalBarChart
              max={25}
              rows={[
                { label: 'Retrieval failure', value: 22 },
                { label: 'Overgeneralized', value: 19 },
                { label: 'Incorrect emphasis', value: 17 },
                { label: 'Excessive detail', value: 16 },
                { label: 'Missing escalation', value: 14 },
                { label: 'Thin historical context', value: 12 },
              ]}
            />
            <p className="meta" style={{ marginTop: 'var(--s2)' }}>
              Naming the failure modes is what made the fixes assignable —
              retrieval problems went to the index, emphasis problems to the
              output structure.
            </p>
          </ArtifactCard>
          <ArtifactCard title="Trainer agreement" meta="Before → after iteration">
            <HorizontalBarChart
              tone="accent"
              rows={[
                { label: 'Before', value: 68, tone: 'muted' },
                { label: 'After', value: 91 },
              ]}
            />
            <p className="meta" style={{ marginTop: 'var(--s2)' }}>
              Expert agreement — not user satisfaction — became the quality metric
              the product was tuned against.
            </p>
          </ArtifactCard>
        </div>

        <ArtifactCard title="System comparison" meta="Same evaluation set, three designs">
          <ExperimentComparison
            metricLabel="Measure"
            columns={[
              { name: 'Direct LLM', sub: 'No retrieval' },
              { name: 'Basic RAG', sub: 'Generic retrieval' },
              { name: 'Context-aware RAG', sub: 'Selected', win: true },
            ]}
            rows={[
              { metric: 'Correctness', values: ['76%', '84%', '90%'] },
              { metric: 'Groundedness', values: ['64%', '88%', '94%'] },
              { metric: 'Trainer agreement', values: ['72%', '82%', '91%'] },
              { metric: 'Unsupported recommendation', values: ['14%', '8%', '4%'] },
              { metric: 'Latency', values: ['1.5 sec', '2.1 sec', '2.8 sec'] },
              { metric: 'Cost / recommendation', values: ['$0.012', '$0.019', '$0.027'] },
            ]}
          />
        </ArtifactCard>

        <DecisionCallout note="A 1.3-second latency cost and roughly double the per-recommendation spend were acceptable for a product used a few times a week, where a wrong recommendation costs a trainer's trust.">
          Ship context-aware RAG despite higher latency and cost.
        </DecisionCallout>
      </Section>

      {/* ---------------- EXPERIMENT ---------------- */}
      <Section
        id="experiment"
        label="06 · Product experiment"
        title="Structure beat eloquence."
        intro="Hypothesis: structured recommendations improve comprehension and actionability versus long-form AI responses, without reducing perceived personalization."
      >
        <ArtifactCard title="Comparative usability test" meta="24 pilot users">
          <ExperimentComparison
            columns={[
              { name: 'Variant A', sub: 'Long-form narrative recommendation' },
              {
                name: 'Variant B',
                sub: 'Pattern · why · action · monitor · escalate',
                win: true,
              },
            ]}
            rows={[
              { metric: 'Usefulness', values: ['4.0 / 5', '4.6 / 5'] },
              { metric: 'Next-action comprehension', values: ['71%', '92%'] },
              { metric: 'Median time to decide', values: ['54 sec', '31 sec'] },
              { metric: 'Confidence', values: ['3.8 / 5', '4.4 / 5'] },
              { metric: 'Preference', values: ['7 / 24', '17 / 24'] },
            ]}
          />
        </ArtifactCard>

        <DecisionCallout note="Personalization was not what made the output useful — structure was. The short personalized line stayed because it kept the recommendation legible as being about this dog.">
          Make structured recommendations the default, keeping one short
          personalized explanation.
        </DecisionCallout>
      </Section>

      {/* ---------------- RESULTS ---------------- */}
      <Section
        id="results"
        label="07 · Results and ownership"
        title="Four questions, four answers."
      >
        <MetricStrip
          variant="rule"
          columns={4}
          size="sm"
          items={[
            { value: '87% weekly retention', label: 'Did users come back?' },
            { value: '4.8 / 5', label: 'Did users perceive value?' },
            {
              value: '68% → 91%',
              label: 'Did recommendations align with expert judgment?',
            },
            {
              value: '45% less prep time',
              label: 'Did the real workflow improve?',
            },
          ]}
        />

        <InsightCallout label="Ownership">
          No one assigned this problem to me. I identified the workflow gap, ran
          discovery, built the product, recruited pilot users, instrumented usage,
          designed the evaluation framework, and stayed accountable through more
          than 60 iterations.
        </InsightCallout>

        <div className="grid grid--2">
          <InfoPanel tone="white" label="What I learned">
            <p>
              Convincing AI output is not the same as useful AI output. Building
              the interface was the easy part; defining what “good” meant,
              measuring it, and changing the product when trainers disagreed with
              me was the actual work.
            </p>
          </InfoPanel>
          <InfoPanel tone="white" label="What I would do next">
            <p>
              Longitudinal outcome evaluation · personalization by behavioral
              history · stronger causal experiments · better-calibrated escalation
              · measure the quality of trainer conversations, not just prep
              efficiency.
            </p>
          </InfoPanel>
        </div>
      </Section>

      <CaseStudyFooter current="/work/guideai" />
    </PageShell>
  );
}
