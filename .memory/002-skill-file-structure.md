# 002 — Skill File Structure

Skills use a lean entry file + companion files read on demand. Modeled on the superpowers plugin pattern. Validated on `tailprint-builder` v1.2.0.

## Why

A self-contained single file bloats as the skill grows. Companion files let Claude load only what the task needs — config when setting up, a specific recipe when implementing a feature.

## Structure

```
skills/<skill-name>/
├── <skill-name>.md        ← entry: core rules + companion index table (~50 lines max)
├── config/
│   └── *.md               ← framework/tool config, design tokens, env setup
└── recipes/
    └── *.md               ← interaction patterns, component markup, library integrations
```

## Entry File Format

```markdown
---
name: <skill-name>
description: <trigger phrases>
---

# Title
<2–3 sentence overview>

## Core Rules — Never Break
<short, always-needed rules>

## Companion Files
| Need | File |
|------|------|
| Setup / config | skills/<name>/config/<file>.md |
| Component markup | skills/<name>/recipes/components.md |
| <Feature> | skills/<name>/recipes/<feature>.md |
```

## When to Split Into Companions

- Entry file exceeds ~100 lines → move bulky sections to companions
- Config block (tailwind, CSS vars) → `config/`
- Component markup snippets → `recipes/components.md`
- Each distinct interaction pattern → own file in `recipes/`

## Version Bumping (plugin.json only)

- Add/split companion file → minor bump (1.1.0 → 1.2.0)
- Fix/update existing companion → patch bump (1.2.0 → 1.2.1)
- New major capability → major bump (1.x.x → 2.0.0)
- Never bump `marketplace.json` for per-skill content changes

## Real Example

`tailprint-builder` v1.2.0:
- Entry: 55 lines
- `config/tailwind.md` — Tailwind config + CSS tokens + anti-flash script
- `recipes/components.md` — all UI component markup
- `recipes/search-filter.md` — search + dropdown filter wiring
- `recipes/sort-table.md` — ColumnDef + initSortableTable source
- `recipes/apexcharts.md` — CDN, define:vars, chart types, color palette
