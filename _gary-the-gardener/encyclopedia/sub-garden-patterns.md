# Sub-garden Structure Patterns

> Gary reads this file on-demand when helping users decide how to split their garden into sub-gardens.
> Not loaded at startup. Accessed via: Plant step 1.6, Restructure sub-gardens `[G]`, and v2→v3 migration.

---

## How sub-gardens work

A sub-garden is a named section of the map with its own 4-column table. Every garden has at least two:
- **Shed & Knowledge Base** — agentic infrastructure + documentation (always first)
- **{Codebase section}** — source code areas

Large repos can have more sections. The user always decides; Gary suggests from the patterns below.

---

## Patterns by repo type

### Default — any project
```
🌿 Shed & Knowledge Base   →  shed + all docs areas
🌳 Codebase                →  all source/test areas
```
*Use when the codebase is modest (1–2 top-level source dirs) or the user doesn't want to split further.*

---

### Single-page app (React · Vue · Svelte · Angular)
```
🌿 Shed & Knowledge Base   →  shed + docs
🎨 Frontend                →  components/, pages/, hooks/, styles/, utils/
🧪 Tests & Build           →  tests/, e2e/, .github/
```

---

### Full-stack application
```
🌿 Shed & Knowledge Base   →  shed + docs
🎨 Frontend                →  client/, web/, app/, ui/
⚙️ Backend                 →  server/, api/, services/, workers/
🏗️ Infrastructure          →  infra/, deploy/, docker/, .github/
```

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

---

### Microservices
```
🌿 Shed & Knowledge Base   →  shed + docs
🔑 Core Services           →  services/auth/, services/gateway/, services/api/
🧩 Domain Modules          →  services/orders/, services/inventory/, services/users/
🏗️ Infrastructure          →  infra/, k8s/, docker/, deploy/
```

---

### Front-office / Back-office
```
🌿 Shed & Knowledge Base   →  shed + docs
🛍️ Front-office            →  apps/customer/, frontend/, web/
🔧 Back-office             →  apps/admin/, backoffice/, ops/
🔗 Shared                  →  shared/, common/, lib/
```

---

### Services + Domain modules (DDD-style)
```
🌿 Shed & Knowledge Base   →  shed + docs
⚙️ Services / Core         →  services/, core/, platform/
🧩 Domains / Modules       →  domains/, modules/, features/
🏗️ Infrastructure          →  infra/, db/, messaging/, deploy/
```

---

### Library or package
```
🌿 Shed & Knowledge Base   →  shed + docs
📚 Source                  →  src/, lib/
🧪 Tests                   →  tests/, spec/, __tests__/
```

---

## Naming tips

- Sub-garden labels are **short and human** — "Frontend", "Backend", not "frontend-source-code"
- Emoji should reflect purpose: 🎨 for UI, ⚙️ for backend/services, 🧩 for domain modules, 🏗️ for infra, 🧪 for tests
- "Shed & Knowledge Base" is always the first sub-garden — don't rename or move it
- If unsure about splitting, start with Default (2 sub-gardens) — it's easy to restructure later via `[G]`
