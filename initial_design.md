# Design Doc: TailPrint (Blueprint Aesthetic via Tailwind)

**Project Name:** TailPrint  
**Author:** Gemini & Collaborator  
**Status:** Initial Specification  
**Last Updated:** 2026-05-07

---

## 1. Objective
To provide a comprehensive set of design tokens and implementation patterns for **TailPrint**—a styling system that delivers the high-density, professional "industrial" look of **BlueprintJS** using only **Tailwind CSS**. This document serves as the first initialization guide and component dictionary.

## 2. Background
Professional tools (accounting, IoT monitoring, TCG asset trackers) require high information density. While modern UI libraries favor large touch targets and generous white space, professional users prefer "at-a-glance" visibility. **TailPrint** extracts the visual DNA of Blueprint—crisp 3px corners, inset shadows, and muted color scales—and makes them portable via Tailwind.

## 3. Initial Setup (Initialization)

To initialize **TailPrint**, your `tailwind.config.js` must be configured with Blueprint-specific design tokens.

### A. The Config Extension
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Blueprint's "Core" scale
        'tp-bg': '#f5f8fa',       // Light gray background
        'tp-dark': '#182026',     // Primary text/header color
        'tp-gray': '#5c7080',     // Muted text color
        'tp-border': '#d8e1e8',   // Standard divider color
        'tp-primary': '#137cbd',  // Signature blue
        'tp-success': '#0f9960',  // Signature green
      },
      boxShadow: {
        // Blueprint's crisp "inset" borders
        'tp-input': 'inset 0 0 0 1px rgba(16, 22, 26, 0.15), inset 0 1px 1px rgba(16, 22, 26, 0.2)',
        'tp-button': 'inset 0 0 0 1px rgba(16, 22, 26, 0.2), inset 0 -1px 0 rgba(16, 22, 26, 0.1)',
        'tp-card': '0 0 0 1px rgba(16, 22, 26, 0.15), 0 1px 1px rgba(16, 22, 26, 0.2)',
      },
      borderRadius: {
        'tp': '3px', // Blueprint's standard 3px radius
      }
    }
  }
}
```

---

## 4. Component Dictionary

### A. The Data Table (The Core)

*   **Definition:** The primary tool for ledger and asset management.
*   **TailPrint Implementation:**
    *   **Header:** `bg-[#ebf1f5] text-[11px] font-semibold text-tp-gray uppercase tracking-wider h-8`.
    *   **Cell:** `px-2 py-1 border-r border-tp-border text-[13px] tabular-nums`.
    *   **Logic:** Uses `border-collapse` and `divide-x` to create the "grid" feel.

### B. The Sidebar (Navigation)

*   **Definition:** A collapsible, high-contrast nav panel for switching domains (e.g., Stock Screeners, IoT Nodes).
*   **TailPrint Implementation:**
    *   **Container:** `w-52 bg-[#30404d] text-[#f5f8fa] h-screen flex flex-col`.
    *   **Item:** `px-3 py-1.5 hover:bg-[#394b59] flex items-center gap-2 text-[13px] transition-none`.
    *   **Active State:** `bg-tp-primary text-white`.

### C. The Buttons (Intent-Based)
*   **Definition:** Small, tactile triggers for actions like "Reconcile" or "Export."
*   **TailPrint Implementation:**
    *   **Base:** `h-7 px-3 rounded-tp shadow-tp-button text-[13px] font-medium`.
    *   **Interaction:** `active:shadow-[inset_0_1px_2px_rgba(16,22,26,0.2)] active:bg-[#d8e1e8]`.

### D. The Callout (Alerts/Status)
*   **Definition:** A full-width banner used to signify system status (e.g., "IoT Node Offline").
*   **TailPrint Implementation:**
    *   **Success:** `bg-[#d5eae2] text-tp-success p-3 rounded-tp border-l-4 border-tp-success`.
    *   **Danger:** `bg-[#fbeae5] text-[#db3737] p-3 rounded-tp border-l-4 border-[#db3737]`.

### E. Inputs & Selects
*   **Definition:** Single-line data entry points.
*   **TailPrint Implementation:**
    *   **Standard:** `h-[30px] px-2.5 bg-white shadow-tp-input rounded-tp text-[14px] outline-none focus:ring-2 focus:ring-tp-primary/50`.

---

## 5. Layout Strategy

To implement a full admin screen, TailPrint follows a **Holy Grail** layout:

1.  **Wrapper:** `flex h-screen bg-tp-bg`.
2.  **Sidebar:** `flex-shrink-0 w-52`.
3.  **Content Area:** `flex-1 flex flex-col`.
4.  **Header:** `h-10 bg-white border-b border-tp-border flex items-center px-4`.
5.  **Main:** `flex-1 overflow-auto p-4`.

---

## 6. Success Metrics
*   **Data Density:** Ability to fit at least 25 rows and 8 columns on a standard 1080p screen without scrolling.
*   **Zero-JS Hydration:** No `useClient` required for pure layout components.
*   **Visual Fidelity:** Side-by-side comparison with `@blueprintjs/core` shows <5% visual variance in colors and spacing.
