# Research

> Research and fetch dependency reference documentation (llms.txt files).

## Phases

1. Discovery - identify key dependencies
2. Check - look for available llms.txt
3. Report - show what's available
4. Fetch - download approved references

## Phase 1: Discovery

- Check package manager files (package.json, Cargo.toml, pyproject.toml, go.mod, etc.)
- Focus on key frameworks and libraries - skip utilities and tiny packages
- Check existing docs/references/ for already-fetched files

## Phase 2: Check

For each key dependency:
- Look for `{package-website}/llms.txt` or `/llms-full.txt`
- Note which are available and which aren't

## Phase 3: Report

Present a table: package, version, llms.txt available (yes/no), URL.
Note which are already in docs/references/ and their age.

Use `AskUserQuestion`: "Fetch available references?" with options: Fetch all / Let me choose / Skip.

## Phase 4: Fetch

Only if approved:
- Use WebFetch to retrieve each URL
- Store in docs/references/ as `{package-name}-llms.txt`
- Add metadata header (source URL, fetch date, version)
- Create docs/references/ directory if needed
- Update AGENTS.md "Further Reading" with pointer to docs/references/
- Show result card: files fetched, sizes, any failures

## Rules

- Don't fetch ALL dependencies - only key frameworks/libraries
- Ask before fetching (especially if many references)
- Handle fetch failures gracefully
- If a reference exists and is < 30 days old, ask before re-fetching
- Don't bloat AGENTS.md - just a one-line pointer to docs/references/
