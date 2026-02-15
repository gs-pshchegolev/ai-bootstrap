# Extend Workflow

> Add new content layers to enrich AI agent context (guardrails, golden principles, style, domain knowledge)

## Instructions

### Phase 1: Discovery
1. Read AGENTS.md to understand current content
2. Check which content layers already exist in docs/:
   - docs/SECURITY.md (Guardrails)
   - docs/core-beliefs.md (Golden Principles)
   - docs/STYLE.md or docs/CONVENTIONS.md (Style & Opinions)
   - docs/DOMAIN.md or domain-specific files (Domain Knowledge)
3. Read any existing layer files to understand what's already documented

### Phase 2: Interview User
Ask the user which content layer they want to add:

```markdown
## 🌱 Which content layer would you like to add?

**Available layers:**

1. **Guardrails** - Safety rules, what agents should NOT do, permission boundaries
   - Example: "Never commit secrets", "Always ask before destructive operations"
   - Creates: docs/SECURITY.md

2. **Golden Principles** - Opinionated mechanical rules that keep the codebase agent-legible
   - Example: "Prefer shared utility packages over hand-rolled helpers"
   - Example: "Validate data at boundaries, never probe shapes"
   - Creates: docs/core-beliefs.md

3. **Style & Opinions** - Code conventions, preferred patterns, formatting preferences
   - Example: "Use functional components, avoid class components"
   - Example: "Tests live alongside source files as *.test.ts"
   - Creates: docs/STYLE.md

4. **Domain Knowledge** - Business terminology, API contracts, data models
   - Example: "User lifecycle: guest → registered → verified → premium"
   - Example: "Payment flow integrates with Stripe"
   - Creates: docs/DOMAIN.md or module-specific files

Which layer would you like to add? (1-4)
```

### Phase 3: Guided Interview
Based on user's choice, conduct a focused interview:

#### For Guardrails (Security):
```
Let me help you document safety rules for AI agents in this repository.

1. Are there secrets or credentials agents should never commit?
   - .env files, API keys, certificates?

2. Are there destructive operations that need confirmation?
   - Database migrations, data deletion, force pushes?

3. Are there files or directories agents should avoid modifying?
   - Production configs, deployment scripts, CI/CD workflows?

4. Are there external services that need careful handling?
   - Production APIs, payment gateways, user data?

5. Any compliance or regulatory requirements?
   - GDPR, HIPAA, SOC 2, etc.?
```

#### For Golden Principles:
```
Let me capture the mechanical rules that keep your codebase consistent.

1. Code Organization:
   - How should code be organized? (feature-based, layer-based, etc.)
   - Where should new code go?

2. Dependencies:
   - Preference for libraries vs hand-rolled code?
   - Any banned dependencies?

3. Data Validation:
   - Where should validation happen?
   - How to handle invalid data?

4. Error Handling:
   - Preferred error handling patterns?
   - Logging strategies?

5. Testing:
   - Required test coverage?
   - Test file organization?

These are "always do it this way" rules - what are yours?
```

#### For Style & Opinions:
```
Let me document your code style preferences.

1. Language/Framework Conventions:
   - TypeScript: interfaces vs types?
   - React: functional vs class components?
   - Python: type hints required?

2. File Naming:
   - PascalCase, camelCase, kebab-case?
   - File extension conventions?

3. Code Formatting:
   - Prettier/ESLint/Black config location?
   - Line length, indentation preferences?

4. Comments & Documentation:
   - When are comments required?
   - JSDoc/docstring style?

5. Import Organization:
   - Import order preferences?
   - Absolute vs relative imports?
```

#### For Domain Knowledge:
```
Let me capture business context that agents need to understand.

1. Core Business Concepts:
   - What are the main domain entities? (User, Order, Product, etc.)
   - Key workflows or processes?

2. API Structure:
   - REST, GraphQL, gRPC?
   - Authentication approach?
   - Key endpoints?

3. Data Models:
   - Main database tables/collections?
   - Relationships between entities?

4. Business Rules:
   - User lifecycle states?
   - Payment flows?
   - Permissions/roles?

5. External Integrations:
   - Third-party services (Stripe, SendGrid, etc.)?
   - Webhook handling?
```

### Phase 4: Generate Documentation File
Based on interview responses, create the documentation file:

1. **Structure the content** in clear sections
2. **Use examples** where helpful
3. **Keep it actionable** - agents should know what to do
4. **Link from AGENTS.md** - add a one-line pointer in "Further Reading" section

Example output for docs/SECURITY.md:
```markdown
# Security Guardrails

> Rules for AI agents to follow when working in this repository

## Never Commit Secrets
- .env files (except .env.example)
- API keys, tokens, certificates
- Database credentials
- Private keys

## Destructive Operations Require Confirmation
Always ask user before:
- Dropping database tables
- Deleting user data
- Force pushing to git
- Modifying production configs

## Protected Files
Do not modify without explicit permission:
- .github/workflows/* - CI/CD pipelines
- Dockerfile.production - production container
- terraform/* - infrastructure code

## External Services
- Production API: requires approval before calling
- Stripe: never use live keys in development
- User data: handle according to GDPR requirements

## Compliance
- GDPR: User data must be deletable
- Audit logging required for data access
```

### Phase 5: Update AGENTS.md
Add a reference to the new file in AGENTS.md's "Further Reading" section:

```markdown
## Further Reading
- `docs/SECURITY.md` — security guardrails for AI agents
```

Keep the line short (under 80 chars). Don't bloat AGENTS.md with content - just a pointer.

Display to user:
```markdown
✨🌻 Extended your garden with new content!

Created:
- docs/SECURITY.md - security guardrails (25 lines) 🛡️

Updated:
- AGENTS.md - added pointer in Further Reading section 🌱

Agents working in this repository will now have this context available.
Your garden is flourishing! 🌿🪴
```

## Critical Rules
- Keep AGENTS.md changes minimal - just add a one-line pointer, don't copy content
- Ask focused questions - don't overwhelm the user with too many questions at once
- If user doesn't know an answer, skip that section - better to have partial documentation than invented content
- Use examples liberally in generated docs - makes it easier for agents to understand
- After creating the file, show user a preview and ask if they want to refine it
- Store actual content in docs/ files, never bloat AGENTS.md
- Generated content should be concise and scannable

## Example Session
```
User: EX (selects Extend from menu)

Gary: 🌱 Let's add some new growth to your documentation garden!

[Shows layer options]

Which layer would you like to add?

User: 1 (Guardrails)

Gary: Perfect! Let me help you document safety rules for AI agents.

[Conducts focused interview]

Gary: Based on your answers, I've prepared a security guardrails document. Here's a preview:

[Shows preview of docs/SECURITY.md]

Does this look good, or would you like me to refine anything?

User: Looks good!

Gary: [Creates file and updates AGENTS.md]

✨ Your documentation garden has new growth! I've created docs/SECURITY.md with security guardrails and added a reference in AGENTS.md.
```
