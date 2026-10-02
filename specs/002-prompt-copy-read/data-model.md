# Data Model: Copiar e ler prompts

This feature introduces no new persistent data. It reuses the existing `Prompt` entity
from the prompt catalog.

## Entities

### Prompt (reused, unchanged)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique identifier. |
| `title` | string | Card title. |
| `category` | string | Catalog classification. |
| `tags` | string[] | Associated tags. |
| `createdAt` | string | Creation date. |
| `body` | string | Complete prompt text — the subject of copy and read actions. |

## State (UI-only, not persisted)

| State | Owner | Values |
|-------|-------|--------|
| Copy status | `CopyButton` | `idle` → `copied` (transient) or `error` |
| Modal open | `PromptCard` / `PromptModal` | `closed` ↔ `open` |

No lifecycle transitions beyond these transient UI states. No new validation rules.
