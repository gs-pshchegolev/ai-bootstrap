# Example Garden Map

> Reference — hypothetical rendered garden for a full-stack web application.
> Shows correct 4-column format: fixed area emoji, path hint, merged Issues, middle-dot for empty, bold sub-header rows for folder groups.

---

# Garden Map
> Rendered 19-02-2026 | Gary v5.1.3 | hash: v2-22-19-02-2026
> 22 entities across 8 areas
**Legend:** 🌱 small · 🌿 grown · 🌳 mature

☀️ Growing well — solid coverage, room to fill in

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 **Shed** `/` | 🌳 🌿 🌿 🌱 🌱 | · | 🌳×1 🌿×2 🌱×2 |
| 📁 **Docs** `/` | 🌳 🌳 🌿 🌿 🌿 🌱 | 🪱×1 | 🌳×2 🌿×3 🌱×1 🪱×1 |
| **frontend/** | | | |
| 🎯 **Destination UI** `frontend/js/src/destination/` | · | · | · |
| 🔧 **Control UI** `frontend/js/src/control/` | 🌱 | · | 🌱×1 |
| **src/** | | | |
| 🌐 **API** `src/api/` | 🌿 🌿 🌳 | 🍂×1 | 🌳×1 🌿×2 🍂×1 |
| 🌳 **Domain Modules** `src/` | 🌿 🌱 🌱 | · | 🌿×1 🌱×2 |
| 🗄️ **Data Layer** `src/data/` | · | · | · |
| **tests/** | | | |
| 🧪 **Tests** `tests/` | 🌿 🌿 | · | 🌿×2 |

---

## Grouping rules illustrated

- **Root group** (`/`): Shed and Docs both have path hint `/` — they render first, flat, no sub-header.
- **Non-root groups**: `frontend/`, `src/`, `tests/` each get a bold sub-header row. Sub-headers fire when ≥2 non-root groups exist.
- **Sub-header format**: `| **folder/** | | | |` — plain bold, no backticks, other cells empty.
- **>7 areas in one group**: split at next directory level and add nested sub-headers (e.g. `| **frontend/js/** | | | |` then `| **frontend/css/** | | | |`).

## Path hint derivation examples

| Include patterns | Path hint |
|-----------------|-----------|
| `*.md` | `/` |
| `docs/**/*.md` | `docs/` |
| `frontend/js/src/destination/**` | `frontend/js/src/destination/` |
| `src/InSided/Controller/**`, `src/InSided/Service/**` | `src/InSided/` |
| `src/Widget/**`, `src/Spaces/**`, `src/User/**` | `src/` |
| `CLAUDE.md`, `.github/agents/*.md`, `.claude/commands/**` | `/` |
