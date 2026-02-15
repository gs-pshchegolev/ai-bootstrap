# Compact Workflow

> Compress AGENTS.md while preserving all facts (target: under 150 lines)

## Instructions

### Phase 1: Analysis
1. **Read AGENTS.md completely:**
   - Count current line count
   - Identify all sections
   - Note which sections are verbose

2. **Analyze each section for compression opportunities:**
   - Redundant content (same info stated multiple ways)
   - Verbose explanations that could be concise
   - Examples that could be shortened
   - Lists that could be collapsed
   - Content that belongs in docs/ instead

3. **Check if docs/ directory exists:**
   - If yes: note which content could be moved there
   - If no: compression must be in-place (can't move content out)

### Phase 2: Create Compression Plan
Generate a plan showing:

```markdown
## ✂️  Compression Analysis

**Current state:**
- AGENTS.md: 187 lines (target: 150 lines)
- Need to reduce: 37 lines

**Compression opportunities:**

### Section: Tech Stack (15 lines → 8 lines)
- Verbose: "This project uses TypeScript as the primary language, which provides..."
- Concise: "TypeScript · Next.js 14 · PostgreSQL · Prisma ORM"
- Savings: 7 lines

### Section: Project Structure (42 lines → 20 lines)
- Current: Deep 4-level directory tree with descriptions
- Suggested: 2-level tree, collapse similar directories
- Savings: 22 lines

### Section: Development (18 lines → 12 lines)
- Current: Full command explanations
- Suggested: Command reference format with brief descriptions
- Savings: 6 lines

### Section: Architecture (32 lines → 25 lines)
- Content about authentication flow is very detailed
- Suggested: Move detailed auth flow to docs/ARCHITECTURE.md, keep summary
- Savings: 7 lines (if docs/ exists)

**Total potential savings: 42 lines (would result in 145 lines ✅)**
```

Show plan to user and ask: "Apply this compression plan? (Yes/No/Let me choose)"

### Phase 3: Compress Content
Based on user response, apply compression strategies:

#### Strategy 1: Condense Verbose Text
Before:
```markdown
## Tech Stack

This project uses TypeScript as the primary programming language, which provides
static typing and better developer experience. The framework is Next.js version 14,
which handles both server-side and client-side rendering. For data persistence,
we use PostgreSQL database with Prisma as the ORM layer.
```

After:
```markdown
## Tech Stack

TypeScript · Next.js 14 · PostgreSQL · Prisma ORM
```

#### Strategy 2: Collapse Directory Trees
Before:
```markdown
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── PasswordReset.tsx
│   ├── dashboard/
│   │   ├── Overview.tsx
│   │   ├── Stats.tsx
│   │   └── Charts.tsx
```

After:
```markdown
src/
├── components/auth/    (login, signup, password reset)
├── components/dashboard/    (overview, stats, charts)
```

#### Strategy 3: Use Compact Command Format
Before:
```markdown
## Development

To install dependencies:
```bash
npm install
```

To start the development server:
```bash
npm run dev
```
This will start the server on http://localhost:3000
```

After:
```markdown
## Development

- `npm install` - Install dependencies
- `npm run dev` - Start dev server (localhost:3000)
- `npm run build` - Production build
- `npm test` - Run tests
```

#### Strategy 4: Move Detailed Content to docs/
If docs/ directory exists:

Before (in AGENTS.md):
```markdown
## Architecture

Authentication Flow:
1. User submits credentials to /api/auth/login
2. Server validates against PostgreSQL users table
3. JWT token generated with 24h expiry
4. Token stored in httpOnly cookie
5. Subsequent requests include token in Authorization header
6. Middleware validates token on protected routes
...
```

After in AGENTS.md:
```markdown
## Architecture

Authentication: JWT-based with httpOnly cookies. See docs/ARCHITECTURE.md for detailed flow.
```

After in docs/ARCHITECTURE.md:
```markdown
## Authentication Flow

Detailed authentication process:
1. User submits credentials to /api/auth/login
2. Server validates against PostgreSQL users table
...
```

### Phase 4: Verify Preservation
Critical: Ensure no facts were lost

1. **Extract all facts from original AGENTS.md:**
   - Tech stack items
   - File paths mentioned
   - Command names
   - Architectural patterns
   - Key conventions

2. **Extract all facts from compressed AGENTS.md:**
   - Same categories

3. **Compare:**
   - Every fact from original should exist in compressed version or moved to docs/
   - Report any missing facts

4. **If facts are missing:**
   - Ask user: "I couldn't preserve these facts while staying under 150 lines:
     - Deployment process details
     - Testing strategy
     Should I: (1) Add them back (exceed 150 lines), (2) Move to docs/ARCHITECTURE.md, (3) Remove them"

### Phase 5: Report Results
```markdown
## ✂️🌿 Compression Complete!

**Results:**
- Before: 187 lines 🌳
- After: 145 lines 🪴
- Reduction: 42 lines (22%) ✂️

**Changes made:**
- Tech Stack: condensed to bullet list (trimmed 7 lines) 🌿
- Project Structure: collapsed directory tree (pruned 22 lines) ✂️
- Development: command reference format (streamlined 6 lines) 🍃
- Architecture: moved auth flow details to docs/ARCHITECTURE.md (transplanted 7 lines) 🌱

**Fact preservation:**
- All original facts preserved ✅
- Moved to docs/: authentication flow details (no information loss!)

**Files modified:**
- AGENTS.md (beautifully pruned) ✂️
- docs/ARCHITECTURE.md (enriched with transplanted content) 🌱

Your AGENTS.md is now beautifully pruned and compact! 🌻🪴
```

## Critical Rules
- NEVER remove facts - only compress verbosity
- ALWAYS verify fact preservation before finalizing
- Ask before moving content to docs/ - user should approve
- If target of 150 lines can't be met without losing facts, ask user for guidance
- Show before/after comparison for major changes
- Report exact line counts (before/after)
- Celebrate compression wins, but prioritize accuracy over brevity
- If docs/ doesn't exist and content needs to move, suggest running `/gs-scaffold` first

## When NOT to Compress
- AGENTS.md is already under 150 lines - report "No compression needed, looking good!"
- AGENTS.md is verbose but all content is factual and non-redundant - suggest moving to docs/ instead of compressing
- User has a custom format they want to keep - respect their structure

## Example Session
```
User: CO (selects Compact from menu)

Gary: ✂️  Let me analyze your AGENTS.md for compression opportunities...

[Reads and analyzes]

Gary: Your AGENTS.md is currently 187 lines (target: 150). I've found ways to reduce it by 42 lines while preserving all facts:

[Shows compression plan]

Total potential savings: 42 lines → 145 lines ✅

Apply this compression plan?

User: Yes

Gary: [Applies compression strategies]

✂️  Compression Complete!

Your AGENTS.md went from 187 → 145 lines (22% reduction). All original facts are preserved - I just trimmed the verbosity. Your documentation is now more scannable! 🌱
```
