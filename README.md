# marcoscamara.com

Personal site and blog of Marcos Cámara. Next.js 16 (App Router), React 19 and Tailwind;
articles are MDX files in the repo. Deployed on Vercel.

## Develop

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build        # production build; also validates every post's metadata
npm run lint
npm run format
npm run lighthouse   # build and audit against lighthouserc.json, as CI does
```

## Where things live

- `src/app/(posts)/{year}/{slug}/page.mdx`: one article per folder.
- `src/app/`: the other routes, plus the sitemap, robots and Open Graph image.
- `src/components/`: `home/`, `blog/` and `article/` per page, `mdx/` for the elements
  articles render with, `common/` for shared pieces.
- `src/lib/`: post loading, dates and site config.

`AGENTS.md` has the rules for writing posts and working in the repo. `DESIGN.md`
describes the visual design.
