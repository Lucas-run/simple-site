# Feature Specification: Biblioteca pessoal de prompts de IA

**Feature Branch**: `001-prompt-library`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Uma biblioteca pessoal de prompts de IA apresenta os prompts em cartões, permite busca por título ou texto, filtros por várias tags, cópia do prompt completo com confirmação e uma mensagem com opção para limpar filtros quando não há resultados. Não há cadastro nem login."

## Clarifications

### Session 2026-10-02

- Q: Ao copiar um prompt, o texto deve preservar os símbolos de Markdown presentes no corpo, como `##` e `*`? → A: Copiar o corpo original, preservando Markdown e quebras de linha, sem frontmatter.
- Q: Uma busca sem acentos, como `mao`, deve encontrar textos com acentos, como `mão`? → A: Ignorar acentos e maiúsculas/minúsculas: `mao` encontra `mão`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the prompt catalog (Priority: P1)

The personal catalog user opens the page and browses saved prompts as cards, seeing
each prompt's title, category, tags, and a preview of its text.

**Why this priority**: The catalog is the primary way to find and choose a saved prompt.

**Independent Test**: Open the catalog with several saved prompts and verify that each
is represented by a card with its required information.

**Acceptance Scenarios**:

1. **Given** the catalog contains saved prompts, **When** the user opens the page,
   **Then** all prompts are shown as cards with a title, category, tags, and text preview.
2. **Given** a prompt's text is longer than the preview limit, **When** its card is
   shown, **Then** the preview is shortened and the complete prompt remains available
   to copy.

---

### User Story 2 - Find prompts by search and tags (Priority: P1)

The user searches for a word or phrase appearing in a prompt title or body, and can
combine that search with one or more tag filters to narrow the catalog.

**Why this priority**: Search and filtering let the user quickly find a prompt as the
personal catalog grows.

**Independent Test**: Search for known title and body terms, select multiple tags, and
verify that the result set obeys the documented matching rules.

**Acceptance Scenarios**:

1. **Given** prompts have searchable titles and bodies, **When** the user enters a
   keyword, **Then** prompts containing it in either field are shown, ignoring letter
   case and accents.
2. **Given** the user selects multiple tags, **When** the filter is applied,
   **Then** prompts matching at least one selected tag are shown.
3. **Given** a search term and tags are selected, **When** results are calculated,
   **Then** a prompt must match the search and at least one selected tag to be shown.
4. **Given** the active search and tag filters match no prompts, **When** results are
   displayed, **Then** the user sees a no-results message and a control that clears the
   search and all selected tags.
5. **Given** the user activates the clear control, **When** the catalog refreshes,
   **Then** the search and all selected tags are cleared and the full catalog is shown.

---

### User Story 3 - Copy a complete prompt (Priority: P1)

The user copies a selected prompt's complete text and receives confirmation that the
copy succeeded.

**Why this priority**: Copying is the key action that makes saved prompts useful in
other tools and workflows.

**Independent Test**: Activate copy for a prompt, paste into a text field, and compare
the pasted text with the prompt's complete body.

**Acceptance Scenarios**:

1. **Given** a prompt card is shown, **When** the user activates its copy control,
   **Then** the original complete prompt body, preserving Markdown symbols and line
   breaks but excluding frontmatter, is copied and a visible confirmation is announced.
2. **Given** the browser cannot complete a copy operation, **When** the user activates
   copy, **Then** the user receives a clear failure message and can select and copy the
   complete prompt body manually.

### Edge Cases

- When the catalog contains no prompts, show an empty-catalog message instead of an
  empty result set; do not offer filter-clearing controls unless a filter is active.
- When a search or tag combination returns no prompts, provide the no-results message
  and clear-all control described in User Story 2.
- When a prompt body is shorter than the preview limit, show the complete body as its
  preview without adding an ellipsis.
- When copying is unavailable or denied, retain the prompt text and provide an
  understandable error message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The catalog MUST show every saved prompt as a card.
- **FR-002**: Each prompt card MUST show the prompt title, category, all associated
  tags, and a preview of the prompt body.
- **FR-003**: A prompt preview MUST show up to the first 160 characters of its body;
  when more text remains, the preview MUST end with an ellipsis.
- **FR-004**: The user MUST be able to search prompt titles and bodies by a
  case-insensitive and accent-insensitive substring.
- **FR-005**: The user MUST be able to select multiple tags as filters. A prompt MUST
  match at least one selected tag to pass the tag filter.
- **FR-006**: When search and tag filters are both active, a prompt MUST match both
  the search and the tag filter to appear in results.
- **FR-007**: When no prompts match the active search and tag filters, the catalog
  MUST show a no-results message and a control to clear the search and all selected
  tags.
- **FR-008**: Clearing filters MUST remove the current search and all selected tags
  and show the unfiltered catalog.
- **FR-009**: Each prompt MUST have a copy action that copies its complete body,
  preserving the original Markdown symbols and line breaks, excluding frontmatter and
  catalog metadata, and providing visible success feedback.
- **FR-010**: Copy feedback MUST be announced to assistive technology. When copying
  fails, the catalog MUST display an understandable error and expose the complete
  prompt body as selectable text for manual copying.
- **FR-011**: The catalog MUST be usable without user registration or login. Prompt
  creation, editing, and deletion within the app are out of scope; the catalog owner
  maintains the saved prompt collection outside the app.
- **FR-012**: All catalog controls and actions MUST be operable by keyboard, and the
  feature MUST conform to WCAG 2.2 Level AA.
- **FR-013**: The page MUST provide a document title, a language declaration, semantic
  landmarks, a logical heading hierarchy, associated labels for form controls, and
  accessible names for icon-only controls.

### Key Entities *(include if feature involves data)*

- **Prompt**: A saved item with a unique identifier, title, category, one or more tags,
  and complete body text. The body is the content used for search and copy.
- **Category**: The catalog classification associated with a prompt.
- **Tag**: A label associated with a prompt; a prompt can have multiple tags and a tag
  can be associated with multiple prompts.
- **Catalog**: The collection of saved prompts available to the user.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid saved prompts appear in the catalog with their title,
  category, tags, and body preview.
- **SC-002**: For a catalog of up to 1,000 prompts, updated search and tag results are
  displayed within 1 second of a search or filter change.
- **SC-003**: In all successful copy tests, the clipboard content exactly matches the
  selected prompt's original complete body, including Markdown symbols and line breaks
  but excluding frontmatter, and success feedback appears within 1 second.
- **SC-004**: Every no-match search/filter state displays both a no-results message
  and a working clear-all control.
- **SC-005**: At least 90% of representative users can find and copy a requested prompt
  without assistance in a usability test.
- **SC-006**: All primary catalog actions can be completed using only a keyboard, and
  the feature passes WCAG 2.2 Level AA review.

## Assumptions

- The catalog is personal and has one owner; the app does not provide accounts,
  authentication, or shared editing.
- The catalog owner maintains prompt content outside the app. This feature only
  displays, searches, filters, and copies saved prompts.
- Prompt identifiers are unique, and every saved prompt has a non-empty title, a
  category, at least one tag, and a body.
- The interface uses Portuguese, consistent with the supplied feature description and
  catalog content.
- Multiple selected tags use “match any selected tag” behavior; when combined with
  search, the prompt must also match the search term.
- Search matching ignores letter case and accents, so `mao` matches `mão`.
- The typical catalog contains no more than 1,000 prompts for the initial release.
- The feature does not require third-party services or external integrations.
- The prompt body, not title or metadata, is the complete text copied by the copy
  action; its original Markdown symbols and line breaks are preserved, and frontmatter
  is excluded.
