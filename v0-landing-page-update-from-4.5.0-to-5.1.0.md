# v0 Prompt — Update landing page from v4.5.0 to v5.1.0

Update the existing Gary The Gardener landing page. Keep all styling, layout, colours, and structure intact. Only change the content described below.

---

## 1. Version number — update everywhere

Change every occurrence of `v4.5.0` or `4.5.0` to `v5.1.0` / `5.1.0`.

---

## 2. "Meet Gary" terminal output — update version and command names

The terminal block showing Gary in action needs two updates:

**A.** The header line: `🪴 Gary The Gardener v4.5.0 | 🏞️ Garden Map` → `🪴 Gary The Gardener v5.1.0 | 🏞️ Garden Map`

**B.** Any footer shortcut line that references old command names — update to current names:
- `/garden-sow` → `/garden-setup`
- `/garden-water` → `/garden-health`
- `/garden-tend` → `/garden-inspect`
- `/garden-harvest` → `/garden-research`
- `/garden-visualise` → `/garden-map`

**C.** If the terminal block shows a garden map legend, update it:
- Old: `🫘 seed · 🌱 small · 🌿 grown · 🌳 mature`
- New: `🌱 small · 🌿 grown · 🌳 mature`

---

## 3. Skills section — update command names and descriptions

All 7 command names are final garden metaphors. Update the skill names, icons, and descriptions:

| Old name (v4.5.0) | New name (v5.1.0) | Icon | Description |
|-------------------|-------------------|------|-------------|
| sow | setup | 🌱 | Plant your garden — AGENTS.md, docs/, AI tool configs |
| map | map | 🗺️ | See your garden map |
| water | health | 🩺 | Quick check — 3 things that need attention |
| tend | inspect | 🔍 | Deep scan for drift, quality issues & Shed sync |
| prune | prune | ✂️ | Trim AGENTS.md to under 150 lines |
| plant | plant | 🌷 | Add a content layer — guardrails, style, domain |
| harvest | research | 📚 | Research dependencies — fetch llms.txt files |

The slash commands: `/garden-setup`, `/garden-map`, `/garden-health`, `/garden-inspect`, `/garden-prune`, `/garden-plant`, `/garden-research`.

---

## 4. "New in v4/v5" section — rename and rewrite as "New in v5.1"

Change the section heading to: **"New in v5.1 — Quieter startup, cleaner map"**

Replace the body text with:

> "v5.1 refines Gary's awareness without adding weight. Startup files now load in parallel. The how-to for writing memories is a separate file — only fetched when Gary decides to write something. The readiness vocabulary trims from four tiers to three: small, grown, mature. Seed is gone. If a file barely exists, it's small — not a special category of emptiness."

Replace or supplement the feature bullets with:

- **Parallel startup** — `heritage.md`, `moments.md`, and `garden/moments.md` load in parallel at every invocation. Gary walks in knowing the garden's history without slowing down.
- **moments-how.md** — The how-to-write instructions are now a separate file, loaded only when Gary decides to record a moment. Keeps every startup lean.
- **Three-tier readiness** — Seed tier removed. The map uses 🌱 small · 🌿 grown · 🌳 mature. Cleaner at a glance.

---

## 5. "What Gets Installed" — add new files to the list

The install now creates these core files. Update the installed files list:

- `_gary-the-gardener/core/agents/heritage.md` — Gary's growth journal (loaded at every startup)
- `_gary-the-gardener/core/agents/moments.md` — when to write a good moment (loaded at startup)
- `_gary-the-gardener/core/agents/moments-how.md` — how to write a moment (loaded only when writing)
- `_gary-the-gardener/garden/moments.md` — per-project good moments (created when first moment is written)

Also update any reference to `_gs-gardener/` → `_gary-the-gardener/` and `_gs-gardener/data/` → `_gary-the-gardener/garden/` if shown anywhere in the page.

---

## 6. Footer — update version

Change `v4.5.0` → `v5.1.0` in the footer spec/credits line.

---

## Do NOT change

- Page layout, colour scheme, typography, spacing
- Navigation structure and links
- Installation commands (`npx @pshch/gary-the-gardener`, CLI flags)
- The three "Problems" section (Drift / Fragmentation / Neglect) — still accurate
- The three-bucket architecture description and flow diagram (unchanged from v4.5)
- Granularity Calibration section (unchanged)
- Supported AI tools section (Claude Code, Copilot, Cursor, Codex, Junie, Windsurf)
- Footer specs (Zero dependencies, Node.js >= 20, MIT License, npm package name)
- GitHub link
