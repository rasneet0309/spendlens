const CARD = {
  background: 'var(--paper-raised)',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  padding: '24px 28px',
  maxWidth: 760,
};

export default function HowItWorksPage() {
  return (
    <div style={CARD}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 0 }}>How this works</h2>

      <h3 style={h3}>What the project does</h3>
      <p style={p}>
        Spendlens turns a messy, multi-currency expense list into a single-page dashboard: it converts everything
        to USD against a static rate snapshot, ranks spend by category and merchant, and lets you filter, sort,
        and add new expenses without writing a line of code. Everything runs in the browser, there's no backend
        and no live exchange-rate API.
      </p>

      <h3 style={h3}>Running it locally</h3>
      <p style={p}>Clone the repo, then from the project root:</p>
      <pre style={pre}>{`npm install
npm run dev`}</pre>
      <p style={p}>That starts a local server (Vite prints the URL, usually <code>http://localhost:5173</code>).</p>
      <p style={p}>Live URL: <a href="https://spendlens-indol.vercel.app/" target="_blank" rel="noreferrer"><strong>spendlens-indol.vercel.app</strong></a></p>

      <h3 style={h3}>File &amp; folder guide</h3>
      <ul style={ul}>
        <li><code>src/data/rates.js</code>: the static rate snapshot and the 20 seed expenses. The single source of truth.</li>
        <li><code>src/utils/currency.js</code>, all conversion math: <code>toUSD</code>, formatting helpers, and the functions that build the category summary, overall total, and top-merchants list.</li>
        <li><code>src/components/Dashboard.jsx</code>, owns the expense list state and wires the summary cards, filter, table, what-if slider, and add-expense form together.</li>
        <li><code>src/components/ExpenseTable.jsx</code>, <code>CategoryFilter.jsx</code>, <code>AddExpenseForm.jsx</code>, <code>WhatIfSlider.jsx</code>: the four MVP/stretch features, each self-contained.</li>
        <li><code>src/components/NotesPage.jsx</code>, <code>HowItWorksPage.jsx</code>, <code>CeoBriefPage.jsx</code>, <code>EdgeCasesPage.jsx</code>: the four written deliverables, rendered in-app as tabs (and mirrored as <code>docs/*.md</code> in the repo).</li>
      </ul>

      <h3 style={h3}>Known limitations / what I'd fix with 4 more hours</h3>
      <ul style={ul}>
        <li>No persistence, added expenses vanish on refresh. Would add localStorage or a tiny backend.</li>
        <li>The what-if slider only covers EUR. With more time I'd generalize it to any currency in the table.</li>
        <li>No automated tests, <code>currency.js</code> is pure functions and the highest-value thing to unit test first.</li>
        <li>Mobile layout is responsive but not hand-tuned; the expense table scrolls horizontally on narrow screens rather than reflowing to cards.</li>
        <li>No undo/delete for added expenses, and no inline edit of existing rows.</li>
      </ul>

      <h3 style={h3}>Assumptions</h3>
      <ul style={ul}>
        <li>Rates are a fixed snapshot, not live, to match the brief's "no external API required."</li>
        <li>"Largest transaction" per category means the single highest USD-converted line item, not a sum.</li>
        <li>Added expenses are validated (no empty merchant, no zero/negative amount, date required) but are otherwise trusted; there's no duplicate-detection.</li>
      </ul>
    </div>
  );
}

const h3 = { fontSize: 15, fontWeight: 700, marginTop: 22, marginBottom: 6 };
const p = { fontSize: 14, lineHeight: 1.65, color: 'var(--ink)', margin: '0 0 8px' };
const ul = { fontSize: 14, lineHeight: 1.7, paddingLeft: 20, margin: 0 };
const pre = {
  background: 'var(--paper)',
  border: '1px solid var(--rule)',
  borderRadius: 4,
  padding: '10px 14px',
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  overflowX: 'auto',
};
