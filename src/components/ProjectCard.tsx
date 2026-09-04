import Arrow, { withArrows } from './Arrow';
import Link from 'next/link';
import type { Motif, Project } from '@/content/site';

/**
 * A small diagrammatic glyph so each card is identifiable before it is read:
 * GuideAI a behavioural trend, Enterprise a system path, AZcare an autonomy
 * continuum, TrustLayer the four decision states.
 */
function CardMotif({ motif }: { motif: Motif }) {
  if (motif === 'trend') {
    return (
      <div className="project__motif" aria-hidden="true">
        {[38, 54, 46, 68, 60, 82, 100].map((height, index) => (
          <span
            key={index}
            className={`motif-bar${index === 6 ? ' motif-bar--accent' : ''}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    );
  }

  if (motif === 'nodes') {
    return (
      <div className="project__motif" aria-hidden="true">
        <span className="motif-node" />
        <span className="motif-link" />
        <span className="motif-node motif-node--accent" />
        <span className="motif-link" />
        <span className="motif-node" />
        <span className="motif-link" />
        <span className="motif-node" />
      </div>
    );
  }

  if (motif === 'continuum') {
    return (
      <div className="project__motif" aria-hidden="true">
        <span className="motif-seg" />
        <span className="motif-seg" />
        <span className="motif-seg motif-seg--accent" />
        <span className="motif-seg" />
      </div>
    );
  }

  return (
    <div className="project__motif" aria-hidden="true">
      <span className="motif-chip">Answer</span>
      <span className="motif-chip">Ask</span>
      <span className="motif-chip motif-chip--accent">Verify</span>
      <span className="motif-chip">Escalate</span>
    </div>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project${project.featured ? ' project--featured' : ''}`}>
      <div className="project__top">
        <span className="project__index">{project.index}</span>
        <span className="project__tag">{project.tag}</span>
      </div>
      <h3 className="project__title">
        <Link href={project.href} className="project__link">
          {project.title}
        </Link>
      </h3>
      <p className="project__statement">{project.statement}</p>
      <CardMotif motif={project.motif} />
      <ul className="project__proof">
        {project.proof.map((item) => (
          <li key={item}>{withArrows(item)}</li>
        ))}
      </ul>
      <p className="project__owned">{project.owned}</p>
      <p className="project__cta">
        Read the case study <Arrow />
        {project.liveHref ? (
          <>
            {' '}
            <a
              className="project__live"
              href={project.liveHref}
              target="_blank"
              rel="noreferrer"
            >
              Open live experiment <Arrow />
            </a>
          </>
        ) : null}
      </p>
    </article>
  );
}
