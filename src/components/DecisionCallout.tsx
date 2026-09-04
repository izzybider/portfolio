/**
 * DecisionCallout — "what changed because of the evidence".
 * Every major section should end in one of these or a result.
 */
export default function DecisionCallout({
  label = 'Product decision',
  children,
  note,
  quiet = false,
}: {
  label?: string;
  children: React.ReactNode;
  note?: React.ReactNode;
  quiet?: boolean;
}) {
  return (
    <div className={`decision${quiet ? ' decision--quiet' : ''}`}>
      <p className="caps decision__label">{label}</p>
      <p className="decision__text">{children}</p>
      {note ? <p className="decision__note">{note}</p> : null}
    </div>
  );
}
