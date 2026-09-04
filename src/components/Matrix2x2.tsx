export type Quadrant = {
  head: string;
  items: string[];
  emphasis?: 'priority' | 'mute';
};

/**
 * Matrix2x2 — prioritisation grid. Quadrants are supplied in reading order
 * (top-left, top-right, bottom-left, bottom-right).
 */
export default function Matrix2x2({
  quadrants,
  xAxis,
  yAxis,
}: {
  quadrants: [Quadrant, Quadrant, Quadrant, Quadrant];
  xAxis: [string, string];
  yAxis: string;
}) {
  return (
    <div className="matrix">
      <p className="caps matrix__yaxis">{yAxis}</p>
      <div className="matrix__grid">
        {quadrants.map((quadrant) => (
          <div
            key={quadrant.head}
            className={`matrix__cell${
              quadrant.emphasis ? ` matrix__cell--${quadrant.emphasis}` : ''
            }`}
          >
            <p className="matrix__cellhead">{quadrant.head}</p>
            <ul className="matrix__items">
              {quadrant.items.map((item) => (
                <li className="matrix__item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="matrix__xaxis">
        <span className="caps">{xAxis[0]}</span>
        <span className="caps">{xAxis[1]}</span>
      </div>
    </div>
  );
}
