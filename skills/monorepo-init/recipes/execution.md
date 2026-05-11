# Phase 3 — Generate

Only runs after user approves the Phase 2 review summary. Write all files in parallel where possible.

---

## A — Write Doc + Memory Files

Write simultaneously:

1. **`DECISIONS.md`** — use template from `config/templates.md`. Fill from all inferred variables.
2. **`PRD.md`** — use template. Fill `PROJECT_NAME`, platform table, architecture note.
3. **`CLAUDE.md`** — use template. Fill platform list, branch, memory lines.
4. **`.memory/000-how-to-memory.md`** — skip silently if exists.
5. **`<platform>/.memory/000-how-to-memory.md`** × N — skip silently if exists.
6. **`docs/README.md`** — skip if non-empty.
7. **`docs/SPEC_<scope>_<date>_scaffold.md`** — if `USING_SUPERPOWERS=true`.
8. **`TASK.md`** — if `USING_SUPERPOWERS=false`. Prompt before overwrite.

Idempotency:

| File | If exists |
|------|-----------|
| `CLAUDE.md`, `PRD.md`, `DECISIONS.md`, `TASK.md` | Prompt: overwrite or skip |
| `.memory/000*` | Always skip silently |
| `docs/README.md` | Skip if non-empty |

---

## B — Scaffold Hello World + Tests Per Platform

For each platform in `PLATFORMS[]`:

1. Read `skills/monorepo-init/recipes/hello-world.md` → find section for `TECH_STACK[platform]`.
2. Create platform folder if missing.
3. Write Hello World source file.
4. Write unit test file.
5. Write e2e test file + config.
6. Write minimal `package.json` / `go.mod` / `pubspec.yaml` — runnable, not opinionated.
7. Write linter config from `LINTER[platform]`.
8. Write test runner config.

Prompt before overwriting any existing Hello World or test files.

---

## C — Root Config

Write `lefthook.yml` at repo root:

```yaml
pre-commit:
  commands:
    lint:
      run: echo "lint: configure per-platform commands here"
commit-msg:
  commands:
    conventional:
      run: grep -qE "^(feat|fix|chore|docs|refactor|test|style|ci|perf)" {1}
```

---

## D — Install Dependencies

For each platform:

```bash
cd <platform> && <PKG_MANAGER[platform]> install
```

Skip for Go (no install step) and Flutter (user runs `flutter pub get`).

---

## E — Run Tests + Verify Coverage

For each platform, run unit tests + check coverage:

| Stack | Command | Coverage check |
|-------|---------|----------------|
| Next.js / Nuxt / SvelteKit | `pnpm test run --coverage` | Vitest reports threshold |
| Express / NestJS | `pnpm test --coverage` | Jest reports threshold |
| FastAPI | `uv run pytest --cov --cov-report=term` | fail_under = 80 in pyproject.toml |
| Go + Gin | `go test ./... -coverprofile=c.out && go tool cover -func c.out` | Manual check ≥ 80% |
| Flutter | `flutter test --coverage` | Check coverage/lcov.info |
| React Native | `pnpm test --coverage` | Jest threshold |
| Strapi | `pnpm test --coverage` | Jest threshold |

Then run e2e:

| Stack | Command |
|-------|---------|
| Playwright | `pnpm exec playwright test` |
| integration_test (Flutter) | `flutter test integration_test/` |
| Detox (RN) | `pnpm detox test` |
| Go httptest | `go test ./e2e/...` (server must be running) |

If any check fails → diagnose root cause → fix → re-run. Do not proceed until all pass.

---

## F — Verify + Commit

```bash
test -f DECISIONS.md                         && echo "OK" || echo "MISSING DECISIONS.md"
test -f CLAUDE.md                            && echo "OK" || echo "MISSING CLAUDE.md"
test -f PRD.md                               && echo "OK" || echo "MISSING PRD.md"
test -f .memory/000-how-to-memory.md         && echo "OK" || echo "MISSING root memory"
test -f docs/README.md                       && echo "OK" || echo "MISSING docs/README.md"
for p in <PLATFORMS>; do
  test -f "$p/.memory/000-how-to-memory.md"  && echo "OK $p memory" || echo "MISSING $p memory"
done
```

When all pass, output:

```bash
git add DECISIONS.md CLAUDE.md PRD.md .memory/ docs/ lefthook.yml
for p in <PLATFORMS>; do git add "$p/"; done
# Add TASK.md if USING_SUPERPOWERS=false:
# git add TASK.md
git commit -m "chore: init project scaffold with hello world + tests"
```
