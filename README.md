# prxmy.in

Prakhar Gupta’s portfolio: a hardware-inspired workbench with a CPU navigation board, project rack, GPU contribution cards and RAM technology groups. Interactions support keyboard navigation and reduced motion.

Built with Next.js App Router, React, TypeScript and Tailwind CSS. Read `AGENTS.md` and the installed guides in `node_modules/next/dist/docs/` before changing framework code.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Keep `.env.local` private. No credentials are required to view the portfolio.

## Pages

- `/`: projects, open source, technologies, experience, education and contact.
- `/projects/[slug]`: five individual project case studies.
- `/book`: Cal.com meeting selection, available times and booking; email fallback when the provider is unavailable.
- `/resume`: PDF viewer; `/resume.pdf` serves the same résumé.
- `/aws~env`: EcoAudit demo, team résumés and social links.
- `/aws-env/video`: full-screen demo viewer. The older `/aws~env/video` address redirects here.
- Unknown projects and pages return HTTP 404.

The AWS team and video pages, plus teammates’ PDFs, deliberately stay out of search results. They remain reachable through their existing links.

## Search and AI discovery

The canonical host is `https://www.prxmy.in`. The root domain and previous portfolio domain redirect there when attached to this deployment.

- `/sitemap.xml`: the eight indexable HTML pages.
- `/robots.txt`: crawler policy and sitemap location; API routes are excluded.
- `/llms.txt`: a short public content index; `/llm.txt` permanently redirects here.
- `/llms-full.txt`: biography and complete project descriptions in one file.
- `/index.md` and `/projects/[slug]/index.md`: readable Markdown alternatives, advertised through HTTP `Link` headers.

Machine-readable files derive from `src/content.ts`. They use `noindex, follow` headers to avoid duplicate search listings. HTML pages have individual canonical URLs, descriptions, Open Graph and X cards. The homepage includes Person, WebSite and ProfilePage structured data. Hardware asset sources and licenses are recorded in `public/hardware/ASSETS.md`.

## Production configuration

Deploy as a standard Next.js application with `npm run build`. Keep the canonical host and redirects aligned if the domain changes.

- `CAL_API_KEY`: server-only Cal.com API key. The locally configured key was expired at the November 17, 2026 audit. Renew it and set it in the hosting provider’s production environment to enable scheduling. Until then, `/book` offers email contact. Never use a `NEXT_PUBLIC_` prefix.
- `GITHUB_TOKEN`: optional read-only GitHub token for refreshing the contribution calendar. The committed verified snapshot remains available without it or during provider errors. The UI shows its date.
- `VERCEL_ANALYTICS_TOKEN`: optional for the retained visitor snapshot refresh script; the current homepage does not show a visitor counter.

Refresh public GitHub data with `npm run github:refresh` (reads `.env.local`) or `npm run github:refresh -- --gh` (uses an existing GitHub CLI login). Review and commit the resulting snapshot. Featured GPU contribution counts use the separately dated `src/data/upstream.json` snapshot.

Replace `public/prakhar-resume.pdf` when updating the résumé, preserving the filename to keep shared links working.

## Verify before release

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

Then start the built site and run the route, metadata, security header, 404 and machine-content checks:

```sh
npm run start -- -p 3101
# In another terminal:
npm run smoke -- http://localhost:3101
```

CI runs the source checks and production smoke test. The production smoke workflow also checks successful deployments and runs daily. For manual post-deployment verification, run `npm run smoke -- https://www.prxmy.in`.
