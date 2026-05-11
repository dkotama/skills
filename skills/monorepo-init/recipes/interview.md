# Interview — Step 1

**This skill is self-contained. Do not delegate to `superpowers:brainstorming` or any other skill. Run this interview directly.**

Ask all 6 questions before writing any file. Present them together in a single block.

## Questions

```
1. Project name?
2. What platforms / folders? (e.g. api, fe, admin, flutter)
3. Tech stack per platform? (language, framework, DB)
4. Main branch? Staging/protected branches?
5. Are you using superpowers skills? (yes/no)
6. Describe your first feature or task.
```

If already in a git repo, infer existing top-level folders and present them as the default for Q2.

## Variable Schema

Store answers as:

| Variable | Source | Default |
|----------|--------|---------|
| `PROJECT_NAME` | Q1 | — |
| `PLATFORMS[]` | Q2 — array of folder names | inferred from top-level dirs |
| `TECH_STACK` | Q3 — map: platform → stack string | — |
| `MAIN_BRANCH` | Q4 first value | `main` |
| `STAGING_BRANCH` | Q4 second value (optional) | omit if not given |
| `USING_SUPERPOWERS` | Q5 → bool | `false` |
| `FIRST_TASK` | Q6 — free text | — |

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

Replace `<PLATFORMS>` with the actual platform folder names from the interview.

When all checks pass, output the final commit command:

```bash
git add CLAUDE.md PRD.md .memory/ docs/
# Add TASK.md if USING_SUPERPOWERS=false:
# git add TASK.md
git commit -m "chore: init project scaffold"
```
