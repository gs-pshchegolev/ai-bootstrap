# Scaffold Workflow

> Set up the docs/ knowledge base directory structure

## Instructions

### Phase 1: Check Current State
1. **Check if docs/ directory exists:**
   - If yes: list existing files
   - If no: prepare to create

2. **Check if any documentation already exists:**
   - docs/ARCHITECTURE.md
   - docs/core-beliefs.md
   - docs/SECURITY.md
   - docs/STYLE.md
   - docs/DOMAIN.md
   - docs/references/ directory

3. **Read AGENTS.md to understand if scaffold is needed:**
   - Does AGENTS.md have a "Further Reading" section?
   - Are there pointers to docs/ files that don't exist?

### Phase 2: Plan the Scaffold
Determine what needs to be created:

```markdown
## 🏗️  Scaffold Plan

**Will create:**
- docs/ - main documentation directory
- docs/ARCHITECTURE.md - detailed architecture and domain boundaries
- docs/core-beliefs.md - golden principles stub
- docs/references/ - directory for llms.txt files

**Already exists:**
- AGENTS.md - source of truth (no changes needed)

**Purpose:**
This structure supports progressive disclosure - AGENTS.md stays compact (~150 lines),
deep content lives in docs/, and reference documentation is organized separately.
```

Show plan to user and ask: "Ready to scaffold your documentation structure? (Yes/No)"

### Phase 3: Create Directory and Files
**Only if user approves:**

1. **Create directories:**
   ```bash
   mkdir -p docs/references
   ```

2. **Create docs/ARCHITECTURE.md:**
   ```markdown
   # Architecture

   > Detailed architecture, domain boundaries, and system design

   ## Overview
   {Extract relevant architecture details from AGENTS.md if they exist, or create stub}

   ## Entry Points
   {List main entry files, server startup, etc.}

   ## Domain Boundaries
   {Describe how the codebase is organized - features, layers, modules}

   ## Key Patterns
   {Document architectural patterns - MVC, hexagonal, microservices, etc.}

   ## Data Flow
   {Describe how data moves through the system}

   ## External Dependencies
   {Document third-party integrations, APIs, databases}

   ---
   *This file contains detailed architecture that doesn't fit in AGENTS.md's 150-line budget.*
   *Keep this updated as the architecture evolves.*
   ```

3. **Create docs/core-beliefs.md:**
   ```markdown
   # Core Beliefs

   > Golden principles and operating rules for this repository

   ## Purpose
   This file captures the "always do it this way" mechanical rules that keep the codebase
   consistent and agent-legible.

   ## How to Populate
   Use `/gardener` → [EX] Extend → Golden Principles to populate this file through a guided interview.

   ## Examples of Golden Principles
   - "Prefer shared utility packages over hand-rolled helpers"
   - "Validate data at boundaries, never probe shapes"
   - "Tests live alongside source files as *.test.ts"
   - "New features require documentation before merge"

   ---
   *To add your golden principles, run: `/gs-extend` and select "Golden Principles"*
   ```

4. **Create docs/references/ directory:**
   - Create empty directory with README
   - Add docs/references/README.md:
   ```markdown
   # Reference Documentation

   This directory contains AI-optimized documentation (llms.txt files) for key dependencies.

   ## How to Populate
   Use `/gardener` → [RE] References to fetch and store llms.txt files for your frameworks and libraries.

   ## Structure
   Files are named: `{package-name}-llms.txt`

   Examples:
   - next-llms.txt
   - react-query-llms.txt
   - prisma-llms.txt

   ---
   *To fetch reference docs, run: `/gs-references`*
   ```

### Phase 4: Update AGENTS.md
Add or update the "Further Reading" section in AGENTS.md:

```markdown
## Further Reading
- `docs/ARCHITECTURE.md` — detailed architecture and domain boundaries
- `docs/core-beliefs.md` — golden principles and operating rules
- `docs/references/` — AI-optimized docs for key dependencies
```

If "Further Reading" section doesn't exist, add it at the end of AGENTS.md.

Keep additions concise - just pointers, not content.

### Phase 5: Verification and Report
1. **Verify all files were created:**
   - Check docs/ directory exists
   - Check each file exists and has content
   - Check docs/references/ directory exists

2. **Display summary:**
   ```markdown
   ✨🌱 Documentation Garden Scaffolded!

   I've planted the foundation for your documentation:
   ```
   docs/
   ├── ARCHITECTURE.md (for detailed architecture) 🏗️
   ├── core-beliefs.md (for golden principles) 💎
   └── references/ (for dependency docs) 📚
   ```

   Updated:
   - AGENTS.md - added Further Reading section with pointers 🌱

   **Next steps:**
   1. Run `/garden-extend` to plant golden principles, guardrails, or domain knowledge 🌱
   2. Run `/garden-references` to harvest llms.txt files for your dependencies 🥕
   3. Expand docs/ARCHITECTURE.md with detailed architecture (if needed beyond AGENTS.md)

   Your garden bed is prepared and ready for planting! 🌿🪴
   ```

## Critical Rules
- NEVER bloat AGENTS.md with content - just add pointers in Further Reading
- Create stub files with clear "how to populate" instructions, not invented content
- If docs/ already exists with files, don't overwrite - report what exists and ask user
- Keep ARCHITECTURE.md focused on architecture, not general repo information (that's in AGENTS.md)
- docs/references/ README should explain the pattern, not list every possible dependency
- After scaffolding, suggest next steps (extend, references) so user knows what to do

## If Docs Already Exist
If user runs scaffold when docs/ already exists:

```markdown
I see you already have a docs/ directory with some files:
- docs/README.md
- docs/setup-guide.md

Would you like me to:
1. Add missing recommended files (ARCHITECTURE.md, core-beliefs.md, references/)
2. Skip (your documentation structure is custom)

Choose: 1 or 2
```

Respect user's existing structure - don't force the pattern if they have their own.

## Example Session
```
User: SC (selects Scaffold from menu)

Gary: 🏗️  Let me help you set up a documentation foundation!

Currently, your project has:
- AGENTS.md (compact index)
- No docs/ directory

I'll create a docs/ structure following the progressive disclosure pattern - AGENTS.md stays compact, deep content lives in docs/.

Ready to scaffold your documentation structure?

User: Yes

Gary: [Creates directories and files]

✨ Documentation Garden Scaffolded!

I've planted the foundation for your documentation:
- docs/ARCHITECTURE.md (for detailed architecture)
- docs/core-beliefs.md (for golden principles)
- docs/references/ (for dependency docs)

Next, run `/gs-extend` to populate golden principles, or `/gs-references` to fetch dependency documentation.

Your garden is taking shape! 🌱
```
