# AGENTS.md

Personal portfolio and technical blog. Next.js 16 (App Router) + React 19 + Tailwind,
articles written as MDX. Deployed on Vercel. Embedded tweets may be cached in Upstash Redis.

## Commands

```bash
npm run dev            # local dev server
npm run build          # production build - also validates every post's frontmatter
npm run lint           # eslint
npm run format         # prettier --write
```

Run `npm run build` before finishing any change that touches `src/app/(posts)/`.
Post metadata is parsed at build time and a malformed export fails the build.

## Layout

- `src/app/(posts)/{year}/{slug}/page.mdx` — one article per directory.
- `src/get-posts.ts` — derives the post list from the filesystem. No index to maintain.
- `src/components/` — UI, split into `blog/` and `portfolio/`.
- `src/lib/`, `src/redis.ts` — site config and optional tweet cache.

## Writing articles

`src/get-posts.ts` parses each `page.mdx` with **regular expressions, not by evaluating
the module**, and throws at build time when something does not match:

- `metadata.title` must be quoted and **followed by a comma**.
- `date` must be a quoted `Month DD, YYYY` string.
- The year in `date` must equal the `{year}` directory name.
- No `# H1` in the body; the title comes from `metadata`.

The full conventions, voice profile and editing pipeline are in the `blog-post` skill
(`.agents/skills/blog-post/SKILL.md`). Read it before drafting or restructuring a post.

## Skills

Reusable agent instructions live in `.agents/skills/`, committed to the repo:

| Skill | Use it for |
| --- | --- |
| `blog-post` | MDX conventions, article structure, the research to publish pipeline |
| `research` | Gathering facts from primary sources into a cited Markdown file |
| `humanizer` | Editing prose for AI writing patterns ([blader/humanizer](https://github.com/blader/humanizer), MIT) |
| `review` | Read-only bug-and-risk review of a diff |
| `frontend-design` | Distinctive visual identity (not Inter + gray defaults) |
| `design-taste-frontend` | Portfolio/redesign direction, anti-slop |
| `emil-design-eng` | Motion, hover, interaction feel |
| `web-design-guidelines` | UX/accessibility review (Vercel) |
| `better-ui` | Surface, radius, icon, micro-interaction polish |
| `better-typography` | Type scale, wrapping, tabular numbers |
| `better-layout` | Spacing, grouping, breakpoints |
| `better-accessibility` | Focus, keyboard, hit areas, reduced motion |
| `impeccable` | Production polish pass |
| `vercel-react-best-practices` | React/Next performance while redesigning |

`.agents/skills/` is the tool-neutral location, so most agent tools pick these up as
soon as the repo is cloned. Claude Code reads `.claude/skills/` instead, which is
gitignored and generated per machine:

```bash
bash scripts/setup-skills.sh            # this repo only
bash scripts/setup-skills.sh --global   # also expose them in ~/.claude/skills/
```

Third-party skills are pinned in `skills-lock.json`. Update them with the Skills CLI
rather than editing the vendored files by hand:

```bash
npx skills add blader/humanizer --agent '*'
```

## Conventions

- Prose and code comments in English; commit messages in English, conventional commits.
- Prettier and ESLint are authoritative — run them instead of hand-formatting.
- Do not commit unless the author explicitly asks.
