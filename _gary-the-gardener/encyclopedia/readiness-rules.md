# Readiness Classification Rules

> Shared knowledge Gary consults when classifying entities during Plant, Update, and Visualise.
> This is the single source of truth for readiness thresholds and quality signal definitions.

## File-level Entities

| Emoji | State | Threshold |
|-------|-------|-----------|
| 🌳 | mature | ≥100 substantive lines |
| 🌿 | grown | 11–99 substantive lines |
| 🌱 | small | ≤10 substantive lines |

**Substantive line:** non-empty after trim, not a frontmatter delimiter (`---`), not a pure markdown heading with no content on the same line.

## Folder-level Entities

For areas using `granularity: folder` — a single entity represents a directory:

| Emoji | State | Threshold |
|-------|-------|-----------|
| 🌳 | mature | >10 files |
| 🌿 | grown | 2–10 files |
| 🌱 | small | 1 file |

## Documentation Quality Signals

Tracked at area level. Written by the audit workflow — never by visualise or plant. `·` when zero.

| Emoji | Signal | What it means |
|-------|--------|---------------|
| 🪱 | Worm | A claim in a `.md` file that contradicts verifiable codebase facts — wrong tech stack, wrong paths, wrong commands |
| 🍂 | Dead leaf | Documentation describing something that no longer exists — removed files, deleted dependencies, defunct scripts |

Both use `×N` count notation in the garden map.
