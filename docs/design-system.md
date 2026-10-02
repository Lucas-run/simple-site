# Design System — Prompt Library

> Source of truth for everything visual and for CSS conventions. The constitution
> (`.specify/memory/constitution.md`) says *that* this document prevails; this file
> says *what* it contains. If a spec, plan or task conflicts with this file, this file wins.

- **Version:** 0.1.0
- **Last updated:** 2026-09-24
- **Owner:** Lucas

## 0. How to use this document

### 0.1 Rules for humans and AI agents

- Before any UI task, the agent MUST read sections 2 (Tokens), 5 (CSS Modules rules)
  and 6 (Naming) of this document.
- The agent MUST NOT invent values (colors, sizes, durations, fonts). If a needed token
  does not exist, it MUST stop, propose the new token in the plan, and wait for approval.
- The agent MUST NOT resolve a `TODO(decide)` by itself. It MUST ask.
- Every value in this document is either **decided** (a concrete value) or marked
  `TODO(decide)`. Values marked `(suggested)` are defaults that stand until changed.

### 0.2 Open decisions

List every open item with `grep -n "TODO(decide)" docs/design-system.md`.
All must be resolved before the first `/speckit.specify`, except those explicitly
marked "can wait".

### 0.3 Terminology

MUST = mandatory, verified in review. SHOULD = default; deviations need a comment in
the PR or plan. MAY = optional.

---

## 1. Design direction

| Item | Decision |
|---|---|
| Personality (3–5 adjectives) | calm, minimalist, futuristic |
| Visual references (links/screenshots) | https://www.framer.com/?dub_id=DA4jsmkPDPhKU4xQ |
| Density | comfortable |
| Themes | dark only |
| UI language | both (prompts themselves may be in any language) |
| Animations | Subtle Scroll Reveal ONLY using native Intersection Observer + CSS (opacity and transform). |
| Non-goals | No decorative illustration, no parallax, no autoplaying media, no heavy effects, NO animation libraries (GSAP, AOS, Framer Motion) |

### 1.1. Animation & Interaction Constraints
**@Agent, when implementing Scroll Reveal or any animations, strictly follow these rules to maintain a lightweight frontend:**
1. **No External Libraries:** DO NOT use GSAP, AOS, Framer Motion, or any other JS animation libraries.
2. **Tech Stack:** Use ONLY native `IntersectionObserver` to trigger CSS classes (e.g., `.isVisible`).
3. **Hardware Acceleration:** Animate ONLY `opacity` and `transform` (e.g., `translateY`). NEVER animate layout-triggering properties (`margin`, `top`, `height`).
4. **Easing:** Use fluid, calm easing curves (e.g., `cubic-bezier(0.16, 1, 0.3, 1)`).
5. **Accessibility:** You MUST include `@media (prefers-reduced-motion: reduce)` to disable animations for accessibility.
---

## 2. Tokens

### 2.1 Architecture

Three layers. Components MUST only consume layer 2 (semantic) or layer 3 (component-scoped).

1. **Primitive**: raw values (`--palette-blue-500`). Defined once in `tokens.css`.
   Never used directly in component modules.
2. **Semantic**: purpose-driven (`--color-bg-surface`). Reference primitives. Themes
   redefine only this layer.
3. **Component**: optional local variables declared on the component root
   (`--card-padding`). They reference semantic tokens.

Token naming: `--{category}-{role}-{variant?}-{state?}`, lowercase, kebab-case.

### 2.2 File structure — global CSS vs. CSS Modules

**This project has exactly two kinds of CSS files, and Vite tells them apart only by file name — there is no other signal:**

| Kind | File name pattern | Scope | Import style |
| --- | --- | --- | --- |
| Global CSS | `*.css` (no `.module.` in the name) | Global — class names are NOT transformed | Side-effect import: `import './tokens.css'` (no binding) |
| CSS Module | `*.module.css` | Local — class names are transformed/hashed by Vite | `import styles from './PromptCard.module.css'` |

> ⚠️ The upstream CSS Modules spec (css-modules/css-modules) scopes *any* CSS file imported into JS. **Vite does not follow that — it only scopes files matching `*.module.css`.** This document follows Vite's convention. Do not "correct" a file in `src/styles/` to end in `.module.css`, and do not import a plain `.css` file expecting a `styles` object back — it will be `undefined`.

Rules:

- Every file under `src/styles/` MUST be global CSS (`*.css`, never `*.module.css`), because tokens, resets and base element styles are meant to apply project-wide and must not be scoped.
- Every component stylesheet MUST be a CSS Module (`*.module.css`), colocated with its component (see section 6.1), and MUST NOT live in `src/styles/`.
- `src/styles/` MUST NOT contain component-specific selectors (e.g. `.promptCard`). If a rule only applies to one component, it belongs in that component's `.module.css`.
- Only one file performs side-effect imports of the global CSS, in order, and it is imported exactly once, at the app's entry point (`main.tsx`):


```
src/styles/
  reset.css        # minimal modern reset
  tokens.css       # primitive + semantic tokens (light theme = default)
  themes.css       # theme overrides (semantic layer only), if dark mode is enabled
  base.css         # element defaults: body, headings, links, focus, selection
  fonts.css        # @font-face declarations
  global.css       # imports the above in order; the only global stylesheet entry point
```

Import order in `global.css`: `fonts` → `reset` → `tokens` → `themes` → `base`.

Cascade layers (suggested): declare `@layer reset, tokens, base;` and place those files
in their layers. Component CSS Modules stay **unlayered**, so they always win over
base styles without raising specificity.

### 2.3 Color

**Primitive palette** (`TODO(decide)`: fill hex values; keep steps 50–900):

| Token | Hex Value | Usage Context (Agent Guidance) |
|---|---|---|
| `--palette-neutral-50` | `#F8F7F8` | Primary text (Headings and high-emphasis body text) |
| `--palette-neutral-100` | `#EBE9EC` | Secondary text |
| `--palette-neutral-200` | `#D0CCD3` | Muted text and disabled states |
| `--palette-neutral-300` | `#A8A1AC` | Placeholder text |
| `--palette-neutral-400` | `#7C7481` | Icons (inactive) |
| `--palette-neutral-500` | `#5D5561` | Input borders and dividers |
| `--palette-neutral-600` | `#423C45` | Hover states for dark cards |
| `--palette-neutral-700` | `#2C282E` | Elevated surfaces (Cards, Modals, Dropdowns) |
| `--palette-neutral-800` | `#1B181C` | Secondary background (Sidebar, Headers) |
| `--palette-neutral-900` | `#0F0E10` | Main application background (Base) |
| `--palette-accent-50` | `#FDF3F5` | Light accent text |
| `--palette-accent-100` | `#F8E0E6` | Light accent backgrounds |
| `--palette-accent-200` | `#F0C1CD` | Disabled primary buttons |
| `--palette-accent-300` | `#E293A9` | Focus rings |
| `--palette-accent-400` | `#D15F80` | Hover state for primary buttons / Soft highlights |
| `--palette-accent-500` | `#BC315B` | **Primary Brand Color** / Main CTA buttons |
| `--palette-accent-600` | `#9B2246` | Active/Pressed state for buttons |
| `--palette-accent-700` | `#811938` | Dark accent borders |
| `--palette-accent-800` | `#6B1630` | Dark accent backgrounds |
| `--palette-accent-900` | `#5A152B` | Background for active tags/badges |
| `--palette-success-500` | `#34D399` | Success states, copied indicators |
| `--palette-warning-500` | `#FBBF24` | Warning messages, alerts |
| `--palette-danger-500` | `#F87171` | Error states, delete actions |
| `--palette-info-500` | `#60A5FA` | Informational notes, active links |

**Semantic tokens** (names are fixed; values are decided per theme):

| Token | Purpose | Light | Dark |
|---|---|---|---|
| `--color-bg-page` | Page background | `var(--palette-neutral-50)` | `var(--palette-neutral-900)` |
| `--color-bg-surface` | Cards, panels | `#FFFFFF` | `var(--palette-neutral-800)` |
| `--color-bg-surface-hover` | Hovered surface | `var(--palette-neutral-100)` | `var(--palette-neutral-700)` |
| `--color-bg-inset` | Inputs, code blocks | `var(--palette-neutral-100)` | `rgba(0, 0, 0, 0.2)` |
| `--color-border-default` | Default borders | `var(--palette-neutral-200)` | `var(--palette-neutral-700)` |
| `--color-border-strong` | Input borders, emphasis | `var(--palette-neutral-400)` | `var(--palette-neutral-500)` |
| `--color-text-primary` | Main text | `var(--palette-neutral-900)` | `var(--palette-neutral-50)` |
| `--color-text-secondary` | Supporting text | `var(--palette-neutral-600)` | `var(--palette-neutral-300)` |
| `--color-text-disabled` | Disabled text | `var(--palette-neutral-400)` | `var(--palette-neutral-600)` |
| `--color-text-on-accent` | Text over accent backgrounds | `#FFFFFF` | `#FFFFFF` |
| `--color-accent` | Primary actions, links | `var(--palette-accent-600)` | `var(--palette-accent-500)` |
| `--color-accent-hover` | Hover state | `var(--palette-accent-700)` | `var(--palette-accent-400)` |
| `--color-accent-active` | Pressed state | `var(--palette-accent-800)` | `var(--palette-accent-300)` |
| `--color-accent-subtle` | Tinted backgrounds (selected tag) | `var(--palette-accent-50)` | `var(--palette-accent-900)` |
| `--color-focus-ring` | Focus indicator | `var(--palette-accent-300)` | `var(--palette-accent-600)` |
| `--color-feedback-success` | Status text/icons (Success) | `var(--palette-success-500)` | `var(--palette-success-500)` |
| `--color-feedback-warning` | Status text/icons (Warning) | `var(--palette-warning-500)` | `var(--palette-warning-500)` |
| `--color-feedback-danger` | Status text/icons (Error) | `var(--palette-danger-500)` | `var(--palette-danger-500)` |
| `--color-feedback-info` | Status text/icons (Info) | `var(--palette-info-500)` | `var(--palette-info-500)` |
| `--color-feedback-success-bg` | Status backgrounds (Success) | `#D1FAE5` | `rgba(52, 211, 153, 0.15)` |
| `--color-feedback-warning-bg` | Status backgrounds (Warning) | `#FEF3C7` | `rgba(251, 191, 36, 0.15)` |
| `--color-feedback-danger-bg` | Status backgrounds (Error) | `#FEE2E2` | `rgba(248, 113, 113, 0.15)` |
| `--color-feedback-info-bg` | Status backgrounds (Info) | `#DBEAFE` | `rgba(96, 165, 250, 0.15)` |

**Contrast matrix** (MUST be filled and verified; required: text ≥ 4.5:1, large text and UI
components ≥ 3:1):

| Foreground | Background | Theme | Ratio | Required | Pass |
|---|---|---|---|---|---|
| `--color-text-primary` | `--color-bg-page` | light | | 4.5 | |
| `--color-text-secondary` | `--color-bg-surface` | light | | 4.5 | |
| `--color-text-on-accent` | `--color-accent` | light | | 4.5 | |
| `--color-accent` | `--color-bg-page` | light | | 4.5 (text) / 3 (UI) | |
| `--color-border-strong` | `--color-bg-page` | light | | 3 | |
| `--color-focus-ring` | `--color-bg-page` | light | | 3 | |
| (repeat all rows for dark, if enabled) | | dark | | | |

Rules:
- Components MUST NOT use hex, `rgb()`, `hsl()` or named colors. Only `var(--color-*)`.
- Color MUST NOT be the only carrier of meaning (pair with icon, text or shape).
- Theme mechanism (if dark is enabled): `:root` = light; `:root[data-theme="dark"]`
  overrides; `@media (prefers-color-scheme: dark)` applies to `:root:not([data-theme])`.
  The user's explicit choice is persisted in `localStorage` (wrapped in try/catch).

### 2.4 Typography

**Font families** (`TODO(decide)`):

| Token | Family | Source | Weights/axes | Notes |
| --- | --- | --- | --- | --- |
| `--font-family-display` | `'Space Grotesk', sans-serif` | Google Fonts, self-hosted | `300, 400, 500, 600, 700` | Headings, titles, and key UI accents (Futuristic feel) |
| `--font-family-sans` | `'Plus Jakarta Sans', sans-serif` | Google Fonts, self-hosted | `400, 500, 600` | UI, body text, and long reading (Clean and calm) |
| `--font-family-mono` | `'Fira Code', monospace` | Google Fonts, self-hosted | `400, 500` | Prompt text / code snippets |

Both stacks MUST end in a system fallback, e.g. `"Family", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` and `"Family", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.

**Font loading rules:**

- Fonts are downloaded from Google Fonts and **self-hosted** in the repo, under `src/assets/fonts/{family}/`, so Vite processes and fingerprints them and rewrites `url()` paths for the GitHub Pages `base` automatically. `public/fonts/` MUST NOT be used for fonts (its files are copied as-is, with a root-relative path that breaks under a GitHub Pages subpath). The site MUST NOT request fonts from `fonts.googleapis.com` / `fonts.gstatic.com` at runtime (privacy, LGPD, performance). `fonts.css` references files via relative `url()`, e.g. `url("../assets/fonts/family/File.woff2")`.
- Format: `.woff2` only. Prefer variable fonts (one file covers all weights).
- Subset: Latin (+ Latin Extended if the content needs accents beyond pt-BR/en).
- Each `@font-face` MUST set `font-display: swap`.
- Preload only the primary text font file(s) needed for first paint.
- Keep the font license file (OFL) in `src/assets/fonts/LICENSES/`.
- Maximum: 2 families, 4 weights in total.

**Type scale** (rem; 1rem = 16px; suggested):

| Token | Size | Token | Size |
|---|---|---|---|
| `--font-size-xs` | 0.75rem | `--font-size-xl` | 1.25rem |
| `--font-size-sm` | 0.875rem | `--font-size-2xl` | 1.5rem |
| `--font-size-base` | 1rem | `--font-size-3xl` | 1.875rem |
| `--font-size-lg` | 1.125rem | `--font-size-4xl` | 2.25rem |

Also: `--font-weight-regular: 400`, `-medium: 500`, `-semibold: 600`, `-bold: 700`;
`--line-height-tight: 1.2`, `-snug: 1.35`, `-normal: 1.5`, `-relaxed: 1.65`;
`--letter-spacing-tight: -0.01em`, `-normal: 0`, `-wide: 0.02em`.

**Type roles** (components use roles, not raw sizes):

| Role | Family | Size | Weight | Line height | Where |
|---|---|---|---|---|---|
| Display / h1 | sans | `TODO` | `TODO` | tight | Page title |
| h2 | sans | `TODO` | `TODO` | snug | Section titles |
| h3 | sans | `TODO` | `TODO` | snug | Card titles |
| Body | sans | base | regular | normal | Default text |
| Body small | sans | sm | regular | normal | Metadata |
| Label / caption | sans | xs–sm | medium | normal | Tags, field labels |
| Prompt text | `TODO` sans/mono | `TODO` | regular | relaxed | Prompt content |

Rules: font sizes MUST use `rem`, never `px`. Body text MUST be at least 1rem. Line length
for reading text SHOULD be 45–75 characters (`max-width: 65ch`).

### 2.5 Spacing, sizing, shape

Spacing (4px base, expressed in rem):

| Token | Value | Token | Value |
|---|---|---|---|
| `--space-0` | 0 | `--space-6` | 1.5rem |
| `--space-1` | 0.25rem | `--space-8` | 2rem |
| `--space-2` | 0.5rem | `--space-10` | 2.5rem |
| `--space-3` | 0.75rem | `--space-12` | 3rem |
| `--space-4` | 1rem | `--space-16` | 4rem |
| `--space-5` | 1.25rem | | |

Radius: `--radius-sm: 0.25rem`, `--radius-md: 0.5rem`, `--radius-lg: 0.75rem`,
`--radius-full: 9999px` (all `TODO(decide)` on taste).

Border width: `--border-width-default: 1px`, `--border-width-strong: 2px`.

Shadows (elevation, `TODO(decide)` values): `--shadow-sm`, `--shadow-md`, `--shadow-lg`.
Elevation is used only for overlays and hovered cards. Default surfaces use borders.

Z-index scale (no other values allowed): `--z-base: 0`, `--z-sticky: 100`,
`--z-dropdown: 200`, `--z-overlay: 300`, `--z-modal: 400`, `--z-toast: 500`.

Minimum interactive target: `--target-min: 2.75rem` (44px) on touch; never below 24px.

### 2.6 Breakpoints and layout

CSS custom properties **do not work inside `@media` queries**, so breakpoints are documented
here and written as literals. Approach is mobile-first (`min-width` only).

| Name | Min width | Literal in CSS |
|---|---|---|
| base | 0 | (no query) |
| `md` | 768px | `@media (min-width: 48rem)` |
| `lg` | 1024px | `@media (min-width: 64rem)` |
| `xl` | 1280px | `@media (min-width: 80rem)` |

Layout tokens: `--container-max: 72rem`, `--container-padding-inline: var(--space-4)`
(`var(--space-6)` from `md`), `--grid-gap: var(--space-4)` (`var(--space-6)` from `lg`).

Page anatomy (single page):

```
┌──────────────────────────────────────────┐
│ Header  (title, theme toggle if enabled) │
├──────────────────────────────────────────┤
│ Toolbar (search field + tag filters)     │
│ Result summary (live region)             │
├──────────────────────────────────────────┤
│ Prompt grid (cards)                      │
│  1 col base · 2 cols md · 3 cols lg      │
├──────────────────────────────────────────┤
│ Footer                                   │
└──────────────────────────────────────────┘
```

Grid: `repeat(auto-fill, minmax(min(20rem, 100%), 1fr))` (suggested). `TODO(decide)`:
confirm columns and whether the toolbar is sticky.

### 2.7 Motion

**Tokens** (values suggested; `TODO(decide)` after studying CSS docs):

| Token | Value | Use |
|---|---|---|
| `--duration-instant` | 75ms | Press feedback |
| `--duration-fast` | 150ms | Hover, focus, small state changes |
| `--duration-base` | 250ms | Enter/exit of elements |
| `--duration-slow` | 400ms | Rare, large transitions |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `--ease-enter` | `cubic-bezier(0, 0, 0, 1)` | Elements appearing |
| `--ease-exit` | `cubic-bezier(0.3, 0, 1, 1)` | Elements leaving |

**Principles** (`TODO(decide)` to confirm): motion is functional (feedback, orientation),
never decorative; subtle; never blocks interaction; nothing longer than `--duration-slow`;
no looping animations; no bounce/overshoot.

**Rules:**
- MUST use only `--duration-*` and `--ease-*`; no literal `ms`, `s` or `cubic-bezier` in modules.
- MUST respect reduced motion. Implemented once, in `tokens.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    :root {
      --duration-instant: 0.01ms;
      --duration-fast: 0.01ms;
      --duration-base: 0.01ms;
      --duration-slow: 0.01ms;
    }
  }
  ```
  Motion that conveys meaning MUST have a non-motion equivalent (e.g., text change).
- Property policy `TODO(decide)`. Recommended: SHOULD prefer `transform` and `opacity`;
  small `color`, `background-color`, `border-color` and `box-shadow` transitions are allowed;
  MUST NOT animate `width`, `height`, `top`, `left`, `margin` or `padding`. Expanding
  content uses a documented technique (e.g., `grid-template-rows: 0fr → 1fr`).
- Never write `transition: all`. List the properties explicitly.
- `will-change` MUST NOT be used unless a measured problem justifies it.

**Animation catalogue** (only these animations exist; anything new needs an entry here):

| Name | Trigger | Properties | Duration / easing | Reduced motion |
|---|---|---|---|---|
| `hoverLift` (card) | hover / focus-within | `transform`, `box-shadow` | fast / standard | none |
| `pressFeedback` (button) | `:active` | `transform` | instant / standard | none |
| `fadeIn` (list enter) | first render, after filter | `opacity`, `transform` | base / enter | instant |
| `copyConfirm` | after copy | `opacity` (icon/text swap) | fast / standard | text change only |
| `themeSwitch` | theme toggle | `background-color`, `color` | base / standard | instant |
| `TODO(decide)` | | | | |

Forbidden: parallax, scroll-jacking, scroll-triggered animation, autoplay, infinite loops,
skeleton shimmer (`TODO(decide)`), animation on initial page load beyond `fadeIn`.

### 2.8 Interaction states

Every interactive component MUST define all states below (or state "n/a" in section 4).

| State | Selector | Visual rule |
|---|---|---|
| Default | `.root` | Base tokens |
| Hover | `:hover` (inside `@media (hover: hover)`) | Uses `-hover` token |
| Focus | `:focus-visible` | `outline: 2px solid var(--color-focus-ring); outline-offset: 2px`; never `outline: none` |
| Active | `:active` | Uses `-active` token |
| Disabled | `:disabled`, `[aria-disabled="true"]` | `--color-text-disabled`, no hover effects, `cursor: not-allowed` |
| Selected / pressed | `[aria-pressed="true"]`, `[aria-selected="true"]` | `--color-accent-subtle` background + non-color cue |
| Loading | `[aria-busy="true"]` | `TODO(decide)` |
| Empty / error | Dedicated component | See `EmptyState` |

### 2.9 Iconography and assets

- Icons are inline SVG components, `fill="currentColor"` or `stroke="currentColor"`,
  sized with `1em` or a `--icon-size-*` token. `TODO(decide)`: icon set (hand-drawn, or a
  single approved library; adding one needs approval per the constitution).
- Decorative icons: `aria-hidden="true"`. Meaningful icons need an accessible name.
- Raster images: WebP/AVIF, explicit `width`/`height`, `loading="lazy"` below the fold.
- Favicon and social preview image: `TODO(decide)` (can wait).

---

## 3. Global CSS rules

- `reset.css`: box-sizing border-box; margins removed on headings/paragraphs/lists;
  `img, svg, video { display: block; max-width: 100% }`; inherit fonts on form controls;
  `text-size-adjust: 100%`. No opinionated styling.
- `base.css`: `html { font-size: 100% }` (never a fixed px); `body` uses
  `--font-family-sans`, `--color-text-primary`, `--color-bg-page`, `--line-height-normal`;
  global `:focus-visible` style from 2.8; `::selection` color; `scroll-padding-top` if the
  toolbar is sticky.
- Global CSS is limited to `src/styles/`. Component styles MUST NOT be global.
- No utility class framework. `TODO(decide)`: allow a tiny `.visuallyHidden` helper in
  `shared.module.css` (recommended: yes, needed for screen-reader-only text).

---

## 4. Component specifications

### 4.1 Template (copy for each component)

```
### ComponentName
- Purpose:
- Element / semantics: (native element used; ARIA only if unavoidable)
- Anatomy: (parts, in order)
- Variants:
- Sizes:
- States: default | hover | focus | active | disabled | selected | loading (or n/a)
- Tokens used: (semantic tokens only)
- Motion: (catalogue names only)
- Responsive behavior:
- Accessibility: (name, keyboard, announcements)
- Content rules: (max lengths, truncation)
```

### 4.2 Components in scope (fill using the template)

| Component | Notes |
|---|---|
| `Button`, `IconButton` | Icon-only variant requires `aria-label` |
| `SearchInput` | Native `<input type="search">` with visible `<label>` |
| `TagChip` / `TagFilter` | Native button with `aria-pressed`, or checkbox |
| `PromptCard` | `<article>` in a `<ul>/<li>` list; title as heading; truncation rule `TODO(decide)` |
| `CopyButton` | Announces result through a polite live region |
| `ResultSummary` | `role="status"`: "N prompts found" |
| `EmptyState` | Shown when filters return nothing |
| `ThemeToggle` | Only if dark mode is enabled |
| `SkipLink` | Visible on focus only |
| `Layout` (`Header`, `Footer`, `Container`) | Landmarks |

---

## 5. CSS Modules rules

### 5.1 Official reference

Base behavior follows the CSS Modules specification
(<https://github.com/css-modules/css-modules>). Paste or link the relevant excerpt here:

> `TODO(decide)`: excerpt of the official rules adopted (local scope by default,
> `composes`, `:global` semantics, naming of exports).

The rules below **add** project conventions on top of the specification.

### 5.2 File rules

- One module per component, colocated: `PromptCard/PromptCard.tsx` +
  `PromptCard/PromptCard.module.css`.
- File name MUST be `{ComponentName}.module.css`.
- Imported as `import styles from './PromptCard.module.css'`. Never use named imports for
  classes, never import a module from another component's folder.
- `vite/client` types MUST be referenced so `*.module.css` is typed.

### 5.3 Class naming

- Class names are **camelCase** (`.tagList`, `.titleRow`), so they are used as
  `styles.tagList`. (suggested; alternative is kebab-case plus Vite
  `css.modules.localsConvention`; `TODO(decide)` to confirm)
- The component's outermost element uses `.root`.
- Names describe **role**, not appearance: `.title` ✔, `.bigBlueText` ✘.
- **Variants** and **sizes** are classes named by the variant: `.primary`, `.ghost`,
  `.sm`, `.lg`. Combined via a small `cx()` helper (no new dependency; see 6.4).
- **State** is styled through attributes, not classes: prefer ARIA/native
  (`[aria-pressed="true"]`, `[aria-expanded="true"]`, `:disabled`); otherwise
  `[data-state="…"]`. This keeps styling and accessibility in sync.

### 5.4 Selector rules

- MUST NOT use ID selectors, `!important`, or inline styles for anything expressible in CSS
  (dynamic values may be passed via a CSS custom property, e.g. `style={{'--progress': x}}`).
- MUST NOT use bare tag selectors at the top level of a module. Tag selectors are allowed
  only scoped under a class (`.content p`), max one level.
- Maximum specificity: two classes (`.root .title`). No descendant chains deeper than two.
- `:global` is allowed only inside `src/styles/`. Elsewhere it is forbidden.
- `composes` is allowed only from `src/styles/shared.module.css` and only for primitives
  (e.g., `visuallyHidden`). `TODO(decide)`: confirm.
- No nesting deeper than two levels (native CSS nesting allowed; `TODO(decide)`).
- Styling another component's internals from outside is forbidden. Expose a prop/variant.

### 5.5 Value rules

- Colors, spacing, radii, shadows, font sizes, durations and easings MUST come from tokens.
- Allowed literals: `0`, `1px`/`2px` borders, `100%`, `auto`, `none`, `inherit`,
  unitless `line-height` via token, `calc()` combining tokens.
- Units: `rem` for font size and spacing, `%`/`fr`/`ch`/`vw` for layout, `px` only for
  borders/outlines/shadows. Never `vh` for critical layout on mobile; use `dvh` if needed.
- Prefer logical properties (`margin-inline`, `padding-block`, `inset-inline-start`).
- Component-scoped custom properties are declared on `.root` and prefixed with the
  component name (`--promptCard-padding`).

### 5.6 Property order (inside a rule)

1. Positioning (`position`, `inset`, `z-index`)
2. Layout (`display`, `flex`/`grid` props, `gap`)
3. Box model (`width`, `margin`, `padding`, `border`)
4. Typography (`font`, `color`, `text-*`)
5. Visual (`background`, `box-shadow`, `opacity`)
6. Motion (`transition`, `animation`)
7. Misc (`cursor`, `pointer-events`)

Within a file: base styles first, then variants/sizes, then state selectors, then
`@media` (mobile-first) at the end. Enforced by Stylelint if adopted.

### 5.7 Tooling (each dependency needs approval per the constitution)

- `TODO(decide)`: `stylelint` + `stylelint-config-standard` (+ property order plugin)
  with rules forbidding hex colors, `!important`, `transition: all`, and ID selectors.
- Vite config (only if kebab-case is chosen): `css.modules.localsConvention: 'camelCaseOnly'`.

---

## 6. Naming and structure conventions

### 6.1 Files and folders

```
src/
  components/
    PromptCard/
      PromptCard.tsx
      PromptCard.module.css
      PromptCard.test.tsx        # only when it holds logic
      index.ts
  data/                          # prompt files + the single data-access module
  hooks/                         # useCopyToClipboard.ts …
  styles/                        # global CSS (section 2.2)
  assets/fonts/
docs/design-system.md
```

- Components: `PascalCase` folder, file and export. Hooks: `useXxx.ts`. Utilities: `camelCase.ts`.
- One component per file. No default exports for components (`TODO(decide)`).

### 6.2 CSS custom properties

`--{category}-{role}-{variant}-{state}`, kebab-case, e.g. `--color-accent-hover`.
Categories: `palette`, `color`, `font-family`, `font-size`, `font-weight`,
`line-height`, `letter-spacing`, `space`, `radius`, `border-width`, `shadow`, `z`,
`duration`, `ease`, `container`, `grid`, `target`, `icon-size`.

### 6.3 Data attributes and test hooks

`data-state`, `data-variant` only for styling states not covered by ARIA. Tests query by
role and accessible name, never by class name.

### 6.4 Class composition helper

A tiny in-repo `cx(...classes)` helper joins truthy class names. Adding `clsx` or
`classnames` requires approval. (suggested)

---

## 7. Accessibility hooks in the design

The full requirements live in the constitution (WCAG 2.2 AA). Design-level obligations:

- Contrast matrix in 2.3 is filled and passes before implementation starts.
- Focus indicator follows 2.8 in every theme.
- Targets follow `--target-min`.
- Layout survives 320px width and 200% zoom without horizontal scroll.
- Every animation has a reduced-motion behavior in the catalogue.

---

## 8. Content and microcopy

- UI language: see section 1. `lang` attribute set accordingly.
- Tone: `TODO(decide)`.
- Standard strings (`TODO(decide)`): "Copy", "Copied", "No prompts found", "Clear filters".
- Dates: `TODO(decide)` format. Truncation of long titles/prompts follows component specs.

---

## 9. Definition of Done for UI work

- [ ] Only tokens used; no literal colors/spacing/durations
- [ ] All interaction states implemented and visible
- [ ] Keyboard-only pass done; focus order logical
- [ ] Contrast verified for new color pairs
- [ ] Reduced-motion behavior verified
- [ ] Checked at 320px, 768px, 1280px and at 200% zoom
- [ ] Lint (ESLint a11y, Stylelint if adopted) and automated a11y tests pass
- [ ] Component spec in section 4 created or updated

---

## 10. Change process and decision log

- Changes to this file MUST be made in their own commit and bump the version above
  (MAJOR: token renamed/removed; MINOR: token or component added; PATCH: wording).
- Adding or renaming a token requires updating `tokens.css` in the same commit.

| Date | Decision | Reason | Version |
|---|---|---|---|
| YYYY-MM-DD | Initial template | | 0.1.0 |
