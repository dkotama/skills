# File Templates

All templates for monorepo-init. Fill `<PLACEHOLDERS>` from interview variables before writing files.

---

## PRD.md Template

```markdown
# PRD — <PROJECT_NAME>

## Overview

<One paragraph: what this project does, who uses it, why it exists.>

## Platforms

| Platform | Folder | Stack |
|----------|--------|-------|
| <NAME> | `<folder>/` | <lang + framework + DB> |

## Architecture

<How platforms communicate — REST, shared DB, event bus, etc.>

## Goals

- [ ] <Goal 1>
- [ ] <Goal 2>

## Non-Goals

- <What this project explicitly does NOT do>

## Open Questions

- <Any decisions not yet made>
```

---

## TASK.md Template

```markdown
# TASK — <PROJECT_NAME>

## Active Task

**<Task title from FIRST_TASK>**

<Description of what needs to be done.>

### Steps

- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

### Done When

- <Verifiable completion criteria>
```

---

## SPEC Template

```markdown
# SPEC — <Task Title>

## Goal

<What this task accomplishes.>

## Architecture

<Files touched, new endpoints, components, etc.>

## Tech Stack

<Relevant stack for this task.>

## File Map

\`\`\`
<folder>/
└── <file>    ← <purpose>
\`\`\`

## Tasks

- [ ] Task 1: <description>
  - Verify: <command or check>
- [ ] Task 2: <description>
  - Verify: <command or check>
```

---

## CLAUDE.md Template

```markdown
# CLAUDE.md

## <PROJECT_NAME> Monorepo

**Structure:** <PLATFORM_LIST e.g. "API (`api/`), Frontend (`fe/`), Admin (`admin/`), Mobile (`flutter/`)">

**Git Workflow:** Feature branch → PR → Review → Merge. **No direct pushes to `<MAIN_BRANCH>` nor `<STAGING_BRANCH>`.**

1. Create branch: `git checkout -b feature/name`
2. Commit & push to feature branch
3. Open PR against `<MAIN_BRANCH>`
4. Wait for review & CI/CD
5. Merge via PR, delete branch

**Naming:** `feature/`, `bugfix/`, `hotfix/` prefixes

---

## Behavioral Guidelines

Reduce common LLM coding mistakes. Bias toward caution over speed.

### 1. Think Before Coding

- State assumptions explicitly. Surface tradeoffs.
- If multiple interpretations exist, present them — don't pick silently.
- If uncertain, ask. Don't hide confusion.

### 2. Simplicity First

- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- If it could be 50 lines instead of 200, rewrite it.

### 3. Surgical Changes

- Touch only what you must. Don't "improve" adjacent code.
- Don't refactor things that aren't broken.
- Match existing style.
- Remove only imports/variables made unused by YOUR changes.

### 4. Goal-Driven Execution

- Transform tasks into verifiable goals.
- "Fix the bug" → Write test that reproduces it, then make it pass.
- For multi-step tasks, state a brief plan with verification steps.

**Test:** Every changed line should trace directly to the user's request.

---

## Memory Organization

**Root `.memory/`** — Project-wide decisions, patterns, conventions (architecture, git, process)

**Platform `.memory/`** — Platform-specific notes per folder.

### Session Startup

On first session load, read `.memory/000-how-to-memory.md` and existing `.memory/*.md` for the active scope.

### When to Create Memory Notes

When user says **"memory"** or **"ingat"**, write to `.memory/` using `NNN-filename.md` format:

- **Project-wide?** → `/.memory/001-*.md`
<PLATFORM_MEMORY_LINES>

See `000-how-to-memory.md` in each folder for format & guidelines.

---

## Documentation Structure

**Design & Implementation Specs:** `docs/` (flat)

- **[Docs Index](docs/README.md)** — Map of all specs and design docs

Each design document includes: Goal, Architecture, Tech Stack, File Map, task-by-task steps.

Naming convention:
- `SPEC_<SCOPE>_<YYYY-MM-DD>_<slug>.md` — full feature specs
- `DESIGN_<SCOPE>_<slug>.md` — design system docs
- `GUIDE_<SCOPE>_<slug>.md` — workflows and how-tos

---

## Testing & Coverage

- Use unit tests and e2e tests for changes.
- Unit test coverage must be >= 80%.
```

---

## .memory/000 Template

```markdown
# 000 — How to Use .memory

Notes that persist across sessions — decisions, conventions, rules.

## Naming

\`\`\`
000-how-to-memory.md        ← meta (this file)
001-<topic>.md
002-<next-topic>.md
\`\`\`

Format: `<number>-<kebab-name>.md`. Number = creation order, not priority.

## When to Add

- Validated patterns ("this is how we do X")
- Decisions with a reason ("we use Y not Z because...")
- Rules that would be re-discovered otherwise

## When NOT to Add

- In-progress work (use tasks)
- Things derivable from the code
- Git history / changelogs

## Trigger Words

User says "memory" or "ingat" → write to `.memory/` immediately.
```

---

## platform .memory/000 Template

Same as `.memory/000 Template` above, with one change to the title line:

```markdown
# 000 — How to Use .memory (<PLATFORM_NAME>-scoped)
```

Replace `<PLATFORM_NAME>` with the platform folder name (e.g. `api`, `fe`, `admin`). Rest of content identical.

---

## docs/README.md Template

```markdown
# <PROJECT_NAME> Docs Index

All documentation lives in `/docs/` with a flat naming scheme.

> **Stack:** <TECH_STACK_SUMMARY>

## Naming Convention

- `SPEC_<SCOPE>_<YYYY-MM-DD>_<slug>.md` — full feature specs
- `DESIGN_<SCOPE>_<slug>.md` — design system docs
- `GUIDE_<SCOPE>_<slug>.md` — workflows and how-tos

## Specs

_(Add entries here as specs are written)_

## Design System

_(Add entries here as design docs are created)_

---

## Implementation Workflow

1. Open spec file for complete code and step-by-step instructions
2. Follow tasks in sequence using checkbox syntax
3. Verify each task with provided commands
4. Commit after each task completes

**Tool:** Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` for autonomous implementation.
```
