# Isabella “Izzy” Bider — Portfolio

Next.js (App Router) + React + TypeScript. Editorial product-case-study site
built for 2027 new-grad APM / PM / AI product recruiting.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Node 18.18+.

Do **not** run `npm run build` while `npm run dev` is running — they share the
`.next` directory and the build will break the running dev server.

## Routes

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/work/guideai` | GuideAI — flagship 0→1 AI product |
| `/work/enterprise-ai-product-systems` | Enterprise AI Product Systems |
| `/work/designing-ai-around-trust` | Designing AI Around Trust (AZcare) |
| `/work/trustlayer` | TrustLayer — independent AI experiment |
| `/work/kosisonic` | KosiSonic — supporting mini case |
| `/sitemap.xml`, `/robots.txt` | Generated from `caseStudies` in `src/content/site.ts` |
| 404 | `src/app/not-found.tsx` — lists the five case studies |

## Where to edit things

- **Design tokens** — the `:root` block at the top of `src/app/globals.css`:
  colors, 8px spacing scale, type scale, `--page-max` (1200px) and `--measure`
  (720px reading width), radii. The three font families are loaded and
  self-hosted by `next/font` in `src/app/layout.tsx`; the `--font-*` tokens
  point at the variables it generates.
- **Identity, nav, homepage evidence strip, project cards, case-study ring** —
  `src/content/site.ts`.
- **Case-study copy** — one file per case under `src/app/work/<slug>/page.tsx`.
  Section labels, headlines and artifact data sit inline where you can see them.
  Each page begins with a content-integrity comment describing what was removed
  or still needs verification.
- **Section navigation** — the `NAV` array at the top of each case-study page
  drives the sticky rail; ids must match the `<Section id>` values.

## Component kit

Layout: `PageShell`, `Header`, `Footer`, `Section`, `CaseStudyHero`,
`CaseStudyNav`, `CaseStudyFooter`.

Evidence and framing: `CaseGlance`, `MetricStrip`, `EvidenceStrip`,
`ArtifactCard`, `DecisionCallout`, `InsightCallout`, `Statement`,
`ProvenanceNote`, `InfoPanel`, `DeeperDetail`, `Arrow`.

Diagrams and charts (CSS/SVG, no chart library): `ArchitectureDiagram`,
`ProcessFlow`, `Continuum`, `Funnel`, `HorizontalBarChart`, `RetentionCurve`,
`Matrix2x2`, `TradeoffPlot`, `SystemTrace`.

Data: `DataTable` + `Tag`, `KeyValueRows`, `ExperimentComparison`, `CellGrid`,
`DefinitionGrid`, `Timeline`.

Product mockups: `ProductMockup` with `MockField`, `MockRows`, `MockStat`,
`MockBlock`, `MockButton`, `MockStatus`, `MockSpark`, `MockNote`.

Homepage: `ProjectCard` (with per-project motif), `SupportCard`.

## Reading at three speeds

The site is built for three depths of attention, and the two components that
carry that are worth knowing about before editing a case study:

- **`CaseGlance`** sits directly under every flagship hero. Four fixed cells —
  problem, my role, key decision, outcome — identical across the four cases so
  they can be compared rather than re-learned. Its `status` prop
  (`measured` / `benchmark` / `proposed` / `internal`) prints the evidence type
  next to the outcome, so a pilot result and a validation plan never look alike.
  A recruiter should be able to read the hero plus this and stop.
- **`DeeperDetail`** wraps material an interviewer wants and a recruiter does
  not need first: scoring tables, the diagnostic trace, the PRD extract, the
  policy rules. Native `<details>`, so it stays keyboard-operable and present in
  the HTML for indexing — deferred, never deleted.

Section navigation lists only major sections, not every heading on the page.

## A note on arrows

The webfonts load the `latin` subset, whose `unicode-range` excludes U+2192 and
the other arrows. A literal `→` therefore falls back to a system face — wrong
weight everywhere, an empty box on machines with no arrow-bearing font.
Interface arrows are drawn as SVG (`Arrow`), `withArrows()` swaps them into
display strings like `68% → 91%`, and the CSS font stacks end in symbol
families so any remaining prose arrow still resolves. Prefer `<Arrow />` over
typing an arrow.

## Content integrity

The site distinguishes measured work from reconstructions and proposals:

- `ProvenanceNote` and `ArtifactCard`'s `caption` carry the framing (e.g.
  “synthetic reconstruction”, “not yet run”, “illustrative example”).
- Unverified outcome numbers were removed rather than softened — see the
  comment block at the top of each case-study page for exactly what and why.

### TrustLayer numbers are generated, not written

Every figure on `/work/trustlayer` is produced by the TrustLayer app in
`~/Documents/trustlayer`. To refresh them:

```bash
cd ~/Documents/trustlayer
npm run bench                          # section 08, main table
npm run bench -- --request-only        # section 08, "honest read" table
npm run bench -- --policy=conservative # section 05, profile sweep
npm run bench -- --policy=autonomous   # section 05, profile sweep
```

The trace in section 09 is the literal trace the app emits for scenario
`ev_001` under the Balanced policy in deterministic mode. The architecture
described in section 04 is the one that is actually built — Next.js +
TypeScript + zod, a deterministic 11-rule engine, six simulated tools over
local JSON. Earlier drafts claimed a Python/FastAPI service and a vector
database; those claims were wrong and have been removed.

## Assets and metadata

- `public/IsabellaBider_Resume.pdf` — every Resume link points here.
- `src/app/icon.svg` — favicon.
- Per-page titles, descriptions and Open Graph tags live in each page's
  `metadata` export; site-wide defaults are in `src/app/layout.tsx`.

## Search and metadata

- `src/app/sitemap.ts` and `src/app/robots.ts` are generated from the
  case-study list; both use `siteUrl` from `src/content/site.ts`.
- Each case study sets its own canonical URL in its `metadata` export.
- `src/app/layout.tsx` emits a JSON-LD `Person` block (name, school, LinkedIn,
  email) — this is what search engines and sourcing tools read.

## Before you deploy

1. `siteUrl` in `src/content/site.ts` resolves automatically on Vercel. Set
   `NEXT_PUBLIC_SITE_URL` there once a custom domain is attached and it wins;
   until then, canonical URLs and the sitemap will use the Vercel hostname.
2. To turn on the TrustLayer live-demo buttons, set `LIVE_DEMO_URL` at the top
   of `src/app/work/trustlayer/page.tsx` — the CTA then appears in the hero and
   at the end of that case study.
3. To add an "Open live experiment" link to a homepage card, set `liveHref` on
   that project in `src/content/site.ts`.
