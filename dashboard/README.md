# Dashboard — Canadian Retail Margin Analysis

The scroll-driven analytical report that presents the findings from this project.

**Live:** https://canadian-retail-margin-report.vercel.app

## Stack

- React 18 + Vite
- Recharts (charts)
- Framer Motion (scroll-triggered reveals)
- Deployed on Vercel

## Design notes

Deliberately built as an **editorial report** rather than an interactive filter dashboard.
The analysis has a conclusion; filters would re-open questions the analysis already answers.
Interactivity is limited to hover tooltips and collapsible "View the SQL" panels.

Query results are baked into `src/data.js` as static values rather than fetched live from
Supabase. The findings are fixed historical results, so a live connection would add loading
states, error states, and a dependency that could break for a reader opening the link weeks later.

## Running locally

```bash
npm install
npm run dev
```

## Structure

```
dashboard/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx              # All 11 report sections
    ├── main.jsx
    ├── index.css            # Palette, typography, responsive rules
    ├── data.js              # Baked query results + SQL snippets
    └── components/
        ├── Charts.jsx       # All 7 chart components
        ├── Reveal.jsx       # Scroll-triggered fade-up wrapper
        ├── CountUp.jsx      # Animated number counter
        ├── SqlToggle.jsx    # Collapsible SQL panel
        └── Tip.jsx          # Shared chart tooltip
```
