# Garden Visualisation

> Full-repo discovery with spatial memory — renders documentation as a compact garden map.

## Execution Hints

This workflow is **tool-agnostic** — it describes operations, not specific tool APIs. Implementations may vary:

| Operation | Claude Code | Cursor | Copilot |
|-----------|-------------|--------|---------|
| Scan files | `Glob` | file search | workspace search |
| Count lines | `Bash wc -l` | terminal | terminal |
| Ask user | `AskUserQuestion` | inline prompt | inline prompt |
| Read file | `Read` | file read | file read |

**Model**: Discovery and classification (Steps 1, 3) are scan-heavy, not reasoning-heavy. Use a **fast/cheap model** (e.g., Haiku) for these steps when the host tool supports model selection.

**Parallelization**: Steps 1 and 3 (discovery + classification) can run areas **in parallel** when the host tool supports concurrent agents (e.g., Claude Code teams, Cursor background agents). Each area's scan is independent — no shared state until the final merge in Step 5.

## Phases

1. Fast Path — check if `garden.md` exists; if yes, skip to Phase 4 immediately
2. Load — read or create garden state (only if garden.md missing)
3. Decide & Render — check hash, re-render if stale
4. Display — output Gary Block with garden map and passive shortcut footer

## File Paths

- **Sitemap**: `{project-root}/_gs-gardener/data/docsmap.yaml`
- **History**: `{project-root}/_gs-gardener/data/history.jsonl`
- **Snapshot**: `{project-root}/_gs-gardener/data/garden.md`
- **Config**: `{project-root}/_gs-gardener/core/config.yaml`

## Phase 1: Fast Path

Check if `garden.md` exists. If it does:
1. Read `garden.md` and extract its `hash:` line.
2. Read `docsmap.yaml` and extract its `hash` field.
3. **If hashes match**: jump directly to Phase 4 — no re-render needed.
4. **If hashes differ** (docsmap changed since last render): skip to Phase 3 cache-miss path to re-render.
5. **If docsmap.yaml is absent**: display `garden.md` as-is with a note that the garden state file is missing.

Only proceed to Phase 2 if `garden.md` is absent.

## Phase 2: Load

Check if `docsmap.yaml` exists. If it does, read and parse it. If not, enter the **Plant the Garden** sub-flow (see below).

After loading, validate `version === 2`. If mismatched, warn and re-plant.

## Phase 3: Decide & Render

Read the `hash` field from `docsmap.yaml`: `v2-{entityCount}-{DD-MM-YYYY}`.

Read `garden.md` if it exists. Check for a `hash:` line in its header.

- **Cache hit** (hashes match): proceed to Phase 4 with existing `garden.md`.
- **Cache miss** (hashes differ or no garden.md): re-render below.

### Render

Build the garden table for each area in `docsmap.yaml`. Follow the **Rendering Contract** below.

For each area, compute:
1. **Dominant state** — the most frequent readiness emoji across all entities in the area (ties favour the more mature)
2. **Plants cell** — full emoji stream if ≤18 total entities; collapsed counts if >18
3. **Worms / Dead leaves** — read `area.doc_issues` from docsmap; `—` if field absent or zero
4. **Total cell** — all non-zero counts in `×N` notation, order: 🌳→🌿→🌱→🫘→🪱→🍂

Compute the **season mood line** from aggregate totals across all areas (see Rendering Contract).

Write `garden.md`:
```markdown
# Garden Map
> Rendered {DD-MM-YYYY} | hash: {hash}
> {X} entities across {N} areas
**Legend:** 🫘 seed · 🌱 small · 🌿 grown · 🌳 mature

{season-mood-line}

| Area | Plants | Worms | Dead leaves | Total |
|------|--------|-------|-------------|-------|
| {dominant} **{area.label}** | {plants-cell} | {worms-cell} | {dead-leaves-cell} | {total-cell} |
```

`doc_issues` is written by the audit workflow — never by visualise. If absent, treat all quality counts as 0.

## Phase 4: Display

Output the Gary Block. **Display shows all areas** (both primary and secondary).

```
🪴 **Gary The Gardener** v{version} | 🏞️ Garden Map

<season-mood-line>

<garden table — all areas>

🌱 *Did you know? <fun gardening fact>*
```

**Footer — passive shortcut line. Do NOT call AskUserQuestion here.**

```
↘️ **[B]** Browse area · **[S]** Summary & suggestions · **[U]** Update · **[D]** Done
```

Turn ends. Gary waits for the user to follow up.

### Shortcut Handling

When the user replies with a shortcut or intent, Gary acts:

| User says | Gary does |
|-----------|-----------|
| `B` / `browse` | Asks which area via `AskUserQuestion`, then runs Browse area flow |
| `S` / `summary` | Runs Summary & Suggestions sub-flow |
| `U` / `update` | Runs Update Garden sub-flow |
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

One row per area. Five columns.

```markdown
| Area | Plants | Worms | Dead leaves | Total |
|------|--------|-------|-------------|-------|
| 🌿 **Core Docs** | 🌿 🌿 🌳 🌳 🌿 | 🪱×2 | 🍂×1 | 🌳×2 🌿×3 🪱×2 🍂×1 |
| 🌿 **Knowledge Base** | 🌿 🌱 | — | — | 🌿×1 🌱×1 |
| 🫘 **Shed** | 🫘 🫘 🌿 🫘 | — | 🍂×3 | 🌿×1 🫘×3 🍂×3 |
| 🌳 **Artifacts** | 🌳 🌳 🌳 | — | — | 🌳×3 |
| 🌿 **Tests** | 🌿 | — | — | 🌿×1 |
```

**Area column:** dominant readiness emoji + **bold** label. For areas with 0 entities, use `🫘` as dominant emoji.

**Plants column:** full emoji stream if ≤18 entities; collapsed counts if >18: `🌳×8 🌿×12 🌱×3 🫘×1 *(browse for detail)*`. For areas with 0 entities, show `—`.

**Worms / Dead leaves columns:** read from `area.doc_issues` in docsmap. `🪱×N` / `🍂×N` or `—` if zero or absent.

**Total column:** all non-zero counts using `×N` notation, order: 🌳→🌿→🌱→🫘→🪱→🍂. For areas with 0 entities, show `—`.

### Season Mood Line

One line computed from aggregate readiness across entities in areas **that have at least one entity**. Areas with 0 entities are excluded from the percentage calculation (they don't count as "seed" — they're undocumented code directories, which is expected).

| Condition | Mood line |
|-----------|-----------|
| mature ≥ 60% | `🍂 Well-tended — mostly mature, a few seeds to nurture` |
| mature+grown ≥ 60% | `☀️ Growing well — solid coverage, room to fill in` |
| small+seed > mature+grown | `🌸 Just sprouting — garden is young, lots of potential` |
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
| 🌱 | small | 3–10 substantive lines |
| 🫘 | seed | ≤2 substantive lines |

**Documentation quality signals** (area-level — written by audit, not line-based):

| Emoji | Signal |
|-------|--------|
| 🪱 | Worm — a `.md` claim contradicting verifiable codebase facts |
| 🍂 | Dead leaf — documentation describing something that no longer exists |

Substantive line = non-empty after trim, not a frontmatter delimiter (`---`), not a pure markdown heading with no content on same line.

## Sub-flow: Plant the Garden

Full-repo discovery that creates `docsmap.yaml`, `history.jsonl`, and `garden.md` from scratch.

### Step 1: Code Directory Discovery

Gary scans the **repository structure** to understand what code exists — not just where docs are.

**Scan** (respecting `config.yaml → discovery_exclude` + always-exclude: `node_modules`, `dist`, `build`, `.git`, `coverage`, `__pycache__`, `_gs-gardener/`):
- Full directory tree, 2–3 levels deep
- For each directory: count code files (non-`.md`, non-config) and count `.md` files separately
- **Shed discovery**: scan `config.yaml → shed_patterns` + `shed_files` — collect all matching agentic files (AI instructions, tool configs, skills, agent definitions). These always form one dedicated Shed area.
- Detect tech stack signals: `package.json`, `Makefile`, `pyproject.toml`, `go.mod`, `Cargo.toml`, etc.

**Synthesize** (internal reasoning only — not shown to user):
- Project type: monorepo? single-package? pure docs repo? scripts collection?
- Which directories have code files? (candidates for areas)
- Which have both code AND docs? Which have code but NO docs? (most will have none — that's expected)
- Natural groupings: dirs related by parent, naming, or apparent purpose
- Scale: few dirs (→ compact), moderate (→ standard), many (→ fine-grained)
- Skip from candidates: pure tooling dirs (`.github/`, `.husky/`), CI configs, fully generated dirs

Gary does NOT present this analysis — it powers Step 2.

### Step 2: Propose Area Groupings

Gary proposes **2–3 concrete area groupings** using `AskUserQuestion` with markdown previews. Always include **Custom** as the 4th option.

**Producing the options:**
- **Compact** — 3–4 broad areas; good for small or tightly coupled repos
- **Standard** *(recommended for most repos)* — 5–8 areas; one per logical cluster of related code dirs
- **Fine-grained** — 8+ areas; one per code directory; good for large monorepos

**Each option preview shows the full area breakdown, emphasising undocumented dirs:**

```
Option B — Standard (6 areas) ← recommended

📁 Core Docs
   root *.md files
   Has docs: README.md, AGENTS.md

📁 src/auth/ (12 .ts files)
   No docs yet

📁 src/payments/ (8 .ts files)
   No docs yet

📚 docs/ (3 .md files)
   Has docs: ARCHITECTURE.md, core-beliefs.md, api.md

🛖 Shed (8 agentic files)
   AGENTS.md, CLAUDE.md, .cursor/rules/agents.mdc, .claude/commands/*.md, .github/agents/gardener.md, ...

🧪 tests/ (5 .ts files)
   No docs yet
```

**Judgment rules for proposals:**
- **Shed** → always one area; collects all files from `config.yaml → shed_files` + any auto-discovered via `shed_patterns`. Uses explicit per-file includes.
- Dirs with <3 code files AND no docs → merge into nearest parent area
- Root-level `.md` files → always one "Core Docs" area
- Generated/artifact dirs (`_bmad-output/`, `dist/`) → secondary area (only if they contain `.md` files)
- Dirs with only docs and no code (e.g. `docs/`) → their own area as usual

**After user picks:**
- A/B/C: Gary confirms with one summary line, proceeds to Step 3
- Custom: Gary asks one clarifying question (which areas to merge/split/rename), then proceeds

### Step 3: Classify Existing Documentation

For each area, scan its `include` patterns and find any existing `.md` files:
- **If found**: count substantive lines → classify readiness per entity
- **If none**: area has 0 entities — this is valid and expected; most areas in a typical codebase will have no docs

**Areas are independent — scan them in parallel** when the host tool supports it (see Execution Hints). Fall back to sequential if not.

Per entity, per area's granularity:
- **File-level**: count substantive lines (≥100 = mature, 11–99 = grown, 3–10 = small, ≤2 = seed)
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
version: 2
generated: "{DD-MM-YYYY}"
hash: "v2-{entityCount}-{generated}"

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
      seed: "\U0001FAD8"
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
    readiness: {mature|grown|small|seed}
    label: {display-name}
    placed: "{DD-MM-YYYY}"
    updated: "{DD-MM-YYYY}"
```

2. Write first entry to `history.jsonl`:
```jsonl
{"ts":"{DD-MM-YYYY}","action":"init","summary":"Garden planted with {N} entities ({M} mature, {G} grown, {Sm} small, {Se} seeds)","areas":["{area-ids}"],"counts":{"mature":{M},"grown":{G},"small":{Sm},"seed":{Se}}}
```

3. Render and write `garden.md` (see Phase 3).

### History Log Management

`history.jsonl` is an append-only log capped at 50 entries. When adding a 51st entry, remove the oldest entry first (line 1). Each garden operation (plant, re-plant, promote, update) appends a new log entry.

## Sub-flow: Update Garden

Evolutionary, non-destructive update that preserves spatial memory — existing entities keep their grid coordinates.

### Step 1: Discover

Re-scan each area's `include` globs. Compare discovered files to entities in `docsmap.yaml`.

Also scan `**/*.md` (respecting `config.yaml` → `discovery_exclude`) for **untracked files** — docs that don't match any area's `include` globs. If found, report them after the update summary (Step 7) and offer to add a new area or expand an existing area's globs.

Also scan for **uncovered code directories** — directories containing code files (non-`.md`, non-config) that are not covered by any area's `include` globs. Apply the same exclusions as Plant the Garden Step 1 (`node_modules`, `dist`, `.git`, etc.). Skip dirs with <3 code files. If found, surface them in Step 7.

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
2. Update `hash` to `v2-{newEntityCount}-{DD-MM-YYYY}`
3. Write updated `docsmap.yaml`
4. Append `update` entry to `history.jsonl`:
```jsonl
{"ts":"{DD-MM-YYYY}","action":"update","summary":"+{N} new, -{N} removed, {N} promoted, {N} demoted","counts":{"added":{N},"removed":{N},"promoted":{N},"demoted":{N}}}
```
5. Re-render `garden.md` (Phase 3)

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

If uncovered code directories were found in Step 1, append (after any untracked docs output):
```
📂 Found {N} code directories with no area coverage:
  - src/new-feature/ (8 .ts files)
  - src/analytics/ (5 .ts files)
  - ...
Reply [R] to re-plant the garden with updated area groupings, or [S] to skip.
```

If the user replies `[R]`: trigger the **Plant the Garden** sub-flow (re-plant), which will run code directory discovery again and propose a revised area grouping that includes the new directories.

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

## Rules

- Entity IDs are kebab-case of the relative path (e.g., `AGENTS.md` → `agents-md`, `docs/ARCHITECTURE.md` → `docs-architecture-md`)
- When re-planting, append a `replant` entry to `history.jsonl` (don't overwrite)
- Keep the Gary Block compact — the map is the star, minimize surrounding text
- The snapshot cache (`garden.md` hash) avoids re-rendering when nothing changed — respect it
- All areas use the universal emoji vocabulary: 🫘 seed, 🌱 small, 🌿 grown, 🌳 mature, 🪱 issue
- Grid coordinates reflect filesystem groupings (not flat packing)
- Garden map always shows all areas; `display` field is metadata for other workflows
