# Changelog

All notable changes to the Garden System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.5.0] - 2026-02-19

### Changed
- **Three-bucket garden structure** — the garden now always has exactly three fixed top-level sections: **Shed** (agentic files), **Documentation** (`/docs` + root `.md` files), and **Codebase** (source directories). These are structural, not user-defined.
- **Plant the Garden Step 1** — renamed "Full Repository Discovery — Three Buckets"; restructured into three explicit sub-steps: 1a (Shed via `shed_patterns`), 1b (Documentation via `docs/` + root `.md`), 1c (Codebase via `git ls-files` analysis)
- **Granularity Calibration (Step 1.5)** — scoped to **Codebase bucket only**; repo summary now shows all three buckets upfront; the user question is specifically about Codebase depth. Shed and Documentation are always single fixed areas.
- **Step 1.5 preview format** — updated to show "Fixed:" section (Shed + Documentation) above the Codebase area list, so the user sees the full garden shape at calibration time
- **Carry-forward rules (Step 2)** — explicitly state the three-bucket enforcement: Shed = 1 area, Documentation = 1 area (or optionally split into Core Docs + docs/ if both substantial), Codebase = 1-N areas
- **Rendering Contract example** — updated table example to show realistic three-bucket layout (Shed row, Documentation row, Codebase area rows)

---

## [4.4.0] - 2026-02-18

### Added
- **gitignore support** — `git ls-files` replaces manual directory walk as primary file enumeration; automatically respects `.gitignore`, `.gitmodules`, and submodules. `find` fallback used only for non-git repos with `discovery_exclude` applied manually
- **Granularity Calibration (Step 1.5)** — new step in Plant the Garden: after directory analysis, Gary shows real repo stats (file counts, subdirs per top-level dir) and presents three concrete options (Shallow / Standard / Deep) with actual computed area counts — not abstract labels
- **CLI-based directory analysis** — three shell commands run after enumeration: level-1 breakdown (top dirs by file count), level-2 breakdown (large dirs with meaningful subdirs), per-dir drill for dirs with >50 files
- **Split-candidate rule** — a directory is a split candidate if it has ≥3 subdirectories each containing ≥5 files; used to compute Standard and Deep option area counts
- **Execution Hints table** — added `git ls-files` row for file enumeration
- **Update Scan C uses git ls-files** — uncovered code dir detection in Update Garden now uses `git ls-files` instead of manual walk

### Changed
- **Plant the Garden Step 2** — simplified to confirmation-only step; area groupings are now determined in Step 1.5 (Granularity Calibration), not proposed fresh in Step 2
- **`discovery_exclude`** — now only supplements `.gitignore` for non-git repos or additional project-specific paths; in git repos, `git ls-files` handles exclusions entirely

---

## [4.3.0] - 2026-02-18

### Changed
- **Update Garden Scan C** — made even more explicitly mandatory with stronger language; no longer presented as an "also" clause — it is a required scan every Update run
- **Update Garden Step 7** — replaced `[R]` re-plant action with `[A]` direct area addition: Gary proposes label/emoji, confirms with user, then appends the new empty area directly to `docsmap.yaml` without destroying existing garden state

---

## [4.2.0] - 2026-02-18

### Added
- **`shed_patterns`** — 13 glob patterns in `config.yaml` for auto-discovery of agentic files: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.claude/commands/**/*.md`, `.claude/hooks/**/*`, `.cursor/rules/**/*.mdc`, `.cursor/rules/**/*.md`, `.github/copilot-instructions.md`, `.github/agents/**/*.md`, `.junie/**/*.md`, `.windsurf/rules/**/*`, `.aider/**/*`
- **Shed discovery in Plant the Garden** — Step 1 now scans `shed_patterns` + `shed_files` to find all agentic infrastructure files before proposing areas
- **Untracked Shed file detection in Audit** — audit workflow checks for files on disk matching `shed_patterns` that are not yet in `config.yaml → shed_files` and offers to register them

### Changed
- **Audit workflow** — "Wrappers" section renamed to "Shed (sync correctness)"; added rule: never modify `AGENTS.md` itself during Shed sync
- **`docsmap.yaml`** — area `wrappers` → `shed`, label "Shed", all entity `type: wrapper` → `type: shed`, all `area: wrappers` → `area: shed`
- **`garden.md`** — "Wrappers" row renamed to "Shed"
- **`config.yaml`** — `wrapper_files` → `shed_files`

---

## [4.1.0] - 2026-02-18

### Added
- **Code-directory-centric areas** — garden areas are now derived from CODE directory structure, not doc file locations; most areas will have no documentation by design — the garden is a coverage map
- **0-entity areas** — areas with no entities are first-class garden citizens: rendered with `—` in Plants and Total columns; excluded from Season Mood Line percentage calculation
- **Shed concept** — "Wrappers" renamed to "Shed" throughout: agentic infrastructure (AI instructions, tool configs, skills, agent definitions). All terminology updated across workflows, config, and data files
- **Update Garden three-scan structure** — Step 1 restructured into three explicitly named mandatory scans: A (existing area globs), B (untracked `.md` files), C (uncovered code directories)
- **Plant the Garden triggered from Setup** — Full Setup path now runs Plant the Garden sub-flow as Step 4 after generating files

### Changed
- **Plant the Garden Step 1** — now labeled "Code Directory Discovery"; discovers code dirs as area candidates, not just documentation files
- **Plant the Garden Step 2** — "Propose Groupings" replaces the old Documentation Coverage Gaps step (Step 1b removed as redundant — undocumented dirs ARE the areas)
- **Setup workflow** — all "wrapper" terminology → "Shed"; "Add Tool Wrapper Path" → "Add Shed File Path"; commit message updated

---

## [4.0.0] - 2026-02-18

### Changed (Breaking)
- **Worms and dead leaves redefined** — no longer measure code quality in source files; now exclusively track doc-vs-codebase drift (stale references, outdated architecture descriptions, missing sections in existing docs). Source file scanning removed
- **Consistency audit** — multiple cross-workflow inconsistencies fixed; terminology and rules aligned across all workflow files

---

## [3.1.0] - 2026-02-18

### Added
- **Full-repo discovery** — scans all `**/*.md` files, classifies documentation vs non-documentation, instead of only tracking files from config.yaml paths
- **User-defined areas** — `AskUserQuestion` lets user organize docs into areas on first run (defaults: Garden, Shed, Greenhouse, Archive)
- **Labeled row panels** — grid rows mirror filesystem structure with directory labels (rows = directory groups, cols = siblings)
- **Folder-level aggregates** — areas with many files can use `granularity: folder` with count notation (e.g., `🌿×12`)
- **Phased planting** — areas are planted one at a time so user sees progress and can adjust between phases
- **`docsmap.yaml`** — human-readable YAML replacing `memory.json` for entity state, area config, and grid layout
- **`history.jsonl`** — append-only JSON Lines event log (capped at 50 entries) replacing the `commitLog` array in memory.json
- **`garden.md`** — rendered snapshot as standalone readable markdown, replacing `snapshot.json`
- **Discovery exclusions** — `discovery_exclude` list in config.yaml for directories to skip during repo-wide scan
- **Evolutionary update** — non-destructive "Update garden" sub-flow that preserves spatial memory, discovers new files, and refreshes readiness
- **Untracked file detection** — Update sub-flow scans for docs outside tracked areas and offers to add new areas
- **Universal emoji vocabulary** — all areas share the same readiness emojis: 🫘 seed, 🌱 small, 🌿 grown, 🌳 mature, 🪱 issue
- **Browse area** — drill into one area at a time to see full entity table with paths

### Changed
- **config.yaml** — `memory_file` and `snapshot_file` replaced by `docsmap_file`, `history_file`, and `snapshot_file` (now points to `garden.md`); added `docs_files` list for health check
- **visualise workflow** — complete rewrite with full-repo discovery, area definition flow, phased planting, spatial mapping, evolutionary update, and browse-by-area
- **health workflow** — reads `docsmap.yaml` instead of `memory.json` for garden state awareness
- **style.md** — emoji legend replaced with universal vocabulary table and legend format specification; display scope clarified (map always shows all areas)
- **VERSION** — bumped to 3.1.0

### Removed
- **`memory.json`** — replaced by `docsmap.yaml` + `history.jsonl`
- **`snapshot.json`** — replaced by `garden.md`
- **Hardcoded 2-area system** — areas are now user-configurable, not limited to Garden + Shed
- **Flat grid packing** — replaced by filesystem-mirroring spatial layout
- **Area-specific emoji vocabularies** — replaced by universal emoji set for simplicity
- **`_config/` directory** — coverage status template inlined into gardener.md
- **Old workflows** — `add-tool`, `bootstrap`, `help`, `maintain`, `scaffold`, `sync` consolidated into `setup`

---

## [3.0.0] - 2026-02-17

### Added
- **Garden Memory System** — persistent `memory.json` bonds docs to coordinates in an 18xN ASCII grid, survives across sessions
- **Garden Visualisation** (`/garden-visualise`) — renders the documentation ecosystem as an ASCII garden map with spatial layout
- **Rendering Contract** — defined cell tokens, border characters, panel types (garden, shed, monorepo), `CONTENT_WIDTH = 36`
- **Auto-discovery** — Plant the Garden sub-flow discovers docs from `config.yaml` paths, classifies readiness (plant vs seed vs opportunity)
- **Context-Soldering Bonds** — entities are bonded to grid coordinates deterministically by type and alphabetical order
- **Commit Log** — tracks garden operations (plant, re-plant, update), capped at 50 entries with oldest-first pruning
- **Snapshot Cache** — `snapshot.json` stores rendered ASCII with `stateHash` for cache-hit rendering (skip re-render when nothing changed)
- **Panel types** — garden (primary docs), shed (wrappers/references), monorepo (paired label+token rows)
- **`🗺️` mode emoji** — Garden Map mode added to the Mode Emoji Map
- **Garden Visualisation Emoji Legend** — `🌱=draft  🌿=done  🕳️=opportunity  🪱=health issue` in style.md
- **Memory-aware health check** — `/garden-health` now reads `memory.json` to suggest planting seeds or re-planting for missing entities

### Changed
- **config.yaml** — added `memory_file` and `snapshot_file` paths for garden persistent state
- **gardener.md** — hub command list now includes `/garden-visualise`
- **health workflow** — Phase 1 optionally reads garden memory; Phase 2 condition table includes seed and missing entity suggestions

---

## [2.1.0] - 2026-02-17

### Changed
- **Header format**: Now shows version + emoji mode — `🪴 **Gary The Gardener** v2.1.0 | 👀 Health Check` instead of `🪴 **Gary The Gardener** · Health Check`
- **Mode emojis**: Every mode has a human-like emoji (👋 Hub, 👀 Health Check, 🧐 Auditing, ✍️ Extending, 🤝 Syncing, 🤏 Compacting, 💪 Scaffolding, 🧹 Maintaining, 🔧 Adding Tool, 🤓 References, 🙋 Help, 🫡 Bootstrapping)

### Added
- **Fun gardening facts**: Every workflow completion ends with a real-world gardening fun fact (`🌱 *Did you know?...*`)
- **Mode Emoji Map** in `style.md` — canonical emoji-to-mode mapping table

---

## [2.0.0] - 2026-02-17

### Changed
- **Major rewrite of all workflow files** - condensed from 100-420 lines each down to 50-100 lines, removing example sessions, inline output blocks, and redundant rules
- **Replaced text-based menus with AskUserQuestion** - all user choices now use Claude Code's built-in selector instead of `[BS]`, `[SY]` codes and numbered lists
- **Added workflow progress cards** - every multi-phase workflow shows a checklist that updates as phases complete
- **Rewrote Gary's persona** - warmer, more familiar personality that comes through in compact responses instead of verbose mechanical instructions
- **All slash commands now route through Gary** - every `/garden-*` command loads the persona and style guide, so Gary's personality is present even on direct invocation
- **Created shared output style guide** (`core/style.md`) - defines compact card format, progress updates, and tone conventions

### Added
- `_gs-gardener/core/style.md` - shared output conventions for all workflows

### Removed
- `_gs-gardener/_config/` directory and coverage status template (inlined into gardener.md)
- `.github/agents/gardener.md` (duplicate of core agent file)
- Redundant `version` field from config.yaml (VERSION file is the source of truth)
- Example Session sections from all workflows
- Inline markdown output blocks from all workflows
- XML-style tags from agent definition

---

## [1.5.0] - 2026-02-16

### Changed
- **Claude Code is now an optional tool** — appears in the interactive selection menu alongside Cursor, Copilot, and Windsurf instead of being always installed
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
- **Renamed "Gardner Gary" to "Gary The Gardener"** - Consistent naming with emoji across all files
- **Fixed syntax error** in CLI help output template literal

---

## [1.1.0] - 2026-02-15

### Added
- **Fast help workflow** - Instant response with top 5 commands (no upfront I/O operations)
- **Contextual "What should I do next?" suggestions** - Option 6 in help menu analyzes repo state on-demand
- **Bootstrap detection** - Help workflow detects missing AGENTS.md and guides users to bootstrap first
- **`/garden-bootstrap` command** - First-time setup workflow (converted from ai-bootstrapper.md)
- **[BS] Bootstrap menu item** - Conditional display in Gary The Gardener when AGENTS.md is missing
- **Progressive disclosure** - Help menu offers option 7 to show all 9 commands

### Changed
- **`/garden-garden` renamed to `/garden-maintain`** - Clearer command name (no longer self-referential)
- **Workflow directory renamed** - `_gs-gardener/core/workflows/garden/` -> `_gs-gardener/core/workflows/maintain/`
- **Help workflow structure** - Now defers heavy I/O checks to contextual analysis (Phase 4)
- **Gary The Gardener menu** - Shows 9 options when AGENTS.md missing, 8 when it exists
- **Bootstrap integration** - ai-bootstrapper.md converted to standard garden workflow

### Fixed
- **Incorrect `/gardener` references** - Corrected to `/garden-agent-gardener` throughout
- **Help workflow performance** - Reduced from 3 I/O operations to 1 upfront (instant response)
- **Command descriptions** - Updated all references to use new naming conventions

### Technical Details
- Help workflow: 315 lines -> 423 lines (but much faster - only 1 file check upfront)
- Bootstrap workflow: New 340-line workflow file created
- Version bump: 1.0.0 -> 1.1.0 (semantic versioning - backward compatible new features)

---

## [1.0.0] - 2026-02-15

### Added
- Initial release of Garden System
- Gary The Gardener - Interactive Repository Garden Keeper subagent
- 9 maintenance skills:
  - `/garden-sync` - Sync wrappers with AGENTS.md
  - `/garden-audit` - Audit for drift between docs and code
  - `/garden-extend` - Add content layers (guardrails, principles, style, domain)
  - `/garden-references` - Fetch and manage dependency documentation (llms.txt)
  - `/garden-add-tool` - Add support for new AI tools
  - `/garden-scaffold` - Set up docs/ knowledge base structure
  - `/garden-maintain` - Find and fix documentation issues
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
