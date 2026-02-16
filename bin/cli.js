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
    const savedConfig = isUpgrade ? safeReadFile(configPath) : null;

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
      const label = isUpgrade ? "(would upgrade, config preserved)" : "";
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
  let selectedTools;

  if (requestedTools) {
    selectedTools = requestedTools;
  } else if (!process.stdin.isTTY) {
    selectedTools = detectTools(dest);
  } else {
    const detected = detectTools(dest);
    selectedTools = await promptToolSelection(detected);
  }

  // ── 4. Install tool agent files ───────────────────────────────────
  const toolResults = [];

  for (const slug of selectedTools) {
    const tool = TOOLS[slug];

    // Create directories if needed
    if (tool.dirs && !dryRun) {
      for (const d of tool.dirs) {
        const dirPath = join(dest, d);
        if (!existsSync(dirPath)) {
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

  // ── 5. Write config.yaml ──────────────────────────────────────────
  if (!dryRun && freshInstall) {
    writeFileSync(configPath, defaultConfig(basename(dest)));
  }

  // ── Summary ───────────────────────────────────────────────────────
  if (dryRun) {
    console.log(
      `\n${yellow(bold("Dry run complete"))} — nothing was written.\n`,
    );
    console.log(`Run without ${dim("--dry-run")} to install.\n`);
  } else if (isUpgrade) {
    console.log(
      `\n🌱 ${bold(`Upgrade complete!`)} ${dim(`(v${installedVersion} → v${VERSION})`)}\n`,
    );
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
  if (!dryRun) {
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

# Content layers
docs_directory: "{project-root}/docs"
references_directory: "{project-root}/docs/references"

# Constraints
agents_max_lines: 150

# Garden System Version
version: "${VERSION}"
`;
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
  const entries = TOOL_SLUGS.map((slug, i) => ({
    num: i + 1,
    slug,
    tool: TOOLS[slug],
    selected: detected.includes(slug),
  }));

  function printList() {
    for (const e of entries) {
      const marker = e.selected ? green('[x]') : '[ ]';
      const hint = detected.includes(e.slug) ? green(' (detected)') : '';
      console.log(`  ${e.num}. ${marker} ${e.tool.label}${hint}  ${dim(e.tool.agentFile?.path || '')}`);
    }
  }

  console.log(`\n${bold("Install gardener agent for AI tools?")}`);
  console.log(dim('Each tool gets a gardener agent that loads from _gs-gardener/.\n'));
  printList();
  console.log(`\n${dim('Enter numbers to toggle (e.g. "1 3"), "all", "none", or press Enter to confirm:')}`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    while (true) {
      let answer;
      try {
        answer = await rl.question("> ");
      } catch {
        console.log("\nAborted.");
        process.exit(0);
      }
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

  return entries.filter((e) => e.selected).map((e) => e.slug);
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
  ${green('install')}    Install 🪴 Gary The Gardener ${dim('(default)')}
  ${green('status')}     Show what's currently installed

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
  npx @pshch/gary-the-gardener                    ${dim('# install with interactive tool selection')}
  npx @pshch/gary-the-gardener --tools cursor      ${dim('# install + Cursor agent')}
  npx @pshch/gary-the-gardener -t cursor,copilot   ${dim('# install + Cursor + Copilot agents')}
  npx @pshch/gary-the-gardener status              ${dim('# check install state')}
  npx @pshch/gary-the-gardener -f                  ${dim('# reinstall / overwrite')}
`);
}
