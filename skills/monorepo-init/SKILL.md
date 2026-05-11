---
name: monorepo-init
description: Bootstrap a new project with full scaffold — CLAUDE.md, .memory/, docs/, PRD.md, and optional TASK.md. Run once at project creation. Idempotent — safe to re-run. Activates on: "init this monorepo", "set up project structure", "bootstrap project", "create CLAUDE.md and memory", "init project scaffold".
---

# Monorepo Init

Bootstraps a new project with full scaffold: `CLAUDE.md`, `.memory/`, `docs/`, `PRD.md`, and optional `TASK.md`. Run once at project creation. Idempotent — safe to re-run.

## Core Rules — Never Break

- **Self-contained** — this skill owns its entire flow. Do NOT invoke `superpowers:brainstorming`, `superpowers:writing-plans`, or any other skill during execution. monorepo-init runs the interview itself.
- **Interview first, sequential** — use `AskUserQuestion` tool, one phase at a time (5 phases). Complete all phases before writing any file
- **Platform isolation by default** — each platform folder is fully independent: own deps, own tooling config, own scripts. No shared root config, no shared components. Sharing is opt-in, not default.
- **Idempotency** — skip `.memory/000-how-to-memory.md` silently if exists; prompt before overwriting `CLAUDE.md`, `PRD.md`, `TASK.md`; skip `docs/README.md` if non-empty
- **Superpowers branch** — `USING_SUPERPOWERS` only controls what task file type gets created (`docs/SPEC_*.md` vs `TASK.md`). It does not change how this skill runs.
- **Infer platforms** — if in a git repo with existing top-level folders, detect them before asking
- **Commit at end** — output the `git add + commit` command after Step 8 verification passes

## Decision Tree

```
Skill loaded
    └── Interview (Step 1)
            ├── Write PRD.md (Step 2)
            ├── USING_SUPERPOWERS?
            │       ├── YES → docs/SPEC_*.md (Step 3a)
            │       └── NO  → TASK.md (Step 3b)
            ├── Write CLAUDE.md (Step 4)
            ├── Write .memory/000 (Step 5)
            ├── Write <platform>/.memory/000 × N (Step 6)
            ├── Write docs/README.md (Step 7)
            └── Verify all (Step 8)
```

## Companion Files

Read on demand — only load what the current step needs:

| Need | File |
|------|------|
| Interview questions + variable schema + verification | `skills/monorepo-init/recipes/interview.md` |
| Execution steps 2–7 with idempotency rules | `skills/monorepo-init/recipes/execution.md` |
| All file templates (CLAUDE.md, PRD.md, TASK.md, SPEC, memory, docs) | `skills/monorepo-init/config/templates.md` |
