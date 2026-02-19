# Extend

> Add new content layers: guardrails, golden principles, style, or domain knowledge.

## Phases

1. Discovery - check existing layers
2. Choose - pick a layer to add
3. Interview - gather content through focused questions
4. Generate - create the documentation file
5. Link - update AGENTS.md pointer

## Phase 1: Discovery

- Read AGENTS.md to understand current content
- Check which layers already exist: docs/SECURITY.md, docs/core-beliefs.md, docs/STYLE.md, docs/DOMAIN.md
- Read any existing layer files

## Phase 2: Choose

Use `AskUserQuestion` to present layer options:
- **Guardrails** - safety rules, permission boundaries (creates docs/SECURITY.md)
- **Golden Principles** - mechanical "always do it this way" rules (creates docs/core-beliefs.md)
- **Style & Opinions** - code conventions, patterns, formatting (creates docs/STYLE.md)
- **Domain Knowledge** - business terms, API contracts, data models (creates docs/DOMAIN.md)

Mark already-existing layers in the description.

## Phase 3: Interview

Conduct a focused interview based on the chosen layer. Ask 3-5 targeted questions. Don't overwhelm - if user doesn't know an answer, skip that section.

- **Guardrails**: secrets to protect, destructive ops needing confirmation, protected files, external service handling, compliance
- **Golden Principles**: code organization, dependency preferences, validation, error handling, testing rules
- **Style**: language conventions, file naming, formatting, comments, import organization
- **Domain**: core entities, API structure, data models, business rules, external integrations

## Phase 4: Generate

- Structure content in clear sections with examples
- Keep it actionable - agents should know what to do
- Show preview to user via `AskUserQuestion`: "Looks good?" with options: Save it / Refine / Start over

## Phase 5: Link

- Add one-line pointer in AGENTS.md "Further Reading" section
- Show result card: file created, AGENTS.md updated

## Rules

- Keep AGENTS.md changes minimal - just a one-line pointer
- Don't invent content the user didn't provide
- Store actual content in docs/, never bloat AGENTS.md
