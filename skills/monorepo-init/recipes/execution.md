# Execution — Steps 2–7

Use templates from `skills/monorepo-init/config/templates.md`. Fill all `<PLACEHOLDERS>` from interview variables before writing.

---

## Step 2 — Write `PRD.md`

Use template: `## PRD.md Template` from `config/templates.md`.

Fill:
- `<PROJECT_NAME>` → `PROJECT_NAME`
- Platform table → one row per `PLATFORMS[]` entry with its stack
- Architecture → infer from `TECH_STACK` (e.g. REST API if api + fe present, shared DB if multiple backends share one DB)

---

## Step 3a — Write `docs/SPEC_<SCOPE>_<YYYY-MM-DD>_<slug>.md` (if `USING_SUPERPOWERS=true`)

Date = today's date. Scope = platform(s) touched. Slug = kebab-case title from `FIRST_TASK`.

Use template: `## SPEC Template` from `config/templates.md`.

Fill from `FIRST_TASK`.

---

## Step 3b — Write `TASK.md` (if `USING_SUPERPOWERS=false`)

Idempotency: prompt user before overwriting.

Use template: `## TASK.md Template` from `config/templates.md`.

Fill from `FIRST_TASK`.

---

## Step 4 — Write `CLAUDE.md`

Idempotency: prompt user before overwriting.

Use template: `## CLAUDE.md Template` from `config/templates.md`.

Fill:
- `<PROJECT_NAME>` → `PROJECT_NAME`
- `<PLATFORM_LIST>` → comma-separated list e.g. `"API (api/), Frontend (fe/), Admin (admin/)"`
- `<MAIN_BRANCH>` → `MAIN_BRANCH`
- `<STAGING_BRANCH>` → `STAGING_BRANCH` (if not provided, remove the `nor <STAGING_BRANCH>` clause)
- `<PLATFORM_MEMORY_LINES>` → one bullet per platform:
  ```
  - **<platform>-specific?** → `/<platform>/.memory/001-*.md`
  ```

---

## Step 5 — Write Root `.memory/000-how-to-memory.md`

Idempotency: **always skip silently** if file exists.

Use template: `## .memory/000 Template` from `config/templates.md`.

No placeholders — write exact content.

---

## Step 6 — Write `<platform>/.memory/000-how-to-memory.md` × N

For each platform in `PLATFORMS[]`:

Idempotency: **always skip silently** if file exists.

Use template: `## platform .memory/000 Template` from `config/templates.md`.

Replace `<PLATFORM_NAME>` with the platform folder name (e.g. `api`, `fe`).

---

## Step 7 — Write `docs/README.md`

Idempotency: skip if file is non-empty.

Use template: `## docs/README.md Template` from `config/templates.md`.

Fill:
- `<PROJECT_NAME>` → `PROJECT_NAME`
- `<TECH_STACK_SUMMARY>` → one-line summary of all stacks (e.g. `"Go API · Next.js Frontend · PostgreSQL"`)

---

## Idempotency Rules

| File | Behavior if exists |
|------|--------------------|
| `CLAUDE.md` | Prompt user: overwrite or skip |
| `PRD.md` | Prompt user: overwrite or skip |
| `TASK.md` | Prompt user: overwrite or skip |
| `.memory/000-how-to-memory.md` | Always skip — never overwrite |
| `docs/README.md` | Skip if non-empty |
| `<platform>/.memory/000-how-to-memory.md` | Always skip — never overwrite |
