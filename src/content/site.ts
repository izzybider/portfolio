/* ============================================================
   SITE CONTENT
   Identity, navigation, homepage evidence, project cards and the
   case-study registry used for previous/next navigation.
   ============================================================ */

export const site = {
  name: 'Isabella “Izzy” Bider',
  footerLine: 'Isabella “Izzy” Bider · 2027 New Grad · AI Product',
  links: {
    resume: '/IsabellaBider_Resume.pdf',
    linkedin: 'https://www.linkedin.com/in/ibider/',
    email: 'mailto:isabella.bider@gmail.com',
  },
};

export const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Resume', href: site.links.resume },
  { label: 'Contact', href: '/#contact' },
];

/* Recruiter-facing proof row under the hero.
   Every figure here is a verified headline number. */
export const evidence = [
  { value: '75+', label: 'pilot users' },
  { value: '10,000+', label: 'users on enterprise AI platform' },
  { value: '1M+', label: 'production records analyzed' },
  { value: '20+', label: 'discovery conversations' },
  { value: '60+', label: 'product iterations' },
];

export type Motif = 'trend' | 'nodes' | 'continuum' | 'behaviors';

export type Project = {
  index: string;
  title: string;
  tag: string;
  statement: string;
  owned: string;
  proof: string[];
  motif: Motif;
  href: string;
  featured?: boolean;
  /* Set once the live TrustLayer experiment is deployed — a secondary
     "Open live experiment" CTA appears on the card automatically. */
  liveHref?: string;
};

export const projects: Project[] = [
  {
    index: '01',
    title: 'GuideAI',
    tag: 'Flagship · 0→1 AI product',
    statement:
      'Found an unaddressed workflow gap, built the AI product that closed it, and measured whether it actually helped.',
    owned:
      'Owned end to end: discovery, product, RAG architecture, pilot recruiting, analytics, AI evaluation.',
    proof: [
      '75+ pilot users · 87% weekly retention',
      '68% → 91% expert agreement',
      '45% less trainer-prep time',
      '8,500+ recommendations evaluated',
    ],
    motif: 'trend',
    href: '/work/guideai',
    featured: true,
  },
  {
    index: '02',
    title: 'Enterprise AI Product Systems',
    tag: 'Enterprise · Product ownership',
    statement:
      'Owned product problems inside a 10,000-user enterprise AI platform, where a symptom could originate in retrieval, data, infrastructure, or the workflow itself.',
    owned:
      'Owned: requirements, AI evaluation harness, production-data investigation, enhancement prioritization.',
    proof: [
      '10,000+ users · 1M+ records analyzed',
      '~50-question golden evaluation suite',
      '45+ enhancements triaged · 4 adopted for Phase 2',
    ],
    motif: 'nodes',
    href: '/work/enterprise-ai-product-systems',
  },
  {
    index: '03',
    title: 'Designing AI Around Trust',
    tag: 'Discovery · Product strategy',
    statement:
      'Research changed the target user and the product thesis: hearing loss did not predict product value — workflow, task and desired autonomy did.',
    owned:
      'Owned: research strategy, participant recruiting, synthesis, segmentation, product recommendation.',
    proof: [
      '20+ discovery conversations',
      '8+ stakeholder / expert interviews',
      'Workflow-based segmentation',
      'Adjustable-autonomy product thesis',
    ],
    motif: 'continuum',
    href: '/work/designing-ai-around-trust',
  },
  {
    index: '04',
    title: 'TrustLayer',
    tag: 'Independent AI experiment',
    statement:
      'An AI product thesis: the system should decide whether to answer, ask, verify or escalate before it generates anything.',
    owned:
      'Owned: product thesis, decision-policy design, benchmark and evaluation design.',
    proof: [
      'ANSWER / ASK / VERIFY / ESCALATE decision policy',
      'Built and benchmarked: 53 scenarios, 3 systems',
      'Unsupported action 75% → 0% on the synthetic set',
      'Costs 58 points of autonomous completion — stated, not hidden',
    ],
    motif: 'behaviors',
    href: '/work/trustlayer',
  },
];

/* Case-study ring used by the previous/next footer. */
export const caseStudies = [
  { href: '/work/guideai', name: 'GuideAI', sub: '0→1 AI product with real pilot users' },
  {
    href: '/work/enterprise-ai-product-systems',
    name: 'Enterprise AI Product Systems',
    sub: 'Product ownership inside a production AI platform',
  },
  {
    href: '/work/designing-ai-around-trust',
    name: 'Designing AI Around Trust',
    sub: 'Discovery that changed the product thesis',
  },
  {
    href: '/work/trustlayer',
    name: 'TrustLayer',
    sub: 'When is autonomy the right product behavior?',
  },
  {
    href: '/work/kosisonic',
    name: 'KosiSonic',
    sub: 'When a better metric is not a better product',
  },
];
