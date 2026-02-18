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

**Documentation coverage check** (run after the above):
1. Walk the source tree (exclude `discovery_exclude` from config + always-exclude: `node_modules`, `dist`, `build`, `.git`, `coverage`, `__pycache__`). Find directories containing code files.
2. For each code directory, check whether any `.md` file exists in or near it.
3. For unmatched directories: check git activity (`git log -1 --format="%ar" -- {dir}`). Classify as active (<3 months), possibly stale (3–6 months), or likely dead (>6 months).
4. Surface active unmatched directories in Phase 2 "Coverage gaps"; list stale as a footnote. Skip dead ones silently.

## Phase 2: Analysis

Check for issues across three categories:

### Drift (docs vs codebase mismatch)
- **Tech stack** — new/removed dependencies, version changes
- **Structure** — new/moved/renamed directories and files
- **Commands** — added/removed/renamed scripts
- **Architecture** — new patterns, DB changes, infrastructure changes
- **Coverage gaps** — important undocumented areas (from Phase 1 coverage check):
  ```
  Undocumented areas (no .md files found near code):
  · src/payments/ (8 .ts files, active 2 weeks ago)
  · services/mailer/ (5 .js files, active 1 month ago)
  ⚠️ lib/ (12 files) — last commit 8 months ago, possibly stale
  Reply [+] to create doc stubs.
  ```

### Quality (staleness, broken links, orphaned files)
- **Staleness** — docs mention removed dependencies, dead scripts, moved files, outdated architecture
- **Broken links** — AGENTS.md references missing docs/ files, dead external links
- **Orphaned files** — files in docs/ not linked from AGENTS.md, undiscoverable by agents
- **Coverage gaps** — major features with no docs, complex modules undocumented
- **🪱 Worms** — claims in `.md` files that contradict verifiable codebase facts. Check per doc entity:
  - Tech stack names → verify in package.json / requirements.txt / lockfiles
  - File or directory paths mentioned → verify they exist on disk
  - Script names → verify in package.json scripts / Makefile
  - Version numbers → verify against package.json `version` field
  - Flag each mismatch: file, the claim, what the codebase actually shows
- **🍂 Dead leaves** — documentation describing things that no longer exist. Look for:
  - Dependencies mentioned by name that are absent from package.json
  - File paths referenced in docs that no longer exist on disk
  - Script names that have been removed
  - Features described as present that have been deleted
  - Flag each: file, the stale reference, confirmation it no longer exists

After detecting worms and dead leaves, update `area.doc_issues` in docsmap:
```yaml
doc_issues:
  worms: {N}
  dead_leaves: {N}
  last_checked: "{DD-MM-YYYY}"
```

### Wrappers (sync correctness)
- Does each wrapper reference AGENTS.md?
- Is the reference correct and up to date?
- Are there conflicting instructions?
- Any empty or missing wrappers?

## Phase 3: Report

Present a combined report grouped by category:

- **Drift** — critical (architecture), high (tech stack), medium (structure/commands)
- **Quality** — critical (broken references, worms), medium (staleness, dead leaves, orphans), minor (improvements)
- **Coverage gaps** — active code directories with no documentation
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
- Coverage gaps: suggest `/garden-extend` for new content, or offer to create stubs

**Worm fixes:**
- Open the referenced `.md` file at the location of the incorrect claim
- Show the claim and what the codebase actually shows
- Propose a correction
- After applying: decrement `area.doc_issues.worms` in docsmap

**Dead leaf fixes:**
- Open the referenced `.md` file at the stale reference
- Show the reference and confirm it no longer exists
- Propose removal or update
- After applying: decrement `area.doc_issues.dead_leaves` in docsmap

**Wrapper fixes:**
- Missing reference: add standard "Follow all instructions in the root AGENTS.md..." text
- Missing file: generate appropriate wrapper (respect tool-specific format)
- Conflicting instructions: ask user which to keep

**Coverage gap fixes:**
- Offer to create minimal stub `.md` files in undocumented code directories
- Stubs become entities in the garden on next Update run

After fixes: verify modified files, show result card with what was fixed and what remains.

## Rules

- Never invent information — only document what you verify
- Always show proposed changes before applying
- If unsure whether something is intentional, ask
- Keep AGENTS.md under 150 lines — suggest docs/ for overflow
- Prioritize critical drift over minor issues
- Never modify AGENTS.md itself during wrapper sync — only fix wrappers
- Ask before deleting anything — orphaned files might be intentional
- For coverage gaps, suggest `/garden-extend` or offer stubs — don't invent full docs
- Worm/dead leaf detection compares docs against verifiable codebase facts only — never guess
