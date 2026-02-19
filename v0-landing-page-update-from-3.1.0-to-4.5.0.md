# v0 Prompt — Update landing page from v3.1.0 to v4.5.0

Update the existing Gary The Gardener landing page. Keep all styling, layout, colours, and structure intact. Only change the content described below.

---

## 1. Version number — update everywhere

Change every occurrence of `v3.1.0` or `3.1.0` to `v4.5.0` / `4.5.0`.

---

## 2. Hero description — add Shed to the tool list

Current:
> "An open-source CLI tool that maintains AGENTS.md and configuration files for Claude Code, GitHub Copilot, Cursor, Codex, Junie, and Windsurf."

Change to:
> "An open-source CLI tool that maps your codebase, maintains AGENTS.md, and keeps AI tool configuration files (Claude Code, Copilot, Cursor, Codex, Junie, Windsurf) in sync — all from a single garden map."

---

## 3. "How It Works" section — update the flow diagram

Current processing flow:
> 📁 Your Repo → 🔍 Discovery (all *.md) → 🗺️ Garden Map (ASCII viz) → 📊 docsmap.yaml (persists)

Replace with a three-bucket flow:

> 📁 Your Repo → `git ls-files` (respects .gitignore) → 3 Buckets discovered:
>
> 🛖 **Shed** — AI tool configs & instructions
> 📚 **Documentation** — docs/, AGENTS.md, root .md files
> 💻 **Codebase** — source directories (most have no docs yet — that's expected)
>
> → 🗺️ Garden Map → 📊 docsmap.yaml (persists)

Also update the sync architecture description. Current text says "Gary reads your AGENTS.md and keeps every AI tool wrapper file in sync." Update to:

> "Gary discovers your entire codebase structure, organises it into three fixed buckets, and keeps your AGENTS.md and all AI tool Shed files in sync. Most codebase areas will have no docs — the garden shows you where the gaps are."

---

## 4. "What Gets Installed" — rename "Tool wrappers" → "Shed files"

Current bullet: "Tool wrappers (CLAUDE.md, .github/copilot-instructions.md, .cursor/rules/agents.mdc, .junie/guidelines.md)"

Change to: "Shed files — AI tool configs auto-discovered and registered (CLAUDE.md, .github/copilot-instructions.md, .cursor/rules/agents.mdc, and any other AI tool configs found in your repo)"

---

## 5. "Meet Gary" — update the terminal output example

Current terminal shows bracket codes `[SE]`, `[HE]`, `[VI]` etc.

Replace the terminal content with:

```
🪴 Gary The Gardener v4.5.0 | 🏞️ Garden Map

☀️ Growing well — solid coverage, room to fill in

| Area            | Plants          | Worms | Dead leaves | Total      |
|-----------------|-----------------|-------|-------------|------------|
| 🛖 Shed         | 🌿 🌿 🌿 🫘 🌱  | —     | —           | 🌿×3 🌱×1 🫘×1 |
| 🌿 Documentation| 🌿 🌿 🌳 🌳 🌿  | 🪱×1  | —           | 🌳×2 🌿×3  |
| 🫘 src/auth/    | —               | —     | —           | —          |
| 🌿 src/api/     | 🌿              | —     | —           | 🌿×1       |
| 🌳 tests/       | 🌳 🌳 🌳        | —     | —           | 🌳×3       |

↘️ [B] Browse area · [S] Summary · [U] Update · [D] Done
```

---

## 6. "New in v3.1" section — rename and rewrite as "New in v4"

Change section heading from "New in v3.1 — See your docs ecosystem at a glance" to "New in v4 — Your repo, mapped"

Change the description from:
> "Gary scans your entire repo, discovers all documentation files, and renders them as an interactive garden map. Track readiness, spot gaps, and watch your docs grow — all from the terminal."

To:
> "Gary maps your entire codebase — not just docs — into three structured buckets: Shed, Documentation, and Codebase. Most code directories will have no docs yet; that's the point. The garden shows you the full coverage picture and lets you choose how granular to go."

Replace the ASCII box garden visualization:

Current:
```
┌─── 🏡 Garden ─────────────────────┐
│ 🌳 AGENTS 🌿 CLAUDE 🌱 STYLE │
│ 🌳 ARCHIT 🌿 SECURI 🫘 DOMAIN │
├─── 🏚️ Shed ───────────────────────┤
│ 🌿 copilot 🌿 cursor 🌿 junie │
│ 🌿 windsurf 🌿 codex · │
├─── 🌳 Greenhouse ─────────────────┤
│ 🌿×12 docs/references/ │
└────────────────────────────────────┘

Legend: 🫘 seed · 🌱 small · 🌿 grown · 🌳 mature · 🪱 issue
```

Replace with the new table format:
```
📊 Repository — 3 buckets discovered

🛖 Shed        — 9 agentic files (CLAUDE.md, .cursor/rules/, ...)
📚 Documentation — 14 files (docs/, AGENTS.md, README.md, ...)
💻 Codebase    — 847 code files across 29 directories

Granularity? [A] Shallow  [B] Standard ← recommended  [C] Deep

Standard (12 areas):
  🛖 Shed (9 files) · 📚 Documentation (14 files)
  src/api/ 74  src/db/ 58  src/auth/ 41  tests/ 87  ...

Run /garden to explore your map
```

Replace the three "Key Features" bullets with:

- **Three Fixed Buckets** — Shed (AI configs), Documentation (knowledge base), Codebase (source dirs). Always present, structurally enforced.
- **Respects .gitignore** — Uses `git ls-files` for discovery. Build outputs, node_modules, and generated dirs never appear as garden areas.
- **Granularity Calibration** — Gary shows real file counts per directory and lets you choose Shallow / Standard / Deep — with actual area names from your repo, not abstract labels.

---

## 7. Skills section — update command names and descriptions

All 7 skill names have changed to use garden metaphors. Update the skill names, icons, and descriptions in the skills table:

| Old name | New name | Icon | Description |
|----------|----------|------|-------------|
| setup | sow | 🌱 | Plant your garden — AGENTS.md, docs/, AI tool configs |
| visualise | map | 🗺️ | See your garden map |
| health | water | 💧 | Quick check — 3 things that need attention |
| audit | tend | 🌿 | Deep scan for drift, quality & Shed sync |
| compact | prune | ✂️ | Trim AGENTS.md to under 150 lines |
| extend | plant | 🌷 | Add a content layer — guardrails, style, domain |
| references | harvest | 🌾 | Fetch llms.txt for your dependencies |

The slash commands follow the same pattern: `/garden-sow`, `/garden-map`, `/garden-water`, `/garden-tend`, `/garden-prune`, `/garden-plant`, `/garden-harvest`.

---

## 8. Use Cases — update "Documentation Visibility" case

Current:
> "Lost track of what docs exist? Run visualise to discover all markdown files, organize them into areas, and get a persistent garden map that updates non-destructively."

Change to:
> "Want to see your full codebase coverage picture? Run visualise to map every source directory into areas — most will be empty (that's expected). Gary shows you where docs exist, where gaps are, and lets you choose how detailed to go."

---

## 9. Footer — update version

Change `v3.1.0` → `v4.5.0` in the footer spec/credits line.

---

## Do NOT change

- Page layout, colour scheme, typography, spacing
- Navigation structure and links
- Installation commands (`npx @pshch/gary-the-gardener`, CLI flags)
- The three "Problems" section (Drift / Fragmentation / Neglect) — still accurate
- Supported AI tools section (Claude Code, Copilot, Cursor, Codex, Junie, Windsurf)
- Footer specs (Zero dependencies, Node.js >= 20, MIT License, npm package name)
- GitHub link
