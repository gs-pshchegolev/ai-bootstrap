#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { createInterface } from 'node:readline/promises';

const PKG_ROOT = resolve(import.meta.dirname, '..');
const VERSION = readFileSync(join(PKG_ROOT, '_gs-gardener', 'VERSION'), 'utf8').trim();

// ── Colors (no dependencies) ────────────────────────────────────────
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

// ── Tool definitions ─────────────────────────────────────────────────
const TOOLS = {
  'claude-code': {
    label: 'Claude Code',
    detect: [],
    alwaysInstall: true,
    wrapper: {
      path: 'CLAUDE.md',
      content: `# CLAUDE.md\n\nFollow all instructions in the root AGENTS.md file as the primary context for this repository.\n`,
    },
  },
  cursor: {
    label: 'Cursor',
    detect: ['.cursor', '.cursorrules'],
    wrapper: {
      path: '.cursor/rules/agents.mdc',
      dirs: ['.cursor', '.cursor/rules'],
      content: `---
description: Primary repository context sourced from AGENTS.md
globs:
alwaysApply: true
---

Follow all instructions in the root AGENTS.md file as the primary context for this repository.
`,
    },
  },
  copilot: {
    label: 'GitHub Copilot',
    detect: ['.github/copilot-instructions.md', '.github'],
    wrapper: {
      path: '.github/copilot-instructions.md',
      dirs: ['.github'],
      content: `# Copilot Instructions\n\nFollow all instructions in the root AGENTS.md file as the primary context for this repository.\n`,
    },
  },
  windsurf: {
    label: 'Windsurf',
    detect: ['.windsurfrules', '.windsurf'],
    wrapper: {
      path: '.windsurfrules',
      content: `Follow all instructions in the root AGENTS.md file as the primary context for this repository.\n`,
    },
  },
  junie: {
    label: 'JetBrains Junie',
    detect: ['.junie'],
    wrapper: {
      path: '.junie/guidelines.md',
      dirs: ['.junie'],
      content: `# Junie Guidelines\n\nFollow all instructions in the root AGENTS.md file as the primary context for this repository.\n`,
    },
  },
};

const TOOL_SLUGS = Object.keys(TOOLS);
const OPTIONAL_SLUGS = TOOL_SLUGS.filter(s => !TOOLS[s].alwaysInstall);

// ── Parse CLI arguments ─────────────────────────────────────────────
const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    force:     { type: 'boolean', short: 'f', default: false },
    'dry-run': { type: 'boolean', short: 'n', default: false },
    help:      { type: 'boolean', short: 'h', default: false },
    version:   { type: 'boolean', short: 'v', default: false },
    tools:     { type: 'string',  short: 't' },
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
  await runInstall(values.force, dryRun);
} else {
  console.error(red(`Unknown command: ${command}`));
  console.error('Run "npx @pshch/gary-the-gardener --help" for usage.');
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════
// ── Core functions ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

async function runInstall(force, dryRun) {
  const dest = process.cwd();

  console.log(`\n🪴 ${bold('Gary the Gardener')} v${VERSION}`);
  if (dryRun) console.log(yellow(`   (dry run — no files will be written)`));
  console.log('');

  // Validate --tools flag early, before any file operations
  const requestedTools = parseToolsFlag(values.tools);

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
  let freshInstall = false;

  if (isUpgrade) {
    console.log(`  Upgrading ${dim(`v${installedVersion}`)} → ${green(`v${VERSION}`)}\n`);
  } else if (isCurrent && !force) {
    console.log(`  Already up to date ${dim(`(v${VERSION})`)}\n`);
  }

  // ── 1. Core Garden System ─────────────────────────────────────────
  if (isCurrent && !force) {
    console.log(`  ${green('✓')} Core system → ${dim('_gs-gardener/ (unchanged)')}`);
  } else {
    const savedConfig = isUpgrade ? safeReadFile(configPath) : null;

    if (!dryRun) {
      cpSync(coreSrc, coreDest, { recursive: true, force: true });

      if (savedConfig) {
        const updated = savedConfig
          .replace(/^# Version: .+$/m, `# Version: ${VERSION}`)
          .replace(/^version: .+$/m, `version: "${VERSION}"`);
        writeFileSync(configPath, updated);
        console.log(`  ${green('✓')} Core system → ${dim('_gs-gardener/ (upgraded, config preserved)')}`);
      } else {
        // Config will be written in step 7 after tool selection
        freshInstall = true;
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
  installWrapper(dest, 'CLAUDE.md', TOOLS['claude-code'].wrapper.content, force, dryRun);

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

  // ── 5. Determine tool selections ──────────────────────────────────
  let selectedTools;

  if (requestedTools) {
    selectedTools = requestedTools;
  } else if (!process.stdin.isTTY) {
    selectedTools = ['claude-code'];
  } else {
    const detected = detectTools(dest);
    selectedTools = await promptToolSelection(detected);
  }

  // ── 6. Install tool wrappers ──────────────────────────────────────
  const toolsToWrap = selectedTools.filter(s => s !== 'claude-code');
  const installedWrappers = [];

  for (const slug of toolsToWrap) {
    const tool = TOOLS[slug];
    const w = tool.wrapper;

    if (w.dirs && !dryRun) {
      for (const d of w.dirs) {
        mkdirSync(join(dest, d), { recursive: true });
      }
    }

    const written = installWrapper(dest, w.path, w.content, force, dryRun);
    installedWrappers.push({ slug, label: tool.label, path: w.path, written });
  }

  // ── 7. Update config.yaml wrapper_files ───────────────────────────
  const wrapperPaths = selectedTools.map(s => TOOLS[s].wrapper.path);

  if (!dryRun && freshInstall) {
    writeFileSync(configPath, defaultConfig(basename(dest), wrapperPaths));
  } else if (!dryRun && isUpgrade && toolsToWrap.length > 0) {
    const currentConfig = safeReadFile(configPath) || '';
    const newEntries = wrapperPaths
      .map(p => `"{project-root}/${p}"`)
      .filter(p => !currentConfig.includes(p));

    if (newEntries.length > 0) {
      const updated = currentConfig.replace(
        /(wrapper_files:\n(?:\s+-\s+.+\n)*)/,
        (match) => match + newEntries.map(p => `  - ${p}\n`).join('')
      );
      writeFileSync(configPath, updated);
    }
  }

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
  console.log(`  ${green('✓')} Core system ${dim('(_gs-gardener/)')}`);
  console.log(`  ${green('✓')} ${gardenCmds.length} skill commands ${dim('(.claude/commands/)')}`);
  console.log(`  ${green('✓')} Claude Code ${dim('(CLAUDE.md)')}`);
  console.log(`  ${green('✓')} .aiignore`);
  for (const w of installedWrappers) {
    const icon = w.written ? green('✓') : yellow('⚠');
    const note = w.written ? '' : dim(' (already existed)');
    console.log(`  ${icon} ${w.label} ${dim(`(${w.path})`)}${note}`);
  }

  console.log(`\n${bold('Next steps:')}`);
  console.log(`  1. Run ${green('claude /garden-bootstrap')} to set up AI-ready documentation`);
  console.log(`     ${dim('Creates AGENTS.md — the source of truth for all your AI tools')}`);
  console.log(`  2. Run ${green('claude /garden-audit')} to verify accuracy`);
  console.log(`  3. Run ${green('claude /garden-extend')} to add guardrails & principles`);

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
  console.log(`  ${agentsExists ? green('✓') : '○'} ${'AGENTS.md'.padEnd(15)} ${agentsExists ? green('present') : yellow('not yet created (run /garden-bootstrap)')}`);

  // .aiignore
  statusLine('.aiignore', existsSync(join(dest, '.aiignore')), 'present');

  // Tool wrappers
  console.log(`\n  ${dim('Tool wrappers:')}`);
  for (const [, tool] of Object.entries(TOOLS)) {
    if (tool.alwaysInstall) continue;
    wrapperLine(tool.label, join(dest, tool.wrapper.path));
  }

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

function defaultConfig(projectName, wrapperPaths) {
  const wrapperLines = (wrapperPaths || ['CLAUDE.md'])
    .map(p => `  - "{project-root}/${p}"`)
    .join('\n');

  return `# Garden System Configuration
# Version: ${VERSION}

project_name: ${projectName}
user_name: User
communication_language: English
output_folder: "{project-root}/docs"

# Coverage tracking
agents_file: "{project-root}/AGENTS.md"
wrapper_files:
${wrapperLines}

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
  console.log(`    ${icon} ${label.padEnd(18)} ${text}`);
}

function safeReadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function parseToolsFlag(flagValue) {
  if (flagValue === undefined) return null;

  const slugs = flagValue.split(',').map(s => s.trim().toLowerCase());
  const invalid = slugs.filter(s => !TOOLS[s]);
  if (invalid.length) {
    console.error(red(`Unknown tool(s): ${invalid.join(', ')}`));
    console.error(`Valid tools: ${TOOL_SLUGS.join(', ')}`);
    process.exit(1);
  }
  if (!slugs.includes('claude-code')) slugs.unshift('claude-code');
  return slugs;
}

function detectTools(dest) {
  const detected = [];
  for (const [slug, tool] of Object.entries(TOOLS)) {
    if (tool.alwaysInstall) {
      detected.push(slug);
      continue;
    }
    for (const probe of tool.detect) {
      if (existsSync(join(dest, probe))) {
        detected.push(slug);
        break;
      }
    }
  }
  return detected;
}

async function promptToolSelection(detected) {
  const entries = OPTIONAL_SLUGS.map((slug, i) => ({
    num: i + 1,
    slug,
    tool: TOOLS[slug],
    selected: detected.includes(slug),
  }));

  function printList() {
    for (const e of entries) {
      const marker = e.selected ? green('[x]') : '[ ]';
      const hint = detected.includes(e.slug) ? green(' (detected)') : '';
      console.log(`  ${e.num}. ${marker} ${e.tool.label}${hint}  ${dim(e.tool.wrapper.path)}`);
    }
  }

  console.log(`\n${bold('Create wrappers for other AI tools?')}`);
  console.log(dim('These point each tool to your AGENTS.md source of truth.\n'));
  printList();
  console.log(`\n${dim('Enter numbers to toggle (e.g. "1 3"), "all", "none", or press Enter to confirm:')}`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    while (true) {
      const answer = await rl.question('> ');
      const trimmed = answer.trim().toLowerCase();

      if (trimmed === '') break;

      if (trimmed === 'all') {
        for (const e of entries) e.selected = true;
      } else if (trimmed === 'none' || trimmed === 'skip') {
        for (const e of entries) e.selected = false;
      } else {
        const nums = trimmed.split(/[\s,]+/).map(Number).filter(n => n >= 1 && n <= entries.length);
        for (const n of nums) {
          entries[n - 1].selected = !entries[n - 1].selected;
        }
      }

      printList();
      console.log(dim('Enter numbers to toggle, or press Enter to confirm:'));
    }
  } finally {
    rl.close();
  }

  const result = ['claude-code'];
  for (const e of entries) {
    if (e.selected) result.push(e.slug);
  }
  return result;
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
  ${dim('Always (Claude Code — the agent host):')}
    • Core system        ${dim('(_gs-gardener/)')}
    • Skill commands     ${dim('(.claude/commands/garden-*.md)')}
    • CLAUDE.md          ${dim('(points Claude to AGENTS.md)')}
    • .aiignore          ${dim('(keeps secrets out of AI context)')}

  ${dim('Optional wrappers (select interactively or via --tools):')}
    • Cursor             ${dim('(.cursor/rules/agents.mdc)')}
    • GitHub Copilot     ${dim('(.github/copilot-instructions.md)')}
    • Windsurf           ${dim('(.windsurfrules)')}
    • JetBrains Junie    ${dim('(.junie/guidelines.md)')}

${bold('OPTIONS')}
  -t, --tools    Comma-separated tools to create wrappers for
                 ${dim('Valid: cursor, copilot, windsurf, junie')}
                 ${dim('If omitted: interactive prompt (or Claude-only if piped)')}
  -n, --dry-run  Show what would be installed, without writing files
  -f, --force    Overwrite existing files
  -v, --version  Show version
  -h, --help     Show this help

${bold('EXAMPLES')}
  npx @pshch/gary-the-gardener                    ${dim('# install with interactive tool selection')}
  npx @pshch/gary-the-gardener --tools cursor      ${dim('# install + Cursor wrapper')}
  npx @pshch/gary-the-gardener -t cursor,copilot   ${dim('# install + Cursor + Copilot wrappers')}
  npx @pshch/gary-the-gardener status              ${dim('# check install state')}
  npx @pshch/gary-the-gardener -f                  ${dim('# reinstall / overwrite')}
`);
}
