# 🪴 Gary The Gardener

**AI documentation agent that maps your codebase, catches drift, and keeps every AI tool in sync.**

[![npm](https://img.shields.io/npm/v/@pshch/gary-the-gardener)](https://www.npmjs.com/package/@pshch/gary-the-gardener)
[![license](https://img.shields.io/npm/l/@pshch/gary-the-gardener)](LICENSE)
[![node](https://img.shields.io/node/v/@pshch/gary-the-gardener)](package.json)

```bash
npx @pshch/gary-the-gardener
```

---

## What you get

Run `/garden-map` in your AI tool to see your repo's documentation coverage at a glance:

```
🪴 Gary The Gardener v5.2.4 | 🗺️ Garden Map
══════════════════════════════════════════
```

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 Shed &nbsp;&nbsp;`/` | 🌳 🌿 🌿 🌱 | · | 🌳×1 🌿×2 🌱×1 |
| 📚 Docs &nbsp;&nbsp;`/` | 🌳 🌿 🌿 | · | 🌳×1 🌿×2 |
| **src/** | | | |
| 🌐 API &nbsp;&nbsp;`src/api/` | 🌿 🌳 🌿 | · | 🌳×1 🌿×2 |
| 🏗️ Core &nbsp;&nbsp;`src/core/` | 🌿 🌱 🌱 | 🪱×1 | 🌿×1 🌱×2 |
| 🎛️ Config &nbsp;&nbsp;`src/config/` | 🌱 | · | 🌱×1 |
| 🔧 Utils &nbsp;&nbsp;`src/utils/` | · | · | · |
| **tests/** | | | |
| 🧪 Tests &nbsp;&nbsp;`tests/` | 🌿 🌿 | · | 🌿×2 |

```
Season: mostly 🌿 grown  ·  1 🪱 worm  ·  1 uncovered area
🌸 3 good moments in this garden
```

> **Readiness:** 🌱 small (≤10 lines) · 🌿 grown · 🌳 mature
> **Issues:** 🪱 doc contradicts code · 🍂 doc describes something gone
> **Empty area** (`·`) = honest coverage gap — not an error

---

## The problem

| | What happens | Result |
|---|---|---|
| **Drift** | Code changes, AI docs don't | Agents hallucinate about files that no longer exist |
| **Fragmentation** | Each tool has its own config | They fall out of sync — "works in my editor" surprises |
| **Neglect** | Nobody updates the docs | They rot silently until AI output degrades |

Gary maintains a single **garden map** (`docsmap.yaml` + `garden.md`) that persists across sessions. Every AI tool reads from the same source of truth.

---

## Quick start

```bash
# 1. Install Gary into your repo
npx @pshch/gary-the-gardener

# 2. Open your AI tool and run:
/garden-setup    # Map your codebase, create AGENTS.md
/garden-map      # See coverage at a glance
/garden-inspect  # Find drift and stale docs
```

For Claude Code and GitHub Copilot, the hub shows all commands:

| Tool | How to open Gary |
|------|-----------------|
| Claude Code | `/gardener-gary` |
| GitHub Copilot | `@gardener-gary` |
| Cursor / Windsurf / Junie | Always active — no invocation needed |

---

## How it works

Gary discovers your repo using `git ls-files` (respects `.gitignore`) and organises everything into three fixed buckets:

```
📁 Your Repo
  ↓  git ls-files
  🛖 Shed          — AI tool configs, agent files, instruction files
  📚 Documentation  — docs/ directory and root .md files
  💻 Codebase       — source directories (empty areas are expected and honest)
  ↓
  🗺️ Garden Map     — docsmap.yaml + garden.md, persists across sessions
```

The map is **read-only by default** — `/garden-map` never modifies your garden layout. Only explicit update commands write back, and only additively.

---

## 7 maintenance commands

Run these as slash commands inside your AI tool:

| Command | What it does |
|---------|-------------|
| `/garden-setup` 🌱 | First-time setup — garden map, AGENTS.md, docs/, Shed files |
| `/garden-map` 🗺️ | See the full garden map — areas, readiness, folder groups |
| `/garden-health` 🩺 | Quick scan — 3 prioritised improvement suggestions |
| `/garden-inspect` 🔍 | Deep scan — finds drift, dead docs, and Shed gaps |
| `/garden-prune` ✂️ | Compress AGENTS.md to under 150 lines without losing facts |
| `/garden-plant` 🌷 | Add a content layer — guardrails, style, domain knowledge |
| `/garden-research` 📚 | Fetch and store llms.txt for key dependencies |

---

## Supported tools

| Tool | Config installed | Invoke Gary |
|------|-----------------|-------------|
| Claude Code | `CLAUDE.md` + `.claude/commands/` | `/gardener-gary` |
| GitHub Copilot | `.github/agents/gardener-gary.md` | `@gardener-gary` |
| Cursor | `.cursor/rules/garden-agent-gardener.mdc` | Always active |
| Windsurf | `.windsurf/rules/garden-agent-gardener.md` | Always active |
| JetBrains Junie | `.junie/guidelines.md` | Always active |

---

## Use cases

**New project** — `/garden-setup` maps your entire codebase with real file counts. Pick your coverage depth. AGENTS.md gets created and committed.

**Post-refactor** — `/garden-inspect` finds every worm (doc contradicts code) and dead leaf (doc describes something gone) so AI tools never hallucinate about your codebase.

**Multi-tool team** — One AGENTS.md, Shed files in sync for every tool. Claude Code, Copilot, Cursor — all see the same garden.

**Context bloat** — `/garden-prune` compresses AGENTS.md under 150 lines, removing verbosity while preserving every fact.

---

## Install options

```bash
npx @pshch/gary-the-gardener                      # interactive — auto-detects tools
npx @pshch/gary-the-gardener install -t copilot   # specific tool only
npx @pshch/gary-the-gardener update               # upgrade existing installation
npx @pshch/gary-the-gardener --dry-run            # preview without writing files
npx @pshch/gary-the-gardener status               # check what's installed
```

**Zero runtime dependencies** · Node.js ≥ 20.11.0 · ESM · MIT

---

*Every repository is a garden. Code grows. Docs decay. Drift creeps in like weeds. Gary tends to what others forget.*
