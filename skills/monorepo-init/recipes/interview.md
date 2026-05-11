# Phase 1 — Plan

Collect minimal info. Infer the rest. Show defaults. Let user correct via free text.

---

## Step 1 — Collect Project Identity

If in a git repo, scan top-level folders first (`ls -d */ 2>/dev/null`).

Call `AskUserQuestion` (2 questions together):

```
Q1:
  question: "What is the project name?"
  header: "Project"
  options:
    - label: "descriptive-slug"   description: "e.g. invoice-tool, my-saas — type yours via Other"
    - label: "tech-stack-name"    description: "e.g. nextjs-strapi, go-react — type yours via Other"

Q2:
  question: "Which platform folders does this project have?"
  header: "Platforms"
  multiSelect: true
  options: (detected folders first, then fill to 4 with common additions)
    - label: "web"     description: "Frontend — Next.js, Nuxt, Remix, SvelteKit"
    - label: "api"     description: "Backend API — Express, FastAPI, NestJS, Go+Gin"
    - label: "cms"     description: "Content layer — Strapi, Payload, Directus"
    - label: "mobile"  description: "Mobile — Flutter, React Native, Expo"
```

**Naming enforcement:** Silently correct generic names before storing.

| Generic | Canonical |
|---------|-----------|
| `backend`, `server`, `be` | `api` or `cms` (ask if ambiguous) |
| `fe`, `frontend`, `client` | `web` |
| `app` | ask: `web` or `mobile`? |
| `strapi`, `payload`, `directus` | `cms` |

---

## Step 2 — Stack Per Platform

For each platform, one `AskUserQuestion` call:

```
question: "Tech stack for `<platform>`?"
header: "<platform>"
options: (2–4 based on platform name)

  web    → "Next.js 15", "Nuxt 3", "Remix", "SvelteKit"
  api    → "Express + TypeScript", "FastAPI", "NestJS", "Go + Gin"
  cms    → "Strapi v5", "Payload CMS", "Directus", "Sanity"
  mobile → "Flutter", "React Native / Expo", "Swift native", "Kotlin native"
  admin  → "Next.js + shadcn", "Refine", "AdminJS", "Laravel Nova"
  (other)→ "Next.js 15", "Express + TypeScript", "FastAPI", "Go + Gin"
```

---

## Step 3 — Infer Defaults

After collecting name + platforms + stacks, infer everything else silently:

| Config | Inference rule |
|--------|---------------|
| Main branch | `main` |
| Package manager | Next.js/Nuxt/Remix/SvelteKit/Express/NestJS → `pnpm`; FastAPI → `uv`; Go → `go mod`; Flutter → `pub`; RN/Expo → `pnpm` |
| Linter + formatter | JS/TS stacks → `Biome`; Python → `Ruff`; Go → `golangci-lint + gofmt`; Dart → `dart analyze` |
| Unit test | Next.js/Nuxt/SvelteKit/Remix → `Vitest + RTL`; Express/NestJS → `Jest + Supertest`; FastAPI → `pytest + TestClient`; Go → `go test + httptest`; Flutter → `flutter_test`; RN/Expo → `Jest + RNTL` |
| E2E test | Web platforms → `Playwright`; API platforms → `Playwright API` or same-runner; Flutter → `integration_test`; RN → `Detox`; Strapi → `Playwright` |
| Git hooks | `Lefthook` (always, at repo root) |
| Superpowers | `true` (user is running Claude Code skills) |
| USING_SUPERPOWERS → file | SPEC doc in `docs/` |

---

## Step 4 — Show Defaults Summary

Present the inferred defaults as a **conversational summary** (not a tool call):

```
Here's what I'll scaffold:

**Project:** <PROJECT_NAME>

| Platform | Stack | Pkg | Linter | Unit | E2E |
|----------|-------|-----|--------|------|-----|
| web | Next.js 15 | pnpm | Biome | Vitest+RTL | Playwright |
| cms | Strapi v5 | pnpm | Biome | Jest | Playwright |

**Branch:** main  
**Git hooks:** Lefthook  
**Task format:** SPEC docs (superpowers)

**Files to create:**
- `CLAUDE.md`, `PRD.md`, `DECISIONS.md`
- `docs/README.md`, `.memory/000-how-to-memory.md`
- `web/.memory/`, `web/app/page.tsx`, `web/app/page.test.tsx`, `web/e2e/home.spec.ts`
- `cms/.memory/`, `cms/tests/health.test.ts`, `cms/e2e/admin.spec.ts`
- `lefthook.yml`

Anything to change? Or type "go" to generate.
```

---

## Step 5 — Multi-Turn Corrections

Wait for user response. Three outcomes:

**"go" / "generate" / "proceed" / "looks good"** → move to Phase 3 (Generate).

**"change X to Y"** → apply correction to variables, reprint summary, loop back to Step 4.

**Specific question** → answer it, reprint summary if variables changed, ask again.

Common corrections to handle gracefully:
- "use yarn instead of pnpm" → update `pkg_manager` for stated platform(s)
- "add postgres" → add `DATABASE=PostgreSQL` to `DECISIONS.md` plan
- "no e2e for now" → remove e2e from plan (still configure unit tests)
- "use master branch" → update `MAIN_BRANCH`
- "add admin platform" → add `admin` to `PLATFORMS[]`, ask stack for it

---

## Variable Schema

| Variable | Source |
|----------|--------|
| `PROJECT_NAME` | Step 1 Q1 |
| `PLATFORMS[]` | Step 1 Q2 (canonical names) |
| `TECH_STACK[platform]` | Step 2 |
| `PKG_MANAGER[platform]` | Step 3 inference |
| `LINTER[platform]` | Step 3 inference |
| `UNIT_TEST[platform]` | Step 3 inference |
| `E2E_TEST[platform]` | Step 3 inference |
| `MAIN_BRANCH` | Step 3 inference (default: `main`) |
| `USING_SUPERPOWERS` | Step 3 inference (default: `true`) |
