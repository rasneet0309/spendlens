const CARD = {
  background: 'var(--paper-raised)',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  padding: '24px 28px',
};

const CASES = [
  {
    title: '1. Zero or negative amount',
    wrong: 'A typo like "-50" or "0" for an expense would distort totals (negative spend silently reducing a category total) or contribute a meaningless $0 line.',
    handles: 'The Add Expense form rejects amount ≤ 0 before it ever reaches state, with an inline error.',
    correct: 'Block submission with a clear message. (Existing seed data has no such rows, so this only applies to user-added entries.)',
  },
  {
    title: '2. Merchant name with special characters / HTML',
    wrong: 'A merchant like <script>alert(1)</script> or "O\'Brien & Sons" could break rendering or, in a less careful app, enable a script-injection attack.',
    handles: 'React escapes all text content by default, so injected HTML/JS renders as inert text, not executable code. No additional sanitization was added.',
    correct: 'Current behaviour is already correct for display; if this data were ever sent to a backend, it would still need server-side sanitization.',
  },
  {
    title: '3. Rate is null, undefined, or missing for a currency',
    wrong: 'Dividing by undefined produces NaN, which would silently corrupt every total it touches with no visible error.',
    handles: 'toUSD() validates the rate is a finite number > 0 before dividing; invalid rows return { valid: false } and are excluded from totals.',
    correct: 'Exclude from totals and flag the row explicitly ("rate unavailable") rather than hiding or mis-stating it. Implemented.',
  },
  {
    title: '4. Add-expense form submitted with empty fields',
    wrong: 'An empty merchant name or missing date would create a confusing blank row in the table.',
    handles: 'Each required field (merchant, amount, date) is validated before the row is added; the first failing check shows a specific error.',
    correct: 'Reject with a specific, field-level message. Implemented for merchant, amount, and date. Currency/category cannot be empty since they\'re dropdowns.',
  },
  {
    title: '5. Very large amounts causing display overflow',
    wrong: 'A 50,000,000 JPY entry or a typo like 9999999999 could push a table cell wider than its column, breaking the layout.',
    handles: 'Amounts use tabular-number monospace formatting with thousands separators, and table cells allow horizontal scroll on the wrapping container rather than wrapping awkwardly.',
    correct: 'Current behaviour holds up reasonably well; a stricter version would cap display precision and use abbreviated notation (e.g. "1.2M") above a threshold.',
  },
  {
    title: '6. Filtering with no results',
    wrong: 'If a category filter matched zero rows (e.g. after deleting the only entry in a category, a feature not yet built), the table would render as a confusing empty white box.',
    handles: 'ExpenseTable explicitly checks for a zero-length row list and renders a plain-language "No expenses match this filter" message instead of an empty table.',
    correct: 'Show an explicit empty state, not a blank table. Implemented.',
  },
  {
    title: '7. Narrow mobile screen',
    wrong: 'A 5-column table and a multi-field form can overflow a 360px-wide screen, forcing awkward pinch-zooming.',
    handles: 'The table sits in a horizontally scrollable container so it never breaks page layout; the form and summary cards use CSS grid with auto-fit so they reflow to a single column.',
    correct: 'Acceptable for v1 (scroll-to-see-table); a more polished version would convert the table to a stacked card layout below ~480px.',
  },
  {
    title: '8. Duplicate or near-simultaneous "Add expense" submissions',
    wrong: 'Double-clicking "Add expense" (e.g. on a slow connection) could add the same expense twice with no warning.',
    handles: 'Not currently handled, each submit adds a new row unconditionally with a fresh incrementing id.',
    correct: 'Disable the submit button momentarily after click, or de-duplicate identical merchant+amount+date+currency entries within a short window.',
  },
  {
    title: '9. EUR what-if slider at the extremes (0.80 / 1.10)',
    wrong: 'At the slider edges, a large swing in the EUR rate could make the "vs base rate" delta look alarming out of context for a CEO skimming the dashboard.',
    handles: 'The delta is shown with a sign and percentage so the direction and magnitude are unambiguous, and it only affects EUR-denominated rows, other currencies are untouched, which is called out in the slider copy.',
    correct: 'Current behaviour is correct; worth adding a one-line caption clarifying this is a simulation, not a saved rate change, if confusion shows up in testing.',
  },
];

export default function EdgeCasesPage() {
  return (
    <div style={CARD}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 0 }}>Edge Cases &amp; Failure Modes</h2>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>
        Bonus section, adversarial review of the dashboard before handoff.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {CASES.map((c) => (
          <div key={c.title} style={{ borderTop: '1px solid var(--rule)', paddingTop: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px' }}>{c.title}</h3>
            <Row label="What could go wrong" text={c.wrong} />
            <Row label="How the code handles it" text={c.handles} />
            <Row label="Correct behaviour" text={c.correct} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, text }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, marginBottom: 6, fontSize: 13.5, lineHeight: 1.55 }}>
      <span style={{ color: 'var(--ink-soft)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em', paddingTop: 2 }}>{label}</span>
      <span>{text}</span>
    </div>
  );
}
