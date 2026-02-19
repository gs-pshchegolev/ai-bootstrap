# 🪴 Gary The Gardener

**Maps your codebase, keeps AI docs honest, and stays in sync across every AI tool.**

One CLI command. One garden map. Every AI tool knows your repo.

```bash
npx @pshch/gary-the-gardener
```

## The Problem

| | What happens | Result |
|---|---|---|
| **Drift** | Code changes but AI docs don't | Agents hallucinate about files that no longer exist |
| **Fragmentation** | Each tool has its own config file | They fall out of sync — "works in my editor" surprises |
| **Neglect** | Nobody remembers to update docs | They rot silently until AI output degrades |

## How It Works

Gary discovers your repo structure and organises it into three fixed buckets:

```
📁 Your Repo → git ls-files (respects .gitignore)
  ↓
  🛖 Shed        — AI tool configs & agent files
  📚 Documentation  — docs/, root .md files
  💻 Codebase    — source directories (most have no docs yet — expected)
  ↓
  🗺️ Garden Map (docsmap.yaml + garden.md — persists across sessions)
```

The garden map shows readiness at a glance and groups areas by folder:

```
| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 Shed /          | 🌳 🌿 🌿 🌱 | · | 🌳×1 🌿×2 🌱×1 |
| 📚 Docs /          | 🌳 🌿 🌿    | · | 🌳×1 🌿×2      |
| **src/**           |             |   |                 |
| 🌐 API  src/api/   | 🌿 🌳       | · | 🌳×1 🌿×1      |
| 🌳 Domain  src/    | 🌿 🌱 🌱    | · | 🌿×1 🌱×2      |
| **tests/**         |             |   |                 |
| 🧪 Tests  tests/   | 🌿 🌿       | · | 🌿×2            |
```

## Install

```bash
# Interactive — auto-detects your AI tools, lets you pick
npx @pshch/gary-the-gardener

# Specific tools only
npx @pshch/gary-the-gardener --tools cursor,copilot

# Preview without writing
npx @pshch/gary-the-gardener --dry-run

# Force reinstall
npx @pshch/gary-the-gardener -f

# Check what's installed
npx @pshch/gary-the-gardener status
```

**What gets installed:**

| File | Purpose |
|------|---------|
| `_gary-the-gardener/` | Core garden system (workflows, agent, config, garden state) |
| `AGENTS.md` | Single source of truth for all AI tools (created via `/garden-setup`) |
| `.aiignore` | Keeps secrets and large files out of AI context |
| Shed files | Native config files for each selected AI tool |

## Supported Tools

| Tool | Config path | Invoke Gary |
|------|------------|-------------|
| Claude Code | `CLAUDE.md` + `.claude/commands/` | `/garden` |
| Cursor | `.cursor/rules/garden-agent-gardener.mdc` | Always active |
| GitHub Copilot | `.github/agents/gardener-gary.md` | `@gardener-gary` |
| Windsurf | `.windsurf/rules/garden-agent-gardener.md` | Always active |
| JetBrains Junie | `.junie/guidelines.md` | Always active |

## 7 Maintenance Commands

Run these as slash commands inside your AI tool:

| Command | What it does |
|---------|-------------|
| `/garden-setup` 🌱 | First-time setup — garden map, AGENTS.md, docs/, Shed files |
| `/garden-map` 🗺️ | See the full garden map — areas, readiness, folder groups |
| `/garden-health` 🩺 | Quick scan — 3 prioritised improvement suggestions |
| `/garden-inspect` 🔍 | Deep scan — finds drift, dead docs, and Shed gaps |
| `/garden-prune` ✂️ | Compress AGENTS.md under 150 lines without losing facts |
| `/garden-plant` 🌷 | Add a content layer — guardrails, style, domain knowledge |
| `/garden-research` 📚 | Fetch and store llms.txt for key dependencies |

## Quick Start

```bash
# 1. Install Gary into your repo
npx @pshch/gary-the-gardener

# 2. Open your AI tool and run:
/garden-setup    # Maps your codebase, creates AGENTS.md
/garden-map      # See your garden — coverage at a glance
/garden-inspect  # Find drift and stale docs
```

## Use Cases

**New project** — `/garden-setup` maps your entire codebase into Shed, Documentation, and Codebase buckets with real file counts. Pick your coverage depth. AGENTS.md gets created.

**Post-refactor** — `/garden-inspect` finds every worm (doc contradicts code) and dead leaf (doc describes something gone) so AI tools never hallucinate about your codebase.

**Multi-tool team** — One AGENTS.md, Shed files in sync for every tool. Claude Code, Copilot, Cursor — all see the same garden.

**Context bloat** — `/garden-prune` compresses AGENTS.md under 150 lines, removing verbosity while preserving every fact.

## Technical Details

- **Zero runtime dependencies** — pure Node.js built-ins only
- **Node.js ≥ 20.11.0**
- **ESM** — ships as source, no build step
- **MIT License**

## Links

- [Landing page](https://v0-gary-the-gardener.vercel.app/)
- [GitHub](https://github.com/pshch/ai-bootstrap)
- [npm](https://www.npmjs.com/package/@pshch/gary-the-gardener)

---

*Every repository is a garden. Code grows. Docs decay. Drift creeps in like weeds. Gary tends to what others forget.*
