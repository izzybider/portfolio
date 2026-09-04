export type ArchNode = {
  name: string;
  sub?: string;
  tone?: 'white' | 'blue' | 'gray' | 'accent';
};

export type ArchRow = {
  nodes: ArchNode[];
  /** connector drawn ABOVE this row */
  connector?: 'line' | 'fan' | 'none';
  note?: string;
};

/**
 * ArchitectureDiagram — node/edge system map built from CSS only.
 * Rows stack top-to-bottom; "fan" branches one node into several.
 */
export default function ArchitectureDiagram({ rows }: { rows: ArchRow[] }) {
  return (
    <div className="arch">
      {rows.map((row, rowIndex) => {
        const connector = rowIndex === 0 ? 'none' : (row.connector ?? 'line');
        const count = row.nodes.length;
        return (
          <div key={rowIndex}>
            {connector === 'line' ? (
              <div className="arch__line" aria-hidden="true" />
            ) : null}
            {connector === 'fan' ? (
              <div className="arch__fan" aria-hidden="true">
                <span
                  className="arch__fanbar"
                  style={{
                    left: `calc(100% / ${count * 2})`,
                    right: `calc(100% / ${count * 2})`,
                  }}
                />
                <span
                  className="arch__fandrops"
                  style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
                >
                  {row.nodes.map((node) => (
                    <i key={node.name} />
                  ))}
                </span>
              </div>
            ) : null}
            <div
              className="arch__row"
              style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
            >
              {row.nodes.map((node) => (
                <div
                  key={node.name}
                  className={`arch__node${node.tone ? ` arch__node--${node.tone}` : ''}`}
                >
                  <p className="arch__name">{node.name}</p>
                  {node.sub ? <p className="arch__sub">{node.sub}</p> : null}
                </div>
              ))}
            </div>
            {row.note ? <p className="arch__label">{row.note}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
