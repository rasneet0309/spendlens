export default function WhatIfSlider({ eurRate, setEurRate, baseRate }) {
  const delta = eurRate - baseRate;
  const pct = ((delta / baseRate) * 100).toFixed(1);

  return (
    <section style={{
      background: 'var(--amber-soft)',
      border: '1px solid var(--rule)',
      borderRadius: 6,
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>What-if: EUR/USD rate</span>
          <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--ink-soft)' }}>stretch feature</span>
        </div>
        <span className="mono-num" style={{ fontSize: 14, fontWeight: 600 }}>
          {eurRate.toFixed(4)} {delta !== 0 && (
            <span style={{ color: delta > 0 ? 'var(--red)' : 'var(--emerald)' }}>
              ({delta > 0 ? '+' : ''}{pct}% vs base {baseRate.toFixed(4)})
            </span>
          )}
        </span>
      </div>
      <input
        type="range"
        min={0.80}
        max={1.10}
        step={0.0001}
        value={eurRate}
        onChange={(e) => setEurRate(parseFloat(e.target.value))}
        style={{ width: '100%', marginTop: 12, accentColor: 'var(--amber)' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
        <span>0.80</span>
        <span>1.10</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 10, marginBottom: 0 }}>
        Drag to simulate a stronger or weaker euro. Every EUR-denominated expense, the category totals, and the overall total above recalculate live — nothing else in the dataset is affected.
      </p>
    </section>
  );
}
