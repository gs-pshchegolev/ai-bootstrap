# Example Garden Map

> Reference — hypothetical rendered garden for a full-stack web application.
> Shows correct 4-column format: fixed area emoji, path hint, merged Issues, middle-dot for empty, bold sub-header rows for folder groups.

---

# Garden Map
> Rendered 21-02-2026 | Gary v5.2.4 | hash: v2-22-21-02-2026
> 22 entities across 8 areas
**Legend:** 🌱 small · 🌿 grown · 🌳 mature

☀️ Growing well — solid coverage, room to fill in

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 **Shed** `/` | 🌳 🌿 🌿 🌱 🌱 | · | 🌳×1 🌿×2 🌱×2 |
| 📁 **Docs** `/` | 🌳 🌳 🌿 🌿 🌿 🌱 | 🪱×1 | 🌳×2 🌿×3 🌱×1 🪱×1 |
| **frontend/** | | | |
| 🎯 **Pages** `frontend/src/pages/` | · | · | · |
| 🔧 **Components** `frontend/src/components/` | 🌱 | · | 🌱×1 |
| **src/** | | | |
| 🌐 **API** `src/api/` | 🌿 🌿 🌳 | 🍂×1 | 🌳×1 🌿×2 🍂×1 |
| 🌳 **Domain** `src/` | 🌿 🌱 🌱 | · | 🌿×1 🌱×2 |
| 🗄️ **Data Layer** `src/data/` | · | · | · |
| **tests/** | | | |
| 🧪 **Tests** `tests/` | 🌿 🌿 | · | 🌿×2 |

---

## Grouping rules illustrated

- **Root group** (`/`): Shed and Docs both have path hint `/` — they render first, flat, no sub-header.
- **Non-root groups**: `frontend/`, `src/`, `tests/` each get a bold sub-header row. Sub-headers fire when ≥2 non-root groups exist.
- **Sub-header format**: `| **folder/** | | | |` — plain bold, no backticks, no emoji, all other cells empty.
- **>7 areas in one group**: split at next directory level and add nested sub-headers (e.g. `| **frontend/src/** | | | |` then `| **frontend/styles/** | | | |`).

## Path hint derivation examples

| Include patterns | Path hint |
|-----------------|-----------|
| `*.md` | `/` |
| `docs/**/*.md` | `docs/` |
| `frontend/src/pages/**` | `frontend/src/pages/` |
| `src/controllers/**`, `src/services/**` | `src/` |
| `src/models/**`, `src/views/**` | `src/` |
| `CLAUDE.md`, `.github/agents/*.md`, `.claude/commands/**` | `/` |
