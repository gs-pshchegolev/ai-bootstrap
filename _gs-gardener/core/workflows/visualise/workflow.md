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

1. Load — read or create garden state
2. Decide — check snapshot cache
3. Render — build compact markdown map
4. Display — output Gary Block with garden map

## File Paths

- **Sitemap**: `{project-root}/_gs-gardener/data/docsmap.yaml`
- **History**: `{project-root}/_gs-gardener/data/history.jsonl`
- **Snapshot**: `{project-root}/_gs-gardener/data/garden.md`
- **Config**: `{project-root}/_gs-gardener/core/config.yaml`

## Phase 1: Load

Check if `docsmap.yaml` exists. If it does, read and parse it. If not, enter the **Plant the Garden** sub-flow (see below).

After loading, validate `version === 2`. If mismatched, warn and re-plant.

## Phase 2: Decide

Read the `hash` field from `docsmap.yaml`: `v2-{entityCount}-{DD-MM-YYYY}`.

Read `garden.md` if it exists. Check for a `hash:` line in its header.

- **Cache hit** (hashes match): skip to Phase 4, display existing `garden.md`.
- **Cache miss** (hashes differ or no garden.md): proceed to Phase 3.

## Phase 3: Render

Build compact markdown for each area in `docsmap.yaml`. Follow the **Rendering Contract** below.

For each area:
1. Read entity readiness from docsmap
2. For each row, output label + emoji sequence (no dot padding — only entity emojis)
3. Continuation rows (overflow >18) indented under the same label

Write `garden.md`:
```markdown
# Garden Map
> Rendered {DD-MM-YYYY} | hash: {hash}
> {X} entities across {N} areas
**Legend:** 🫘 seed · 🌱 small · 🌿 grown · 🌳 mature

### {area.emoji} {area.label} — {area.description}
- `{row.label}`: {emoji} {emoji} {emoji}
- `{row.label}`:
  - {emoji} {emoji} {emoji} {emoji} {emoji} ...
  - {emoji} {emoji} {emoji}
```

## Phase 4: Display

Output the Gary Block. **Display shows all areas** (both primary and secondary).

```
🪴 **Gary The Gardener** v{version} | 🗺️ Garden Map

Your documentation ecosystem at a glance

---

<garden.md content — all areas>

📊 {X} entities across {N} areas — 🌳 {M} mature, 🌿 {Gr} grown, 🌱  {Sm} small, 🫘 {Se} seeds

🌱 *Did you know? <fun gardening fact>*
```

Footer: use `AskUserQuestion` with options (max 4):
- Browse area (drill into one area — see full entity table with paths)
- Update garden (discover new files, refresh readiness, preserve layout)
- Re-plant garden (full rebuild from scratch)
- Done

**"Browse area"** flow:
1. Present an `AskUserQuestion` listing all areas as options (e.g., "Garden", "Greenhouse", "Shed", ...)
2. For the selected area, output a table: entity label, readiness emoji, and full file path
3. Return to the footer.

## Rendering Contract

### Compact Markdown Format

No ASCII borders. Each area is a `###` heading, each row is a markdown list item:

```markdown
### {area.emoji} {area.label} — {area.description}
- `{row.label}`: {emoji} {emoji}
- `{row.label}`:
  - {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji} {emoji}
  - {emoji} {emoji} {emoji} {emoji} {emoji} {emoji}
```

- Short rows (≤6 entities): inline after the label — `` - `label`: {emojis} ``
- Long rows (>6 entities): label on its own line, emoji sequences indented as `  - {emojis}`
- Overflow (>18 entities): additional `  - {emojis}` continuation line
- No dot padding — only show actual entity emojis
- All areas use universal emojis: 🫘 🌱 🌿 🌳 (+ 🪱 for issues)

### Folder-Level Aggregates

For areas using `granularity: folder`, a single entity represents a directory. The emoji is followed by a count: `🌳×12` means a folder with 12 substantial docs inside.

## Universal Emoji Vocabulary

All areas share the same 5-state emoji set:

| Emoji | State | Threshold |
|-------|-------|-----------|
| 🌳 | mature | ≥100 substantive lines |
| 🌿 | grown | 11–99 substantive lines |
| 🌱 | small | 3–10 substantive lines |
| 🫘 | seed | ≤2 substantive lines |
| 🪱 | issue | Audit-flagged (not line-based) |

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

## Rules

- Entity IDs are kebab-case of the relative path (e.g., `AGENTS.md` → `agents-md`, `docs/ARCHITECTURE.md` → `docs-architecture-md`)
- When re-planting, append a `replant` entry to `history.jsonl` (don't overwrite)
- Keep the Gary Block compact — the map is the star, minimize surrounding text
- The snapshot cache (`garden.md` hash) avoids re-rendering when nothing changed — respect it
- All areas use the universal emoji vocabulary: 🫘 seed, 🌱 small, 🌿 grown, 🌳 mature, 🪱 issue
- Grid coordinates reflect filesystem groupings (not flat packing)
- Garden map always shows all areas; `display` field is metadata for other workflows
