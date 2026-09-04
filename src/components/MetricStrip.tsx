import { withArrows } from './Arrow';

export type Metric = { value: string; label?: string };

/**
 * MetricStrip — headline evidence.
 * variant: "band" (muted gray block) | "rule" (hairline top/bottom) | "plain"
 */
export default function MetricStrip({
  items,
  columns = 3,
  variant = 'rule',
  size = 'lg',
  caps = false,
}: {
  items: Metric[];
  columns?: number;
  variant?: 'band' | 'rule' | 'plain';
  size?: 'lg' | 'sm';
  caps?: boolean;
}) {
  return (
    <dl
      className={`metrics${variant === 'plain' ? '' : ` metrics--${variant}`}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <div key={item.value + (item.label ?? '')}>
          <dd className={`metric__value${size === 'sm' ? ' metric__value--sm' : ''}`}>
            {withArrows(item.value)}
          </dd>
          {item.label ? (
            <dt className={`metric__label${caps ? ' metric__label--caps' : ''}`}>
              {item.label}
            </dt>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
