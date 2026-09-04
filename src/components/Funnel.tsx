/** Funnel — proportional stage bars with optional step-to-step drop labels. */
export default function Funnel({
  steps,
  showDrop = true,
}: {
  steps: { label: string; value: number; display?: string }[];
  showDrop?: boolean;
}) {
  const max = Math.max(...steps.map((step) => step.value));

  return (
    <div className="funnel">
      {steps.map((step, index) => {
        const previous = steps[index - 1];
        const drop = previous ? step.value - previous.value : 0;
        return (
          <div className="funnel__row" key={step.label}>
            <span className="funnel__label">{step.label}</span>
            <span className="funnel__barwrap">
              <span
                className={`funnel__bar${index === 0 ? ' funnel__bar--muted' : ''}`}
                style={{ width: `${Math.max(2, (step.value / max) * 100)}%` }}
              />
              <span className="funnel__value">{step.display ?? `${step.value}%`}</span>
              {showDrop && previous ? (
                <span className="funnel__drop">{drop} pts</span>
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}
