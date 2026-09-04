'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks, site } from '@/content/site';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="container header__inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
          <Link href="/" className="header__name">
            {site.name}
          </Link>
          <span className="header__badge">2027 New Grad</span>
        </div>
        <nav className="header__nav" aria-label="Main">
          {navLinks.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : link.href.startsWith('/work') && pathname.startsWith('/work');
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`header__link${active ? ' header__link--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
