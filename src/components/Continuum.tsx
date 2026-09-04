/**
 * Continuum — a labelled spectrum (e.g. participate → delegate).
 * Each stop can carry the tasks or conditions that sit at that level.
 */
export default function Continuum({
  stops,
  ends,
}: {
  stops: { name: string; sub?: string; accent?: boolean }[];
  ends?: [string, string];
}) {
  return (
    <div className="continuum">
      <div className="continuum__track">
        {stops.map((stop) => (
          <div
            key={stop.name}
            className={`continuum__stop${stop.accent ? ' continuum__stop--accent' : ''}`}
          >
            <p className="continuum__name">{stop.name}</p>
            {stop.sub ? <p className="continuum__sub">{stop.sub}</p> : null}
          </div>
        ))}
      </div>
      {ends ? (
        <div className="continuum__ends">
          <span className="caps">{ends[0]}</span>
          <span className="caps">{ends[1]}</span>
        </div>
      ) : null}
    </div>
  );
}
