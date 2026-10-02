# Tasks: Copiar e ler prompts

**Input**: Design documents from `/specs/002-prompt-copy-read/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md,
data-model.md, contracts/

**Tests**: No automated tests for this feature (behavior is browser-native; no new pure
logic). Verification is manual per `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Single frontend project: `src/` at repository root. Components colocated with their CSS
Modules per `docs/design-system.md` (section 6.1).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization. Already complete from feature 001 — no new setup
required. No tasks.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared clipboard hook and copy button used by both user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T001 [P] Create `useCopyToClipboard` hook using the native Clipboard API in `src/hooks/useCopyToClipboard.ts`
- [X] T002 Create `CopyButton` component (native `<button>`, polite live-region feedback, transient "copied"/error state) in `src/components/CopyButton/CopyButton.tsx` + `CopyButton.module.css` (depends on T001)

**Checkpoint**: Shared copy capability ready — user story implementation can begin.

---

## Phase 3: User Story 1 - Copy a prompt from its card (Priority: P1) 🎯 MVP

**Goal**: A copy button in the top-right corner of each card copies the complete prompt
text with visible confirmation.

**Independent Test**: Click the copy button on a card, paste into a text field, and
compare with the prompt's complete body.

### Implementation for User Story 1

- [X] T003 [US1] Add a `CopyButton` (top-right corner) to `PromptCard` in `src/components/PromptCard/PromptCard.tsx` and position it in `PromptCard.module.css` (depends on T002)

**Checkpoint**: User Story 1 fully functional and testable independently.

---

## Phase 4: User Story 2 - Read a prompt in a modal (Priority: P1)

**Goal**: A read button opens a centered floating modal showing the full prompt text,
with a copy button inside.

**Independent Test**: Click the read button, verify the modal opens centered with full
text, use the modal's copy button, and verify the clipboard content.

### Implementation for User Story 2

- [X] T004 [P] [US2] Create `PromptModal` component using the native `<dialog>` element (full prompt text + `CopyButton`, dismissible via close/backdrop/Escape) in `src/components/PromptModal/PromptModal.tsx` + `PromptModal.module.css` (depends on T002)
- [X] T005 [US2] Add a read button to `PromptCard` and wire it to open `PromptModal` in `src/components/PromptCard/PromptCard.tsx` (depends on T004)

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility and validation across both stories.

- [X] T006 Verify keyboard operability, focus management (into/out of the modal), and live-region announcements across `src/components/`
- [X] T007 Run `quickstart.md` validation scenarios end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Already complete (feature 001).
- **Foundational (Phase 2)**: Blocks all user stories.
- **User Stories (Phase 3–4)**: Depend on Foundational; proceed in priority order.
- **Polish (Phase 5)**: Depends on all user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependencies on other stories.
- **User Story 2 (P1)**: Starts after Foundational; independent of US1.

### Within Each User Story

- Foundational hook/component before integration.
- Component before wiring into `PromptCard`.

### Parallel Opportunities

- T003 (US1) and T004 (US2) can run in parallel after T002.
- T001 is independent and can run immediately.

---

## Parallel Example: After Foundational

```bash
# US1 and US2 proceed in parallel (different files):
Task: "Add CopyButton to PromptCard in src/components/PromptCard/PromptCard.tsx"
Task: "Create PromptModal in src/components/PromptModal/PromptModal.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001, T002).
2. Complete Phase 3: User Story 1 (T003).
3. **STOP and VALIDATE**: Test copy-from-card independently.
4. Deploy/demo if ready.

### Incremental Delivery

1. Foundational → shared copy capability.
2. Add User Story 1 → copy from card (MVP).
3. Add User Story 2 → read modal with copy.
4. Polish → accessibility + quickstart validation.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to a specific user story for traceability.
- Each user story is independently completable and testable.
- Commit after each task or logical group (constitution Principle VI).
- The design system (`docs/design-system.md`) is the source of truth for all styling;
  resolve any `TODO(decide)` token before using it.
