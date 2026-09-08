---
name: review
description: Review code, specs, or diffs in read-only mode with a strict bug-and-risk-first mindset. Use when the developer asks for a review, wants a final audit after a spec, requests "Linus Torvalds mode", or needs a post-implementation sanity check without editing files.
argument-hint: "[feature-name or scope]"
allowed-tools: Read, Glob, Grep, Bash, Agent
---

# Review Mode

Read-only review mode. Audit code, specs, and diffs looking for bugs, regressions, risky assumptions, workflow violations, and missing tests without modifying files.

## Required Context

Read these **only if they exist** in the current repo. They come from a protocol set
used in some of the author's other projects and are absent here:
- `ai-protocols/conventions.md`
- `ai-protocols/workflow.md`
- the matching file in `ai-protocols/domains/` when the review targets one domain
- `.context/schemas/db-schema.tsv` for DB structure changes

If none exist, derive the conventions from `CLAUDE.md`, the surrounding code and the
project's own skills in `.agents/skills/` instead. Do not report their absence as a finding.

If the review targets a specific spec issue, also read `gh issue view $ARGUMENTS --comments`.

If no argument is provided, default to reviewing the current uncommitted diff / working tree state.

## Rules

1. **Never edit, create, or delete files.** This mode is review-only.
2. **Use shell only for non-mutating inspection.** Allowed examples: `git status`, `git diff`, `git diff --name-only`, `git diff --stat`. Do not run DB commands, migrations, or other mutating scripts.
3. **Prioritize findings over summaries.** Focus on bugs, behavioral regressions, unsafe assumptions, missing validation, DB workflow violations, and missing tests before style or refactor suggestions.
   - **Duplication is a substantive finding, not style.** New code that re-implements a capability the repo already has (helper, hook, component, schema, constant) gets reported with the path of the existing implementation. Same for swallowed errors, floating promises, `any`/reflex casts, and optional-field bags where a discriminated union belongs — per `conventions.md` -> Search Before You Write, Error Handling And Async Discipline, Types And Value Modeling.
   - Comment and naming hygiene violations are findings, not style: redundant comments, changelog comments, spec/plan/task references in code, and history-based names (`V2`, `Enhanced`, `fixed*`) — per `conventions.md` -> Code Comments and Code Structure And Modularity. Report them at low severity after the substantive findings; never drop them.
4. **Report findings first, ordered by severity.** Include concrete file paths and line numbers whenever possible.
5. **If no findings are discovered, say that explicitly.** Then mention residual risks, blind spots, or missing validation if any remain.
6. **For completed specs, review both process and implementation.** Check that the code matches the Spec issue, that approval preceded code, that every changed path is covered by `Paths:`, that DB human checkpoints were respected, and that every acceptance criterion has evidence.
7. **Stay in Linus Torvalds mode on substance, not on manners.** Be direct and technically strict, but keep claims factual and specific.
8. **If the user actually wants code changes instead of a review, redirect them to the right command.**
   - Simple fix -> `bugfix`
   - Work that reshapes something -> `to-spec` (use `grill-me` first when decisions are unresolved)
   - Approved or ungoverned Spec ready to execute -> `implement`

## Default Scope Resolution

1. If `$ARGUMENTS` is a spec issue number, review that spec plus its implementation.
2. If `$ARGUMENTS` looks like a file path or feature area, review that explicit scope.
3. If `$ARGUMENTS` is empty, review the current working tree diff with non-mutating git inspection commands.

## Acceleration (capability-aware, optional)

A single-pass review is complete on any runtime. For a non-trivial scope this is a good dynamic-workflow fit. On Claude Code, ask Claude to "create a workflow" (or let `ultracode` trigger one) that splits the review into independent read-only **lenses** running concurrently, then merges — without changing the outcome:

- One lens each: (1) correctness / races, (2) domain-invariant violations, (3) DB-workflow violations, (4) i18n + Tailwind installed-version compliance, (5) test-coverage gaps, (6) React UI health — run `npx react-doctor@latest` (deterministic read-only auditor) on UI changes, treating canvas/store/manager hot-path findings as advisory, (7) reuse & hygiene — new code that duplicates an existing repo capability, error/async/type discipline, comment and naming hygiene.
- Every lens is **strictly read-only** (Read / Glob / Grep + non-mutating git). No lens edits files — this skill never edits.
- **Adversarial verify** each Critical/High finding (a second agent tries to refute it) before it lands in the report — kill plausible-but-wrong findings early.
- The lead dedups findings by `file:line:category` and emits the single severity-ordered report. Overlap between lenses is expected; rigorous dedup is mandatory or the report inflates.

For a small diff, or with no parallel capability, do a single linear pass — identical result.
