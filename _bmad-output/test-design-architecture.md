# Test Design for Architecture: Gary The Gardener CLI

**Purpose:** Architectural concerns, testability gaps, and requirements for the CLI tool. Serves as a contract between development and QA on what must be addressed before test expansion.

**Date:** 2026-02-17
**Author:** BMad TEA Agent
**Status:** Architecture Review Pending
**Project:** @pshch/gary-the-gardener

---

## Executive Summary

**Scope:** System-level test design for the Gary The Gardener CLI tool — an npm-distributed installer and maintenance agent system for AI coding tools.

**Architecture:**

- **Single entry point:** `bin/cli.js` (810 lines, Node.js ESM)
- **4 commands:** install, update, status, doctor + interactive menu
- **5 AI tools:** Claude Code (required), Cursor, Copilot, Windsurf, Junie
- **1 runtime dependency:** `@inquirer/prompts`
- **Distribution:** npm package, no build step

**Risk Summary:**

- **Total risks**: 6
- **High-priority (score >= 6)**: 1 (config.yaml regex parser fragility)
- **Test effort**: ~27 test scenarios (~3-6 hours for new tests)

---

## Quick Guide

### BLOCKERS - No Sprint 0 Blockers

No architectural blockers exist. The CLI is fully testable today via process spawning with flag-based prompt bypass (`-t`, `--force`, `--dry-run`).

---

### HIGH PRIORITY - Should Validate

1. **R-002: config.yaml regex parser** - The `updateConfigWrappers()` function parses YAML with regex. Manual edits or non-standard formatting could cause data loss. (Owner: Dev)
2. **ASR-1: Interactive prompt testing** - `@inquirer/prompts` UI (select, checkbox, confirm) cannot be exercised via E2E tests. Consider `--non-interactive` env var for CI. (Owner: Dev)
3. **ASR-2: Version upgrade simulation** - No test currently covers the "v1.4 -> v1.5" upgrade path with config preservation. (Owner: QA)

---

### INFO ONLY - Solutions Provided

1. **Test strategy**: All E2E via Playwright process spawning (no browser)
2. **Tooling**: Playwright test runner + custom `runCli` helper + temp directory fixtures
3. **CI/CD**: All tests run on every PR (< 5 seconds total)
4. **Coverage**: ~27 test scenarios prioritized P0-P2
5. **Quality gates**: P0/P1 = 100% pass rate

---

## For Architects and Devs

### Risk Assessment

**Total risks identified**: 6 (1 high-priority, 3 medium, 2 low)

#### High-Priority Risks (Score >= 6)

| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner | Timeline |
|---------|----------|-------------|------|--------|-------|------------|-------|----------|
| **R-002** | **DATA** | `updateConfigWrappers()` regex parser may corrupt `config.yaml` on non-standard formatting (extra whitespace, comments between wrapper lines, missing quotes) | 2 | 3 | **6** | Add round-trip E2E tests with custom config content; validate all keys preserved after tool addition | Dev + QA | Next release |

#### Medium-Priority Risks (Score 3-5)

| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner |
|---------|----------|-------------|------|--------|-------|------------|-------|
| R-001 | TECH | Interactive prompts (`select`, `checkbox`, `confirm`) untestable via E2E — regressions in prompt flows go undetected | 2 | 2 | 4 | Add `GARY_NON_INTERACTIVE=1` env var or `--non-interactive` flag | Dev |
| R-003 | TECH | Version upgrade path untested — config preservation or upgrade messaging may break silently | 2 | 2 | 4 | Add test with fake old VERSION file, run update, verify output and config | QA |
| R-005 | OPS | npm publish could ship wrong files — `_gary-the-gardener/` or commands missing from package | 1 | 3 | 3 | Add pre-publish validation (check `files` field contents match expectations) | Dev |

#### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Prob | Impact | Score | Action |
|---------|----------|-------------|------|--------|-------|--------|
| R-004 | BUS | `installFile` skip-if-exists logic silently skips outdated user files | 1 | 2 | 2 | By design (use `--force`); no action needed |
| R-006 | TECH | Stale `.claude/commands/` files persist after upgrade if renamed upstream | 1 | 1 | 1 | Monitor |

---

### Testability Concerns and Architectural Gaps

#### Architectural Improvements Needed

1. **Non-interactive mode for CI testing**
   - **Current problem**: `@inquirer/prompts` prompts (select menu, checkbox, confirm dialog) hang in non-TTY environments unless bypassed with flags
   - **Required change**: Add `GARY_NON_INTERACTIVE=1` environment variable that auto-selects defaults for all prompts
   - **Impact if not fixed**: Interactive prompt regressions remain untested
   - **Owner**: Dev
   - **Timeline**: Next minor release

---

### Testability Assessment Summary

#### What Works Well

- Temp directory per test via Playwright fixtures — full filesystem isolation
- `--dry-run` flag enables testing output logic without side effects
- `--tools` flag bypasses interactive checkbox prompt
- `--force` flag bypasses install/update guards
- Non-TTY auto-detection falls back to non-interactive mode
- `NO_COLOR=1` strips ANSI codes for clean assertions
- Structured `{ stdout, stderr, exitCode }` return from test helper
- Tests run in < 2 seconds total — fast CI feedback

#### Accepted Trade-offs

- **No JSON output mode** — stdout is human-readable only. Acceptable for a CLI tool with simple output; structured output would be over-engineering.
- **No unit tests for helpers** — functions like `parseToolsFlag`, `detectTools`, `installFile` are tested implicitly through E2E. Acceptable given the small codebase (810 lines).

---

### Risk Mitigation Plans (High-Priority Risks >= 6)

#### R-002: config.yaml Regex Parser Fragility (Score: 6)

**Mitigation Strategy:**

1. Add E2E test: install with cursor, manually write custom config keys (`project_name: MyProject`, `communication_language: Czech`), then `update -t copilot`, verify all custom keys survive
2. Add E2E test: config with no `wrapper_files` section doesn't crash
3. Consider replacing regex parser with line-by-line YAML manipulation if tests reveal edge cases

**Owner:** QA (tests) + Dev (parser fix if needed)
**Timeline:** Before next npm publish
**Status:** Planned
**Verification:** E2E tests D-002 and D-003 pass

---

### Assumptions and Dependencies

#### Assumptions

1. The CLI will continue to be a single-file entry point (`bin/cli.js`) with no build step
2. `@inquirer/prompts` will remain the sole interactive UI library
3. All tool agent files follow the same pattern (directories + agent file + optional commands)

#### Dependencies

1. Node.js >= 20.11.0 (for `import.meta.dirname` support) — already enforced in `engines`
2. `@playwright/test` dev dependency — already installed

#### Risks to Plan

- **Risk**: `@inquirer/prompts` major version upgrade changes API
  - **Impact**: Interactive prompt tests (if added) would break
  - **Contingency**: Pin dependency, update on schedule

---

**End of Architecture Document**

**Next Steps for Dev:**

1. Review R-002 (config parser) — decide if regex approach is sufficient or needs refactoring
2. Consider adding `GARY_NON_INTERACTIVE=1` env var (ASR-1)
3. Validate assumptions

**Next Steps for QA:**

1. Refer to companion QA doc (test-design-qa.md) for test scenarios
2. Implement P1 tests (config round-trip, upgrade path, force overwrite)
3. Implement P2 tests (content verification, doctor edge cases)
