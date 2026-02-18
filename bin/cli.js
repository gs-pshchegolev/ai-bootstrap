#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync, renameSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { checkbox, confirm, select } from '@inquirer/prompts';

const PKG_ROOT = resolve(import.meta.dirname, '..');
const VERSION = readFileSync(join(PKG_ROOT, '_gs-gardener', 'VERSION'), 'utf8').trim();

// ── Colors ───────────────────────────────────────────────────────────
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

// ── Workflow catalog (shared across all tool generators) ─────────────
const WORKFLOWS = [
  { name: 'bootstrap',  icon: '🌱', tag: 'Plant your first seeds' },
  { name: 'audit',      icon: '🔍', tag: 'Pull the weeds — find stale & missing docs' },
  { name: 'compact',    icon: '✂️',  tag: 'Prune the overgrowth' },
  { name: 'sync',       icon: '💧', tag: 'Water the roots — keep wrappers in sync' },
  { name: 'maintain',   icon: '🌿', tag: 'Walk the rows with shears' },
  { name: 'extend',     icon: '🌻', tag: 'Grow new beds — add content layers' },
  { name: 'references', icon: '📚', tag: 'Tend the reference shelf' },
  { name: 'scaffold',   icon: '🏗️',  tag: 'Lay out the plots — setup docs/ structure' },
  { name: 'add-tool',   icon: '🔧', tag: 'Plant in new soil — add AI tool support' },
  { name: 'help',       icon: '❓', tag: 'Ask the gardener' },
];

// ── Agent activation block (reused by all tool providers) ────────────
const AGENT_ACTIVATION = `You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from {project-root}/_gs-gardener/core/agents/gardener.md
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. FOLLOW every step in the <activation> section precisely
4. DISPLAY the welcome greeting and coverage status
5. PRESENT the numbered menu
6. WAIT for user input before proceeding
</agent-activation>`;

const AGENT_DESC = '🪴 Gary The Gardener - documentation maintenance agent';

// ── Tool definitions ─────────────────────────────────────────────────
const TOOLS = {
  "claude-code": {
    label: "Claude Code",
    required: true,
    detect: [".claude"],
    dirs: [".claude", ".claude/commands"],
    agentFile: {
      path: "CLAUDE.md",
      content: `# CLAUDE.md\n\nFollow all instructions in the root AGENTS.md file as the primary context for this repository.\n`,
    },
    summaryPath: ".claude/commands/",
  },
  cursor: {
    label: "Cursor",
    detect: [".cursor", ".cursorrules"],
    dirs: [".cursor", ".cursor/rules"],
    agentFile: {
      path: ".cursor/rules/garden-agent-gardener.mdc",
      content: `---
description: "${AGENT_DESC}"
globs:
alwaysApply: true
---

# gardener

${AGENT_ACTIVATION}
`,
    },
    summaryPath: ".cursor/rules/garden-agent-gardener.mdc",
  },
  copilot: {
    label: "GitHub Copilot",
    detect: [".github/copilot-instructions.md", ".github"],
    dirs: [".github", ".github/agents"],
    agentFile: {
      path: ".github/agents/gardener.md",
      content: `---
name: 'gardener'
description: '${AGENT_DESC}'
---

# gardener

${AGENT_ACTIVATION}
`,
    },
    summaryPath: ".github/agents/gardener.md",
  },
  windsurf: {
    label: "Windsurf",
    detect: [".windsurfrules", ".windsurf"],
    dirs: [".windsurf", ".windsurf/rules"],
    agentFile: {
      path: ".windsurf/rules/garden-agent-gardener.md",
      content: `# gardener

> ${AGENT_DESC}

${AGENT_ACTIVATION}
`,
    },
    summaryPath: ".windsurf/rules/garden-agent-gardener.md",
  },
  junie: {
    label: "JetBrains Junie",
    detect: [".junie"],
    dirs: [".junie"],
    agentFile: {
      path: ".junie/guidelines.md",
      content: `# 🪴 Gary The Gardener

> Documentation maintenance agent for this repository.

${AGENT_ACTIVATION}
`,
    },
    summaryPath: ".junie/guidelines.md",
  },
};

const TOOL_SLUGS = Object.keys(TOOLS);

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
const dryRun = values['dry-run'];

// ── Version ─────────────────────────────────────────────────────────
if (values.version) {
  console.log(`🪴 Gary The Gardener v${VERSION}`);
  process.exit(0);
}

// ── Help ────────────────────────────────────────────────────────────
if (values.help) {
  printHelp();
  process.exit(0);
}

// ── Route commands ──────────────────────────────────────────────────
const COMMANDS = {
  install: () => runInstall(values.force, dryRun),
  update:  () => runUpdate(values.force, dryRun),
  status:  () => runStatus(),
  doctor:  () => runDoctor(),
};

if (command && COMMANDS[command]) {
  await COMMANDS[command]();
} else if (command) {
  console.error(red(`Unknown command: ${command}`));
  console.error('Run "npx @pshch/gary-the-gardener --help" for usage.');
  process.exit(1);
} else {
  await runInteractiveMenu();
}

// ═══════════════════════════════════════════════════════════════════
// ── Core functions ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

async function runInteractiveMenu() {
  const dest = process.cwd();
  const installedVersion = readInstalledVersion(join(dest, '_gs-gardener'));
  const isInstalled = !!installedVersion;

  // Non-TTY fallback: auto-detect action
  if (!process.stdin.isTTY) {
    if (isInstalled) {
      await runUpdate(false, dryRun);
    } else {
      await runInstall(false, dryRun);
    }
    return;
  }

  console.log(`\n🪴 ${bold('Gary The Gardener')} v${VERSION}\n`);

  const choices = [
    {
      name: `Install  ${dim('— fresh garden setup')}`,
      value: 'install',
      disabled: isInstalled ? `already installed v${installedVersion} — use Update` : false,
    },
    {
      name: `Update   ${dim('— upgrade existing installation')}`,
      value: 'update',
      disabled: !isInstalled ? 'not yet installed — use Install' : false,
    },
    {
      name: `Status   ${dim('— check what\'s installed')}`,
      value: 'status',
    },
    {
      name: `Doctor   ${dim('— verify installation health')}`,
      value: 'doctor',
      disabled: !isInstalled ? 'not yet installed' : false,
    },
  ];

  const action = await select({
    message: 'What would you like to do?',
    choices,
    default: isInstalled ? 'update' : 'install',
  });

  switch (action) {
    case 'install': await runInstall(values.force, dryRun); break;
    case 'update':  await runUpdate(values.force, dryRun); break;
    case 'status':  runStatus(); break;
    case 'doctor':  runDoctor(); break;
  }
}

async function runInstall(force, dryRun) {
  const dest = process.cwd();
  const installedVersion = readInstalledVersion(join(dest, '_gs-gardener'));

  if (installedVersion && !force) {
    console.log(`\n  Garden system already installed ${dim(`(v${installedVersion})`)}.`);
    console.log(`  Use ${green('update')} to upgrade, or ${dim('--force')} to reinstall.\n`);
    process.exit(0);
  }

  await runSetup('install', force, dryRun);
}

async function runUpdate(force, dryRun) {
  const dest = process.cwd();
  const installedVersion = readInstalledVersion(join(dest, '_gs-gardener'));

  if (!installedVersion) {
    console.log(`\n  Garden system not found in this directory.`);
    console.log(`  Use ${green('install')} for first-time setup.\n`);
    process.exit(0);
  }

  // Confirmation before update (skip with --force)
  if (!force && !dryRun) {
    console.log(`\n  Updating garden system: ${dim(`v${installedVersion}`)} → ${green(`v${VERSION}`)}`);
    console.log(`  ${dim('This will overwrite core files. Your config.yaml settings will be preserved.')}\n`);

    const proceed = await confirm({
      message: 'Continue with update?',
      default: true,
    });

    if (!proceed) {
      console.log(`\n  Update cancelled.\n`);
      process.exit(0);
    }
  }

  await runSetup('update', force, dryRun);
}

async function runSetup(mode, force, dryRun) {
  const dest = process.cwd();

  console.log(`\n🪴 ${bold("Gary The Gardener")} v${VERSION}`);
  if (dryRun) console.log(yellow(`   (dry run — no files will be written)`));
  console.log("");

  // Validate --tools flag early, before any file operations
  const requestedTools = parseToolsFlag(values.tools);

  // ── Detect existing installation ──────────────────────────────────
  const coreSrc = join(PKG_ROOT, "_gs-gardener");
  const coreDest = join(dest, "_gs-gardener");
  const configPath = join(coreDest, "core", "config.yaml");

  const installedVersion = readInstalledVersion(coreDest);
  const isUpgrade = installedVersion && installedVersion !== VERSION;
  const isCurrent = installedVersion === VERSION;
  let freshInstall = false;

  if (isUpgrade) {
    console.log(
      `  Upgrading ${dim(`v${installedVersion}`)} → ${green(`v${VERSION}`)}\n`,
    );
  } else if (isCurrent && !force) {
    console.log(`  Already up to date ${dim(`(v${VERSION})`)}\n`);
  }

  // ── 1. Core Garden System ─────────────────────────────────────────
  if (isCurrent && !force) {
    console.log(
      `  ${green("✓")} Core system → ${dim("_gs-gardener/ (unchanged)")}`,
    );
  } else {
    // Preserve config for any existing installation (upgrades or force reinstalls)
    const savedConfig = installedVersion ? safeReadFile(configPath) : null;

    if (!dryRun) {
      cpSync(coreSrc, coreDest, { recursive: true, force: true });

      if (savedConfig) {
        const updated = savedConfig
          .replace(/^# Version: .+$/m, `# Version: ${VERSION}`)
          .replace(/^version: .+$/m, `version: "${VERSION}"`);
        writeFileSync(configPath, updated);
        console.log(
          `  ${green("✓")} Core system → ${dim("_gs-gardener/ (upgraded, config preserved)")}`,
        );
      } else {
        freshInstall = true;
        console.log(`  ${green("✓")} Core system → ${dim("_gs-gardener/")}`);
      }
    } else {
      const label = installedVersion ? "(would upgrade, config preserved)" : "";
      console.log(
        `  ${green("✓")} Core system → ${dim(`_gs-gardener/ ${label}`)}`,
      );
    }
  }

  // ── 2. .aiignore ──────────────────────────────────────────────────
  installFile(
    dest,
    ".aiignore",
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
    force,
    dryRun,
  );

  // ── 3. Determine tool selections ──────────────────────────────────
  const requiredTools = Object.entries(TOOLS)
    .filter(([, t]) => t.required)
    .map(([slug]) => slug);

  let selectedTools;

  if (requestedTools) {
    selectedTools = requestedTools;
  } else if (!process.stdin.isTTY) {
    selectedTools = detectTools(dest);
  } else {
    const detected = detectTools(dest);
    selectedTools = await promptToolSelection(detected);
  }

  // Always include required tools
  for (const slug of requiredTools) {
    if (!selectedTools.includes(slug)) selectedTools.unshift(slug);
  }

  // ── 4. Install tool agent files ───────────────────────────────────
  const toolResults = [];

  for (const slug of selectedTools) {
    const tool = TOOLS[slug];

    // Create directories if needed
    if (tool.dirs && !dryRun) {
      for (const d of tool.dirs) {
        const dirPath = join(dest, d);
        if (existsSync(dirPath)) {
          // If it's a file where we need a directory, back it up and replace
          if (statSync(dirPath).isFile()) {
            const bakPath = dirPath + '.bak';
            renameSync(dirPath, bakPath);
            console.log(`  ${yellow('⚠')} ${d} was a file — moved to ${d}.bak`);
            mkdirSync(dirPath, { recursive: true });
          }
        } else {
          mkdirSync(dirPath, { recursive: true });
        }
      }
    }

    // Install agent file
    if (tool.agentFile) {
      const written = installFile(
        dest,
        tool.agentFile.path,
        tool.agentFile.content,
        force,
        dryRun,
      );
      toolResults.push({
        slug,
        label: tool.label,
        path: tool.agentFile.path,
        written,
      });
    }

    // Claude Code: also copy skill commands
    if (slug === "claude-code") {
      const cmdSrc = join(PKG_ROOT, ".claude", "commands");
      const cmdDest = join(dest, ".claude", "commands");
      const gardenCmds = readdirSync(cmdSrc).filter(
        (f) => f.startsWith("garden-") && f.endsWith(".md"),
      );
      const shouldUpdateCmds = isUpgrade || force || !installedVersion;
      let copied = 0;
      for (const file of gardenCmds) {
        const destFile = join(cmdDest, file);
        if (existsSync(destFile) && !shouldUpdateCmds) continue;
        if (!dryRun) cpSync(join(cmdSrc, file), destFile, { force: true });
        copied++;
      }
      // Enrich the result with commands detail
      const last = toolResults[toolResults.length - 1];
      if (last && last.slug === "claude-code") {
        last.detail = `CLAUDE.md + ${gardenCmds.length} commands`;
      }
    }
  }

  // ── 5. Write or update config.yaml ─────────────────────────────────
  if (!dryRun && freshInstall) {
    writeFileSync(configPath, defaultConfig(basename(dest), selectedTools));
  } else if (!dryRun && !freshInstall) {
    // Update wrapper_files in existing config to include newly added tools
    updateConfigWrappers(configPath, selectedTools);
  }

  // ── Summary ───────────────────────────────────────────────────────
  if (dryRun) {
    console.log(
      `\n${yellow(bold("Dry run complete"))} — nothing was written.\n`,
    );
    console.log(`Run without ${dim("--dry-run")} to ${mode}.\n`);
  } else if (mode === 'update' && isUpgrade) {
    console.log(
      `\n🌱 ${bold(`Update complete!`)} ${dim(`(v${installedVersion} → v${VERSION})`)}\n`,
    );
  } else if (mode === 'update') {
    console.log(`\n🌱 ${bold("Already up to date!")}\n`);
  } else {
    console.log(`\n🌱 ${bold("Installation complete!")}\n`);
  }

  // Tools configured
  console.log(`${bold("Tools configured:")}`);
  for (const r of toolResults) {
    const icon = r.written ? green("✅") : yellow("⚠️");
    const note = r.written ? "" : dim(" (already existed)");
    const display = r.detail || r.path;
    console.log(`  ${icon} ${r.label.padEnd(15)} → ${dim(display)}${note}`);
  }

  // Next steps
  if (!dryRun && mode === 'install') {
    console.log(`\n${bold("Next steps:")}`);
    console.log(
      `  1. Run ${green("/garden-bootstrap")} to set up AI-ready documentation`,
    );
    console.log(
      `     Creates AGENTS.md — the source of truth for all your AI tools`,
    );
    console.log(`  2. Run ${green("/garden-audit")} to verify accuracy`);
    console.log(
      `  3. Run ${green("/garden-extend")} to add guardrails & principles`,
    );
  }

  // Garden metaphor
  printGardenWelcome();
}

function runStatus() {
  const dest = process.cwd();

  console.log(`\n🪴 ${bold('Gary The Gardener — Status')}\n`);

  // Core system
  const coreInstalled = existsSync(join(dest, '_gs-gardener', 'core'));
  let coreVersion = '';
  if (coreInstalled) {
    try {
      coreVersion = readFileSync(join(dest, '_gs-gardener', 'VERSION'), 'utf8').trim();
    } catch { /* ignore */ }
  }
  statusLine('Core system', coreInstalled, coreInstalled ? `v${coreVersion}` : null);

  // AGENTS.md
  const agentsExists = existsSync(join(dest, 'AGENTS.md'));
  console.log(`  ${agentsExists ? green('✓') : '○'} ${'AGENTS.md'.padEnd(18)} ${agentsExists ? green('present') : yellow('not yet created (run /garden-bootstrap)')}`);

  // .aiignore
  statusLine('.aiignore', existsSync(join(dest, '.aiignore')), 'present');

  // Tool agents
  console.log(`\n  ${dim('Tool agents:')}`);
  for (const [slug, tool] of Object.entries(TOOLS)) {
    if (!tool.agentFile) continue;
    const exists = existsSync(join(dest, tool.agentFile.path));
    let detail = tool.agentFile.path;
    if (slug === "claude-code" && exists) {
      const cmdDir = join(dest, ".claude", "commands");
      let cmdCount = 0;
      if (existsSync(cmdDir)) {
        cmdCount = readdirSync(cmdDir).filter(
          (f) => f.startsWith("garden-") && f.endsWith(".md"),
        ).length;
      }
      detail = `CLAUDE.md + ${cmdCount} commands`;
    }
    const icon = exists ? green("✓") : dim("·");
    const text = exists ? green(detail) : dim("—");
    console.log(`    ${icon} ${tool.label.padEnd(18)} ${text}`);
  }

  console.log('');
}

function runDoctor() {
  const dest = process.cwd();
  let issues = 0;

  console.log(`\n🪴 ${bold('Gary The Gardener — Doctor')}\n`);

  // 1. Check core system exists
  const coreDest = join(dest, '_gs-gardener');
  const coreExists = existsSync(join(coreDest, 'core'));
  if (!coreExists) {
    console.log(`  ${red('✗')} Core system not found`);
    console.log(`\n  Run ${green('npx @pshch/gary-the-gardener install')} to set up.\n`);
    return;
  }
  console.log(`  ${green('✓')} Core system present`);

  // 2. Check version consistency
  const installedVersion = readInstalledVersion(coreDest);
  if (installedVersion !== VERSION) {
    console.log(`  ${yellow('!')} Version mismatch: installed ${dim(`v${installedVersion}`)}, latest ${green(`v${VERSION}`)}`);
    issues++;
  } else {
    console.log(`  ${green('✓')} Version up to date ${dim(`(v${VERSION})`)}`);
  }

  // 3. Check config.yaml exists
  const configPath = join(coreDest, 'core', 'config.yaml');
  if (!existsSync(configPath)) {
    console.log(`  ${red('✗')} config.yaml missing`);
    issues++;
  } else {
    console.log(`  ${green('✓')} config.yaml present`);
  }

  // 4. Check AGENTS.md
  if (!existsSync(join(dest, 'AGENTS.md'))) {
    console.log(`  ${yellow('!')} AGENTS.md not found — run ${green('/garden-bootstrap')} to create it`);
    issues++;
  } else {
    console.log(`  ${green('✓')} AGENTS.md present`);
  }

  // 5. Check .aiignore
  if (!existsSync(join(dest, '.aiignore'))) {
    console.log(`  ${yellow('!')} .aiignore missing`);
    issues++;
  } else {
    console.log(`  ${green('✓')} .aiignore present`);
  }

  // 6. Check tool agent files
  for (const [, tool] of Object.entries(TOOLS)) {
    if (!tool.agentFile) continue;
    const exists = existsSync(join(dest, tool.agentFile.path));
    if (exists) {
      console.log(`  ${green('✓')} ${tool.label} agent`);
    }
  }

  // 7. Check workflow files
  const workflowDir = join(coreDest, 'core', 'workflows');
  if (existsSync(workflowDir)) {
    const workflows = readdirSync(workflowDir).filter(
      (f) => statSync(join(workflowDir, f)).isDirectory(),
    );
    console.log(`  ${green('✓')} ${workflows.length} workflows available`);
  } else {
    console.log(`  ${red('✗')} Workflows directory missing`);
    issues++;
  }

  // Summary
  if (issues === 0) {
    console.log(`\n  ${green('Garden is healthy.')} 🌻\n`);
  } else {
    console.log(`\n  ${yellow(`${issues} issue(s) found.`)}\n`);
  }
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

function defaultConfig(projectName, selectedTools) {
  const wrapperLines = selectedTools
    .filter(slug => TOOLS[slug]?.agentFile)
    .map(slug => `  - "{project-root}/${TOOLS[slug].agentFile.path}"`)
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

function updateConfigWrappers(configPath, selectedTools) {
  const config = safeReadFile(configPath);
  if (!config) return;

  const wrapperPaths = selectedTools
    .filter(slug => TOOLS[slug]?.agentFile)
    .map(slug => `{project-root}/${TOOLS[slug].agentFile.path}`);

  // Parse existing wrapper_files from config
  const existingWrappers = [];
  const lines = config.split('\n');
  let inWrappers = false;
  for (const line of lines) {
    if (/^wrapper_files:/.test(line)) { inWrappers = true; continue; }
    if (inWrappers) {
      const match = line.match(/^\s+-\s+"(.+)"/);
      if (match) { existingWrappers.push(match[1]); continue; }
      inWrappers = false;
    }
  }

  // Merge — add any new wrappers not already present
  let changed = false;
  for (const wp of wrapperPaths) {
    if (!existingWrappers.includes(wp)) {
      existingWrappers.push(wp);
      changed = true;
    }
  }

  if (!changed) return;

  // Rebuild wrapper_files block
  const newBlock = 'wrapper_files:\n' +
    existingWrappers.map(w => `  - "${w}"`).join('\n');

  const updated = config.replace(
    /wrapper_files:\n(?:\s+-\s+".+"\n?)*/,
    newBlock + '\n',
  );

  writeFileSync(configPath, updated);
}

function installFile(dest, relPath, content, force, dryRun) {
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
  console.log(`  ${icon} ${label.padEnd(18)} ${text}`);
}

function parseToolsFlag(flagValue) {
  if (flagValue === undefined) return null;

  const slugs = flagValue.split(',').map(s => s.trim().toLowerCase());
  const invalid = slugs.filter(s => !TOOLS[s]);
  if (invalid.length) {
    console.error(red(`Unknown tool(s): ${invalid.join(", ")}`));
    console.error(`Valid tools: ${TOOL_SLUGS.join(", ")}`);
    process.exit(1);
  }
  return slugs;
}

function detectTools(dest) {
  const detected = [];
  for (const [slug, tool] of Object.entries(TOOLS)) {
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
  console.log(dim('\n  Each tool gets a gardener agent that loads from _gs-gardener/.\n'));

  const choices = TOOL_SLUGS.map((slug) => {
    const tool = TOOLS[slug];
    const isRequired = !!tool.required;
    const isDetected = detected.includes(slug);

    return {
      name: `${tool.label}  ${dim(tool.agentFile?.path || '')}${isDetected && !isRequired ? green(' (detected)') : ''}`,
      value: slug,
      checked: isRequired || isDetected,
      disabled: isRequired ? '(required)' : false,
    };
  });

  const selectedTools = await checkbox({
    message: 'Which AI tools should get the gardener agent?',
    choices,
  });

  return selectedTools;
}

function printGardenWelcome() {
  const cmds = WORKFLOWS.map(w =>
    `  ${w.icon.padEnd(4)} /garden-${w.name.padEnd(12)} ${w.tag}`
  ).join('\n');

  console.log(`
  Every repository is a garden.
  Code grows. Docs decay. Drift creeps in like weeds.

  Gary tends to what others forget —
  the README nobody updated,
  the changelog nobody wrote,
  the API docs nobody checked.

${cmds}

  Your garden is planted. Run ${green("/garden-help")} in your AI Agent to begin. 🌻
`);
}

function printHelp() {
  const cmds = WORKFLOWS.map(w =>
    `  ${w.icon.padEnd(4)} /garden-${w.name.padEnd(12)} ${w.tag}`
  ).join('\n');

  console.log(`
🪴 ${bold('Gary The Gardener')} v${VERSION}
  ${'═'.repeat(28)}

  Every repository is a garden.
  Code grows. Docs decay. Drift creeps in like weeds.

  Gary tends to what others forget —
  the README nobody updated,
  the changelog nobody wrote,
  the API docs nobody checked.

${cmds}

${bold('USAGE')}
  npx @pshch/gary-the-gardener [command] [options]

${bold('COMMANDS')}
  ${green('install')}    Install the garden system ${dim('(first-time setup)')}
  ${green('update')}     Update an existing installation to latest version
  ${green('status')}     Show what's currently installed
  ${green('doctor')}     Verify installation health

  When no command is given, an interactive menu is shown.

${bold('WHAT GETS INSTALLED')}
  ${dim('Always (Claude Code — the agent host):')}
    • Core system        ${dim('(_gs-gardener/)')}
    • Skill commands     ${dim('(.claude/commands/garden-*.md)')}
    • CLAUDE.md          ${dim('(points Claude to AGENTS.md)')}
    • .aiignore          ${dim('(keeps secrets out of AI context)')}

  ${dim('Optional (gardener agent for other tools):')}
    • Cursor             ${dim('(.cursor/rules/garden-agent-gardener.mdc)')}
    • GitHub Copilot     ${dim('(.github/agents/gardener.md)')}
    • Windsurf           ${dim('(.windsurf/rules/garden-agent-gardener.md)')}
    • JetBrains Junie    ${dim('(.junie/guidelines.md)')}

${bold('OPTIONS')}
  -t, --tools    Comma-separated tools to install agent for
                 ${dim('Valid: cursor, copilot, windsurf, junie')}
                 ${dim('If omitted: interactive prompt (or Claude-only if piped)')}
  -n, --dry-run  Show what would be installed, without writing files
  -f, --force    Overwrite existing files
  -v, --version  Show version
  -h, --help     Show this help

${bold('EXAMPLES')}
  npx @pshch/gary-the-gardener                      ${dim('# interactive menu')}
  npx @pshch/gary-the-gardener install               ${dim('# fresh install with tool selection')}
  npx @pshch/gary-the-gardener update                ${dim('# upgrade existing installation')}
  npx @pshch/gary-the-gardener status                ${dim('# check install state')}
  npx @pshch/gary-the-gardener doctor                ${dim('# verify installation health')}
  npx @pshch/gary-the-gardener install -t cursor     ${dim('# install + Cursor agent')}
  npx @pshch/gary-the-gardener install -f            ${dim('# force reinstall')}
  npx @pshch/gary-the-gardener install --dry-run     ${dim('# preview without writing')}
`);
}
