# AI Repository Bootstrap
# Version: 1.0.0

You are performing a one-time AI-readiness bootstrap for this repository.
Goal: generate accurate, compact "current state" documentation that makes
this repo immediately productive for AI coding agents.

## EXECUTION RULES

1. Run Phase 1 FIRST. Show discovery summary. Ask user to confirm before proceeding.
2. Do NOT proceed to Phase 2 without user confirmation.
3. If pre-existing AI config files are found (1.6), ask user: merge, replace, or skip.
4. AGENTS.md MUST be under 150 lines. If the repo is large, summarize more aggressively. Verify line count before writing. If 150 lines cannot be achieved, ask user: accept a longer file or split into root overview + per-package detail files.
5. Flag uncertain discoveries for user review during Phase 1 confirmation.
6. After generating all files, show the coverage tracker (use the table format from meta-prompt.md, filled with actual statuses) as summary.
7. Commit message suggestion: `chore: bootstrap AI agent configuration`
8. Recommended next step: run a project-context generation workflow to capture implementation rules and conventions (the "rulebook" complement to the "map" this prompt creates).
9. The generated meta-prompt.md provides ongoing maintenance tasks (sync, audit, extend, add-tool, compact) for future upkeep.

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

---

## PHASE 2 — GENERATE FILES

Using ONLY the discovered information from Phase 1, generate the following files.

### 2.1 AGENTS.md (Source of Truth)

This is the canonical file. All other tool files reference or mirror this.

**Rules for AGENTS.md:**
- Maximum ~150 lines. Compress aggressively. Agents are good at exploring; they need a map, not a textbook.
- No opinions in initial bootstrap. The "Style & Opinions" layer is added later via the extend task in meta-prompt.md.
- No placeholders like "TODO" in the visible content. The tracker comment block at the bottom tracks what's not yet done.
- If this is a monorepo, keep root AGENTS.md as an overview. Note that per-package files can be added later.

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

### 2.4 meta-prompt.md (Maintenance Helper)

Generate `meta-prompt.md` in the target repository using the companion template
(distributed alongside this bootstrapper). Copy its structure and fill in all
{STATUS} values based on what was actually generated in this phase.
This file enables future maintenance: syncing wrappers, auditing drift,
extending content layers, and adding new tool support.
