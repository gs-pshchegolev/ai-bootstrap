# Example Garden Map

> Reference — hypothetical rendered garden for a full-stack web application.
> Shows correct format: sub-garden H3 sections, 4-column tables, folder-group sub-headers, 🍃 context line.

---

# Garden Map
> Rendered 21-02-2026 | Gary v6.0.0 | hash: v3-22-21-02-2026 | garden v1.0.0
> 22 entities across 8 areas
**Legend:** 🌱 small · 🌿 grown · 🌳 mature

☀️ Growing well — solid coverage, room to fill in

🍃 garden v1.0.0 · 8 areas, 22 entities · main · "feat: add API endpoints"

### 🌿 Shed & Knowledge Base

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 **Shed** `/` | 🌳 🌿 🌿 🌱 🌱 | · | 🌳×1 🌿×2 🌱×2 |
| 📁 **Docs** `/` | 🌳 🌳 🌿 🌿 🌿 🌱 | 🪱×1 | 🌳×2 🌿×3 🌱×1 🪱×1 |

### 🌳 Codebase

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
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

## Structure rules illustrated

### Sub-garden sections
- Garden map is divided into **named sub-garden H3 sections** — each with its own 4-column table.
- Default: "Shed & Knowledge Base" (shed + documentation areas) | "Codebase" (source + test areas).
- Users restructure via `[G]` from the map footer. Gary reads `encyclopedia/sub-garden-patterns.md` when patterns are requested.

### Folder-group sub-headers (within each sub-garden table)
- **Root group** (`/`): Shed and Docs both have path hint `/` — render flat, no sub-header.
- **Non-root groups**: `frontend/`, `src/`, `tests/` each get a bold sub-header row. Fires when ≥2 non-root groups exist **within the same sub-garden table**.
- **Sub-header format**: `| **folder/** | | | |` — plain bold, no backticks, no emoji, all other cells empty.
- **>7 areas in one group**: split at next directory level and add nested sub-headers.

### 🍃 Context line
- Shown in the garden map header (and every Gary Block).
- Format: `🍃 garden v{X} · {N} areas, {E} entities · {branch} · {N} uncommitted · "{last_commit}"`
- Git state called inline at render time — never cached.

## Path hint derivation examples

| Include patterns | Path hint |
|-----------------|-----------|
| `*.md` | `/` |
| `docs/**/*.md` | `docs/` |
| `frontend/src/pages/**` | `frontend/src/pages/` |
| `src/controllers/**`, `src/services/**` | `src/` |
| `src/models/**`, `src/views/**` | `src/` |
| `CLAUDE.md`, `.github/agents/*.md`, `.claude/commands/**` | `/` |
