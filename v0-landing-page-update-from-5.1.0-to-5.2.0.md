# v0 Prompt — Update landing page from v5.1.0 to v5.2.0

Update the existing Gary The Gardener landing page. Keep all styling, layout, colours, and structure intact. Only change the content described below.

---

## 1. Version number — update everywhere

Change every occurrence of `v5.1.0` or `5.1.0` to `v5.2.0` / `5.2.0`.

---

## 2. GitHub Copilot row — update agent name

In the "Supported Tools" table (or wherever GitHub Copilot is listed), update the invocation method:

Current:
> GitHub Copilot — `.github/agents/gardener.md`

Change to:
> GitHub Copilot — `.github/agents/gardener-gary.md` · invoke: `@gardener-gary`

---

## 3. "Meet Gary" terminal / garden map example — update to v5.2.0 format

Replace the existing garden map table with the new format:
- 4 columns: **Area · Plants · Issues · Total** (worms and dead leaves merged into one Issues column)
- Bold sub-header rows between non-root folder groups (e.g. `| **frontend/** | | | |`)
- Path hints on every area row (e.g. `` `src/api/` ``)
- Middle dot `·` for empty cells instead of `—`

Replace with:

```
🪴 Gary The Gardener v5.2.0 | 🏞️ Garden Map

☀️ Growing well — solid coverage, room to fill in

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 Shed / | 🌳 🌿 🌿 🌱 🌱 | · | 🌳×1 🌿×2 🌱×2 |
| 📁 Docs / | 🌳 🌳 🌿 🌿 🌿 🌱 | 🪱×1 | 🌳×2 🌿×3 🌱×1 🪱×1 |
| **frontend/** | | | |
| 🎯 Destination UI  frontend/destination/ | · | · | · |
| 🔧 Control UI  frontend/control/ | 🌱 | · | 🌱×1 |
| **src/** | | | |
| 🌐 API  src/api/ | 🌿 🌿 🌳 | 🍂×1 | 🌳×1 🌿×2 🍂×1 |
| 🌳 Domain  src/ | 🌿 🌱 🌱 | · | 🌿×1 🌱×2 |
| **tests/** | | | |
| 🧪 Tests  tests/ | 🌿 🌿 | · | 🌿×2 |

↘️ [B] Browse area · [S] Summary · [U] Update · [D] Done
```

---

## 4. "New in v5" section — rename and rewrite as "New in v5.2"

Change section heading from "New in v5" (or similar) to **"New in v5.2 — Cleaner map, safer garden"**

Replace the description with:

> **Folder groups in the map** — Codebase areas now cluster under bold sub-header rows by top-level folder. A 24-area garden stays scannable at a glance: `**frontend/**` covers all 7 frontend areas, `**src/**` covers backend, `**tests/**` covers tests. Groups with more than 7 areas split further.
>
> **Copilot agent renamed** — GitHub Copilot users now invoke Gary as `@gardener-gary`. Clearer, unambiguous, no conflicts with other Copilot agents.
>
> **Protected gardens** — `/garden-map` is strictly read-only. It can never replant, reorganize, or modify your garden structure. Your 24-area layout stays exactly as you planted it, regardless of Gary version upgrades.

Replace the three "Key Features" bullets with:

- **Folder-grouped map** — Bold sub-header rows separate `frontend/`, `src/`, `tests/`, etc. Root-level areas (Shed, Docs) render flat at the top. ~7 areas per group is the target split.
- **Merged Issues column** — Worms (🪱) and dead leaves (🍂) share one column. Fewer empty columns in repos without quality issues yet.
- **Read-only `/garden-map`** — The map display never modifies `docsmap.yaml`. Only explicit `[U]` Update writes back, and only additively.

---

## 5. Footer — update version

Change `v5.1.0` → `v5.2.0` in the footer credits line.

---

## Do NOT change

- Page layout, colour scheme, typography, spacing
- Navigation structure and links
- Installation commands (`npx @pshch/gary-the-gardener`, CLI flags)
- The "Problems" section (Drift / Fragmentation / Neglect) — still accurate
- The "How It Works" three-bucket flow (Shed / Documentation / Codebase) — still accurate
- Supported AI tools list (Claude Code, Copilot, Cursor, Codex, Junie, Windsurf)
- Footer specs (Zero dependencies, Node.js >= 20, MIT License, npm package name)
- GitHub link
