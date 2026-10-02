# Implementation Plan: Copiar e ler prompts

**Branch**: `002-prompt-copy-read` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-prompt-copy-read/spec.md`

## Summary

Add two actions to each prompt card: a copy button in the top-right corner that copies
the complete prompt text to the clipboard, and a read button that opens a centered,
floating modal showing the full prompt text (with its own copy button). Both use
platform features — the native Clipboard API and the native `<dialog>` element — so no
new dependencies are introduced.

## Technical Context

**Language/Version**: TypeScript 6.0 (strict mode), React 19

**Primary Dependencies**: React 19, Vite 8. No new dependencies; clipboard uses the
native Clipboard API and the modal uses the native `<dialog>` element.

**Storage**: N/A — reuses the existing prompt catalog (`src/data/promptRepository.ts`).

**Testing**: N/A for this feature (no new pure logic; behavior is browser-native).
Manual verification per `quickstart.md`.

**Target Platform**: Web — static site deployed to GitHub Pages.

**Project Type**: Web application (static single-page app).

**Performance Goals**: Modal opens and shows full text within 1 second; no measurable
regression to the existing Lighthouse ≥ 90 target.

**Constraints**: WCAG 2.2 Level AA; CSS Modules only; design tokens only;
`prefers-reduced-motion` respected.

**Scale/Scope**: Two new components (`CopyButton`, `PromptModal`) plus integration into
the existing `PromptCard`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity and Static-First | PASS | No backend/DB/auth; no speculative abstraction. |
| II. Fixed Stack and Dependency Discipline | PASS | React + Vite + TS strict + CSS Modules. No new dependencies — native Clipboard API and `<dialog>`. |
| III. Data Access Isolation | PASS | Components read via `promptRepository.ts`; no direct file access. |
| IV. Design System as Source of Truth | PASS | New components use CSS Modules referencing tokens. |
| V. Accessibility and Performance Baseline | PASS | `<dialog>` provides focus trap + Escape; live region for copy feedback; keyboard operable. |
| VI. Spec-Driven Workflow | PASS | This plan + task list precede code. |

No violations. No new dependencies to justify.

## Project Structure

### Documentation (this feature)

```text
specs/002-prompt-copy-read/
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
│   │   ├── PromptCard.tsx          # add copy + read buttons
│   │   └── PromptCard.module.css
│   ├── CopyButton/
│   │   ├── CopyButton.tsx
│   │   └── CopyButton.module.css
│   └── PromptModal/
│       ├── PromptModal.tsx
│       └── PromptModal.module.css
├── hooks/
│   └── useCopyToClipboard.ts       # native Clipboard API wrapper
└── ...
```

**Structure Decision**: Extend the existing single frontend project. Two new colocated
components (`CopyButton`, `PromptModal`) and one hook (`useCopyToClipboard`), integrated
into the existing `PromptCard`.

## Complexity Tracking

No constitution violations. This section is intentionally empty.
