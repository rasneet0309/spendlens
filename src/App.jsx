import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import NotesPage from './components/NotesPage.jsx';
import CeoBriefPage from './components/CeoBriefPage.jsx';
import EdgeCasesPage from './components/EdgeCasesPage.jsx';
import HowItWorksPage from './components/HowItWorksPage.jsx';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'notes', label: 'About / Notes' },
  { id: 'how', label: 'How This Works' },
  { id: 'ceo', label: 'CEO Brief' },
  { id: 'edge', label: 'Edge Cases' },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--rule)',
        background: 'var(--paper-raised)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}>
                Spendlens
              </span>
              <span style={{
                marginLeft: 10,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--ink-soft)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                Expense Ledger
              </span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              Rates snapshot &middot; 2026-05-01
            </span>
          </div>
          <nav style={{ display: 'flex', gap: 4, marginTop: 18, overflowX: 'auto' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t.id ? '2px solid var(--emerald)' : '2px solid transparent',
                  padding: '8px 14px',
                  fontSize: 14,
                  fontWeight: tab === t.id ? 600 : 500,
                  color: tab === t.id ? 'var(--ink)' : 'var(--ink-soft)',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 1080, margin: '0 auto', width: '100%', padding: '28px 24px 80px' }}>
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'notes' && <NotesPage />}
        {tab === 'how' && <HowItWorksPage />}
        {tab === 'ceo' && <CeoBriefPage />}
        {tab === 'edge' && <EdgeCasesPage />}
      </main>

      <footer style={{ borderTop: '1px solid var(--rule)', padding: '18px 24px', textAlign: 'center', fontSize: 12, color: 'var(--ink-soft)' }}>
        Built for the Spendlens Product Analyst Intern case study &middot; static rate snapshot, no live API calls
      </footer>
    </div>
  );
}
