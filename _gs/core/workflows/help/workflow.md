# Help Workflow

> Get help understanding the garden system and when to use each skill

## Instructions

### Phase 1: Assess Project State

Detect project condition to determine context-aware priorities:

1. **Check AGENTS.md size:**
   - Count lines in {project-root}/AGENTS.md
   - If line_count > 140: context = "oversized"

2. **Check docs/ directory:**
   - If docs/ doesn't exist: context = "needs_structure"

3. **Check wrapper coverage:**
   - Read {project-root}/_gs/core/config.yaml
   - Count how many wrapper_files exist
   - If < 3 wrapper files exist: context = "poor_coverage"

4. **Determine priority order based on context:**
   - **oversized** → top_3 = [gardener, compact, garden], message = "⚠️ Heads up: Your AGENTS.md is getting large ({line_count} lines). Compact is featured today!"
   - **needs_structure** → top_3 = [gardener, scaffold, extend], message = "🌱 I notice you don't have a docs/ directory yet. Let's set that up!"
   - **poor_coverage** → top_3 = [gardener, sync, audit], message = "🔍 Some wrapper files seem to be missing. Let's check coverage!"
   - **healthy** (default) → top_3 = [gardener, audit, garden], message = "🌿 Your garden looks healthy! Here are the maintenance essentials:"

### Phase 2: Understand User's Need

Check what the user needs help with:
1. General overview of garden system?
2. Which skill to use for a specific task?
3. Recommended maintenance cadence?
4. How to get started?

If user asked a specific question (not general help), skip to Phase 5 to answer directly.
Otherwise, proceed to Phase 3 to present condensed help.

### Phase 3: Show Condensed Help

Display condensed help based on context from Phase 1:

```markdown
🪴 **Gardner Gary's Quick Help**

{context_message}

Here are the skills you'll use most often:

## Top 3 Essential Skills

{skill_1_full_details}
{skill_2_full_details}
{skill_3_full_details}

---

## Also Available

{skill_4_oneliner}
{skill_5_oneliner}

---

💡 **That covers the essentials!** Need the full list of all 9 skills?
   Reply with "more" or "show all skills"

🌻 **First time?** Start with `/gardener` and I'll guide you through everything!
```

**Skill Full Detail Template:**
```
### [{/command}] {emoji} {Title}
**When to use:** {brief scenario}
**What it does:** {one sentence}
**Garden metaphor:** {metaphor}
```

**Skill One-liner Template:**
```
- {emoji} `{/command}` - {brief description}
```

**Skill Details by Context:**

**If context = "oversized":**
- Skill 1: /gardener - Interactive menu (always first)
- Skill 2: /garden-compact - Compress AGENTS.md while preserving facts
- Skill 3: /garden-garden - Find and fix doc issues
- Skill 4: /garden-audit - Discover drift
- Skill 5: /garden-extend - Add content layers

**If context = "needs_structure":**
- Skill 1: /gardener - Interactive menu
- Skill 2: /garden-scaffold - Setup docs/ directory structure
- Skill 3: /garden-extend - Add content layers
- Skill 4: /garden-audit - Discover drift
- Skill 5: /garden-references - Manage dependencies

**If context = "poor_coverage":**
- Skill 1: /gardener - Interactive menu
- Skill 2: /garden-sync - Check wrapper file references
- Skill 3: /garden-audit - Discover drift
- Skill 4: /garden-garden - Find and fix doc issues
- Skill 5: /garden-extend - Add content layers

**If context = "healthy" (default):**
- Skill 1: /gardener - Interactive menu
- Skill 2: /garden-audit - Discover drift between docs and code
- Skill 3: /garden-garden - Find and fix doc issues
- Skill 4: /garden-extend - Add content layers
- Skill 5: /garden-references - Manage dependencies

**Full Skill Information:**

**[/gardener] 🪴 Interactive Menu**
- When to use: You're not sure what you need - let me guide you!
- What it does: Opens my interactive menu where you can browse options and I'll explain each task
- Garden metaphor: Think of me as your friendly garden keeper who walks you through everything! 🌿
- One-liner: Interactive menu - let Gary guide you

**[/garden-sync] 🔄 Sync Wrappers**
- When to use: After editing AGENTS.md or adding wrapper files
- What it does: Checks that all wrapper files correctly reference AGENTS.md
- Garden metaphor: Ensuring all your plants are connected to the main water source 💧
- One-liner: Check wrapper file references

**[/garden-audit] 🔍 Audit for Drift**
- When to use: After major code changes, monthly maintenance
- What it does: Discovers drift between documentation and actual code
- Garden metaphor: Inspecting for weeds (outdated docs) and dead branches (removed features) 🐛
- One-liner: Discover drift between docs and code

**[/garden-extend] 🌱 Add Content Layers**
- When to use: When adding new features, establishing coding standards
- What it does: Adds guardrails, golden principles, style guides, or domain knowledge
- Garden metaphor: Planting new seeds - growing your documentation 🌱
- One-liner: Add guardrails, style guides, or domain knowledge

**[/garden-references] 📚 Manage Dependencies**
- When to use: After adding/upgrading major dependencies
- What it does: Fetches llms.txt files for frameworks and libraries
- Garden metaphor: Harvesting knowledge from upstream sources 🥕
- One-liner: Fetch llms.txt files for dependencies

**[/garden-add-tool] 🛠️ Add AI Tool**
- When to use: When adopting a new AI coding tool (Cursor, Copilot, etc.)
- What it does: Generates wrapper file for the new tool
- Garden metaphor: Adding a new gardening tool to your shed 🪴
- One-liner: Generate wrapper for new AI tool

**[/garden-scaffold] 🏗️ Setup docs/ Structure**
- When to use: First-time setup, starting fresh
- What it does: Creates docs/ directory with recommended structure
- Garden metaphor: Preparing the garden bed before planting 🌱
- One-liner: Create docs/ directory structure

**[/garden-garden] 🪴 Doc Gardening**
- When to use: Monthly maintenance, before releases
- What it does: Finds staleness, broken links, orphaned files, coverage gaps
- Garden metaphor: Walking the garden with pruning shears, pulling weeds ✂️🐛
- One-liner: Find and fix documentation issues

**[/garden-compact] ✂️ Compress AGENTS.md**
- When to use: When AGENTS.md exceeds 150 lines
- What it does: Compresses verbosity while preserving all facts
- Garden metaphor: Pruning overgrowth to keep the main tree healthy 🌳
- One-liner: Compress AGENTS.md while preserving facts

### Phase 4: Progressive Disclosure

If user replies with "more", "all", "show all", "complete list", "show all skills", or similar:

Display complete reference:

```markdown
🪴 **Complete Skills Reference**

Here are all 9 maintenance skills available:

### [/gardener] 🪴 Interactive Menu
**When to use:** You're not sure what you need - let me guide you!
**What it does:** Opens my interactive menu where you can browse options and I'll explain each task
**Garden metaphor:** Think of me as your friendly garden keeper who walks you through everything! 🌿

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
**When to use:** When adopting a new AI coding tool (Cursor, Copilot, etc.)
**What it does:** Generates wrapper file for the new tool
**Garden metaphor:** Adding a new gardening tool to your shed 🪴

### [/garden-scaffold] 🏗️ Setup docs/ Structure
**When to use:** First-time setup, starting fresh
**What it does:** Creates docs/ directory with recommended structure
**Garden metaphor:** Preparing the garden bed before planting 🌱

### [/garden-garden] 🪴 Doc Gardening
**When to use:** Monthly maintenance, before releases
**What it does:** Finds staleness, broken links, orphaned files, coverage gaps
**Garden metaphor:** Walking the garden with pruning shears, pulling weeds ✂️🐛

### [/garden-compact] ✂️ Compress AGENTS.md
**When to use:** When AGENTS.md exceeds 150 lines
**What it does:** Compresses verbosity while preserving all facts
**Garden metaphor:** Pruning overgrowth to keep the main tree healthy 🌳

## 🌿 Recommended Maintenance Cadence

**After major code changes:**
- 🔍 `/garden-audit` - catch drift immediately

**Monthly maintenance:**
- 🪴 `/garden-garden` - find and fix documentation issues
- 🔄 `/garden-sync` - verify all wrappers are healthy

**When adding new features:**
- 🌱 `/garden-extend` - document patterns and principles

**When dependencies change:**
- 📚 `/garden-references` - update library documentation

**When AGENTS.md gets too long:**
- ✂️ `/garden-compact` - prune it back to 150 lines

## 🌻 Getting Started

**First time using the garden system?**
1. Start with `/gardener` to see the interactive menu 🪴
2. Run `/garden-scaffold` if you don't have a docs/ directory yet 🏗️
3. Run `/garden-audit` to see the current state 🔍
4. Set a calendar reminder for monthly `/garden-garden` maintenance 📅

**Already familiar?**
- Use individual skills directly for specific tasks
- Use `/gardener` when you want the guided experience

## 💡 Tips

- **Fresh context:** Run each skill in a fresh Claude conversation for best results
- **Report before act:** I always show findings before making changes - review carefully!
- **No information loss:** I never delete facts, only compress verbosity
- **Gardening takes time:** Some tasks (audit, garden) scan extensively - be patient! 🐌
```

Then ask: "🪴 Any other questions? I'm here to help!"

### Phase 5: Answer Specific Questions

If user asked a specific question (not general help):
1. Identify which skill(s) relate to their question
2. Explain when to use it, what it does, and the gardening metaphor
3. Provide an example of the output they can expect
4. Suggest next steps

Example:
```
User: "How do I check if my docs are outdated?"

Gary: 🔍 Great question! That's exactly what `/garden-audit` is for!

**What it does:**
Audit walks through your entire codebase and compares it with your documentation (AGENTS.md, docs/ files). It finds:
- New dependencies not yet documented 🌱
- Removed dependencies still in docs 🍂
- Changed commands, entry points, or architecture 🔄
- Coverage gaps (important code with no docs) 🪨

**When to use:**
- After major code changes
- Monthly maintenance check
- Before releases

**What to expect:**
I'll show you a comprehensive drift report categorizing issues by severity (Critical, High, Medium), then ask if you want me to propose fixes. You review and approve before I make any changes.

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
- If user is lost, guide them to `/gardener` for the interactive experience
- If they're experienced, point them to the specific skill they need
- Keep explanations friendly and approachable - gardening should be fun!
- Use gardening metaphors to make concepts memorable
- Celebrate their interest in maintaining their documentation garden 🌻
