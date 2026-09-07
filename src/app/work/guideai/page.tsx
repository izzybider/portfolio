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
   8,500+ AI recommendations evaluated, and the PostHog instrumentation. These
   are self-corroborated only; you should still be able to point an interviewer
   at the underlying data.

   ARCHITECTURE NAMES — deliberately absent from the rendered page. The resume
   names an "OpenAI embeddings / pgvector / RAG" stack. The newest GuideAI build
   available locally (~/Downloads/guideai_demo (6)) does not match that: its
   resource_service does deterministic keyword matching, docs/architecture.md
   says "no semantic retrieval yet", and ai_service.py states that RAG and
   embeddings are "intentionally out of scope". This page therefore describes
   the product behaviour — longitudinal history, retrieval over approved
   resources, grounded synthesis, escalation, trainer prep — and names no
   provider, vector store or model anywhere. Resolve the resume wording against
   whichever build you actually shipped before an interviewer asks. */

const NAV = [
  { id: 'problem', label: 'Problem' },
  { id: 'product', label: 'Product' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'pilot', label: 'The pilot' },
  { id: 'evaluation', label: 'AI evaluation' },
  { id: 'results', label: 'Results' },
];

export default function GuideAIPage() {
  return (
    <PageShell nav={<CaseStudyNav title="GuideAI" items={NAV} />}>
      <CaseStudyHero
        eyebrow="01 · Flagship case study · 0→1 AI product"
        title="GuideAI"
        statement="GuideAI turns weeks of service-dog behavior logs and notes into personalized, resource-grounded guidance and trainer-ready summaries. It holds longitudinal context for the individual dog, retrieves relevant approved training resources, and synthesises the two — so raisers understand the pattern, get guidance that fits their dog, and arrive at trainer conversations with better questions. Trainers stay the final judgment layer."
        roles={[
          'Founder & Product Lead',
          '0→1 AI product',
          'Retrieval grounding + personalization',
          'Pilot design',
          'Product analytics',
          'Human-in-the-loop evaluation',
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
            { value: '60+', label: 'product iterations across capture, synthesis, retrieval, escalation and trainer prep' },
          ]}
        />
        <p className="demo__cta">
          <Link href="/demo/guideai" className="button button--primary">
            Try interactive demo <Arrow />
          </Link>
          <span className="meta">
            A synthetic reconstruction of the workflow — history, grounded recommendation, follow-up
            questions, escalation and trainer prep · no sign-in
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
            No one assigned this. I found the gap, ran discovery, designed and
            built the product, recruited the pilot, collected feedback,
            instrumented usage, evaluated AI quality against expert judgment, and
            iterated on what I learned.
          </>
        }
        decision={
          <>
            Ground every recommendation in{' '}
            <strong>this dog&rsquo;s history plus approved resources</strong>,
            support trainer judgment rather than replace it, and treat agreement
            with expert trainers — not fluency — as the quality bar.
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
          steps={[
            'Log',
            'Longitudinal history',
            'Pattern',
            'Retrieve approved guidance',
            'Personalised synthesis',
            'Trainer prep',
          ]}
          highlight={[4]}
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
          title="How the product works"
          meta="Personalisation comes from the dog's history · grounding comes from approved resources"
          caption="The two inputs do different jobs. Longitudinal history is what makes a recommendation about this dog rather than about dogs in general; the approved resource corpus is what keeps the guidance anchored to material the programme already endorses. Neither on its own is enough."
        >
          <ArchitectureDiagram
            rows={[
              {
                nodes: [
                  { name: 'Dog profile + longitudinal observations', sub: 'Weeks of structured logs, context and notes', tone: 'accent' },
                ],
              },
              {
                connector: 'line',
                nodes: [
                  { name: 'History / pattern synthesis', sub: 'Recurrence, direction, context spread' },
                ],
              },
              {
                connector: 'line',
                nodes: [
                  { name: 'Retrieval query', sub: 'Built from the behaviour context, not the last note' },
                ],
              },
              {
                connector: 'line',
                nodes: [
                  { name: 'Approved resource corpus', sub: 'Programme-endorsed training material', tone: 'accent' },
                ],
              },
              {
                connector: 'line',
                nodes: [
                  { name: 'AI synthesis', sub: "Dog's history + retrieved guidance, cited back to source", tone: 'accent' },
                ],
              },
              {
                connector: 'fan',
                nodes: [
                  { name: 'Conversational follow-up', sub: 'Why this, what changed, what to ask' },
                  { name: 'Escalation / trainer review', sub: 'Higher-risk or ambiguous cases stop here' },
                ],
              },
              {
                connector: 'line',
                nodes: [
                  { name: 'Trainer-prep summary', sub: 'Trends, representative observations, open questions', tone: 'accent' },
                ],
              },
            ]}
          />
          <p className="reccard__value" style={{ marginTop: 'var(--s3)' }}>
            The system never closes the loop on its own. Where a situation is
            higher-risk, ambiguous or genuinely a matter of trainer judgment, the
            product routes to a person instead of producing authoritative
            guidance — and the trainer-prep summary exists to make that handoff
            worth more than a screenshot of the log.
          </p>
        </ArtifactCard>

        {/* Implementation detail, one click away — the PM story above should
            not be crowded out by the diagram. Fully accessible, and still in
            the HTML for search and indexing. */}
        <DeeperDetail
          summary="Inspect the public demo architecture"
          hint="how the synthetic reconstruction is actually built"
        >
          <ArtifactCard
            title="Public demo architecture"
            meta="Local retrieval over a synthetic corpus · grounded composition · deterministic escalation · no API key"
            caption="This is the publication-safe reconstruction that runs in the interactive demo — not the piloted system. Every stage is inspectable in the demo's pipeline trace, and the retrieval numbers in the evaluation below are produced by running it."
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
                    { name: 'PostHog events', sub: '10 product events', tone: 'gray' },
                  ],
                },
              ]}
            />
            <p className="meta" style={{ marginTop: 'var(--s3)' }}>
              This is a reconstruction, not the piloted stack. The public demo
              swaps the approved resource corpus for a synthetic one and runs
              retrieval locally, so the workflow can be shown without exposing
              proprietary training material or pilot data, and without an API key,
              an account or a network call a recruiter would have to wait on. The
              shape is preserved — history, retrieval, grounded synthesis,
              escalation, trainer prep — and the pilot metrics above describe the
              piloted product, not this reconstruction.
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

      {/* ---------------- WHAT USERS CHANGED ---------------- */}
      <Section
        id="pilot"
        label="05 · The pilot"
        title="The pilot changed the product, not just the interface."
        intro="Six changes that came out of watching raisers use it and listening to what they said was missing. Each one moved the product further from “an assistant that answers questions” and closer to “a system that remembers this dog and prepares a better conversation.”"
        width="wide"
      >
        <div className="changelog">
          {[
            {
              observed: 'Raisers did not want another chatbot',
              evidence:
                'Asked what they wanted help with, they described synthesising weeks of observations before a trainer conversation — not getting an answer to a question they already knew how to ask.',
              change:
                'Moved the product from open-ended AI advice toward longitudinal pattern synthesis and trainer preparation.',
              why: 'It changed what the product was for. The unit of value became the pattern across weeks, not the reply to a prompt.',
            },
            {
              observed: 'Generic guidance did not land',
              evidence:
                'Advice that was reasonable in general was still wrong for a particular dog with a particular history, and raisers noticed immediately.',
              change:
                "Made the individual dog's longitudinal history part of generating the recommendation rather than context shown beside it.",
              why: 'Personalisation stopped being a display concern and became an input to the output.',
            },
            {
              observed: 'People would not act on advice they could not trace',
              evidence:
                'The recurring question was not “what should I do” but “why are you telling me this?”',
              change:
                'Added retrieved-resource grounding and visible sources, so each recommendation names the guidance and the observations behind it.',
              why: 'A recommendation that cannot be interrogated does not get used, however good it is.',
            },
            {
              observed: 'Confident AI on trainer-judgment situations made people uneasy',
              evidence:
                'Raisers were uncomfortable with the system sounding authoritative on exactly the cases they would take to a professional.',
              change:
                'Added explicit escalation with a stated reason, and positioned the product as decision support rather than a trainer substitute.',
              why: 'Declining well turned out to be a feature, not a gap in coverage.',
            },
            {
              observed: 'Logging had to be fast enough to become a habit',
              evidence:
                'The product only produces a pattern once there is enough history, and history only accumulates if capture is quick.',
              change:
                'Simplified structured observation capture and designed for repeat logging rather than for reading content.',
              why: 'The retention loop was capture, not consumption — which is also what the analytics said.',
            },
            {
              observed: 'A raw history was still work to explain',
              evidence:
                'Even with the pattern visible, raisers were re-deriving what mattered in the moment, in front of the trainer.',
              change:
                'Added trainer-prep summaries: trends, representative observations, source-backed context, and the questions still open.',
              why: 'The job ended at the trainer conversation, so that is where the output had to be aimed.',
            },
          ].map((row) => (
            <article className="changelog__row" key={row.observed}>
              <div className="changelog__what">
                <p className="caps changelog__label">What I observed</p>
                <p className="changelog__observed">{row.observed}</p>
                <p className="changelog__evidence">{row.evidence}</p>
              </div>
              <div className="changelog__then">
                <p className="caps changelog__label">What I changed</p>
                <p className="changelog__change">{row.change}</p>
                <p className="changelog__why">
                  <span className="caps changelog__label">Why it mattered</span>
                  {row.why}
                </p>
              </div>
            </article>
          ))}
        </div>

        <InsightCallout label="Three different signals, kept apart">
          What raisers <strong>said</strong> was confusing, what they actually{' '}
          <strong>did</strong> in the product, and whether the AI was{' '}
          <strong>correct</strong> are three different questions. Satisfaction was
          never used as a proxy for correctness — that is what the expert-agreement
          bar in the next section is for.
        </InsightCallout>

        <ProvenanceNote>
          These are the product decisions the pilot produced and the reasoning
          behind them. Specific quote counts and per-theme frequencies are
          deliberately absent: the feedback artifact available to me is small, and
          the decisions are what I can stand behind.
        </ProvenanceNote>
      </Section>

      {/* ---------------- AI EVALUATION ---------------- */}
      <Section
        id="evaluation"
        label="06 · AI evaluation"
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
        label="07 · Results and ownership"
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
