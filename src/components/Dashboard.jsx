import { useMemo, useState } from 'react';
import { RATES, EXPENSES, CATEGORIES } from '../data/rates.js';
import { toUSD, formatUSD, formatOriginal, buildCategorySummary, buildOverallTotal, buildTopMerchants } from '../utils/currency.js';
import CategoryFilter from './CategoryFilter.jsx';
import ExpenseTable from './ExpenseTable.jsx';
import AddExpenseForm from './AddExpenseForm.jsx';
import WhatIfSlider from './WhatIfSlider.jsx';

const CARD = {
  background: 'var(--paper-raised)',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  padding: '18px 20px',
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState(EXPENSES);
  const [activeCategory, setActiveCategory] = useState(null);
  const [eurRate, setEurRate] = useState(RATES.EUR);

  const effectiveRates = useMemo(() => ({ ...RATES, EUR: eurRate }), [eurRate]);

  const categorySummary = useMemo(() => buildCategorySummary(expenses, effectiveRates), [expenses, effectiveRates]);
  const overallTotal = useMemo(() => buildOverallTotal(expenses, effectiveRates), [expenses, effectiveRates]);
  const baseOverallTotal = useMemo(() => buildOverallTotal(expenses, RATES), [expenses]);
  const topMerchants = useMemo(() => buildTopMerchants(expenses, effectiveRates), [expenses, effectiveRates]);

  const visibleExpenses = activeCategory ? expenses.filter((e) => e.category === activeCategory) : expenses;

  const deltaVsBase = overallTotal - baseOverallTotal;

  function handleAddExpense(newExpense) {
    setExpenses((prev) => [...prev, { ...newExpense, id: prev.length ? Math.max(...prev.map((e) => e.id)) + 1 : 1 }]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Summary section */}
      <section>
        <h2 style={sectionTitleStyle}>Summary</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 }}>
          <div style={CARD}>
            <div style={labelStyle}>Overall total (USD)</div>
            <div className="mono-num" style={{ fontSize: 28, fontWeight: 600, marginTop: 6 }}>
              {formatUSD(overallTotal)}
            </div>
            {Math.abs(deltaVsBase) > 0.005 && (
              <div style={{ fontSize: 12, marginTop: 6, color: deltaVsBase > 0 ? 'var(--red)' : 'var(--emerald)' }} className="mono-num">
                {deltaVsBase > 0 ? '+' : ''}{formatUSD(deltaVsBase)} vs base EUR rate
              </div>
            )}
          </div>
          <div style={CARD}>
            <div style={labelStyle}>Transactions</div>
            <div className="mono-num" style={{ fontSize: 28, fontWeight: 600, marginTop: 6 }}>{expenses.length}</div>
          </div>
          <div style={{ ...CARD, gridColumn: 'span 2' }}>
            <div style={labelStyle}>Top 3 merchants by USD spend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
              {topMerchants.map((m, i) => (
                <div key={m.merchant} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>{i + 1}. {m.merchant}</span>
                  <span className="mono-num" style={{ fontWeight: 600 }}>{formatUSD(m.totalUSD)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category table */}
        <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--rule)', background: 'var(--emerald-soft)' }}>
                <th style={thStyle}>Category</th>
                <th style={thStyle}># Txns</th>
                <th style={thStyle}>Total (USD)</th>
                <th style={thStyle}>Largest transaction</th>
              </tr>
            </thead>
            <tbody>
              {categorySummary.map((row) => (
                <tr key={row.category} style={{ borderBottom: '1px solid var(--rule)' }}>
                  <td style={tdStyle}>{row.category}</td>
                  <td style={{ ...tdStyle }} className="mono-num">{row.count}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }} className="mono-num">{formatUSD(row.totalUSD)}</td>
                  <td style={tdStyle}>
                    {row.largest ? `${row.largest.merchant} — ${formatUSD(row.largest.usd)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What-if slider (stretch feature) */}
      <WhatIfSlider eurRate={eurRate} setEurRate={setEurRate} baseRate={RATES.EUR} />

      {/* Category filter + table */}
      <section>
        <h2 style={sectionTitleStyle}>All Expenses</h2>
        <CategoryFilter categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
        <ExpenseTable expenses={visibleExpenses} rates={effectiveRates} />
      </section>

      {/* Add expense form */}
      <section>
        <h2 style={sectionTitleStyle}>Add Expense</h2>
        <div style={CARD}>
          <AddExpenseForm onAdd={handleAddExpense} supportedCurrencies={Object.keys(RATES)} categories={CATEGORIES} />
        </div>
      </section>
    </div>
  );
}

const sectionTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 20,
  fontWeight: 600,
  marginBottom: 12,
};

const labelStyle = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--ink-soft)',
  fontWeight: 600,
};

const thStyle = {
  textAlign: 'left',
  padding: '10px 16px',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--ink-soft)',
  fontWeight: 600,
};

const tdStyle = {
  padding: '10px 16px',
  fontSize: 14,
};
