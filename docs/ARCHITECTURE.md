# Architecture

## Overview

Gary The Gardener is an npm-distributed CLI tool that installs and maintains AI agent configuration across repositories. It operates in two contexts:

1. **As a CLI installer** — `npx @pshch/gary-the-gardener` copies the garden system into target repos
2. **As a runtime agent system** — the installed garden system provides maintenance workflows via AI tool commands

## Self-Hosting (Dogfooding)

This repository is self-hosted: Gary The Gardener maintains its own source code. Like a compiler written in the language it compiles, or a text editor used to develop itself, the garden system is installed into the very repo that defines it.

Concretely this means:
- The `AGENTS.md`, `CLAUDE.md`, and other wrapper files in this repo are maintained **by** the garden workflows they ship
- Running `/garden-audit` here audits the gardener's own documentation against its own code
- Running `/garden-sync` here syncs the gardener's own wrapper files
- Any bug in a workflow surfaces immediately because the workflow runs on itself

This creates a tight feedback loop: if a workflow produces bad output, the developers experience it firsthand before any user does. It also serves as a living integration test — if the garden system can keep its own repo healthy, it can keep yours healthy too.

## Entry Point

`bin/cli.js` is the sole entry point. Uses `@inquirer/prompts` for interactive UI (select menu, checkbox).

### Commands

| Command | Purpose |
|---------|---------|
| _(none)_ | Interactive menu — pick install, update, status, or doctor |
| `install` | First-time setup — copy garden system, install tool agents, create `.aiignore` |
| `update` | Upgrade existing installation to latest version |
| `status` | Report installed components |
| `doctor` | Verify installation health (version, required files, workflows) |

### Install / Update Flow

1. Guard: `install` rejects if already installed (suggests `update`); `update` rejects if not installed (suggests `install`)
2. Detect existing installation and version
3. Copy `_gary-the-gardener/` to target (preserving config on upgrade)
4. Create `.aiignore` if missing
5. Detect or prompt for AI tool selection (inquirer checkbox)
6. Install tool-specific agent files
7. For Claude Code: also copy skill command files (`.claude/commands/garden-*.md`)
8. Write `config.yaml` for fresh installs

## Garden System (`_gary-the-gardener/`)

The core product. A collection of markdown files that define:

### Workflows (`core/workflows/`)

Each workflow is a self-contained set of instructions for an AI agent:

| Workflow | Purpose |
|----------|---------|
| `audit` | Deep scan for drift, quality issues, and wrapper sync problems |
| `compact` | Compress AGENTS.md while preserving all facts (target: under 150 lines) |
| `extend` | Add content layers (guardrails, principles, style, domain knowledge) |
| `health` | Scan the full docs ecosystem and produce 3 actionable suggestions |
| `references` | Fetch and manage dependency reference documentation (llms.txt files) |
| `setup` | Bootstrap AGENTS.md, scaffold docs/, or add tool wrappers |
| `visualise` | Full-repo discovery — renders documentation as a compact garden map |

### Agent (`core/agents/gardener.md`)

Interactive persona with menu-driven maintenance interface.

### Configuration (`core/config.yaml`)

Per-project settings: project name, file paths, coverage tracking, line constraints.

## Tool Integration

The CLI generates tool-specific files that reference the garden system:

| Tool | Agent File | Commands |
|------|-----------|----------|
| Claude Code | `CLAUDE.md` | `.claude/commands/garden-*.md` (11 skills) |
| Cursor | `.cursor/rules/garden-agent-gardener.mdc` | `.cursor/commands/` |
| GitHub Copilot | `.github/agents/gardener.md` | `.github/agents/` |
| JetBrains Junie | `.junie/guidelines.md` | — |

## Distribution

- Published to npm as `@pshch/gary-the-gardener`
- The `files` field in package.json ships: `bin/`, `_gary-the-gardener/`, `.claude/commands/garden-*.md`, `templates/`
- No build step — source JavaScript is distributed directly
