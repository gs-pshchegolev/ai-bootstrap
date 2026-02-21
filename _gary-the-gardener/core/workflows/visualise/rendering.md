# Garden Map Rendering

> Rendering rules for the visualise workflow. Co-located with the workflow that uses it.
> Readiness thresholds (🌱/🌿/🌳) and quality signals live in `encyclopedia/readiness-rules.md`.

## Sub-garden Sections

The garden map is divided into **named sub-gardens**, each rendered as an H3-headed section with its own 4-column table. Sub-garden definitions live in `docsmap.yaml → sub_gardens`.

```markdown
### {sub_garden.emoji} {sub_garden.label}

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| ... rows for areas in this sub-garden ... |

### {next sub_garden.emoji} {next sub_garden.label}

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| ... |
```

The **season mood line** appears once above the first sub-garden section header.

After the last table, if `docsmap.coverage_gaps.dirs` is non-empty, show a single footer line:
```
📂 Unmapped code: {dir1} · {dir2} (checked {date})
```

## Table Layout

4-column markdown table — one row per area. Used within each sub-garden section.

```
| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| {area.emoji} **{label}** `{path-hint}` | {emoji stream or ·} | {🪱×N 🍂×M or ·} | {all non-zero ×N or ·} |
```

**Area column:** `area.emoji` from docsmap (fixed per area, not computed from readiness) + **bold** label + `path-hint` code span.

**Path hint:** longest common directory prefix of all `include` patterns. Per pattern: strip everything from the first `*`, then take the dirname. Find the shared prefix. Use `/` if empty or patterns span multiple roots.

**Plants column:** full emoji stream if ≤18 entities; `🌳×8 🌿×12 *(browse)*` for larger areas; `·` if no entities.

**Issues column:** combined `🪱×N` worms + `🍂×M` dead leaves from `doc_issues`; `·` if both zero or absent.

**Total column:** all non-zero counts, `×N` notation, order: 🌳→🌿→🌱→🪱→🍂; `·` if no entities.

### Full example

```markdown
### 🌿 Shed & Knowledge Base

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| 🛖 **Shed** `/` | 🌿 🌿 🌱 | · | 🌿×2 🌱×1 |
| 📁 **Docs** `/` | 🌳 🌳 🌿 | 🪱×1 | 🌳×2 🌿×1 🪱×1 |

### 🌳 Codebase

| Area | Plants | Issues | Total |
|------|--------|--------|-------|
| **frontend/** | | | |
| 🎯 **Pages** `frontend/pages/` | · | · | · |
| 🔧 **Components** `frontend/components/` | 🌱 | · | 🌱×1 |
| 🎣 **Hooks** `frontend/hooks/` | 🌿 🌿 | · | 🌿×2 |
| **src/** | | | |
| 🌐 **API** `src/api/` | 🌿 🌳 | 🍂×1 | 🌳×1 🌿×1 🍂×1 |
| 🌳 **Domain** `src/` | 🌿 🌱 | · | 🌿×1 🌱×1 |
| **tests/** | | | |
| 🧪 **Tests** `tests/` | 🌳 🌳 | · | 🌳×2 |
```

## Grouping

When the table contains areas from ≥2 distinct non-root folder groups, insert **sub-header rows** between those groups.

**Sub-header row format:** `| **{folder}/** | | | |` — plain bold path, no backticks (code spans override bold in most renderers), no emoji, no plants, no totals.

**Algorithm:**
1. Compute the first path segment of each area's path hint. Areas with path hint `/` = root group.
2. Root-group areas render first, flat, with no sub-header above them.
3. If ≥2 distinct non-root groups exist: insert a bold sub-header row before each non-root group.
4. If any non-root group has >7 areas: split at the next directory level, add nested sub-headers.

## Season Mood Line

One line computed from aggregate readiness across entities in areas that have at least one entity. Areas with 0 entities are excluded from the percentage calculation (they don't count against readiness — they're undocumented code directories, which is expected).

Place directly below the Gary Block header, before the first sub-garden section. **First match wins:**

| Condition | Mood line |
|-----------|-----------|
| mature ≥ 60% | `🍂 Well-tended — mostly mature, a few seeds to nurture` |
| mature+grown ≥ 60% | `☀️ Growing well — solid coverage, room to fill in` |
| small > mature+grown | `🌸 Just sprouting — garden is young, lots of potential` |
| any 🪱 worms or 🍂 dead leaves present | `⚠️ Needs attention — some docs contradict or trail the codebase` |
| default | `🌱 Taking shape — good progress, keep growing` |

## Folder-Level Aggregates

For areas using `granularity: folder`, a single entity represents a directory. The emoji is followed by a count: `🌳×12` means a folder with 12 substantial docs inside. Thresholds in `encyclopedia/readiness-rules.md`.

## Display Scope

The garden map always shows all areas. The `display` field (`primary` | `secondary`) is metadata for other workflows (e.g., health checks may prioritize primary areas) but does not affect the map view.
