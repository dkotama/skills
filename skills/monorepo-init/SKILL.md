---
name: monorepo-init
description: Bootstrap a new project with full scaffold — CLAUDE.md, .memory/, docs/, PRD.md, and optional TASK.md. Run once at project creation. Idempotent — safe to re-run. Activates on: "init this monorepo", "set up project structure", "bootstrap project", "create CLAUDE.md and memory", "init project scaffold".
---

# Monorepo Init

Bootstraps a new project with full scaffold: `CLAUDE.md`, `.memory/`, `docs/`, `PRD.md`, and optional `TASK.md`. Run once at project creation. Idempotent — safe to re-run.

## Core Rules — Never Break

- **Self-contained** — this skill owns its entire flow. Do NOT invoke `superpowers:brainstorming`, `superpowers:writing-plans`, or any other skill during execution. monorepo-init runs the interview itself.
- **Interview first, sequential** — use `AskUserQuestion` tool, one phase at a time (7 phases). Complete all phases before writing any file.
- **Platform isolation by default** — each platform folder is fully independent: own deps, own tooling config, own scripts. No shared root config, no shared components. Sharing is opt-in, not default.
- **Idempotency** — skip `.memory/000-how-to-memory.md` silently if exists; prompt before overwriting `CLAUDE.md`, `PRD.md`, `TASK.md`; skip `docs/README.md` if non-empty.
- **Superpowers branch** — `USING_SUPERPOWERS` only controls what task file type gets created (`docs/SPEC_*.md` vs `TASK.md`). It does not change how this skill runs.
- **Infer platforms** — if in a git repo with existing top-level folders, detect them before asking.
- **Hello World + tests required** — every platform must end with a working Hello World, unit tests passing at ≥ 80% coverage, and e2e framework installed with ≥ 1 passing test.
- **Commit at end** — output the `git add + commit` command after Step 11 verification passes.

## Definition of Done

Scaffold is complete when, for **each** platform:

| Check | Requirement |
|-------|-------------|
| Hello World runs | `dev` or `start` command exits without error |
| Unit tests pass | test runner exits 0 |
| Coverage ≥ 80% | reported by test runner |
| E2E framework configured | ≥ 1 e2e test passes |

## Decision Tree

```
Skill loaded
    └── Interview — 7 phases (Step 1)
            ├── Write DECISIONS.md (Step 2)
            ├── Write PRD.md (Step 3)
            ├── USING_SUPERPOWERS?
            │       ├── YES → docs/SPEC_*.md (Step 4a)
            │       └── NO  → TASK.md (Step 4b)
            ├── Write CLAUDE.md (Step 5)
            ├── Write .memory/000 (Step 6)
            ├── Write <platform>/.memory/000 × N (Step 7)
            ├── Write docs/README.md (Step 8)
            ├── Per platform: scaffold Hello World + tests (Step 9)
            ├── Per platform: run tests + verify ≥ 80% coverage (Step 10)
            └── Verify all files + output commit command (Step 11)
```

## Companion Files

Read on demand — only load what the current step needs:

| Need | File |
|------|------|
| Interview questions + variable schema | `skills/monorepo-init/recipes/interview.md` |
| Execution steps 2–11 with idempotency rules | `skills/monorepo-init/recipes/execution.md` |
| All file templates (CLAUDE.md, PRD.md, DECISIONS.md, TASK.md, SPEC, memory, docs) | `skills/monorepo-init/config/templates.md` |
| Hello World code + unit test + e2e per stack | `skills/monorepo-init/recipes/hello-world.md` |
