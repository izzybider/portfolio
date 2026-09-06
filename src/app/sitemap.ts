import type { MetadataRoute } from 'next';
import { caseStudies } from '@/content/site';
import { siteUrl } from '@/content/site';

/* One entry per real route. `siteUrl` resolves to the deployment host, so this
   is correct on Vercel without a hardcoded domain. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...caseStudies.map((study) => ({
      url: `${siteUrl}${study.href}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...['/demo/guideai', '/demo/trustlayer', '/experiments/commonground'].map((href) => ({
      url: `${siteUrl}${href}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
