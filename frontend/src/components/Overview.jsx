import { useState } from 'react'

const API = 'http://localhost:8000'

const COLUMNS = [
  { name: 'Age',                    type: 'Numeric',      desc: 'Age of the insured individual (18–80 years)' },
  { name: 'BMI',                    type: 'Numeric',      desc: 'Body Mass Index — weight/height² measure of obesity' },
  { name: 'Smoker',                 type: 'Categorical',  desc: 'Whether the individual smokes (Yes / No)' },
  { name: 'Region',                 type: 'Categorical',  desc: 'Geographic region (North / South / East / West)' },
  { name: 'No_of_Dependents',       type: 'Numeric',      desc: 'Number of dependents covered under the policy' },
  { name: 'Pre_Existing_Conditions',type: 'Numeric',      desc: 'Count of pre-existing medical conditions' },
  { name: 'Annual_Premium_INR',     type: 'Target',       desc: 'Annual insurance premium in Indian Rupees (₹)' },
]

const typeColor = { Numeric: '#3B82F6', Categorical: '#8B5CF6', Target: '#10B981' }

function StatCard({ value, label, sub, icon }) {
  return (
    <div className="stat-card fade-in" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>{icon}</div>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '2rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>{value}</div>
      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#F9FAFB', marginBottom: '4px' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{sub}</div>}
    </div>
  )
}

export default function Overview({ setActiveTab }) {
  const [training, setTraining] = useState(false)
  const [trainResult, setTrainResult] = useState(null)
  const [error, setError] = useState(null)

  const handleTrain = async () => {
    setTraining(true)
    setError(null)
    try {
      const res = await fetch(`${API}/api/train`)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setTrainResult(data)
      setTimeout(() => setActiveTab('training'), 800)
    } catch (e) {
      setError(e.message)
    } finally {
      setTraining(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Hero */}
      <div className="glass-card fade-in" style={{
        padding: '48px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 50%, rgba(17,24,39,0.9) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '999px',
            padding: '6px 16px',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 700, letterSpacing: '0.1em' }}>
              🎓 COLLEGE PROJECT — INSURTECH DOMAIN
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #F9FAFB 0%, #3B82F6 50%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Intelligent Insurance<br />Premium Prediction
          </h1>

          <p style={{
            fontSize: '1.05rem', color: '#9CA3AF',
            maxWidth: '600px', margin: '0 auto 32px',
            lineHeight: 1.7,
          }}>
            QuickCover uses <strong style={{ color: '#F9FAFB' }}>three ML models</strong> — Linear Regression, Ridge Regression, and Random Forest — 
            trained on a dataset of <strong style={{ color: '#F9FAFB' }}>800 insurance records</strong> to deliver accurate, 
            explainable premium predictions across 6 key risk factors.
          </p>

          <button
            id="btn-train-overview"
            className="btn-primary"
            onClick={handleTrain}
            disabled={training}
            style={{ fontSize: '1rem', padding: '14px 36px' }}
          >
            {training ? (
              <>
                <div style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Training Models…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                Train All Models
              </>
            )}
          </button>

          {trainResult && (
            <div style={{
              marginTop: '16px',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '10px',
              padding: '10px 20px',
              color: '#10B981',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}>
              ✓ Models trained! Redirecting to results…
            </div>
          )}

          {error && (
            <div className="error-banner" style={{ marginTop: '16px', maxWidth: '500px', margin: '16px auto 0' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard value="800" label="Records Analyzed" sub="Synthetic insurance dataset" icon="📊" />
        <StatCard value="3"   label="ML Models Trained" sub="LR · Ridge · Random Forest" icon="🤖" />
        <StatCard value="6"   label="Risk Factors" sub="Age, BMI, Smoker, Region…" icon="⚡" />
      </div>

      {/* Dataset columns table */}
      <div className="glass-card" style={{ padding: '28px', overflow: 'hidden' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 className="section-heading">Dataset Overview</h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            6 input features + 1 target variable · P7_Insurance_Premium.csv
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Column Name</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {COLUMNS.map((col, i) => (
                <tr key={col.name}>
                  <td style={{ color: '#4B5563', fontWeight: 600 }}>{i + 1}</td>
                  <td>
                    <code style={{
                      background: 'rgba(59,130,246,0.1)',
                      color: '#93C5FD',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                    }}>{col.name}</code>
                  </td>
                  <td>
                    <span style={{
                      background: `${typeColor[col.type]}20`,
                      color: typeColor[col.type],
                      border: `1px solid ${typeColor[col.type]}40`,
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}>{col.type}</span>
                  </td>
                  <td style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>{col.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech stack */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h2 className="section-heading" style={{ marginBottom: '20px' }}>Technology Stack</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {[
            { icon: '⚡', label: 'FastAPI', sub: 'REST Backend' },
            { icon: '🐍', label: 'Python', sub: 'Scikit-learn' },
            { icon: '⚛️', label: 'React + Vite', sub: 'Frontend SPA' },
            { icon: '💨', label: 'TailwindCSS', sub: 'Styling' },
            { icon: '📈', label: 'Recharts', sub: 'Visualizations' },
            { icon: '🌲', label: 'Random Forest', sub: 'Best Model' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'rgba(31,41,55,0.5)',
              border: '1px solid rgba(55,65,81,0.5)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#F9FAFB' }}>{item.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
