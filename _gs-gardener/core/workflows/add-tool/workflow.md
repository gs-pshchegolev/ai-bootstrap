# Add Tool Workflow

> Generate wrapper file for a new AI coding tool

## Instructions

### Phase 1: Discover Existing Tools
1. Check which wrapper files already exist:
   - CLAUDE.md (Claude Code)
   - .github/copilot-instructions.md (GitHub Copilot)
   - .cursor/rules/agents.mdc (Cursor)
   - .junie/guidelines.md (JetBrains Junie)

2. List tools that are missing wrappers

### Phase 2: Ask User Which Tool
Ask the user which tool they want to add:

```markdown
## 🛠️  Which AI tool would you like to add?

**Supported tools:**

1. **Claude Code** - Anthropic's CLI tool
   - Creates: CLAUDE.md

2. **GitHub Copilot** - GitHub's AI pair programmer
   - Creates: .github/copilot-instructions.md

3. **Cursor** - AI-powered code editor
   - Creates: .cursor/rules/agents.mdc

4. **JetBrains Junie** - JetBrains' AI assistant
   - Creates: .junie/guidelines.md

5. **Other** - Custom tool (you'll need to provide details)

Which tool would you like to add? (1-5)
```

If user selects "Other", ask for:
- Tool name
- Configuration file path
- File format (markdown, YAML, JSON, etc.)

### Phase 3: Generate Wrapper File
Based on user's selection, generate the appropriate wrapper file:

#### For Claude Code (CLAUDE.md):
```markdown
# CLAUDE.md

Follow all instructions in the root AGENTS.md file as the primary context for this repository.
```

#### For GitHub Copilot (.github/copilot-instructions.md):
```markdown
# Copilot Instructions

Follow all instructions in the root AGENTS.md file as the primary context for this repository.
```

#### For Cursor (.cursor/rules/agents.mdc):
```markdown
---
description: Primary repository context sourced from AGENTS.md
globs:
alwaysApply: true
---

Follow all instructions in the root AGENTS.md file as the primary context for this repository.
```

Note: Cursor uses MDC format with YAML frontmatter.

#### For JetBrains Junie (.junie/guidelines.md):
```markdown
# Junie Guidelines

Follow all instructions in the root AGENTS.md file as the primary context for this repository.
```

#### For Custom Tool:
Ask user for:
1. Preferred file format
2. Whether the tool supports includes/references
3. Generate appropriate wrapper based on capabilities

### Phase 4: Create File and Directory
1. **Check if directory needs to be created:**
   - .github/ for Copilot
   - .cursor/rules/ for Cursor
   - .junie/ for Junie

2. **Create directory if needed:**
   ```bash
   mkdir -p {directory}
   ```

3. **Write the wrapper file:**
   - Use correct file path
   - Use correct format for the tool

4. **Verify file was created:**
   - Read the file back to confirm

### Phase 5: Report Success
Display summary to user:

```markdown
✨🌱 New Tool Planted in Your Garden!

Created:
- .cursor/rules/agents.mdc (Cursor wrapper file) 🪴

This file references AGENTS.md as the source of truth. Cursor will now have access to your repository context when you use it.

**Next steps:**
1. Open your project in Cursor
2. Cursor should automatically load the context from agents.mdc
3. Test by asking Cursor a question about your project

Your AI tool garden now includes: Claude Code, GitHub Copilot, Cursor 🌻🌻🌻
```

## Critical Rules
- Always reference AGENTS.md - never duplicate content
- Create parent directories if they don't exist
- Use correct file format for each tool (especially Cursor's MDC format)
- After creating the file, verify it exists and has correct content
- Don't create wrapper files that already exist - ask user if they want to overwrite
- Keep wrapper files minimal - just the reference to AGENTS.md and any tool-specific config
- For Cursor, always include frontmatter with `alwaysApply: true`

## Tool-Specific Notes

### Cursor MDC Format
Cursor uses MDC (Markdown with Context) which requires:
- YAML frontmatter with `description` and `alwaysApply`
- `globs:` field (can be empty for "apply to all files")
- Content after frontmatter

### GitHub Copilot
- File must be in .github/ directory
- Uses standard markdown
- GitHub automatically loads copilot-instructions.md when it exists

### JetBrains Junie
- Relatively new tool - format may evolve
- Currently uses markdown in .junie/ directory
- Ask user to confirm JetBrains usage before creating

## Example Session
```
User: AT (selects Add Tool from menu)

Gary: 🛠️  Let's add a new AI tool to your garden!

Currently, you have wrappers for:
- Claude Code (CLAUDE.md)
- GitHub Copilot (.github/copilot-instructions.md)

Which tool would you like to add?

User: 3 (Cursor)

Gary: Perfect! I'll create a Cursor configuration file that references your AGENTS.md.

[Creates .cursor/rules/agents.mdc]

✨ New Tool Added! I've planted Cursor in your AI tool garden.

Created:
- .cursor/rules/agents.mdc

Cursor will now have access to your repository context from AGENTS.md when you open the project.
```
