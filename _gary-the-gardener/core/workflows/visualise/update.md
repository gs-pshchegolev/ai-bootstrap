# Update Garden

> Sub-flow triggered when user types `[U]` from the garden map footer.
> This is the ONLY flow that may modify `docsmap.yaml`. All modifications are additive — no area deletion.

Evolutionary, non-destructive update that preserves spatial memory — existing entities keep their grid coordinates.

### Step 1: Discover

**This step has three mandatory scans — run all three every time:**

**Scan A — existing areas:** Re-scan each area's `include` globs. Compare discovered files to entities in `docsmap.yaml`.

**Scan B — untracked `.md` files:** Scan `**/*.md` (respecting `config.yaml` → `discovery_exclude`) for docs that don't match any area's `include` globs. Collect for Step 7.

**Scan C — uncovered code directories (required):** Use `git ls-files` (or the `find` fallback for non-git repos — same exclusions as Plant the Garden Step 1) to enumerate all tracked files. Aggregate by directory at level-1 and level-2 (same CLI commands as `plant.md` Step 1). A directory is **uncovered** if it has ≥3 files AND no existing area's `include` globs would match files inside it. Collect all uncovered dirs — do not skip this scan even if Scan A found no changes. `git ls-files` ensures gitignored dirs never appear as candidates.

### Step 2: Diff

Identify:
- **New files** — on disk but not in docsmap
- **Deleted files** — in docsmap but gone from disk
- **Changed files** — line count changed significantly (>20% difference)

### Step 3: Add New

For each new file:
1. Classify readiness (same rules as planting — count substantive lines; see `encyclopedia/readiness-rules.md`)
2. Assign next available grid coordinate in the appropriate area/row
3. If the row is full (18 entities), append to a continuation line

### Step 4: Remove Deleted

For each deleted file:
1. Remove entity from `entities` section
2. Remove from the grid row's `entities` list
3. Free the grid position (existing entities stay in place — no compaction)

### Step 5: Refresh Readiness

For all existing entities (parallelizable per area — see Execution Hints in `workflow.md`):
1. Re-count substantive lines
2. Promote or demote if threshold crossed (small ↔ grown ↔ mature)
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
6. Re-render `garden.md` (Phase 3 in `workflow.md`)

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
5. Re-render `garden.md` — the new areas appear with `·` in Plants column immediately
6. Show updated garden

These are additive changes — no existing areas or entities are modified.

If neither untracked docs nor uncovered dirs: return directly to the Phase 4 footer options.
