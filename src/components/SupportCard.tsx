/** SupportCard — secondary work on the homepage. Deliberately compact. */
export default function SupportCard({
  label,
  title,
  children,
  proof,
  href,
  cta,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  proof?: string;
  href?: string;
  cta?: string;
}) {
  const content = (
    <>
      <p className="support__label">{label}</p>
      <h3 className="support__title">{title}</h3>
      <div className="support__body">{children}</div>
      {proof ? <p className="support__proof">{proof}</p> : null}
      {cta ? (
        <p className="support__cta">
          {cta} <span aria-hidden="true">→</span>
        </p>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a className="support__card" href={href}>
        {content}
      </a>
    );
  }

  return <div className="support__card">{content}</div>;
}
