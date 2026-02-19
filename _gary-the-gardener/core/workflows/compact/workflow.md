# Compact

> Compress AGENTS.md while preserving all facts (target: under 150 lines).

## Phases

1. Analyze - measure and find compression opportunities
2. Plan - present compression strategy
3. Compress - apply approved changes
4. Verify - confirm no facts were lost

## Phase 1: Analyze

- Read AGENTS.md completely, count lines
- If already under 150 lines: report "Looking good, no pruning needed!" and stop
- Identify verbose sections: redundant content, long explanations, deep trees, content that belongs in docs/
- Check if docs/ directory exists (affects whether content can be moved)

## Phase 2: Plan

Present a compression plan showing per-section savings:
- Section name, current lines -> target lines, what changes
- Total potential savings and projected final line count

Use `AskUserQuestion`: "Apply this plan?" with options: Yes / Let me adjust / No.

## Phase 3: Compress

Apply compression strategies as appropriate:
- Condense verbose text to bullet/inline format
- Collapse deep directory trees (2 levels max)
- Use compact command format (`cmd` - description)
- Move detailed content to docs/ (if it exists and user approves)

## Phase 4: Verify

Critical fact preservation check:
- Extract all facts from original (tech stack, paths, commands, patterns, conventions)
- Verify each exists in compressed version or was moved to docs/
- If facts are missing: use `AskUserQuestion` - add back (exceed limit), move to docs/, or remove
- Show result card: before/after line counts, changes made, fact preservation status

## Rules

- NEVER remove facts - only compress verbosity
- Always verify fact preservation before finalizing
- Ask before moving content to docs/
- If target can't be met without losing facts, ask user for guidance
- If docs/ doesn't exist and content needs to move, suggest `/garden-setup` first
