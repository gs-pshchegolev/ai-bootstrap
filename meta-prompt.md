# AI Instructions Maintenance — meta-prompt.md
# Reusable prompt. Paste into any AI coding agent when you need to
# review, update, or extend the AI configuration for this repository.
# Version: 1.0.0
# Note: {STATUS} placeholders below are filled in by ai-bootstrapper.md at generation time.

You are maintaining the AI-readiness configuration for this repository.

<!-- HUMAN-READABLE SECTION -->

## Coverage Status

| Category | File | Status |
|----------|------|--------|
| Source of Truth | AGENTS.md | {STATUS} |
| Claude Code | CLAUDE.md | {STATUS} |
| GitHub Copilot | .github/copilot-instructions.md | {STATUS} |
| Cursor | .cursor/rules/agents.mdc | {STATUS} |
| JetBrains Junie | .junie/guidelines.md | {STATUS} |
| Security | .aiignore | {STATUS} |

{STATUS} = ✅ exists | 🔲 missing | ⚠️ outdated/empty

### Content Layers

- ✅ Current State — Tech, structure, commands, architecture
- 🔲 Guardrails — Safety rules, boundaries, permissions
- 🔲 Style & Opinions — Code conventions, preferred patterns, formatting
- 🔲 Workflows/Skills — .claude/skills/, slash commands, reusable workflows
- 🔲 Domain Knowledge — Business terminology, API contracts, data models

<!-- LLM SECTION: Maintenance task definitions -->

## Available Tasks

When this prompt is used, ask the user which task they want to perform:

### sync — Sync all tool wrappers with AGENTS.md

Read AGENTS.md. Verify each wrapper file still references it correctly.
Report any that have drifted or contain conflicting instructions.
Update wrappers if needed.

### audit — Audit current state accuracy

Re-discover the repository's current state (scan dependencies, structure, commands, entry points, architecture) and compare against AGENTS.md.
Report any drift: new dependencies, changed structure, new scripts.
Propose a minimal diff to update AGENTS.md.

### extend — Add a new content layer

Ask the user which layer they want to fill:
- **Guardrails**: Safety rules, what agents should NOT do, permission boundaries
- **Style & Opinions**: Code conventions, preferred patterns, formatting preferences. Note: this layer is distinct from the initial bootstrap, which contains only verified facts.
- **Workflows/Skills**: Reusable agent workflows (Claude skills, Copilot agents)
- **Domain Knowledge**: Business terminology, API contracts, data models

For each layer, interview the user with focused questions,
then generate compact additions to AGENTS.md.

### add-tool — Add support for a new AI tool

Ask which tool. Generate the appropriate wrapper file
referencing AGENTS.md. Update the tracker.

### compact — Compress AGENTS.md

Review AGENTS.md for verbosity. Compress while preserving all facts.
Target: under 150 lines. Report before/after line count.
After compression, confirm all facts from the original are present in the compressed version. Report any removed content.
