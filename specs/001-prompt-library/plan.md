# Implementation Plan: Biblioteca pessoal de prompts de IA

**Branch**: `001-prompt-library` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-prompt-library/spec.md`

## Summary

Build a static, single-page prompt library that renders saved prompts as cards (title,
category, tags, preview), supports case- and accent-insensitive search over title and
body, multi-tag filtering ("match any selected tag"), and a copy action that copies the
complete prompt body (preserving Markdown and line breaks, excluding frontmatter) with
visible + announced confirmation. No backend, database, or authentication. The catalog
is maintained as versioned Markdown files with frontmatter, read through a single
data-access module.

## Technical Context

**Language/Version**: TypeScript 6.0 (strict mode), React 19

**Primary Dependencies**: React 19, Vite 8, `gray-matter` (frontmatter parsing, already
present). New dev dependencies to be justified in the plan: `vitest` (unit tests for
pure logic), `eslint-plugin-jsx-a11y` (constitution-mandated a11y lint).

**Storage**: Markdown files with YAML frontmatter under `src/data/prompts/`, loaded
statically via `import.meta.glob` (no runtime fetch, no backend).

**Testing**: Vitest for pure logic (search, filtering, data access). No end-to-end suite
(per constitution).

**Target Platform**: Web — static site deployed to GitHub Pages.

**Project Type**: Web application (static single-page app).

**Performance Goals**: Lighthouse performance score ≥ 90 on the production build;
search/filter results update within 1 second for a catalog of up to 1,000 prompts.

**Constraints**: WCAG 2.2 Level AA; CSS Modules only (no Tailwind/CSS-in-JS/UI libs);
all visual values from design tokens; `prefers-reduced-motion` respected; mobile-first.

**Scale/Scope**: Single page; ~1,000 prompts; one owner, no accounts.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity and Static-First | PASS | Static site, no backend/DB/auth; prompts as versioned Markdown with frontmatter. |
| II. Fixed Stack and Dependency Discipline | PASS | React + Vite + TS strict + CSS Modules. New deps (`vitest`, `eslint-plugin-jsx-a11y`) justified below. |
| III. Data Access Isolation | PASS | Components read via `src/data/promptRepository.ts` only (`getPrompts`, `getPromptById`, `getTags`). |
| IV. Design System as Source of Truth | PASS | `docs/design-system.md` governs tokens, layout, motion; CSS Modules reference tokens. |
| V. Accessibility and Performance Baseline | PASS | WCAG 2.2 AA, keyboard, live region, contrast, Lighthouse ≥ 90. |
| VI. Spec-Driven Workflow | PASS | This plan + task list precede code; unit tests for pure logic. |

**Dependency justifications (Principle II):**

- `vitest`: required to satisfy Principle VI ("unit tests for pure logic — search,
  filtering, data access"). It is the standard test runner for Vite projects and shares
  the existing Vite/ESM toolchain. No lighter alternative meets the testing requirement.
- `eslint-plugin-jsx-a11y`: explicitly required by Principle V ("Accessibility MUST be
  verified with eslint-plugin-jsx-a11y"). It is a dev-only lint plugin, not a runtime
  dependency.

No other dependencies are introduced. Clipboard copy uses the native Clipboard API
(platform feature, per Principle II).

## Project Structure

### Documentation (this feature)

```text
specs/001-prompt-library/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── PromptCard/
│   │   ├── PromptCard.tsx
│   │   ├── PromptCard.module.css
│   │   └── index.ts
│   ├── SearchInput/
│   ├── TagFilter/
│   ├── CopyButton/
│   ├── ResultSummary/
│   ├── EmptyState/
│   └── Layout/
├── data/
│   ├── promptRepository.ts   # single data-access module (already present)
│   └── prompts/*.md          # prompt data files (already present)
├── hooks/
│   └── useCopyToClipboard.ts
├── lib/
│   └── search.ts             # pure search/filter logic (unit-tested)
├── styles/                   # global CSS: tokens, reset, base, themes
├── App.tsx
└── main.tsx
```

**Structure Decision**: Single frontend project (Option 2 "web application" frontend
half). No backend. Components colocated with their CSS Modules per the design system
(section 6.1). Pure search/filter logic isolated in `src/lib/` for unit testing.

## Complexity Tracking

No constitution violations. This section is intentionally empty.
