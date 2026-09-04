export function InsightCallout({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="insight">
      {label ? <p className="caps insight__label">{label}</p> : null}
      <p className="insight__text">{children}</p>
    </div>
  );
}

export function Statement({ children }: { children: React.ReactNode }) {
  return <p className="statement">{children}</p>;
}

export function ProvenanceNote({ children }: { children: React.ReactNode }) {
  return <p className="provenance">{children}</p>;
}

export default InsightCallout;
