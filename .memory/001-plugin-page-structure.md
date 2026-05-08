# 001 — Plugin Page Structure

Each skill plugin follows this exact structure. Validated on `tailprint-builder`.

## File Tree

```
.claude-plugin/
  marketplace.json              ← add plugin entry here (bump marketplace version only when plugin list changes)
  plugin.json                   ← per-plugin version + metadata (bump this for skill content changes)

skills/
  <skill-name>/
    <skill-name>.md             ← lean entry: frontmatter + core rules + companion file index
    config/                     ← setup/config companion files (tailwind, tokens, env, etc.)
    recipes/                    ← interaction patterns, component snippets, integrations

docs/
  index.html                    ← add a card for the new plugin
  plugins/
    <skill-name>/
      index.html                ← plugin detail page
      preview/
        *.png                   ← real screenshots, no placeholders

samples/
  <skill-name>/                 ← Astro static site preview (optional, deployed to Cloudflare Pages)
```

## marketplace.json Entry

```json
{
  "name": "<skill-name>",
  "description": "...",
  "source": "./",
  "category": "frontend"
}
```

## Skill File Frontmatter

```yaml
---
name: <skill-name>
description: <one-liner — include trigger phrases for agent activation>
---
```

## Plugin Detail Page — Section Order

1. **Hero** — title, version badge, category badge, tagline, Live Preview button (if deployed), install-box
2. **What It Does** — bullet list; name actual libraries used (e.g. ApexCharts CDN)
3. **When to Use** — 4 bullets, use-case focused
4. **How to Use** — 3 example prompts + invoke command
5. **Preview** — real PNGs with lightbox (click to enlarge, Escape to close)
6. **Design Docs** — link to skill source on GitHub; do NOT link external repos
7. **Source & Changelog** — link to `skills/<name>/` on GitHub + version table

## Rules

- Design docs live IN the skill file — never link to a separate external repo
- Preview images: real screenshots only on launch, no "Coming soon"
- Charts: ApexCharts via CDN (`cdn.jsdelivr.net/npm/apexcharts@3.54.0`), never npm
- Lightbox: vanilla JS only, no external library
- Sample app: Astro static output — do not call it Next.js
- Fonts: IBM Plex Sans (UI) + IBM Plex Mono (data)

## Install Paths

**Claude Code**
```
/plugin marketplace add dkotama/skills
/plugin install <skill-name>@dkotama-skills
```

**OpenCode** — tell your agent:
```
Fetch https://raw.githubusercontent.com/dkotama/skills/master/skills/<skill-name>/<skill-name>.md
and save it to .claude/skills/<skill-name>/<skill-name>.md
```
