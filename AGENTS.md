# Gary The Gardener

> CLI tool and AI agent system that maintains documentation and configuration for AI coding tools (Claude, Copilot, Cursor, Codex, Junie, Windsurf).
>
> **This repo is self-hosted** — Gary The Gardener maintains its own source code, like a compiler written in the language it compiles.

## Tech Stack

JavaScript (Node.js ESM) · @inquirer/prompts · npm
Node.js >= 20.11.0

## Project Structure

```
bin/cli.js                    # CLI entry point (install, update, status, doctor)
_gs-gardener/                 # Garden system (core product)
  core/
    agents/gardener.md        # Gardener agent persona
    config.yaml               # Default configuration
    workflows/ (10 dirs)      # bootstrap, audit, sync, etc.
  _config/                    # Config templates
  VERSION, CHANGELOG.md
_bmad/                        # BMAD multi-agent system (separate)
.claude/commands/ (84 files)  # Claude Code skill commands
.cursor/
  commands/ (76 files)        # Cursor commands
  rules/                      # Cursor rules
.github/agents/ (21 files)    # GitHub Copilot agents
.codex/prompts/ (76 files)    # Codex prompts
templates/wrappers/           # Wrapper templates
GARDEN-*.md                   # System documentation
```

## Development

| Task | Command |
|------|---------|
| Run CLI | `node bin/cli.js` |
| Run via npx | `npx @pshch/gary-the-gardener` |
| Install | `gary-the-gardener install` |
| Update | `gary-the-gardener update` |
| Status check | `gary-the-gardener status` |
| Doctor | `gary-the-gardener doctor` |
| Dry run | `gary-the-gardener install --dry-run` |
| Force reinstall | `gary-the-gardener install -f` |

No build, test, or lint steps. The package ships source directly.
Publish requires `NPM_TOKEN` environment variable.

## Architecture

The CLI (`bin/cli.js`) is the sole entry point with four commands:

- **install**: First-time setup — copies `_gs-gardener/` into target repo, creates `.aiignore`, installs tool-specific agent files, and writes garden skill commands
- **update**: Upgrades an existing installation to the latest version
- **status**: Reports which garden components are installed in the current directory
- **doctor**: Validates installation health (version consistency, required files)

When no command is given, an interactive menu is shown (using `@inquirer/prompts`).

The **Garden System** (`_gs-gardener/core/`) is the core product:
- **Workflows** (7): audit, compact, extend, health, references, setup, visualise
- **Agent**: `gardener.md` — the interactive gardener persona
- **Config**: `config.yaml` — project settings, coverage tracking, constraints

Supported AI tools: Claude Code, Cursor, GitHub Copilot, JetBrains Junie.

## Key Conventions

- Published as `@pshch/gary-the-gardener` on npm
- Single runtime dependency (`@inquirer/prompts`) for interactive CLI UI
- Garden system version tracked in `_gs-gardener/VERSION` (currently 4.4.0)
- Commands distributed as `.md` files in tool-specific directories
- AGENTS.md max line limit: 150 lines (enforced by garden system)
- `.npmrc` contains auth token reference — never commit actual tokens

## Further Reading

- `docs/ARCHITECTURE.md` — detailed architecture and domain boundaries
- `docs/core-beliefs.md` — golden principles and operating rules
- `docs/references/` — llms.txt files for key dependencies
- [GARDEN-SYSTEM.md](GARDEN-SYSTEM.md) — garden system overview
- [GARDEN-GUIDE.md](GARDEN-GUIDE.md) — complete usage guide
- [GARDEN-INSTALLATION.md](GARDEN-INSTALLATION.md) — installation guide
