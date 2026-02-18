# Audit

> Deep scan for drift, quality issues, and wrapper sync problems.

## Phases

1. Discovery — scan docs and codebase
2. Analysis — find issues across three categories
3. Report — present findings grouped by category
4. Fix — apply approved changes

## Phase 1: Discovery

- Read AGENTS.md — note claimed tech stack, structure, commands, architecture
- Read docs/*.md if they exist
- Scan package manager files for actual dependencies
- Check actual directory structure vs documented
- Verify documented commands still exist in scripts
- Read each wrapper: CLAUDE.md, .github/copilot-instructions.md, .cursor/rules/agents.mdc
- Use efficient tools (Glob, Grep, Read) — don't read every file

## Phase 2: Analysis

Check for issues across three categories:

### Drift (docs vs codebase mismatch)
- **Tech stack** — new/removed dependencies, version changes
- **Structure** — new/moved/renamed directories and files
- **Commands** — added/removed/renamed scripts
- **Architecture** — new patterns, DB changes, infrastructure changes
- **Coverage gaps** — important undocumented areas

### Quality (staleness, broken links, orphaned files)
- **Staleness** — docs mention removed dependencies, dead scripts, moved files, outdated architecture
- **Broken links** — AGENTS.md references missing docs/ files, dead external links
- **Orphaned files** — files in docs/ not linked from AGENTS.md, undiscoverable by agents
- **Coverage gaps** — major features with no docs, complex modules undocumented

### Wrappers (sync correctness)
- Does each wrapper reference AGENTS.md?
- Is the reference correct and up to date?
- Are there conflicting instructions?
- Any empty or missing wrappers?

## Phase 3: Report

Present a combined report grouped by category:

- **Drift** — critical (architecture), high (tech stack), medium (structure/commands)
- **Quality** — critical (broken references), medium (staleness, orphans), minor (improvements)
- **Wrappers** — healthy vs issues found

Include summary count. Use `AskUserQuestion`: "Fix these issues?" with options: Fix all / Let me choose / Just the report.

## Phase 4: Fix

Only if approved:

**Drift fixes:**
- Generate proposed changes as diffs
- If "Let me choose": present each change individually via `AskUserQuestion`
- Apply approved changes

**Quality fixes:**
- Staleness: update docs to match reality
- Broken links: fix paths, or ask whether to create missing target or remove reference
- Orphaned files: ask whether to link from AGENTS.md, keep unlisted, or delete
- Coverage gaps: report and suggest `/garden-extend` for new content

**Wrapper fixes:**
- Missing reference: add standard "Follow all instructions in the root AGENTS.md..." text
- Missing file: generate appropriate wrapper (respect tool-specific format)
- Conflicting instructions: ask user which to keep

After fixes: verify modified files, show result card with what was fixed and what remains.

## Rules

- Never invent information — only document what you verify
- Always show proposed changes before applying
- If unsure whether something is intentional, ask
- Keep AGENTS.md under 150 lines — suggest docs/ for overflow
- Prioritize critical drift over minor issues
- Never modify AGENTS.md itself during wrapper sync — only fix wrappers
- Ask before deleting anything — orphaned files might be intentional
- For coverage gaps, suggest `/garden-extend` — don't invent docs
