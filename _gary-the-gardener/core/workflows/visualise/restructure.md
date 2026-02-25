# Restructure Sub-gardens

> Sub-flow triggered when user types `[G]` from the garden map footer.

**Discover:**
- Re-scan repo signals: `git ls-files | grep '/' | cut -d'/' -f1 | sort -u`
- Check root stack files: `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, `turbo.json`
- Run **Choose Sub-garden Structure** sub-flow (`choose-structure.md`), passing `confirmed_areas` from `docsmap.yaml` and `repo_signals` from above

**Confirm:**
- Show the confirmed layout returned by `choose-structure.md`
- Ask snapshot preference:
  ```
  AskUserQuestion: "Save a snapshot before applying the new structure?"
  → Save snapshot first, then apply (recommended)
  → Apply now (skip snapshot)
  → Cancel
  ```
- If saving: run **Save Snapshot** sub-flow (`snapshot.md`)

**Apply:**
- Write new `sub_gardens` to `docsmap.yaml`; bump `garden_version` major (e.g. `1.0.0` → `2.0.0`); update `hash` and `generated`
- Append to `history.jsonl`: `{"ts":"{DD-MM-YYYY}","action":"restructure","summary":"Sub-gardens restructured to {N} sections","garden_version":"{new_version}"}`
- Re-render `garden.md` (Phase 3 in `workflow.md`) and display
