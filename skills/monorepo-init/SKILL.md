---
name: monorepo-init
description: Bootstrap a new project with full scaffold — CLAUDE.md, DECISIONS.md, .memory/, docs/, PRD.md, Hello World per platform with tests. Run once at project creation. Idempotent — safe to re-run. Activates on: "init this monorepo", "set up project structure", "bootstrap project", "create CLAUDE.md and memory", "init project scaffold".
---

# Monorepo Init

Bootstraps a new project in 3 phases: **Plan → Review → Generate**.

Minimal interview (3 questions max). Smart defaults inferred from stack. User reviews full plan before any file is written.

## Core Rules — Never Break

- **Self-contained** — never invoke `superpowers:brainstorming`, `superpowers:writing-plans`, or any other skill. This skill owns its entire flow.
- **Minimal questions** — ask only: project name, platforms, stack per platform. Infer everything else.
- **Review before write** — always show the full scaffold plan and get user approval before generating any file.
- **Platform isolation** — each platform is fully independent: own deps, own tooling, own scripts. Sharing is opt-in.
- **Hello World required** — every platform ends with Hello World running, unit tests ≥ 80% coverage, e2e framework with ≥ 1 passing test.
- **Idempotent** — skip `.memory/000` silently if exists; prompt before overwriting `CLAUDE.md`, `PRD.md`, `TASK.md`.
- **Canonical names** — enforce `web` not `fe`, `api` not `backend`, `cms` not `strapi`.

## Definition of Done

For each platform:

| Check | Requirement |
|-------|-------------|
| Hello World runs | dev/start command exits 0 |
| Unit tests pass | test runner exits 0 |
| Coverage ≥ 80% | reported by test runner |
| E2E configured | ≥ 1 e2e test passes |

## 3-Phase Flow

```
Phase 1 — Plan
  AskUserQuestion: name + platforms (1 call)
  AskUserQuestion: stack per platform (1 call each)
  Infer all defaults → show summary
  Multi-turn: user corrects defaults via free text
  Loop until user says "looks good" / "proceed" / "go"

Phase 2 — Review
  Print full scaffold plan (files, stacks, tools, defaults)
  Wait for explicit approval: "go" / "generate" / "yes"
  "Change X" → back to Phase 1

Phase 3 — Generate
  Write all files
  Scaffold Hello World + tests per platform
  Run tests, verify ≥ 80% coverage
  Output commit command
```

## Companion Files

| Need | File |
|------|------|
| Phase 1 questions + inference table + Phase 2 review format | `skills/monorepo-init/recipes/interview.md` |
| Phase 3 generation steps | `skills/monorepo-init/recipes/execution.md` |
| File templates (CLAUDE.md, PRD.md, DECISIONS.md, TASK.md, SPEC, memory, docs) | `skills/monorepo-init/config/templates.md` |
| Hello World code + unit test + e2e per stack | `skills/monorepo-init/recipes/hello-world.md` |
