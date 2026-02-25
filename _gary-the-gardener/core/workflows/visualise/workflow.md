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

**Load:**
- Read `garden.md` → extract `hash:` line and `Gary v{X.Y.Z}` from the header
- Read `VERSION` → if Gary versions differ, set `gary_grew = true` (garden still renders)
- Read `docsmap.yaml` → extract `hash` field and `project_summary` (if present)

**Branch:**
- Hashes match → jump to Phase 4 (no re-render needed)
- Hashes differ → jump to Phase 3 (cache-miss re-render)
- `docsmap.yaml` absent → display `garden.md` as-is with a note that the garden state file is missing

Only proceed to Phase 2 if `garden.md` is absent.

## Phase 2: Load

Check if `docsmap.yaml` exists. If it does, read and parse it. If not, enter the **Plant the Garden** sub-flow (see `plant.md`).

After loading, validate `version`:

- **`version === 3`** — current schema, proceed normally.
- **`version === 2`** — offer migration to v3 (see `migrate.md`). If user declines, proceed with the v2 data — the map renders without sub-garden sections (single flat table, as before).
- **other** — warn only, proceed as-is with a note: "docsmap schema is unexpected — run `/garden-setup` to migrate."

## Phase 3: Decide & Render

Read the `hash` field from `docsmap.yaml`: `v2-{entityCount}-{DD-MM-YYYY}`.

Read `garden.md` if it exists. Check for a `hash:` line in its header.

- **Cache hit** (hashes match): proceed to Phase 4 with existing `garden.md`.
- **Cache miss** (hashes differ or no garden.md): re-render below.

### Render

Build the garden table for each area in `docsmap.yaml`. Follow the **Rendering Contract** in `rendering.md`.

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

Compute the **season mood line** from aggregate totals across all areas (see `rendering.md`).

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

🍃 {project_summary from docsmap.yaml — omit line if absent}

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
| `S` / `summary` | Runs Summary & Suggestions sub-flow (see `summary.md`) |
| `U` / `update` | Runs Update Garden sub-flow (see `update.md`) |
| `G` / `restructure` | Runs Restructure Sub-gardens sub-flow (see `restructure.md`) |
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

> Full specification: `_gary-the-gardener/core/workflows/visualise/rendering.md`

## Sub-flow: Plant the Garden

> Full specification: `_gary-the-gardener/core/workflows/visualise/plant.md`

## Sub-flow: Update Garden

> Full specification: `_gary-the-gardener/core/workflows/visualise/update.md`

## Sub-flow: Summary & Suggestions

> Full specification: `_gary-the-gardener/core/workflows/visualise/summary.md`

## Sub-flow: Migrate v2 → v3

> Full specification: `_gary-the-gardener/core/workflows/visualise/migrate.md`

## Sub-flow: Save Snapshot

> Full specification: `_gary-the-gardener/core/workflows/visualise/snapshot.md`

## Sub-flow: Restructure Sub-gardens

> Full specification: `_gary-the-gardener/core/workflows/visualise/restructure.md`

## Sub-flow: Choose Sub-garden Structure

> Full specification: `_gary-the-gardener/core/workflows/visualise/choose-structure.md`
> Called by: Plant step 1.6, Restructure step 2

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
