# Coverage Status Template

Use this template to display the garden health status to users.

## 🌱 Garden Health Status

| Category | File | Status |
|----------|------|--------|
| Source of Truth | AGENTS.md | {STATUS} |
| Claude Code | CLAUDE.md | {STATUS} |
| GitHub Copilot | .github/copilot-instructions.md | {STATUS} |
| Cursor | .cursor/rules/agents.mdc | {STATUS} |
| JetBrains Junie | .junie/guidelines.md | {STATUS} |
| Security | .aiignore | {STATUS} |

**Status Legend:**
- ✅ = healthy (exists and has content)
- 🔲 = missing (file doesn't exist)
- ⚠️ = needs attention (empty or outdated)

## How to Determine Status

1. **Check if file exists** - use Read tool or Glob
2. **Check if file has content** - if exists, read and verify not empty
3. **For wrapper files** - verify they reference AGENTS.md
4. **For AGENTS.md** - verify it has substantive content (not just a stub)
5. **For .aiignore** - verify it has security patterns

## Status Assignment Rules

- ✅ **Healthy**: File exists, has content, references correct (for wrappers)
- 🔲 **Missing**: File doesn't exist
- ⚠️ **Needs Attention**: File exists but is empty, or wrapper doesn't reference AGENTS.md correctly
