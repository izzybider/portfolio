/**
 * ExperimentComparison — side-by-side variants or system designs on one
 * metric set. `win` marks the column carrying the decision.
 */
export default function ExperimentComparison({
  columns,
  rows,
  metricLabel = 'Metric',
}: {
  columns: { name: string; sub?: string; win?: boolean }[];
  rows: { metric: string; values: React.ReactNode[] }[];
  metricLabel?: string;
}) {
  const template = `minmax(120px, 1.1fr) repeat(${columns.length}, minmax(0, 1fr))`;

  return (
    <div className="exp">
      <div className="exp__head" style={{ gridTemplateColumns: template }}>
        <div className="exp__col">
          <p className="exp__colname">{metricLabel}</p>
        </div>
        {columns.map((column) => (
          <div
            className={`exp__col${column.win ? ' exp__col--win' : ''}`}
            key={column.name}
          >
            <p className="exp__colname">{column.name}</p>
            {column.sub ? <p className="exp__colsub">{column.sub}</p> : null}
          </div>
        ))}
      </div>
      {rows.map((row) => (
        <div className="exp__row" key={row.metric} style={{ gridTemplateColumns: template }}>
          <div className="exp__cell">{row.metric}</div>
          {row.values.map((value, index) => (
            <div
              className={`exp__cell${columns[index]?.win ? ' exp__cell--win' : ''}`}
              key={index}
            >
              {value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
