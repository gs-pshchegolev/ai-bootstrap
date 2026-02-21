# Garden Visualisation

> Full-repo discovery with spatial memory — renders documentation as a compact garden map.

## Execution Hints

This workflow is **tool-agnostic** — it describes operations, not specific tool APIs. Implementations may vary:

| Operation | Claude Code | Cursor | Copilot |
|-----------|-------------|--------|---------|
| Enumerate files | `Bash git ls-files` | terminal | terminal |
| Scan files | `Glob` | file search | workspace search |
| Count lines | `Bash wc -l` | terminal | terminal |
| Ask user | `AskUserQuestion` | inline prompt | inline prompt |
| Read file | `Read` | file read | file read |

**Model**: Discovery and classification (Steps 1, 3) are scan-heavy, not reasoning-heavy. Use a **fast/cheap model** (e.g., Haiku) for these steps when the host tool supports model selection.

**Parallelization**: Steps 1 and 3 (discovery + classification) can run areas **in parallel** when the host tool supports concurrent agents (e.g., Claude Code teams, Cursor background agents). Each area's scan is independent — no shared state until the final merge in Step 5.

## READ-ONLY Invariant

**This workflow NEVER modifies `docsmap.yaml` except inside the Update Garden sub-flow (triggered only when the user explicitly types `[U]`).** Phases 1–4 are strictly read-only. `gary_grew` triggers a display block only — no reorganization, no re-plant, no area merging or deletion. The three-bucket structure (Shed · Documentation · Codebase) applies **only** to new gardens via Plant the Garden — existing gardens preserve their area layout exactly as stored in `docsmap.yaml`, regardless of Gary version or any rule in heritage.md.

## Phases

1. Fast Path — check if `garden.md` exists; if yes, skip to Phase 4 immediately
2. Load — read or create garden state (only if garden.md missing)
3. Decide & Render — check hash, re-render if stale (writes garden.md only, never docsmap.yaml)
4. Display — output Gary Block with garden map and passive shortcut footer

## File Paths

- **Sitemap**: `{project-root}/_gary-the-gardener/garden/docsmap.yaml`
- **History**: `{project-root}/_gary-the-gardener/garden/history.jsonl`
- **Snapshot**: `{project-root}/_gary-the-gardener/garden/garden.md`
- **Config**: `{project-root}/_gary-the-gardener/core/config.yaml`

## Phase 1: Fast Path

Check if `garden.md` exists. If it does:
1. Read `garden.md` and extract its `hash:` line and `Gary v{X.Y.Z}` from the header.
2. Read current Gary version from `{project-root}/_gary-the-gardener/VERSION`.
3. **If Gary versions differ**: set `gary_grew = true`. Proceed regardless — the garden still renders.
4. Read `docsmap.yaml` and extract its `hash` field.
5. **If hashes match**: jump directly to Phase 4 — no re-render needed.
6. **If hashes differ** (docsmap changed since last render): skip to Phase 3 cache-miss path to re-render.
7. **If docsmap.yaml is absent**: display `garden.md` as-is with a note that the garden state file is missing.

Only proceed to Phase 2 if `garden.md` is absent.

## Phase 2: Load

Check if `docsmap.yaml` exists. If it does, read and parse it. If not, enter the **Plant the Garden** sub-flow (see below).

After loading, validate `version`:

- **`version === 3`** — current schema, proceed normally.
- **`version === 2`** — offer migration to v3 (see **Sub-flow: Migrate v2 → v3** below). If user declines, proceed with the v2 data — the map renders without sub-garden sections (single flat table, as before).
- **other** — warn only, proceed as-is with a note: "docsmap schema is unexpected — run `/garden-setup` to migrate."

## Phase 3: Decide & Render

Read the `hash` field from `docsmap.yaml`: `v2-{entityCount}-{DD-MM-YYYY}`.

Read `garden.md` if it exists. Check for a `hash:` line in its header.

- **Cache hit** (hashes match): proceed to Phase 4 with existing `garden.md`.
- **Cache miss** (hashes differ or no garden.md): re-render below.

### Render

Build the garden table for each area in `docsmap.yaml`. Follow the **Rendering Contract** below.

For each area, compute:
1. **Area emoji** — use `area.emoji` from docsmap (fixed per area, not computed from readiness)
2. **Path hint** — derive from all `include` patterns: for each pattern, strip from the first `*` and take the dirname; find the longest common directory prefix across all results. Use `/` if empty or patterns span multiple roots.
3. **Plants cell** — full emoji stream if ≤18 total entities; collapsed counts if >18; `·` if none
4. **Issues cell** — combined `area.doc_issues`: `🪱×N 🍂×M` if any; `·` if both zero/absent
5. **Total cell** — all non-zero counts in `×N` notation, order: 🌳→🌿→🌱→🪱→🍂; `·` if none
6. **Grouping pass** — after computing all area rows, insert bold sub-header rows between folder groups:
   - Extract the first path segment of each area's path hint. Areas with `/` = root group.
   - Root-group areas render first, flat — no sub-header row above them.
   - If ≥2 distinct non-root groups exist: insert `| **{folder}/** | | | |` before each non-root group.
   - If any non-root group has >7 areas: split at the next directory level, insert nested sub-headers.

Compute the **season mood line** from aggregate totals across all areas (see Rendering Contract).

Write `garden.md`:
```markdown
# Garden Map
> Rendered {DD-MM-YYYY} | Gary v{VERSION} | hash: {hash} | garden v{garden_version}
> {X} entities across {N} areas
**Legend:** 🌱 small · 🌿 grown · 🌳 mature

{season-mood-line}

### {sub_garden.emoji} {sub_garden.label}

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| {area.emoji} **{area.label}** `{path-hint}` | {plants-cell} | {issues-cell} | {total-cell} |

### {next sub_garden.emoji} {next sub_garden.label}

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| ... |

{coverage_gaps_footer — if coverage_gaps.dirs non-empty}
```

If `docsmap.version === 2` (user declined migration), fall back to the legacy single-table format — no sub-garden H3 headers.

`doc_issues` is written by the audit workflow — never by visualise. If absent, treat all quality counts as 0.

## Phase 4: Display

Output the Gary Block. **Display shows all areas** (both primary and secondary).

```
🪴 **Gary The Gardener** v{version} | 🏞️ Garden Map

<goal line>

🍃 <context line>

<season-mood-line>

### {sub_garden.emoji} {sub_garden.label}
<table for this sub-garden>

### {next sub_garden.emoji} {next sub_garden.label}
<table>

{📂 Unmapped code: ... — if coverage_gaps.dirs non-empty}

🌱 *Did you know? <fun gardening fact>*
```

**Footer — passive shortcut line. Do NOT call AskUserQuestion here.**

```
↘️ **[B]** Browse area · **[S]** Summary & suggestions · **[U]** Update · **[G]** Restructure sub-gardens · **[D]** Done
```

Turn ends. Gary waits for the user to follow up.

## Gary Grew Acknowledgment

If `gary_grew = true` was set in Phase 1, output this block **after** the garden display (same turn):

1. Load `{project-root}/_gary-the-gardener/core/agents/heritage.md`.
2. Find all version entries newer than the version extracted from the old `garden.md` (compare semver).
3. Output a second Gary Block:

```
🪴 **Gary The Gardener** v{VERSION} | 🌱 I've grown

A newer Gary mapped this garden. Here's what changed while I was away:

- **v{X.Y.Z}** — {first sentence from that version's entry in heritage.md}
- ...

↘️ **[k]** Got it
```

Cap at 5 version entries. If more, show the 3 most recent and append `...and {N} earlier versions`.

**READ-ONLY**: This acknowledgment is display-only. Do NOT modify `docsmap.yaml`, re-plant the garden, or reorganize existing areas. The three-bucket rule exists for new gardens only — never apply it to an existing garden.

### Shortcut Handling

When the user replies with a shortcut or intent, Gary acts:

| User says | Gary does |
|-----------|-----------|
| `B` / `browse` | Asks which area via `AskUserQuestion`, then runs Browse area flow |
| `S` / `summary` | Runs Summary & Suggestions sub-flow |
| `U` / `update` | Runs Update Garden sub-flow |
| `G` / `restructure` | Runs Restructure Sub-gardens sub-flow |
| `D` / `done` | Signs off with a brief closing line |

**"Browse area"** flow:
1. Output a passive area list — no `AskUserQuestion` (avoids the 4-option cap and overlay):
   ```
   Pick an area: **[1]** Core Docs · **[2]** Knowledge Base · **[3]** Shed · ...
   ```
   Number each area in order from `docsmap.yaml`. User replies with number or name.
2. For the selected area, read each entity's file (first 30 lines only) to extract a short "about" phrase (≤10 words describing the document's purpose)
3. Output a 4-column table: **Label | Readiness | Path | About**
4. Output a **passive shortcut footer** — no AskUserQuestion:
   ```
   ↘️ **[B]** Browse another area · **[S]** Summary · **[U]** Update · **[D]** Done
   ```

## Rendering Contract

### Table Format

Rendered as sub-garden sections (H3 headers), each containing one 4-column table.

```markdown
### 🌿 Shed & Knowledge Base

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 **Shed** `/` | 🌿 🌿 🌱 🌿 🌱 | 🍂×1 | 🌿×3 🌱×2 🍂×1 |
| 📁 **Docs** `docs/` | 🌿 🌿 🌳 🌳 🌿 | 🪱×2 🍂×1 | 🌳×2 🌿×3 🪱×2 🍂×1 |

### 🌳 Codebase

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🎯 **Pages** `src/pages/` | · | · | · |
| 🌐 **API** `src/api/` | 🌿 | · | 🌿×1 |
| 🧪 **Tests** `tests/` | 🌳 🌳 🌳 | · | 🌳×3 |
```

**Area column:** `area.emoji` from docsmap (fixed semantic emoji, not readiness-derived) + **bold** label + `path-hint` code span. Path hint = longest common dir prefix of all `include` patterns; `/` if no common root.

**Grouping sub-headers:** When a sub-garden's table has ≥2 distinct non-root folder groups, insert a folder-group sub-header row before each group. Sub-header row: `| **{folder}/** | | | |` — plain bold, no backticks, no emoji, all other cells empty. Root-group areas (`/`) render first with no sub-header. Groups with >7 areas split at the next directory level with nested sub-headers.

```markdown
### 🌿 Shed & Knowledge Base

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 **Shed** `/` | 🌿 🌿 🌱 | · | 🌿×2 🌱×1 |
| 📁 **Docs** `/` | 🌳 🌳 🌿 | 🪱×1 | 🌳×2 🌿×1 🪱×1 |

### 🌳 Codebase

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| **frontend/** | | | |
| 🎯 **Pages** `frontend/pages/` | · | · | · |
| 🔧 **Components** `frontend/components/` | 🌱 | · | 🌱×1 |
| 🎣 **Hooks** `frontend/hooks/` | 🌿 🌿 | · | 🌿×2 |
| **src/** | | | |
| 🌐 **API** `src/api/` | 🌿 🌳 | 🍂×1 | 🌳×1 🌿×1 🍂×1 |
| 🌳 **Domain** `src/` | 🌿 🌱 | · | 🌿×1 🌱×1 |
| **tests/** | | | |
| 🧪 **Tests** `tests/` | 🌳 🌳 | · | 🌳×2 |
```

**Plants column:** full emoji stream if ≤18 entities; collapsed counts if >18: `🌳×8 🌿×12 🌱×3 *(browse for detail)*`. `·` if no entities.

**Issues column:** combined worms + dead leaves from `area.doc_issues`: `🪱×N 🍂×M` (show only non-zero counts). `·` if both zero or absent.

**Total column:** all non-zero counts using `×N` notation, order: 🌳→🌿→🌱→🪱→🍂. `·` if no entities.

### Season Mood Line

One line computed from aggregate readiness across entities in areas **that have at least one entity**. Areas with 0 entities are excluded from the percentage calculation (they don't count as "seed" — they're undocumented code directories, which is expected).

| Condition | Mood line |
|-----------|-----------|
| mature ≥ 60% | `🍂 Well-tended — mostly mature, a few seeds to nurture` |
| mature+grown ≥ 60% | `☀️ Growing well — solid coverage, room to fill in` |
| small > mature+grown | `🌸 Just sprouting — garden is young, lots of potential` |
| any 🪱 worms or 🍂 dead leaves present | `⚠️ Needs attention — some docs contradict or trail the codebase` |
| default | `🌱 Taking shape — good progress, keep growing` |

Evaluate in order — first match wins. Place directly below the Gary Block header, before the table.

### Folder-Level Aggregates

For areas using `granularity: folder`, a single entity represents a directory. The emoji is followed by a count: `🌳×12` means a folder with 12 substantial docs inside.

## Universal Emoji Vocabulary

**Readiness states** (doc entities — line-based):

| Emoji | State | Threshold |
|-------|-------|-----------|
| 🌳 | mature | ≥100 substantive lines |
| 🌿 | grown | 11–99 substantive lines |
| 🌱 | small | ≤10 substantive lines |

**Documentation quality signals** (area-level — written by audit, not line-based):

| Emoji | Signal |
|-------|--------|
| 🪱 | Worm — a `.md` claim contradicting verifiable codebase facts |
| 🍂 | Dead leaf — documentation describing something that no longer exists |

Substantive line = non-empty after trim, not a frontmatter delimiter (`---`), not a pure markdown heading with no content on same line.

## Sub-flow: Plant the Garden

Full-repo discovery that creates `docsmap.yaml`, `history.jsonl`, and `garden.md` from scratch.

### Step 1: Full Repository Discovery — Three Buckets

The garden always has exactly three top-level buckets: **Shed**, **Documentation**, and **Codebase**. Gary discovers each in sequence.

---

**1a — Shed (agentic infrastructure)**

Scan `config.yaml → shed_patterns` + `shed_files` — collect all matching agentic files on disk. This always forms one dedicated Shed area regardless of repo size or granularity choice.

---

**1b — Documentation (knowledge base)**

Scan for all `.md` files in `docs/` and root-level `.md` files (README.md, AGENTS.md, CHANGELOG.md, etc.). This always forms one Documentation area. If both root-level `.md` files and a `docs/` directory are substantial (≥3 files each), Gary may split into "Core Docs" + "docs/" — decided in Step 1.5.

---

**1c — Codebase (source directories)**

Enumerate all non-Shed, non-Documentation files to map code directories.

**File enumeration:**
- **Primary (git repo)**: `git ls-files` — automatically respects `.gitignore`, `.gitmodules`, submodules.
- **Fallback (non-git)**: `find . -type f` — exclude `config.yaml → discovery_exclude` + always-exclude: `node_modules/`, `dist/`, `build/`, `.git/`, `coverage/`, `__pycache__/`, `_gary-the-gardener/`.
- `discovery_exclude` supplements `.gitignore` for non-git repos only; in git repos, `git ls-files` already handles all exclusions.

**Directory analysis (run after enumeration):**
```bash
# Level-1 breakdown: top-level dirs by total file count
git ls-files | grep '/' | cut -d'/' -f1 | sort | uniq -c | sort -rn

# Level-2 breakdown: detect large dirs with meaningful subdirs
git ls-files | grep -E '^[^/]+/[^/]+/' \
  | sed 's|^\([^/]*/[^/]*\)/.*|\1|' | sort | uniq -c | sort -rn | head -40

# Drill into any top-level dir with >50 files (run per-dir as needed)
git ls-files {dir}/ | grep '/' | cut -d'/' -f1 | sort | uniq -c | sort -rn
```

**Split-candidate rule**: a directory is worth splitting if it has ≥3 subdirectories each containing ≥5 files. Gary applies this recursively — a `frontend/` with 18 subdirs yields 18 candidate areas, not 1.

**Tech stack signals**: detect from `package.json`, `Makefile`, `pyproject.toml`, `go.mod`, `Cargo.toml` etc.

**Synthesize** (internal reasoning only — not shown to user):
- Shed: N agentic files
- Documentation: N docs files (root-level + docs/)
- Codebase: total tracked files, total dirs, split candidates; dirs with code but no docs (expected to be most)
- Skip from Codebase candidates: pure tooling dirs (`.github/`, `.husky/`), CI-only dirs, fully generated dirs

Gary does NOT present this analysis — it feeds Step 1.5.

### Step 1.5: Granularity Calibration

**Shed and Documentation areas are fixed — always exactly one area each.** This step calibrates the **Codebase bucket only**: how many code directory areas to create.

Gary presents real stats for all three buckets, then focuses the question on Codebase depth.

**Show a compact three-bucket summary** (output to user):
```
📊 Repository — 3 buckets discovered

🛖 Shed       — 9 agentic files (CLAUDE.md, .cursor/rules/, .github/agents/, ...)
📚 Documentation — 12 files (docs/ARCHITECTURE.md, AGENTS.md, README.md, ...)
💻 Codebase   — 847 code files across 29 directories

How detailed should the Codebase section be?
  frontend/       412 files (18 subdirs: components/, pages/, hooks/, ...)
  backend/        203 files (9 subdirs: api/, db/, services/, ...)
  infrastructure/  89 files (6 subdirs)
  tests/           87 files (4 subdirs)
  ...
```

**Compute three concrete options** for the Codebase section (N computed from real data):
- **Shallow** — one area per top-level code directory (no splitting).
- **Standard** *(recommended)* — splits split-candidates (≥3 subdirs × ≥5 files). Area count computed from data.
- **Deep** — one area per subdirectory with ≥5 files. Maximum visibility.

Present via `AskUserQuestion` with markdown previews. Each preview lists **actual area names and file counts** from the repo — no invented examples. Always include **Custom** as 4th option.

**Example preview for Standard:**
```
Option B — Standard (12 areas total) ← recommended

Fixed:
🛖 Shed (9 agentic files)
📚 Documentation (12 docs files)

Codebase (10 areas):
🌐 frontend/components/ (87 files — no docs yet)
🌐 frontend/pages/ (63 files — no docs yet)
🎣 frontend/hooks/ (41 files — no docs yet)
⚙️ backend/api/ (74 files — no docs yet)
🗄️ backend/db/ (58 files — no docs yet)
🔧 backend/services/ (71 files — no docs yet)
🏗️ infrastructure/ (89 files — no docs yet)
🧪 tests/ (87 files — no docs yet)
📦 (remaining small dirs merged into nearest parent)
```

**After user picks A/B/C**: Gary proceeds to the sub-garden structure question before Step 2.
**Custom**: Gary asks one clarifying question (which Codebase areas to merge/split/rename), then proceeds to sub-garden structure.

### Step 1.6: Sub-garden Structure

After granularity is decided, Gary defines how areas are grouped into sub-gardens for the map display.

**Default (no input needed)**: Two sub-gardens — "Shed & Knowledge Base" (all Shed + Documentation areas) and "Codebase" (all remaining areas). Gary proposes this and asks:

```
AskUserQuestion: "How should the garden map be organised?"
→ Default — Shed & Knowledge Base | Codebase
→ Check patterns (Gary reads encyclopedia/sub-garden-patterns.md and suggests options)
→ Custom (Gary asks one question about grouping, then confirms)
```

**If user picks Check patterns**: Gary reads `{project-root}/_gary-the-gardener/encyclopedia/sub-garden-patterns.md` and presents matching patterns as `AskUserQuestion` options based on the repo's detected tech stack and directory shape.

**Result**: A confirmed `sub_gardens` list (id, label, emoji, areas) written to `docsmap.yaml` in Step 5.

---

### Step 2: Confirm Area Layout

Gary shows the selected area layout and asks for final confirmation before writing files.

Show the area list (same compact format as the calibration preview). Then:

```
AskUserQuestion: "Plant with these N areas?"
→ Plant now
→ Let me adjust (Gary asks one merge/split/rename question, then re-confirms)
→ Start over (return to Step 1.5)
```

**Three-bucket structure (always enforced):**
- **Shed** → always exactly one area; includes from `config.yaml → shed_files` + `shed_patterns`.
- **Documentation** → always exactly one area (root `.md` files + `docs/`). If both are substantial (≥3 files each), may be split into "Core Docs" + "docs/" — user decides via Custom option.
- **Codebase** → one or more areas per granularity choice; all code directories that are not Shed or Documentation.

**Additional carry-forward rules:**
- Codebase dirs with <3 files AND no docs → merged into nearest parent area
- Generated/artifact dirs (e.g., `_bmad-output/`) → secondary area only if they contain `.md` files

### Step 3: Classify Existing Documentation

For each area, scan its `include` patterns and find any existing `.md` files:
- **If found**: count substantive lines → classify readiness per entity
- **If none**: area has 0 entities — this is valid and expected; most areas in a typical codebase will have no docs

**Areas are independent — scan them in parallel** when the host tool supports it (see Execution Hints). Fall back to sequential if not.

Per entity, per area's granularity:
- **File-level**: count substantive lines (≥100 = mature, 11–99 = grown, ≤10 = small)
- **Folder-level**: count files in dir (>10 files with content = mature, 2–10 = grown, 1 = small, 0 = seed)

### Step 4: Assign Grid Coordinates (Spatial Mapping)

**Rows = directory groups** (filesystem structure preserved):
- Each subdirectory or logical group gets its own row
- Row has a label (the directory path or group name)
- Entities within a row are ordered alphabetically by filename

**Columns = siblings** within the group:
- Left-to-right, max 18 per row
- Overflow wraps to continuation line (indented under same label)

**Balance sparse rows** — avoid rows with only 1–2 entities:
- If a subdirectory has 1–2 files and its sibling directory also has few files, merge them into a single row with a shared parent label (e.g. `misc/`)
- If a row would have 1 entity isolated from all others, consider appending it to the nearest logical row
- Never merge rows from different areas — only within the same area

The grid mirrors the filesystem — adjacent cells are related files.

### Step 5: Write Files

Write areas with full entity and grid layout:

1. Write `docsmap.yaml` with areas, entities, grid layout. **Areas with no documentation have empty entity lists** — their grid rows have empty `entities: []`. This is valid; those areas represent undocumented code directories.

```yaml
version: 3
garden_version: "1.0.0"
generated: "{DD-MM-YYYY}"
hash: "v3-{entityCount}-{generated}"

sub_gardens:
  - id: {id}
    label: "{label}"
    emoji: "{emoji}"
    areas: [{area-id}, ...]

coverage_gaps:
  checked: "{DD-MM-YYYY}"
  dirs: []

areas:
  {area-id}:
    label: {Label}
    emoji: "{emoji}"
    description: {description}
    display: primary         # primary | secondary
    granularity: file        # file | folder
    include:                 # glob patterns
      - "{pattern}"
    readiness_emojis:
      mature: "\U0001F333"
      grown: "\U0001F33F"
      small: "\U0001F331"
    # doc_issues: optional — written by /garden-audit, never by visualise
    # doc_issues:
    #   worms: 0          # claims in .md files contradicting the codebase
    #   dead_leaves: 0    # docs referencing things that no longer exist
    #   last_checked: "{DD-MM-YYYY}"
    grid:
      cols: 18
      rows:
        - label: "{directory-group}"
          entities: [{entity-id}, ...]

entities:
  {entity-id}:
    path: "{relative-path}"
    type: {type}             # instructions | doc | shed | artifact
    area: {area-id}
    readiness: {mature|grown|small}
    label: {display-name}
    placed: "{DD-MM-YYYY}"
    updated: "{DD-MM-YYYY}"
```

2. Write first entry to `history.jsonl`:
```jsonl
{"ts":"{DD-MM-YYYY}","action":"init","summary":"Garden planted with {N} entities ({M} mature, {G} grown, {Sm} small)","areas":["{area-ids}"],"counts":{"mature":{M},"grown":{G},"small":{Sm}}}
```

3. Render and write `garden.md` (see Phase 3).

### History Log Management

`history.jsonl` is an append-only log capped at 50 entries. When adding a 51st entry, remove the oldest entry first (line 1). Each garden operation (plant, re-plant, promote, update) appends a new log entry.

## Sub-flow: Update Garden

Evolutionary, non-destructive update that preserves spatial memory — existing entities keep their grid coordinates.

### Step 1: Discover

**This step has three mandatory scans — run all three every time:**

**Scan A — existing areas:** Re-scan each area's `include` globs. Compare discovered files to entities in `docsmap.yaml`.

**Scan B — untracked `.md` files:** Scan `**/*.md` (respecting `config.yaml` → `discovery_exclude`) for docs that don't match any area's `include` globs. Collect for Step 7.

**Scan C — uncovered code directories (required):** Use `git ls-files` (or the `find` fallback for non-git repos — same exclusions as Plant the Garden Step 1) to enumerate all tracked files. Aggregate by directory at level-1 and level-2 (same CLI commands as Plant the Garden Step 1). A directory is **uncovered** if it has ≥3 files AND no existing area's `include` globs would match files inside it. Collect all uncovered dirs — do not skip this scan even if Scan A found no changes. `git ls-files` ensures gitignored dirs never appear as candidates.

### Step 2: Diff

Identify:
- **New files** — on disk but not in docsmap
- **Deleted files** — in docsmap but gone from disk
- **Changed files** — line count changed significantly (>20% difference)

### Step 3: Add New

For each new file:
1. Classify readiness (same rules as planting — count substantive lines)
2. Assign next available grid coordinate in the appropriate area/row
3. If the row is full (18 entities), append to a continuation line

### Step 4: Remove Deleted

For each deleted file:
1. Remove entity from `entities` section
2. Remove from the grid row's `entities` list
3. Free the grid position (existing entities stay in place — no compaction)

### Step 5: Refresh Readiness

For all existing entities (parallelizable per area — see Execution Hints):
1. Re-count substantive lines
2. Promote or demote if threshold crossed (seed ↔ small ↔ grown ↔ mature)
3. Track promotions and demotions for the summary

### Step 6: Update State

1. Bump `generated` timestamp to current `{DD-MM-YYYY}`
2. Update `hash` to `v{schema_version}-{newEntityCount}-{DD-MM-YYYY}` (use current schema version prefix)
3. Write uncovered dirs from Scan C to `coverage_gaps` field:
   ```yaml
   coverage_gaps:
     checked: "{DD-MM-YYYY}"
     dirs:
       - path: "{dir}/"
         files: {N}
   ```
   If no uncovered dirs found, write `coverage_gaps: {checked: "{DD-MM-YYYY}", dirs: []}`.
4. Write updated `docsmap.yaml`
5. Append `update` entry to `history.jsonl`:
```jsonl
{"ts":"{DD-MM-YYYY}","action":"update","summary":"+{N} new, -{N} removed, {N} promoted, {N} demoted","counts":{"added":{N},"removed":{N},"promoted":{N},"demoted":{N}}}
```
6. Re-render `garden.md` (Phase 3)

### Step 7: Report

Show summary to user:
```
🔄 Garden updated — +{N} new, -{N} removed, {N} promoted, {N} demoted
```

If untracked `.md` files were found in Step 1, append:
```
📂 Found {N} docs outside tracked areas:
  - {path} ({readiness})
  - ...
```

Then ask the user (via `AskUserQuestion`):
- Add new area (define a new area to cover these files)
- Expand existing area (add globs to an existing area)
- Ignore (skip — files remain untracked)

If uncovered code directories were found in Scan C, append (after any untracked docs output):
```
📂 {N} code directories have no garden area yet:
  · src/new-feature/ (8 .ts files) — no docs yet
  · src/analytics/ (5 .ts files) — no docs yet
  · workers/queue/ (4 .ts files) — no docs yet
Reply [A] to add these as empty areas now, or [S] to skip.
```

**If user replies `[A]`** — add directly, no re-plant:
1. For each uncovered dir, propose a label and emoji (use directory name, infer from naming — `src/auth/` → `🔐 Auth`, `workers/queue/` → `⚙️ Queue Worker`, etc.)
2. Show proposed areas in one compact list — ask user to confirm or rename via a single `AskUserQuestion` ("Confirm these areas?" with options: Add all / Let me rename / Skip)
3. Append each new area to `docsmap.yaml` with empty `entities: []` and an empty grid row
4. Bump `hash` and `generated` timestamp
5. Re-render `garden.md` — the new areas appear with `—` in Plants column immediately
6. Show updated garden

These are additive changes — no existing areas or entities are modified.

If neither untracked docs nor uncovered dirs: return directly to the Phase 4 footer options.

## Sub-flow: Summary & Suggestions

Read all tracked entities and produce a structured documentation summary (~140–180 lines) followed by 3 prioritised improvement suggestions.

### Step 1: Read Entities

For each entity in `docsmap.yaml`, read the file (up to 60 lines). Note: title/purpose, key topics covered, and any quality signals (stubs, TODOs, missing sections, very short content).

### Step 2: Write Summary Block

Output a structured markdown summary grouped by area. Format:

```
## Documentation Summary — {DD-MM-YYYY}

### {area.emoji} {area.label}
| Doc | Readiness | About |
|-----|-----------|-------|
| {label} | {emoji} | {1-2 sentence description} |
...

### {next area...}
```

One table per area. Descriptions are 1–2 sentences — what the doc covers and whether it feels complete or thin. Target output: ~140–180 lines total.

### Step 3: Generate 3 Suggestions

Based on patterns observed (seeds, thin grown docs, missing areas, duplicate coverage, no cross-references), produce exactly 3 actionable improvement suggestions:

```
1️⃣ **{Action verb + target}** — {why it matters and what to do}
2️⃣ **{Action verb + target}** — {why it matters and what to do}
3️⃣ **{Action verb + target}** — {why it matters and what to do}
```

Prioritise by impact. Name specific files or areas where possible.

### Step 4: Footer

End with `AskUserQuestion`:
- Run suggestion #1 (label it with the specific action)
- Browse an area
- Update garden
- Done

## Sub-flow: Migrate v2 → v3

Triggered when Phase 2 detects `version: 2`.

1. Offer a snapshot first:
   ```
   AskUserQuestion: "Your garden uses schema v2. Migrate to v3 (adds sub-gardens + garden versioning)?"
   → Migrate (save snapshot first — recommended)
   → Migrate (skip snapshot)
   → Not now (display as-is with legacy flat table)
   ```
2. If "save snapshot first": run **Sub-flow: Save Snapshot** with current `garden.md` before writing anything.
3. Derive a default `sub_gardens` layout:
   - Sub-garden 1 "Shed & Knowledge Base" — all areas where `type: shed` or `type: instructions` OR `display: primary`
   - Sub-garden 2 "Codebase" — all remaining areas
4. Ask:
   ```
   AskUserQuestion: "Proposed sub-garden split — confirm or check patterns?"
   → Looks good — apply
   → Check patterns (reads encyclopedia/sub-garden-patterns.md)
   → Customise
   ```
5. Write updated `docsmap.yaml` with `version: 3`, `garden_version: "1.0.0"`, `sub_gardens`, and `coverage_gaps: {checked: today, dirs: []}`.
6. Append to `history.jsonl`:
   ```jsonl
   {"ts":"{DD-MM-YYYY}","action":"migrate","summary":"Schema migrated v2→v3; {N} sub-gardens defined","garden_version":"1.0.0"}
   ```
7. Proceed to Phase 3 to re-render.

## Sub-flow: Save Snapshot

Triggered before any garden_version major bump or explicit user request.

1. Read current `garden.md`. If absent, skip silently.
2. Write to `{project-root}/_gary-the-gardener/garden/snapshots/garden-v{garden_version}-{DD-MM-YYYY}.md`.
   Create the `snapshots/` directory if it doesn't exist.
3. Append to `history.jsonl`:
   ```jsonl
   {"ts":"{DD-MM-YYYY}","action":"snapshot","summary":"Snapshot saved before restructure","file":"garden-v{garden_version}-{DD-MM-YYYY}.md"}
   ```
4. Confirm to user: `📸 Snapshot saved: garden-v{garden_version}-{DD-MM-YYYY}.md`

## Sub-flow: Restructure Sub-gardens

Triggered when user replies `[G]` / `restructure` from the map footer.

1. Offer encyclopedia patterns:
   ```
   AskUserQuestion: "How to restructure sub-gardens?"
   → Check patterns (reads encyclopedia/sub-garden-patterns.md)
   → Custom (Gary asks one question about grouping)
   → Cancel
   ```
2. If Check patterns: read `{project-root}/_gary-the-gardener/encyclopedia/sub-garden-patterns.md`. Present matching patterns as options based on repo tech stack + directory shape.
3. Show proposed new layout. Ask:
   ```
   AskUserQuestion: "Apply this sub-garden structure?"
   → Save snapshot and apply (recommended)
   → Apply without snapshot
   → Cancel
   ```
4. If saving snapshot: run **Sub-flow: Save Snapshot**.
5. Write new `sub_gardens` to `docsmap.yaml`. Bump `garden_version` major (e.g. `1.0.0` → `2.0.0`). Update `hash` and `generated`.
6. Append to `history.jsonl`:
   ```jsonl
   {"ts":"{DD-MM-YYYY}","action":"restructure","summary":"Sub-gardens restructured to {N} sections","garden_version":"{new_version}"}
   ```
7. Re-render `garden.md` (Phase 3) and display.

## Rules

- **NEVER modify `docsmap.yaml` during display (Phases 1–4)**. It is read-only during map rendering. Only the Update Garden sub-flow (user `[U]`) may write to `docsmap.yaml`, and only additively — no area deletion.
- **NEVER re-plant an existing garden**. If `docsmap.yaml` exists, its area structure is the source of truth. Display it as found. The three-bucket rule (Shed · Documentation · Codebase) applies only when creating a brand-new garden from scratch.
- **`gary_grew` is display-only**. A version mismatch shows the acknowledgment block — nothing else changes. No reorganization, no re-plant, no area merging.
- **Schema version mismatch is a warning, not a trigger**. If `version !== 2`, show a migration note and continue — never re-plant.
- Entity IDs are kebab-case of the relative path (e.g., `AGENTS.md` → `agents-md`, `docs/ARCHITECTURE.md` → `docs-architecture-md`)
- When re-planting, append a `replant` entry to `history.jsonl` (don't overwrite)
- Keep the Gary Block compact — the map is the star, minimize surrounding text
- The snapshot cache (`garden.md` hash) avoids re-rendering when nothing changed — respect it
- All areas use the universal emoji vocabulary: 🌱 small, 🌿 grown, 🌳 mature, 🪱 issue
- Grid coordinates reflect filesystem groupings (not flat packing)
- Garden map always shows all areas; `display` field is metadata for other workflows
