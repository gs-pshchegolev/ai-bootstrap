# References Workflow

> Fetch and manage dependency reference documentation (llms.txt files)

## Instructions

### Phase 1: Discovery
1. **Identify project dependencies:**
   - Check package.json (Node.js) for dependencies
   - Check Cargo.toml (Rust) for dependencies
   - Check pyproject.toml or requirements.txt (Python) for dependencies
   - Check go.mod (Go) for dependencies
   - Check composer.json (PHP) for dependencies

2. **Focus on key frameworks and libraries:**
   - Not every dependency needs documentation
   - Prioritize: frameworks, ORMs, major libraries (React, Next.js, Django, etc.)
   - Skip: utilities, tiny packages, internal packages

3. **Check existing references:**
   - List files in docs/references/ (if directory exists)
   - Note which dependencies already have reference docs

### Phase 2: Check for llms.txt Availability
For each key dependency identified:

1. **Check if the project publishes llms.txt or AI-optimized docs:**
   - Look for {package-website}/llms.txt
   - Look for {package-docs-site}/llms.txt or /ai.txt
   - Check package README for AI documentation links
   - Example: https://nextjs.org/llms.txt

2. **Create a report:**
   ```markdown
   ## Key Dependencies

   | Package | Version | llms.txt Available | URL |
   |---------|---------|-------------------|-----|
   | next | 14.0.0 | ✅ | https://nextjs.org/llms.txt |
   | react | 18.2.0 | ❌ | - |
   | prisma | 5.0.0 | ✅ | https://prisma.io/llms.txt |
   | tailwindcss | 3.3.0 | ❌ | - |
   ```

### Phase 3: Report Findings
Display the report to the user:

```markdown
## 📚 Reference Documentation Report

I've scanned your dependencies and checked for AI-optimized documentation.

### Available References (can be fetched)
- next (14.0.0) - https://nextjs.org/llms.txt
- prisma (5.0.0) - https://prisma.io/llms.txt

### No AI Documentation Found
- react (18.2.0) - no llms.txt available
- tailwindcss (3.3.0) - no llms.txt available

### Already in docs/references/
- next-llms.txt (last updated: 2024-01-15)

Would you like me to fetch and store the available references? (Yes/No)
```

### Phase 4: Fetch and Store
**Only if user approves:**

For each available reference:

1. **Fetch the llms.txt content:**
   - Use WebFetch to retrieve the URL
   - Handle errors gracefully (404, timeout, etc.)

2. **Store in docs/references/:**
   - Create docs/references/ directory if it doesn't exist
   - Save as {package-name}-llms.txt
   - Example: docs/references/next-llms.txt

3. **Add metadata header:**
   ```markdown
   # Next.js Reference Documentation
   # Source: https://nextjs.org/llms.txt
   # Fetched: 2024-02-15
   # Version: 14.0.0

   [original llms.txt content follows]
   ```

4. **Track what was fetched:**
   - Keep a list of successful fetches
   - Note any failures

### Phase 5: Update AGENTS.md
1. **Check if AGENTS.md has a "Further Reading" section**
2. **Add or update the references line:**
   ```markdown
   ## Further Reading
   - `docs/references/` — AI-optimized docs for key dependencies
   ```

3. **Display summary to user:**
   ```markdown
   ✨📚 Reference Documentation Harvested!

   Fetched and stored:
   - docs/references/next-llms.txt (28 KB) 🥕
   - docs/references/prisma-llms.txt (42 KB) 🥕

   Failed to fetch:
   - None

   Updated:
   - AGENTS.md - added/updated references pointer 🌱

   These reference docs are now available to AI agents - fresh knowledge harvested! 🌾🪴
   ```

## Critical Rules
- NEVER fetch documentation for ALL dependencies - only key frameworks/libraries
- Ask user to confirm before fetching (especially if there are many references)
- Handle fetch failures gracefully - network issues, 404s, etc.
- Add metadata to each fetched file (source URL, fetch date, version)
- Don't bloat AGENTS.md - just add a one-line pointer to docs/references/
- If a reference already exists and is recent (< 30 days old), ask user before re-fetching
- Respect rate limits - don't hammer servers with requests
- Store files with clear naming: {package-name}-llms.txt

## Maintenance Note
References should be refreshed periodically (e.g., when dependency versions change). User can re-run this workflow to update references.

## Example Session
```
User: RE (selects References from menu)

Gary: 📚 Let me check your dependencies for AI-optimized documentation...

[Scans package.json and checks for llms.txt]

Gary: I've found reference documentation for 2 of your key dependencies:

## 📚 Reference Documentation Report

### Available References
- next (14.0.0) - https://nextjs.org/llms.txt
- prisma (5.0.0) - https://prisma.io/llms.txt

### No AI Documentation Found
- react (18.2.0)
- tailwindcss (3.3.0)

Would you like me to fetch and store the available references?

User: Yes

Gary: [Fetches and stores files]

✨ Reference Documentation Updated!

I've added 2 reference docs to your garden (70 KB total). These provide AI agents with detailed context about Next.js and Prisma.
```
