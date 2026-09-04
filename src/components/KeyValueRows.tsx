/** KeyValueRows — compact labelled readouts (spec lists, PRD fields). */
export default function KeyValueRows({
  rows,
}: {
  rows: { key: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="kv">
      {rows.map((row) => (
        <div className="kv__row" key={row.key}>
          <dt className="kv__key">{row.key}</dt>
          <dd className="kv__value">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
