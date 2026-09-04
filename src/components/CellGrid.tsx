/** CellGrid — hairline-separated cells for compact matrices and checklists. */
export default function CellGrid({
  items,
  columns = 2,
  tone = 'blue',
}: {
  items: React.ReactNode[];
  columns?: number;
  tone?: 'blue' | 'white';
}) {
  return (
    <div
      className={`cells${tone === 'white' ? ' cells--white' : ''}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map((item, index) => (
        <div className="cells__cell" key={index}>
          {item}
        </div>
      ))}
    </div>
  );
}
