/** HorizontalBarChart — compact labelled bars (adoption, failure mix, cohorts). */
export default function HorizontalBarChart({
  rows,
  tone = 'ink',
  max = 100,
}: {
  rows: { label: string; value: number; display?: string; tone?: 'ink' | 'accent' | 'muted' }[];
  tone?: 'ink' | 'accent' | 'muted';
  max?: number;
}) {
  return (
    <div className="bars">
      {rows.map((row) => {
        const rowTone = row.tone ?? tone;
        return (
          <div className="bars__row" key={row.label}>
            <span className="bars__label">{row.label}</span>
            <span className="bars__track">
              <span
                className={`bars__fill${rowTone !== 'ink' ? ` bars__fill--${rowTone}` : ''}`}
                style={{ width: `${Math.min(100, (row.value / max) * 100)}%` }}
              />
            </span>
            <span className="bars__value">{row.display ?? `${row.value}%`}</span>
          </div>
        );
      })}
    </div>
  );
}
