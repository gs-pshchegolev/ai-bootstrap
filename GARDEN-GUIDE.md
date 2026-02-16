# Garden System Usage Guide

Complete guide for using the Garden System to maintain AI agent configurations.

## Table of Contents

- [Using the Gardener (Interactive)](#using-the-gardener-interactive)
- [Using Individual Skills](#using-individual-skills)
- [Maintenance Schedule](#maintenance-schedule)
- [Architecture](#architecture)
- [FAQ](#faq)
- [Support](#support)

---

## Using the Gardener (Interactive)

The gardener provides a friendly, menu-driven interface for all maintenance tasks.

### Starting the Gardener

```bash
claude /garden-agent-gardener
```

### Interactive Flow

Gary will:
1. Display garden health status
2. Show maintenance menu
3. Wait for your selection
4. Execute the selected task
5. Ask if you want to return to menu

### Example Session

```
User: /garden-agent-gardener

Gary: 🪴 Hello! I'm 🪴 Gary The Gardener (v1.2.0)...
      [Shows health status]
      [Shows maintenance menu]

User: AU

Gary: 🔍 Let me inspect your garden for drift...
      [Runs audit]
      [Shows findings]

      Would you like me to fix these issues?

User: Yes

Gary: [Fixes issues]
      ✨ Audit Complete! Your garden is healthier...

      Would you like to return to the menu?

User: No

Gary: 🪴 Happy gardening! Call me anytime with /garden-agent-gardener
```

### Menu Options

| Code | Skill | When to Use |
|------|-------|-------------|
| `BS` | Bootstrap | First-time setup (only if AGENTS.md missing) |
| `SY` | Sync | Verify wrappers reference AGENTS.md correctly |
| `AU` | Audit | Check for drift after code changes |
| `EX` | Extend | Add new content layers (guardrails, principles) |
| `RE` | References | Update dependency documentation |
| `AT` | Add Tool | Generate wrapper for new AI tool |
| `SC` | Scaffold | Set up docs/ directory structure |
| `GD` | Maintain | Find staleness, broken links, orphans |
| `CO` | Compact | Compress AGENTS.md when too long |
| `MH` | Menu | Redisplay the menu |
| `DA` | Dismiss | Exit and return to normal Claude |

---

## Using Individual Skills

Invoke skills directly without the interactive menu - useful for quick tasks and automation.

### Skill Commands

```bash
# First-time AI-readiness setup (create AGENTS.md)
claude /garden-bootstrap

# Sync wrappers with AGENTS.md
claude /garden-sync

# Audit for drift between docs and code
claude /garden-audit

# Add content layer (guardrails, principles, style, domain)
claude /garden-extend

# Fetch and manage dependency docs (llms.txt)
claude /garden-references

# Add new AI tool wrapper
claude /garden-add-tool

# Setup docs/ directory structure
claude /garden-scaffold

# Garden documentation (staleness, links, orphans)
claude /garden-maintain

# Compress AGENTS.md
claude /garden-compact

# Get help understanding skills
claude /garden-help
```

### When to Use Direct Skills

**Good for:**
- Quick one-off maintenance tasks
- Scripting and automation
- CI/CD integration
- When you know exactly what you need

**Use the gardener instead when:**
- Exploring what maintenance is needed
- Unsure which task to run
- Want guided workflow
- Prefer interactive experience

---

## Maintenance Schedule

### After Major Code Changes

**Run:** `/garden-audit`

Catches drift between documentation and actual code. Verifies that AGENTS.md still reflects reality.

```bash
# After refactoring, adding features, or moving files
claude /garden-audit
```

### Monthly Health Check

**Run:** `/garden-maintain`

Identifies staleness, broken links, orphaned files, and coverage gaps.

```bash
# First of the month routine maintenance
claude /garden-maintain
```

### When Adding Features

**Run:** `/garden-extend`

Documents new patterns, guardrails, golden principles, or domain knowledge.

```bash
# After implementing significant new functionality
claude /garden-extend
```

### When Dependencies Change

**Run:** `/garden-references`

Updates llms.txt files for frameworks and libraries.

```bash
# After upgrading frameworks or adding new dependencies
claude /garden-references
```

### When AGENTS.md Gets Too Long

**Run:** `/garden-compact`

Compresses AGENTS.md to target 150 lines while preserving all facts.

```bash
# When AGENTS.md exceeds 150 lines
claude /garden-compact
```

### When Adding New AI Tool

**Run:** `/garden-add-tool`

Generates wrapper file that properly references AGENTS.md.

```bash
# When integrating Cursor, Aider, or other AI tools
claude /garden-add-tool
```

### Recommended Cadence

| Frequency | Task | Command |
|-----------|------|---------|
| After changes | Audit | `/garden-audit` |
| Weekly | Sync | `/garden-sync` |
| Monthly | Maintain | `/garden-maintain` |
| As needed | Extend | `/garden-extend` |
| As needed | References | `/garden-references` |
| As needed | Compact | `/garden-compact` |

---

## Architecture

### Directory Structure

```
your-repo/
├── _gs-gardener/                                   # Garden system source
│   ├── VERSION                            # Version file (1.2.0)
│   ├── core/
│   │   ├── config.yaml                    # Configuration
│   │   ├── agents/
│   │   │   └── gardener.md                # 🪴 Gary The Gardener definition
│   │   └── workflows/
│   │       ├── add-tool/workflow.md
│   │       ├── audit/workflow.md
│   │       ├── bootstrap/workflow.md
│   │       ├── compact/workflow.md
│   │       ├── extend/workflow.md
│   │       ├── help/workflow.md
│   │       ├── maintain/workflow.md
│   │       ├── references/workflow.md
│   │       ├── scaffold/workflow.md
│   │       └── sync/workflow.md
│   └── _config/
│       └── templates/
│           └── coverage-status-template.md
└── .claude/
    └── commands/
        ├── garden-agent-gardener.md       # Gardener command
        ├── garden-add-tool.md             # Skill commands
        ├── garden-audit.md
        ├── garden-bootstrap.md
        ├── garden-compact.md
        ├── garden-extend.md
        ├── garden-help.md
        ├── garden-maintain.md
        ├── garden-references.md
        ├── garden-scaffold.md
        └── garden-sync.md
```

### How It Works

1. **User invokes skill:** `claude /garden-agent-gardener` or `claude /garden-sync`
2. **Command file loads:** `.claude/commands/garden-agent-gardener.md`
3. **For gardener:** Loads agent definition, displays menu, waits for input
4. **For skill:** Loads workflow from `_gs-gardener/core/workflows/{name}/workflow.md`
5. **Workflow reads config:** Gets settings from `_gs-gardener/core/config.yaml`
6. **Workflow executes:** Follows phases (Discovery → Analysis → Report → Execution → Verification)
7. **Results displayed:** User sees findings, approves changes, sees completion summary

### Workflow Phases

Each skill follows a structured workflow:

1. **Discovery** - Find relevant files and gather context
2. **Analysis** - Examine content and identify issues
3. **Report** - Show findings to user before acting
4. **Execution** - Make approved changes
5. **Verification** - Confirm changes were successful

### Design Philosophy

- **Progressive disclosure** - Start simple (menu), reveal complexity as needed
- **Report before acting** - Always show findings before making changes
- **Preserve facts** - Compress verbosity, never lose information
- **Gardening metaphor** - Documentation needs care, pruning, and nurturing
- **Friendly but professional** - Gary is helpful but stays focused

---

## FAQ

### General Questions

**Q: Do I need to use the gardener, or can I use skills directly?**

A: Both work! Gardener is best for exploration and discovery. Skills are best for quick tasks or automation.

**Q: How often should I run garden maintenance?**

A: Run `/garden-audit` after major changes, `/garden-maintain` monthly, and `/garden-extend` when adding significant features.

**Q: Can I use this with tools other than Claude Code?**

A: The workflows are Claude Code specific currently. However, the patterns could be adapted to other AI tools.

### Customization

**Q: Can I customize the workflows?**

A: Yes! If using direct copy installation, edit `_gs-gardener/core/workflows/{name}/workflow.md` in your repo. If using submodule, fork ai-bootstrap first.

**Q: Can I disable Gary's personality?**

A: Edit `_gs-gardener/core/agents/gardener.md` and simplify the `<persona>` section. Remove gardening metaphors from `communication_style`.

**Q: How do I change the AGENTS.md line limit?**

A: Edit `_gs-gardener/core/config.yaml` and change `agents_max_lines` value (default: 150).

### Technical Questions

**Q: What if my AGENTS.md is already over 150 lines?**

A: Run `/garden-compact` to compress it, or move detailed content to docs/ using `/garden-extend`.

**Q: Does this work with monorepos?**

A: Yes! Install in the root or per-package. Adjust `_gs-gardener/core/config.yaml` paths accordingly.

**Q: Can I run garden skills in CI/CD?**

A: Yes! Skills can be invoked directly. Example:
```bash
# In GitHub Actions
- name: Audit AI config
  run: claude /garden-audit --non-interactive
```

**Q: What happens if workflows conflict with each other?**

A: Workflows are designed to be independent and can run in sequence. Gary ensures only one operation runs at a time.

### Troubleshooting

**Q: Garden system worked before, but now fails - what happened?**

A: Check these common causes:
1. Did you move ai-bootstrap? (Symlink issue)
2. Did you update and forget to re-copy commands? (Submodule issue)
3. Did config.yaml get modified accidentally?

**Q: Can I revert changes made by garden skills?**

A: Yes! All changes are git-tracked. Use `git diff` to review and `git checkout` to revert if needed.

**Q: What if I accidentally deleted _gs-gardener/?**

A: Re-run installation from [GARDEN-INSTALLATION.md](GARDEN-INSTALLATION.md). Your config was in `_gs-gardener/core/config.yaml`, so you may need to reconfigure.

---

## Versioning

The Garden System follows semantic versioning:

- **Major version (X.0.0)** - Breaking changes to workflow interfaces or agent structure
- **Minor version (0.X.0)** - New skills, features, or workflow enhancements
- **Patch version (0.0.X)** - Bug fixes and improvements

**Check version:**
```bash
cat _gs-gardener/VERSION
```

**Current version:** 1.2.0

---

## Support

- **Issues:** Report at [ai-bootstrap repository](https://github.com/your-org/ai-bootstrap/issues)
- **Questions:** Ask 🪴 Gary The Gardener! `claude /garden-agent-gardener`
- **Updates:** Watch ai-bootstrap repository for new releases

---

**Version:** 1.2.0
**Last Updated:** 2026-02-15
**Maintained by:** ai-bootstrap project

🪴 Happy gardening!
