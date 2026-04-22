import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

const API = 'http://localhost:8000'

const fmtRupee = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
const fmt     = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })

function riskStyle(label) {
  if (label === 'Low Risk')    return { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)', emoji: '🟢' }
  if (label === 'Medium Risk') return { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', emoji: '🟡' }
  return                              { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)', emoji: '🔴' }
}

function pctDiffColor(pct) {
  const abs = Math.abs(pct)
  if (abs <= 10)  return '#10B981'
  if (abs <= 20)  return '#F59E0B'
  return '#EF4444'
}

function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '60px' }}>
      <div className="spinner" />
      <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Fetching sample predictions…</p>
    </div>
  )
}

const CompTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p style={{ color: '#9CA3AF', marginBottom: '6px', fontWeight: 600 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600, marginBottom: '2px' }}>
          {p.name}: {fmtRupee(p.value)}
        </p>
      ))}
    </div>
  )
}

const avatarIcons = { 'Low Risk': '👤', 'Medium Risk': '👥', 'High Risk': '⚠️' }

export default function SampleProfiles() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/api/sample-predictions`)
      if (!res.ok) throw new Error(await res.text())
      setData(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const chartData = data?.profiles?.map(p => ({
    profile: p.label,
    'Model Prediction': Math.round(p.ensemble_average),
    'Industry Benchmark': p.industry_benchmark_INR,
  })) || []

  if (loading) return <div className="glass-card"><Spinner /></div>

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="error-banner fade-in">
        ⚠️ {error.includes('not trained')
          ? 'Models not trained yet — please go to Model Training tab and train models first.'
          : error}
      </div>
      <button className="btn-primary" onClick={loadData} style={{ width: 'fit-content' }}>
        🔄 Retry
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 className="section-heading" style={{ fontSize: '1.8rem' }}>👥 Sample Profiles</h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
            Predictions for 3 benchmark customer profiles across the risk spectrum
          </p>
        </div>
        <button id="btn-refresh-samples" className="btn-primary" onClick={loadData}>
          🔄 Refresh
        </button>
      </div>

      {!data && !loading && (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280' }}>Loading sample profile predictions…</p>
        </div>
      )}

      {data && (
        <>
          {/* Profile cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {data.profiles.map((profile) => {
              const rs = riskStyle(profile.label)
              const diffColor = pctDiffColor(profile.pct_diff_from_benchmark)
              const inp = profile.inputs
              return (
                <div
                  key={profile.label}
                  className="glass-card fade-in"
                  style={{
                    padding: '28px',
                    borderColor: rs.border,
                    background: `linear-gradient(160deg, ${rs.bg} 0%, rgba(17,24,39,0.9) 40%)`,
                  }}
                >
                  {/* Avatar + label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                    <div style={{
                      width: '52px', height: '52px',
                      background: rs.bg,
                      border: `1px solid ${rs.border}`,
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}>
                      {avatarIcons[profile.label]}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700, fontSize: '1.1rem', color: '#F9FAFB',
                      }}>{profile.label}</div>
                      <span style={{
                        background: rs.bg,
                        color: rs.color,
                        border: `1px solid ${rs.border}`,
                        padding: '2px 10px',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}>
                        {rs.emoji} {profile.label.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div style={{
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '10px',
                    padding: '14px',
                    marginBottom: '16px',
                  }}>
                    <div style={{ color: '#6B7280', fontSize: '0.7rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.08em' }}>
                      PROFILE INPUTS
                    </div>
                    {[
                      { label: 'Age',                  value: inp.age + ' yrs' },
                      { label: 'BMI',                  value: inp.bmi },
                      { label: 'Smoker',               value: inp.smoker, highlight: inp.smoker === 'Yes' },
                      { label: 'Region',               value: inp.region },
                      { label: 'Dependents',           value: inp.no_of_dependents },
                      { label: 'Pre-existing Cond.',   value: inp.pre_existing_conditions },
                    ].map(row => (
                      <div key={row.label} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '4px 0',
                        borderBottom: '1px solid rgba(31,41,55,0.3)',
                      }}>
                        <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>{row.label}</span>
                        <span style={{
                          color: row.highlight ? '#EF4444' : '#F9FAFB',
                          fontWeight: row.highlight ? 700 : 500,
                          fontSize: '0.8rem',
                        }}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Predictions */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '8px 0', borderBottom: '1px solid rgba(31,41,55,0.4)',
                    }}>
                      <span style={{ color: '#9CA3AF', fontSize: '0.82rem' }}>Random Forest</span>
                      <span style={{ color: '#3B82F6', fontWeight: 600 }}>{fmtRupee(profile.random_forest)}</span>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '8px 0', borderBottom: '1px solid rgba(31,41,55,0.4)',
                    }}>
                      <span style={{ color: '#9CA3AF', fontSize: '0.82rem' }}>Ensemble Average</span>
                      <span style={{ color: rs.color, fontWeight: 700 }}>{fmtRupee(profile.ensemble_average)}</span>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '8px 0',
                    }}>
                      <span style={{ color: '#9CA3AF', fontSize: '0.82rem' }}>Industry Benchmark</span>
                      <span style={{ color: '#6B7280', fontWeight: 600 }}>{fmtRupee(profile.industry_benchmark_INR)}</span>
                    </div>
                  </div>

                  {/* Diff badge */}
                  <div style={{
                    background: `${diffColor}15`,
                    border: `1px solid ${diffColor}40`,
                    borderRadius: '10px',
                    padding: '10px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>vs Benchmark</span>
                    <span style={{ color: diffColor, fontWeight: 700, fontSize: '1rem' }}>
                      {profile.pct_diff_from_benchmark >= 0 ? '+' : ''}{profile.pct_diff_from_benchmark}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Comparison chart */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 className="section-heading" style={{ marginBottom: '4px', fontSize: '1.1rem' }}>
              📊 Model Prediction vs Industry Benchmark
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '24px' }}>
              Side-by-side comparison across all 3 risk profiles
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(55,65,81,0.4)" vertical={false} />
                <XAxis dataKey="profile" tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 600 }} />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CompTooltip />} />
                <Legend wrapperStyle={{ color: '#9CA3AF', paddingTop: '16px' }} />
                <Bar dataKey="Model Prediction"  fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Industry Benchmark" fill="#10B981" radius={[6, 6, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
