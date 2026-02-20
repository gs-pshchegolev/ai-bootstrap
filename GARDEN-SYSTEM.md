# Garden System

> 🪴 Gary The Gardener — maps your codebase, maintains AI configurations, and keeps docs honest.

## What is it?

Gary The Gardener is a CLI tool and AI agent that installs into any repo. Once installed, it gives every supported AI tool (Claude Code, Copilot, Cursor, Codex, Junie, Windsurf) a shared gardener agent and 7 maintenance commands.

The garden is a persistent map of your codebase — three fixed buckets (Shed · Documentation · Codebase), rendered as a compact table that updates as your repo grows.

## 7 Commands

| Command | What it does |
|---------|-------------|
| `/garden-setup` 🌱 | First-time setup — AGENTS.md, docs/, AI tool configs |
| `/garden-map` 🗺️ | See the garden map — all areas and readiness |
| `/garden-health` 🩺 | Quick scan, 3 improvement suggestions |
| `/garden-inspect` 🔍 | Deep scan — drift, quality issues, Shed sync |
| `/garden-prune` ✂️ | Trim AGENTS.md to under 150 lines |
| `/garden-plant` 🌷 | Add a content layer — guardrails, style, domain |
| `/garden-research` 📚 | Fetch llms.txt for dependencies |

## Hub

**Claude Code:** `/gardener-gary` — opens the interactive hub, lists all 7 commands.

**GitHub Copilot:** `@gardener-gary` in VS Code Copilot Chat — activates Gary directly.

**Cursor / Windsurf / Junie:** Agent is always loaded via the tool's config files.

## Documentation

- **[Installation Guide](GARDEN-INSTALLATION.md)** — first-time setup
- **[Usage Guide](GARDEN-GUIDE.md)** — commands, garden map, maintenance patterns
- **[CHANGELOG](_gary-the-gardener/CHANGELOG.md)** — version history

## Version

Check: `cat _gary-the-gardener/VERSION`

🪴 Happy gardening!
