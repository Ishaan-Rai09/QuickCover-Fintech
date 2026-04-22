import { useState } from 'react'
import Overview from './Overview.jsx'
import EDA from './EDA.jsx'
import ModelTraining from './ModelTraining.jsx'
import Predict from './Predict.jsx'
import SampleProfiles from './SampleProfiles.jsx'
import Insights from './Insights.jsx'

const TABS = [
  { id: 'overview', label: '🏠  Overview',       emoji: '🏠' },
  { id: 'eda',      label: '📊  EDA',             emoji: '📊' },
  { id: 'training', label: '🤖  Model Training',  emoji: '🤖' },
  { id: 'predict',  label: '⚡  Predict',          emoji: '⚡' },
  { id: 'samples',  label: '👥  Sample Profiles',  emoji: '👥' },
  { id: 'insights', label: '💡  Insights',         emoji: '💡' },
]

export default function Dashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ───────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(5,9,20,0.92)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Top row */}
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '14px clamp(16px, 3vw, 40px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z"
                  fill="white" fillOpacity="0.95"/>
                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.25rem',
                background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>QuickCover</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text3)', letterSpacing: '0.04em', marginTop: -1 }}>
                AI Insurance Underwriting
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Live pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 999, padding: '5px 14px',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                animation: 'pulse-ring 2s ease-out infinite',
              }} />
              <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>API Live</span>
            </div>
            {/* Back */}
            <button className="btn btn-ghost btn-sm" onClick={onBack}>← Home</button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 40px) 12px',
        }}>
          <div className="tab-bar" style={{ width: 'fit-content' }}>
            {TABS.map(t => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                className={`tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Content ──────────────────────────────────────────── */}
      <main style={{
        flex: 1,
        maxWidth: 1400, margin: '0 auto', width: '100%',
        padding: '36px clamp(16px, 3vw, 40px) 60px',
      }}>
        {activeTab === 'overview'  && <Overview setActiveTab={setActiveTab} />}
        {activeTab === 'eda'       && <EDA />}
        {activeTab === 'training'  && <ModelTraining />}
        {activeTab === 'predict'   && <Predict />}
        {activeTab === 'samples'   && <SampleProfiles />}
        {activeTab === 'insights'  && <Insights />}
      </main>
    </div>
  )
}
