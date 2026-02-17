# Changelog

All notable changes to the Garden System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-02-17

### Changed
- **Migrated interactive prompts to @inquirer/prompts** — replaced custom readline-based tool selection with standard `checkbox` UI; default invocation now shows a `select` menu
- **Restructured CLI into explicit commands** — `install`, `update`, `status`, `doctor` instead of defaulting to install
- **Split install/update logic** — `install` is for first-time setup (rejects if already installed), `update` is for upgrades (rejects if not installed); shared core via `runSetup()`
- **Updated "Zero Dependencies" core belief** — now "Minimal Dependencies" to reflect the single `@inquirer/prompts` dependency

### Added
- **`update` command** — explicit upgrade path, separated from `install`
- **`doctor` command** — validates installation health (core system, version consistency, config.yaml, AGENTS.md, .aiignore, workflows)
- **Interactive menu** — when no command is given, shows a context-aware select prompt (smart default based on install state)
- **Non-TTY smart fallback** — piped invocations auto-detect whether to install or update

### Removed
- **Custom readline prompt loop** — replaced by @inquirer/prompts checkbox with standard keyboard navigation (arrow keys, space to toggle)

---

## [1.5.0] - 2026-02-16

### Changed
- **Claude Code is now an optional tool** — appears in the interactive selection menu alongside Cursor, Copilot, Windsurf, and Junie instead of being always installed
- **Non-TTY installs auto-detect tools** — uses detected tools instead of hardcoding Claude Code

---

## [1.4.2] - 2026-02-16

### Fixed
- **mkdir error on existing directories** - Install no longer fails when target repo already has `.cursor/`, `.github/`, etc.
- **Removed `claude` prefix from slash commands** - Commands are now tool-agnostic (`/garden-audit` not `claude /garden-audit`) across all guide files

### Added
- **"Next steps" section** after install — guides users to `/garden-bootstrap`, `/garden-audit`, `/garden-extend`

---

## [1.4.1] - 2026-02-16

### Changed
- **Renamed "Gardner Gary" to "🪴 Gary The Gardener"** - Consistent naming with emoji across all files
- **Fixed syntax error** in CLI help output template literal

---

## [1.1.0] - 2026-02-15

### Added
- **Fast help workflow** - Instant response with top 5 commands (no upfront I/O operations)
- **Contextual "What should I do next?" suggestions** - Option 6 in help menu analyzes repo state on-demand
- **Bootstrap detection** - Help workflow detects missing AGENTS.md and guides users to bootstrap first
- **`/garden-bootstrap` command** - First-time setup workflow (converted from ai-bootstrapper.md)
- **[BS] Bootstrap menu item** - Conditional display in 🪴 Gary The Gardener when AGENTS.md is missing
- **Progressive disclosure** - Help menu offers option 7 to show all 9 commands

### Changed
- **`/garden-garden` renamed to `/garden-maintain`** - Clearer command name (no longer self-referential)
- **Workflow directory renamed** - `_gs-gardener/core/workflows/garden/` → `_gs-gardener/core/workflows/maintain/`
- **Help workflow structure** - Now defers heavy I/O checks to contextual analysis (Phase 4)
- **🪴 Gary The Gardener menu** - Shows 9 options when AGENTS.md missing, 8 when it exists
- **Bootstrap integration** - ai-bootstrapper.md converted to standard garden workflow

### Fixed
- **Incorrect `/gardener` references** - Corrected to `/garden-agent-gardener` throughout
- **Help workflow performance** - Reduced from 3 I/O operations to 1 upfront (instant response)
- **Command descriptions** - Updated all references to use new naming conventions

### Technical Details
- Help workflow: 315 lines → 423 lines (but much faster - only 1 file check upfront)
- Bootstrap workflow: New 340-line workflow file created
- Version bump: 1.0.0 → 1.1.0 (semantic versioning - backward compatible new features)

---

## [1.0.0] - 2026-02-15

### Added
- Initial release of Garden System
- 🪴 Gary The Gardener 🪴 - Interactive Repository Garden Keeper subagent
- 9 maintenance skills:
  - `/garden-sync` - Sync wrappers with AGENTS.md
  - `/garden-audit` - Audit for drift between docs and code
  - `/garden-extend` - Add content layers (guardrails, principles, style, domain)
  - `/garden-references` - Fetch and manage dependency documentation (llms.txt)
  - `/garden-add-tool` - Add support for new AI tools
  - `/garden-scaffold` - Set up docs/ knowledge base structure
  - `/garden-garden` - Find and fix documentation issues
  - `/garden-compact` - Compress AGENTS.md while preserving facts
  - `/garden-help` - Get help understanding when to use each skill
- Configuration system (`_gs-gardener/core/config.yaml`)
- Workflow-based architecture (8 workflows)
- Coverage status tracking
- Version tracking (`_gs-gardener/VERSION`)

### Philosophy
- Progressive disclosure - Start simple, reveal complexity as needed
- Report before acting - Always show findings before making changes
- Preserve facts - Compress verbosity, never lose information
- Gardening metaphor - Documentation needs care, pruning, and nurturing
