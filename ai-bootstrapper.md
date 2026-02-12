# AI Repository Bootstrap — init.prompt.md
# Paste this into Claude Code inside the target repository. One-time use.
# Version: 1.0.0

You are performing a one-time AI-readiness bootstrap for this repository.
Your goal: make this repo immediately productive for AI coding agents by
generating accurate, compact "current state" documentation.

## PHASE 1 — DISCOVERY

Investigate this repository thoroughly but efficiently. Do NOT read every file.
Use directory listings, config files, lock files, and entry points to infer.

Gather the following. If something doesn't apply, skip it — don't leave empty sections.

### 1.1 Identity
- Repository name, one-sentence purpose (infer from README, package.json, pyproject.toml, Cargo.toml, go.mod, etc.)
- Primary language(s) and framework(s)
- Is this a monorepo? If yes, list the workspaces/packages/services briefly.

### 1.2 Tech Stack (auto-detect)
Scan for and report only what exists:
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

Report what exists. We will NOT overwrite without confirmation.

---

## PHASE 2 — GENERATE FILES

Using ONLY the discovered information from Phase 1, generate the following files.

### 2.1 AGENTS.md (Source of Truth)

This is the canonical file. All other tool files reference or mirror this.

Structure it EXACTLY as follows:

```markdown
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

---







```

**Rules for AGENTS.md:**
- Maximum ~150 lines. Compress aggressively. Agents are good at exploring;
  they need a map, not a textbook.
- No opinions. No "prefer X over Y". Only verified facts.
- No placeholders like "TODO" in the visible content.
  The tracker comment block at the bottom tracks what's not yet done.
- If this is a monorepo, keep root AGENTS.md as an overview.
  Note that per-package files can be added later.

### 2.2 CLAUDE.md (Claude Code wrapper)

```markdown
# CLAUDE.md

Follow all instructions in ./AGENTS.md as the primary context for this repository.



```

Keep it this minimal. Claude Code reads AGENTS.md content via this reference.
Only add Claude-specific content if there's a genuine reason (e.g., tool permissions).

### 2.3 .github/copilot-instructions.md (GitHub Copilot wrapper)

```markdown
# Copilot Instructions

Follow all instructions in the root AGENTS.md file as the primary context
for this repository.


```

### 2.4 .cursor/rules/agents.mdc (Cursor wrapper)

Create `.cursor/rules/` directory if it doesn't exist.

```markdown
---
description: Primary repository context sourced from AGENTS.md
globs:
alwaysApply: true
---

Follow all instructions in the root AGENTS.md file as the primary context
for this repository.


```

### 2.5 .junie/guidelines.md (JetBrains Junie — optional)

Only generate if user confirms JetBrains usage. If generating:

```markdown
# Junie Guidelines

Follow all instructions in the root AGENTS.md file as the primary context
for this repository.


```

### 2.6 .aiignore

Generate a sensible default based on what exists in the repo:

```gitignore
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
.DS_Store

# AI configuration (don't recurse into own config)
# .claude/
# .cursor/

# Add project-specific exclusions below
```

Adapt this to the actual repo. Remove sections for tech that doesn't exist.
Add patterns for any sensitive-looking directories discovered during Phase 1.

### 2.7 meta.prompt.md (Maintenance Helper)

Generate this file using the template in the next section.

---

## PHASE 3 — GENERATE meta.prompt.md

Create `meta.prompt.md` with the following content, filling in the
`{CURRENT_STATUS}` section based on what was actually generated:

---BEGIN meta.prompt.md TEMPLATE---

# AI Instructions Maintenance — meta.prompt.md
# Reusable prompt. Paste into any AI coding agent when you need to
# review, update, or extend the AI configuration for this repository.
# Version: 1.0.0

You are maintaining the AI-readiness configuration for this repository.

## CURRENT COVERAGE STATUS

```
┌─────────────────────────────────────────────────────────┐
│                  AI-READINESS TRACKER                    │
├──────────────────────┬──────────────────────────────────┤
│ Source of Truth       │ AGENTS.md              {STATUS} │
├──────────────────────┼──────────────────────────────────┤
│ Tool Wrappers         │                                 │
│  · Claude Code        │ CLAUDE.md              {STATUS} │
│  · GitHub Copilot     │ .github/copilot-       {STATUS} │
│  │                    │  instructions.md                │
│  · Cursor             │ .cursor/rules/         {STATUS} │
│  │                    │  agents.mdc                     │
│  · JetBrains Junie    │ .junie/guidelines.md   {STATUS} │
├──────────────────────┼──────────────────────────────────┤
│ Security              │ .aiignore              {STATUS} │
├──────────────────────┼──────────────────────────────────┤
│ Content Layers        │                                 │
│  ✅ Current State     │ Tech, structure, commands, arch  │
│  🔲 Guardrails        │ Safety rules, boundaries, perms │
│  🔲 Style & Opinions  │ Code style, patterns, prefs     │
│  🔲 Workflows/Skills  │ .claude/skills/, slash commands │
│  🔲 Domain Knowledge  │ Business logic, glossary, APIs  │
└──────────────────────┴──────────────────────────────────┘
```

{STATUS} = ✅ exists | 🔲 missing | ⚠️ outdated/empty

## AVAILABLE TASKS

When this prompt is used, ask the user which task they want to perform:

### sync — Sync all tool wrappers with AGENTS.md
Read AGENTS.md. Verify each wrapper file still references it correctly.
Report any that have drifted or contain conflicting instructions.
Update wrappers if needed.

### audit — Audit current state accuracy
Re-run discovery (same as init Phase 1) and compare against AGENTS.md.
Report any drift: new dependencies, changed structure, new scripts.
Propose a minimal diff to update AGENTS.md.

### extend — Add a new content layer
Ask the user which layer they want to fill:
- **Guardrails**: Safety rules, what agents should NOT do, permission boundaries
- **Style & Opinions**: Code conventions, preferred patterns, formatting
- **Workflows/Skills**: Reusable agent workflows (Claude skills, Copilot agents)
- **Domain Knowledge**: Business terminology, API contracts, data models

For each layer, interview the user with focused questions (max 5),
then generate compact additions to AGENTS.md and sync wrappers.

### add-tool — Add support for a new AI tool
Ask which tool. Generate the appropriate wrapper file
referencing AGENTS.md. Update the tracker.

### compact — Compress AGENTS.md
Review AGENTS.md for verbosity. Compress while preserving all facts.
Target: under 150 lines. Report before/after line count.

---END meta.prompt.md TEMPLATE---

Fill in {STATUS} values based on what was actually generated in Phase 2.

---

## EXECUTION RULES

1. Run Phase 1 FIRST. Show the discovery summary to the user.
   Ask: "Does this look accurate? Should I proceed with generating files?"

2. Do NOT proceed to Phase 2 without user confirmation.

3. If pre-existing AI config files are found (Phase 1.6), ask the user
   how to handle them: merge, replace, or skip.

4. After generating all files, show the completed tracker from meta.prompt.md
   as a summary.

5. Commit message suggestion: `chore: bootstrap AI agent configuration`

6. Keep total AGENTS.md under 150 lines. This is a hard constraint.
   If the repo is huge, be more aggressive about summarizing.
   Agents can always explore — they need a map, not the territory.