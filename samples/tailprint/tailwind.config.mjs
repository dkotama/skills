/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts,tsx}'],
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
    },
  },
  plugins: [],
};
