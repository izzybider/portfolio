/**
 * Section — the standard editorial block.
 * Small uppercase label, decision-oriented headline, optional intro,
 * then artifacts/evidence as children.
 */
export default function Section({
  id,
  label,
  title,
  /** the 404 page needs its section title to be the page h1 */
  titleAs: TitleTag = 'h2',
  width = 'default',
  intro,
  divider = true,
  tight = false,
  children,
}: {
  id?: string;
  label?: string;
  title?: React.ReactNode;
  titleAs?: 'h1' | 'h2';
  width?: 'default' | 'wide' | 'full';
  intro?: React.ReactNode;
  divider?: boolean;
  tight?: boolean;
  children?: React.ReactNode;
}) {
  const titleClass =
    width === 'full'
      ? 'section__title section__title--full'
      : width === 'wide'
        ? 'section__title section__title--wide'
        : 'section__title';

  return (
    <section
      id={id}
      className={`section${divider ? ' section--divided' : ''}${tight ? ' section--tight' : ''}`}
    >
      <div className="container">
        {label ? <p className="eyebrow section__label">{label}</p> : null}
        {title ? <TitleTag className={titleClass}>{title}</TitleTag> : null}
        {intro ? (
          <div className="section__intro">
            {typeof intro === 'string' ? <p className="lede">{intro}</p> : intro}
          </div>
        ) : null}
        {children ? <div className="section__body">{children}</div> : null}
      </div>
    </section>
  );
}
