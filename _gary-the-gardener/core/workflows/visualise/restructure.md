# Restructure Sub-gardens

> Sub-flow triggered when user types `[G]` from the garden map footer.

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
4. If saving snapshot: run **Save Snapshot** sub-flow (`snapshot.md`).
5. Write new `sub_gardens` to `docsmap.yaml`. Bump `garden_version` major (e.g. `1.0.0` → `2.0.0`). Update `hash` and `generated`.
6. Append to `history.jsonl`:
   ```jsonl
   {"ts":"{DD-MM-YYYY}","action":"restructure","summary":"Sub-gardens restructured to {N} sections","garden_version":"{new_version}"}
   ```
7. Re-render `garden.md` (Phase 3 in `workflow.md`) and display.
