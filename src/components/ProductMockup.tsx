/**
 * ProductMockup — a small kit for drawing real product surfaces
 * (fields, list rows, stats, recommendation blocks) instead of text boxes.
 */
export function ProductMockup({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mock">
      <div className="mock__bar">
        <span className="mock__title">{title}</span>
        {meta ? <span className="mock__meta">{meta}</span> : null}
      </div>
      <div className="mock__body">{children}</div>
    </div>
  );
}

export function MockField({
  label,
  value,
  select = false,
  muted = false,
}: {
  label: string;
  value: string;
  select?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="mock-field">
      <span className="mock-field__label">{label}</span>
      <span className={`mock-field__input${muted ? ' mock-field__input--muted' : ''}`}>
        {value}
        {select ? (
          <span className="mock-field__caret" aria-hidden="true">
            ▼
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function MockRows({ rows }: { rows: { day: string; text: string }[] }) {
  return (
    <div>
      {rows.map((row) => (
        <div className="mock-row" key={row.day + row.text}>
          <span className="mock-row__day">{row.day}</span>
          <span className="mock-row__text">{row.text}</span>
        </div>
      ))}
    </div>
  );
}

export function MockStat({
  name,
  value,
  direction,
}: {
  name: string;
  value: string;
  direction?: 'up' | 'down';
}) {
  return (
    <div className="mock-stat">
      <span className="mock-stat__name">{name}</span>
      <span
        className={`mock-stat__value${direction ? ` mock-stat__value--${direction}` : ''}`}
      >
        {direction === 'up' ? '↑ ' : direction === 'down' ? '↓ ' : ''}
        {value}
      </span>
    </div>
  );
}

export function MockBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mock-block">
      <p className="mock-block__label">{label}</p>
      <p className="mock-block__text">{children}</p>
    </div>
  );
}

export function MockButton({ children }: { children: React.ReactNode }) {
  return <span className="mock-btn">{children}</span>;
}

export function MockStatus({
  children,
  tone = 'default',
}: {
  children: React.ReactNode;
  tone?: 'default' | 'warn';
}) {
  return (
    <span className={`mock-status${tone === 'warn' ? ' mock-status--warn' : ''}`}>
      {children}
    </span>
  );
}

export function MockSpark({ values, peak }: { values: number[]; peak?: number }) {
  const max = Math.max(...values);
  return (
    <div className="mock-spark" aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={index}
          className={index === peak ? 'is-peak' : undefined}
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function MockNote({ children }: { children: React.ReactNode }) {
  return <p className="mock-note">{children}</p>;
}

export default ProductMockup;
