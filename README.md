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

## Where to edit things

- **Design tokens** — the `:root` block at the top of `src/app/globals.css`:
  colors, 8px spacing scale, type scale, `--page-max` (1200px) and `--measure`
  (720px reading width), radii.
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

Evidence and framing: `MetricStrip`, `EvidenceStrip`, `ArtifactCard`,
`DecisionCallout`, `InsightCallout`, `Statement`, `ProvenanceNote`, `InfoPanel`.

Diagrams and charts (CSS/SVG, no chart library): `ArchitectureDiagram`,
`ProcessFlow`, `Continuum`, `Funnel`, `HorizontalBarChart`, `RetentionCurve`,
`Matrix2x2`, `TradeoffPlot`, `SystemTrace`.

Data: `DataTable` + `Tag`, `KeyValueRows`, `ExperimentComparison`, `CellGrid`,
`DefinitionGrid`, `Timeline`.

Product mockups: `ProductMockup` with `MockField`, `MockRows`, `MockStat`,
`MockBlock`, `MockButton`, `MockStatus`, `MockSpark`, `MockNote`.

Homepage: `ProjectCard` (with per-project motif), `SupportCard`.

## Content integrity

The site distinguishes measured work from reconstructions and proposals:

- `ProvenanceNote` and `ArtifactCard`'s `caption` carry the framing (e.g.
  “synthetic reconstruction”, “not yet run”, “illustrative example”).
- Unverified outcome numbers were removed rather than softened — see the
  comment block at the top of each case-study page for exactly what and why.

## Assets and metadata

- `public/IsabellaBider_Resume.pdf` — every Resume link points here.
- `src/app/icon.svg` — favicon.
- Per-page titles, descriptions and Open Graph tags live in each page's
  `metadata` export; site-wide defaults are in `src/app/layout.tsx`.

## Before you deploy

1. Set `metadataBase` in `src/app/layout.tsx` to your real domain so social
   previews resolve absolute URLs.
2. To turn on the TrustLayer live-demo buttons, set `LIVE_DEMO_URL` at the top
   of `src/app/work/trustlayer/page.tsx` — the CTA then appears in the hero and
   at the end of that case study.
3. To add an "Open live experiment" link to a homepage card, set `liveHref` on
   that project in `src/content/site.ts`.
