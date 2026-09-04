/** DefinitionGrid — uppercase term + description pairs. */
export default function DefinitionGrid({
  items,
  columns = 2,
}: {
  items: { term: string; desc: React.ReactNode }[];
  columns?: number;
}) {
  return (
    <dl
      className="defs"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <div key={item.term}>
          <dt className="defs__term">{item.term}</dt>
          <dd className="defs__desc">{item.desc}</dd>
        </div>
      ))}
    </dl>
  );
}
