# 001 — Plugin Page Structure

Each skill plugin follows this exact structure. Validated on `tailprint-builder`.

## File Tree

```
.claude-plugin/
  marketplace.json              ← add plugin entry here

skills/
  <skill-name>/
    <skill-name>.md             ← self-contained skill source (frontmatter + full spec)

docs/
  index.html                    ← add a card for the new plugin
  plugins/
    <skill-name>/
      index.html                ← plugin detail page
      preview/
        *.png                   ← real screenshots, no placeholders
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
compatibility: opencode, claude-code
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
- Sample app: Astro — do not call it Next.js
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
