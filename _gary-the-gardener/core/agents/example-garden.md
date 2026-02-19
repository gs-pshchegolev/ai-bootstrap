# Example Garden Map

> Reference — hypothetical rendered garden for a full-stack web application.
> Shows correct 4-column format: fixed area emoji, path hint, merged Issues, middle-dot for empty.

---

# Garden Map
> Rendered 19-02-2026 | Gary v5.1.0 | hash: v2-22-19-02-2026
> 22 entities across 8 areas
**Legend:** 🌱 small · 🌿 grown · 🌳 mature

☀️ Growing well — solid coverage, room to fill in

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 **Shed** `/` | 🌳 🌿 🌿 🌱 🌱 | · | 🌳×1 🌿×2 🌱×2 |
| 📁 **Docs** `docs/` | 🌳 🌳 🌿 🌿 🌿 🌱 | 🪱×1 | 🌳×2 🌿×3 🌱×1 🪱×1 |
| 🎯 **Destination UI** `frontend/js/src/destination/` | · | · | · |
| 🔧 **Control UI** `frontend/js/src/control/` | 🌱 | · | 🌱×1 |
| 🌐 **API** `src/api/` | 🌿 🌿 🌳 | 🍂×1 | 🌳×1 🌿×2 🍂×1 |
| 🌳 **Domain Modules** `src/` | 🌿 🌱 🌱 | · | 🌿×1 🌱×2 |
| 🗄️ **Data Layer** `src/data/` | · | · | · |
| 🧪 **Tests** `tests/` | 🌿 🌿 | · | 🌿×2 |

---

## Path hint derivation examples

| Include patterns | Path hint |
|-----------------|-----------|
| `*.md` | `/` |
| `docs/**/*.md` | `docs/` |
| `frontend/js/src/destination/**` | `frontend/js/src/destination/` |
| `src/InSided/Controller/**`, `src/InSided/Service/**` | `src/InSided/` |
| `src/Widget/**`, `src/Spaces/**`, `src/User/**` | `src/` |
| `CLAUDE.md`, `.github/agents/*.md`, `.claude/commands/**` | `/` |
