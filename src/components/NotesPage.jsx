const CARD = {
  background: 'var(--paper-raised)',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  padding: '24px 28px',
  maxWidth: 760,
};

export default function NotesPage() {
  return (
    <div style={CARD}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 0 }}>About this build, written response</h2>

      <h3 style={h3}>How I structured the currency conversion logic, and why</h3>
      <p style={p}>
        All conversion math lives in one function, <code>toUSD(amount, currency, rates)</code> in{' '}
        <code>src/utils/currency.js</code>, called by every part of the app, summary cards, category table,
        top-merchants list, and the sortable expense table. Rates are stored as units of foreign currency per 1
        USD, so conversion is <code>amount / rate</code>. Centralizing it means one place to fix if the
        convention, rounding, or rate source ever changes.
      </p>

      <h3 style={h3}>What would change for a 25th currency</h3>
      <p style={p}>
        Nothing in the logic changes, since <code>toUSD</code> takes the rates table as a parameter, not hardcoded codes.
        Adding a currency is a one-line addition to <code>RATES</code>, and it auto-populates the "Add expense"
        dropdown since that reads <code>Object.keys(RATES)</code>. The one exception is the what-if slider,
        currently hardcoded to EUR; generalizing it to any currency would be the natural next step.
      </p>

      <h3 style={h3}>What would break with a null or missing rate, and how I guarded against it</h3>
      <p style={p}>
        Unguarded, <code>amount / undefined</code> silently produces <code>NaN</code>, which poisons every total
        it touches. <code>toUSD</code> checks the rate is finite and greater than zero before dividing; if not, it
        returns <code>{`{ value: null, valid: false }`}</code>. Invalid rows are excluded from totals and the
        table marks them as "rate unavailable" instead of hiding them or showing a wrong number.
      </p>
    </div>
  );
}

const h3 = { fontSize: 15, fontWeight: 700, marginTop: 22, marginBottom: 6 };
const p = { fontSize: 14, lineHeight: 1.65, color: 'var(--ink)', margin: 0 };
