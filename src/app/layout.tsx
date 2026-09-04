import type { Metadata } from 'next';
import './globals.css';

const description =
  'Northwestern BME + HCI. I build AI products around complex systems, human judgment, and real-world workflows — 0→1 products, production AI platforms, evaluation and experimentation.';

/* Absolute base for Open Graph / social previews. Vercel supplies the
   production hostname automatically, so this is correct on deploy without
   hardcoding a domain. Set NEXT_PUBLIC_SITE_URL in Vercel once a custom
   domain is attached, and it wins. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Isabella “Izzy” Bider — AI Product',
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
    siteName: 'Isabella “Izzy” Bider',
    title: 'Isabella “Izzy” Bider — AI Product',
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Isabella “Izzy” Bider — AI Product',
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
