# dkotama/skills

[![License](https://badgen.net/badge/license/MIT/blue)](./LICENSE)
[![Skills](https://badgen.net/badge/skills/1/purple)](https://dkotama.github.io/skills)
[![Stars](https://badgen.net/github/stars/dkotama/skills)](https://github.com/dkotama/skills/stargazers)

Curated Claude Code skills handcrafted by I Nyoman Darma Kotama.

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

Build high-density, professional UI pages using the TailPrint design system — Blueprint aesthetic via Tailwind CSS. No BlueprintJS dependency.

Target use cases: ERP dashboards, IoT monitoring, accounting, warehouse management.

```
/plugin install tailprint-builder@dkotama-skills
```

Invoke: `/tailprint-builder:tailprint-builder`

Details: https://dkotama.github.io/skills/plugins/tailprint-builder

---

## Repo Structure

```
.claude-plugin/
  marketplace.json          plugin registry

skills/
  tailprint-builder/
    tailprint-builder.md    skill source (self-contained)

samples/
  tailprint/                Next.js reference app (coming soon)

docs/                       GitHub Pages root
  index.html                marketplace home
  assets/
    style.css
    logo.svg
  plugins/
    tailprint-builder/
      index.html            plugin detail page
      preview/              screenshots
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
