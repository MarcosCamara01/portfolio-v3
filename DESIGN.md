---
version: alpha
name: Marcos Cámara
description: Personal engineering site and MDX blog. Cool stone field, harbour-orange accent, Bricolage Grotesque display with Inter body. Light is the default token set; dark values live in Themes.
colors:
  primary: "#141820"
  secondary: "#5A6270"
  tertiary: "#E24A12"
  neutral: "#F4F6F8"
  surface: "#FFFFFF"
  on-surface: "#141820"
  border: "#D5DAE2"
  error: "#B42318"
typography:
  display:
    fontFamily: Bricolage Grotesque
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.03em
  headline:
    fontFamily: Bricolage Grotesque
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  title:
    fontFamily: Bricolage Grotesque
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: Azeret Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.01em
rounded:
  sm: 4px
  md: 8px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 24px
  page: 42rem
components:
  header:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
  hairline:
    backgroundColor: "{colors.border}"
    height: 1px
  featured-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 24px
  featured-card-hover:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
  signal:
    backgroundColor: "{colors.tertiary}"
    height: 2px
  error-text:
    textColor: "{colors.error}"
---

## Overview

Marcos Cámara is a San Sebastián engineer writing about TypeScript, React, Next.js, and AI systems. Recruiters and other engineers scan the home, then read long MDX essays. The site should feel like a harbour workshop: cool stone, one hot signal colour, display type that carries the page. It is not a SaaS marketing kit and not a teal-on-charcoal developer template.

## Colors

Cool stone and near-black ink do the reading. Harbour orange (`tertiary`) is the only saturated signal: links, the active theme control, a thin rule, a card edge. Never paint large fields with it. Do not reuse the previous muted teal `#76abae` or charcoal `#222831`.

- **Primary (`#141820`):** Ink for display type and body.
- **Secondary (`#5A6270`):** Dates and captions.
- **Tertiary (`#E24A12`):** Harbour orange. Rules, underlines, a card edge. Never body or title fill (fails 4.5:1 on the page ground).
- **Neutral (`#F4F6F8`):** Page ground in light.
- **Surface (`#FFFFFF`):** Featured writing cards.
- **Border (`#D5DAE2`):** Hairlines, not drop shadows.

## Themes

System light/dark stays. Tokens above are light. Dark:

| Token | Dark |
| --- | --- |
| primary | `#ECEEF2` |
| secondary | `#9AA3B2` |
| tertiary | `#FF7A45` |
| neutral | `#0E1116` |
| surface | `#181C24` |
| on-surface | `#ECEEF2` |
| border | `#2A3140` |
| error | `#FF6B5A` |

Keep body contrast at least 4.5:1 on the page ground in both modes.

## Typography

Inter stays for body and UI chrome. Display and section titles use Bricolage Grotesque so headlines are not Inter-at-a-larger-size. Azeret Mono is only for dates and code-adjacent meta. `text-wrap: balance` on titles; `text-pretty` on body. Display letter-spacing never tighter than `-0.04em`.

## Layout

Keep the site on a centered `42rem` (`max-w-2xl`) column. Home and blog do not go full-bleed. Content is left-aligned. Vertical rhythm uses the 8px spacing scale; sections separate with `xl` (64px), not icon-in-a-square headers.

Home, top to bottom: identity (name in display + one sentence) → experience as a timeline → three featured writing cards → two or three projects in a mixed-height bento that still fits the column.

Blog: three typographic featured cards stacked in the column (Vercel’s three-up grid does not fit `42rem`), then the remaining posts as a compact text list. No per-post photography.

Article pages stay in the same column. The post title is display type; the body is Inter.

## Elevation & Depth

Flat. Hierarchy comes from type size, orange hairlines, and surface against neutral. No grey `rgba(0,0,0,.1)` card shadows. Ambient motion may add a light 3D tilt on featured cards; it must not replace contrast.

## Shapes

Small radii: `sm` on controls, `md` on featured cards. Do not keep the current sticky header’s large rounded-bottom chrome. Theme toggle and icon buttons may use `full`.

## Components

- **Header:** Name or mark left, Blog + theme toggle right. Transparent over the page ground; a 1px bottom hairline on scroll is enough.
- **Featured writing card:** Date in caption mono; title in `title` or `headline`; one-line dek in body. Hover may shift the surface token and a 1px tertiary edge. Three on `/blog` and three on home Writing.
- **Experience:** Year + role + company as a left-aligned timeline. No icon tiles.
- **Projects:** Two or three tiles of unequal height in one column (or a 2-up row only if both titles still wrap cleanly). Live demos allowed; empty bento cells are not.
- **Footer:** Text links, not a row of unlabeled brand icons as the only affordance.

## Do's and Don'ts

- Do spend ambient motion on one orchestrated moment (home display type and featured-card tilt). Respect `prefers-reduced-motion` by cutting 3D and scroll-linked motion.
- Don't fade-and-slide every section on enter.
- Do leave Inter as body; don't set Inter on display headings.
- Don't introduce a second accent, purple meshes, or cream+terracotta defaults.
- Don't widen past `42rem` to imitate a magazine spread.
- Don't require unique illustrations or OG art to ship the listing.

## Delivery

Implement in this order, as separate PRs: (1) tokens and chrome, (2) home, (3) `/blog`, (4) article pages, (5) motion and polish.

Posts remain `src/app/(posts)/{year}/{slug}/page.mdx`. Do not migrate them to a database. Do not install Spec Kit.

View counters are already gone. Redis is only for optional tweet caching.
