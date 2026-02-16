# Architecture

## Overview

Gary The Gardener is an npm-distributed CLI tool that installs and maintains AI agent configuration across repositories. It operates in two contexts:

1. **As a CLI installer** — `npx @pshch/gary-the-gardener` copies the garden system into target repos
2. **As a runtime agent system** — the installed garden system provides maintenance workflows via AI tool commands

## Entry Point

`bin/cli.js` is the sole entry point. It uses Node.js built-ins only (no dependencies).

### Commands

| Command | Purpose |
|---------|---------|
| `install` (default) | Copy garden system, install tool agents, create `.aiignore` |
| `status` | Report installed components |

### Install Flow

1. Detect existing installation and version
2. Copy `_gs-gardener/` to target (preserving config on upgrade)
3. Create `.aiignore` if missing
4. Detect or prompt for AI tool selection
5. Install tool-specific agent files
6. For Claude Code: also copy skill command files (`.claude/commands/garden-*.md`)
7. Write `config.yaml` for fresh installs

## Garden System (`_gs-gardener/`)

The core product. A collection of markdown files that define:

### Workflows (`core/workflows/`)

Each workflow is a self-contained set of instructions for an AI agent:

| Workflow | Purpose |
|----------|---------|
| `bootstrap` | First-time AGENTS.md generation |
| `audit` | Detect drift between docs and code |
| `sync` | Keep wrapper files aligned with AGENTS.md |
| `compact` | Reduce AGENTS.md verbosity (target: 150 lines) |
| `extend` | Add content layers (guardrails, principles, style) |
| `maintain` | Find and fix documentation issues |
| `references` | Fetch llms.txt for dependencies |
| `scaffold` | Set up docs/ knowledge base structure |
| `add-tool` | Add support for new AI tools |
| `help` | Guide users to the right workflow |

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
| Windsurf | `.windsurf/rules/garden-agent-gardener.md` | — |
| JetBrains Junie | `.junie/guidelines.md` | — |

## Distribution

- Published to npm as `@pshch/gary-the-gardener`
- The `files` field in package.json ships: `bin/`, `_gs-gardener/`, `.claude/commands/garden-*.md`, `templates/`
- No build step — source JavaScript is distributed directly
