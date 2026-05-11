# Interview — Step 1

**Self-contained. Do not delegate to any other skill. Run this interview directly.**

Use `AskUserQuestion` tool. Ask **one phase at a time** — never dump all questions at once. Complete all 5 phases and collect all answers before writing any file.

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

  web   → "Next.js 15", "Nuxt 3", "Remix", "SvelteKit"
  api   → "Express + Node", "FastAPI", "NestJS", "Go + Gin"
  cms   → "Strapi v5", "Payload CMS", "Directus", "Sanity"
  mobile → "Flutter", "React Native", "Expo", "Swift/Kotlin native"
  admin  → "Next.js + shadcn", "Refine", "AdminJS", "Laravel Nova"

  (unrecognized folder name) → "Next.js", "Express + Node", "FastAPI", "Go + Gin"
```

Store as `TECH_STACK[platform]`.

---

## Phase 4 — Git + Workflow (1 call, 2 questions)

Call `AskUserQuestion` with 2 questions together:

```
Q1:
  question: "Main branch name?"
  header: "Branch"
  options:
    - label: "main"        description: "Modern default (GitHub/GitLab)"
    - label: "master"      description: "Classic default"
    - label: "develop"     description: "GitFlow primary"
    - label: "production"  description: "Deploy-targeting branch"

Q2:
  question: "Are you using superpowers skills in this project?"
  header: "Superpowers"
  options:
    - label: "Yes"  description: "SPEC docs + TDD + plan/review workflows"
    - label: "No"   description: "TASK.md for simple task tracking"
```

Store `MAIN_BRANCH`, `USING_SUPERPOWERS`.

---

## Phase 5 — First Task (1 call, 1 question)

Call `AskUserQuestion`:

```
question: "What is the first feature or task to implement?"
header: "First Task"
options:
  - label: "Auth & users"       description: "Login, register, sessions, roles"
  - label: "Data model & DB"    description: "Schema, migrations, seed data"
  - label: "Core UI scaffold"   description: "Layout, routing, design system"
  - label: "API endpoints"      description: "REST or GraphQL resource CRUD"
```

Store selected label or typed text (from Other) as `FIRST_TASK`.

---

## Variable Schema

| Variable | Source | Default |
|----------|--------|---------|
| `PROJECT_NAME` | Phase 1 | — |
| `PLATFORMS[]` | Phase 2 (canonical names enforced) | inferred from top-level dirs |
| `TECH_STACK` | Phase 3 — map: platform → stack | — |
| `MAIN_BRANCH` | Phase 4 Q1 | `main` |
| `USING_SUPERPOWERS` | Phase 4 Q2 → bool | `false` |
| `FIRST_TASK` | Phase 5 | — |

---

## Step 8 — Verify

After all files written, run:

```bash
test -f CLAUDE.md                          && echo "OK CLAUDE.md"           || echo "MISSING CLAUDE.md"
test -f PRD.md                             && echo "OK PRD.md"              || echo "MISSING PRD.md"
test -f .memory/000-how-to-memory.md       && echo "OK root memory"         || echo "MISSING root memory"
test -f docs/README.md                     && echo "OK docs/README.md"      || echo "MISSING docs/README.md"
for p in <PLATFORMS>; do
  test -f "$p/.memory/000-how-to-memory.md" && echo "OK $p memory" || echo "MISSING $p memory"
done
```

When all checks pass, output the commit command:

```bash
git add CLAUDE.md PRD.md .memory/ docs/
# Add TASK.md if USING_SUPERPOWERS=false:
# git add TASK.md
git commit -m "chore: init project scaffold"
```
