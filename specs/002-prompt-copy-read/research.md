# Research: Copiar e ler prompts

## Decision 1: Clipboard access via the native Clipboard API

- **Decision**: Use `navigator.clipboard.writeText(text)` for copying, with a fallback
  error message when the API is unavailable or denied.
- **Rationale**: The constitution (Principle II) requires preferring platform features
  over libraries. The Clipboard API is supported in all modern browsers in secure
  contexts (HTTPS, which GitHub Pages provides). No dependency is needed.
- **Alternatives considered**: `document.execCommand('copy')` (deprecated, inconsistent);
  a clipboard library (unnecessary dependency, violates Principle II).

## Decision 2: Modal via the native `<dialog>` element

- **Decision**: Use the native HTML `<dialog>` element with `showModal()` for the
  centered floating modal.
- **Rationale**: `<dialog>` provides built-in focus trapping, Escape-to-close, and
  top-layer rendering for free, satisfying the accessibility requirements (FR-006,
  FR-008) without a library or hand-rolled focus management.
- **Alternatives considered**: A custom portal/overlay with manual focus trap (more
  code, higher a11y risk); a modal library (unnecessary dependency).

## Decision 3: Copy feedback via a polite live region

- **Decision**: Announce copy success/failure through a `role="status"` live region
  (polite), in addition to a visible state change on the button.
- **Rationale**: Required by the constitution (Principle V) and FR-007. A polite live
  region announces the result without interrupting the user.
- **Alternatives considered**: `aria-live="assertive"` (too intrusive for a routine
  confirmation); visual-only feedback (fails WCAG 2.2 AA).

## Decision 4: No new dependencies

- **Decision**: Introduce zero new runtime or dev dependencies for this feature.
- **Rationale**: All required behavior is achievable with native platform features.
- **Alternatives considered**: None needed.
