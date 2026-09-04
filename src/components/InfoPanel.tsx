export default function InfoPanel({
  tone = 'blue',
  label,
  children,
}: {
  tone?: 'blue' | 'gray' | 'gray-soft' | 'white' | 'outline';
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`panel panel--${tone}`}>
      {label ? <p className="caps panel__label">{label}</p> : null}
      <div className="panel__body">{children}</div>
    </div>
  );
}
