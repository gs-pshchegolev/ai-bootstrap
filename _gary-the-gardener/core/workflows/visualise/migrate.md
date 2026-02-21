# Migrate v2 → v3

> Sub-flow triggered when Phase 2 detects `version: 2` in `docsmap.yaml`.

1. Offer a snapshot first:
   ```
   AskUserQuestion: "Your garden uses schema v2. Migrate to v3 (adds sub-gardens + garden versioning)?"
   → Migrate (save snapshot first — recommended)
   → Migrate (skip snapshot)
   → Not now (display as-is with legacy flat table)
   ```
2. If "save snapshot first": run **Save Snapshot** sub-flow (`snapshot.md`) before writing anything.
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
