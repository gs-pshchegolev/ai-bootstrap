# Audit Workflow

> Discover drift between documentation (AGENTS.md, docs/) and actual codebase

## Instructions

### Phase 1: Discovery
1. **Read documentation files:**
   - AGENTS.md - note claimed tech stack, structure, commands, architecture
   - docs/ARCHITECTURE.md (if exists) - note architectural patterns
   - docs/*.md (any other documentation files)

2. **Scan the actual codebase:**
   - Check package manager files (package.json, Cargo.toml, pyproject.toml, etc.)
   - List actual dependencies vs documented dependencies
   - Check actual directory structure vs documented structure
   - Verify documented commands still exist (in package.json scripts, Makefile, etc.)
   - Check entry points mentioned in docs still exist

### Phase 2: Analysis
Compare documentation vs reality:

1. **Tech Stack Drift:**
   - New dependencies added but not documented?
   - Old dependencies removed but still in docs?
   - Framework versions changed?

2. **Structure Drift:**
   - New directories created but not documented?
   - Important files moved or renamed?
   - Entry points changed?

3. **Command Drift:**
   - Scripts added/removed/renamed in package.json?
   - Makefile targets changed?
   - Build commands different?

4. **Architecture Drift:**
   - New patterns introduced (e.g., new API endpoints)?
   - Database/ORM changes?
   - Infrastructure changes (Docker, K8s configs)?

5. **Coverage Gaps:**
   - Important areas of the codebase with no documentation?
   - Recent major features not mentioned?

### Phase 3: Report
Generate a comprehensive drift report with garden metaphors:

```markdown
## 🔍 Audit Report

I've walked through your garden, checking every corner! Here's what I found:

### 🌱 Tech Stack Changes (new growth!)
#### New Dependencies (not yet documented)
- `react-query` v5.0.0 - sprouted in package.json

#### Removed Dependencies (still in docs - dead branches!)
- `redux` - no longer in package.json 🍂

### 🏗️ Structure Changes (garden layout!)
#### New Directories
- `src/features/` - new feature-based structure (20 files) 🌱

#### Moved Files
- `src/utils/api.ts` → `src/lib/api-client.ts` (transplanted!)

### ⚙️ Command Changes (tools!)
#### New Scripts
- `npm run test:e2e` - new end-to-end tests 🛠️

#### Removed Scripts
- `npm run deploy` - no longer in package.json 🍂

### 🔄 Architecture Changes (major growth!)
- REST API → GraphQL (Apollo Server detected in dependencies) 🦋
- PostgreSQL → MongoDB (mongo connection in src/db/connection.ts) 🦋

### 🪨 Coverage Gaps (areas needing planting!)
- New authentication system (src/auth/) - not documented
- WebSocket server (src/websocket/) - not documented

### 📊 Summary
- Drift items found: 12
- Critical (architecture): 2 🔴
- High (tech stack): 3 🟡
- Medium (structure/commands): 7 🟢
```

Your garden has grown and changed - let's update the docs to match! 🌿

Display report and ask: "Would you like me to propose updates to fix this drift? (Yes/No)"

### Phase 4: Execution
**Only if user approves:**

1. **Generate proposed changes** as diffs/additions to documentation:
   ```markdown
   ## Proposed Updates

   ### AGENTS.md Changes
   - Update Tech Stack section: add react-query, remove redux
   - Update Development commands: add test:e2e, remove deploy
   - Add note about GraphQL API in Architecture section

   ### New Documentation Needed
   - docs/AUTHENTICATION.md - document new auth system
   - docs/WEBSOCKET.md - document WebSocket implementation
   ```

2. Ask user: "Should I apply these changes? (Yes/Apply All/Let me choose)"

3. Based on response:
   - **Yes**: Apply all proposed changes
   - **Apply All**: Same as Yes
   - **Let me choose**: Present each change individually for approval

4. Make approved updates to documentation files

### Phase 5: Verification
1. Re-run discovery (Phase 1) on a subset of changes to verify
2. Display summary:
   ```markdown
   ✨ Audit Complete!

   Documentation updated:
   - AGENTS.md - refreshed tech stack, commands, and architecture
   - docs/AUTHENTICATION.md - created new documentation

   Remaining items (deferred by user):
   - docs/WEBSOCKET.md - user will document later

   Your documentation garden is now healthier and reflects current reality!
   ```

## Critical Rules
- NEVER invent information - only document what you can verify in the codebase
- ALWAYS show proposed changes before applying them
- If unsure whether something is intentional (e.g., dependency removal), ask the user
- Keep AGENTS.md under 150 lines - if additions would exceed this, suggest moving content to docs/
- Flag uncertain findings for user review: "I noticed X, but I'm not sure if this is drift or intentional"
- During Phase 1 discovery, use efficient tools (Glob, Grep, Read) - don't read every file
- Prioritize critical drift (architecture) over minor drift (typos)

## Example Session
```
User: AU (selects Audit from menu)

Gary: 🔍 Time to inspect your documentation garden for drift! Let me compare your docs with the actual codebase...

[Scans codebase and compares with docs]

Gary: I've completed my inspection and found some areas where your documentation has drifted from reality. Here's what I discovered:

[Displays full audit report]

The most significant finding is that you've migrated from a REST API to GraphQL, but AGENTS.md still mentions REST endpoints. Would you like me to propose updates to fix this drift?

User: Yes

Gary: [Generates proposed changes]

Here are the updates I recommend:
[Shows proposed diffs]

Should I apply these changes?

User: Yes

Gary: [Makes updates]

✨ Audit Complete! Your documentation now accurately reflects your codebase. The garden is looking much healthier!
```
