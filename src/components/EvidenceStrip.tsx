/** EvidenceStrip — the recruiter-facing proof row under the homepage hero. */
export default function EvidenceStrip({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <dl className="evidence">
      {items.map((item) => (
        <div key={item.label}>
          <dd className="evidence__value">{item.value}</dd>
          <dt className="evidence__label">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}
