# Test Design for QA: Gary The Gardener CLI

**Purpose:** Test execution recipe for the CLI tool. Defines what to test, how to test it, and what's needed from dev.

**Date:** 2026-02-17
**Author:** BMad TEA Agent
**Status:** Draft
**Project:** @pshch/gary-the-gardener

**Related:** See Architecture doc (test-design-architecture.md) for testability concerns and risk details.

---

## Executive Summary

**Scope:** Comprehensive E2E test coverage for all CLI commands, flags, install/update flows, config management, and edge cases.

**Risk Summary:**

- Total Risks: 6 (1 high-priority score >= 6, 3 medium, 2 low)
- Critical Categories: DATA (config parser), TECH (untestable prompts, upgrade path)

**Coverage Summary:**

- P0 tests: 9 (core command routing, install/update guards, file creation)
- P1 tests: 12 (upgrade path, force flag, config round-trip, non-TTY, multi-tools)
- P2 tests: 6 (content verification, doctor edge cases, status details)
- **Total**: 27 tests (~3-6 hours for 14 new tests)

---

## Dependencies & Test Blockers

### Dev Dependencies

1. **R-002 mitigation** — Dev — Before next publish
   - QA needs confidence that `updateConfigWrappers()` won't corrupt config
   - Blocks: D-002 test (config round-trip) will expose if parser is fragile

### QA Infrastructure (Already Complete)

1. **Test fixtures** — Playwright `tempDir` + `cli()` fixtures in `tests/support/fixtures/index.ts`
2. **CLI helper** — `runCli()` in `tests/support/helpers/cli.ts` (process spawn, NO_COLOR, 15s timeout)
3. **Test runner** — `npx playwright test` configured in `playwright.config.ts`

**Existing fixture pattern:**

```typescript
import { test, expect } from '../support/fixtures';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

test('example CLI test', async ({ cli, tempDir }) => {
  const result = await cli(['install', '-t', 'cursor']);
  expect(result.exitCode).toBe(0);
  expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);
});
```

---

## Risk Assessment

**Full details in Architecture doc. QA-relevant summary:**

### High-Priority Risks (Score >= 6)

| Risk ID | Category | Description | Score | QA Test Coverage |
|---------|----------|-------------|-------|------------------|
| **R-002** | DATA | Config.yaml regex parser may corrupt on non-standard formatting | **6** | D-002: Round-trip test with custom config keys; D-003: Missing wrapper_files section |

### Medium/Low-Priority Risks

| Risk ID | Category | Description | Score | QA Test Coverage |
|---------|----------|-------------|-------|------------------|
| R-001 | TECH | Interactive prompts untestable | 4 | Covered indirectly via flag bypass (`-t`, `--force`) |
| R-003 | TECH | Version upgrade path untested | 4 | C-004: Fake old VERSION, run update, verify config preserved |
| R-005 | OPS | npm publish ships wrong files | 3 | Out of scope for E2E (pre-publish script) |
| R-004 | BUS | installFile skip-if-exists | 2 | Covered by existing "already exists" tests |
| R-006 | TECH | Stale commands after rename | 1 | Monitor only |

---

## Test Coverage Plan

**IMPORTANT:** P0/P1/P2 = **priority and risk level**, NOT execution timing. All tests run on every PR.

### P0 (Critical)

**Criteria:** Blocks core functionality + High risk + No workaround

| Test ID | Requirement | Test Level | Risk Link | Status |
|---------|------------|------------|-----------|--------|
| **A-001** | `--version` prints version, exits 0 | E2E | — | Exists |
| **A-002** | `--help` prints all commands and options | E2E | — | Exists |
| **A-003** | Unknown command exits 1 with error | E2E | — | Exists |
| **A-006** | Invalid `--tools` value exits 1 | E2E | — | Exists |
| **B-001** | `install --dry-run` previews without writing | E2E | — | Exists |
| **B-002** | `install` creates core files (core, CLAUDE.md, .aiignore, commands) | E2E | — | Exists |
| **B-003** | `install` guard rejects if already installed | E2E | — | Exists |
| **B-005** | Cursor-only install wires all required files + config | E2E | R-001 | Exists |
| **B-006** | Copilot-only install wires all required files + config | E2E | R-001 | Exists |

**Total P0:** 9 tests (all exist)

---

### P1 (High)

**Criteria:** Important features + Medium risk + Common workflows

| Test ID | Requirement | Test Level | Risk Link | Status |
|---------|------------|------------|-----------|--------|
| **C-001** | `update` guard rejects if not installed | E2E | — | Exists |
| **C-002** | `update -t` adds new tool to existing install | E2E | — | Exists |
| **C-003** | `update` preserves existing tool files | E2E | — | Exists |
| **A-004** | No args in non-TTY auto-installs (fresh dir) | E2E | R-001 | **NEW** |
| **A-005** | No args in non-TTY auto-updates (installed dir) | E2E | R-001 | **NEW** |
| **A-007** | Multiple tools via `-t cursor,copilot` | E2E | — | **NEW** |
| **B-004** | `install --force` overwrites existing files | E2E | — | **NEW** |
| **C-004** | Version upgrade: fake old VERSION, update, verify config preserved | E2E | R-003 | **NEW** |
| **C-005** | `update --dry-run` shows upgrade preview without writing | E2E | — | **NEW** |
| **D-002** | Config round-trip: custom keys survive tool addition | E2E | R-002 | **NEW** |
| **D-003** | Config with missing wrapper_files section doesn't crash | E2E | R-002 | **NEW** |
| **F-003** | Doctor detects version mismatch (fake old VERSION) | E2E | R-003 | **NEW** |

**Total P1:** 12 tests (3 exist + 9 new — note: E-001, E-002, F-001, F-002 reclassified to existing coverage)

---

### P2 (Medium)

**Criteria:** Secondary features + Edge cases + Content verification

| Test ID | Requirement | Test Level | Risk Link | Status |
|---------|------------|------------|-----------|--------|
| **B-008** | `.aiignore` content includes expected sections | E2E | — | **NEW** |
| **B-009** | `CLAUDE.md` content references AGENTS.md | E2E | — | **NEW** |
| **B-010** | Tool agent files contain activation instructions | E2E | — | **NEW** |
| **E-003** | Status shows correct command count for Claude Code | E2E | — | **NEW** |
| **F-004** | Doctor detects missing .aiignore | E2E | — | **NEW** |
| **D-001** | updateConfigWrappers adds wrappers without losing existing (covered in C-002) | E2E | R-002 | Exists |

**Total P2:** 6 tests (1 exists + 5 new)

---

## Execution Strategy

**Philosophy:** Run everything on every PR. The entire suite completes in < 5 seconds.

### Every PR: Playwright CLI Tests (< 5 seconds)

All 27 E2E tests run via `npx playwright test`:

- Process-spawn tests (no browser, no network)
- Parallelized across available workers
- Current: 17 tests in 1.6s, projected 27 tests in < 5s

No nightly, weekly, or performance suites needed — this is a CLI tool with no server, database, or external dependencies.

---

## QA Effort Estimate

| Priority | Count | Effort Range | Notes |
|----------|-------|-------------|-------|
| P0 | 9 (all exist) | 0 hours | Done |
| P1 | 8 new | ~2-4 hours | Config round-trip and upgrade simulation need careful setup |
| P2 | 5 new | ~1-2 hours | Content assertions are straightforward |
| **Total** | **14 new** | **~3-6 hours** | 1 developer, includes debugging |

**Assumptions:**

- Test infrastructure already in place (fixtures, helpers, config)
- Each new test follows existing patterns (spawn CLI, assert stdout/files)
- Config round-trip tests (D-002, D-003) may require writing custom config.yaml content to tempDir before CLI invocation

---

## Appendix A: Code Examples & Tagging

**New test patterns needed:**

```typescript
// C-004: Version upgrade simulation
test('upgrade preserves config during version change', async ({ cli, tempDir }) => {
  // Install first
  await cli(['install', '-t', 'cursor']);

  // Simulate old version by rewriting VERSION file
  const versionPath = join(tempDir, '_gary-the-gardener', 'VERSION');
  writeFileSync(versionPath, '1.4.0');

  // Run update
  const result = await cli(['update', '--force']);
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain('Upgrading');

  // Config preserved
  const config = readFileSync(
    join(tempDir, '_gary-the-gardener', 'core', 'config.yaml'), 'utf8'
  );
  expect(config).toContain('.cursor/rules/garden-agent-gardener.mdc');
});

// D-002: Config round-trip with custom keys
test('custom config keys survive tool addition', async ({ cli, tempDir }) => {
  await cli(['install', '-t', 'cursor']);

  // Add custom keys to config
  const configPath = join(tempDir, '_gary-the-gardener', 'core', 'config.yaml');
  let config = readFileSync(configPath, 'utf8');
  config = config.replace('user_name: User', 'user_name: Pavel');
  config = config.replace(
    'communication_language: English',
    'communication_language: Czech'
  );
  writeFileSync(configPath, config);

  // Add copilot
  await cli(['update', '-t', 'copilot', '--force']);

  // Verify custom keys survived
  const updated = readFileSync(configPath, 'utf8');
  expect(updated).toContain('user_name: Pavel');
  expect(updated).toContain('communication_language: Czech');
  expect(updated).toContain('.github/agents/gardener.md');
});
```

**Run tests:**

```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/cli-commands.spec.ts

# Run tests matching a name
npx playwright test -g "upgrade"
```

---

## Appendix B: Knowledge Base References

- **Risk Governance**: `risk-governance.md` — Risk scoring methodology (P x I = Score)
- **Test Levels Framework**: `test-levels-framework.md` — All tests are E2E (CLI process spawning)
- **Test Quality**: `test-quality.md` — Deterministic, isolated, < 300 lines, < 1.5 min
- **Fixture Architecture**: `fixture-architecture.md` — Pure function -> fixture -> merge pattern

---

**Generated by:** BMad TEA Agent
**Workflow:** `_bmad/tea/testarch/test-design`
**Version:** 5.0
