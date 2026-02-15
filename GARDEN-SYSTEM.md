# Garden System Deployment Guide

> Maintain AI agent configurations across repositories with Gardner Gary 🪴

## What is the Garden System?

The Garden System provides AI agent maintenance capabilities for repositories using AGENTS.md-based configuration. It includes:

- **Gardner Gary v1.0.0** 🪴 - An interactive Repository Garden Keeper subagent with a friendly personality and version display
- **9 maintenance skills** - Individual operations for keeping AI configs healthy (sync, audit, extend, references, add-tool, scaffold, garden, compact, help)

The system follows a "gardening" philosophy: documentation needs regular care, pruning, and attention to stay healthy and thriving.

## Components

### Gardner Gary (Subagent)
Your friendly Repository Garden Keeper who provides an interactive menu for all maintenance tasks. Gary uses gardening metaphors and always reports findings before making changes.

**Invoke with:** `/gardener`

### Skills (Individual Tasks)
- `/garden-sync` 🔄 - Sync wrappers with AGENTS.md
- `/garden-audit` 🔍 - Audit for drift between docs and code
- `/garden-extend` 🌱 - Add content layers (guardrails, golden principles, style, domain)
- `/garden-references` 📚 - Fetch and manage dependency documentation (llms.txt files)
- `/garden-add-tool` 🛠️ - Add support for new AI tools
- `/garden-scaffold` 🏗️ - Set up docs/ knowledge base structure
- `/garden-garden` 🪴 - Find and fix documentation issues
- `/garden-compact` ✂️ - Compress AGENTS.md while preserving facts
- `/garden-help` 💡 - Get help understanding when to use each skill

## How to Initialize in a Target Repository

### Prerequisites

1. **Target repository must have AGENTS.md**
   - If not, run ai-bootstrapper.md first to generate initial configuration

2. **Claude Code CLI installed**
   - The garden system works with Claude Code's skill system

3. **Access to ai-bootstrap repository**
   - Either cloned locally or accessible remotely

### Installation Steps

#### Direct Copy Installation (Recommended)

This is the primary installation method - copies the entire garden system into your repository:

```bash
# From target repository root
cd /path/to/target-repo

# Copy entire garden system source
mkdir -p _gs
cp -r /path/to/ai-bootstrap/_gs/ _gs/

# Copy command files to enable skills
mkdir -p .claude/commands
cp /path/to/ai-bootstrap/.claude/commands/garden-*.md .claude/commands/

# Commit to repository
git add _gs .claude/commands/garden-*.md
git commit -m "feat: add garden system for AI config maintenance"
```

**Advantages:**
- ✅ Fully standalone - no external dependencies
- ✅ Works offline
- ✅ Easy to customize per-repository if needed
- ✅ Simple to understand - all files visible

**Disadvantages:**
- ⚠️ Manual updates required when garden system improves
- ⚠️ Each repo has its own copy (more storage)

#### Alternative: Git Submodule (For Version Tracking)

Use this if you want automatic updates and version tracking:

```bash
# From target repository root
cd /path/to/target-repo

# Add ai-bootstrap as submodule
git submodule add https://github.com/your-org/ai-bootstrap.git _ai-bootstrap
git submodule update --init --recursive

# Create symlink to garden system
ln -s _ai-bootstrap/_gs _gs

# Copy command files
mkdir -p .claude/commands
cp _ai-bootstrap/.claude/commands/garden-*.md .claude/commands/

# Commit
git add .gitmodules _ai-bootstrap _gs .claude/commands/garden-*.md
git commit -m "feat: add garden system via submodule"
```

**Advantages:**
- ✅ Easy updates (just `git submodule update`)
- ✅ Version tracked in meta-repository
- ✅ Consistent across all target repos

**Disadvantages:**
- ⚠️ Requires git submodule knowledge
- ⚠️ More complex setup
- ⚠️ Needs network access for updates

#### Alternative: Symlink (Local Development Only)

Use this only for local development when ai-bootstrap is on the same machine:

```bash
# For local development
cd /path/to/target-repo

# Symlink to garden system source
ln -s /path/to/ai-bootstrap/_gs _gs
mkdir -p .claude/commands
ln -s /path/to/ai-bootstrap/.claude/commands/garden-*.md .claude/commands/
```

**Advantages:**
- ✅ Instant updates (changes to source reflect immediately)
- ✅ No copying needed

**Disadvantages:**
- ⚠️ Only works locally
- ⚠️ Breaks if ai-bootstrap moves
- ⚠️ Can't commit to repo (symlinks)

### Verification

After installation, test the gardener:

```bash
# In target repository
claude /gardener
```

**Expected output:**
```
🪴 Hello! I'm Gardner Gary, your Repository Garden Keeper.

## 🌱 Garden Health Status

| Category | File | Status |
|----------|------|--------|
| Source of Truth | AGENTS.md | ✅ |
| Claude Code | CLAUDE.md | ✅ |
...

## 🛠️  Garden Maintenance Menu

[SY] 🔄 Sync - Check all wrapper files...
[AU] 🔍 Audit - Discover drift...
...
```

If you see this, installation was successful! 🎉

## How to Use the Garden System

### Using the Gardener (Interactive)

The gardener provides a friendly, menu-driven interface:

```bash
claude /gardener
```

Gary will:
1. Show current garden health status
2. Display maintenance menu
3. Wait for your selection
4. Execute the selected task
5. Ask if you want to return to menu

**Example session:**
```
User: /gardener

Gary: 🪴 Hello! I'm Gardner Gary...
[Shows menu]

User: AU (audit)

Gary: 🔍 Let me inspect for drift...
[Runs audit, shows findings]

Gary: Would you like me to fix these issues?

User: Yes

Gary: [Fixes issues]
✨ Audit Complete! Your garden is healthier...

Gary: Would you like to return to the menu?

User: No

Gary: 🪴 Happy gardening! Call me anytime...
```

### Using Individual Skills (Direct)

You can invoke skills directly without the menu:

```bash
# Sync wrappers
claude /garden-sync

# Audit for drift
claude /garden-audit

# Add content layer
claude /garden-extend

# Fetch dependency docs
claude /garden-references

# Add new AI tool wrapper
claude /garden-add-tool

# Setup docs/ structure
claude /garden-scaffold

# Garden documentation
claude /garden-garden

# Compress AGENTS.md
claude /garden-compact
```

This is useful for:
- Quick one-off tasks
- Scripting/automation
- CI/CD integration

### Recommended Maintenance Cadence

**After major code changes:**
- Run `/garden-audit` to catch drift between docs and code

**Monthly maintenance:**
- Run `/garden-garden` to identify staleness, broken links, orphaned files

**When adding new features:**
- Run `/garden-extend` to document patterns, guardrails, or domain knowledge

**When dependencies change:**
- Run `/garden-references` to update llms.txt files for frameworks/libraries

**When AGENTS.md gets too long:**
- Run `/garden-compact` to compress while preserving all facts

**When adding a new AI tool:**
- Run `/garden-add-tool` to generate wrapper file

## How to Update Target Repositories

When the ai-bootstrap meta-repository improves (e.g., Gardner Gary gets new features, workflows are enhanced):

### For Direct Copy Installations

```bash
# From target repository root
cd /path/to/target-repo

# Pull latest ai-bootstrap (if you have it cloned locally)
cd /path/to/ai-bootstrap
git pull origin main

# Return to target repo
cd /path/to/target-repo

# Remove old version
rm -rf _gs
rm .claude/commands/garden-*.md

# Copy new version
cp -r /path/to/ai-bootstrap/_gs/ _gs/
cp /path/to/ai-bootstrap/.claude/commands/garden-*.md .claude/commands/

# Commit the updates
git add _gs .claude/commands
git commit -m "chore: update garden system to latest version"
```

### For Git Submodule Installations

```bash
# From target repository root
cd _ai-bootstrap
git pull origin main
cd ..

# Re-copy command files (in case they changed)
cp _ai-bootstrap/.claude/commands/garden-*.md .claude/commands/

# Commit the submodule update
git add _ai-bootstrap .claude/commands
git commit -m "chore: update garden system from ai-bootstrap"
```

### For Symlink Installations

```bash
# No action needed in target repo - symlink automatically points to latest
# Just pull latest ai-bootstrap:
cd /path/to/ai-bootstrap
git pull origin main
```

## Versioning

The Garden System follows semantic versioning:

- **Major version (X.0.0)** - Breaking changes to workflow interfaces or subagent structure
- **Minor version (0.X.0)** - New skills, subagent features, or workflow enhancements
- **Patch version (0.0.X)** - Bug fixes and improvements

**Check version:**
```bash
cat _gs/VERSION
```

**Current version:** 1.0.0

## Configuration

Each installation includes a config file at `_gs/core/config.yaml`. You can customize:

```yaml
# Project details
project_name: your-repo-name
user_name: Your Name
communication_language: English

# File locations
agents_file: "{project-root}/AGENTS.md"
docs_directory: "{project-root}/docs"

# Constraints
agents_max_lines: 150
```

After changing config, restart the gardener for changes to take effect.

## Troubleshooting

### "Cannot find workflow.md"

**Cause:** `_gs/` directory is missing or incomplete

**Solution:**
1. Verify `_gs/` directory exists in project root
2. Check structure: `_gs/core/workflows/{workflow-name}/workflow.md`
3. If using submodule: `git submodule update --init`
4. If direct copy: Re-copy from ai-bootstrap

### "Gardener doesn't display menu"

**Cause:** Gardener agent file is missing or command file has wrong path

**Solution:**
1. Check `_gs/core/agents/gardener.md` exists
2. Verify `.claude/commands/garden-agent-gardener.md` has correct `{project-root}` path
3. Try invoking directly: `claude @_gs/core/agents/gardener.md`

### "Coverage status shows incorrect files"

**Cause:** Config lists wrong wrapper file paths

**Solution:**
1. Edit `_gs/core/config.yaml`
2. Update `wrapper_files` list with actual paths
3. Re-run: `claude /gardener`

### "Skill not found: gs-sync"

**Cause:** Command files not in `.claude/commands/`

**Solution:**
1. Check `.claude/commands/` directory exists
2. List files: `ls .claude/commands/garden-*.md`
3. Re-copy if missing: `cp /path/to/ai-bootstrap/.claude/commands/garden-*.md .claude/commands/`

### Skills show but workflows fail

**Cause:** `_gs/` directory path is wrong or missing

**Solution:**
1. Check `_gs/` is in project root (same level as `.claude/`)
2. Verify `_gs/core/workflows/` structure exists
3. Check file permissions: `chmod -R u+r _gs/`

## Architecture

### Directory Structure
```
your-repo/
├── _gs/                                   # Garden system source
│   ├── VERSION                            # Version file
│   ├── core/
│   │   ├── config.yaml                    # Configuration
│   │   ├── agents/
│   │   │   └── gardener.md                # Gardner Gary definition
│   │   └── workflows/
│   │       ├── sync/workflow.md
│   │       ├── audit/workflow.md
│   │       ├── extend/workflow.md
│   │       ├── references/workflow.md
│   │       ├── add-tool/workflow.md
│   │       ├── scaffold/workflow.md
│   │       ├── garden/workflow.md
│   │       └── compact/workflow.md
│   └── _config/
│       └── templates/
│           └── coverage-status-template.md
└── .claude/
    └── commands/
        ├── gs-agent-gardener.md           # Gardener command
        ├── gs-sync.md                     # Skill commands
        ├── gs-audit.md
        ├── gs-extend.md
        ├── gs-references.md
        ├── gs-add-tool.md
        ├── gs-scaffold.md
        ├── gs-garden.md
        └── gs-compact.md
```

### How It Works

1. **User invokes skill:** `claude /gardener` or `claude /garden-sync`
2. **Command file loads:** `.claude/commands/garden-agent-gardener.md` (or skill-specific)
3. **For subagent:** Loads `_gs/core/agents/gardener.md`, displays menu, waits for input
4. **For workflow:** Loads `_gs/core/workflows/{name}/workflow.md`, executes instructions
5. **Workflow reads config:** Gets settings from `_gs/core/config.yaml`
6. **Workflow executes:** Follows phase-by-phase instructions (Discovery, Analysis, Report, Execution, Verification)
7. **Results displayed:** User sees findings, approves changes, sees completion summary

### Design Philosophy

- **Progressive disclosure:** Start simple (menu), reveal complexity as needed
- **Report before acting:** Always show findings before making changes
- **Preserve facts:** Compress verbosity, never lose information
- **Gardening metaphor:** Documentation needs care, pruning, and nurturing
- **Friendly but professional:** Gary is helpful and uses metaphors, but stays focused

## FAQ

**Q: Do I need to use the gardener, or can I use skills directly?**
A: Both work! Gardener is best for exploration/discovery. Skills are best for quick tasks or automation.

**Q: Can I customize the workflows?**
A: Yes! If using direct copy, edit `_gs/core/workflows/{name}/workflow.md` in your repo. If using submodule, fork ai-bootstrap first.

**Q: How often should I run garden maintenance?**
A: Run `/garden-audit` after major changes, `/garden-garden` monthly, and `/garden-extend` when adding significant features.

**Q: Can I use this with tools other than Claude Code?**
A: The workflows are Claude Code specific currently. However, the patterns could be adapted to other AI tools.

**Q: What if my AGENTS.md is already over 150 lines?**
A: Run `/garden-compact` to compress it, or move detailed content to docs/ using `/garden-extend`.

**Q: Can I disable Gary's personality?**
A: Edit `_gs/core/agents/gardener.md` and simplify the `<persona>` section. Remove gardening metaphors from `communication_style`.

**Q: Does this work with monorepos?**
A: Yes! You can install in the root or per-package. Adjust `_gs/core/config.yaml` paths accordingly.

## Support

- **Issues:** Report at ai-bootstrap repository
- **Questions:** Use `/garden-agent-gardener` and ask Gary!
- **Updates:** Watch ai-bootstrap repository for new releases

---

**Version:** 1.0.0
**Last Updated:** 2026-02-15
**Maintained by:** ai-bootstrap project

🪴 Happy gardening!
