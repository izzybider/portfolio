import Link from 'next/link';
import Arrow from './Arrow';

/**
 * Chrome shared by both interactive demos: what this is, that the data is
 * synthetic, and the way back to the case study. Kept deliberately quiet —
 * the disclosure has to be honest, not alarming.
 */
export default function DemoShell({
  eyebrow,
  title,
  lede,
  badge = 'Interactive demo · synthetic example data',
  disclosure,
  caseStudyHref,
  caseStudyLabel,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: React.ReactNode;
  /** the short label beside the title */
  badge?: string;
  disclosure: string;
  caseStudyHref: string;
  caseStudyLabel: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="demo">
      <div className="container">
        <header className="demo__head">
          <p className="eyebrow">{eyebrow}</p>
          <div className="demo__headrow">
            <h1 className="demo__title">{title}</h1>
            <span className="demo__badge">{badge}</span>
          </div>
          <p className="lede demo__lede">{lede}</p>
          <p className="demo__disclosure">{disclosure}</p>
          <div className="demo__actions">
            <Link href={caseStudyHref} className="button button--quiet">
              {caseStudyLabel} <Arrow />
            </Link>
            {actions}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
