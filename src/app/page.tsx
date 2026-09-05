import Link from 'next/link';
import {
  Arrow,
  PageShell,
  ProjectCard,
  SupportCard,
  EvidenceStrip,
  ProcessFlow,
  DefinitionGrid,
  Timeline,
  Section,
} from '@/components';
import { evidence, projects, site } from '@/content/site';

export default function HomePage() {
  return (
    <PageShell>
      {/* ---------------- HERO ---------------- */}
      <section className="homehero">
        <div className="container">
          <p className="eyebrow">AI Product · Technical Systems · Human Judgment</p>
          <h1 className="homehero__title">
            I build AI products around complex systems, human judgment, and
            real-world workflows.
          </h1>
          <p className="lede homehero__intro">
            Northwestern Biomedical Engineering + HCI. I work where understanding
            the user, diagnosing the system, and deciding what to change all
            matter at once — across 0→1 products, production AI platforms, and
            evaluation.
          </p>
          <div className="homehero__actions">
            <Link href="#work" className="button button--primary">
              View selected work <Arrow />
            </Link>
            <a className="button button--quiet" href={site.links.resume}>
              Resume
            </a>
            <a
              className="button button--quiet"
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
          <div style={{ marginTop: 'var(--s6)' }}>
            <EvidenceStrip items={evidence} />
          </div>
        </div>
      </section>

      {/* ---------------- SELECTED WORK ---------------- */}
      <section id="work" className="section section--divided">
        <div className="container">
          <p className="eyebrow section__label">Selected work</p>
          <h2 className="section__title section__title--wide">
            Four projects, each proving a different part of the job.
          </h2>
          <div className="section__body">
            <div className="projects">
              {projects.map((project) => (
                <ProjectCard key={project.index} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- HOW I WORK ---------------- */}
      <Section
        label="How I work"
        title="I start at the workflow, not the feature request."
        width="wide"
      >
        <ProcessFlow
          row
          tone="blue"
          steps={[
            'Understand the workflow',
            'Find the underlying problem',
            'Test the highest-value evidence',
            'Build or intervene',
            'Measure what changed',
          ]}
          highlight={[2]}
        />
        <DefinitionGrid
          columns={3}
          items={[
            {
              term: 'Diagnose before building',
              desc: 'A customer-facing symptom can start in retrieval, in the data, or in the workflow. I trace it before proposing a fix.',
            },
            {
              term: 'Let evidence move the decision',
              desc: 'Discovery that can only confirm the original idea is not discovery. Twice now, the evidence changed what I recommended building.',
            },
            {
              term: 'Make quality measurable',
              desc: 'For AI products, "does it sound good" is not a metric. I define the failure taxonomy and evaluate against it.',
            },
          ]}
        />
      </Section>

      {/* ---------------- SUPPORTING WORK ---------------- */}
      <Section
        label="Supporting work"
        title="Technical and research work behind the product judgment."
        width="wide"
      >
        <div className="support">
          <SupportCard
            label="Canine Companions · Data Analyst Intern"
            title="I improved the system producing the data, not just the analysis downstream."
            proof="43,000+ behavioral records · ~1,500 puppy raisers · SQL / R"
          >
            Diagnosed why behavioral survey data was unusable, then redesigned the
            upstream collection instrument and workflow rather than cleaning
            symptoms after the fact.
          </SupportCard>

          <SupportCard
            label="KosiSonic · Software Engineering Intern"
            title="When a better technical metric was not a better product."
            proof="Python / MATLAB signal processing · 25 user + clinician interviews"
            href="/work/kosisonic"
            cta="Read the mini case"
          >
            Built signal-processing work for AI hearing technology and interviewed
            the people using it — then had to reconcile the two when they
            disagreed.
          </SupportCard>

          <SupportCard
            label="MacIver Lab · Research Assistant"
            title="Independent study on decision-making under uncertainty."
            proof="2nd Place, Northwestern Research Expo · presented to 100+ researchers"
          >
            Ran an independent neuroscience study and automated the behavioral
            trial workflow with a Python tool that captures experiment metadata
            once and structures it for analysis.
          </SupportCard>

          <SupportCard
            label="Northwestern NDL · AI & Computational Language Research Assistant"
            title="LLM and transformer-based methods for autistic communication research."
            proof="LLM conversational data collection · transformer speech + language models · Python / TTS (Kokoro) · in progress"
          >
            Developing LLM-based conversational experiences to collect
            naturalistic language data, and applying transformer-based speech
            and language models to characterize autistic communication —
            ongoing work across computer science, psychology and communication
            sciences. A Python/TTS stimulus workflow using Kokoro supports the
            data collection.
          </SupportCard>
        </div>
      </Section>

      {/* ---------------- EXPERIENCE ---------------- */}
      <Section label="Experience" title="Where I have done this work." width="wide">
        <Timeline
          rows={[
            {
              when: '2026',
              what: (
                <>
                  <strong>Accenture</strong> — Applied Intelligence Technology
                  Summer Analyst (AI Product Management)
                </>
              ),
            },
            {
              when: '2026–Present',
              what: (
                <>
                  <strong>AZcare.ai</strong> — AI Product Strategy &amp; Market
                  Research Intern
                </>
              ),
            },
            {
              when: '2024–2025; 2026–Present',
              what: (
                <>
                  <strong>
                    Northwestern Neurodevelopmental Disabilities Laboratory
                  </strong>{' '}
                  — AI &amp; Computational Language Research Assistant
                </>
              ),
            },
            {
              when: '2025–2026',
              what: (
                <>
                  <strong>MacIver Lab</strong> — Research Assistant
                </>
              ),
            },
            {
              when: '2025',
              what: (
                <>
                  <strong>Canine Companions</strong> — Data Analyst Intern
                </>
              ),
            },
            {
              when: '2024',
              what: (
                <>
                  <strong>KosiSonic</strong> — Software Engineering Intern
                </>
              ),
            },
          ]}
        />
      </Section>

      {/* ---------------- ABOUT ---------------- */}
      <Section
        id="about"
        label="About"
        title="Technical enough to go deep. User-centered enough to ask why."
        width="wide"
      >
        <p className="lede">
          I study Biomedical Engineering and Human-Computer Interaction at
          Northwestern because I care about both sides of a system: how it works
          and how people experience it. The work I want is the kind where product
          judgment depends on users, data, and the technical system at the same
          time.
        </p>
      </Section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="section">
        <div className="container">
          <div className="cta">
            <h2 className="cta__title">
              Interested in building AI products that work in the real world?
            </h2>
            <p className="cta__body">
              I’m exploring 2027 new-grad opportunities in AI product management,
              product strategy, and technical product roles.
            </p>
            <div className="cta__links">
              <a className="button button--primary" href={site.links.email}>
                Email me
              </a>
              <a
                className="button"
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a className="button" href={site.links.resume}>
                Resume
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
