'use client';

/**
 * Accessible tab strip. Real buttons in a tablist, arrow-key navigable,
 * with the panel wired to the selected tab.
 */
export default function DemoTabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  label: string;
}) {
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((t) => t.id === active);
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const next =
        event.key === 'ArrowRight'
          ? (index + 1) % tabs.length
          : (index - 1 + tabs.length) % tabs.length;
      onChange(tabs[next].id);
      document.getElementById(`tab-${tabs[next].id}`)?.focus();
    }
    if (event.key === 'Home') {
      event.preventDefault();
      onChange(tabs[0].id);
    }
    if (event.key === 'End') {
      event.preventDefault();
      onChange(tabs[tabs.length - 1].id);
    }
  };

  return (
    <div className="demotabs" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          type="button"
          role="tab"
          className="demotabs__tab"
          aria-selected={tab.id === active}
          aria-controls={`panel-${tab.id}`}
          tabIndex={tab.id === active ? 0 : -1}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
