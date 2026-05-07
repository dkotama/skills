# TailPrint — UI Component Recipes

## Sidebar

```tsx
<nav className="w-52 bg-[#30404d] text-[#f5f8fa] h-screen flex flex-col flex-shrink-0">
  <div className="h-10 flex items-center px-4 border-b border-white/10 font-semibold text-tp-base">
    AppName
  </div>
  <div className="flex-1 overflow-y-auto py-2">
    <a href="#" className="flex items-center gap-2 px-3 py-1.5 text-tp-base transition-none hover:bg-[#394b59]">
      Item
    </a>
    {/* Active: */}
    <a href="#" className="flex items-center gap-2 px-3 py-1.5 text-tp-base transition-none bg-tp-primary text-white">
      Active Item
    </a>
  </div>
  {/* Version badge at bottom */}
  <div className="h-8 flex items-center justify-center border-t border-white/10 text-tp-xs opacity-40">
    v1.2.0
  </div>
</nav>
```

## Top Header

```tsx
<header className="h-10 bg-white border-b border-tp-border flex items-center px-4 gap-4 flex-shrink-0">
  <span className="text-tp-gray text-tp-sm">Breadcrumb / Path</span>
  <div className="flex-1" />
  <img src="..." className="w-6 h-6 rounded-full" />
</header>
```

## Data Table

```tsx
<table className="w-full border-collapse text-tp-base">
  <thead>
    <tr className="bg-[#ebf1f5]">
      <th className="px-2 h-8 text-left text-tp-xs font-semibold text-tp-gray uppercase tracking-wider border-b border-tp-border">
        Column
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-tp-border">
    <tr className="hover:bg-[#f0f4f7]">
      <td className="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border">
        Data
      </td>
    </tr>
  </tbody>
</table>
```

## Button (Intent-Based)

```tsx
{/* Primary */}
<button className="h-7 px-3 rounded-tp shadow-tp-button text-tp-base font-medium bg-tp-primary text-white active:shadow-tp-active">
  Action
</button>
{/* Default */}
<button className="h-7 px-3 rounded-tp shadow-tp-button text-tp-base font-medium bg-white text-tp-dark active:shadow-tp-active active:bg-[#d8e1e8]">
  Action
</button>
```

## Input

```tsx
<input className="h-[30px] px-2.5 bg-white shadow-tp-input rounded-tp text-tp-ui outline-none focus:ring-2 focus:ring-tp-primary/50 w-full" />
```

## Select

```tsx
<select className="h-[30px] px-2 bg-white shadow-tp-input rounded-tp text-tp-ui outline-none focus:ring-2 focus:ring-tp-primary/50">
  <option value="">All</option>
</select>
```

## Badge (Status)

```tsx
{/* Online */}
<span className="inline-flex items-center px-1.5 py-0.5 rounded-tp text-tp-xs font-semibold bg-[#d5eae2] text-tp-success">online</span>
{/* Offline */}
<span className="inline-flex items-center px-1.5 py-0.5 rounded-tp text-tp-xs font-semibold bg-[#fbeae5] text-tp-danger">offline</span>
{/* Warning */}
<span className="inline-flex items-center px-1.5 py-0.5 rounded-tp text-tp-xs font-semibold bg-[#fef3e2] text-tp-warning">warning</span>
```

## Card / Stat Block

```tsx
<div className="shadow-tp-card rounded-tp bg-white p-4">
  <div className="text-tp-sm text-tp-gray uppercase tracking-wider mb-1">Label</div>
  <div className="text-2xl font-semibold font-tp-mono tabular-nums text-tp-dark">1,234</div>
  <div className="text-tp-xs text-tp-success mt-1">↑ 12% vs last period</div>
</div>
```

## Callout

```tsx
{/* Success */}
<div className="bg-[#d5eae2] text-tp-success p-3 rounded-tp border-l-4 border-tp-success text-tp-base">
  Message
</div>
{/* Danger */}
<div className="bg-[#fbeae5] text-tp-danger p-3 rounded-tp border-l-4 border-tp-danger text-tp-base">
  Message
</div>
{/* Warning */}
<div className="bg-[#fef3e2] text-tp-warning p-3 rounded-tp border-l-4 border-tp-warning text-tp-base">
  Message
</div>
{/* Info */}
<div className="bg-[#e3f1fb] text-tp-primary p-3 rounded-tp border-l-4 border-tp-primary text-tp-base">
  Message
</div>
```

## Progress Bar

```tsx
<div className="h-2 bg-[#ebf1f5] rounded-tp overflow-hidden">
  <div className="h-full bg-tp-primary rounded-tp" style={{ width: '67%' }} />
</div>
```

## Toggle

```tsx
<label className="inline-flex items-center gap-2 cursor-pointer">
  <input type="checkbox" className="sr-only peer" />
  <div className="w-8 h-4 bg-[#d8e1e8] rounded-full peer-checked:bg-tp-primary transition-none relative">
    <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow peer-checked:translate-x-4 transition-none" />
  </div>
  <span className="text-tp-base text-tp-dark">Label</span>
</label>
```

## Modal

```tsx
{/* Backdrop */}
<div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
  {/* Dialog */}
  <div className="bg-white rounded-tp shadow-tp-card w-96 p-4 z-50">
    <div className="text-tp-ui font-semibold text-tp-dark mb-3">Title</div>
    <div>{/* content */}</div>
    <div className="mt-4 flex justify-end gap-2">
      <button className="h-7 px-3 rounded-tp shadow-tp-button text-tp-base bg-white text-tp-dark">Close</button>
      <button className="h-7 px-3 rounded-tp shadow-tp-button text-tp-base bg-tp-primary text-white">Confirm</button>
    </div>
  </div>
</div>
```
