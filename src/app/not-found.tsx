import Link from 'next/link';
import { Arrow, PageShell, Section } from '@/components';
import { caseStudies, site } from '@/content/site';

export const metadata = { title: 'Page not found — Isabella “Izzy” Bider' };

export default function NotFound() {
  return (
    <PageShell>
      <Section
        label="404"
        title="That page does not exist."
        intro="The link may be out of date. Everything on the site is one of these five case studies."
        width="wide"
      >
        <ul className="notfound">
          {caseStudies.map((study) => (
            <li key={study.href}>
              <Link href={study.href} className="notfound__link">
                <span className="notfound__name">{study.name}</span>
                <span className="meta">{study.sub}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p>
          <Link href="/" className="button button--primary">
            Back to the homepage <Arrow />
          </Link>{' '}
          <a className="button button--quiet" href={site.links.resume}>
            Resume
          </a>
        </p>
      </Section>
    </PageShell>
  );
}
