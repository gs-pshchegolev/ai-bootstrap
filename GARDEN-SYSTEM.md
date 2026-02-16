# Garden System

> Maintain AI agent configurations across repositories with 🪴 Gary The Gardener 🪴

## What is it?

The Garden System provides AI agent maintenance for repositories using AGENTS.md configuration:

- **🪴 Gary The Gardener** 🪴 - Interactive Repository Garden Keeper subagent (v1.1.0)
- **10 maintenance skills** - Individual operations for keeping AI configs healthy

The system follows a "gardening" philosophy: documentation needs regular care, pruning, and attention to stay healthy.

## Components

### 🪴 Gary The Gardener (Interactive Subagent)

Your friendly Repository Garden Keeper with a menu-driven interface for all maintenance tasks.

**Invoke:** `/gardener`

### Individual Skills

| Skill | Description |
|-------|-------------|
| `/garden-bootstrap` 🌱 | First-time AI-readiness setup (one-time) |
| `/garden-sync` 🔄 | Sync wrappers with AGENTS.md |
| `/garden-audit` 🔍 | Audit for drift between docs and code |
| `/garden-extend` 🌱 | Add content layers (guardrails, principles, style) |
| `/garden-references` 📚 | Fetch and manage dependency docs (llms.txt) |
| `/garden-add-tool` 🛠️ | Add support for new AI tools |
| `/garden-scaffold` 🏗️ | Set up docs/ knowledge base structure |
| `/garden-maintain` 🪴 | Find and fix documentation issues |
| `/garden-compact` ✂️ | Compress AGENTS.md while preserving facts |
| `/garden-help` 💡 | Get help understanding when to use each skill |

## Quick Start

1. **Install the system** in your repository (see [Installation Guide](GARDEN-INSTALLATION.md))
2. **Test it works:** `/garden-agent-gardener`
3. **Use the gardener** for interactive maintenance or invoke skills directly

### Example Session

```bash
# Interactive (recommended for exploration)
/garden-agent-gardener

# Direct skill invocation (quick tasks)
/garden-audit
/garden-sync
```

## When to Use Garden Maintenance

| Scenario | Recommended Skill |
|----------|-------------------|
| First-time setup (no AGENTS.md) | `/garden-bootstrap` |
| After major code changes | `/garden-audit` |
| Monthly health check | `/garden-maintain` |
| Adding new features | `/garden-extend` |
| Dependencies changed | `/garden-references` |
| AGENTS.md too long (>150 lines) | `/garden-compact` |
| Supporting new AI tool | `/garden-add-tool` |

## Documentation

- **[Installation Guide](GARDEN-INSTALLATION.md)** - Setup in target repositories
- **[Usage Guide](GARDEN-GUIDE.md)** - Usage patterns, maintenance, troubleshooting, FAQ

## Version

**Current:** 1.1.0

Check version: `cat _gs-gardener/VERSION`

See [CHANGELOG](_gs-gardener/CHANGELOG.md) for version history.

---

🪴 Happy gardening!
