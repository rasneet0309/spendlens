import { useMemo, useState } from 'react';
import { toUSD, formatUSD, formatOriginal } from '../utils/currency.js';

const CARD = {
  background: 'var(--paper-raised)',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  overflow: 'hidden',
};

export default function ExpenseTable({ expenses, rates }) {
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const rows = useMemo(() => {
    const withUSD = expenses.map((e) => {
      const { value, valid } = toUSD(e.amount, e.currency, rates);
      return { ...e, usd: value, validUSD: valid };
    });
    const sorted = [...withUSD].sort((a, b) => {
      let av, bv;
      if (sortBy === 'date') { av = a.date; bv = b.date; }
      else { av = a.usd ?? -Infinity; bv = b.usd ?? -Infinity; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [expenses, rates, sortBy, sortDir]);

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  }

  function sortIndicator(field) {
    if (sortBy !== field) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  }

  if (rows.length === 0) {
    return (
      <div style={{ ...CARD, padding: '32px 20px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 14 }}>
        No expenses match this filter.
      </div>
    );
  }

  return (
    <div style={{ ...CARD, overflowX: 'auto' }}>
      <table>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)', background: 'var(--emerald-soft)' }}>
            <th style={thStyle} onClick={() => toggleSort('date')} role="button" tabIndex={0}>
              Date{sortIndicator('date')}
            </th>
            <th style={thStyle}>Merchant</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Original amount</th>
            <th style={thStyle} onClick={() => toggleSort('usd')} role="button" tabIndex={0}>
              USD equivalent{sortIndicator('usd')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid var(--rule)' }}>
              <td style={tdStyle} className="mono-num">{r.date}</td>
              <td style={tdStyle}>{r.merchant}</td>
              <td style={tdStyle}>
                <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{r.category}</span>
              </td>
              <td style={tdStyle} className="mono-num">{formatOriginal(r.amount, r.currency)}</td>
              <td style={tdStyle} className="mono-num">
                {r.validUSD ? formatUSD(r.usd) : (
                  <span style={{ color: 'var(--red)' }} title="Missing or invalid rate for this currency">— rate unavailable</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '10px 16px',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--ink-soft)',
  fontWeight: 600,
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '10px 16px',
  fontSize: 14,
  whiteSpace: 'nowrap',
};
