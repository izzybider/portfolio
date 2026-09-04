import Arrow from './Arrow';
import Link from 'next/link';
import { caseStudies } from '@/content/site';

/** Previous / next navigation across the case-study ring. */
export default function CaseStudyFooter({ current }: { current: string }) {
  const index = caseStudies.findIndex((entry) => entry.href === current);
  if (index === -1) return null;

  const previous = caseStudies[(index - 1 + caseStudies.length) % caseStudies.length];
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <nav className="casefoot" aria-label="More case studies">
      <div className="container casefoot__grid">
        <Link href={previous.href} className="casefoot__card">
          <p className="casefoot__dir">
            <Arrow direction="left" /> Previous
          </p>
          <p className="casefoot__name">{previous.name}</p>
          <p className="casefoot__sub">{previous.sub}</p>
        </Link>
        <Link href={next.href} className="casefoot__card casefoot__card--next">
          <p className="casefoot__dir">
            Next <Arrow />
          </p>
          <p className="casefoot__name">{next.name}</p>
          <p className="casefoot__sub">{next.sub}</p>
        </Link>
      </div>
    </nav>
  );
}
