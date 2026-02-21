# Plant the Garden

> Sub-flow triggered from Garden Visualisation Phase 2 when `docsmap.yaml` is absent.
> Full-repo discovery that creates `docsmap.yaml`, `history.jsonl`, and `garden.md` from scratch.

### Step 1: Full Repository Discovery — Three Buckets

The garden always has exactly three top-level buckets: **Shed**, **Documentation**, and **Codebase**. Gary discovers each in sequence.

---

**1a — Shed (agentic infrastructure)**

Scan `config.yaml → shed_patterns` + `shed_files` — collect all matching agentic files on disk. This always forms one dedicated Shed area regardless of repo size or granularity choice.

---

**1b — Documentation (knowledge base)**

Scan for all `.md` files in `docs/` and root-level `.md` files (README.md, AGENTS.md, CHANGELOG.md, etc.). This always forms one Documentation area. If both root-level `.md` files and a `docs/` directory are substantial (≥3 files each), Gary may split into "Core Docs" + "docs/" — decided in Step 1.5.

---

**1c — Codebase (source directories)**

Enumerate all non-Shed, non-Documentation files to map code directories.

**File enumeration:**
- **Primary (git repo)**: `git ls-files` — automatically respects `.gitignore`, `.gitmodules`, submodules.
- **Fallback (non-git)**: `find . -type f` — exclude `config.yaml → discovery_exclude` + always-exclude: `node_modules/`, `dist/`, `build/`, `.git/`, `coverage/`, `__pycache__/`, `_gary-the-gardener/`.
- `discovery_exclude` supplements `.gitignore` for non-git repos only; in git repos, `git ls-files` already handles all exclusions.

**Directory analysis (run after enumeration):**
```bash
# Level-1 breakdown: top-level dirs by total file count
git ls-files | grep '/' | cut -d'/' -f1 | sort | uniq -c | sort -rn

# Level-2 breakdown: detect large dirs with meaningful subdirs
git ls-files | grep -E '^[^/]+/[^/]+/' \
  | sed 's|^\([^/]*/[^/]*\)/.*|\1|' | sort | uniq -c | sort -rn | head -40

# Drill into any top-level dir with >50 files (run per-dir as needed)
git ls-files {dir}/ | grep '/' | cut -d'/' -f1 | sort | uniq -c | sort -rn
```

**Split-candidate rule**: a directory is worth splitting if it has ≥3 subdirectories each containing ≥5 files. Gary applies this recursively — a `frontend/` with 18 subdirs yields 18 candidate areas, not 1.

**Tech stack signals**: detect from `package.json`, `Makefile`, `pyproject.toml`, `go.mod`, `Cargo.toml` etc.

**Synthesize** (internal reasoning only — not shown to user):
- Shed: N agentic files
- Documentation: N docs files (root-level + docs/)
- Codebase: total tracked files, total dirs, split candidates; dirs with code but no docs (expected to be most)
- Skip from Codebase candidates: pure tooling dirs (`.github/`, `.husky/`), CI-only dirs, fully generated dirs

Gary does NOT present this analysis — it feeds Step 1.5.

### Step 1.5: Granularity Calibration

**Shed and Documentation areas are fixed — always exactly one area each.** This step calibrates the **Codebase bucket only**: how many code directory areas to create.

Gary presents real stats for all three buckets, then focuses the question on Codebase depth.

**Show a compact three-bucket summary** (output to user):
```
📊 Repository — 3 buckets discovered

🛖 Shed       — 9 agentic files (CLAUDE.md, .cursor/rules/, .github/agents/, ...)
📚 Documentation — 12 files (docs/ARCHITECTURE.md, AGENTS.md, README.md, ...)
💻 Codebase   — 847 code files across 29 directories

How detailed should the Codebase section be?
  frontend/       412 files (18 subdirs: components/, pages/, hooks/, ...)
  backend/        203 files (9 subdirs: api/, db/, services/, ...)
  infrastructure/  89 files (6 subdirs)
  tests/           87 files (4 subdirs)
  ...
```

**Compute three concrete options** for the Codebase section (N computed from real data):
- **Shallow** — one area per top-level code directory (no splitting).
- **Standard** *(recommended)* — splits split-candidates (≥3 subdirs × ≥5 files). Area count computed from data.
- **Deep** — one area per subdirectory with ≥5 files. Maximum visibility.

Present via `AskUserQuestion` with markdown previews. Each preview lists **actual area names and file counts** from the repo — no invented examples. Always include **Custom** as 4th option.

**Example preview for Standard:**
```
Option B — Standard (12 areas total) ← recommended

Fixed:
🛖 Shed (9 agentic files)
📚 Documentation (12 docs files)

Codebase (10 areas):
🌐 frontend/components/ (87 files — no docs yet)
🌐 frontend/pages/ (63 files — no docs yet)
🎣 frontend/hooks/ (41 files — no docs yet)
⚙️ backend/api/ (74 files — no docs yet)
🗄️ backend/db/ (58 files — no docs yet)
🔧 backend/services/ (71 files — no docs yet)
🏗️ infrastructure/ (89 files — no docs yet)
🧪 tests/ (87 files — no docs yet)
📦 (remaining small dirs merged into nearest parent)
```

**After user picks A/B/C**: Gary proceeds to the sub-garden structure question before Step 2.
**Custom**: Gary asks one clarifying question (which Codebase areas to merge/split/rename), then proceeds to sub-garden structure.

### Step 1.6: Sub-garden Structure

After granularity is decided, Gary defines how areas are grouped into sub-gardens for the map display.

**Default (no input needed)**: Two sub-gardens — "Shed & Knowledge Base" (all Shed + Documentation areas) and "Codebase" (all remaining areas). Gary proposes this and asks:

```
AskUserQuestion: "How should the garden map be organised?"
→ Default — Shed & Knowledge Base | Codebase
→ Check patterns (Gary reads encyclopedia/sub-garden-patterns.md and suggests options)
→ Custom (Gary asks one question about grouping, then confirms)
```

**If user picks Check patterns**: Gary reads `{project-root}/_gary-the-gardener/encyclopedia/sub-garden-patterns.md` and presents matching patterns as `AskUserQuestion` options based on the repo's detected tech stack and directory shape.

**Result**: A confirmed `sub_gardens` list (id, label, emoji, areas) written to `docsmap.yaml` in Step 5.

---

### Step 2: Confirm Area Layout

Gary shows the selected area layout and asks for final confirmation before writing files.

Show the area list (same compact format as the calibration preview). Then:

```
AskUserQuestion: "Plant with these N areas?"
→ Plant now
→ Let me adjust (Gary asks one merge/split/rename question, then re-confirms)
→ Start over (return to Step 1.5)
```

**Three-bucket structure (always enforced):**
- **Shed** → always exactly one area; includes from `config.yaml → shed_files` + `shed_patterns`.
- **Documentation** → always exactly one area (root `.md` files + `docs/`). If both are substantial (≥3 files each), may be split into "Core Docs" + "docs/" — user decides via Custom option.
- **Codebase** → one or more areas per granularity choice; all code directories that are not Shed or Documentation.

**Additional carry-forward rules:**
- Codebase dirs with <3 files AND no docs → merged into nearest parent area
- Generated/artifact dirs (e.g., `_bmad-output/`) → secondary area only if they contain `.md` files

### Step 3: Classify Existing Documentation

For each area, scan its `include` patterns and find any existing `.md` files:
- **If found**: count substantive lines → classify readiness per entity (see `encyclopedia/readiness-rules.md`)
- **If none**: area has 0 entities — this is valid and expected; most areas in a typical codebase will have no docs

**Areas are independent — scan them in parallel** when the host tool supports it (see Execution Hints in `workflow.md`). Fall back to sequential if not.

Per entity, per area's granularity:
- **File-level**: count substantive lines (≥100 = mature, 11–99 = grown, ≤10 = small)
- **Folder-level**: count files in dir (>10 files with content = mature, 2–10 = grown, 1 = small)

### Step 4: Assign Grid Coordinates (Spatial Mapping)

**Rows = directory groups** (filesystem structure preserved):
- Each subdirectory or logical group gets its own row
- Row has a label (the directory path or group name)
- Entities within a row are ordered alphabetically by filename

**Columns = siblings** within the group:
- Left-to-right, max 18 per row
- Overflow wraps to continuation line (indented under same label)

**Balance sparse rows** — avoid rows with only 1–2 entities:
- If a subdirectory has 1–2 files and its sibling directory also has few files, merge them into a single row with a shared parent label (e.g. `misc/`)
- If a row would have 1 entity isolated from all others, consider appending it to the nearest logical row
- Never merge rows from different areas — only within the same area

The grid mirrors the filesystem — adjacent cells are related files.

### Step 5: Write Files

Write areas with full entity and grid layout:

1. Write `docsmap.yaml` with areas, entities, grid layout. **Areas with no documentation have empty entity lists** — their grid rows have empty `entities: []`. This is valid; those areas represent undocumented code directories.

```yaml
version: 3
garden_version: "1.0.0"
generated: "{DD-MM-YYYY}"
hash: "v3-{entityCount}-{generated}"

sub_gardens:
  - id: {id}
    label: "{label}"
    emoji: "{emoji}"
    areas: [{area-id}, ...]

coverage_gaps:
  checked: "{DD-MM-YYYY}"
  dirs: []

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
    # doc_issues: optional — written by /garden-audit, never by visualise
    # doc_issues:
    #   worms: 0          # claims in .md files contradicting the codebase
    #   dead_leaves: 0    # docs referencing things that no longer exist
    #   last_checked: "{DD-MM-YYYY}"
    grid:
      cols: 18
      rows:
        - label: "{directory-group}"
          entities: [{entity-id}, ...]

entities:
  {entity-id}:
    path: "{relative-path}"
    type: {type}             # instructions | doc | shed | artifact
    area: {area-id}
    readiness: {mature|grown|small}
    label: {display-name}
    placed: "{DD-MM-YYYY}"
    updated: "{DD-MM-YYYY}"
```

2. Write first entry to `history.jsonl`:
```jsonl
{"ts":"{DD-MM-YYYY}","action":"init","summary":"Garden planted with {N} entities ({M} mature, {G} grown, {Sm} small)","areas":["{area-ids}"],"counts":{"mature":{M},"grown":{G},"small":{Sm}}}
```

3. Render and write `garden.md` (see Phase 3 in `workflow.md`).

### History Log Management

`history.jsonl` is an append-only log capped at 50 entries. When adding a 51st entry, remove the oldest entry first (line 1). Each garden operation (plant, re-plant, promote, update) appends a new log entry.
