import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from 'recharts'

const API = 'http://localhost:8000'

const fmt = (n) => n !== undefined && n !== null ? Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '—'
const fmtRupee = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '60px' }}>
      <div className="spinner" />
      <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Fetching EDA data from backend…</p>
    </div>
  )
}

function MetricCard({ label, value, sub, color = '#3B82F6' }) {
  return (
    <div className="stat-card">
      <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '1.8rem', fontWeight: 800,
        color,
        marginBottom: '4px',
      }}>{value}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>{sub}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p style={{ color: '#9CA3AF', marginBottom: '4px', fontSize: '0.8rem' }}>{label}</p>
      <p style={{ color: payload[0].value >= 0 ? '#3B82F6' : '#EF4444', fontWeight: 700 }}>
        r = {payload[0].value?.toFixed(4)}
      </p>
    </div>
  )
}

const RegionTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p style={{ color: '#9CA3AF', marginBottom: '4px', fontSize: '0.8rem' }}>{label}</p>
      <p style={{ color: '#10B981', fontWeight: 700 }}>{fmtRupee(payload[0].value)}</p>
    </div>
  )
}

export default function EDA() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API}/api/eda`)
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
        setData(await res.json())
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="glass-card"><Spinner /></div>
  if (error) return (
    <div className="error-banner fade-in">
      ⚠️ Failed to load EDA: {error}
    </div>
  )
  if (!data) return null

  const corrData = Object.entries(data.correlations || {}).map(([k, v]) => ({
    feature: k.replace('Region_', '').replace('_', ' '),
    corr: v,
  })).sort((a, b) => Math.abs(b.corr) - Math.abs(a.corr))

  const regionData = Object.entries(data.region_avg_premium || {}).map(([k, v]) => ({
    region: k,
    premium: Math.round(v),
  }))

  const distRows = ['Age', 'BMI', 'No_of_Dependents', 'Pre_Existing_Conditions', 'Annual_Premium_INR']

  const smokerDiff = ((data.smoker_avg_premium - data.non_smoker_avg_premium) / data.non_smoker_avg_premium * 100).toFixed(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Page heading */}
      <div>
        <h2 className="section-heading" style={{ fontSize: '1.8rem' }}>
          📊 Exploratory Data Analysis
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
          Statistical deep-dive into {fmt(data.total_records)} insurance records
        </p>
      </div>

      {/* Row 1 — 3 metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <MetricCard label="Average Annual Premium" value={fmtRupee(data.avg_premium)} sub="Across all policyholders" color="#3B82F6" />
        <MetricCard label="Smoker Premium Avg" value={fmtRupee(data.smoker_avg_premium)} sub={`+${smokerDiff}% above non-smokers`} color="#EF4444" />
        <MetricCard label="Non-Smoker Premium Avg" value={fmtRupee(data.non_smoker_avg_premium)} sub="Baseline risk profile" color="#10B981" />
      </div>

      {/* Feature distributions */}
      <div className="glass-card" style={{ padding: '28px', overflow: 'hidden' }}>
        <h3 className="section-heading" style={{ marginBottom: '4px', fontSize: '1.1rem' }}>Feature Distribution Statistics</h3>
        <p style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '20px' }}>Statistical summary across all numeric features</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Mean</th>
                <th>Median</th>
                <th>Std Dev</th>
                <th>Min</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              {distRows.map(col => {
                const d = data.distributions?.[col]
                return (
                  <tr key={col}>
                    <td>
                      <code style={{
                        background: 'rgba(59,130,246,0.1)',
                        color: '#93C5FD',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                      }}>{col}</code>
                    </td>
                    <td>{fmt(d?.mean)}</td>
                    <td>{fmt(d?.median)}</td>
                    <td>{fmt(d?.std)}</td>
                    <td style={{ color: '#10B981' }}>{fmt(d?.min)}</td>
                    <td style={{ color: '#EF4444' }}>{fmt(d?.max)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Correlation chart */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 className="section-heading" style={{ marginBottom: '4px', fontSize: '1.1rem' }}>
          Feature Correlation with Annual Premium
        </h3>
        <p style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '24px' }}>
          Pearson correlation coefficient (r) — blue = positive, red = negative
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={corrData} layout="vertical" margin={{ left: 20, right: 40, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(55,65,81,0.4)" horizontal={false} />
            <XAxis
              type="number"
              domain={[-1, 1]}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(v) => v.toFixed(1)}
              label={{ value: 'Correlation (r)', position: 'insideBottom', offset: -5, fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="feature"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              width={140}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" />
            <Bar dataKey="corr" radius={[0, 6, 6, 0]}>
              {corrData.map((entry, i) => (
                <Cell key={i} fill={entry.corr >= 0 ? '#3B82F6' : '#EF4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Smoker comparison */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 className="section-heading" style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
          🚬 Smoker vs Non-Smoker Premium Analysis
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '14px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🚬</div>
            <div style={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>SMOKERS</div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '2rem', fontWeight: 800, color: '#EF4444',
            }}>
              {fmtRupee(data.smoker_avg_premium)}
            </div>
            <div style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '8px' }}>Average Annual Premium</div>
          </div>
          <div style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: '14px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🌿</div>
            <div style={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>NON-SMOKERS</div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '2rem', fontWeight: 800, color: '#10B981',
            }}>
              {fmtRupee(data.non_smoker_avg_premium)}
            </div>
            <div style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '8px' }}>Average Annual Premium</div>
          </div>
        </div>
        <div style={{
          marginTop: '16px',
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: '10px',
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          <span style={{ color: '#F59E0B', fontWeight: 700 }}>⚠ Smokers pay {smokerDiff}% more</span>
          <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>— the single most impactful risk factor</span>
        </div>
      </div>

      {/* Region chart */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 className="section-heading" style={{ marginBottom: '4px', fontSize: '1.1rem' }}>Region-wise Average Premium</h3>
        <p style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '24px' }}>Average annual premium (₹) by geographic region</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={regionData} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(55,65,81,0.4)" vertical={false} />
            <XAxis dataKey="region" tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 600 }} />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<RegionTooltip />} />
            <Bar dataKey="premium" radius={[8, 8, 0, 0]} fill="url(#regionGrad)" />
            <defs>
              <linearGradient id="regionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Outlier table */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 className="section-heading" style={{ marginBottom: '4px', fontSize: '1.1rem' }}>Outlier Analysis (IQR Method)</h3>
        <p style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '20px' }}>
          Records beyond Q1 − 1.5×IQR or Q3 + 1.5×IQR boundaries
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          {Object.entries(data.outliers || {}).map(([col, cnt]) => (
            <div key={col} style={{
              background: cnt > 0 ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)',
              border: `1px solid ${cnt > 0 ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: cnt > 0 ? '#F59E0B' : '#10B981' }}>{cnt}</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>{col.replace(/_/g, ' ')}</div>
              <div style={{ fontSize: '0.7rem', color: cnt > 0 ? '#F59E0B' : '#10B981', marginTop: '2px' }}>
                {cnt > 0 ? 'outliers' : 'clean'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
