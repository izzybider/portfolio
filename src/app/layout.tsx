import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import { site, siteUrl } from '@/content/site';
import './globals.css';

/* Self-hosted at build time by next/font: no render-blocking request to
   Google, no layout shift, and the CSS variables below are what
   globals.css reads for --font-display / --font-body / --font-mono. */
const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-sans',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
});

const description =
  'Northwestern BME + HCI. I build AI products around complex systems, human judgment, and real-world workflows — 0→1 products, production AI platforms, evaluation and experimentation.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Isabella Bider — AI Product',
    template: '%s',
  },
  description,
  applicationName: 'Isabella Bider — Portfolio',
  authors: [{ name: 'Isabella Bider' }],
  keywords: [
    'AI product management',
    'associate product manager',
    'product strategy',
    'AI evaluation',
    'product analytics',
    '2027 new grad',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Isabella Bider',
    title: 'Isabella Bider — AI Product',
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Isabella Bider — AI Product',
    description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

/* Structured data. Recruiters and sourcing tools read this; it is also what
   lets a search engine connect the site to the LinkedIn profile. Everything
   here is factual and already stated elsewhere on the page. */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Isabella Bider',
  url: siteUrl,
  email: site.links.email.replace('mailto:', ''),
  jobTitle: 'AI Product — 2027 New Grad',
  description,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Northwestern University',
  },
  knowsAbout: [
    'AI product management',
    'Product strategy',
    'AI evaluation',
    'Product analytics',
    'Human-computer interaction',
  ],
  sameAs: [site.links.linkedin],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
