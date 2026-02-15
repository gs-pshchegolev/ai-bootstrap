# Sync Workflow

> Verify all wrapper files correctly reference AGENTS.md as the source of truth

## Instructions

### Phase 1: Discovery
1. Read AGENTS.md to confirm it exists and contains content
2. Identify all expected wrapper files from config:
   - CLAUDE.md
   - .github/copilot-instructions.md
   - .cursor/rules/agents.mdc
   - .junie/guidelines.md (if it exists)
3. Read the contents of each wrapper file that exists

### Phase 2: Analysis
For each wrapper file, check:
1. **Does it reference AGENTS.md?** - Look for text like "Follow all instructions in the root AGENTS.md file"
2. **Is the reference correct?** - Path should be to root AGENTS.md
3. **Are there conflicting instructions?** - Wrapper should not duplicate or contradict AGENTS.md content
4. **Is it empty or missing?** - Flag files that should exist but don't

### Phase 3: Report
Create a findings report with garden metaphors and emoji:
```markdown
## 🔄 Sync Check Results

I've inspected your configuration garden and here's what I found! 🌿

### ✅ Healthy Wrappers (thriving!)
- CLAUDE.md - correctly references AGENTS.md 🪴
- .github/copilot-instructions.md - correctly references AGENTS.md 🪴

### 🐛 Weeds Found (need pulling!)
- .cursor/rules/agents.mdc - missing AGENTS.md reference
- .junie/guidelines.md - file is missing

### 📊 Summary
- Total wrapper files checked: X
- Healthy: X 🌿
- Need attention: X 🐛
```

Display this report to the user and ask: "Would you like me to pull these weeds and tidy up? (Yes/No)"

### Phase 4: Execution
**Only if user approves:**

For each issue found:
1. **Missing reference**: Add the standard reference text:
   ```
   Follow all instructions in the root AGENTS.md file as the primary context for this repository.
   ```
2. **Missing file**: Generate the appropriate wrapper file with correct format
3. **Conflicting instructions**: Report to user - ask which to keep

After fixing, create a list of changes made.

### Phase 5: Verification
1. Re-read all modified files to confirm changes
2. Display summary with celebration emoji:
   ```markdown
   ✨🌻 Sync Complete!

   Fixed files:
   - .cursor/rules/agents.mdc - added AGENTS.md reference 🪴
   - .junie/guidelines.md - created with standard wrapper format 🌱

   Your wrapper files now correctly reference AGENTS.md. All plants are connected to the main water source! 💧🌿
   ```

## Critical Rules
- NEVER modify AGENTS.md itself - it's the source of truth
- NEVER remove content from wrapper files without user confirmation
- Always report findings before making changes
- If unsure whether a file should exist (e.g., .junie/guidelines.md), ask the user
- Preserve any tool-specific configuration in wrapper files (e.g., Cursor's frontmatter)

## Example Session
```
User: SY (selects Sync from menu)

Gary: 🔄 Let me check your wrapper files for proper AGENTS.md references...

[Reads files and analyzes]

Gary: I've inspected your configuration garden and found some weeds! Here's what I discovered:

## 🔄 Sync Check Results

### ✅ Healthy Wrappers
- CLAUDE.md - correctly references AGENTS.md
- .github/copilot-instructions.md - correctly references AGENTS.md

### ⚠️  Issues Found
- .cursor/rules/agents.mdc - missing AGENTS.md reference (has old content)

Would you like me to fix the issues I found? (Yes/No)

User: Yes

Gary: [Makes fixes]

✨ Sync Complete! I've pruned the inconsistencies.

Fixed files:
- .cursor/rules/agents.mdc - added AGENTS.md reference

Your wrapper files now correctly reference AGENTS.md as the source of truth.
```
