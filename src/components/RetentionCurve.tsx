/** RetentionCurve — small inline SVG line chart for cohort retention. */
export default function RetentionCurve({
  points,
  height = 150,
}: {
  points: { label: string; value: number }[];
  height?: number;
}) {
  const width = 520;
  const padX = 34;
  const padY = 16;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2 - 18;
  const min = 50;
  const max = 100;

  const coords = points.map((point, index) => {
    const x = padX + (innerW * index) / Math.max(1, points.length - 1);
    const y = padY + innerH * (1 - (point.value - min) / (max - min));
    return { ...point, x, y };
  });

  const path = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ');

  return (
    <svg
      className="linechart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Retention by week: ${points
        .map((p) => `${p.label} ${p.value}%`)
        .join(', ')}`}
    >
      {[100, 75, 50].map((tick) => {
        const y = padY + innerH * (1 - (tick - min) / (max - min));
        return (
          <g key={tick}>
            <line
              x1={padX}
              x2={width - padX / 2}
              y1={y}
              y2={y}
              stroke="var(--rule)"
              strokeWidth="1"
            />
            <text x="0" y={y + 4} fontSize="11" fill="var(--ink-muted)">
              {tick}%
            </text>
          </g>
        );
      })}
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {coords.map((c) => (
        <g key={c.label}>
          <circle cx={c.x} cy={c.y} r="4" fill="var(--accent)" />
          <text
            x={c.x}
            y={c.y - 12}
            fontSize="11.5"
            fontWeight="600"
            textAnchor="middle"
            fill="var(--ink)"
          >
            {c.value}%
          </text>
          <text
            x={c.x}
            y={height - 2}
            fontSize="11"
            textAnchor="middle"
            fill="var(--ink-muted)"
          >
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
