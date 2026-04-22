import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts'

const API = 'http://localhost:8000'

const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })
const fmtRupee = (n) => `₹${fmt(n)}`

function r2Color(r2) {
  if (r2 >= 0.85) return '#10B981'
  if (r2 >= 0.70) return '#F59E0B'
  return '#EF4444'
}

function r2Label(r2) {
  if (r2 >= 0.85) return { text: 'Excellent', color: '#10B981' }
  if (r2 >= 0.70) return { text: 'Good', color: '#F59E0B' }
  return { text: 'Fair', color: '#EF4444' }
}

const CustomFITooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p style={{ color: '#9CA3AF', marginBottom: '4px', fontSize: '0.8rem' }}>{label}</p>
      <p style={{ color: '#3B82F6', fontWeight: 700 }}>Importance: {(payload[0].value * 100).toFixed(2)}%</p>
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

export default function ModelTraining() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const handleTrain = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/api/train`)
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
      setData(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const bestModel = data
    ? Object.entries(data.model_metrics).reduce((best, [k, v]) =>
        v.r2 > (best?.r2 ?? -Infinity) ? { name: k, ...v } : best, null)
    : null

  const modelNames = data ? Object.keys(data.model_metrics) : []
  const compData = modelNames.map(name => ({
    model: name.replace(' Regression', '').replace(' ', '\n'),
    RMSE: data.model_metrics[name].rmse,
    MAE:  data.model_metrics[name].mae,
  }))

  const fiData = data?.feature_importances?.map(f => ({
    feature: f.feature.replace('Region_', '').replace('_', ' '),
    importance: f.importance,
  })) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="section-heading" style={{ fontSize: '1.8rem' }}>🤖 Model Training</h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Train and compare 3 ML models on the insurance dataset</p>
        </div>
        <button
          id="btn-train-models"
          className="btn-primary"
          onClick={handleTrain}
          disabled={loading}
        >
          {loading ? (
            <>
              <div style={{
                width: '16px', height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              Training…
            </>
          ) : (
            <>
              <span>🚀</span>
              {data ? 'Retrain Models' : 'Train All Models'}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="error-banner fade-in">⚠️ {error}</div>
      )}

      {!data && !loading && (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🤖</div>
          <p style={{ color: '#6B7280' }}>Click "Train All Models" to train and evaluate the ML models.</p>
        </div>
      )}

      {loading && (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="spinner" />
            <p style={{ color: '#6B7280' }}>Training models on 800 records… This may take a moment.</p>
          </div>
        </div>
      )}

      {data && (
        <>
          {/* Model cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {Object.entries(data.model_metrics).map(([name, metrics]) => {
              const isBest = bestModel?.name === name
              const ql = r2Label(metrics.r2)
              return (
                <div
                  key={name}
                  className="glass-card fade-in"
                  style={{
                    padding: '28px',
                    position: 'relative',
                    ...(isBest ? {
                      borderColor: 'rgba(16,185,129,0.4)',
                      boxShadow: '0 0 30px rgba(16,185,129,0.12)',
                    } : {}),
                  }}
                >
                  {isBest && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      borderRadius: '999px',
                      padding: '4px 16px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
                    }}>
                      ⭐ Best Model
                    </div>
                  )}

                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#F9FAFB',
                    marginBottom: '20px',
                    marginTop: isBest ? '8px' : 0,
                  }}>{name}</h3>

                  {[
                    { label: 'R² Score', value: metrics.r2.toFixed(4), color: r2Color(metrics.r2), sub: ql.text },
                    { label: 'RMSE',     value: fmtRupee(metrics.rmse), color: '#3B82F6', sub: 'Root Mean Sq Error' },
                    { label: 'MAE',      value: fmtRupee(metrics.mae),  color: '#8B5CF6', sub: 'Mean Abs Error' },
                  ].map(item => (
                    <div key={item.label} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(31,41,55,0.5)',
                    }}>
                      <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>{item.label}</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: item.color, fontWeight: 700, fontSize: '1rem' }}>{item.value}</span>
                        <div style={{ fontSize: '0.7rem', color: item.color, opacity: 0.7 }}>{item.sub}</div>
                      </div>
                    </div>
                  ))}

                  {/* R² bar */}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>Model Fit</span>
                      <span style={{ color: r2Color(metrics.r2), fontSize: '0.75rem', fontWeight: 600 }}>
                        {(metrics.r2 * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div style={{
                      background: 'rgba(31,41,55,0.6)',
                      borderRadius: '999px',
                      height: '8px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(metrics.r2 * 100, 100)}%`,
                        background: `linear-gradient(90deg, ${r2Color(metrics.r2)}, ${r2Color(metrics.r2)}aa)`,
                        borderRadius: '999px',
                        transition: 'width 1s ease-out',
                      }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Feature importance chart */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 className="section-heading" style={{ marginBottom: '4px', fontSize: '1.1rem' }}>
              🌲 Random Forest — Feature Importances
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '24px' }}>
              Top 6 features ranked by importance score (higher = more predictive)
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={fiData} layout="vertical" margin={{ left: 20, right: 60, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(55,65,81,0.4)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  label={{ value: 'Importance (%)', position: 'insideBottom', offset: -5, fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis type="category" dataKey="feature" tick={{ fill: '#9CA3AF', fontSize: 12 }} width={150} />
                <Tooltip content={<CustomFITooltip />} />
                <Bar dataKey="importance" radius={[0, 8, 8, 0]} fill="url(#fiGrad)" />
                <defs>
                  <linearGradient id="fiGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Model comparison chart */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 className="section-heading" style={{ marginBottom: '4px', fontSize: '1.1rem' }}>
              📊 Model Error Comparison (RMSE vs MAE)
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '24px' }}>
              Lower is better — comparing error magnitudes across all 3 models
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={compData} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(55,65,81,0.4)" vertical={false} />
                <XAxis dataKey="model" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CompTooltip />} />
                <Legend wrapperStyle={{ color: '#9CA3AF', paddingTop: '16px' }} />
                <Bar dataKey="RMSE" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="MAE"  fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* RMSE vs MAE info card */}
          <div className="glass-card" style={{
            padding: '28px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.05))',
            borderColor: 'rgba(59,130,246,0.2)',
          }}>
            <h3 className="section-heading" style={{ marginBottom: '16px', fontSize: '1.1rem' }}>
              💡 Why RMSE over MAE in Insurance Pricing?
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.8 }}>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#3B82F6' }}>RMSE (Root Mean Squared Error)</strong> penalizes large errors quadratically — 
                  making it far more sensitive to outlier predictions.
                </p>
                <p>
                  In insurance, underpricing a high-risk customer by ₹30,000 is catastrophically worse than 
                  underpricing a low-risk customer by ₹1,000. RMSE captures this asymmetry naturally.
                </p>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.8 }}>
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#8B5CF6' }}>MAE (Mean Absolute Error)</strong> treats all errors equally — 
                  a ₹500 underestimate counts the same as a ₹50,000 one.
                </p>
                <p>
                  For <em style={{ color: '#F9FAFB' }}>actuarial pricing</em> where tail-risk losses can bankrupt an insurer, 
                  RMSE is the preferred metric to minimize catastrophic mispricings.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
