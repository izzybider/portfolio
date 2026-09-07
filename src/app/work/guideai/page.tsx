import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell,
  Arrow,
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
  CellGrid,
  ExperimentComparison,
  HorizontalBarChart,
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
  title: 'GuideAI — Isabella Bider',
  description:
    'A 0→1 AI decision-support product for service-dog raisers: 75+ pilot users, measured against expert trainer judgment.',
  openGraph: { title: 'GuideAI — Isabella Bider', description: 'A 0→1 AI decision-support product for service-dog raisers: 75+ pilot users, measured against expert trainer judgment.' },
  alternates: { canonical: '/work/guideai' },
};

/* CREDIBILITY AUDIT — read before restoring anything removed here.

   The one analytics artifact available locally is a PostHog export covering
   2026-05-24 to 2026-06-21 (~/Downloads/guideai_mvp/guideaipilot.csv, 985
   events). It is genuine — the event taxonomy is real and the instrumentation
   is real. It does not support several figures this page used to carry, and
   for two of them it points the other way:

   - "87% weekly retention": in that export, week-over-week return was 4%, 9%,
     20% and 33%, and only 6 of 58 distinct ids were active in more than one
     week. REMOVED from the recruiter-facing view.
   - "4.8 / 5 satisfaction": no numeric satisfaction field exists anywhere in
     the export or in user_feedback.csv. The feedback instrument is categorical
     (useful yes/no, trust yes/maybe, trainer-prep helpful yes/somewhat).
     REMOVED.
   - Activation funnel, feature-adoption bars, the weekly retention curve, the
     1.7x Week-2 lift, the 24-user comparative test and its five measures, the
     three-system comparison with latency and cost, and the failure-taxonomy
     percentages: no supporting artifact locally. REMOVED or reduced to the
     part that is supportable.

   TODO (Isabella): if you hold the source data for any of these — a later
   pilot window, an offline evaluation run, a survey export — restore the
   figure together with a note on where it came from. Do not restore any of
   them from memory.

   KEPT, because the resume served at /IsabellaBider_Resume.pdf states them and
   nothing available contradicts them: 75+ pilot users, 60+ iterations, 45%
   reduction in trainer summary preparation time, 68% -> 91% trainer agreement,
   8,500+ AI recommendations evaluated, and the OpenAI embeddings / pgvector /
   RAG / PostHog stack. These are self-corroborated only; you should still be
   able to point an interviewer at the underlying data. */

const NAV = [
  { id: 'problem', label: 'Problem' },
  { id: 'product', label: 'Product' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'evaluation', label: 'AI evaluation' },
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
      >
        <MetricStrip
          variant="band"
          columns={3}
          items={[
            { value: '75+', label: 'pilot users recruited and onboarded' },
            { value: '68% → 91%', label: 'agreement with expert trainers' },
            { value: '45%', label: 'less trainer-prep time' },
            { value: '8,500+', label: 'AI recommendations evaluated' },
            { value: '60+', label: 'product iterations' },
          ]}
        />
        <p className="demo__cta">
          <Link href="/demo/guideai" className="button button--primary">
            Try interactive demo <Arrow />
          </Link>
          <span className="meta">
            See grounded recommendations, source retrieval and trainer escalation in the live demo
            · synthetic demo data · no sign-in
          </span>
        </p>
      </CaseStudyHero>

      <CaseGlance
        status="measured"
        problem={
          <>
            Raisers already recorded behavioral observations, but had no way to
            synthesize weeks of them before a trainer conversation — so decisions
            ran on the last few days rather than the pattern.
          </>
        }
        role={
          <>
            No one assigned this. I found the gap, ran discovery, built the
            product, recruited the pilot, instrumented usage and designed the AI
            evaluation.
          </>
        }
        decision={
          <>
            Support trainer judgment rather than replace it — and treat{' '}
            <strong>agreement with expert trainers</strong>, not fluency, as the
            quality bar.
          </>
        }
        outcome={
          <>
            75+ pilot users · 68% → 91% agreement with expert trainers · 45%
            less trainer-prep time · 8,500+ AI recommendations evaluated.
          </>
        }
      />

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

        {/* Implementation detail, one click away — the PM story above should
            not be crowded out by the diagram. Fully accessible, and still in
            the HTML for search and indexing. */}
        <DeeperDetail
          summary="Inspect the current demo architecture"
          hint="retrieval, grounding and escalation, stage by stage"
        >
          <ArtifactCard
            title="Current demo architecture"
            meta="TF-IDF vector index · cosine top-k retrieval · grounded composition · deterministic escalation · PostHog events"
            caption="This is the architecture running in the interactive demo today, not a description of the pilot. Every stage is inspectable in the demo's pipeline trace, and the retrieval numbers in the evaluation below are produced by running it."
          >
            <ArchitectureDiagram
              rows={[
                { nodes: [{ name: 'Observation history', sub: 'Structured behaviour records', tone: 'accent' }] },
                {
                  connector: 'line',
                  nodes: [
                    {
                      name: 'Structured behaviour context',
                      sub: 'Behaviour · setting spread · frequency · trend',
                    },
                  ],
                },
                {
                  connector: 'line',
                  nodes: [
                    { name: 'Retrieval query', sub: 'Composed from the context, not the last note' },
                  ],
                },
                {
                  connector: 'line',
                  nodes: [
                    {
                      name: 'Vector index',
                      sub: '28 synthetic resources · 154-dim TF-IDF · cosine',
                      tone: 'blue',
                    },
                  ],
                },
                {
                  connector: 'line',
                  nodes: [{ name: 'Top-4 relevant resources', sub: 'Shown as sources in the demo', tone: 'blue' }],
                },
                {
                  connector: 'line',
                  nodes: [
                    {
                      name: 'Grounded composition',
                      sub: 'Response assembled from retrieved resources only',
                      tone: 'accent',
                    },
                  ],
                },
                {
                  connector: 'line',
                  nodes: [
                    {
                      name: 'Escalation policy',
                      sub: 'Deterministic · sensitive behaviours never auto-matched',
                      tone: 'accent',
                    },
                  ],
                },
                {
                  connector: 'fan',
                  nodes: [
                    { name: 'Recommendation', sub: 'With its sources' },
                    { name: 'Trainer prep', sub: 'Judgment items named' },
                    { name: 'PostHog events', sub: '9 product events', tone: 'gray' },
                  ],
                },
              ]}
            />
            <p className="meta" style={{ marginTop: 'var(--s3)' }}>
              The current demo uses a more robust retrieval architecture than the
              earlier pilot implementation. The pilot metrics above describe that
              earlier build, not this one. An OpenAI embedding path is implemented
              (<code>npm run guideai:embed --openai</code>, text-embedding-3-small)
              but is not what ships: the portfolio is a fully static site, so a
              neural index would need a server route and an API key at request
              time, and a recruiter opening the demo would depend on both. Retrieval
              over 28 documents is exact either way.
            </p>
          </ArtifactCard>
        </DeeperDetail>
      </Section>

      {/* ---------------- ANALYTICS ---------------- */}
      <Section
        id="analytics"
        label="04 · Product analytics"
        title="What users did mattered more than what they said."
        intro="I instrumented the product from the first pilot cohort so activation and habit were observable rather than inferred from feedback. The event taxonomy below is the one actually in the product."
      >
        <ArtifactCard
          title="What I instrumented"
          meta="Product events captured in PostHog"
          caption="Naming the events was the product decision: each one corresponds to a step in the raiser's workflow, so a drop-off could be located rather than guessed at."
        >
          <CellGrid
            columns={3}
            items={[
              <strong key="1">logged_observation</strong>,
              <strong key="2">viewed_pattern_summary</strong>,
              <strong key="3">generated_ai_reflection</strong>,
              <strong key="4">viewed_resource_recommendations</strong>,
              <strong key="5">saved_weekly_checkin</strong>,
              <strong key="6">downloaded_trainer_summary</strong>,
              <strong key="7">submitted_feedback</strong>,
              <strong key="8">updated_dog_profile</strong>,
              <strong key="9">clicked_log_observation</strong>,
            ]}
          />
        </ArtifactCard>

        <DecisionCallout
          label="Behavior → decision"
          note="Early logging was the thing that predicted whether a raiser came back at all, so onboarding was changed to get a new user to their first few observations rather than to explain features."
        >
          The habit to build was logging, not reading.
        </DecisionCallout>

        <ProvenanceNote>
          Per-step conversion, feature-adoption and retention figures were
          removed from this page: the analytics export available to me does not
          support them. The instrumentation and the decision above are what I
          can stand behind.
        </ProvenanceNote>
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
              'Reinterpretation — plausibility is not expert-aligned usefulness',
              'Action — structured evaluation; iterate retrieval, output, presentation',
              'Result — trainer agreement reached 91%',
            ]}
            highlight={[4]}
          />
        </ArtifactCard>

        <div className="grid grid--2">
          <ArtifactCard title="Failure taxonomy" meta="How a bad recommendation was classified">
            <CellGrid
              columns={2}
              items={[
                <strong key="1">Retrieval failure</strong>,
                <strong key="2">Overgeneralized</strong>,
                <strong key="3">Incorrect emphasis</strong>,
                <strong key="4">Excessive detail</strong>,
                <strong key="5">Missing escalation</strong>,
                <strong key="6">Thin historical context</strong>,
              ]}
            />
            <p className="meta" style={{ marginTop: 'var(--s2)' }}>
              Naming the failure modes is what made the fixes assignable —
              retrieval problems went to the index, emphasis problems to the
              output structure. The per-class shares are not shown because I
              cannot evidence them here.
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


        <ArtifactCard
          title="Retrieval evaluation"
          meta="Synthetic evaluation set · 30 labelled scenarios · npm run guideai:eval"
          caption="Computed by running the harness against the shipped retrieval stack, not written by hand. Labels and corpus were written by the same person, and 30 scenarios is a small set — these measure whether the pipeline behaves as designed, not how it would perform in the field."
        >
          <ExperimentComparison
            metricLabel="Measure"
            columns={[
              { name: 'No retrieval', sub: 'Control' },
              { name: 'Retrieval-grounded', sub: 'Shipped', win: true },
            ]}
            rows={[
              { metric: 'Retrieval hit@4', values: ['—', '93%'] },
              { metric: 'Escalation correctness', values: ['—', '100%'] },
              { metric: 'Groundedness', values: ['0%', '100%'] },
              { metric: 'Unsupported recommendations', values: ['10%', '0%'] },
              { metric: 'Structural completeness', values: ['—', '100%'] },
            ]}
          />
          <p className="meta" style={{ marginTop: 'var(--s3)' }}>
            The control has no sources to cite, so groundedness is 0% by
            construction; the number that matters is the 10% unsupported rate —
            three scenarios where an ungrounded generator would answer a
            sensitive observation the product should refer to a trainer instead.
          </p>
          <p className="meta" style={{ marginTop: 'var(--s2)' }}>
            <strong>What the evaluation surfaced.</strong> Retrieved-set precision
            is 44%: at top-4 over 28 documents, some retrieved resources are only
            loosely relevant. Two of the thirty scenarios miss their labelled
            resource entirely, both on vocalisation — the corpus covers that
            behaviour thinly, which is a coverage gap rather than a ranking bug.
            Both point at the same next step: more resources per behaviour, and
            reranking the retrieved set before it reaches the response. Reported
            rather than tuned away.
          </p>
          <p className="meta" style={{ marginTop: 'var(--s2)' }}>
            The demo is instrumented with the events this product would actually
            need: observation logging, trend viewing, recommendation generation,
            source inspection, pipeline inspection, trainer-prep generation and
            escalation. No usage number in this case study is derived from them.
          </p>
        </ArtifactCard>

        <DecisionCallout note="Retrieval that is aware of this dog's own history costs latency and spend against a simpler design. For a product used a few times a week, where a recommendation a trainer disagrees with is the expensive failure, that was the right side of the trade.">
          Ship context-aware retrieval despite the added latency and cost.
        </DecisionCallout>
      </Section>

      {/* ---------------- RESULTS ---------------- */}
      <Section
        id="results"
        label="06 · Results and ownership"
        title="Three questions, three answers."
      >
        <MetricStrip
          variant="rule"
          columns={3}
          size="sm"
          items={[
            { value: '75+ pilot users', label: 'Did anyone actually use it?' },
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
