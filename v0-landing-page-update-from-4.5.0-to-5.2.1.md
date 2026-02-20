# v0 Prompt — Update landing page from v4.5.0 to v5.2.1

Update the existing Gary The Gardener landing page. Keep all styling, layout, colours, and structure intact. Only change the content described below.

---

## 1. Version number — update everywhere

Change every occurrence of `v4.5.0` or `4.5.0` to `v5.2.1` / `5.2.1`.

---

## 2. "Meet Gary" terminal / garden map — update to v5.2.1 format

Replace the existing terminal block with the following. The format has changed significantly:
- Header: `🪴 Gary The Gardener v5.2.1 | 🏞️ Garden Map`
- **4 columns:** Area · Plants · Issues · Total (worms and dead leaves merged into one Issues column)
- **Bold sub-header rows** between non-root folder groups (e.g. `| **frontend/** | | | |`)
- **Path hints** on every area row (e.g. `` `src/api/` ``)
- **Middle dot `·`** for empty cells instead of `—`
- Legend: `🌱 small · 🌿 grown · 🌳 mature` (seed tier removed)

```
🪴 Gary The Gardener v5.2.1 | 🏞️ Garden Map

☀️ Growing well — solid coverage, room to fill in

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 Shed `/` | 🌳 🌿 🌿 🌱 🌱 | · | 🌳×1 🌿×2 🌱×2 |
| 📁 Docs `/` | 🌳 🌳 🌿 🌿 🌿 🌱 | 🪱×1 | 🌳×2 🌿×3 🌱×1 🪱×1 |
| **frontend/** | | | |
| 🎯 Destination UI `frontend/destination/` | · | · | · |
| 🔧 Control UI `frontend/control/` | 🌱 | · | 🌱×1 |
| **src/** | | | |
| 🌐 API `src/api/` | 🌿 🌿 🌳 | 🍂×1 | 🌳×1 🌿×2 🍂×1 |
| 🌳 Domain `src/` | 🌿 🌱 🌱 | · | 🌿×1 🌱×2 |
| **tests/** | | | |
| 🧪 Tests `tests/` | 🌿 🌿 | · | 🌿×2 |

↘️ [B] Browse area · [S] Summary · [U] Update · [D] Done
```

---

## 3. Skills section — update command names and descriptions

All 7 command names are final garden metaphors. Update every skill name, icon, and description shown on the page:

| Old name (v4.5.0) | New name (v5.2.1) | Icon | Description |
|-------------------|-------------------|------|-------------|
| sow | setup | 🌱 | Plant your garden — AGENTS.md, docs/, AI tool configs |
| map | map | 🗺️ | See your garden map |
| water | health | 🩺 | Quick check — 3 things that need attention |
| tend | inspect | 🔍 | Deep scan for drift, quality issues & Shed sync |
| prune | prune | ✂️ | Trim AGENTS.md to under 150 lines |
| plant | plant | 🌷 | Add a content layer — guardrails, style, domain |
| harvest | research | 📚 | Research dependencies — fetch llms.txt files |

Slash commands: `/garden-setup`, `/garden-map`, `/garden-health`, `/garden-inspect`, `/garden-prune`, `/garden-plant`, `/garden-research`.

---

## 4. GitHub Copilot row — update agent name

In the "Supported Tools" table (or wherever GitHub Copilot is listed), update the agent file and invocation:

Current:
> GitHub Copilot — `.github/agents/gardener.md`

Change to:
> GitHub Copilot — `.github/agents/gardener-gary.md` · invoke: `@gardener-gary`

---

## 5. "New in vX" section — rewrite as "New in v5.2 — Cleaner map, safer garden"

Change the section heading to: **"New in v5.2 — Cleaner map, safer garden"**

Replace the body text with:

> v5 is a complete redesign. Commands renamed to garden metaphors. The map gained spatial awareness — folder groups cluster under bold sub-headers so a 24-area garden stays scannable. Gary's startup now loads heritage and moments in parallel. The readiness vocabulary trims to three tiers: small, grown, mature. And `/garden-map` is strictly read-only — your garden layout is never touched by a display command.

Replace the feature bullets with:

- **Folder-grouped map** — Bold sub-header rows separate `frontend/`, `src/`, `tests/`, etc. Root-level areas (Shed, Docs) render flat at the top. ~7 areas per group is the target split.
- **Copilot agent renamed** — GitHub Copilot users now invoke Gary as `@gardener-gary`. Clearer, unambiguous, no conflicts with other Copilot agents.
- **Read-only `/garden-map`** — The map display never modifies `docsmap.yaml`. Only explicit `[U]` Update writes back, and only additively. Your custom area layout is always preserved across Gary version upgrades.
- **Three-tier readiness** — Seed tier removed. 🌱 small · 🌿 grown · 🌳 mature. Cleaner at a glance.
- **Parallel startup** — `heritage.md`, `moments.md`, and `garden/moments.md` load in parallel at every invocation. Gary walks in knowing the garden's history without slowing down.

---

## 6. "What Gets Installed" — add new core files to the list

Update the installed files list to include the new awareness files added in v5:

- `_gary-the-gardener/core/agents/heritage.md` — Gary's growth journal (loaded at every startup)
- `_gary-the-gardener/core/agents/moments.md` — when to write a good moment (loaded at startup)
- `_gary-the-gardener/core/agents/moments-how.md` — how to write a moment (loaded only when writing)
- `_gary-the-gardener/garden/moments.md` — per-project good moments (created when first moment is written)

Also update any reference to the old path `_gs-gardener/` → `_gary-the-gardener/` and `_gs-gardener/data/` → `_gary-the-gardener/garden/` if shown anywhere on the page.

---

## 7. Footer — update version

Change `v4.5.0` → `v5.2.1` in the footer credits line.

---

## Do NOT change

- Page layout, colour scheme, typography, spacing
- Navigation structure and links
- Installation commands (`npx @pshch/gary-the-gardener`, CLI flags)
- The "Problems" section (Drift / Fragmentation / Neglect) — still accurate
- The "How It Works" three-bucket flow (Shed / Documentation / Codebase) — still accurate
- Granularity Calibration section — still accurate
- Supported AI tools list (Claude Code, Copilot, Cursor, Codex, Junie, Windsurf)
- Footer specs (Zero dependencies, Node.js >= 20, MIT License, npm package name)
- GitHub link
