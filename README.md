# Spendlens, Expense Dashboard

A multi-currency expense dashboard built for the Spendlens Product Analyst Intern case study. It converts 20 sample expenses across 10 currencies into USD using a static rate snapshot, ranks spend by category and merchant, and lets you filter, sort, and add new expenses live in the browser.

**Live URL:** https://spendlens-indol.vercel.app/
**Full written deliverables** (written response, CEO brief, edge cases) are also visible inside the app under the **About / Notes**, **CEO Brief**, and **Edge Cases** tabs, `docs/` below mirrors them as plain markdown.

## What this project does

Spendlens turns a messy, multi-currency expense list into a single-page dashboard: it converts everything to USD against a static rate snapshot, ranks spend by category and merchant, and lets you filter, sort, and add new expenses without writing a line of code. Everything runs in the browser, there's no backend and no live exchange-rate API.

## Running it locally

```bash
npm install
npm run dev
```

This starts a local dev server (Vite prints the URL, usually `http://localhost:5173`).

To produce a production build:

```bash
npm run build
npm run preview
```

## File & folder guide

| Path | What it's for |
|---|---|
| `src/data/rates.js` | Static rate snapshot and the 20 seed expenses. Single source of truth. |
| `src/utils/currency.js` | All conversion math: `toUSD`, formatting helpers, and the functions that build the category summary, overall total, and top-merchants list. |
| `src/components/Dashboard.jsx` | Owns the expense list state; wires the summary cards, filter, table, what-if slider, and add-expense form together. |
| `src/components/ExpenseTable.jsx` | Sortable (date / USD amount, asc/desc) expense table. |
| `src/components/CategoryFilter.jsx` | Click-to-filter category chips (click again to clear). |
| `src/components/AddExpenseForm.jsx` | Add-expense form with validation (no empty fields, no zero/negative amounts). In-memory only, no persistence. |
| `src/components/WhatIfSlider.jsx` | Stretch feature: live EUR/USD rate slider (0.80–1.10) that recalculates EUR-denominated totals in real time. |
| `src/components/NotesPage.jsx` | Part A written response (currency-logic design rationale). |
| `src/components/HowItWorksPage.jsx` | In-app mirror of this README. |
| `src/components/CeoBriefPage.jsx` | In-app mirror of `docs/ceo-brief.md`. |
| `src/components/EdgeCasesPage.jsx` | In-app mirror of `docs/edge-cases.md`. |
| `docs/ceo-brief.md` | Plain-English brief for the CEO. |
| `docs/edge-cases.md` | Bonus: 9 failure modes and how they're handled. |

## Known limitations & what I'd fix with 4 more hours

- **No persistence**, added expenses vanish on refresh. Would add `localStorage` or a tiny backend (Supabase/Firebase) next.
- **What-if slider only covers EUR.** With more time I'd generalize it to any currency in the table.
- **No automated tests**, `currency.js` is pure functions and the highest-value thing to unit test first (rate validation, rounding, empty-state aggregation).
- **Mobile layout is responsive but not hand-tuned**, the expense table scrolls horizontally on narrow screens rather than reflowing into cards.
- **No undo/delete/edit** for added expenses.

## Assumptions

- Rates are a fixed snapshot, not live, to match the brief's "no external API required."
- "Largest transaction" per category means the single highest USD-converted line item, not a sum.
- Added expenses are validated (no empty merchant, no zero/negative amount, date required) but otherwise trusted, no duplicate-detection.
- Conversion convention: `RATES` stores units of foreign currency per 1 USD, so `USD value = amount / rate`.

## Tech stack

React + Vite, no external UI library, no backend. Deployed on Vercel.
