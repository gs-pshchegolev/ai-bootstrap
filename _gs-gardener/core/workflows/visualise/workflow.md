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

Check if `garden.md` exists. If it does, **read it and jump directly to Phase 4** — no docsmap loading, no hash verification. This is the observe path: the user just wants to see the map.

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
3. **Worms / Dead leaves / Signs** — read `area.code_issues` from docsmap; `—` if field absent or zero
4. **Total cell** — all non-zero counts in `×N` notation, order: 🌳→🌿→🌱→🫘→🪱→🍂→🪧

Compute the **season mood line** from aggregate totals across all areas (see Rendering Contract).

Write `garden.md`:
```markdown
# Garden Map
> Rendered {DD-MM-YYYY} | hash: {hash}
> {X} entities across {N} areas
**Legend:** 🫘 seed · 🌱 small · 🌿 grown · 🌳 mature

{season-mood-line}

| Area | Plants | Worms | Dead leaves | Signs | Total |
|------|--------|-------|-------------|-------|-------|
| {dominant} **{area.label}** | {plants-cell} | {worms-cell} | {dead-leaves-cell} | {signs-cell} | {total-cell} |
```

`code_issues` is written by the audit workflow — never by visualise. If absent, treat all quality counts as 0.

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
   Pick an area: **[1]** Core Docs · **[2]** Knowledge Base · **[3]** Wrappers · ...
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

One row per area. Six columns.

```markdown
| Area | Plants | Worms | Dead leaves | Signs | Total |
|------|--------|-------|-------------|-------|-------|
| 🌿 **Core Docs** | 🌿 🌿 🌳 🌳 🌿 | 🪱×2 | 🍂×1 | — | 🌳×2 🌿×3 🪱×2 🍂×1 |
| 🌿 **Knowledge Base** | 🌿 🌱 | — | — | 🪧×4 | 🌿×1 🌱×1 🪧×4 |
| 🫘 **Wrappers** | 🫘 🫘 🌿 🫘 | — | 🍂×3 | — | 🌿×1 🫘×3 🍂×3 |
| 🌳 **Artifacts** | 🌳 🌳 🌳 | — | — | — | 🌳×3 |
| 🌿 **Tests** | 🌿 | — | — | — | 🌿×1 |
```

**Area column:** dominant readiness emoji + **bold** area label.

**Plants column:**
- ≤18 total entities: full emoji stream — all entities concatenated with spaces across all grid rows. Directory grouping not shown here (lives in browse detail).
- >18 total entities: collapsed counts — `🌳×8 🌿×12 🌱×3 🫘×1 *(browse for detail)*`

**Worms / Dead leaves / Signs columns:** read from `area.code_issues` in docsmap. `🪱×N` / `🍂×N` / `🪧×N` or `—` if zero or absent. Sampled areas show `~` suffix: `🪱~×4`.

**Total column:** all non-zero counts using `×N` notation, order: 🌳→🌿→🌱→🫘→🪱→🍂→🪧.

### Season Mood Line

One line computed from aggregate readiness across all entities in all areas:

| Condition | Mood line |
|-----------|-----------|
| mature ≥ 60% | `🍂 Well-tended — mostly mature, a few seeds to nurture` |
| mature+grown ≥ 60% | `☀️ Growing well — solid coverage, room to fill in` |
| small+seed > mature+grown | `🌸 Just sprouting — garden is young, lots of potential` |
| any 🪱 worms or 🍂 dead leaves present | `⚠️ Needs attention — some code quality issues found` |
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

**Code quality signals** (area-level — written by audit, not line-based):

| Emoji | Signal |
|-------|--------|
| 🪱 | Worm — misleading name in code |
| 🍂 | Dead leaf — expired comment in code |
| 🪧 | Sign — meaningful JSDoc/commented TS definition |

Substantive line = non-empty after trim, not a frontmatter delimiter (`---`), not a pure markdown heading with no content on same line.

## Sub-flow: Plant the Garden

Full-repo discovery that creates `docsmap.yaml`, `history.jsonl`, and `garden.md` from scratch.

### Step 1: Full Discovery + Classification

Scan `**/*.md` (excluding directories listed in `config.yaml` → `discovery_exclude`, and always excluding `_gs-gardener/` internals).

Classify discovered files into documentation vs non-documentation:

**Documentation** (tracked): files whose primary purpose is to inform humans or AI agents — docs, instructions, guides, specs, planning artifacts.

**Non-documentation** (excluded): tool configs, command scripts, agent definitions, workflow internals, generated output. Use `config.yaml` → `wrapper_files` to identify wrapper/redirect files that belong in their own area.

Present filtered summary showing only documentation files, with counts per directory.

### Step 2: Ask User to Define Areas

Ask the user to organize the documentation files into areas. Suggest groupings based on the discovered file structure — look for natural clusters by directory.

Each area needs:
- **Label + emoji** — short name and icon
- **Include globs** — which files belong
- **Granularity** — `file` (one entity per file) or `folder` (one entity per directory)
- **Display** — `primary` (shown by default) or `secondary` (shown on request)

For areas with many files, individual file-level tracking is fine for distinct docs. For areas with hundreds of files, offer **folder-level aggregates**: one entity per subdirectory showing file count.

### Step 3: Classify Readiness

Classify all entities by counting substantive lines. **Areas are independent — scan them in parallel** when the host tool supports it (see Execution Hints). Fall back to sequential if not.

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

The grid mirrors the filesystem — adjacent cells are related files.

### Step 5: Write Files

1. Write `docsmap.yaml` with areas, entities, grid layout:

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
      issue: "\U0001FAB1"
    grid:
      cols: 18
      rows:
        - label: "{directory-group}"
          entities: [{entity-id}, ...]

entities:
  {entity-id}:
    path: "{relative-path}"
    type: {type}
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

If untracked files were found in Step 1, append:
```
📂 Found {N} docs outside tracked areas:
  - {path} ({readiness})
  - ...
```

Then ask the user (via `AskUserQuestion`):
- Add new area (define a new area to cover these files)
- Expand existing area (add globs to an existing area)
- Ignore (skip — files remain untracked)

If no untracked files, return directly to the Phase 4 footer options.

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
