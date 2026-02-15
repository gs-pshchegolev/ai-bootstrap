# Help Workflow

> Get help understanding the garden system and when to use each skill

## Instructions

### Phase 1: Quick Bootstrap Check (Fast - Single File Check)

Check ONLY for AGENTS.md existence:

1. Check if `{project-root}/AGENTS.md` exists
   - If **missing**: context = "no_bootstrap"
   - If **exists**: context = "ready"

### Phase 2: Show Instant Help

#### If context = "no_bootstrap":

Display bootstrap-first message:

```markdown
🪴 **Welcome to the Garden System!**

I notice this repository doesn't have an `AGENTS.md` file yet. This is the
source of truth for AI agent configuration - think of it as the main trunk
of your documentation tree! 🌳

### First Step: Run Bootstrap

Run `/garden-bootstrap` to set up AI agent configuration:

- **Creates AGENTS.md** - Source of truth (table of contents)
- **Creates wrapper files** - CLAUDE.md, .github/copilot-instructions.md, .cursor/rules/agents.mdc, etc.
- **Sets up docs/** - Knowledge base structure
- **Takes 5-10 minutes** - Thorough repository discovery

### What Happens During Bootstrap?

1. **Phase 1: Discovery** - I'll investigate your repository (tech stack, structure, commands)
2. **Confirmation** - You review my findings before I generate anything
3. **Phase 2: Generate Files** - I create all AI config files
4. **Verification** - See coverage tracker showing what was created

### After Bootstrap

Once AGENTS.md exists, come back to `/garden-help` to see all maintenance
commands for keeping your documentation garden healthy! 🌱

---

💡 **Questions about bootstrap?** Ask me anything! I'm here to help.
```

STOP and WAIT for user questions.

---

#### If context = "ready":

Display instant help with top 5 commands + special options:

```markdown
🪴 **Garden System Quick Help**

Here are the 5 commands you'll use most often:

### 1. [/garden-agent-gardener] 🪴 Interactive Menu
**When to use:** Not sure what you need? Let Gary guide you!
**What it does:** Opens interactive menu with all maintenance options
**Garden metaphor:** Your friendly garden keeper who walks you through everything 🌿

### 2. [/garden-audit] 🔍 Audit for Drift
**When to use:** After major code changes, monthly maintenance
**What it does:** Discovers drift between documentation and actual code
**Garden metaphor:** Inspecting for weeds (outdated docs) and dead branches 🐛

### 3. [/garden-maintain] 🪴 Doc Maintenance
**When to use:** Monthly maintenance, before releases
**What it does:** Finds staleness, broken links, orphaned files, coverage gaps
**Garden metaphor:** Walking the garden with pruning shears ✂️

### 4. [/garden-extend] 🌱 Add Content Layers
**When to use:** When adding new features, establishing coding standards
**What it does:** Adds guardrails, golden principles, style guides, domain knowledge
**Garden metaphor:** Planting new seeds - growing your documentation 🌱

### 5. [/garden-sync] 🔄 Sync Wrappers
**When to use:** After editing AGENTS.md or adding wrapper files
**What it does:** Checks that all wrapper files correctly reference AGENTS.md
**Garden metaphor:** Ensuring all plants are connected to the main water source 💧

---

### Special Options:

**[6] 🎯 What should I do next?**
Let me check your repository and suggest the most relevant action right now.

**[7] 📚 Show all 9 commands**
See complete reference with all maintenance skills and recommended cadence.

---

💡 **First time?** Start with `/garden-agent-gardener` for the guided experience!
```

STOP and WAIT for user input.

### Phase 3: Handle User Selection

If user selects **option 6** ("What should I do next?"):
- Proceed to **Phase 4: Contextual Analysis**

If user selects **option 7** ("Show all"):
- Proceed to **Phase 5: Complete Reference**

If user asks a **specific question**:
- Jump to **Phase 6: Answer Specific Questions**

If user wants to invoke a specific command:
- Provide the command and wish them happy gardening! 🪴

### Phase 4: Contextual Analysis (On-Demand Only)

**Only runs if user selects option 6** - performs intelligent checks to suggest next action:

1. **Check AGENTS.md size:**
   - Count lines in `{project-root}/AGENTS.md`
   - If > 140 lines: context = "oversized"
   - Continue to step 2

2. **Check docs/ directory:**
   - Check if `{project-root}/docs/` exists
   - If doesn't exist: context = "needs_structure"
   - Continue to step 3

3. **Check wrapper coverage:**
   - Check existence of these files:
     - `{project-root}/CLAUDE.md`
     - `{project-root}/.github/copilot-instructions.md`
     - `{project-root}/.cursor/rules/agents.mdc`
     - `{project-root}/.junie/guidelines.md`
   - Count how many exist
   - If < 3 exist: context = "poor_coverage"
   - Continue to step 4

4. **Default:** context = "healthy"

Display contextual recommendation:

#### If context = "oversized":
```markdown
🎯 **Contextual Recommendation**

Your AGENTS.md has **{line_count} lines** (target: <150 lines). Time to prune! ✂️

**Why this matters:**
AGENTS.md should be a compact table of contents, not an encyclopedia. When it grows
too large, AI tools take longer to process it and may miss important details.

**Suggested Action:** `/garden-compact`

This will compress your AGENTS.md by:
- Moving detailed content to docs/ directory
- Removing verbosity while preserving all facts
- Bringing you back to ~150 lines
- Maintaining all important information

**Alternative Options:**
- `/garden-extend` - Move content layers (guardrails, principles) to docs/
- `/garden-audit` - Check if any content is outdated and can be removed

Want to run compact now? Type `/garden-compact` 🌳
```

#### If context = "needs_structure":
```markdown
🎯 **Contextual Recommendation**

You don't have a `docs/` directory yet. Let's set up the knowledge base! 🏗️

**Why this matters:**
The docs/ directory is where detailed documentation lives. AGENTS.md points to it,
creating a clean separation: AGENTS.md = table of contents, docs/ = deep content.

**Suggested Action:** `/garden-scaffold`

This will create:
- `docs/ARCHITECTURE.md` - System design and key patterns
- `docs/references/` - Dependency documentation (llms.txt files)
- `docs/core-beliefs.md` - Coding principles and conventions
- Additional recommended structure based on your project type

**Alternative Options:**
- `/garden-extend` - Manually add specific content layers
- `/garden-audit` - See what content gaps exist first

Want to run scaffold now? Type `/garden-scaffold` 🌱
```

#### If context = "poor_coverage":
```markdown
🎯 **Contextual Recommendation**

Only **{count}/4** wrapper files exist. Let's check coverage! 🔍

**Why this matters:**
Wrapper files (CLAUDE.md, .github/copilot-instructions.md, etc.) allow different
AI tools to find your AGENTS.md. Missing wrappers mean some tools won't know your
project's configuration.

**Suggested Action:** `/garden-sync`

This will:
- Verify existing wrapper files reference AGENTS.md correctly
- Identify missing wrappers
- Report which AI tools won't work without them
- Optionally generate missing wrappers

**Wrapper Coverage Status:**
- CLAUDE.md: {status}
- .github/copilot-instructions.md: {status}
- .cursor/rules/agents.mdc: {status}
- .junie/guidelines.md: {status}

Want to run sync now? Type `/garden-sync` 💧
```

#### If context = "healthy":
```markdown
🎯 **Contextual Recommendation**

Your garden looks healthy! 🌿 Time for routine maintenance.

**Why this matters:**
Even healthy gardens need regular care. Code changes constantly, and documentation
needs to stay synchronized. An audit catches drift before it becomes a problem.

**Suggested Action:** `/garden-audit`

This will:
- Compare your docs with actual code
- Find new dependencies not yet documented
- Identify removed features still in docs
- Discover coverage gaps (code with no docs)
- Report findings by severity (Critical, High, Medium)

**When was your last audit?**
- **Recent (< 1 week):** You're in great shape! Consider `/garden-extend` to add more guardrails.
- **A while ago (> 1 month):** Definitely run `/garden-audit` to catch drift.
- **Never:** Perfect time to start! See what's out of sync.

Want to run audit now? Type `/garden-audit` 🐛
```

### Phase 5: Complete Reference (Progressive Disclosure)

Display complete reference with all 9 skills:

```markdown
🪴 **Complete Skills Reference**

Here are all 9 maintenance skills available:

### [/garden-agent-gardener] 🪴 Interactive Menu
**When to use:** You're not sure what you need - let me guide you!
**What it does:** Opens my interactive menu where you can browse options and I'll explain each task
**Garden metaphor:** Think of me as your friendly garden keeper who walks you through everything! 🌿

### [/garden-bootstrap] 🌱 First-Time Setup
**When to use:** Fresh repository without AGENTS.md (one-time only)
**What it does:** Discovers your repository and generates all AI configuration files
**Garden metaphor:** Preparing the soil and planting the first seeds 🌱

### [/garden-sync] 🔄 Sync Wrappers
**When to use:** After editing AGENTS.md or adding wrapper files
**What it does:** Checks that all wrapper files correctly reference AGENTS.md
**Garden metaphor:** Ensuring all your plants are connected to the main water source 💧

### [/garden-audit] 🔍 Audit for Drift
**When to use:** After major code changes, monthly maintenance
**What it does:** Discovers drift between documentation and actual code
**Garden metaphor:** Inspecting for weeds (outdated docs) and dead branches (removed features) 🐛

### [/garden-extend] 🌱 Add Content Layers
**When to use:** When adding new features, establishing coding standards
**What it does:** Adds guardrails, golden principles, style guides, or domain knowledge
**Garden metaphor:** Planting new seeds - growing your documentation 🌱

### [/garden-references] 📚 Manage Dependencies
**When to use:** After adding/upgrading major dependencies
**What it does:** Fetches llms.txt files for frameworks and libraries
**Garden metaphor:** Harvesting knowledge from upstream sources 🥕

### [/garden-add-tool] 🛠️ Add AI Tool
**When to use:** When adopting a new AI coding tool (Cursor, Copilot, Windsurf, etc.)
**What it does:** Generates wrapper file for the new tool
**Garden metaphor:** Adding a new gardening tool to your shed 🪴

### [/garden-scaffold] 🏗️ Setup docs/ Structure
**When to use:** First-time setup, starting fresh
**What it does:** Creates docs/ directory with recommended structure
**Garden metaphor:** Preparing the garden bed before planting 🌱

### [/garden-maintain] 🪴 Doc Maintenance
**When to use:** Monthly maintenance, before releases
**What it does:** Finds staleness, broken links, orphaned files, coverage gaps
**Garden metaphor:** Walking the garden with pruning shears, pulling weeds ✂️🐛

### [/garden-compact] ✂️ Compress AGENTS.md
**When to use:** When AGENTS.md exceeds 150 lines
**What it does:** Compresses verbosity while preserving all facts
**Garden metaphor:** Pruning overgrowth to keep the main tree healthy 🌳

---

## 🌿 Recommended Maintenance Cadence

**After major code changes:**
- 🔍 `/garden-audit` - catch drift immediately

**Weekly check-in:**
- 🔄 `/garden-sync` - verify all wrappers are healthy

**Monthly maintenance:**
- 🪴 `/garden-maintain` - find and fix documentation issues
- 🔍 `/garden-audit` - comprehensive drift check

**When adding new features:**
- 🌱 `/garden-extend` - document patterns and principles

**When dependencies change:**
- 📚 `/garden-references` - update library documentation

**When AGENTS.md gets too long:**
- ✂️ `/garden-compact` - prune it back to 150 lines

---

## 🌻 Getting Started

**First time using the garden system?**
1. Start with `/garden-agent-gardener` to see the interactive menu 🪴
2. Run `/garden-scaffold` if you don't have a docs/ directory yet 🏗️
3. Run `/garden-audit` to see the current state 🔍
4. Set a calendar reminder for monthly `/garden-maintain` maintenance 📅

**Already familiar?**
- Use individual skills directly for specific tasks
- Use `/garden-agent-gardener` when you want the guided experience
- Use `/garden-help` option 6 for contextual suggestions

---

## 💡 Tips

- **Fresh context:** Run each skill in a fresh Claude conversation for best results
- **Report before act:** I always show findings before making changes - review carefully!
- **No information loss:** I never delete facts, only compress verbosity
- **Gardening takes time:** Some tasks (audit, maintain) scan extensively - be patient! 🐌
- **Version tracking:** Check `_gs-gardener/VERSION` to see which garden system version you're running
```

Then ask: "🪴 Any other questions? I'm here to help!"

### Phase 6: Answer Specific Questions

If user asked a specific question (not general help):

1. Identify which skill(s) relate to their question
2. Explain when to use it, what it does, and the gardening metaphor
3. Provide an example of the output they can expect
4. Suggest next steps

**Example:**
```
User: "How do I check if my docs are outdated?"

Gary: 🔍 Great question! That's exactly what `/garden-audit` is for!

**What it does:**
Audit walks through your entire codebase and compares it with your documentation
(AGENTS.md, docs/ files). It finds:
- New dependencies not yet documented 🌱
- Removed dependencies still in docs 🍂
- Changed commands, entry points, or architecture 🔄
- Coverage gaps (important code with no docs) 🪨

**When to use:**
- After major code changes
- Monthly maintenance check
- Before releases

**What to expect:**
I'll show you a comprehensive drift report categorizing issues by severity
(Critical, High, Medium), then ask if you want me to propose fixes. You review
and approve before I make any changes.

**Example output:**
```
## 🔍 Audit Report

### 🌱 Tech Stack Changes (new growth!)
#### New Dependencies (not yet documented)
- `react-query` v5.0.0 - sprouted in package.json
...
```

Want me to run an audit now? Just say "Yes" or run `/garden-audit`! 🪴
```

## Critical Rules

- ALWAYS use garden emoji generously 🪴🌱🌿
- If user is lost, guide them to `/garden-agent-gardener` for the interactive experience
- If they're experienced, point them to the specific skill they need
- Keep explanations friendly and approachable - gardening should be fun!
- Use gardening metaphors to make concepts memorable
- Celebrate their interest in maintaining their documentation garden 🌻
- For "no_bootstrap" context: Clearly explain bootstrap is required first
- For option 6 (contextual): Defer ALL heavy I/O checks until this point
- Show {line_count}, {count}, and {status} when performing contextual analysis
