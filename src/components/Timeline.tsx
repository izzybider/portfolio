/** Timeline — the experience list. */
export default function Timeline({
  rows,
}: {
  rows: { when: string; what: React.ReactNode }[];
}) {
  return (
    <dl className="timeline">
      {rows.map((row) => (
        <div className="timeline__row" key={row.when + String(row.what)}>
          <dt className="timeline__when">{row.when}</dt>
          <dd className="timeline__what">{row.what}</dd>
        </div>
      ))}
    </dl>
  );
}
