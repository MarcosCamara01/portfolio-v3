---
name: blog-post
description: |
  Write, edit or publish an article on this portfolio blog (src/app/(posts)). Use when
  drafting a new post, restructuring an existing one, checking MDX conventions, or
  running the research -> draft -> humanize -> review pipeline. Encodes the build
  constraints of get-posts.ts and the author's established voice.
---

# Blog post pipeline

## 1. Hard build constraints

`src/get-posts.ts` derives posts from the filesystem and **throws at build time** if these
are wrong. Verify before finishing:

- Path is exactly `src/app/(posts)/{year}/{slug}/page.mdx`. The directory name is the
  post `id` and the public URL is `/{year}/{slug}`.
- The file exports `metadata` with a quoted `title` **followed by a comma** — the parser
  is a regex (`/title:\s*(['"])([\s\S]+?)\1\s*,/`), not a JS evaluation.
- The file exports `date` as a quoted string in `Month DD, YYYY` format.
- `new Date(date).getFullYear()` must equal the `{year}` directory, or the build fails.
- No `# H1` in the body. The title comes from `metadata`.

Nothing else needs updating: `/blog`, the sitemap and `/api/posts` all read from the
filesystem. There is no index to register the post in.

## 2. File skeleton

```mdx
export const metadata = {
  title: 'Sentence case title that leads with the thesis',
  description:
    'One or two sentences. Concrete, no marketing verbs. Used as the meta description.',
};

export const date = 'June 21, 2026';

> One-line hook that states the tension the article resolves.

Opening paragraph: the concrete failure mode a reader recognises. No "in this article
we will explore".

## 1. Section title [#section-anchor]

### Optional subsection

## Main sources [#main-sources]

- [Official documentation](https://...)
```

Conventions:
- `## N. Title [#explicit-anchor]` — H2s are numbered and carry an explicit anchor.
- `### Subtitle` — H3s are unnumbered and take no anchor.
- Close with `## Main sources [#main-sources]` linking every primary source used. This
  is what separates these posts from summary content — keep it.

## 3. Pipeline

1. **Research** — invoke the `research` skill against primary sources (official docs,
   the repo, the changelog). It leaves a cited Markdown file in the repo. Do this before
   drafting; never write from memory about a framework's behaviour.
2. **Draft** — follow the voice profile below.
3. **Humanize** — invoke the `humanizer` skill on the draft body. It flags AI tells
   against Wikipedia's "Signs of AI writing". Treat its output as *proposals*: this
   author uses some of these patterns deliberately (see below).
4. **Review** — invoke the `review` skill for technical accuracy. Every factual claim
   must trace to a link in `## Main sources`.

If a `my-writing-style` profile exists (from `setup-writing-style`), it takes precedence
over the voice notes below.

## 4. Voice profile

Observed across the four published articles:

- **First person, opinionated.** "My read is that...", "This is not an installation
  guide." The author takes a position rather than surveying options.
- **Second person for the reader.** "Your current solution? Probably a cron job."
- **Thesis in the title.** Titles state a claim ("agents as services, not conversations",
  "Stop Calling Next.js Slow"), not a topic.
- **Opens on a concrete failure**, not a definition. The definition comes in section 1.
- **Primary sources linked inline**, in the sentence making the claim.
- **Own projects as evidence** when relevant (e.g. Reprokit for the eve article).
- Prose in English; code examples runnable, not pseudocode.

## 5. Known tells to watch

The author's signature move is the **not-X-but-Y contrast** ("It is not that they cannot
reason. It is that they do not live anywhere reliable."). The eve article contains six.
This is voice, not slop — but it loses force past two or three per article. When
`humanizer` flags them, keep the strongest and rewrite the rest as direct statements.

Same treatment for one-line section closers. Also watch for:

- Em-dash density (the eve article has nine).
- Forced triads and staged run-ups.
- Bold used as decoration rather than emphasis.
- Inflated vocabulary (`crucial`, `seamless`, `leverage`, `robust`) — currently absent,
  keep it that way.
