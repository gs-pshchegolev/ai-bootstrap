---
title: 'Revise AI Bootstrapper Prompt Per Review Findings'
slug: 'revise-ai-bootstrapper-prompt'
created: '2026-02-06'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: [markdown]
files_to_modify: [ai-bootstrapper.md, meta-prompt.md]
code_patterns: [prompt-task-definition-model, rules-first, data-logic-separation, template-delimiters]
test_patterns: [manual-top-to-bottom-read-verification]
---

# Tech-Spec: Revise AI Bootstrapper Prompt Per Review Findings

**Created:** 2026-02-06

## Overview

### Problem Statement

`ai-boostrapper.md` has structural flaws (execution rules buried at end, artificial Phase 3 separation, redundant wrapper sections), factual issues (filename typo, unenforceable 150-line constraint, orphaned Junie conditional), and density problems (fragile ASCII tracker, hedging language, blank template lines). An adversarial review surfaced 15 findings and a structural editorial review surfaced 10 recommendations — totaling ~25 distinct issues.

### Solution

Restructure the document following Prompt/Task Definition principles (constraints before actions, logic separated from data), address all findings from both reviews, and extract the meta.prompt.md maintenance tasks into a cleaner form. Preserve the dual-audience design: human-readable tracker screen at top of meta.prompt.md, LLM-optimized instructions below.

### Scope

**In Scope:**
- All 15 adversarial findings
- All 10 structural editorial recommendations
- Filename fix (`boostrapper` -> `bootstrapper`)
- Restructure: move Execution Rules to top of document, merge Phase 3 into Phase 2
- Condense: collapse wrapper sections 2.2-2.5 into table, replace ASCII tracker with markdown table
- Extract: meta.prompt.md into a separate file (no longer embedded as a nested template)
- Preserve: wrapper-reference approach (intentional), dual-audience meta.prompt.md
- Cross-reference: note that generate-project-context (rulebook) is a natural next step after bootstrapping (map)

**Out of Scope:**
- Changing the AGENTS.md-as-source-of-truth architecture
- Adding new features/phases to the bootstrap process
- Validating whether specific AI tools actually follow file references (accepted as-is)

## Context for Development

### Codebase Patterns

- Single markdown document (~1,386 words, 326 lines)
- Three-phase structure: Discovery (L9-63) → Generate Files (L67-224) → Generate meta.prompt.md (L228-305) → Execution Rules (L309-326)
- Uses markdown code blocks for file templates (AGENTS.md, CLAUDE.md, .aiignore, etc.)
- Wrapper files (2.2-2.5) all share identical pattern: "Follow all instructions in the root AGENTS.md file"
- Execution rules buried at L309-326, after all phases — LLM encounters Phase 2 instructions before learning it must stop after Phase 1

### Files to Reference

| File | Purpose |
| ---- | ------- |
| ai-boostrapper.md | The bootstrap prompt being revised (rename to ai-bootstrapper.md) |
| meta-prompt.md | New separate file extracted from the bootstrapper's Phase 3 (L228-305) |
| generate-project-context workflow | BMAD reference — rules-first pattern, per-category collaboration, complementary tool |

### Technical Decisions

- Wrapper-reference approach is intentional and will be preserved as-is (not validated per-tool)
- meta.prompt.md extracted into its own standalone file, not embedded in the bootstrapper
- meta.prompt.md keeps dual-audience design: first screen human-readable tracker (with explicit marker), rest LLM-optimized maintenance tasks
- ASCII box-drawing tracker table replaced with standard markdown table
- Bootstrapper stays a single standalone file (no step-file architecture) but applies BMAD principles: rules-first, data/logic separation
- Templates treated as delimited data blocks (e.g., `---BEGIN TEMPLATE---` / `---END TEMPLATE---`), not interleaved with instructions
- Bootstrapper (map) and project-context (rulebook) are complementary — bootstrapper should cross-reference project-context as a recommended next step

### Party Mode Insights

- BMAD's generate-project-context workflow puts execution rules at the TOP of every step — validates the structural review's #1 recommendation
- generate-project-context uses collaborative per-category checkpoints (A/P/C menus) — the bootstrapper's single confirmation gate after Phase 1 is less robust but acceptable for a standalone prompt
- The two tools are complementary: bootstrapper produces the "what exists" map (AGENTS.md), project-context produces the "how to work here" rulebook
- Explicit dual-audience markers (HTML comments or section headers) needed in meta.prompt.md to separate human-facing tracker from LLM-facing tasks

## Implementation Plan

### Tasks

- [x] Task 1: Rename file
  - File: `ai-boostrapper.md` → `ai-bootstrapper.md`
  - Action: `git mv ai-boostrapper.md ai-bootstrapper.md`
  - Notes: Fixes typo (missing 't'). All subsequent tasks reference the new filename.
  - Resolves: A1

- [x] Task 2: Create `meta-prompt.md` as a standalone file
  - File: `meta-prompt.md` (new)
  - Action: Extract lines 233-303 from the bootstrapper into a new standalone file with the following structure:
    1. **Preamble** — title, version, one-line purpose ("Reusable maintenance prompt for AI-readiness configuration")
    2. **`<!-- HUMAN-READABLE SECTION -->`** — Coverage status tracker as a standard markdown table:
       | Category | File | Status |
       |----------|------|--------|
       | Source of Truth | AGENTS.md | {STATUS} |
       | Claude Code | CLAUDE.md | {STATUS} |
       | GitHub Copilot | .github/copilot-instructions.md | {STATUS} |
       | Cursor | .cursor/rules/agents.mdc | {STATUS} |
       | JetBrains Junie | .junie/guidelines.md | {STATUS} |
       | Security | .aiignore | {STATUS} |
       Then content layers checklist (Current State, Guardrails, Style & Opinions, Workflows/Skills, Domain Knowledge)
       Include `{STATUS} = ✅ exists | 🔲 missing | ⚠️ outdated/empty` legend
    3. **`<!-- LLM SECTION: Maintenance task definitions -->`** — Available tasks:
       - **sync**: unchanged
       - **audit**: unchanged
       - **extend**: remove arbitrary "max 5 questions" cap; add note that "Style & Opinions" layer is distinct from the initial bootstrap (which contains only verified facts)
       - **add-tool**: unchanged
       - **compact**: add verification step — "After compression, confirm all facts from the original are present in the compressed version. Report any removed content."
  - Notes: {STATUS} values are filled by the bootstrapper at generation time. The bootstrapper will reference this file rather than embedding the template.
  - Resolves: A6, A10, A11, A15, S2, S4, S6

- [x] Task 3: Restructure `ai-bootstrapper.md` — move Execution Rules to top
  - File: `ai-bootstrapper.md`
  - Action: Move current lines 309-326 (EXECUTION RULES section) to immediately after the preamble (after the goal statement, before Phase 1). Rewrite as:
    ```
    ## EXECUTION RULES
    1. Run Phase 1 FIRST. Show discovery summary. Ask user to confirm before proceeding.
    2. Do NOT proceed to Phase 2 without user confirmation.
    3. If pre-existing AI config files are found (1.6), ask user: merge, replace, or skip.
    4. AGENTS.md MUST be under 150 lines. If the repo is large, summarize more aggressively. Verify line count before writing.
    5. Flag uncertain discoveries for user review during Phase 1 confirmation.
    6. After generating all files, show the completed coverage tracker as summary.
    7. Commit message suggestion: `chore: bootstrap AI agent configuration`
    8. Recommended next step: run a project-context generation workflow to capture implementation rules and conventions (the "rulebook" complement to the "map" this prompt creates).
    ```
  - Notes: Rule 4 consolidates the 150-line constraint from old rule 6 + the AGENTS.md rules block. Rule 5 addresses the infer-vs-verified gap. Rule 8 adds the cross-reference.
  - Resolves: A7, A14, S1

- [x] Task 4: Condense preamble
  - File: `ai-bootstrapper.md`
  - Action: Replace lines 1-7 with a condensed version:
    ```
    # AI Repository Bootstrap
    # Version: 1.0.0

    You are performing a one-time AI-readiness bootstrap for this repository.
    Goal: generate accurate, compact "current state" documentation that makes
    this repo immediately productive for AI coding agents.
    ```
  - Notes: Remove "Paste this into Claude Code" (unnecessary once pasted) and "init.prompt.md" subtitle. Keep version.
  - Resolves: S10

- [x] Task 5: Clean up Phase 1 — remove hedging, relocate inline rules
  - File: `ai-bootstrapper.md`
  - Action:
    - L14: Remove "If something doesn't apply, skip it — don't leave empty sections." (implicit — agents already skip inapplicable items)
    - L22: Remove "Scan for and report only what exists:" — change to just "Detect:"
    - L63: Remove "Report what exists. We will NOT overwrite without confirmation." — this is now covered by Execution Rule 3
  - Resolves: A14 (partial), S7

- [x] Task 6: Restructure section 2.1 — AGENTS.md rules before template
  - File: `ai-bootstrapper.md`
  - Action:
    1. Move the "Rules for AGENTS.md" block (current L116-123) to BEFORE the template code block (before current L77)
    2. Delete the 6 blank lines inside the template (current L108-113)
    3. Add note to rules: "No opinions in initial bootstrap. The 'Style & Opinions' layer is added later via the extend task in meta-prompt.md."
  - Resolves: A4, A5, S5, S9

- [x] Task 7: Collapse wrapper sections 2.2-2.5 into a single table
  - File: `ai-bootstrapper.md`
  - Action: Replace sections 2.2, 2.3, 2.4, 2.5 (current L125-178) with a single section:
    ```
    ### 2.2 Tool Wrapper Files

    Each wrapper references AGENTS.md as the primary context. Generate the following:

    | File Path | Content | Notes |
    |-----------|---------|-------|
    | `CLAUDE.md` | `# CLAUDE.md\n\nFollow all instructions in ./AGENTS.md as the primary context for this repository.` | Add Claude-specific content only if needed (e.g., tool permissions) |
    | `.github/copilot-instructions.md` | `# Copilot Instructions\n\nFollow all instructions in the root AGENTS.md file as the primary context for this repository.` | |
    | `.cursor/rules/agents.mdc` | Frontmatter: `description: Primary repository context sourced from AGENTS.md`, `globs:` (empty), `alwaysApply: true`. Body: `Follow all instructions in the root AGENTS.md file as the primary context for this repository.` | Create `.cursor/rules/` directory if needed. Frontmatter follows Cursor's MDC format. |
    | `.junie/guidelines.md` | `# Junie Guidelines\n\nFollow all instructions in the root AGENTS.md file as the primary context for this repository.` | **Only generate if user confirms JetBrains usage.** Ask during Phase 1 confirmation. |
    ```
  - Notes: Resolves redundancy, surfaces the Junie conditional as a visible table note, and documents the Cursor frontmatter format.
  - Resolves: A2, A3, A9, A12, S3

- [x] Task 8: Fix .aiignore section — adaptation note before template
  - File: `ai-bootstrapper.md`
  - Action:
    1. Move the adaptation instructions (current L219-220) to BEFORE the template code block
    2. Rewrite as: "Generate a `.aiignore` based on the repo's actual tech stack. Start from the base template below, then: remove sections for tech not present, add patterns for any sensitive directories found in Phase 1, and include `.vscode/launch.json` alongside `.vscode/settings.json`."
    3. Keep the template as a `---BEGIN TEMPLATE---` / `---END TEMPLATE---` delimited block
  - Resolves: A8, S8

- [x] Task 9: Replace Phase 3 + section 2.7 with brief meta-prompt.md reference
  - File: `ai-bootstrapper.md`
  - Action: Replace section 2.7 (L222-224) and all of Phase 3 (L228-305) with:
    ```
    ### 2.4 meta-prompt.md (Maintenance Helper)

    Generate `meta-prompt.md` using the separate `meta-prompt.md` template file.
    Fill in all {STATUS} values based on what was actually generated in this phase.
    This file enables future maintenance: syncing wrappers, auditing drift,
    extending content layers, and adding new tool support.
    ```
  - Notes: The full template now lives in the standalone `meta-prompt.md` file (Task 2). The bootstrapper just references it and fills in status values.
  - Resolves: A6, S2

- [x] Task 10: Final pass — verify document coherence
  - File: `ai-bootstrapper.md`, `meta-prompt.md`
  - Action:
    1. Read both files top-to-bottom
    2. Verify all execution rules appear before the actions they govern
    3. Verify no placeholder text, no blank template lines, no orphaned references
    4. Verify section numbering is sequential (2.1, 2.2, 2.3, 2.4)
    5. Verify the "opinions contradiction" (A5) is resolved — initial bootstrap = facts only, extend task = opinions layer
    6. Confirm estimated line count of ai-bootstrapper.md is significantly reduced from 326
  - Resolves: A13 (acknowledged, not fully addressed — no versioning strategy added)

### Acceptance Criteria

- [x] AC 1: Given the renamed file `ai-bootstrapper.md`, when an LLM reads it top-to-bottom, then Execution Rules are encountered within the first 20 lines, before any Phase instructions.

- [x] AC 2: Given the restructured document, when an LLM reaches Phase 2, then it has already been told to stop after Phase 1 for user confirmation (Execution Rule 2).

- [x] AC 3: Given section 2.1, when an LLM reads it, then the AGENTS.md rules (150-line limit, no opinions, no placeholders) appear BEFORE the template code block.

- [x] AC 4: Given section 2.2 (Tool Wrapper Files), when an LLM reads it, then all four wrappers are defined in a single table with file paths, content, and conditional notes — no redundant sections.

- [x] AC 5: Given the .aiignore section, when an LLM reads it, then adaptation instructions appear BEFORE the template, and the template is wrapped in delimiters.

- [x] AC 6: Given `meta-prompt.md` as a standalone file, when a human opens it, then the first visible content is a markdown coverage tracker table (not ASCII art), followed by a content layers checklist.

- [x] AC 7: Given `meta-prompt.md`, when an LLM reads past the human-readable section, then it finds maintenance task definitions (sync, audit, extend, add-tool, compact) with no arbitrary interview caps and with a verification step on the compact task.

- [x] AC 8: Given the extend task in `meta-prompt.md`, when it references the "Style & Opinions" layer, then it does not contradict the bootstrapper's "no opinions" rule — because the bootstrapper specifies facts-only for initial generation, and extend adds opinions as a separate layer.

- [x] AC 9: Given Phase 1, when an LLM reads the discovery instructions, then there is no hedging language ("If something doesn't apply, skip it"), no inline execution rules ("We will NOT overwrite"), and uncertain discoveries are flagged per Execution Rule 5.

- [x] AC 10: Given the complete revised `ai-bootstrapper.md`, when its lines are counted, then it is shorter than the original 326 lines (target: ~200-220 lines after condensation).

- [x] AC 11: Given both files, when all 25 review findings (A1-A15, S1-S10) are checked against the revision, then each finding is either resolved or explicitly acknowledged as out-of-scope (A13: versioning strategy).

## Additional Context

### Dependencies

None — this is a standalone markdown document revision. No external libraries, APIs, or services.

### Testing Strategy

1. **Structural verification**: Read `ai-bootstrapper.md` top-to-bottom. Confirm execution rules precede all phase instructions. Confirm all templates are in delimited blocks after their governing rules.
2. **Completeness check**: Walk through all 25 findings (A1-A15, S1-S10) and verify each is addressed by a task.
3. **meta-prompt.md verification**: Open the file and confirm the first screen shows a readable markdown tracker table. Confirm the LLM section follows with proper markers.
4. **Line count check**: Verify `ai-bootstrapper.md` is under ~220 lines and `meta-prompt.md` is a self-contained file.
5. **Cross-reference check**: Confirm the bootstrapper references meta-prompt.md and project-context as recommended next steps.

### Notes

- Review sources: adversarial review (15 findings) and structural editorial review (10 recommendations) conducted in the same conversation session
- The filename typo (`boostrapper` → `bootstrapper`) is fixed via git rename in Task 1
- A13 (no versioning strategy) is acknowledged but not addressed — adding a versioning/changelog system is out of scope for this revision
- The bootstrapper intentionally remains a single standalone file (no BMAD step-file dependency) but applies BMAD's structural principles
- Finding-to-task traceability: A1→T1, A2→T7, A3→T7, A4→T6, A5→T6, A6→T2+T9, A7→T3, A8→T8, A9→T7, A10→T2, A11→T2, A12→T7, A13→T10(acknowledged), A14→T3+T5, A15→T2, S1→T3, S2→T2+T9, S3→T7, S4→T2, S5→T6, S6→T2, S7→T5, S8→T8, S9→T6, S10→T4

## Review Notes

- Adversarial review completed
- Findings: 16 total, 12 fixed, 4 skipped (2 undecided, 1 noise, 1 acknowledged same as A13)
- Resolution approach: auto-fix
