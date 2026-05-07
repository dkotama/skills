# TailPrint — Tailwind Config + CSS Tokens

## tailwind.config.js

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'tp-bg':      '#f5f8fa',
        'tp-dark':    '#182026',
        'tp-gray':    '#5c7080',
        'tp-border':  '#d8e1e8',
        'tp-primary': 'var(--tp-accent)',
        'tp-success': '#0f9960',
        'tp-danger':  '#db3737',
        'tp-warning': '#d9822b',
      },
      boxShadow: {
        'tp-input':  'inset 0 0 0 1px rgba(16,22,26,0.15), inset 0 1px 1px rgba(16,22,26,0.2)',
        'tp-button': 'inset 0 0 0 1px rgba(16,22,26,0.2), inset 0 -1px 0 rgba(16,22,26,0.1)',
        'tp-card':   '0 0 0 1px rgba(16,22,26,0.15), 0 1px 1px rgba(16,22,26,0.2)',
        'tp-active': 'inset 0 1px 2px rgba(16,22,26,0.2)',
      },
      borderRadius: { 'tp': '3px' },
      fontFamily: {
        'tp-sans': ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        'tp-mono': ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        'tp-xs':   ['11px', { lineHeight: '16px' }],
        'tp-sm':   ['12px', { lineHeight: '16px' }],
        'tp-base': ['13px', { lineHeight: '20px' }],
        'tp-ui':   ['14px', { lineHeight: '20px' }],
      },
    }
  }
}
```

## CSS Variables (global.css)

```css
:root {
  --tp-accent:       #137cbd;
  --tp-accent-dark:  #106ba3;
  --tp-accent-text:  #ffffff;
  --tp-surface:      #f5f8fa;
  --tp-sidebar-bg:   #30404d;
  --tp-sidebar-text: #f5f8fa;
}
[data-theme="dark"] {
  --tp-surface:      #293742;
  --tp-sidebar-bg:   #1c252b;
  --tp-accent:       #2b95d6;
}
[data-tenant="novatech"] {
  --tp-accent:       #7b3fa0;
  --tp-accent-dark:  #6b2fa0;
  --tp-sidebar-bg:   #2d1f38;
}
[data-tenant="acmecorp"] {
  --tp-accent:       #bf7326;
  --tp-accent-dark:  #a05a20;
  --tp-sidebar-bg:   #3d2b1f;
}
```

Tenant swap: `<html data-tenant="novatech">`. Dark mode: `<html data-theme="dark">`.

## Anti-flash Script (Astro / SSR)

Reads localStorage before first paint — prevents theme flicker:

```astro
<script is:inline>
  (function () {
    var t = localStorage.getItem('tp-theme');
    var n = localStorage.getItem('tp-tenant');
    if (t) document.documentElement.dataset.theme = t;
    if (n) document.documentElement.dataset.tenant = n;
  })();
</script>
```

Place as first `<script>` in `<head>`, before any CSS loads.
