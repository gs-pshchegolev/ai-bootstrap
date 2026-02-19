# Health Check

> Scan the full docs ecosystem and produce exactly 3 actionable suggestions.

## Phases

1. Scan — check full ecosystem
2. Analyze — identify improvement opportunities
3. Suggest — present top 3 suggestions

## Phase 1: Scan

Check all ecosystem files using Glob and Read. Track status for each:

**Shed files**:
- `{project-root}/AGENTS.md` — exists? line count? (flag if > 140)
- `{project-root}/.aiignore` — exists?
- Read `config.yaml → shed_files` — check each listed file: exists?
- Scan `shed_patterns` on disk — any agentic files present but not yet in `shed_files`?

**Docs directory**:
- `{project-root}/docs/ARCHITECTURE.md` — exists? non-stub?
- `{project-root}/docs/core-beliefs.md` — exists? non-stub?
- `{project-root}/docs/STYLE.md` — exists?
- `{project-root}/docs/SECURITY.md` — exists?
- `{project-root}/docs/DOMAIN.md` — exists?

**References**:
- `{project-root}/docs/references/` — directory exists? any llms.txt files?
- Completeness vs actual dependencies — check whichever manifest exists: package.json, requirements.txt / pyproject.toml, Cargo.toml, go.mod, pom.xml, Gemfile, etc.

**Garden state** (optional):
- `{project-root}/_gary-the-gardener/garden/docsmap.yaml` — exists? If yes, read entity count and count seeds vs plants across all areas

**Cross-references**:
- Does AGENTS.md "Further Reading" section link to files that actually exist?

**Content layers**:
- Which `/garden-extend` layers are set up vs stubs?

## Phase 2: Analyze

From the scan results, build a ranked list of improvement opportunities:

| Condition | Suggestion | Command |
|-----------|-----------|---------|
| Missing shed file | Add shed file for that tool | `/garden-setup` |
| AGENTS.md > 140 lines | Compress to stay under limit | `/garden-compact` |
| Empty or no references/ | Fetch reference docs for dependencies | `/garden-references` |
| Missing content layers | Extend with new layer | `/garden-extend` |
| No docs/ directory | Set up knowledge base | `/garden-setup` |
| Cross-ref links broken | Fix broken links | `/garden-audit` |
| Potential staleness detected | Check for drift | `/garden-audit` |
| Seeds in garden state | Some docs are stubs — flesh them out | `/garden-extend` |
| No docsmap.yaml | Run garden visualisation to discover and map docs | `/garden-visualise` |
| Missing entities vs repo | Re-plant garden to pick up new docs | `/garden-visualise` |
| All healthy | Routine audit, extend coverage, or fetch references | various |

Rank by impact: missing core files > broken references > missing optional layers > routine maintenance.

## Phase 3: Suggest

**Always produce exactly 3 suggestions**, even if the garden is healthy. Pick the top 3 from the ranked list. If everything looks good, suggest routine maintenance actions.

Output the Gary Block:

```
🪴 **Gary The Gardener** v{version} | 👀 Health Check

Your garden at a glance

---

<ecosystem status — compact, one line per category>

1️⃣ Suggest: <most impactful action + command>
2️⃣ Suggest: <second action + command>
3️⃣ Suggest: <third action + command>

✅ Check: run this again after making changes

🌱 *Did you know? <fun gardening fact>*
```

Footer: use `AskUserQuestion` with options:
- Run suggestion #1 (label should name the specific action)
- See details (show full scan results)
- Back to menu

## Rules

- Be efficient — use Glob to check existence, only Read files when checking content/line count
- Don't overwhelm — exactly 3 suggestions, always
- Status lines should be compact, one line per category
- If a suggestion requires a workflow, name the specific `/garden-*` command
- Keep the block under 30 lines total
