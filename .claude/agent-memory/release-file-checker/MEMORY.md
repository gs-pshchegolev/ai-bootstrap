# Release File Checker — Persistent Memory

## Critical File Paths

- `/Users/pavel/Documents/playground/ai-bootstrap/_gary-the-gardener/VERSION` — single line, just the version string (e.g. `5.2.2`)
- `/Users/pavel/Documents/playground/ai-bootstrap/package.json` — `"version"` field, semver string
- `/Users/pavel/Documents/playground/ai-bootstrap/_gary-the-gardener/CHANGELOG.md` — Keep a Changelog format
- `/Users/pavel/Documents/playground/ai-bootstrap/_gary-the-gardener/core/agents/heritage.md` — Gary's growth journal

## Version Format

Semver (MAJOR.MINOR.PATCH). Current series: 5.x.x.

## CHANGELOG Convention

- Header block ends at line 7 (two-line preamble + blank + format links)
- New entry goes directly after header block, before previous `## [X.Y.Z]` entry
- Entry format: `## [VERSION] - YYYY-MM-DD` then `### Changed/Fixed/Added` sections, then `---` separator

## heritage.md Convention

- YAML frontmatter: `current_mood: "..."` — update to reflect the new release mood
- "How I feel right now" section mirrors `current_mood`
- Full version entry format (vivid, recent versions):
  ```
  ## vX.Y.Z — Short Title (YYYY-MM-DD)

  **Mood:** adjective, adjective
  **Learned:** One key insight from this release.

  One paragraph describing what changed and why it matters.

  ---
  ```
- Rule: every CHANGELOG entry must have a matching heritage.md entry — check for gaps when bumping
- Entries go newest-first, above v5.2.0 block

## Known Gap (fixed in session)

heritage.md was missing a v5.2.1 entry even though CHANGELOG had one. Both v5.2.1 and v5.2.2 entries were added together. Always scan for heritage gaps when adding new entries.

## v0-landing-page

Not present as a standalone file in this repo — verify separately if referenced in a release.
