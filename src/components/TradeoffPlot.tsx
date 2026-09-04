export type PlotPoint = {
  label: string;
  /** 0–1 along the x axis */
  x: number;
  /** 0–1 along the y axis */
  y: number;
  emphasis?: boolean;
};

/**
 * TradeoffPlot — the axes a result is read against.
 * Points are optional on purpose: the frame is meaningful before any
 * measurement exists, and no coordinates are drawn until one does.
 */
export default function TradeoffPlot({
  xAxis,
  yAxis,
  ideal,
  zones = [],
  legend = [],
  points = [],
}: {
  xAxis: string;
  yAxis: string;
  ideal: string;
  zones?: { text: string; position: 'top-left' | 'top-right' | 'bottom-left' }[];
  legend?: string[];
  points?: PlotPoint[];
}) {
  const place = (position: string): React.CSSProperties =>
    position === 'top-left'
      ? { top: 12, left: 12 }
      : position === 'top-right'
        ? { top: 12, right: 12, textAlign: 'right' }
        : { bottom: 12, left: 12 };

  return (
    <div>
      <div className="plot">
        <p className="caps matrix__yaxis">{yAxis}</p>
        <div className="plot__frame">
          {zones.map((zone) => (
            <p className="plot__zone" key={zone.text} style={place(zone.position)}>
              {zone.text}
            </p>
          ))}
          {points.map((point) => (
            <span
              key={point.label}
              /* Points near the right edge carry their label on the left so it
                 stays inside the frame. */
              className={`plot__point${point.emphasis ? ' plot__point--accent' : ''}${
                point.x > 0.7 ? ' plot__point--flip' : ''
              }`}
              style={{
                left: `${point.x * 100}%`,
                bottom: `${point.y * 100}%`,
              }}
            >
              <span className="plot__dot" aria-hidden="true" />
              <span className="plot__label">{point.label}</span>
            </span>
          ))}
          <p className="plot__ideal">{ideal}</p>
        </div>
        <div className="matrix__xaxis">
          <span className="caps">{xAxis}</span>
        </div>
      </div>
      {legend.length > 0 ? (
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--s2)',
            marginTop: 'var(--s2)',
          }}
        >
          {legend.map((item) => (
            <li className="chip" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
