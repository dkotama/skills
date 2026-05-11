# Execution — Steps 2–11

Use templates from `skills/monorepo-init/config/templates.md`. Fill all `<PLACEHOLDERS>` from interview variables before writing. For Hello World scaffolds, read `skills/monorepo-init/recipes/hello-world.md`.

---

## Step 2 — Write `DECISIONS.md`

Use template: `## DECISIONS.md Template` from `config/templates.md`.

Fill from all Phase 4–6 interview answers. This file is the single source of truth for all tech choices.

---

## Step 3 — Write `PRD.md`

Use template: `## PRD.md Template` from `config/templates.md`.

Fill:
- `<PROJECT_NAME>` → `PROJECT_NAME`
- Platform table → one row per `PLATFORMS[]` entry with its stack
- Architecture → infer from `TECH_STACK` (e.g. REST API if api + web present, shared DB if multiple backends share one DB)

---

## Step 4a — Write `docs/SPEC_<SCOPE>_<YYYY-MM-DD>_<slug>.md` (if `USING_SUPERPOWERS=true`)

Date = today's date. Scope = platform(s) touched. Slug = kebab-case title from `FIRST_TASK`.

Use template: `## SPEC Template` from `config/templates.md`.

Fill from `FIRST_TASK`.

---

## Step 4b — Write `TASK.md` (if `USING_SUPERPOWERS=false`)

Idempotency: prompt user before overwriting.

Use template: `## TASK.md Template` from `config/templates.md`.

Fill from `FIRST_TASK`.

---

## Step 5 — Write `CLAUDE.md`

Idempotency: prompt user before overwriting.

Use template: `## CLAUDE.md Template` from `config/templates.md`.

Fill:
- `<PROJECT_NAME>` → `PROJECT_NAME`
- `<PLATFORM_LIST>` → comma-separated list e.g. `"API (api/), Frontend (web/), CMS (cms/)"`
- `<MAIN_BRANCH>` → `MAIN_BRANCH`
- `<STAGING_BRANCH>` → `STAGING_BRANCH` (if not provided, remove the `nor <STAGING_BRANCH>` clause)
- `<PLATFORM_MEMORY_LINES>` → one bullet per platform:
  ```
  - **<platform>-specific?** → `/<platform>/.memory/001-*.md`
  ```

---

## Step 6 — Write Root `.memory/000-how-to-memory.md`

Idempotency: **always skip silently** if file exists.

Use template: `## .memory/000 Template` from `config/templates.md`.

No placeholders — write exact content.

---

## Step 7 — Write `<platform>/.memory/000-how-to-memory.md` × N

For each platform in `PLATFORMS[]`:

Idempotency: **always skip silently** if file exists.

Use template: `## platform .memory/000 Template` from `config/templates.md`.

Replace `<PLATFORM_NAME>` with the platform folder name.

---

## Step 8 — Write `docs/README.md`

Idempotency: skip if file is non-empty.

Use template: `## docs/README.md Template` from `config/templates.md`.

Fill:
- `<PROJECT_NAME>` → `PROJECT_NAME`
- `<TECH_STACK_SUMMARY>` → one-line summary e.g. `"Next.js 15 · Strapi v5 · PostgreSQL"`

---

## Step 9 — Scaffold Hello World + Tests Per Platform

For **each** platform in `PLATFORMS[]`:

1. Read `skills/monorepo-init/recipes/hello-world.md` and find the section matching `TECH_STACK[platform]`.
2. Write the Hello World source file.
3. Write the unit test file.
4. Write the e2e test file / config.
5. Write tooling config files:
   - `package.json` / `go.mod` / `pubspec.yaml` — minimal, runnable
   - Linter config (`.biomerc.json` / `.eslintrc.json` / `ruff.toml` / etc.) from `TOOLING[platform].linter`
   - Test runner config (`vitest.config.ts` / `jest.config.ts` / `pytest.ini` / etc.)
   - Playwright config (`playwright.config.ts`) if e2e = Playwright
6. Install dependencies (run the package manager from `TOOLING[platform].pkg_manager`):
   ```bash
   cd <platform> && <pkg_manager> install
   ```

> If platform folder doesn't exist yet, create it first.

**Lefthook** — after all platforms are scaffolded, write root-level `lefthook.yml`:
```yaml
pre-commit:
  commands:
    lint:
      run: <per-platform lint commands>
commit-msg:
  commands:
    conventional:
      run: grep -qE '^(feat|fix|chore|docs|refactor|test|style|ci|perf)' {1}
```

---

## Step 10 — Run Tests + Verify Coverage

For **each** platform in `PLATFORMS[]`, run the appropriate commands:

| Stack | Unit test command | Coverage flag | E2E command |
|-------|------------------|---------------|-------------|
| Next.js (Vitest) | `pnpm test run` | `--coverage` | `pnpm exec playwright test` |
| Express/NestJS (Jest) | `pnpm test` | `--coverage` | `pnpm exec playwright test` |
| FastAPI (pytest) | `uv run pytest` | `--cov --cov-report=term` | `uv run pytest -m e2e` |
| Go + Gin | `go test ./... -coverprofile=c.out` | `go tool cover -func c.out` | same runner |
| Flutter | `flutter test --coverage` | built-in | `flutter test integration_test/` |
| React Native | `pnpm test --coverage` | built-in | `pnpm detox test` |
| Strapi v5 | `pnpm test --coverage` | built-in | `pnpm exec playwright test` |

**Pass criteria:**

- Unit: exit code 0
- Coverage: ≥ 80% lines/statements reported
- E2E: exit code 0

If any check fails: diagnose, fix, re-run. Do not proceed to Step 11 until all pass.

---

## Step 11 — Verify All Files + Commit Command

Run verification:

```bash
test -f DECISIONS.md                       && echo "OK DECISIONS.md"          || echo "MISSING DECISIONS.md"
test -f CLAUDE.md                          && echo "OK CLAUDE.md"             || echo "MISSING CLAUDE.md"
test -f PRD.md                             && echo "OK PRD.md"               || echo "MISSING PRD.md"
test -f .memory/000-how-to-memory.md       && echo "OK root memory"           || echo "MISSING root memory"
test -f docs/README.md                     && echo "OK docs/README.md"        || echo "MISSING docs/README.md"
for p in <PLATFORMS>; do
  test -f "$p/.memory/000-how-to-memory.md" && echo "OK $p memory"  || echo "MISSING $p memory"
done
```

When all checks pass, output the commit command:

```bash
git add DECISIONS.md CLAUDE.md PRD.md .memory/ docs/ lefthook.yml
for p in <PLATFORMS>; do git add "$p/"; done
# Add TASK.md if USING_SUPERPOWERS=false:
# git add TASK.md
git commit -m "chore: init project scaffold with hello world + tests"
```

---

## Idempotency Rules

| File | Behavior if exists |
|------|--------------------|
| `DECISIONS.md` | Prompt user: overwrite or skip |
| `CLAUDE.md` | Prompt user: overwrite or skip |
| `PRD.md` | Prompt user: overwrite or skip |
| `TASK.md` | Prompt user: overwrite or skip |
| `.memory/000-how-to-memory.md` | Always skip — never overwrite |
| `docs/README.md` | Skip if non-empty |
| `<platform>/.memory/000-how-to-memory.md` | Always skip — never overwrite |
| `<platform>/` Hello World files | Prompt user: overwrite or skip |
