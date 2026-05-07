# TailPrint — ApexCharts Integration

ApexCharts loaded once via CDN in `Shell.astro`. Data computed server-side in frontmatter, passed to inline scripts via `define:vars`.

## CDN (Shell.astro `<head>`)

```html
<script is:inline src="https://cdn.jsdelivr.net/npm/apexcharts@3.54.0/dist/apexcharts.min.js"></script>
```

Never import from npm — CDN only. Already loaded globally on every page.

## Data Injection Pattern

```astro
---
// Compute all data in frontmatter — never fetch in script
const chartData = {
  categories: ['A', 'B', 'C'],
  values: [10, 20, 30],
};
---
<div id="my-chart" class="h-56"></div>

<script is:inline define:vars={{ chartData }}>
  new ApexCharts(document.getElementById('my-chart'), {
    chart: { type: 'bar', height: 224, fontFamily: '"IBM Plex Sans", system-ui', toolbar: { show: false } },
    series: [{ name: 'Value', data: chartData.values }],
    xaxis: { categories: chartData.categories },
    colors: ['#137cbd'],
    grid: { borderColor: '#d8e1e8', strokeDashArray: 3 },
    dataLabels: { enabled: false },
  }).render();
</script>
```

`<script>` must use `is:inline` when using `define:vars` — Astro requirement.

## TailPrint Color Palette

| Token | Hex | Use |
|-------|-----|-----|
| Primary | `#137cbd` | Main / default series |
| Success | `#0f9960` | Online / credit / positive |
| Danger | `#db3737` | Offline / debit / negative |
| Warning | `#d9822b` | Warning states |
| Gray | `#5c7080` | Neutral / draft |
| Border | `#d8e1e8` | Grid lines |

**ApexCharts does not support CSS variables in color arrays.** Always use hex. Tenant theme changes do NOT update chart colors.

## Chart Types

### Horizontal Grouped Bar (IoT status by warehouse)

```javascript
new ApexCharts(document.getElementById('chart-iot'), {
  chart: { type: 'bar', height: 224, fontFamily: tpFont, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, dataLabels: { position: 'top' } } },
  series: [
    { name: 'Online',  data: [12, 8, 10] },
    { name: 'Warning', data: [2, 3, 1] },
    { name: 'Offline', data: [1, 2, 0] },
  ],
  xaxis: { categories: ['WH-A', 'WH-B', 'WH-C'] },
  colors: ['#0f9960', '#d9822b', '#db3737'],
  grid: { borderColor: '#d8e1e8', strokeDashArray: 3 },
  dataLabels: { enabled: false },
}).render();
```

### Vertical Grouped Bar (Inventory / Finance)

```javascript
new ApexCharts(document.getElementById('chart-finance'), {
  chart: { type: 'bar', height: 224, fontFamily: tpFont, toolbar: { show: false } },
  series: [
    { name: 'Debit',  data: [50000, 30000, 20000] },
    { name: 'Credit', data: [45000, 28000, 22000] },
  ],
  xaxis: { categories: ['Manufacturing', 'Logistics', 'Admin'] },
  colors: ['#db3737', '#0f9960'],
  grid: { borderColor: '#d8e1e8', strokeDashArray: 3 },
  dataLabels: { enabled: false },
  yaxis: { labels: { formatter: function(v) { return '$' + v.toLocaleString(); } } },
}).render();
```

### Donut (AR Aging)

```javascript
new ApexCharts(document.getElementById('chart-ar'), {
  chart: { type: 'donut', height: 224, fontFamily: tpFont },
  series: [12, 4, 7, 2],
  labels: ['Paid', 'Overdue', 'Pending', 'Draft'],
  colors: ['#0f9960', '#db3737', '#d9822b', '#5c7080'],
  legend: { position: 'bottom' },
  dataLabels: { enabled: true },
  plotOptions: { pie: { donut: { size: '60%' } } },
}).render();
```

## Rules

- `is:inline` required on `<script>` when using `define:vars`
- Never npm install ApexCharts
- Compute all data in frontmatter — never fetch client-side
- Container div needs explicit height — `h-56` (224px) minimum for readability
- Use `toolbar: { show: false }` — hides ApexCharts download/zoom toolbar
