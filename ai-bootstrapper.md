# AI Repository Bootstrap
# Version: 2.0.0

You are performing a one-time AI-readiness bootstrap for this repository.
Goal: generate accurate, compact "current state" documentation that makes
this repo immediately productive for AI coding agents.

## EXECUTION RULES

1. Run Phase 1 FIRST. Show discovery summary. Ask user to confirm before proceeding.
2. Do NOT proceed to Phase 2 without user confirmation.
3. If pre-existing AI config files are found (1.6), ask user: merge, replace, or skip.
4. AGENTS.md MUST be under 150 lines. It is a table of contents, not an encyclopedia. Deep content goes in `docs/`. If 150 lines cannot be achieved, ask user: accept a longer file or split into root overview + per-package detail files.
5. Flag uncertain discoveries for user review during Phase 1 confirmation.
6. During Phase 1 confirmation, ask: "Is there important context that lives outside this repo (Slack decisions, wiki pages, design docs) that should be captured in `docs/`?"
7. After generating all files, show the coverage tracker (use the garden system coverage template format, filled with actual statuses) as summary.
8. Commit message suggestion: `chore: bootstrap AI agent configuration`
9. Recommended next steps after bootstrap:
   a. Run a project-context generation workflow to capture implementation rules and conventions.
   b. Use `/garden-extend` to add guardrails, golden principles, and domain knowledge.
   c. Use `/garden-references` to fetch llms.txt files for key dependencies.

---

## PHASE 1 — DISCOVERY

Investigate this repository thoroughly but efficiently. Do NOT read every file.
Use directory listings, config files, lock files, and entry points to infer.

### 1.1 Identity

- Repository name, one-sentence purpose (infer from README, package.json, pyproject.toml, Cargo.toml, go.mod, etc.)
- Primary language(s) and framework(s)
- Is this a monorepo? If yes, list the workspaces/packages/services briefly.

### 1.2 Tech Stack (auto-detect)

Detect:
- Language version constraints (e.g., .nvmrc, .python-version, .tool-versions, rust-toolchain.toml)
- Package manager (npm/pnpm/yarn/bun/pip/poetry/uv/cargo/go mod/maven/gradle — detect from lock files)
- Frameworks (detect from dependencies, not guessing)
- Database / ORM (detect from config files or dependencies)
- Key infrastructure (Docker, Terraform, K8s manifests — just note existence)

### 1.3 Project Structure

Generate a **compact** structural overview. Rules:
- Max 3 levels deep
- Collapse directories with >10 siblings into summaries (e.g., `components/ (47 files)`)
- Highlight: entry points, config files, test directories, build outputs
- Do NOT list node_modules, vendor, build artifacts, .git

### 1.4 Development Commands

Auto-detect from package.json scripts, Makefile, justfile, Taskfile, Cargo.toml,
pyproject.toml, composer.json, etc. Report only commands that exist:
- Install dependencies
- Dev server / watch mode
- Build
- Test (unit, integration, e2e — whatever exists)
- Lint / format
- Type check

### 1.5 Key Entry Points & Architecture Hints

- Main entry file(s)
- Routing setup location (if web app)
- API definition location (if API)
- Database migrations location (if applicable)
- Config / environment files (.env.example, config/)
- Any architectural patterns visible (e.g., hexagonal, MVC, microservices via docker-compose)

### 1.6 Existing AI Configuration

Check for any pre-existing files:
- CLAUDE.md, AGENTS.md, .github/copilot-instructions.md
- .cursor/rules/, .cursorrules
- .junie/guidelines.md
- .aiignore, .aiexclude, .cursorignore
- .claude/ directory (commands, skills)
- llms.txt
- docs/ directory (existing knowledge base)

### 1.7 Reference Documentation

For key frameworks and libraries detected in 1.2, check if they publish an llms.txt
or similar AI-optimized documentation. Note any that exist — these can be fetched
later via `/garden-references` from the garden system.

---

## PHASE 2 — GENERATE FILES

Using ONLY the discovered information from Phase 1, generate the following files.

### 2.1 AGENTS.md (Source of Truth)

This is the compact index file. All other tool files reference it. Deep
documentation lives in `docs/` — AGENTS.md points there.

**Rules for AGENTS.md:**
- Maximum ~150 lines. This is a map, not the territory. Agents can always explore.
- No opinions in initial bootstrap. The "Style & Opinions" layer is added later via `/garden-extend` from the garden system.
- No placeholders like "TODO" in the visible content.
- If this is a monorepo, keep root AGENTS.md as an overview. Note that per-package files can be added later.
- Include a "Further Reading" section linking to docs/ files when they exist.

Structure it EXACTLY as follows:

---BEGIN TEMPLATE---
# {Repository Name}

> {One-sentence purpose}

## Tech Stack

{Language(s)} · {Framework(s)} · {Package Manager}
{Other key tech, one line each, only if relevant}

## Project Structure

{Compact tree from 1.3}

## Development

{Commands from 1.4, as a concise reference}

## Architecture

{Entry points and patterns from 1.5, prose or minimal structure}

## Key Conventions

{Only conventions you can VERIFY from the codebase, e.g.:
- "Tests live alongside source files as *.test.ts"
- "Environment config uses .env files with dotenv"
Do NOT invent or assume conventions. If you can't verify it, don't include it.}

## Further Reading

{Links to docs/ files. Only include entries for files that exist:
- `docs/ARCHITECTURE.md` — detailed architecture and domain boundaries
- `docs/core-beliefs.md` — golden principles and operating rules
- `docs/references/` — llms.txt files for key dependencies
If no docs/ directory exists yet, write: "Run `/garden-scaffold` from the garden system to set up the knowledge base."}
---END TEMPLATE---

### 2.2 Tool Wrapper Files

Each wrapper references AGENTS.md as the primary context. Generate the following:

| File Path | Content | Notes |
|-----------|---------|-------|
| `CLAUDE.md` | `# CLAUDE.md\n\nFollow all instructions in the root AGENTS.md file as the primary context for this repository.` | Add Claude-specific content only if needed (e.g., tool permissions) |
| `.github/copilot-instructions.md` | `# Copilot Instructions\n\nFollow all instructions in the root AGENTS.md file as the primary context for this repository.` | |
| `.cursor/rules/agents.mdc` | Frontmatter: `description: Primary repository context sourced from AGENTS.md`, `globs:` (empty), `alwaysApply: true`. Body: `Follow all instructions in the root AGENTS.md file as the primary context for this repository.` | Create `.cursor/rules/` directory if needed. Frontmatter follows Cursor's MDC format. |
| `.junie/guidelines.md` | `# Junie Guidelines\n\nFollow all instructions in the root AGENTS.md file as the primary context for this repository.` | **Only generate if user confirms JetBrains usage.** Ask during Phase 1 confirmation. |

**Cursor MDC example** (exact file format):

```
---
description: Primary repository context sourced from AGENTS.md
globs:
alwaysApply: true
---

Follow all instructions in the root AGENTS.md file as the primary context
for this repository.
```

### 2.3 .aiignore

Generate a `.aiignore` based on the repo's actual tech stack. Start from the base template below, then: remove sections for tech not present and add patterns for any sensitive directories found in Phase 1.

---BEGIN TEMPLATE---
# AI Agent Ignore File
# Prevents AI tools from reading sensitive or irrelevant files

# Secrets and credentials
.env
.env.*
!.env.example
**/secrets/
**/*.pem
**/*.key
**/*.cert

# Large generated / vendored files
node_modules/
vendor/
dist/
build/
.next/
target/
__pycache__/
*.pyc

# IDE and OS files
.idea/
.vscode/settings.json
.vscode/launch.json
.DS_Store

# AI configuration (uncomment to prevent AI tools from reading their own config)
# .claude/
# .cursor/

# Add project-specific exclusions below
---END TEMPLATE---

### 2.4 docs/ Directory (Knowledge Base Scaffold)

Create a minimal `docs/` directory as the foundation for progressive disclosure.
Only create files that have actual content from Phase 1:

| File | Content | When to create |
|------|---------|----------------|
| `docs/ARCHITECTURE.md` | Expanded version of 1.5 — entry points, patterns, domain boundaries, dependency directions. Content that won't fit in AGENTS.md's 150-line budget. | Always, if Architecture section in AGENTS.md needs more than ~10 lines |
| `docs/references/` | Empty directory. Placeholder for llms.txt files fetched later via `/garden-references` from the garden system. | Always |
| `docs/core-beliefs.md` | Empty stub: `# Core Beliefs\n\nGolden principles for this repository. Use `/garden-extend` from the garden system to populate.` | Always |

Do NOT create files with fabricated content. Stubs with clear "how to populate" instructions are better than invented documentation.

### 2.5 Garden System (Maintenance System)

Copy the garden system to enable ongoing maintenance via Gardner Gary 🪴:

**Option A: Direct Copy (Recommended)**
```bash
# Copy garden system source
cp -r {ai-bootstrap-path}/_gs/ _gs/

# Copy command files to enable skills
cp {ai-bootstrap-path}/.claude/commands/garden-*.md .claude/commands/
```

**Option B: Git Submodule (For version tracking)**
```bash
# Add ai-bootstrap as submodule
git submodule add {ai-bootstrap-repo-url} _ai-bootstrap

# Symlink garden system
ln -s _ai-bootstrap/_gs _gs

# Copy command files
cp _ai-bootstrap/.claude/commands/garden-*.md .claude/commands/
```

This enables:
- `/gardener` - Interactive maintenance menu with Gardner Gary
- Individual skills: `/garden-sync`, `/garden-audit`, `/garden-extend`, `/garden-references`, `/garden-add-tool`, `/garden-scaffold`, `/garden-garden`, `/garden-compact`

See GARDEN-SYSTEM.md in the ai-bootstrap repository for full deployment and usage guide.
