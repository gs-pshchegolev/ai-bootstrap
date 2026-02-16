#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const PKG_ROOT = resolve(import.meta.dirname, '..');
const VERSION = readFileSync(join(PKG_ROOT, '_gs-gardener', 'VERSION'), 'utf8').trim();

// ── Colors (no dependencies) ────────────────────────────────────────
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

// ── Parse CLI arguments ─────────────────────────────────────────────
const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    force:     { type: 'boolean', short: 'f', default: false },
    'dry-run': { type: 'boolean', short: 'n', default: false },
    help:      { type: 'boolean', short: 'h', default: false },
    version:   { type: 'boolean', short: 'v', default: false },
  },
  allowPositionals: true,
  strict: false,
});

const command = positionals[0];

// ── Version ─────────────────────────────────────────────────────────
if (values.version) {
  console.log(`gary-the-gardener v${VERSION}`);
  process.exit(0);
}

// ── Help ────────────────────────────────────────────────────────────
if (values.help) {
  printHelp();
  process.exit(0);
}

// ── Route commands ──────────────────────────────────────────────────
const dryRun = values['dry-run'];

if (command === 'status') {
  runStatus();
} else if (command === 'install' || !command) {
  runInstall(values.force, dryRun);
} else {
  console.error(red(`Unknown command: ${command}`));
  console.error('Run "npx @pshch/gary-the-gardener --help" for usage.');
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════
// ── Core functions ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

function runInstall(force, dryRun) {
  const dest = process.cwd();

  console.log(`\n🪴 ${bold('Gary the Gardener')} v${VERSION}`);
  if (dryRun) console.log(yellow(`   (dry run — no files will be written)`));
  console.log('');

  // Sanity check: don't install into the package itself
  if (existsSync(join(dest, 'bin', 'cli.js')) && existsSync(join(dest, '_gs-gardener', 'core'))) {
    const pkg = safeReadJson(join(dest, 'package.json'));
    if (pkg?.name === '@pshch/gary-the-gardener') {
      console.log(red('Error: Refusing to install into the gary-the-gardener package itself.'));
      process.exit(1);
    }
  }

  // ── Detect existing installation ──────────────────────────────────
  const coreSrc = join(PKG_ROOT, '_gs-gardener');
  const coreDest = join(dest, '_gs-gardener');
  const configPath = join(coreDest, 'core', 'config.yaml');

  const installedVersion = readInstalledVersion(coreDest);
  const isUpgrade = installedVersion && installedVersion !== VERSION;
  const isCurrent = installedVersion === VERSION;

  if (isUpgrade) {
    console.log(`  Upgrading ${dim(`v${installedVersion}`)} → ${green(`v${VERSION}`)}\n`);
  } else if (isCurrent && !force) {
    console.log(`  Already up to date ${dim(`(v${VERSION})`)}\n`);
  }

  // ── 1. Core Garden System ─────────────────────────────────────────
  if (isCurrent && !force) {
    console.log(`  ${green('✓')} Core system → ${dim('_gs-gardener/ (unchanged)')}`);
  } else {
    // Save user config before overwriting
    const savedConfig = isUpgrade ? safeReadFile(configPath) : null;

    if (!dryRun) {
      cpSync(coreSrc, coreDest, { recursive: true, force: true });

      if (savedConfig) {
        // Restore user config, only bump the version line
        const updated = savedConfig
          .replace(/^# Version: .+$/m, `# Version: ${VERSION}`)
          .replace(/^version: .+$/m, `version: "${VERSION}"`);
        writeFileSync(configPath, updated);
        console.log(`  ${green('✓')} Core system → ${dim('_gs-gardener/ (upgraded, config preserved)')}`);
      } else {
        // Fresh install — write default config
        const projectName = basename(dest);
        writeFileSync(configPath, defaultConfig(projectName));
        console.log(`  ${green('✓')} Core system → ${dim('_gs-gardener/')}`);
      }
    } else {
      const label = isUpgrade ? '(would upgrade, config preserved)' : '';
      console.log(`  ${green('✓')} Core system → ${dim(`_gs-gardener/ ${label}`)}`);
    }
  }

  // ── 2. Claude Code skill commands ─────────────────────────────────
  const cmdSrc = join(PKG_ROOT, '.claude', 'commands');
  const cmdDest = join(dest, '.claude', 'commands');
  if (!dryRun) mkdirSync(cmdDest, { recursive: true });

  const gardenCmds = readdirSync(cmdSrc).filter(f => f.startsWith('garden-') && f.endsWith('.md'));
  const shouldUpdateCmds = isUpgrade || force || !installedVersion;
  let copied = 0;
  for (const file of gardenCmds) {
    const destFile = join(cmdDest, file);
    if (existsSync(destFile) && !shouldUpdateCmds) continue;
    if (!dryRun) cpSync(join(cmdSrc, file), destFile, { force: true });
    copied++;
  }
  if (isCurrent && !force) {
    console.log(`  ${green('✓')} ${gardenCmds.length} skill commands → ${dim('.claude/commands/ (unchanged)')}`);
  } else {
    console.log(`  ${green('✓')} ${copied} skill commands → ${dim('.claude/commands/')}`);
  }

  // ── 3. CLAUDE.md ──────────────────────────────────────────────────
  installWrapper(dest, 'CLAUDE.md',
    `# CLAUDE.md\n\nFollow all instructions in the root AGENTS.md file as the primary context for this repository.\n`,
    force, dryRun);

  // ── 4. .aiignore ──────────────────────────────────────────────────
  installWrapper(dest, '.aiignore',
    `# AI Agent Ignore File
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
`,
    force, dryRun);

  // ── Summary ───────────────────────────────────────────────────────
  if (dryRun) {
    console.log(`\n${yellow(bold('Dry run complete'))} — nothing was written.\n`);
    console.log(`Run without ${dim('--dry-run')} to install.\n`);
  } else if (isUpgrade) {
    console.log(`\n🌱 ${bold(`Upgrade complete!`)} ${dim(`(v${installedVersion} → v${VERSION})`)}\n`);
  } else {
    console.log(`\n🌱 ${bold('Installation complete!')}\n`);
  }

  console.log(`${bold('Installed:')}`);
  console.log(`  Core system, ${gardenCmds.length} skill commands, CLAUDE.md, .aiignore\n`);

  console.log(`${bold('Next steps:')}`);
  console.log(`  1. Run ${green('claude /garden-bootstrap')} to set up AI-ready documentation`);
  console.log(`     ${dim('Creates AGENTS.md + wrappers for your AI tools (Copilot, Cursor, etc.)')}`);
  console.log(`  2. Run ${green('claude /garden-audit')} to verify accuracy`);
  console.log(`  3. Run ${green('claude /garden-extend')} to add guardrails & principles`);

  console.log(`\n${dim('Gary currently runs on Claude Code. Wrappers for other tools are')}`);
  console.log(`${dim('created by the agent during bootstrap — run /garden-bootstrap to start.')}`);

  console.log(`\n🪴 Happy gardening!\n`);
}

function runStatus() {
  const dest = process.cwd();

  console.log(`\n🪴 ${bold('Garden System — Status')}\n`);

  // Core system
  const coreInstalled = existsSync(join(dest, '_gs-gardener', 'core'));
  let coreVersion = '';
  if (coreInstalled) {
    try {
      coreVersion = readFileSync(join(dest, '_gs-gardener', 'VERSION'), 'utf8').trim();
    } catch { /* ignore */ }
  }
  statusLine('Core system', coreInstalled, coreInstalled ? `v${coreVersion}` : null);

  // Claude Code
  const claudeMd = existsSync(join(dest, 'CLAUDE.md'));
  const cmdDir = join(dest, '.claude', 'commands');
  let cmdCount = 0;
  if (existsSync(cmdDir)) {
    cmdCount = readdirSync(cmdDir).filter(f => f.startsWith('garden-') && f.endsWith('.md')).length;
  }
  statusLine('Claude Code', claudeMd || cmdCount > 0,
    (claudeMd || cmdCount > 0) ? `CLAUDE.md + ${cmdCount} commands` : null);

  // AGENTS.md
  const agentsExists = existsSync(join(dest, 'AGENTS.md'));
  console.log(`  ${agentsExists ? green('✓') : '○'} ${('AGENTS.md').padEnd(15)} ${agentsExists ? green('present') : yellow('not yet created (run /garden-bootstrap)')}`);

  // .aiignore
  statusLine('.aiignore', existsSync(join(dest, '.aiignore')), 'present');

  // Wrappers (produced by the agent, not the CLI)
  console.log(`\n  ${dim('Wrappers (created by /garden-bootstrap):')}`);
  wrapperLine('Copilot', join(dest, '.github', 'copilot-instructions.md'));
  wrapperLine('Cursor', join(dest, '.cursor', 'rules', 'agents.mdc'));
  wrapperLine('Codex', join(dest, 'codex.md'));
  wrapperLine('Junie', join(dest, '.junie', 'guidelines.md'));

  console.log('');
}

// ═══════════════════════════════════════════════════════════════════
// ── Helpers ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

function readInstalledVersion(coreDest) {
  try {
    return readFileSync(join(coreDest, 'VERSION'), 'utf8').trim();
  } catch {
    return null;
  }
}

function safeReadFile(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function defaultConfig(projectName) {
  return `# Garden System Configuration
# Version: ${VERSION}

project_name: ${projectName}
user_name: User
communication_language: English
output_folder: "{project-root}/docs"

# Coverage tracking
agents_file: "{project-root}/AGENTS.md"
wrapper_files:
  - "{project-root}/CLAUDE.md"
  - "{project-root}/.github/copilot-instructions.md"
  - "{project-root}/.cursor/rules/agents.mdc"
  - "{project-root}/.junie/guidelines.md"

# Content layers
docs_directory: "{project-root}/docs"
references_directory: "{project-root}/docs/references"

# Constraints
agents_max_lines: 150

# Garden System Version
version: "${VERSION}"
`;
}

function installWrapper(dest, relPath, content, force, dryRun) {
  const fullPath = join(dest, relPath);
  if (existsSync(fullPath) && !force) {
    console.log(`  ${yellow('⚠')} ${relPath} already exists — skipping`);
    return false;
  }
  if (!dryRun) writeFileSync(fullPath, content);
  console.log(`  ${green('✓')} ${relPath}`);
  return true;
}

function statusLine(label, installed, detail) {
  const icon = installed ? green('✓') : '✗';
  const text = installed ? green(detail || 'installed') : dim('not installed');
  console.log(`  ${icon} ${label.padEnd(15)} ${text}`);
}

function wrapperLine(label, filePath) {
  const exists = existsSync(filePath);
  const icon = exists ? green('✓') : dim('·');
  const text = exists ? green('present') : dim('—');
  console.log(`    ${icon} ${label.padEnd(13)} ${text}`);
}

function safeReadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function printHelp() {
  console.log(`
${bold('gary-the-gardener')} v${VERSION} — Garden System installer

${bold('USAGE')}
  npx @pshch/gary-the-gardener [command] [options]

${bold('COMMANDS')}
  ${green('install')}    Install Gary the Gardener ${dim('(default if no command given)')}
  ${green('status')}     Show what's currently installed

${bold('WHAT GETS INSTALLED')}
  The installer sets up Gary the Gardener agent for Claude Code:
    • Core system        ${dim('(_gs-gardener/)')}
    • Skill commands     ${dim('(.claude/commands/garden-*.md)')}
    • CLAUDE.md          ${dim('(points Claude to AGENTS.md)')}
    • .aiignore          ${dim('(keeps secrets out of AI context)')}

  After installing, run ${green('claude /garden-bootstrap')} to generate
  AGENTS.md and wrappers for your other AI tools (Copilot, Cursor, etc.).

${bold('OPTIONS')}
  -n, --dry-run  Show what would be installed, without writing files
  -f, --force    Overwrite existing files
  -v, --version  Show version
  -h, --help     Show this help

${bold('EXAMPLES')}
  npx @pshch/gary-the-gardener             ${dim('# install the agent')}
  npx @pshch/gary-the-gardener install     ${dim('# same as above')}
  npx @pshch/gary-the-gardener status      ${dim('# check install state')}
  npx @pshch/gary-the-gardener -f          ${dim('# reinstall / upgrade')}
`);
}
