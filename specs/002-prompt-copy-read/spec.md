# Feature Specification: Copiar e ler prompts

**Feature Branch**: `002-prompt-copy-read`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "Create a copy button—positioned in the top-right corner of each card—that copies the entire prompt text to the clipboard when clicked. Also, create a read button that, when clicked, opens a centered, floating modal displaying the full prompt text; the copy button must also be included within the modal."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Copy a prompt from its card (Priority: P1)

The user copies the complete prompt text directly from a card using a copy button in
the card's top-right corner.

**Why this priority**: Copying is the primary action that makes a saved prompt usable
in other tools, and it must be reachable without opening the prompt.

**Independent Test**: Click the copy button on a card, paste into a text field, and
compare the pasted text with the prompt's complete body.

**Acceptance Scenarios**:

1. **Given** a prompt card is shown, **When** the user clicks its copy button,
   **Then** the complete prompt text is copied to the clipboard and a visible
   confirmation is shown.
2. **Given** the copy button is clicked, **When** the clipboard is pasted elsewhere,
   **Then** the pasted text exactly matches the prompt's full text.

---

### User Story 2 - Read a prompt in a modal (Priority: P1)

The user opens a centered, floating modal that displays the full prompt text, and can
copy the prompt from within the modal.

**Why this priority**: The modal lets the user read the complete prompt without
truncation and still copy it, complementing the card-level copy action.

**Independent Test**: Click the read button on a card, verify the modal opens centered
with the full text, then use the modal's copy button and verify the clipboard content.

**Acceptance Scenarios**:

1. **Given** a prompt card is shown, **When** the user clicks its read button,
   **Then** a centered floating modal opens showing the full prompt text.
2. **Given** the modal is open, **When** the user clicks the copy button inside it,
   **Then** the complete prompt text is copied and a visible confirmation is shown.
3. **Given** the modal is open, **When** the user dismisses it, **Then** the modal
   closes and the underlying catalog is visible again.

### Edge Cases

- When copying is unavailable or denied, show an understandable error and keep the
  prompt text accessible for manual copying.
- When the modal is open, the rest of the page must not be interactive behind it, and
  keyboard focus must move into the modal and return to the trigger when closed.
- When the user presses the Escape key while the modal is open, the modal closes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each prompt card MUST show a copy button in its top-right corner.
- **FR-002**: Clicking a card's copy button MUST copy the complete prompt text to the
  clipboard and show visible confirmation.
- **FR-003**: Each prompt card MUST show a read button.
- **FR-004**: Clicking a card's read button MUST open a centered, floating modal that
  displays the full prompt text.
- **FR-005**: The modal MUST include a copy button that copies the complete prompt text
  and shows visible confirmation.
- **FR-006**: The modal MUST be dismissible (e.g., a close control, clicking the
  backdrop, or the Escape key).
- **FR-007**: Copy confirmation and any copy failure MUST be announced to assistive
  technology.
- **FR-008**: The copy and read buttons MUST be keyboard operable and have accessible
  names.

### Key Entities *(include if feature involves data)*

- **Prompt**: The saved item whose complete text is the subject of copy and read
  actions. Reused from the existing catalog; this feature adds no new data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In all successful copy tests, the clipboard content exactly matches the
  selected prompt's complete text.
- **SC-002**: The read modal opens and displays the full prompt text within 1 second of
  the read button being clicked.
- **SC-003**: 100% of prompt cards expose both a copy button and a read button.
- **SC-004**: All copy and read actions can be completed using only a keyboard, and the
  feature passes WCAG 2.2 Level AA review.

## Assumptions

- The complete prompt text is the prompt body, excluding catalog metadata (title,
  category, tags, dates).
- The modal is a single reusable component used for every prompt.
- The feature builds on the existing prompt catalog and card layout; it does not change
  search, filtering, or data access.
- The interface language is Portuguese, consistent with the existing catalog.
