/** ProcessFlow — a sequence of labelled steps joined by arrows. */
export default function ProcessFlow({
  steps,
  direction = 'horizontal',
  tone = 'white',
  arrow,
  highlight = [],
  row = false,
}: {
  steps: string[];
  direction?: 'horizontal' | 'vertical';
  tone?: 'white' | 'blue';
  arrow?: string;
  /** indexes rendered in the accent colour */
  highlight?: number[];
  /** keep every step on one desktop row, stacking on mobile */
  row?: boolean;
}) {
  const mark = arrow ?? (direction === 'vertical' ? '↓' : '→');

  return (
    <div
      className={`flow${direction === 'vertical' ? ' flow--vertical' : ''}${
        row ? ' flow--row' : ''
      }`}
    >
      {steps.map((step, index) => (
        <div
          key={step}
          style={direction === 'vertical' ? undefined : { display: 'contents' }}
        >
          <span
            className={`flow__step${
              highlight.includes(index)
                ? ' flow__step--accent'
                : tone === 'blue'
                  ? ' flow__step--blue'
                  : ''
            }`}
          >
            {step}
          </span>
          {index < steps.length - 1 ? (
            <span className="flow__arrow" aria-hidden="true">
              {mark}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
