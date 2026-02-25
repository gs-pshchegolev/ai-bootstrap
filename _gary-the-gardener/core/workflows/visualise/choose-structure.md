# Choose Sub-garden Structure

> Shared sub-flow called from two places:
> - **Plant** — Step 1.6, after granularity is decided and areas are confirmed
> - **Restructure** — triggered by `[G]` from the garden map footer
>
> Returns a confirmed `sub_gardens` list (id, label, emoji, areas).

## Inputs

This sub-flow requires the following context to be available before it runs:

- **`confirmed_areas`** — list of area ids with their labels and `include` patterns (from plant Step 1.5 or from existing `docsmap.yaml`)
- **`repo_signals`** — top-level directory names + detected stack files (from plant Step 1c or re-scanned via `git ls-files | grep '/' | cut -d'/' -f1 | sort -u`)

---

## Step 1: Score patterns

Read `{project-root}/_gary-the-gardener/encyclopedia/sub-garden-patterns.md`.

For each pattern (except Default), score against `repo_signals` using its `Use when:` signals. Tally the score. Default scores 0 (always available as fallback).

**Score the following signals from `repo_signals`:**

```
Stack files present:
  package.json → check dependencies for framework hints
  go.mod / Cargo.toml / pyproject.toml → single-service language indicator
  pnpm-workspace.yaml / lerna.json / nx.json / turbo.json → monorepo +2

Top-level directories:
  apps/ or packages/ with ≥2 subdirs of ≥10 files → monorepo +2
  services/ with ≥3 subdirs of ≥5 files → microservices +2
  k8s/ or multiple Dockerfiles → microservices +2
  client/ or web/ or ui/ + server/ or api/ → fullstack +2
  domains/ or modules/ or features/ → DDD +2
  apps/customer/ + apps/admin/ → front/back-office +2
  src/ or lib/ only (no apps/) + publish config → library +2
  react/vue/svelte/@angular in package.json → SPA +1
  server/ or api/ or backend/ dir present → SPA −1  (cancels the react signal for full-stack repos)
```

---

## Step 2: Select top matches

Pick the top 1–2 patterns by score (minimum score ≥1 to be shown). Always include Default and Custom as the final two options. Never show more than 4 options total (up to 2 scored matches + Default + Custom).

If no pattern scores ≥1: show only Default + Custom.

---

## Step 3: Map areas to proposed sub-gardens

For each top-scoring pattern, compute the proposed area mapping using `confirmed_areas`:

- Shed and documentation areas → "Shed & Knowledge Base" (always)
- Remaining areas → grouped by the pattern's codebase sections, matching on directory prefixes in `include` patterns

Show the mapping concretely — not the generic pattern template. Example:

```
Option A — Full-stack (score: 4)
  🌿 Shed & Knowledge Base  →  shed, core-docs
  🎨 Frontend               →  client-components, client-pages, client-hooks
  ⚙️  Backend               →  api-routes, api-services, db-models
  🏗️  Infrastructure        →  infra, github-workflows
```

---

## Step 4: Ask user

```
AskUserQuestion: "How should the garden be organised into sub-gardens?"
→ [Top match option A — with area mapping preview]
→ [Second match option B — with area mapping preview]   (if score ≥1)
→ Default — Shed & Knowledge Base | Codebase
→ Custom — Gary asks one question about grouping
```

**If Custom:** Ask: "Which areas should go together? (e.g. 'group frontend/* areas into one section, backend/* into another')". Confirm the resulting grouping before proceeding.

---

## Step 5: Return

Return the confirmed `sub_gardens` list in this shape:

```yaml
sub_gardens:
  - id: shed-knowledge-base
    label: "Shed & Knowledge Base"
    emoji: "🌿"
    areas: [shed, core-docs, ...]
  - id: {section-id}
    label: "{Section Label}"
    emoji: "{emoji}"
    areas: [area-id, ...]
```

The caller (plant or restructure) writes this to `docsmap.yaml`.
