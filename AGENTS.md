# AGENTS.md

Personal portfolio and technical blog. Next.js 16 (App Router) + React 19 + Tailwind,
articles written as MDX. Deployed on Vercel.

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
- `src/lib/posts.ts` — derives the post list from the filesystem. No index to maintain.
- `src/components/` — UI by page: `home/`, `blog/` and `article/`. `mdx/` holds the elements
  posts render with (mapped in `src/mdx-components.tsx`); `common/` holds the site chrome and
  pieces shared across pages.
- `src/lib/` — site config, post loading and small helpers.
- `DESIGN.md` — visual redesign source of truth (tokens, type, `max-w-2xl` column, home/blog/article structure). Read it before changing UI.

Implement the redesign in layers, as separate PRs: tokens + chrome → home → `/blog` → article pages → motion/polish. Posts stay MDX in git. Do not install Spec Kit for this work.

## Writing articles

`src/lib/posts.ts` parses each `page.mdx` with **regular expressions, not by evaluating
the module**, and throws at build time when something does not match:

- `metadata.title` must be quoted and **followed by a comma**. So must
  `metadata.description`, or it is silently dropped.
- `date` must be a quoted `Month D, YYYY` string with the full month name, such as
  `'September 10, 2026'`. Any other format fails the build.
- The year in `date` must equal the `{year}` directory name.
- The slug (directory name) must be unique across years.
- No `# H1` in the body; the title comes from `metadata`.

Bodies are plain markdown plus `<YouTube videoId="…" />`. Any other JSX component has to be
added to `src/mdx-components.tsx` first, or the build fails.

## Skills

The repo only carries skills by Emil Kowalski
([emilkowalski/skills](https://github.com/emilkowalski/skills), MIT), committed in
`.agents/skills/`. Skills by Lauren Tan (poteto) come from the `pstack` Claude Code
plugin, which is installed per machine and not vendored here.

| Skill                          | Use it for                                                |
| ------------------------------ | --------------------------------------------------------- |
| `emil-design-eng`              | UI polish, component design and animation decisions       |
| `animate`                      | Building an animation from scratch, decision by decision  |
| `choreograph`                  | Several elements moving together: order, overlap, stagger |
| `gestures`                     | Drag, swipe and sheet interactions that track the finger  |
| `animation-performance`        | Keeping motion inside the frame budget, finding jank      |
| `find-animation-opportunities` | Read-only: where the UI should and should not animate     |
| `improve-animations`           | Read-only audit of the motion code, with fix plans        |
| `remove-animations`            | Deleting motion the interface does not need               |
| `review-animations`            | Reviewing motion code against a high craft bar            |
| `animation-vocabulary`         | Naming a motion effect you can only describe              |
| `apple-design`                 | Apple-style fluid motion, depth and typography on the web |
| `mobile-native`                | Making the site feel native on phones                     |
| `break-ui`                     | Stress-testing UI with worst-case data                    |
| `prototype`                    | Several variants of a UI piece behind a live picker       |
| `pick-ui-library`              | Curated library picks for a frontend task                 |
| `ask-sonner`                   | The Sonner toast library                                  |
| `animate-expo`                 | React Native and Expo animation (not used by this site)   |
| `write-swift`                  | Modern Swift (not used by this site)                      |

`review-animations`, `prototype` and `pick-ui-library` only run when invoked by name.

`.agents/skills/` is the tool-neutral location, so most agent tools pick these up as
soon as the repo is cloned. Claude Code reads `.claude/skills/` instead, which is
gitignored and generated per machine:

```bash
bash scripts/setup-skills.sh            # this repo only
bash scripts/setup-skills.sh --global   # also expose them in ~/.claude/skills/
```

The skills are pinned in `skills-lock.json`. Update them with the Skills CLI rather
than editing the vendored files by hand:

```bash
npx skills add emilkowalski/skills --skill '*' --agent '*'
```

## Conventions

- Prose and code comments in English; commit messages in English, conventional commits.
- Prettier and ESLint are authoritative — run them instead of hand-formatting.
- Do not commit unless the author explicitly asks.
