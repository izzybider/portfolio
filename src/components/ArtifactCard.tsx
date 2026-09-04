/**
 * ArtifactCard — frames an exhibit (diagram, mockup, table, trace) with a
 * title and an optional provenance caption. The caption is how the site
 * distinguishes measured work from reconstructions and proposals.
 */
export default function ArtifactCard({
  title,
  meta,
  caption,
  tone = 'white',
  children,
}: {
  title: string;
  meta?: string;
  caption?: string;
  tone?: 'white' | 'plain';
  children: React.ReactNode;
}) {
  return (
    <figure className={`artifact${tone === 'plain' ? ' artifact--plain' : ''}`}>
      <figcaption className="artifact__head">
        <span className="caps">{title}</span>
        {meta ? <span className="meta">{meta}</span> : null}
      </figcaption>
      <div className="artifact__body">{children}</div>
      {caption ? <p className="artifact__caption">{caption}</p> : null}
    </figure>
  );
}
