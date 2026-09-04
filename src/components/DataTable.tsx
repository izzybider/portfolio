export type Cell = React.ReactNode;

/** DataTable — used only where a table is genuinely the clearest format. */
export default function DataTable({
  columns,
  rows,
  caption,
}: {
  columns: string[];
  rows: Cell[][];
  caption?: string;
}) {
  return (
    <div className="table-wrap">
      <table className="table">
        {caption ? (
          <caption
            style={{
              captionSide: 'bottom',
              padding: '10px 16px',
              textAlign: 'left',
              fontSize: 'var(--fs-micro)',
              color: 'var(--ink-muted)',
            }}
          >
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Tag({
  children,
  tone = 'blue',
}: {
  children: React.ReactNode;
  tone?: 'blue' | 'gray';
}) {
  return (
    <span className={`table__tag${tone === 'gray' ? ' table__tag--gray' : ''}`}>
      {children}
    </span>
  );
}
