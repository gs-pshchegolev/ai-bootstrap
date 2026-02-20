# Garden System Usage Guide

## Starting Gary

**Claude Code:** Run `/gardener-gary` — shows the hub with all 7 commands.

**GitHub Copilot:** Type `@gardener-gary` in VS Code Copilot Chat — activates Gary.

**Cursor / Windsurf / Junie:** The agent is always loaded via the tool's config files.

---

## The 7 Commands

### `/garden-setup` — Plant your garden

First-time setup. Gary scans your repo, discovers three buckets (Shed · Documentation · Codebase), shows real file counts, and asks how granular you want the Codebase section (Shallow / Standard / Deep). Creates `docsmap.yaml`, `garden.md`, `history.jsonl`, and `AGENTS.md` if missing.

Run when: setting up a new repo, or after major project restructuring.

### `/garden-map` — See your garden map

Reads `docsmap.yaml` and renders the garden table. Strictly read-only — never modifies your area structure.

The table groups Codebase areas by folder with bold sub-header rows:

```
| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 Shed /          | 🌳 🌿 🌱 | ·    | 🌳×1 🌿×1 🌱×1 |
| **src/**           |           |      |                 |
| 🌐 API  src/api/   | 🌿 🌳    | ·    | 🌳×1 🌿×1       |
| 🌳 Domain  src/    | 🌿 🌱    | ·    | 🌿×1 🌱×1       |
| **tests/**         |           |      |                 |
| 🧪 Tests  tests/   | 🌳 🌳    | ·    | 🌳×2            |
```

Run when: you want to see current doc coverage and readiness.

### `/garden-health` — Quick health check

Scans all entities, produces 3 prioritised improvement suggestions. Fast — no deep reads.

Run when: weekly, or before a sprint.

### `/garden-inspect` — Deep inspection

Reads every tracked entity (up to 60 lines each). Finds worms (🪱 doc contradicts code) and dead leaves (🍂 doc describes something gone). Also audits Shed for sync gaps.

Run when: after major code changes, before a release.

### `/garden-prune` — Trim AGENTS.md

Compresses AGENTS.md under 150 lines, preserving all facts. No information loss.

Run when: AGENTS.md exceeds 150 lines.

### `/garden-plant` — Add a content layer

Adds guardrails, golden principles, style guides, or domain knowledge to AGENTS.md.

Run when: after establishing a new team convention or pattern.

### `/garden-research` — Fetch dependency docs

Downloads and stores `llms.txt` files for key libraries. Keeps Gary up to date on your stack.

Run when: after upgrading or adding a major dependency.

---

## The Garden Map

Three fixed buckets — always present, always in this order:

| Bucket | What it covers |
|--------|----------------|
| 🛖 Shed | Agentic infrastructure: CLAUDE.md, .github/agents/, .cursor/rules/, .codex/, etc. |
| 📚 Documentation | Root .md files and docs/ directory |
| 💻 Codebase | All code directories — most will have no docs yet (expected) |

**Readiness:** 🌳 mature (≥100 substantive lines) · 🌿 grown (11–99) · 🌱 small (≤10)

**Quality signals** (from `/garden-inspect`): 🪱 worm (doc contradicts code) · 🍂 dead leaf (doc describes something gone)

**Folder groups:** Codebase areas with the same top-level path (e.g. all `src/*` areas) are grouped under a bold sub-header row. Groups with >7 areas split at the next directory level.

---

## Maintenance Schedule

| Frequency | Command | Why |
|-----------|---------|-----|
| After code changes | `/garden-inspect` | Catch drift before AI tools hallucinate |
| Weekly | `/garden-map` | Spot coverage gaps |
| Monthly | `/garden-health` | Get 3 improvement suggestions |
| As needed | `/garden-prune` | Keep AGENTS.md lean |
| New feature | `/garden-plant` | Document the pattern |
| Dep update | `/garden-research` | Refresh llms.txt |

---

## Architecture

```
_gary-the-gardener/
  VERSION                       # Current version (e.g. 5.2.0)
  core/
    agents/gardener.md          # Gary persona + hub + workflow activation
    config.yaml                 # Shed patterns, discovery exclusions
    style.md                    # Output format (Gary Block, table layout)
    workflows/ (7 dirs)         # One workflow.md per command
  garden/
    docsmap.yaml                # Garden state (areas, entities, grid)
    garden.md                   # Rendered snapshot (read-only cache)
    history.jsonl               # Append-only log (max 50 entries)
    moments.md                  # Good moments log
```

---

## FAQ

**Can I modify the workflows?**
No — they're overwritten on `gary-the-gardener update`. Customise via `_gary-the-gardener/core/config.yaml`.

**Does `/garden-map` modify my garden?**
Never. It's strictly read-only with respect to `docsmap.yaml`. The `[U]` Update shortcut inside the map view is the only way to write to `docsmap.yaml`, and even then it only adds — never deletes areas.

**What if Gary replants my garden accidentally?**
It won't — an explicit READ-ONLY invariant is enforced at every phase of the map workflow. If your garden has a `docsmap.yaml`, Gary displays it as-is and never reorganises it.

**Monorepo support?**
Install per-package or at the root. Adjust `config.yaml` discovery paths accordingly.

**How do I check the installed version?**
`cat _gary-the-gardener/VERSION` or `gary-the-gardener status`.

---

🪴 Happy gardening!
