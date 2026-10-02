# Quickstart: Copiar e ler prompts

Validation guide for the copy and read actions. Prerequisites: the app runs locally via
`npm run dev` (or `npm run build && npm run preview`).

## Scenarios

### 1. Copy from a card

1. Open the catalog.
2. Click the copy button in the top-right corner of any card.
3. Paste into any text field.
4. **Expected**: the pasted text exactly matches that prompt's complete body, and the
   button briefly shows a "copied" confirmation.

### 2. Read in a modal

1. Click the read button on any card.
2. **Expected**: a centered floating modal opens showing the full prompt text.
3. Click the copy button inside the modal, then paste.
4. **Expected**: the pasted text matches the full prompt body.

### 3. Dismiss the modal

1. With the modal open, press Escape (or click the close control / backdrop).
2. **Expected**: the modal closes and focus returns to the read button that opened it.

### 4. Keyboard-only pass

1. Tab to a card's copy button and press Enter — clipboard receives the full text.
2. Tab to the read button and press Enter — modal opens with focus inside.
3. Press Escape — modal closes and focus returns.

### 5. Copy failure (optional)

1. In a context where clipboard access is denied, click copy.
2. **Expected**: an understandable error is shown and the prompt text remains available
   for manual copying.

## Acceptance mapping

- SC-001 → Scenario 1 and 2 (clipboard matches full text).
- SC-002 → Scenario 2 (modal opens within 1 second).
- SC-003 → every card shows both buttons.
- SC-004 → Scenario 4 (keyboard operable, WCAG 2.2 AA).
