# Garden System

> Maintain AI agent configurations across repositories with Gardner Gary 🪴

## What is it?

The Garden System provides AI agent maintenance for repositories using AGENTS.md configuration:

- **Gardner Gary** 🪴 - Interactive Repository Garden Keeper subagent (v1.1.0)
- **10 maintenance skills** - Individual operations for keeping AI configs healthy

The system follows a "gardening" philosophy: documentation needs regular care, pruning, and attention to stay healthy.

## Components

### Gardner Gary (Interactive Subagent)

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
2. **Test it works:** `claude /gardener`
3. **Use the gardener** for interactive maintenance or invoke skills directly

### Example Session

```bash
# Interactive (recommended for exploration)
claude /gardener

# Direct skill invocation (quick tasks)
claude /garden-audit
claude /garden-sync
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

Check version: `cat _gs/VERSION`

See [CHANGELOG](_gs/CHANGELOG.md) for version history.

---

🪴 Happy gardening!
