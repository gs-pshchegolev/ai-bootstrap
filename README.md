# 🪴 Gary The Gardener

**Your AI documentation stays fresh, synced, and healthy — automatically.**

One CLI command. One source of truth. Every AI tool in sync.

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

Gary maintains **AGENTS.md** as a single source of truth and syncs it to every AI tool's native config format:

```
                    AGENTS.md
                   (source of truth)
                        │
        ┌───────┬───────┼───────┬───────┐
        ▼       ▼       ▼       ▼       ▼
   CLAUDE.md  .cursor/  .github/  .windsurf/  .junie/
              rules/    agents/   rules/      guidelines.md
```

When code changes, Gary detects drift, fixes stale references, and keeps every wrapper file accurate — so your AI tools never hallucinate about your codebase.

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
| `_gs-gardener/` | Core garden system engine (workflows, agent, config) |
| `AGENTS.md` | Single source of truth for all AI tools (created via `/garden-bootstrap`) |
| `.aiignore` | Keeps secrets and large files out of AI context |
| Tool wrappers | Native config files for each selected AI tool |

## Supported Tools

| Tool | Config path | Detection |
|------|------------|-----------|
| Claude Code | `CLAUDE.md` + `.claude/commands/` | `.claude/` |
| Cursor | `.cursor/rules/agents.mdc` | `.cursor/`, `.cursorrules` |
| GitHub Copilot | `.github/agents/gardener.md` | `.github/` |
| Windsurf | `.windsurf/rules/garden-agent-gardener.md` | `.windsurfrules`, `.windsurf/` |
| JetBrains Junie | `.junie/guidelines.md` | `.junie/` |

## 10 Maintenance Skills

Run these as slash commands inside your AI tool:

| Command | What it does |
|---------|-------------|
| `/garden-bootstrap` | 🌱 First-time setup — generates AGENTS.md from your codebase |
| `/garden-audit` | 🔍 Detects drift between docs and actual code |
| `/garden-sync` | 💧 Syncs all wrapper files with AGENTS.md |
| `/garden-compact` | ✂️ Compresses AGENTS.md under 150 lines without losing facts |
| `/garden-maintain` | 🌿 Fixes staleness, broken links, orphaned files |
| `/garden-extend` | 🌻 Adds guardrails, golden principles, style guides |
| `/garden-references` | 📚 Fetches and stores llms.txt for key dependencies |
| `/garden-scaffold` | 🏗️ Sets up `docs/` knowledge base structure |
| `/garden-add-tool` | 🔧 Generates config for a new AI tool |
| `/garden-help` | ❓ Shows what to do next |

## Quick Start

```bash
# 1. Install Gary into your repo
npx @pshch/gary-the-gardener

# 2. Open your AI tool and run:
/garden-bootstrap    # Creates AGENTS.md from your codebase
/garden-audit        # Verifies accuracy
/garden-extend       # Adds guardrails & principles
```

## Use Cases

**New project** — One command generates AGENTS.md from your codebase and creates wrapper files for every AI tool your team uses.

**Post-refactor** — `/garden-audit` finds every stale reference so your AI tools don't hallucinate about files that no longer exist.

**Multi-tool team** — One AGENTS.md, synced to each tool's native format. No more config drift between editors.

**Context bloat** — `/garden-compact` compresses AGENTS.md under 150 lines, removing verbosity while preserving every fact.

## Technical Details

- **Zero dependencies** — pure Node.js built-ins only
- **Node.js ≥ 20.11.0**
- **ESM** — ships as source, no build step
- **MIT License**

## Links

- [Landing page](https://v0-gary-the-gardener.vercel.app/)
- [GitHub](https://github.com/pshch/ai-bootstrap)
- [npm](https://www.npmjs.com/package/@pshch/gary-the-gardener)

---

*Every repository is a garden. Code grows. Docs decay. Drift creeps in like weeds. Gary tends to what others forget.*
