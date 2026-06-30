import { useState } from 'react';

const inputStyle = {
  padding: '8px 10px',
  border: '1px solid var(--rule)',
  borderRadius: 4,
  fontSize: 14,
  fontFamily: 'var(--font-body)',
  background: 'var(--paper)',
  color: 'var(--ink)',
};

export default function AddExpenseForm({ onAdd, supportedCurrencies, categories }) {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(supportedCurrencies[0]);
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSuccess(false);

    const trimmedMerchant = merchant.trim();
    const numericAmount = parseFloat(amount);

    if (!trimmedMerchant) {
      setError('Merchant name is required.');
      return;
    }
    if (amount === '' || isNaN(numericAmount)) {
      setError('Enter a valid amount.');
      return;
    }
    if (numericAmount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }
    if (!date) {
      setError('Pick a date.');
      return;
    }

    onAdd({
      merchant: trimmedMerchant,
      amount: numericAmount,
      currency,
      category,
      date,
    });

    setError('');
    setMerchant('');
    setAmount('');
    setDate('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, alignItems: 'end' }}>
      <Field label="Merchant">
        <input style={inputStyle} value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="e.g. Uber" />
      </Field>
      <Field label="Amount">
        <input style={inputStyle} type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
      </Field>
      <Field label="Currency">
        <select style={inputStyle} value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {supportedCurrencies.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Category">
        <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Date">
        <input style={inputStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
      <button
        type="submit"
        style={{
          background: 'var(--emerald)',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '9px 16px',
          fontSize: 14,
          fontWeight: 600,
          height: 38,
        }}
      >
        Add expense
      </button>

      {error && (
        <div style={{ gridColumn: '1 / -1', color: 'var(--red)', background: 'var(--red-soft)', padding: '8px 12px', borderRadius: 4, fontSize: 13 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ gridColumn: '1 / -1', color: 'var(--emerald)', background: 'var(--emerald-soft)', padding: '8px 12px', borderRadius: 4, fontSize: 13 }}>
          Added — now reflected in the table and summary above.
        </div>
      )}
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>
      {label}
      {children}
    </label>
  );
}
