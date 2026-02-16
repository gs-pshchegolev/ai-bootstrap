# Gary The Gardener

> CLI tool and AI agent system that maintains documentation and configuration for AI coding tools (Claude, Copilot, Cursor, Codex, Junie, Windsurf).

## Tech Stack

JavaScript (Node.js ESM) · Zero dependencies · npm
Node.js >= 20.11.0

## Project Structure

```
bin/cli.js                    # CLI entry point (install, status)
_gs-gardener/                 # Garden system (core product)
  core/
    agents/gardener.md        # Gardener agent persona
    config.yaml               # Default configuration
    workflows/ (10 dirs)      # bootstrap, audit, sync, etc.
  _config/                    # Config templates
  VERSION, CHANGELOG.md
_bmad/                        # BMAD multi-agent system (separate)
.claude/commands/ (87 files)  # Claude Code skill commands
.cursor/
  commands/ (20 files)        # Cursor commands
  rules/                      # Cursor rules
.github/agents/ (21 files)    # GitHub Copilot agents
.codex/prompts/ (20 files)    # Codex prompts
templates/wrappers/           # Wrapper templates
GARDEN-*.md                   # System documentation
```

## Development

| Task | Command |
|------|---------|
| Run CLI | `node bin/cli.js` |
| Run via npx | `npx @pshch/gary-the-gardener` |
| Install (default) | `gary-the-gardener install` |
| Status check | `gary-the-gardener status` |
| Dry run | `gary-the-gardener --dry-run` |
| Force reinstall | `gary-the-gardener -f` |

No build, test, or lint steps. The package ships source directly.
Publish requires `NPM_TOKEN` environment variable.

## Architecture

The CLI (`bin/cli.js`) is the sole entry point with two commands:

- **install** (default): Copies `_gs-gardener/` into target repo, creates `.aiignore`, installs tool-specific agent files, and writes garden skill commands
- **status**: Reports which garden components are installed in the current directory

The **Garden System** (`_gs-gardener/core/`) is the core product:
- **Workflows** (10): bootstrap, audit, sync, compact, extend, maintain, references, scaffold, add-tool, help
- **Agent**: `gardener.md` — the interactive gardener persona
- **Config**: `config.yaml` — project settings, coverage tracking, constraints

Supported AI tools: Claude Code, Cursor, GitHub Copilot, Windsurf, JetBrains Junie.

## Key Conventions

- Published as `@pshch/gary-the-gardener` on npm
- Zero runtime dependencies — uses only Node.js built-ins (`node:util`, `node:fs`, `node:path`, `node:readline`)
- Garden system version tracked in `_gs-gardener/VERSION` (currently 1.5.0)
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
