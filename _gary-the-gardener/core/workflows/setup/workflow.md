# Setup

> Create or setup files — bootstrap AGENTS.md, scaffold docs/, or add Shed files (AI tool configs).

## Phases

1. Check — see what exists
2. Choose — auto-suggest mode, let user pick
3. Execute — run the chosen path
4. Verify — show result and next steps

## Phase 1: Check

Scan for existing setup state:

- `AGENTS.md` — exists? has content?
- Shed files — CLAUDE.md, .github/copilot-instructions.md, .cursor/rules/agents.mdc, .claude/commands/, .github/agents/, etc.
- `docs/` directory — exists? has files?
- `.aiignore` — exists?

## Phase 2: Choose

Based on what exists, auto-suggest the most relevant mode and present via `AskUserQuestion`:

**If no AGENTS.md** — suggest Full Setup, options:
- **Full setup** — generate AGENTS.md + Shed files + docs/ stubs (bootstrap path)
- **Just AGENTS.md** — generate only the core file
- **Skip** — cancel

**If AGENTS.md exists** — suggest based on gaps, options:
- **Scaffold docs/** — create docs/ directory with stubs (if no docs/)
- **Add Shed file** — generate a Shed file for a new AI tool (if < 3 Shed files)
- **Full check** — run all three checks and fix gaps

Pick the suggestion that addresses the biggest gap first.

## Phase 3: Execute

### Full Setup Path (bootstrap)

Investigate the repo:
- **Identity**: repo name, purpose, language(s), framework(s), monorepo?
- **Tech stack**: package manager, frameworks, DB/ORM, infrastructure
- **Structure**: compact tree (max 3 levels, collapse >10 siblings)
- **Commands**: auto-detect from package.json scripts / Makefile / etc.
- **Entry points**: main files, routing, API definitions, config files
- **Existing Shed**: any pre-existing AI tool config files (CLAUDE.md, .cursor/rules/, .github/agents/, .claude/commands/, etc.)

Present discovery summary. Use `AskUserQuestion` to confirm findings before generating.

Generate:
- **AGENTS.md** (max ~150 lines): Tech Stack, Project Structure, Development, Architecture, Key Conventions, Further Reading
- **Shed files**: CLAUDE.md, .github/copilot-instructions.md, .cursor/rules/agents.mdc (all reference AGENTS.md)
- **.aiignore**: based on actual tech stack
- **docs/**: ARCHITECTURE.md, core-beliefs.md stub, references/ directory

### Step 4: Plant the Garden

After generating files, run the **Plant the Garden** sub-flow from `_gs-gardener/core/workflows/visualise/workflow.md`.

This produces `docsmap.yaml`, `history.jsonl`, and `garden.md` — the garden is fully planted as part of setup, not as a separate step. Gary will scan the codebase structure, propose 2–3 area groupings, and finalize on user selection.

Skip this step if the user chose "Just AGENTS.md" or "Skip" in Phase 2.

### Scaffold Path

- Check existing docs/ files — don't overwrite
- Create `docs/` directory
- Create `docs/ARCHITECTURE.md` — stub with section headers (Overview, Entry Points, Domain Boundaries, Key Patterns, Data Flow)
- Create `docs/core-beliefs.md` — stub pointing to `/garden-extend`
- Create `docs/references/` — empty directory with brief README
- Add/update "Further Reading" in AGENTS.md with pointers

### Add Shed File Path

Check which Shed files exist (from `config.yaml → shed_files` + scan `shed_patterns`), then use `AskUserQuestion` to pick from missing tools:
- **Claude Code** — creates CLAUDE.md (and optionally seeds `.claude/commands/` stubs)
- **GitHub Copilot** — creates .github/copilot-instructions.md
- **Cursor** — creates .cursor/rules/agents.mdc (MDC format with frontmatter)
- **Other** — custom tool (ask for details)

Generate the Shed file in correct format. All Shed files reference AGENTS.md as source of truth.

## Phase 4: Verify

- List each file created with status
- Recommended next steps: `/garden-audit`, `/garden-extend`, `/garden-references`
- Suggest commit message: `chore: setup AI agent configuration and plant garden`

## Rules

- Never invent documentation content — stubs are better than fabricated docs
- AGENTS.md MUST stay under 150 lines
- Shed files reference AGENTS.md, never duplicate content
- Don't overwrite existing files without asking
- Use correct format per tool (especially Cursor MDC with `alwaysApply: true`)
- Confirm findings with user before generating (bootstrap path)
