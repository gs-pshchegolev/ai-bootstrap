# Sub-garden Structure Patterns

> Gary reads this file on-demand when helping users decide how to split their garden into sub-gardens.
> Not loaded at startup. Accessed via: `choose-structure.md` (called from Plant step 1.6, Restructure `[G]`, and v2→v3 migration).

---

## How sub-gardens work

A sub-garden is a named section of the map with its own 4-column table. Every garden has at least two:
- **Shed & Knowledge Base** — agentic infrastructure + documentation (always first)
- **{Codebase section}** — source code areas

Large repos can have more sections. The user always decides; Gary suggests from the patterns below.

---

## Scoring patterns

Gary scores each pattern against repo signals and presents only the top 1–2 matches (plus Default as fallback). A pattern scores higher when more of its `Use when:` signals match.

---

## Patterns by repo type

### Default — any project
```
🌿 Shed & Knowledge Base   →  shed + all docs areas
🌳 Codebase                →  all source/test areas
```
*Use when the codebase is modest (1–2 top-level source dirs) or the user doesn't want to split further.*

**Use when:** No strong tech stack signal detected, or ≤2 top-level code directories, or user prefers simplicity. Always available as a fallback option regardless of score.

---

### Single-page app (React · Vue · Svelte · Angular)
```
🌿 Shed & Knowledge Base   →  shed + docs
🎨 Frontend                →  components/, pages/, hooks/, styles/, utils/
🧪 Tests & Build           →  tests/, e2e/, .github/
```

**Use when:** `package.json` contains `react`, `vue`, `svelte`, or `@angular/core` as a dependency — AND no `server/`, `api/`, or `backend/` top-level directory exists. Single top-level source root (e.g. `src/`). Score +1 per matching signal.

---

### Full-stack application
```
🌿 Shed & Knowledge Base   →  shed + docs
🎨 Frontend                →  client/, web/, app/, ui/
⚙️ Backend                 →  server/, api/, services/, workers/
🏗️ Infrastructure          →  infra/, deploy/, docker/, .github/
```

**Use when:** Both a frontend directory (`client/`, `web/`, `app/`, `ui/`, `frontend/`) AND a backend directory (`server/`, `api/`, `backend/`) exist at the top level. `package.json` may contain `next`, `nuxt`, `express`, `fastify`, or `@nestjs/core`. May also have `prisma/`, `db/`, or `migrations/`. Score +1 per matching signal.

---

### Monorepo — multiple apps or packages
```
🌿 Shed & Knowledge Base   →  shed + docs
📦 {App1 name}             →  apps/{app1}/ or packages/{app1}/
📦 {App2 name}             →  apps/{app2}/ or packages/{app2}/
🔧 Shared                  →  packages/shared/, lib/, common/
🏗️ Infrastructure          →  infra/, deploy/, .github/
```
*Name each app sub-garden after the app (e.g. "Web App", "Admin Dashboard", "CLI Tool").*

**Use when:** Top-level `apps/` or `packages/` directory with ≥2 subdirectories each containing ≥10 files. May have `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, or `turbo.json` at root. Score +2 for workspace config file, +1 per qualifying sub-app.

---

### Microservices
```
🌿 Shed & Knowledge Base   →  shed + docs
🔑 Core Services           →  services/auth/, services/gateway/, services/api/
🧩 Domain Modules          →  services/orders/, services/inventory/, services/users/
🏗️ Infrastructure          →  infra/, k8s/, docker/, deploy/
```

**Use when:** Top-level `services/` directory with ≥3 subdirectories each containing ≥5 files. Or multiple top-level service directories (e.g. `auth-service/`, `order-service/`) each with their own `Dockerfile` or `go.mod`/`package.json`. Often has `k8s/`, `docker-compose.yml`, or `infra/`. Score +2 for `k8s/` or multiple `Dockerfile`s, +1 per qualifying service directory.

---

### Front-office / Back-office
```
🌿 Shed & Knowledge Base   →  shed + docs
🛍️ Front-office            →  apps/customer/, frontend/, web/
🔧 Back-office             →  apps/admin/, backoffice/, ops/
🔗 Shared                  →  shared/, common/, lib/
```

**Use when:** Distinct customer-facing and admin/operator-facing apps exist — typically `apps/customer/` + `apps/admin/`, or `frontend/` + `backoffice/`, or `web/` + `ops/`. Both sides have substantial code (≥20 files each). Score +2 when both sides present, +1 for a `shared/` or `common/` directory.

---

### Services + Domain modules (DDD-style)
```
🌿 Shed & Knowledge Base   →  shed + docs
⚙️ Services / Core         →  services/, core/, platform/
🧩 Domains / Modules       →  domains/, modules/, features/
🏗️ Infrastructure          →  infra/, db/, messaging/, deploy/
```

**Use when:** Top-level `domains/` or `modules/` or `features/` directory alongside a `services/` or `core/` directory. Often paired with DDD terminology in docs (bounded context, aggregate, domain event). May have `messaging/`, `events/`, or `db/` at root. Score +2 for `domains/` present, +1 per additional DDD directory signal.

---

### Library or package
```
🌿 Shed & Knowledge Base   →  shed + docs
📚 Source                  →  src/, lib/
🧪 Tests                   →  tests/, spec/, __tests__/
```

**Use when:** `package.json` has a `main` or `exports` field and no `apps/` directory. Or `go.mod`/`Cargo.toml`/`pyproject.toml` at root with a single `src/` or `lib/` source directory. Typically ≤500 total files, no frontend/backend split. Score +2 for publish config (`main`/`exports`/`lib` in `package.json`), +1 for single source root.

---

## Naming tips

- Sub-garden labels are **short and human** — "Frontend", "Backend", not "frontend-source-code"
- Emoji should reflect purpose: 🎨 for UI, ⚙️ for backend/services, 🧩 for domain modules, 🏗️ for infra, 🧪 for tests
- "Shed & Knowledge Base" is always the first sub-garden — don't rename or move it
- If unsure about splitting, start with Default (2 sub-gardens) — it's easy to restructure later via `[G]`
