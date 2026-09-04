/**
 * SystemTrace — an observability-style read of one request through the
 * system. Rows marked `decision` are highlighted.
 */
export default function SystemTrace({
  title,
  id,
  rows,
}: {
  title: string;
  id?: string;
  rows: { step: string; value: React.ReactNode; decision?: boolean }[];
}) {
  return (
    <div className="trace">
      <div className="trace__head">
        <span className="trace__title">{title}</span>
        {id ? <span className="trace__id">{id}</span> : null}
      </div>
      {/* Steps repeat within one trace (two tool calls, two tool results),
          so the index is part of the key. */}
      {rows.map((row, index) => (
        <div
          className={`trace__row${row.decision ? ' trace__row--decision' : ''}`}
          key={`${index}-${row.step}`}
        >
          <span className="trace__step">{row.step}</span>
          <span className="trace__value">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
