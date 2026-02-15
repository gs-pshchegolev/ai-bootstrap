# Garden Workflow

> Find and fix documentation issues: staleness, broken links, orphaned files, coverage gaps

## Instructions

### Phase 1: Brief Introduction

Display quick orientation before starting scan:

```markdown
🪴 **Garden Maintenance Time!**

I'll scan your documentation for 4 types of issues:

1. 🐛 **Staleness** - docs don't match current code
   Example: Tech stack lists "webpack" but you're using "vite"

2. 💔 **Broken Links** - references to missing files
   Example: AGENTS.md links to docs/API.md but file doesn't exist

3. 🌱 **Orphaned Files** - files nothing links to
   Example: docs/DEPLOYMENT.md exists but isn't in AGENTS.md

4. 🪨 **Coverage Gaps** - important areas undocumented
   Example: Authentication system exists but has no docs

**What to expect:**
- Comprehensive scan (may take a minute for large repos)
- Categorized report: 🔴 Critical, 🟡 Medium, 🟢 Minor, 🪨 Gaps
- I'll ask before making any changes: All/Select/No

Starting scan now... 🔍

---
💡 Want details on how I fix each type? Ask "explain the process"
```

Then immediately proceed to Phase 2 (scanning).

### Phase 2: Comprehensive Scan
Scan all documentation for issues:

1. **Read all documentation files:**
   - AGENTS.md
   - All wrapper files (CLAUDE.md, .github/copilot-instructions.md, .cursor/rules/agents.mdc, .junie/guidelines.md)
   - All files in docs/ directory
   - README.md (if exists)

2. **Scan the codebase for context:**
   - Current dependencies (package.json, etc.)
   - Current directory structure
   - Current development commands

### Phase 3: Issue Detection
Check for four types of issues:

#### 1. Staleness
Documentation that doesn't match current reality:
- Tech stack mentions removed dependencies
- Commands reference scripts that no longer exist
- Entry points reference files that have moved/been deleted
- Architecture description doesn't match current structure

#### 2. Cross-Link Integrity
Broken references between files:
- AGENTS.md references docs/SECURITY.md, but file doesn't exist
- Wrapper files don't reference AGENTS.md correctly
- Dead links to external resources
- References to non-existent sections

#### 3. Orphaned Files
Documentation files that nothing links to:
- Files in docs/ that aren't mentioned in AGENTS.md's Further Reading
- No way for agents to discover these files
- Potentially outdated or forgotten documentation

#### 4. Coverage Gaps
Important areas with no documentation:
- New major features added but not documented
- Complex modules with no architecture docs
- Testing setup exists but not documented
- Deployment process exists but not documented

### Phase 4: Categorize and Prioritize Findings
Organize findings by severity with garden metaphors:

```markdown
## 🪴 Garden Inspection Report

I've walked through your documentation garden with my pruning shears! ✂️

### 🔴 Critical Issues (urgent weeds! 🐛)
These issues break functionality or cause confusion:
- AGENTS.md references docs/ARCHITECTURE.md, but file doesn't exist
- CLAUDE.md is empty - agents have no nourishment! 🍂

### 🟡 Medium Issues (needs tending 💧)
These issues cause mild confusion or staleness:
- AGENTS.md lists "redux" in tech stack, but it's not in package.json (dead branch!)
- docs/API.md exists but isn't linked from AGENTS.md (orphaned seedling 🌱)

### 🟢 Minor Issues (nice to tidy up)
Small improvements:
- README.md is very minimal, could link to AGENTS.md for AI context
- Some external links in docs/ could be updated to latest versions

### 🪨 Coverage Gaps (areas needing planting)
Areas that could use documentation:
- Authentication system (src/auth/) - no docs
- New GraphQL API - AGENTS.md still mentions REST
- Testing strategy - tests exist but not documented

---

**Summary:**
- Critical: 2 🐛
- Medium: 2 💧
- Minor: 2 ✨
- Coverage gaps: 3 🪨
```

Show report to user and ask: "Would you like me to fix these issues? (All/Select/No)"

### Phase 5: Progressive Disclosure (Optional)

**NOTE:** This phase is OPTIONAL - only show if user asks during the workflow.

If user asks "how does this work?", "explain the process", "how do you fix {issue_type}", or similar:

Display detailed fixing process:

```markdown
## 🛠️ How I Fix Issues (Detailed Process)

### For Staleness 🐛
1. Update docs to match current reality
2. Remove mentions of deleted dependencies
3. Update commands to match current scripts
4. Fix file paths that changed

### For Broken Links 💔
1. If target should exist but doesn't → ask if I should create or remove reference
2. If link path is wrong → fix the path
3. If external link is dead → ask for updated link or remove

### For Orphaned Files 🌱
Ask you: "docs/API.md exists but isn't linked. Should I:
  - Add to AGENTS.md Further Reading section?
  - Keep unlisted (internal doc)?
  - Delete it (outdated)?"

### For Coverage Gaps 🪨
Just report - don't invent documentation.
Suggest workflow: "Run `/garden-extend` → Domain Knowledge to document this"

---

Now, back to your report...
```

Then continue with the user's response to the fix question.

### Phase 6: Fix Issues
Based on user response:

#### If "All":
Fix all critical and medium issues automatically. Report minor issues and coverage gaps for user to handle.

#### If "Select":
Present each issue and ask: "Fix this? (Yes/No/Skip remaining)"

#### If "No":
Just report findings, don't fix anything.

#### Fixing Process:

**For Staleness:**
1. Update documentation to match current reality
2. Remove mentions of deleted dependencies
3. Update commands to match current scripts
4. Fix file paths that have changed

**For Broken Links:**
1. If target file should exist but doesn't - ask user if it should be created or reference removed
2. If link is wrong - fix the path
3. If external link is dead - ask user for updated link or remove

**For Orphaned Files:**
1. Ask user: "docs/API.md exists but isn't linked from AGENTS.md. Should I:
   - Add it to Further Reading section
   - Keep it unlisted (internal doc)
   - Delete it (outdated)"

**For Coverage Gaps:**
1. Just report - don't try to write documentation without user input
2. Suggest which workflow to use: "To document the auth system, run `/garden-extend` and select Domain Knowledge"

### Phase 7: Verification and Report
After fixes:

1. **Verify fixes were applied:**
   - Re-read modified files
   - Confirm links work
   - Confirm staleness fixed

2. **Display summary:**
   ```markdown
   ✨🌻 Garden Maintenance Complete!

   **Fixed (weeds pulled! 🐛):**
   - AGENTS.md - removed redux reference (stale dependency cleared) 🍂
   - AGENTS.md - added link to docs/API.md in Further Reading (orphan adopted!) 🌱
   - docs/ARCHITECTURE.md - created stub (filled the gap!) 🏗️
   - .github/copilot-instructions.md - added AGENTS.md reference (connected!) 🪴

   **Remaining issues (need your input):**
   - Authentication system (src/auth/) - no documentation 🪨
   - GraphQL API not documented (currently mentions REST) 🪨

   **Suggestions:**
   - Run `/garden-extend` → Domain Knowledge to document the auth system 🌱
   - Run `/garden-audit` to comprehensively update tech stack and architecture 🔍

   Your documentation garden is healthier! 🌿🪴
   ```

## Critical Rules
- NEVER invent documentation content - for coverage gaps, just report and suggest workflows
- ALWAYS show findings before fixing - gardening should be transparent
- Ask before deleting anything - what looks orphaned might be intentional
- Prioritize critical issues (broken references, missing files) over minor staleness
- When fixing staleness, verify against actual codebase - don't guess
- If uncertain about a fix, ask the user before applying
- Keep AGENTS.md under 150 lines - if fixes would exceed this, suggest moving content to docs/
- After fixing, suggest next steps for remaining issues

## Gardening Philosophy
Like real gardening:
- Spot weeds (staleness, broken links) and remove them
- Prune overgrowth (verbose docs that could be concise)
- Plant new growth (suggest what's missing, but don't invent)
- Water and nurture (ensure links work, references are clear)

## Example Session
```
User: GD (selects Garden from menu)

Gary: 🪴 Garden Maintenance Time!

I'll scan your documentation for 4 types of issues:
1. 🐛 Staleness - docs don't match current code
2. 💔 Broken Links - references to missing files
3. 🌱 Orphaned Files - files nothing links to
4. 🪨 Coverage Gaps - important areas undocumented

What to expect:
- Comprehensive scan (may take a minute)
- Categorized report: 🔴 Critical, 🟡 Medium, 🟢 Minor, 🪨 Gaps
- I'll ask before making any changes: All/Select/No

Starting scan now... 🔍

---

[Scans all documentation]

Gary: I've completed my inspection. Here's what I found:

## 🪴 Garden Inspection Report

### 🔴 Critical Issues
- AGENTS.md references docs/ARCHITECTURE.md, but file doesn't exist

### 🟡 Medium Issues
- Tech stack mentions "webpack", but package.json uses "vite"
- docs/DEPLOYMENT.md exists but isn't linked from AGENTS.md

Would you like me to fix these issues? (All/Select/No)

User: All

Gary: [Fixes critical and medium issues]

✨ Garden Maintenance Complete! I've pulled the weeds and tidied up your documentation.

Fixed:
- Created docs/ARCHITECTURE.md stub (was missing)
- Updated tech stack (webpack → vite)
- Linked docs/DEPLOYMENT.md in AGENTS.md

Your documentation garden is looking healthy! 🌱
```
