'use client';

import { useEffect, useState } from 'react';

export type NavItem = { id: string; label: string };

/**
 * CaseStudyNav — sticky section rail with scroll-spy. Horizontally
 * scrollable on small screens; understated by design.
 */
export default function CaseStudyNav({
  title,
  items,
}: {
  title: string;
  items: NavItem[];
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="casenav" aria-label="Case study sections">
      <div className="container casenav__inner">
        <span className="casenav__title">{title}</span>
        <ul className="casenav__list">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="casenav__link"
                aria-current={active === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
