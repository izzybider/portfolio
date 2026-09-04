/**
 * CaseStudyHero — first screen of every case study.
 * Eyebrow, headline, one-line outcome statement, ownership chips,
 * then evidence (metrics) passed as children.
 */
export default function CaseStudyHero({
  eyebrow,
  title,
  statement,
  roles = [],
  paragraphs = [],
  children,
}: {
  eyebrow: string;
  title: string;
  statement?: React.ReactNode;
  roles?: string[];
  paragraphs?: React.ReactNode[];
  children?: React.ReactNode;
}) {
  return (
    <section className="hero">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="hero__title">{title}</h1>
        {statement ? <p className="hero__sub">{statement}</p> : null}
        {roles.length > 0 ? (
          <div className="hero__meta">
            {roles.map((role) => (
              <span className="chip" key={role}>
                {role}
              </span>
            ))}
          </div>
        ) : null}
        {paragraphs.length > 0 ? (
          <div className="hero__body">
            {paragraphs.map((paragraph, index) => (
              <p className="body-text" key={index}>
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
        {children ? <div className="hero__body">{children}</div> : null}
      </div>
    </section>
  );
}
