import { test, expect } from '../support/fixtures';
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

test.describe('CLI: --version', () => {
  test('prints version and exits 0', async ({ cli }) => {
    const result = await cli(['--version']);
    expect(result.stdout).toMatch(/Gary The Gardener v\d+\.\d+\.\d+/);
    expect(result.exitCode).toBe(0);
  });
});

test.describe('CLI: --help', () => {
  test('prints help text with all commands', async ({ cli }) => {
    const result = await cli(['--help']);
    expect(result.stdout).toContain('COMMANDS');
    expect(result.stdout).toContain('install');
    expect(result.stdout).toContain('update');
    expect(result.stdout).toContain('status');
    expect(result.stdout).toContain('doctor');
    expect(result.exitCode).toBe(0);
  });
});

test.describe('CLI: unknown command', () => {
  test('prints error and exits 1', async ({ cli }) => {
    const result = await cli(['bogus']);
    expect(result.stderr).toContain('Unknown command: bogus');
    expect(result.exitCode).toBe(1);
  });
});

test.describe('CLI: install --dry-run', () => {
  test('previews installation without writing files', async ({ cli, tempDir }) => {
    const result = await cli(['install', '--dry-run']);
    expect(result.stdout).toContain('dry run');
    expect(result.stdout).toContain('Dry run complete');
    expect(result.exitCode).toBe(0);

    // Verify no files were written
    expect(existsSync(join(tempDir, '_gary-the-gardener'))).toBe(false);
    expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(false);
  });
});

test.describe('CLI: install with --tools flag', () => {
  test('installs only specified tools', async ({ cli, tempDir }) => {
    const result = await cli(['install', '--dry-run', '-t', 'cursor']);
    expect(result.stdout).toContain('Cursor');
    expect(result.stdout).toContain('.cursor/rules/garden-agent-gardener.mdc');
    expect(result.exitCode).toBe(0);
  });

  test('rejects invalid tool names', async ({ cli }) => {
    const result = await cli(['install', '-t', 'nonexistent']);
    expect(result.stderr).toContain('Unknown tool(s)');
    expect(result.exitCode).toBe(1);
  });
});

test.describe('CLI: install guard', () => {
  test('rejects install if already installed', async ({ cli, tempDir }) => {
    // First install
    await cli(['install', '-t', 'claude-code']);

    // Second install should be rejected
    const result = await cli(['install']);
    expect(result.stdout).toContain('already installed');
    expect(result.stdout).toContain('update');
    expect(result.exitCode).toBe(0);
  });
});

test.describe('CLI: update guard', () => {
  test('rejects update if not installed', async ({ cli }) => {
    const result = await cli(['update']);
    expect(result.stdout).toContain('not found');
    expect(result.stdout).toContain('install');
    expect(result.exitCode).toBe(0);
  });
});

test.describe('CLI: status', () => {
  test('shows status in empty directory', async ({ cli }) => {
    const result = await cli(['status']);
    expect(result.stdout).toContain('Status');
    expect(result.stdout).toContain('not installed');
    expect(result.exitCode).toBe(0);
  });

  test('shows status after installation', async ({ cli }) => {
    await cli(['install', '-t', 'claude-code']);
    const result = await cli(['status']);
    expect(result.stdout).toContain('Core system');
    expect(result.exitCode).toBe(0);
  });
});

test.describe('CLI: doctor', () => {
  test('reports healthy after clean install', async ({ cli }) => {
    await cli(['install', '-t', 'claude-code']);
    const result = await cli(['doctor']);
    expect(result.stdout).toContain('Doctor');
    expect(result.exitCode).toBe(0);
  });

  test('reports not found if not installed', async ({ cli }) => {
    const result = await cli(['doctor']);
    expect(result.stdout).toContain('not found');
    expect(result.exitCode).toBe(0);
  });
});

test.describe('CLI: install creates expected files', () => {
  test('creates core files in target directory', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'claude-code']);

    expect(existsSync(join(tempDir, '_gary-the-gardener', 'VERSION'))).toBe(true);
    expect(existsSync(join(tempDir, '_gary-the-gardener', 'core', 'config.yaml'))).toBe(true);
    expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tempDir, '.aiignore'))).toBe(true);
    expect(existsSync(join(tempDir, '.claude', 'commands'))).toBe(true);
  });
});

test.describe('CLI: single-tool install wiring', () => {
  test('cursor-only install still creates all necessary wiring', async ({ cli, tempDir }) => {
    const result = await cli(['install', '-t', 'cursor']);
    expect(result.exitCode).toBe(0);

    // Core system always installed
    expect(existsSync(join(tempDir, '_gary-the-gardener', 'VERSION'))).toBe(true);
    expect(existsSync(join(tempDir, '_gary-the-gardener', 'core', 'config.yaml'))).toBe(true);

    // Claude Code is required — always wired even when only cursor selected
    expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tempDir, '.claude', 'commands'))).toBe(true);

    // Skill commands must be present for gardener workflows to work
    const cmdDir = join(tempDir, '.claude', 'commands');
    const gardenCmds = readdirSync(cmdDir).filter(
      f => f.startsWith('garden-') && f.endsWith('.md'),
    );
    expect(gardenCmds.length).toBeGreaterThanOrEqual(7);
    // Hub command must also be present
    expect(existsSync(join(cmdDir, 'garden.md'))).toBe(true);

    // Cursor agent file created
    expect(existsSync(join(tempDir, '.cursor', 'rules', 'garden-agent-gardener.mdc'))).toBe(true);

    // .aiignore always installed
    expect(existsSync(join(tempDir, '.aiignore'))).toBe(true);

    // config.yaml tracks both claude and cursor wrappers
    const config = readFileSync(join(tempDir, '_gary-the-gardener', 'core', 'config.yaml'), 'utf8');
    expect(config).toContain('CLAUDE.md');
    expect(config).toContain('.cursor/rules/garden-agent-gardener.mdc');
  });

  test('copilot-only install creates all necessary wiring', async ({ cli, tempDir }) => {
    const result = await cli(['install', '-t', 'copilot']);
    expect(result.exitCode).toBe(0);

    // Core + Claude always present
    expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tempDir, '.claude', 'commands'))).toBe(true);

    // Copilot agent file created
    expect(existsSync(join(tempDir, '.github', 'agents', 'gardener-gary.md'))).toBe(true);

    // config.yaml tracks copilot wrapper
    const config = readFileSync(join(tempDir, '_gary-the-gardener', 'core', 'config.yaml'), 'utf8');
    expect(config).toContain('.github/agents/gardener-gary.md');
  });
});

test.describe('CLI: adding a second tool', () => {
  test('update -t adds new tool to existing installation', async ({ cli, tempDir }) => {
    // First: install with cursor only
    const install = await cli(['install', '-t', 'cursor']);
    expect(install.exitCode).toBe(0);

    // Verify cursor is installed, copilot is not
    expect(existsSync(join(tempDir, '.cursor', 'rules', 'garden-agent-gardener.mdc'))).toBe(true);
    expect(existsSync(join(tempDir, '.github', 'agents', 'gardener-gary.md'))).toBe(false);

    // Second: add copilot via update (--force skips confirmation)
    const update = await cli(['update', '-t', 'copilot', '--force']);
    expect(update.exitCode).toBe(0);

    // Both tools now present
    expect(existsSync(join(tempDir, '.cursor', 'rules', 'garden-agent-gardener.mdc'))).toBe(true);
    expect(existsSync(join(tempDir, '.github', 'agents', 'gardener-gary.md'))).toBe(true);

    // config.yaml updated with both wrappers
    const config = readFileSync(join(tempDir, '_gary-the-gardener', 'core', 'config.yaml'), 'utf8');
    expect(config).toContain('.cursor/rules/garden-agent-gardener.mdc');
    expect(config).toContain('.github/agents/gardener-gary.md');
  });

  test('existing files are preserved when adding a tool', async ({ cli, tempDir }) => {
    // Install with cursor
    await cli(['install', '-t', 'cursor']);

    // Add copilot — cursor agent file should remain untouched
    const update = await cli(['update', '-t', 'copilot', '--force']);
    expect(update.exitCode).toBe(0);
    expect(update.stdout).toContain('.github/agents/gardener-gary.md');

    // Original cursor file still present
    expect(existsSync(join(tempDir, '.cursor', 'rules', 'garden-agent-gardener.mdc'))).toBe(true);
    // Core files still present
    expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tempDir, '.aiignore'))).toBe(true);
  });
});

// ── P1: A-004 — No args in non-TTY auto-installs (fresh dir) ────────
test.describe('CLI: non-TTY auto-install', () => {
  test('no args in non-TTY auto-installs in fresh directory', async ({ cli, tempDir }) => {
    // cli helper runs via execFile (non-TTY stdin), no command → runInteractiveMenu → auto-install
    const result = await cli([]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Installation complete');
    expect(existsSync(join(tempDir, '_gary-the-gardener', 'VERSION'))).toBe(true);
    expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);
  });
});

// ── P1: A-005 — No args in non-TTY auto-updates (installed dir) ─────
test.describe('CLI: non-TTY auto-update', () => {
  test('no args in non-TTY auto-updates when already installed', async ({ cli }) => {
    await cli(['install', '-t', 'cursor']);
    // Second invocation with no command — non-TTY detects install, routes to update
    // Use --dry-run to bypass confirm prompt (R-001: interactive prompts untestable in non-TTY)
    const result = await cli(['--dry-run']);
    expect(result.exitCode).toBe(0);
    // Should route to update path (shows upgrade preview)
    expect(result.stdout).toContain('Dry run complete');
    expect(result.stdout).toContain('up to date');
  });
});

// ── P1: A-007 — Multiple tools via -t cursor,copilot ────────────────
test.describe('CLI: multiple tools flag', () => {
  test('installs multiple tools via comma-separated -t flag', async ({ cli, tempDir }) => {
    const result = await cli(['install', '-t', 'cursor,copilot']);
    expect(result.exitCode).toBe(0);
    expect(existsSync(join(tempDir, '.cursor', 'rules', 'garden-agent-gardener.mdc'))).toBe(true);
    expect(existsSync(join(tempDir, '.github', 'agents', 'gardener-gary.md'))).toBe(true);
    expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);

    const config = readFileSync(join(tempDir, '_gary-the-gardener', 'core', 'config.yaml'), 'utf8');
    expect(config).toContain('.cursor/rules/garden-agent-gardener.mdc');
    expect(config).toContain('.github/agents/gardener-gary.md');
  });
});

// ── P1: B-004 — install --force overwrites existing files ───────────
test.describe('CLI: install --force', () => {
  test('force reinstall overwrites existing files', async ({ cli, tempDir }) => {
    // First install
    await cli(['install', '-t', 'cursor']);

    // Modify CLAUDE.md to verify it gets overwritten
    const claudePath = join(tempDir, 'CLAUDE.md');
    writeFileSync(claudePath, 'MODIFIED CONTENT');

    // Force reinstall
    const result = await cli(['install', '-t', 'cursor', '--force']);
    expect(result.exitCode).toBe(0);

    // CLAUDE.md should be overwritten back to original
    const content = readFileSync(claudePath, 'utf8');
    expect(content).toContain('AGENTS.md');
    expect(content).not.toContain('MODIFIED CONTENT');
  });
});

// ── P1: C-004 — Version upgrade simulation ──────────────────────────
test.describe('CLI: version upgrade', () => {
  test('upgrade preserves config during version change', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'cursor']);

    // Simulate old version
    const versionPath = join(tempDir, '_gary-the-gardener', 'VERSION');
    writeFileSync(versionPath, '1.4.0');

    const result = await cli(['update', '-t', 'cursor', '--force']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Upgrading');

    // Config preserved with correct wrapper
    const config = readFileSync(join(tempDir, '_gary-the-gardener', 'core', 'config.yaml'), 'utf8');
    expect(config).toContain('.cursor/rules/garden-agent-gardener.mdc');
  });
});

// ── P1: C-005 — update --dry-run shows preview without writing ──────
test.describe('CLI: update --dry-run', () => {
  test('dry-run update shows preview without modifying files', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'cursor']);

    // Simulate old version so there's something to upgrade
    const versionPath = join(tempDir, '_gary-the-gardener', 'VERSION');
    writeFileSync(versionPath, '1.4.0');

    const result = await cli(['update', '--dry-run', '-t', 'cursor']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('dry run');
    expect(result.stdout).toContain('Dry run complete');

    // VERSION should still be the fake old version (nothing written)
    const version = readFileSync(versionPath, 'utf8').trim();
    expect(version).toBe('1.4.0');
  });
});

// ── P1: D-002 — Config round-trip: custom keys survive tool addition ─
test.describe('CLI: config round-trip', () => {
  test('custom config keys survive tool addition', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'cursor']);

    // Add custom values to config
    const configPath = join(tempDir, '_gary-the-gardener', 'core', 'config.yaml');
    let config = readFileSync(configPath, 'utf8');
    config = config.replace('user_name: User', 'user_name: Pavel');
    config = config.replace('communication_language: English', 'communication_language: Czech');
    writeFileSync(configPath, config);

    // Add copilot via update
    await cli(['update', '-t', 'copilot', '--force']);

    // Verify custom keys survived
    const updated = readFileSync(configPath, 'utf8');
    expect(updated).toContain('user_name: Pavel');
    expect(updated).toContain('communication_language: Czech');
    // New tool wrapper added
    expect(updated).toContain('.github/agents/gardener-gary.md');
    // Original wrapper still present
    expect(updated).toContain('.cursor/rules/garden-agent-gardener.mdc');
  });
});

// ── P1: D-003 — Config with missing wrapper_files section ───────────
test.describe('CLI: config missing wrapper_files', () => {
  test('config with no wrapper_files section does not crash', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'cursor']);

    // Rewrite config without wrapper_files section
    const configPath = join(tempDir, '_gary-the-gardener', 'core', 'config.yaml');
    writeFileSync(configPath, `# Minimal config\nproject_name: test\nversion: "1.0.0"\n`);

    // Update should not crash
    const result = await cli(['update', '-t', 'copilot', '--force']);
    expect(result.exitCode).toBe(0);
    expect(existsSync(join(tempDir, '.github', 'agents', 'gardener-gary.md'))).toBe(true);
  });
});

// ── P1: F-003 — Doctor detects version mismatch ─────────────────────
test.describe('CLI: doctor version mismatch', () => {
  test('doctor detects version mismatch with fake old VERSION', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'cursor']);

    // Fake old version
    writeFileSync(join(tempDir, '_gary-the-gardener', 'VERSION'), '0.0.1');

    const result = await cli(['doctor']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Version mismatch');
    expect(result.stdout).toContain('0.0.1');
    expect(result.stdout).toContain('issue(s) found');
  });
});

// ── P2: B-008 — .aiignore content includes expected sections ────────
test.describe('CLI: .aiignore content', () => {
  test('.aiignore includes secrets and generated file sections', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'cursor']);
    const content = readFileSync(join(tempDir, '.aiignore'), 'utf8');
    expect(content).toContain('.env');
    expect(content).toContain('node_modules/');
    expect(content).toContain('.DS_Store');
  });
});

// ── P2: B-009 — CLAUDE.md content references AGENTS.md ──────────────
test.describe('CLI: CLAUDE.md content', () => {
  test('CLAUDE.md references AGENTS.md', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'cursor']);
    const content = readFileSync(join(tempDir, 'CLAUDE.md'), 'utf8');
    expect(content).toContain('AGENTS.md');
  });
});

// ── P2: B-010 — Tool agent files contain activation instructions ────
test.describe('CLI: agent file content', () => {
  test('tool agent files contain activation instructions', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'cursor,copilot,windsurf,junie']);

    const cursorAgent = readFileSync(
      join(tempDir, '.cursor', 'rules', 'garden-agent-gardener.mdc'), 'utf8',
    );
    expect(cursorAgent).toContain('agent-activation');
    expect(cursorAgent).toContain('gardener.md'); // references core agent file

    const copilotAgent = readFileSync(
      join(tempDir, '.github', 'agents', 'gardener-gary.md'), 'utf8',
    );
    expect(copilotAgent).toContain('agent-activation');

    const windsurfAgent = readFileSync(
      join(tempDir, '.windsurf', 'rules', 'garden-agent-gardener.md'), 'utf8',
    );
    expect(windsurfAgent).toContain('agent-activation');

    const junieAgent = readFileSync(
      join(tempDir, '.junie', 'guidelines.md'), 'utf8',
    );
    expect(junieAgent).toContain('agent-activation');
  });
});

// ── P2: E-003 — Status shows correct command count ──────────────────
test.describe('CLI: status command count', () => {
  test('status shows correct command count for Claude Code', async ({ cli }) => {
    await cli(['install', '-t', 'cursor']);
    const result = await cli(['status']);
    expect(result.exitCode).toBe(0);
    // Should show "CLAUDE.md + N commands" where N >= 10
    expect(result.stdout).toMatch(/CLAUDE\.md \+ \d+ commands/);
  });
});

// ── Garden data preservation during update ──────────────────────────
test.describe('CLI: garden data preserved on update', () => {
  test('docsmap.yaml is not overwritten during update', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'claude-code']);

    // Simulate garden data created by the LLM agent after planting
    const gardenDir = join(tempDir, '_gary-the-gardener', 'garden');
    mkdirSync(gardenDir, { recursive: true });
    const customDocsmap = [
      'version: 2',
      'generated: "01-01-2026"',
      'hash: "v2-42-01-01-2026"',
      'areas:',
      '  custom-area:',
      '    label: Custom Area',
    ].join('\n');
    writeFileSync(join(gardenDir, 'docsmap.yaml'), customDocsmap);

    // Simulate old version to trigger the upgrade code path
    writeFileSync(join(tempDir, '_gary-the-gardener', 'VERSION'), '1.0.0');

    const result = await cli(['update', '--force']);
    expect(result.exitCode).toBe(0);

    // docsmap.yaml must be unchanged — the update must never overwrite garden state
    const preserved = readFileSync(join(gardenDir, 'docsmap.yaml'), 'utf8');
    expect(preserved).toContain('custom-area');
    expect(preserved).toContain('v2-42-01-01-2026');
  });

  test('history.jsonl is not overwritten during update', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'claude-code']);

    const gardenDir = join(tempDir, '_gary-the-gardener', 'garden');
    mkdirSync(gardenDir, { recursive: true });
    const historyEntry = `{"ts":"01-01-2026","action":"init","summary":"Garden planted with 42 entities"}`;
    writeFileSync(join(gardenDir, 'history.jsonl'), historyEntry);

    writeFileSync(join(tempDir, '_gary-the-gardener', 'VERSION'), '1.0.0');

    const result = await cli(['update', '--force']);
    expect(result.exitCode).toBe(0);

    const preserved = readFileSync(join(gardenDir, 'history.jsonl'), 'utf8');
    expect(preserved).toContain('42 entities');
  });

  test('garden.md snapshot is not overwritten during update', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'claude-code']);

    const gardenDir = join(tempDir, '_gary-the-gardener', 'garden');
    mkdirSync(gardenDir, { recursive: true });
    const snapshot = [
      '# Garden Map',
      '> Rendered 01-01-2026 | Gary v1.0.0 | hash: v2-42-01-01-2026',
      '> 42 entities across 8 areas',
    ].join('\n');
    writeFileSync(join(gardenDir, 'garden.md'), snapshot);

    writeFileSync(join(tempDir, '_gary-the-gardener', 'VERSION'), '1.0.0');

    const result = await cli(['update', '--force']);
    expect(result.exitCode).toBe(0);

    const preserved = readFileSync(join(gardenDir, 'garden.md'), 'utf8');
    expect(preserved).toContain('42 entities across 8 areas');
  });
});

// ── P2: F-004 — Doctor detects missing .aiignore ────────────────────
test.describe('CLI: doctor missing .aiignore', () => {
  test('doctor detects missing .aiignore', async ({ cli, tempDir }) => {
    await cli(['install', '-t', 'cursor']);

    // Remove .aiignore
    const { unlinkSync } = await import('node:fs');
    unlinkSync(join(tempDir, '.aiignore'));

    const result = await cli(['doctor']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('.aiignore missing');
    expect(result.stdout).toContain('issue(s) found');
  });
});
