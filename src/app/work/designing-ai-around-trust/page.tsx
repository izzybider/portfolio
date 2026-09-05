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
  Continuum,
  DataTable,
  Tag,
  KeyValueRows,
  Matrix2x2,
  DefinitionGrid,
  CellGrid,
  ProvenanceNote,
} from '@/components';

export const metadata: Metadata = {
  title: 'Designing AI Around Trust — Isabella Bider',
  description:
    'Customer discovery for an AI phone agent that changed the target segment and the product thesis.',
  openGraph: { title: 'Designing AI Around Trust — Isabella Bider', description: 'Customer discovery for an AI phone agent that changed the target segment and the product thesis.' },
  alternates: { canonical: '/work/designing-ai-around-trust' },
};

/* CONTENT INTEGRITY NOTE — Phase 2 edit.
   Removed from the earlier draft because they described work that has not been
   run: the 8-user concept test scores, the 18→16→14→12→8 pilot funnel and its
   percentages, willingness-to-pay distributions and pricing bands, and the
   TAM/SAM/SOM figures. Those are now framed as the proposed validation plan in
   section 09. Restore any of them only with verified evidence. */

const NAV = [
  { id: 'hypothesis', label: 'Hypothesis' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'segmentation', label: 'Segmentation' },
  { id: 'autonomy', label: 'Autonomy' },
  { id: 'priorities', label: 'Priorities' },
  { id: 'recommendation', label: 'Recommendation' },
  { id: 'next', label: 'What’s next' },
];

export default function DesigningAIAroundTrustPage() {
  return (
    <PageShell
      nav={<CaseStudyNav title="Designing AI Around Trust" items={NAV} />}
    >
      <CaseStudyHero
        eyebrow="03 · Product strategy case study · AZcare.ai"
        title="Designing AI Around Trust"
        statement="AZcare had an AI phone agent that could navigate phone trees, wait on hold and complete tasks. I ran the discovery on whether it solved a real problem for Deaf and hard-of-hearing users. The evidence changed the answer."
        roles={[
          'AI Product Strategy & Market Research Intern',
          'Customer discovery',
          'Segmentation',
          'Competitive research',
          'Use-case prioritization',
          'GTM thinking',
        ]}
      >
        <MetricStrip
          variant="band"
          columns={4}
          size="sm"
          items={[
            { value: '30+', label: 'customer discovery conversations' },
            { value: '8+', label: 'stakeholder / expert interviews' },
            { value: '4', label: 'workflow segments replacing a diagnosis-based one' },
            { value: '1', label: 'product thesis changed by the evidence' },
          ]}
        />
      </CaseStudyHero>

      <CaseGlance
        status="proposed"
        problem={
          <>
            AZcare assumed Deaf and hard-of-hearing identity would predict who
            valued AI phone delegation. Nobody had tested whether that was the
            variable that mattered.
          </>
        }
        role={
          <>
            I ran the research end to end: recruiting, 30+ discovery
            conversations, expert interviews, competitive and ecosystem
            analysis, synthesis, and the product recommendation.
          </>
        }
        decision={
          <>
            Re-segment on{' '}
            <strong>current workflow × task × desired autonomy</strong> rather
            than diagnosis, and build adjustable autonomy for bounded,
            high-friction tasks.
          </>
        }
        outcome={
          <>
            The target user and the product thesis both changed. The thesis is
            research-backed, not yet behaviorally validated — section 09 is the
            plan that would test it.
          </>
        }
      />

      {/* ---------------- HYPOTHESIS ---------------- */}
      <Section
        id="hypothesis"
        label="01 · Initial hypothesis"
        title="I started from a hypothesis I was willing to lose."
        intro="Working hypothesis: Deaf and hard-of-hearing users face phone-accessibility barriers, so AI phone delegation should create broad value."
      >
        <CellGrid
          columns={2}
          items={[
            <span key="1">
              <strong>Hearing loss predicts phone friction</strong>
            </span>,
            <span key="2">
              <strong>More automation creates more value</strong>
            </span>,
            <span key="3">
              <strong>Full delegation is the clearest use case</strong>
            </span>,
            <span key="4">
              <strong>Accessibility pain is broadly similar across users</strong>
            </span>,
          ]}
        />
        <p className="body-text">
          Assumptions to test, not conclusions. Three of the four were wrong.
        </p>
      </Section>

      {/* ---------------- DISCOVERY ---------------- */}
      <Section
        id="discovery"
        label="02 · Discovery approach"
        title="Research designed to change the decision, not decorate it."
      >
        <div className="grid grid--2">
          <ArtifactCard title="What I ran" tone="plain">
            <DefinitionGrid
              columns={1}
              items={[
                {
                  term: '30+ discovery conversations',
                  desc: 'Recruited independently, across different phone workflows rather than one community channel.',
                },
                {
                  term: '8+ stakeholder / expert interviews',
                  desc: 'Practitioners and service providers, to test what already works.',
                },
                {
                  term: 'Competitive + ecosystem research',
                  desc: 'VRS / IP relay, captioned calling, AI phone agents, human proxies, web workarounds.',
                },
              ]}
            />
          </ArtifactCard>
          <ArtifactCard title="The questions that did the work" tone="plain">
            <ul className="stack-2">
              <li className="body-text">
                <strong>Which calls actually create friction</strong> — not which
                are hard in general?
              </li>
              <li className="body-text">
                <strong>What already works</strong>, and where does it fail?
              </li>
              <li className="body-text">
                <strong>Which tasks would you hand over</strong>, and which would
                you stay in?
              </li>
              <li className="body-text">
                <strong>What should happen when the AI is uncertain?</strong>
              </li>
            </ul>
          </ArtifactCard>
        </div>
      </Section>

      {/* ---------------- SEGMENTATION ---------------- */}
      <Section
        id="segmentation"
        label="03 · Evidence changed the thesis"
        title="Hearing loss itself was not enough to predict product value."
        intro="Users with the same diagnosis had completely different phone lives. What predicted value was the workflow they already used."
      >
        <ArtifactCard
          title="Workflow segmentation"
          meta="Replaced the diagnosis-based segment"
          caption="Segments defined by the workflow someone already uses, the task, and how much control they want to keep."
        >
          <DataTable
            columns={[
              'Segment',
              'Current workflow',
              'Where it breaks',
              'Opportunity',
              'Desired autonomy',
            ]}
            rows={[
              [
                'Direct caller',
                'Hearing aid / CI + Bluetooth',
                'Already works for most calls',
                'Convenience only',
                <Tag key="a" tone="gray">
                  Low
                </Tag>,
              ],
              [
                'Relay / VRS user',
                'Interpreter or relay service',
                'Participation works but adds friction and scheduling',
                'Menus, hold, assisted participation',
                <Tag key="b">Medium</Tag>,
              ],
              [
                'Call avoider',
                'Web / text workaround',
                'High friction when no web alternative exists',
                'Highest — the phone is unavoidable',
                <Tag key="c">High</Tag>,
              ],
              [
                'Human delegator',
                'Family or friend as proxy',
                'Depends on someone else’s availability',
                'Replaces an existing delegation behavior',
                <Tag key="d">High</Tag>,
              ],
            ]}
          />
        </ArtifactCard>

        <DecisionCallout
          label="Reframe"
          note="Two of the four segments were already well served. Targeting by diagnosis would have spent the roadmap on users who did not need it."
        >
          Value is predicted by current workflow × task × desired autonomy — not
          by hearing loss.
        </DecisionCallout>
      </Section>

      {/* ---------------- WORKFLOW ---------------- */}
      <Section
        id="workflow"
        label="04 · Workflow map"
        title="The opportunity sits inside the call, not before it."
        intro="Friction concentrated in a few moments, most of them before the conversation even starts."
      >
        <ArtifactCard title="Phone-dependent task, end to end">
          <ProcessFlow
            steps={[
              'Need to complete task',
              'Decide whether to call',
              'Choose accommodation',
              'Navigate IVR',
              'Wait on hold',
              'Communicate',
              'Confirm what was said',
              'Complete task',
              'Follow up',
            ]}
            highlight={[3, 4, 6]}
          />
          <p className="meta" style={{ marginTop: 'var(--s3)' }}>
            Highlighted: IVR navigation, hold, and confirming what was said.
          </p>
        </ArtifactCard>
      </Section>

      {/* ---------------- AUTONOMY ---------------- */}
      <Section
        id="autonomy"
        label="05 · Participation to delegation"
        title="The real product question is how much of the task you hand over."
        intro="Users wanted different answers for different tasks — sometimes on the same day."
      >
        <ArtifactCard
          title="Autonomy continuum"
          meta="Where each task belongs"
          caption="Autonomy has to be a product control, not a decision made once."
        >
          <Continuum
            ends={['User stays in the call', 'AI completes the task']}
            stops={[
              {
                name: 'Participate',
                sub: 'AI removes friction around the call; user talks',
              },
              {
                name: 'Assist',
                sub: 'AI handles IVR, hold, transcript; user directs',
              },
              {
                name: 'Supervise',
                sub: 'AI acts on bounded steps with approval',
                accent: true,
              },
              {
                name: 'Delegate',
                sub: 'AI completes a routine task end to end',
              },
            ]}
          />
        </ArtifactCard>

        <DecisionCallout label="Product thesis">
          Build adjustable autonomy — let the user choose how much of each task
          the AI handles.
        </DecisionCallout>
      </Section>

      {/* ---------------- PRIORITIES ---------------- */}
      <Section
        id="priorities"
        label="06 · Use-case prioritization"
        title="Start where delegation creates value and failure can be recovered."
        intro="Not every high-pain task is a good first task. The second axis is what it costs when the AI gets it wrong."
      >
        <Matrix2x2
          yAxis="User pain"
          xAxis={['Lower failure cost', 'Higher failure cost']}
          quadrants={[
            {
              head: 'High pain · recoverable — build first',
              items: [
                'Appointment scheduling',
                'Rescheduling',
                'Pharmacy status',
                'Maintenance request',
                'IVR navigation',
              ],
              emphasis: 'priority',
            },
            {
              head: 'High pain · costly failure — not first',
              items: ['Complex medical', 'Financial dispute', 'Legal issue'],
            },
            {
              head: 'Low pain · recoverable — low value',
              items: ['Basic information lookup'],
              emphasis: 'mute',
            },
            {
              head: 'Low pain · costly failure — avoid',
              items: ['Emotionally consequential conversation'],
              emphasis: 'mute',
            },
          ]}
        />
        <ProvenanceNote>
          Placement reflects discovery evidence on task friction and recovery
          cost, not measured task outcomes.
        </ProvenanceNote>
      </Section>

      {/* ---------------- PRINCIPLES + POSITIONING ---------------- */}
      <Section
        id="positioning"
        label="07 · Principles and positioning"
        title="The white space is choice, not automation."
      >
        <div className="grid grid--3">
          <InfoPanel tone="white" label="Existing accessibility tools">
            <p className="insight__text">“Help me participate.”</p>
          </InfoPanel>
          <InfoPanel tone="white" label="Traditional AI phone agents">
            <p className="insight__text">“Complete the task for me.”</p>
          </InfoPanel>
          <InfoPanel tone="blue" label="The opening">
            <p className="insight__text">
              “Let me choose how much of the task AI handles.”
            </p>
          </InfoPanel>
        </div>

        <DeeperDetail summary="The eight design constraints the research produced" hint="detail">
  <ArtifactCard title="Design constraints the research produced">
            <DefinitionGrid
              columns={2}
              items={[
                {
                  term: 'Agency over automation',
                  desc: 'Reduce friction without removing the user from the interaction.',
                },
                {
                  term: 'Adjustable autonomy',
                  desc: 'Different tasks warrant different levels of delegation.',
                },
                {
                  term: 'Transparent behavior',
                  desc: 'The user knows what the AI said and what it is doing.',
                },
                {
                  term: 'Accessible fallback',
                  desc: 'Recovery cannot depend on a traditional voice call.',
                },
                {
                  term: 'Human takeover',
                  desc: 'The user can step in at any point.',
                },
                {
                  term: 'Surface uncertainty',
                  desc: 'Clarify or escalate rather than bluff.',
                },
                {
                  term: 'Disclosure control',
                  desc: 'The AI identifies itself; disclosure stays the user’s choice.',
                },
                {
                  term: 'Design with the community',
                  desc: 'Development continues with Deaf and hard-of-hearing users.',
                },
              ]}
            />
          </ArtifactCard>
        </DeeperDetail>
      </Section>

      {/* ---------------- RECOMMENDATION ---------------- */}
      <Section
        id="recommendation"
        label="08 · Final recommendation"
        title="Build adjustable-autonomy AI calling for bounded, high-friction tasks."
      >
        <DecisionCallout
          label="Recommendation"
          note="Target the workflow, not the diagnosis: users whose current phone workflow involves relay, call avoidance, human delegation, or significant IVR and hold friction."
        >
          Ship supervised autonomy on low-risk, verifiable tasks first — and make
          the autonomy level a user-facing control.
        </DecisionCallout>

        <DeeperDetail summary="Read the product definition from the PRD" hint="PRD extract">
  <ArtifactCard title="Product definition" meta="Extract from the PRD I wrote">
            <KeyValueRows
              rows={[
                {
                  key: 'Target user',
                  value:
                    'Relay users, call avoiders and human delegators — where the current workflow already imposes friction or dependency.',
                },
                {
                  key: 'Initial tasks',
                  value:
                    'Low-risk, bounded, transactional, with objectively verifiable outcomes.',
                },
                {
                  key: 'Core behavior',
                  value:
                    'AI handles IVR and hold · selectable autonomy · live transcript · mid-call instruction · approval before consequential actions · human takeover · accessible fallback.',
                },
                {
                  key: 'Primary success metric',
                  value:
                    'Task completion with low intervention burden and high user confidence.',
                },
                {
                  key: 'Non-goals',
                  value:
                    'Emergency calls · high-stakes medical decisions · legal advice · financial disputes · emotionally consequential conversations.',
                },
                {
                  key: 'Early GTM',
                  value:
                    'Community organizations, referrals and accessibility partnerships — distribution here is a trust problem, and paid acquisition scales reach but not credibility.',
                },
              ]}
            />
          </ArtifactCard>
        </DeeperDetail>
      </Section>

      {/* ---------------- NEXT ---------------- */}
      <Section
        id="next"
        label="09 · Proposed validation plan"
        title="The thesis is research-backed. It is not yet behaviorally proven."
        intro="Stated willingness does not predict delegation behavior. This is what I would run next."
      >
        <DeeperDetail summary="The five-step validation sequence, in order" hint="not yet run">
  <ArtifactCard title="Validation sequence" meta="Not yet run">
            <KeyValueRows
              rows={[
                {
                  key: '1 · Concept test',
                  value:
                    'Current flow against adjustable autonomy on completion, understanding, control and trust.',
                },
                {
                  key: '2 · Bounded-task pilot',
                  value:
                    'Real tasks with target-segment users; instrument activation, completion, intervention and repeat use.',
                },
                {
                  key: '3 · Behavioral read',
                  value:
                    'Does repeat use follow stated interest? Repeat-task rate is the honest signal.',
                },
                {
                  key: '4 · Willingness to pay',
                  value:
                    'Buyer interviews once usage exists — not before.',
                },
                {
                  key: '5 · Market sizing',
                  value:
                    'Size the reachable wedge from validated segments, not diagnosis prevalence.',
                },
              ]}
            />
          </ArtifactCard>
        </DeeperDetail>

        <DeeperDetail
          summary="The reimbursement constraint, and what it implies for sequencing"
          hint="regulatory"
        >
          <InfoPanel tone="white" label="Known constraint from the research">
            <p>
              Existing FCC / TRS reimbursement supports qualifying
              telecommunications relay services; autonomous AI task completion
              should not be assumed to qualify.{' '}
              <strong>
                The implication is sequencing: validate user value first, and
                investigate regulatory and partnership pathways in parallel
                rather than making reimbursement a prerequisite.
              </strong>
            </p>
          </InfoPanel>
        </DeeperDetail>

        <InsightCallout label="What I took from this">
          Discovery that can only confirm the original idea is not discovery.
        </InsightCallout>
      </Section>

      <CaseStudyFooter current="/work/designing-ai-around-trust" />
    </PageShell>
  );
}
