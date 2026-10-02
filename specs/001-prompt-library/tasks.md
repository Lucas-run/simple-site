# Tasks: Biblioteca pessoal de prompts de IA

**Input**: Design documents from `/specs/001-prompt-library/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Unit tests for pure logic (search, filtering, data access) are REQUIRED by the
constitution (Principle VI). No end-to-end suite.

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single frontend project: `src/` at repository root. Components colocated with their CSS
Modules per `docs/design-system.md` (section 6.1).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and global design tokens.

- [ ] T001 Configure Vite `base` path for the GitHub Pages repository name in `vite.config.ts`
- [ ] T002 Add `vitest` and `eslint-plugin-jsx-a11y` dev dependencies and wire them into `package.json`, `eslint.config.js`, and a Vitest config (justified in plan.md)
- [X] T003 [P] Create global CSS files in `src/styles/` per `docs/design-system.md` section 2.2: `tokens.css`, `reset.css`, `base.css`, `themes.css`, `global.css` (import order: fonts → reset → tokens → themes → base)
- [X] T004 Update `src/main.tsx` to import `src/styles/global.css` and remove the starter `src/index.css` import

**Checkpoint**: Tooling and global styles ready; app still builds.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Data access and pure search/filter logic that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Verify and finalize the data-access module `src/data/promptRepository.ts` (exports `getPrompts`, `getPromptById`, `getTags`; parses frontmatter via `gray-matter`)
- [ ] T006 [P] Implement pure search/filter logic in `src/lib/search.ts` (case- and accent-insensitive substring over title+body; tag filter "match any selected tag"; combined search+tag AND)
- [ ] T007 [P] Add unit tests for search/filter logic in `src/lib/search.test.ts`
- [ ] T008 [P] Add unit tests for data access in `src/data/promptRepository.test.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Browse the prompt catalog (Priority: P1) 🎯 MVP

**Goal**: Render every saved prompt as a card showing title, category, tags, and a
160-character preview (ellipsis when truncated).

**Independent Test**: Open the page with saved prompts and verify each appears as a card
with title, category, tags, and preview.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create `Layout` components (`Header`, `Footer`, `Container`, `SkipLink`) in `src/components/Layout/`
- [X] T010 [P] [US1] Create `PromptCard` component with `PromptCard.tsx` + `PromptCard.module.css` in `src/components/PromptCard/`
- [X] T011 [US1] Replace `src/App.tsx` to render the catalog grid from `getPrompts()` using `PromptCard` and `Layout` (remove starter `App.css`)

**Checkpoint**: User Story 1 fully functional and testable independently.

---

## Phase 4: User Story 2 - Find prompts by search and tags (Priority: P1)

**Goal**: Search by keyword (title/body, accent- and case-insensitive) and filter by one
or more tags; show a no-results message with a clear-all control when nothing matches.

**Independent Test**: Search known terms, select multiple tags, and verify results obey
the matching rules; verify the no-results state and clear-all control.

### Implementation for User Story 2

- [ ] T012 [P] [US2] Create `SearchInput` component (native `<input type="search">` with visible label) in `src/components/SearchInput/`
- [ ] T013 [P] [US2] Create `TagFilter` component (native buttons with `aria-pressed`) in `src/components/TagFilter/`
- [ ] T014 [P] [US2] Create `ResultSummary` component (`role="status"` live region) in `src/components/ResultSummary/`
- [ ] T015 [P] [US2] Create `EmptyState` component (no-results message + clear-all control) in `src/components/EmptyState/`
- [ ] T016 [US2] Wire search + tag filter state in `src/App.tsx` using `src/lib/search.ts` and `getTags()`

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Copy a complete prompt (Priority: P1)

**Goal**: Copy the complete prompt body (preserving Markdown and line breaks, excluding
frontmatter) with visible + announced confirmation; graceful failure with manual copy.

**Independent Test**: Activate copy, paste into a text field, and compare with the
prompt's complete body; verify confirmation and failure handling.

### Implementation for User Story 3

- [ ] T017 [P] [US3] Create `useCopyToClipboard` hook using the native Clipboard API in `src/hooks/useCopyToClipboard.ts`
- [ ] T018 [P] [US3] Create `CopyButton` component with polite live-region announcement in `src/components/CopyButton/`
- [ ] T019 [US3] Integrate `CopyButton` into `PromptCard` to copy the full body (excluding frontmatter)

**Checkpoint**: All user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, performance, and design-system compliance across all stories.

- [ ] T020 Run `eslint-plugin-jsx-a11y` lint and fix violations across `src/`
- [ ] T021 Run automated axe checks and a manual keyboard pass; fix any WCAG 2.2 AA issues
- [ ] T022 Verify Lighthouse performance score ≥ 90 on the production build
- [ ] T023 Verify design-system compliance: tokens only (no hardcoded colors/spacing/durations), `prefers-reduced-motion` respected, contrast matrix passes
- [ ] T024 Run `quickstart.md` validation scenarios end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Stories (Phase 3–5)**: Depend on Foundational; proceed in priority order (US1 → US2 → US3).
- **Polish (Phase 6)**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependencies on other stories.
- **User Story 2 (P1)**: Starts after Foundational; depends on US1's `App.tsx` grid (T011) for wiring.
- **User Story 3 (P1)**: Starts after Foundational; depends on US1's `PromptCard` (T010) for integration.

### Within Each User Story

- Foundational logic before UI wiring.
- Components before integration into `App.tsx`.
- Story complete before moving to the next priority.

### Parallel Opportunities

- T003, T004 (setup) can run in parallel with T002.
- T006, T007, T008 (foundational) can run in parallel.
- T009, T010 (US1 components) can run in parallel.
- T012–T015 (US2 components) can run in parallel.
- T017, T018 (US3 hook + component) can run in parallel.

---

## Parallel Example: User Story 2

```bash
# Launch all US2 components together (different files):
Task: "Create SearchInput component in src/components/SearchInput/"
Task: "Create TagFilter component in src/components/TagFilter/"
Task: "Create ResultSummary component in src/components/ResultSummary/"
Task: "Create EmptyState component in src/components/EmptyState/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test User Story 1 independently.
5. Deploy/demo if ready.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. Add User Story 1 → test independently → deploy/demo (MVP).
3. Add User Story 2 → test independently → deploy/demo.
4. Add User Story 3 → test independently → deploy/demo.
5. Polish → accessibility + performance verification.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. Once Foundational is done, stories proceed in priority order (US1 → US2 → US3),
   with component tasks within each story parallelized.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to a specific user story for traceability.
- Each user story is independently completable and testable.
- Commit after each task or logical group (constitution Principle VI).
- Stop at any checkpoint to validate a story independently.
- The design system (`docs/design-system.md`) is the source of truth for all styling;
  resolve any `TODO(decide)` token before using it.
