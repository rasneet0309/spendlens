export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(isActive ? null : cat)}
            aria-pressed={isActive}
            style={{
              border: `1px solid ${isActive ? 'var(--emerald)' : 'var(--rule)'}`,
              background: isActive ? 'var(--emerald)' : 'var(--paper-raised)',
              color: isActive ? '#fff' : 'var(--ink)',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {cat}
          </button>
        );
      })}
      {active && (
        <button
          onClick={() => onChange(null)}
          style={{
            border: '1px solid transparent',
            background: 'none',
            color: 'var(--ink-soft)',
            fontSize: 13,
            padding: '6px 8px',
          }}
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
