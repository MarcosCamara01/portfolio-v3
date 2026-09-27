---
version: b4
name: Marcos Cámara
description: Personal engineering site and MDX blog. "B4 Heavy Type" — brutalist, one narrow column, condensed uppercase display type, warm off-white or near-black ground, one red signal. Light is the default token set; dark values live in Themes.
colors:
  ink: '#111111'
  sub: '#454545'
  signal: '#D42A14'
  on-signal: '#FFFFFF'
  page: '#F2F2F0'
  surface: '#FFFFFF'
  soft: '#C9C9C4'
  inv: '#111111'
  inv-ink: '#F2F2F0'
  inv-signal: '#FF6A55'
  code: '#111111'
  code-ink: '#F2F2F0'
typography:
  display:
    fontFamily: Archivo (variable, wdth 62)
    fontWeight: 900
    textTransform: uppercase
    sizes: 'hero clamp(64px, 24.6vw, 168px) · page title 132/84 · article title 80/50 · h2 48/36 · article h2 40/30'
    lineHeight: '0.91 hero desktop, 0.93 hero mobile (lowest that keeps the Á accent off the line above)'
  body:
    fontFamily: Work Sans
    fontSize: '18px article, 15–16px UI'
    lineHeight: 1.7
  label:
    fontFamily: Work Sans
    fontSize: 13px
    fontWeight: 700
    textTransform: uppercase
    letterSpacing: 0.04em
  code:
    fontFamily: IBM Plex Mono
    fontSize: '13px / 12px mobile'
rounded:
  all: 0
spacing:
  column: 672px (max-w 704px with 16px gutters)
  section: '112px desktop / 80px mobile between sections'
  row: '16px vertical padding, 1px soft line between rows'
---

## Overview

Marcos Cámara is a full-stack developer writing about Next.js, agents and multi-model systems. The site is a brutalist index: huge condensed uppercase type, a single red signal, and nothing decorative that type and space can do instead. Recruiters scan the home; engineers read long MDX essays.

The canvas this was designed on is the "Marcos Cámara — B4 Heavy Type" design artifact (home, blog, article and system, light and dark, desktop and mobile).

## Colors

Ink and a warm off-white carry everything. Red (`signal`) marks: the dot after the name, section numbers, list markers, the star badge, the tag chip, link underlines and the reading progress bar. Never large fields.

Inverted blocks (`inv` / `inv-ink`) are the one heavy surface: the latest-post block, the primary button, the active filter chip and article pull quotes. Inside them the signal switches to `inv-signal` so it keeps contrast.

`surface` is a quiet fill for the article's "On this page" box, inline code and the more-posts nav. Projects sit on the page ground, not on a card.

## Themes

System light/dark, toggled by one button. The new theme opens as a circle from the toggle (View Transitions API). Dark is not an inversion: the red lifts and inverted blocks become light.

| Token              | Dark                  |
| ------------------ | --------------------- |
| page               | `#0E0E0D`             |
| ink                | `#F2F2F0`             |
| sub                | `#B4B4AE`             |
| soft               | `#3A3A37`             |
| surface            | `#1A1A18`             |
| inv / inv-ink      | `#F2F2F0` / `#111111` |
| signal / on-signal | `#FF5A40` / `#111111` |
| inv-signal         | `#C0260F`             |
| code / code-ink    | `#1A1A18` / `#F2F2F0` |

White on `signal` is about 5:1; keep body text at least 4.5:1 in both modes.

## Typography

- Display: Archivo at `wdth 62`, weight 900, uppercase. The width axis is part of the motion (below), so keep Archivo variable.
- Body and UI: Work Sans. Labels are 13px bold uppercase with 0.04em tracking.
- Code: IBM Plex Mono.
- Hero line-height is fixed by measurement: at 0.86 the Á accent overlaps "MARCOS"; 0.91 (desktop) and 0.93 (mobile) are the tightest values without contact.

## Layout

One centered 672px column, 16px gutters on mobile. No sidebars, no full-bleed.

- Home: header (MPC · Blog · theme) → name + two-line intro → Work (year / role / one line) → Projects (Ecommerce Template: screenshot, ★ live stars, stack, Live demo + Source code) → Writing (latest block + three rows + All posts) → footer (© + GitHub, LinkedIn, X).
- Blog: "WRITING." → intro with post count → topic chips → latest post block with dek → posts grouped by year with dek, tag and reading time.
- Article: back link → date · minutes · tag → title → dek → "On this page" (from `## N. Title [#id]` headings) → body → author → All writing / previous post.

Sections are separated by space, not rules. The only lines are 1px `soft` rows. No header or footer rule, no borders on cards, tags or code.

## Components

- Section title: display 48/36, squeezes in on scroll.
- Row: date column + title (+ dek, tag, minutes on /blog). Hover or press wipes an ink block across it.
- Latest block: inverted, label in `inv-signal`, display title that widens on hover.
- Buttons: primary is an inverted block; secondary is text with an icon. Icons are 2.5px square-cap strokes; GitHub uses its mark.
- Article body: numbered H2s with the number in red; H3s smaller display; lists with 01/02 or ■ markers on soft rows; the first blockquote is a lede, later ones are inverted pull quotes; code blocks show language + Copy.

## Motion

One big moment, then quiet craft. Everything works with a finger as well as a mouse, and collapses under `prefers-reduced-motion`.

- Hero (the big moment): letters rise one by one out of line masks (tall enough for the Á accent), the red dot lands last with a small squash. Afterwards the letter nearest the pointer widens on Archivo's `wdth` axis and its neighbours follow; on touch, dragging a finger across the name does the same. `SplitTitle` is reused for "WRITING." on /blog.
- Home and /blog section headings: a red block wipes across and uncovers the title, once, when it enters the viewport (`RevealObserver` sets `data-inview`). Lists under them stagger in. Anything already on screen at load runs the same entrance from CSS on the load sequence (no JS, no flash); the hero title is never hidden, so LCP is unaffected.
- Articles have no scroll entrances: the text is for reading. Only the reading-progress bar moves.
- Project screenshot: curtain reveal when it enters; on hover it pans down slowly.
- Rows: a 2px red line draws underneath, the title shifts 6px and an arrow arrives. Latest block: a red bar grows along its foot.
- Primary button: red floods up from the bottom; secondary: underline draws under the label.
- Links: the red underline leaves to the right and returns from the left.
- Star badge counts up the first time it is seen. Theme toggle: soft cross-fade via the View Transitions API. Blog chips: the active block slides between chips. Article: reading-progress bar tied to scroll.

### Timing

One scale for the whole site (defined at the top of the motion rules in `globals.css`):

- Press 120ms. Hover exit 250ms, hover entry 350ms (lines, arrows, fills); bigger surfaces 450–700ms. Touch feedback 200ms, so it lands while the finger is down.
- Entrances 600–800ms; wipes and curtains 800–1000ms. `ease-out-expo` for things that arrive or follow the pointer, an ease-in-out for wipes that cover and uncover.
- Staggers: 35ms per letter, 60ms per list item.
- Load sequence: letters from 0ms → intro text 450ms → dot ~720ms → on-screen section titles 750ms (text shows at ~1130ms) → on-screen lists 1100ms.
- Scroll reveal: the title's text shows when the block fully covers it (384ms into 800ms); its list starts at 250ms.

Without JS, below-the-fold content is never hidden, and on-screen entrances end on their own.

## Delivery

Posts remain `src/app/(posts)/{year}/{slug}/page.mdx`. Each post may export `tag` for the blog filter; `metadata.description` is used as the dek. Do not install Spec Kit.
