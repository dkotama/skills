# dkotama/skills

[![License](https://badgen.net/badge/license/MIT/blue)](./LICENSE)
[![Skills](https://badgen.net/badge/skills/2/purple)](https://dkotama.github.io/skills)
[![Stars](https://badgen.net/github/stars/dkotama/skills)](https://github.com/dkotama/skills/stargazers)

Curated skills for **Claude Code** and **OpenCode** — handcrafted by I Nyoman Darma Kotama.

Skills are self-contained agent instructions that load into your AI coding assistant's context. Covers frontend UI systems and project workflow tooling.

**Showcase site:** https://dkotama.github.io/skills

---

## Install

Add this marketplace to Claude Code once:

```
/plugin marketplace add dkotama/skills
```

Then browse and install individual skills:

```
/plugin list available --marketplace dkotama-skills
/plugin install <skill-name>@dkotama-skills
```

---

## Available Skills

### tailprint-builder

**Blueprint.js aesthetic using only Tailwind CSS** — no BlueprintJS dependency.

TailPrint is a Tailwind CSS design system that replicates the high-density, industrial look of Blueprint.js. Built for professional admin UIs: ERP dashboards, IoT monitoring, accounting, and warehouse management. Charts via ApexCharts (CDN). Supports multi-tenant theming and dark mode.

```
/plugin install tailprint-builder@dkotama-skills
```

Invoke: `/tailprint-builder:tailprint-builder`

Details: https://dkotama.github.io/skills/plugins/tailprint-builder

---

### monorepo-init

**Bootstrap a new project with full scaffold** — interview-driven, idempotent.

Runs a 6-question interview, then writes `CLAUDE.md`, `.memory/`, `docs/README.md`, `PRD.md`, and either `TASK.md` or a `docs/SPEC_*.md` (if using superpowers skills). Writes per-platform memory folders. Safe to re-run — never overwrites memory files, prompts before touching `CLAUDE.md` or `PRD.md`.

```
/plugin install monorepo-init@dkotama-skills
```

Invoke: `/monorepo-init:monorepo-init`

Details: https://dkotama.github.io/skills/plugins/monorepo-init

---

## Repo Structure

```
.claude-plugin/
  marketplace.json          plugin registry

skills/
  tailprint-builder/
    tailprint-builder.md    skill entry
    config/                 tailwind config, design tokens
    recipes/                component markup, chart patterns, filters
  monorepo-init/
    monorepo-init.md        skill entry
    config/                 file templates
    recipes/                interview flow, execution steps

samples/
  tailprint/                Astro sample app

docs/                       GitHub Pages root
  index.html                marketplace home
  assets/
    style.css
    logo.svg
  plugins/
    tailprint-builder/
      index.html            plugin detail page
      preview/              screenshots
    monorepo-init/
      index.html            plugin detail page
```

---

## GitHub Pages Setup

In repo **Settings -> Pages**, set source to `docs/` folder on `main` (or `master`) branch.

---

## Adding a New Skill

1. Add skill source to `skills/<skill-name>/`
2. Add entry to `.claude-plugin/marketplace.json`
3. Create `docs/plugins/<skill-name>/index.html`
4. Add a card to `docs/index.html`

---

## License

MIT
