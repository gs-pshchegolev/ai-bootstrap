# Audit

> Deep scan for drift, quality issues, and wrapper sync problems.

## Phases

1. Discovery — scan docs and codebase
2. Analysis — find issues across three categories
3. Code Quality Scan — worms, dead leaves, signs (opt-in, Haiku model)
4. Report — present findings grouped by category
5. Fix — apply approved changes

## Phase 1: Discovery

- Read AGENTS.md — note claimed tech stack, structure, commands, architecture
- Read docs/*.md if they exist
- Scan package manager files for actual dependencies
- Check actual directory structure vs documented
- Verify documented commands still exist in scripts
- Read each wrapper: CLAUDE.md, .github/copilot-instructions.md, .cursor/rules/agents.mdc
- Use efficient tools (Glob, Grep, Read) — don't read every file

**Unmapped source check** (run after the above, if any `type: source` areas exist in docsmap):
1. Collect all `include` patterns from source areas in docsmap.
2. Walk the tree (exclude `discovery_exclude` from config + always-exclude: `node_modules`, `dist`, `build`, `.git`, `coverage`, `__pycache__`). Find directories with code files.
3. Identify directories not covered by any source area's `include` pattern.
4. For each unmatched directory: check recent git activity (`git log -1 --format="%ar" -- {dir}`). Classify as active (<3 months), possibly stale (3–6 months), or likely dead (>6 months).
5. Include active unmatched directories in the Phase 2 "Coverage gaps" report; list stale as a footnote. Skip dead ones silently.
6. If no `type: source` areas exist: skip this check entirely (source discovery hasn't been done — surface as a setup gap suggestion instead: "No source areas mapped yet — run `/garden-visualise` → Plant the Garden to discover code areas").

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
- **Unmapped source** — active code directories not covered by any source area (from Phase 1 unmapped source check). Report with file counts and git activity:
  ```
  Unmapped source (2 active directories not in any area):
  · src/payments/ (8 .ts files, active)
  · services/mailer/ (5 .js files, 2 weeks ago)
  ⚠️ lib/ (12 files) — last commit 8 months ago, possibly dead
  Reply [+] to add as source areas.
  ```

### Wrappers (sync correctness)
- Does each wrapper reference AGENTS.md?
- Is the reference correct and up to date?
- Are there conflicting instructions?
- Any empty or missing wrappers?

## Phase 3: Code Quality Scan (opt-in)

Offer this phase via `AskUserQuestion` after Phase 2 analysis: "Also scan code for worms, dead leaves, and signs?" If declined, skip to Phase 4.

**Step 1 — Print scan plan before any scanning begins:**

Count code files for every area up front. Print a scan plan showing what will be scanned, then open the results table:
```
Scanning code quality · {N} areas · {M} files total

  Source        ·  1 file
  Core Docs     ·  5 files
  Knowledge Base·  2 files   (incremental: 1 changed since 15-02-2026)
  ~ Tests       · ~20/64 files  (sampling — read code_scan_sample_size from config)

| Area | Files | 🪱 Worms | 🍂 Dead leaves | 🪧 Signs |
|------|-------|----------|----------------|----------|
```

Note `~` prefix on sampled areas in the plan. Show incremental note when `last_scanned` is set and only changed files will be scanned. Sample size comes from `config.yaml` → `code_scan_sample_size` (default 20 if not set).

**Step 2 — Per-area scope check (before scanning each area):**
1. Check `area.code_issues.last_scanned` in docsmap. If set, run `git diff --name-only {last_scanned}` to find changed code files (incremental). If not set, full scan.
2. Count code files matching the area's `include` pattern.
3. **If >50 files — surface a split suggestion inline (non-blocking):**
   - Glob the area's include paths to find actual subdirectory structure and file counts per subdirectory
   - Output a suggestion block immediately, before scanning:
     ```
     ⚠️ **{Area}** has {N} files — too large for a full scan. Natural splits found:
       · `src/api/` ({N} files) → would become **{area-id}-api**
       · `src/utils/` ({N} files) → would become **{area-id}-utils**
       · `src/models/` ({N} files) → would become **{area-id}-models**
     Scanning ~{code_scan_sample_size} most recently modified for now. Reply **[SP]** after results to split this area.
     ```
   - Continue scanning immediately — sample the `code_scan_sample_size` most recently modified (`git log --name-only -n {code_scan_sample_size}`). Mark `sampled: true`.
4. If ≤50 files: proceed with full scan.

**Step 3 — Scan with Haiku model, areas in parallel. Per file, identify:**
- 🪱 **Worm** — a function, variable, or class whose name contradicts its implementation. Record: `f` (file), `l` (line), `s` (symbol name), `n` (one-line note on the lie).
- 🍂 **Dead leaf** — a comment or docstring describing behavior the code no longer has. Record: `f`, `l`, `n`.
- 🪧 **Sign** — a JSDoc block or commented-out TypeScript interface/type definition that captures **meaningful semantics** only: business rules, domain concepts, non-obvious invariants, `@throws` with conditions, `@deprecated` with migration paths. Skip trivial `@param`/`@returns` type annotations, autogenerated stubs, one-word summaries. Record: `f`, `l`, `n` (what domain knowledge this holds).

**Step 4 — As each area finishes, immediately append its row (don't wait for other areas):**
```
| ✅ Source | 1/1 | 🪱×1 | — | — |
| ✅~ Tests | ~20/64 | 🪱×2 | 🍂×1 | 🪧×4 |
```
- Prefix `✅` when complete
- Files column: `{scanned}/{total}` — always show both numbers so it's clear what was covered
- Append `~` to area name if sampled
- Use `—` for zero counts

**Step 5 — Write findings:**
- Write (or overwrite) `_gs-gardener/data/code-issues/{area-id}.yaml`. Token-aware format — short keys, date-only header:
  ```yaml
  # area: {area-id} · scanned: {DD-MM-YYYY} · sampled: {true|false}
  worms:
    - f: src/utils/auth.js
      l: 42
      s: validateUser
      n: destroys session, doesn't validate
  dead_leaves:
    - f: src/api/users.js
      l: 120
      n: "says 'throws on null' but now returns empty array"
  signs:
    - f: src/types/index.ts
      l: 15
      n: "admin flag — only settable by service layer, never by client"
  ```
- If the file would exceed ~150 lines, split into sub-files instead (see Split sub-flow below).
- Update `area.code_issues` in docsmap: `worms`, `dead_leaves`, `signs` counts, `last_scanned`, `sampled`.

**Split sub-flow** (triggered by `[SP]` reply, or when findings file exceeds ~150 lines):
1. Glob the area's include paths to find actual subdirectory structure (already done in Step 2 if area was large)
2. Propose concrete splits with real paths and file counts — never generic suggestions
3. On approval via `AskUserQuestion`:
   - Create `_gs-gardener/data/code-issues/{area-id}/` directory with sub-files per sub-area
   - Update docsmap: add sub-area entries, remove the parent area entry
   - Add new sub-area rows to the garden map (garden.md updated immediately)
4. On decline: leave area as-is

## Phase 4: Report

Present a combined report grouped by category:

- **Drift** — critical (architecture), high (tech stack), medium (structure/commands)
- **Quality** — critical (broken references), medium (staleness, orphans), minor (improvements)
- **Wrappers** — healthy vs issues found
- **Code quality** (if scan ran) — 🪱 worms, 🍂 dead leaves, 🪧 signs per area; note `~` if sampled

Include summary count. Use `AskUserQuestion`: "Fix these issues?" with options: Fix all / Let me choose / Just the report.

## Phase 5: Fix

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

**Code quality fixes** (worms / dead leaves):
- Read `_gs-gardener/data/code-issues/{area-id}.yaml` filtered by type
- Open each file at the given line, show the issue, propose fix
- After applying: remove the resolved entry from the area YAML, decrement `code_issues` count in docsmap
- Signs are not fixed — they're informational. User may choose to promote them to docs via `/garden-extend`.

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
- Code quality scan data lives in `_gs-gardener/data/code-issues/` — visualise reads it, audit writes it
- Signs are informational only — never auto-fix, suggest `/garden-extend` to promote to docs
