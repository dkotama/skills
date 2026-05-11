# Interview — Step 1

**Self-contained. Do not delegate to any other skill. Run this interview directly.**

Use `AskUserQuestion` tool. Ask **one phase at a time** — never dump all questions at once. Complete all 7 phases and collect all answers before writing any file.

---

## Phase 1 — Project Name

Call `AskUserQuestion` (1 question):

```
question: "What is the project name?"
header: "Project"
options:
  - label: "descriptive-slug"
    description: "e.g. invoice-tool, my-saas, portfolio — type your actual name via Other"
  - label: "tech-stack-name"
    description: "e.g. nextjs-strapi, go-react, laravel-flutter — type via Other"
```

Store answer as `PROJECT_NAME`.

---

## Phase 2 — Platforms

If in a git repo, scan existing top-level folders first (`ls -d */ 2>/dev/null`) and use them as starting point.

Call `AskUserQuestion` (1 question, multiSelect: true):

```
question: "Which platform folders does this project have?"
header: "Platforms"
multiSelect: true
options: (build from detected folders + common additions, max 4 shown)

  Canonical names to use — never use generic names:
  - label: "web"    description: "Frontend — Next.js, Nuxt, Remix, SvelteKit"
  - label: "api"    description: "Backend API — Express, FastAPI, NestJS, Go"
  - label: "cms"    description: "Content/Admin API — Strapi, Payload, Directus"
  - label: "mobile" description: "Mobile — Flutter, React Native, Expo"
  - label: "admin"  description: "Internal dashboard — Refine, AdminJS, custom"
```

**Naming enforcement — always apply before storing:**

If user types or selects a generic name, warn and ask for canonical form:

| Generic (reject) | Canonical (suggest) |
|------------------|---------------------|
| `backend`, `server`, `be` | `api` (REST/GraphQL) or `cms` (content layer) |
| `fe`, `frontend`, `client` | `web` |
| `app` (ambiguous) | ask: `web` or `mobile`? |
| `strapi`, `payload` | `cms` |
| `nextjs`, `nuxt` | `web` |

Store corrected values as `PLATFORMS[]`.

---

## Phase 3 — Tech Stack (one call per platform)

For **each** platform in `PLATFORMS[]`, make a **separate** `AskUserQuestion` call:

```
question: "Tech stack for `<platform>`?"
header: "<platform>"
options: (pick 2–4 based on platform name)

  web    → "Next.js 15", "Nuxt 3", "Remix", "SvelteKit"
  api    → "Express + Node", "FastAPI", "NestJS", "Go + Gin"
  cms    → "Strapi v5", "Payload CMS", "Directus", "Sanity"
  mobile → "Flutter", "React Native / Expo", "Swift native", "Kotlin native"
  admin  → "Next.js + shadcn", "Refine", "AdminJS", "Laravel Nova"

  (unrecognized folder) → "Next.js", "Express + Node", "FastAPI", "Go + Gin"
```

Store as `TECH_STACK[platform]`.

---

## Phase 4 — Dev Tooling (one call per platform)

For **each** platform in `PLATFORMS[]`, make a **separate** `AskUserQuestion` call with 3 questions:

```
Q1 — Package manager / build tool:
  question: "Package manager for `<platform>`?"
  header: "Pkg manager"
  options: (infer from stack)
    JS/TS stacks → "pnpm" (recommended), "bun", "npm", "yarn"
    Python stacks → "uv" (recommended), "poetry", "pip"
    Go            → "go mod" (automatic — skip this question)
    Dart/Flutter  → "pub" (automatic — skip this question)

Q2 — Linter + formatter:
  question: "Code quality tools for `<platform>`?"
  header: "Code quality"
  options: (infer from stack)
    JS/TS → "Biome" (lint+format unified), "ESLint + Prettier", "ESLint only"
    Python → "Ruff" (lint+format unified), "Black + Flake8", "Black + Pylint"
    Go     → "golangci-lint + gofmt" (automatic — skip this question)
    Dart   → "dart analyze + dart format" (automatic — skip this question)

Q3 — Testing frameworks (MANDATORY — always ask):
  question: "Testing setup for `<platform>`?"
  header: "Testing"
  multiSelect: true
  options: (infer from stack — always show unit + e2e as separate choices)
    Next.js/Nuxt/SvelteKit web →
      "Vitest + React Testing Library" (unit)
      "Playwright" (e2e)
    Express/NestJS api →
      "Jest + Supertest" (unit + integration)
      "Playwright API" (e2e)
    FastAPI →
      "pytest + TestClient" (unit)
      "pytest + httpx" (e2e)
    Go + Gin →
      "go test + httptest" (unit — automatic)
      "go test + httptest" (e2e — same runner, skip question)
    Strapi v5 →
      "Jest + Strapi test utils" (unit)
      "Playwright" (e2e admin panel)
    Flutter →
      "flutter_test" (unit — automatic)
      "integration_test" (e2e — automatic)
    React Native/Expo →
      "Jest + RNTL" (unit)
      "Detox" (e2e)
```

Store as `TOOLING[platform]` with keys: `pkg_manager`, `linter`, `unit_test`, `e2e_test`.

> **Git hooks** — always add Lefthook at root level. No question needed.

---

## Phase 5 — Cross-Cutting Concerns

Call `AskUserQuestion` (up to 4 questions together):

```
Q1 — Auth strategy:
  question: "Authentication strategy?"
  header: "Auth"
  options:
    - label: "None yet"        description: "Add later when needed"
    - label: "Clerk"           description: "Hosted auth — fast setup, generous free tier"
    - label: "Supabase Auth"   description: "If using Supabase DB too"
    - label: "Built-in"        description: "Custom JWT/session in your api platform"

  Skip if Strapi is in PLATFORMS[] — Strapi has built-in auth; note this.

Q2 — Database + local dev:
  question: "Database engine?"
  header: "Database"
  options:
    - label: "PostgreSQL"  description: "Relational — docker-compose for local dev"
    - label: "MySQL"       description: "Relational — docker-compose for local dev"
    - label: "MongoDB"     description: "Document — docker-compose for local dev"
    - label: "None yet"    description: "Add when needed"

Q3 — Admin panel:
  question: "Admin panel strategy?"
  header: "Admin"
  options:
    - label: "None"             description: "No admin panel needed"
    - label: "Strapi built-in"  description: "Only if cms platform is Strapi"
    - label: "Separate platform" description: "Add admin/ folder to PLATFORMS[]"
    - label: "Third-party"       description: "Retool, Forest Admin, Appsmith"

Q4 — Shared packages (only ask if PLATFORMS[] has 2+ JS/TS platforms):
  question: "Shared packages between platforms?"
  header: "Shared"
  options:
    - label: "None"              description: "Fully isolated (recommended default)"
    - label: "packages/types"    description: "Shared TypeScript interfaces only"
    - label: "packages/ui"       description: "Shared component library"
    - label: "Full workspace"    description: "Turborepo + pnpm workspaces"
```

Store `AUTH_STRATEGY`, `DATABASE`, `ADMIN_STRATEGY`, `SHARED_PACKAGES`.

---

## Phase 6 — Stack-Specific Plugins

For **each** platform in `PLATFORMS[]`, make a **separate** `AskUserQuestion` call (multiSelect: true):

```
question: "Which plugins/libraries for `<platform>` (<stack>)?"
header: "<platform> libs"
multiSelect: true

Suggest based on TECH_STACK[platform]:

  Next.js 15  → "shadcn/ui", "TailwindCSS", "React Query (TanStack)", "Zustand", "next-intl"
  Nuxt 3      → "Nuxt UI", "TailwindCSS", "Pinia", "@nuxtjs/i18n"
  Remix       → "Radix UI", "TailwindCSS", "Zustand"
  SvelteKit   → "Skeleton UI", "TailwindCSS", "Svelte Query"
  Express     → "Zod", "Helmet", "morgan", "cors"
  NestJS      → "class-validator", "Swagger (@nestjs/swagger)", "Passport"
  FastAPI     → "SQLAlchemy", "Alembic", "Pydantic Settings", "httpx"
  Go + Gin    → "GORM", "godotenv", "zap logger", "testify"
  Strapi v5   → "@strapi/plugin-seo", "@strapi/plugin-i18n", "upload: Cloudinary"
  Flutter     → "go_router", "riverpod", "dio", "freezed"
  React Native→ "Expo Router", "Zustand", "React Query", "NativeWind"
```

Store as `PLUGINS[platform][]`.

---

## Phase 7 — Git + Workflow + First Feature

Call `AskUserQuestion` (3 questions):

```
Q1 — Main branch:
  question: "Main branch name?"
  header: "Branch"
  options:
    - label: "main"        description: "Modern default (GitHub/GitLab)"
    - label: "master"      description: "Classic default"
    - label: "develop"     description: "GitFlow primary"
    - label: "production"  description: "Deploy-targeting"

Q2 — Superpowers:
  question: "Are you using superpowers skills in this project?"
  header: "Superpowers"
  options:
    - label: "Yes"  description: "SPEC docs + TDD + plan/review workflows"
    - label: "No"   description: "TASK.md for simple task tracking"

Q3 — First feature:
  question: "What does the user do first in this app?"
  header: "First Feature"
  options:
    - label: "Log in / sign up"    description: "Auth flow is the entry point"
    - label: "Browse content"      description: "Listing, search, or feed"
    - label: "Create something"    description: "Form, editor, upload"
    - label: "View a dashboard"    description: "Charts, stats, overview"
```

Store `MAIN_BRANCH`, `USING_SUPERPOWERS`, `FIRST_TASK` (selected label or typed text).

---

## Variable Schema

| Variable | Source |
|----------|--------|
| `PROJECT_NAME` | Phase 1 |
| `PLATFORMS[]` | Phase 2 (canonical names enforced) |
| `TECH_STACK[platform]` | Phase 3 |
| `TOOLING[platform]` | Phase 4 — `pkg_manager`, `linter`, `unit_test`, `e2e_test` |
| `AUTH_STRATEGY` | Phase 5 |
| `DATABASE` | Phase 5 |
| `ADMIN_STRATEGY` | Phase 5 |
| `SHARED_PACKAGES` | Phase 5 |
| `PLUGINS[platform][]` | Phase 6 |
| `MAIN_BRANCH` | Phase 7 (default: `main`) |
| `USING_SUPERPOWERS` | Phase 7 → bool |
| `FIRST_TASK` | Phase 7 |
