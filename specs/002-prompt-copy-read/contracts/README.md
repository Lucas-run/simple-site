# Contracts: Copiar e ler prompts

This feature exposes no external API, network interface, or data schema. Its contracts
are internal component interfaces, documented here for implementation consistency.

## Component contracts

### `CopyButton`

- **Props**: `{ text: string }` — the complete prompt text to copy.
- **Behavior**: On activation, copies `text` to the clipboard and announces the result
  through a polite live region. Shows a transient "copied" state, then returns to idle.
  On failure, shows an error state and keeps the text available.
- **Accessibility**: Native `<button>` with an accessible name; keyboard operable.

### `PromptModal`

- **Props**: `{ prompt: Prompt; onClose: () => void }` — the prompt to display and a
  close callback.
- **Behavior**: Renders a centered `<dialog>` showing the full prompt body and a
  `CopyButton`. Dismissible via close control, backdrop click, or Escape.
- **Accessibility**: Focus moves into the dialog on open and returns to the trigger on
  close (native `<dialog>` behavior).

### `PromptCard` (updated)

- **Adds**: a `CopyButton` in the top-right corner and a read button that opens the
  `PromptModal` for that prompt.

## Data contract (unchanged)

The `Prompt` shape is defined by `src/data/promptRepository.ts` and is not modified by
this feature.
