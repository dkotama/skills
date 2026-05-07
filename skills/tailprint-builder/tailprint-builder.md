---
name: tailprint-builder
description: Build high-density, professional UI pages using the TailPrint design system — Blueprint aesthetic via Tailwind CSS. Use when the user wants to create ERP, IoT monitoring, accounting, warehouse, or any professional admin interface. Activates on prompts like "build a dashboard with TailPrint", "create a data table page", "ERP-style UI", "Blueprint look without BlueprintJS".
---

# TailPrint Builder

TailPrint delivers the BlueprintJS visual aesthetic using only Tailwind CSS. No BlueprintJS dependency. Target: professional ERP, IoT monitoring, accounting, and warehouse management interfaces.

## Core Aesthetic Rules — Never Break

- Corner radius: `rounded-tp` (3px) — never `rounded-lg`, `rounded-xl`, `rounded-full` on controls
- Control height: `h-[30px]` for inputs/selects, `h-7` for buttons
- Data cells: always `font-tp-mono tabular-nums`
- Nav items: `transition-none` — zero animation
- Shadows: inset-style (`shadow-tp-input`, `shadow-tp-button`, `shadow-tp-card`)
- Font: IBM Plex Sans for UI, IBM Plex Mono for data

## Root Layout

```tsx
// Holy Grail: sidebar + header + main
<div className="flex h-screen bg-tp-bg font-tp-sans">
  <Sidebar />
  <div className="flex-1 flex flex-col overflow-hidden">
    <TopHeader />
    <main className="flex-1 overflow-auto p-4">
      {children}
    </main>
  </div>
</div>
```

## Density Target

25 rows × 8 columns visible at 1080p without scrolling. Achieve via:
- `h-8` table headers
- `py-1` table rows (not `py-3`)
- `text-tp-base` (13px) in cells, not 16px+

## Anti-Patterns

- DON'T use `rounded-lg` — breaks Blueprint DNA
- DON'T use animation/transition on sidebar nav items
- DON'T use `text-base` (16px) for table cells — use `text-tp-base` (13px)
- DON'T import BlueprintJS — this system is dependency-free
- DON'T use `useClient` for layout components — keep them server-side
- DON'T skip `tabular-nums` on numeric data — columns will misalign

## Companion Files

Read these on demand — only when the task requires it:

| Need | File |
|------|------|
| Project setup (Tailwind config, CSS tokens, dark/tenant vars) | `skills/tailprint-builder/config/tailwind.md` |
| UI component markup (Table, Button, Badge, Card, etc.) | `skills/tailprint-builder/recipes/components.md` |
| Search input + dropdown filter wiring | `skills/tailprint-builder/recipes/search-filter.md` |
| Click-to-sort on table columns | `skills/tailprint-builder/recipes/sort-table.md` |
| ApexCharts CDN integration + chart patterns | `skills/tailprint-builder/recipes/apexcharts.md` |
