import { useState } from 'react'

const API = 'http://localhost:8000'

const fmtRupee = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function riskLevel(amount) {
  if (amount < 20000)  return { level: 'Low',    color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  emoji: '🟢' }
  if (amount <= 50000) return { level: 'Medium', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', emoji: '🟡' }
  return                      { level: 'High',   color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  emoji: '🔴' }
}

function SliderField({ label, id, value, onChange, min, max, step = 1, unit = '' }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label htmlFor={id} style={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600 }}>{label}</label>
        <span style={{
          background: 'rgba(59,130,246,0.15)',
          color: '#3B82F6',
          fontWeight: 700,
          fontSize: '0.85rem',
          padding: '2px 10px',
          borderRadius: '8px',
        }}>{value}{unit}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(step === 1 ? parseInt(e.target.value) : parseFloat(e.target.value))}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '0.7rem', color: '#4B5563' }}>{min}{unit}</span>
        <span style={{ fontSize: '0.7rem', color: '#4B5563' }}>{max}{unit}</span>
      </div>
    </div>
  )
}

export default function Predict() {
  const [form, setForm] = useState({
    age: 35, bmi: 25.0, smoker: 'No', region: 'South',
    no_of_dependents: 1, pre_existing_conditions: 0,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${API}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }
      setResult(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const risk = result ? riskLevel(result.ensemble_average) : null

  const riskFlags = result ? [
    { flag: form.smoker === 'Yes',              label: 'Smoker',               desc: 'Significantly increases premium by 2–4×',   color: '#EF4444' },
    { flag: form.bmi >= 30,                     label: 'High BMI',             desc: `BMI ${form.bmi} indicates obesity risk`,     color: '#F59E0B' },
    { flag: form.pre_existing_conditions >= 2,  label: 'Multiple Conditions',  desc: `${form.pre_existing_conditions} conditions`, color: '#F59E0B' },
    { flag: form.age >= 55,                     label: 'Senior Age',           desc: `Age ${form.age} — elevated health risk`,     color: '#F59E0B' },
    { flag: form.no_of_dependents >= 3,         label: 'Many Dependents',      desc: `${form.no_of_dependents} dependents covered`, color: '#6B7280' },
  ].filter(f => f.flag) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      <div>
        <h2 className="section-heading" style={{ fontSize: '1.8rem' }}>🧮 Predict Premium</h2>
        <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
          Enter customer profile to get real-time premium predictions from all 3 models
        </p>
      </div>

      {error && (
        <div className="error-banner fade-in">
          ⚠️ {error.includes('not trained') ? 'Models not trained yet — please go to Model Training tab first.' : error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '28px', alignItems: 'start' }}>

        {/* Form */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.1rem', fontWeight: 700,
            color: '#F9FAFB', marginBottom: '28px',
          }}>Customer Profile</h3>

          <form id="predict-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Age */}
            <SliderField label="Age (years)" id="inp-age" value={form.age} onChange={set('age')} min={18} max={80} />

            {/* BMI */}
            <SliderField label="BMI" id="inp-bmi" value={form.bmi} onChange={set('bmi')} min={15} max={50} step={0.1} />

            {/* Smoker Toggle */}
            <div>
              <label style={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Smoking Status
              </label>
              <div className="toggle-group">
                {['No', 'Yes'].map(opt => (
                  <div
                    key={opt}
                    id={`smoker-${opt.toLowerCase()}`}
                    className={`toggle-option ${form.smoker === opt ? 'selected' : ''}`}
                    onClick={() => set('smoker')(opt)}
                    style={{ color: form.smoker === opt ? (opt === 'Yes' ? '#EF4444' : '#10B981') : '#6B7280' }}
                  >
                    {opt === 'Yes' ? '🚬 Smoker' : '🌿 Non-Smoker'}
                  </div>
                ))}
              </div>
            </div>

            {/* Region */}
            <div>
              <label htmlFor="inp-region" style={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Region
              </label>
              <select
                id="inp-region"
                className="form-input"
                value={form.region}
                onChange={e => set('region')(e.target.value)}
              >
                {['North', 'South', 'East', 'West'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Dependents */}
            <SliderField
              label="Number of Dependents"
              id="inp-dependents"
              value={form.no_of_dependents}
              onChange={set('no_of_dependents')}
              min={0} max={5}
            />

            {/* Pre-existing Conditions */}
            <SliderField
              label="Pre-Existing Conditions"
              id="inp-conditions"
              value={form.pre_existing_conditions}
              onChange={set('pre_existing_conditions')}
              min={0} max={5}
            />

            <button
              type="submit"
              id="btn-predict"
              className="btn-primary pulse-glow"
              disabled={loading}
              style={{ marginTop: '8px', justifyContent: 'center' }}
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
                  Predicting…
                </>
              ) : (
                <>⚡ Get Premium Prediction</>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Ensemble result */}
            <div className="glass-card fade-in" style={{
              padding: '32px',
              textAlign: 'center',
              background: `linear-gradient(135deg, ${risk.bg}, rgba(17,24,39,0.9))`,
              borderColor: risk.border,
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: risk.bg,
                border: `1px solid ${risk.border}`,
                borderRadius: '999px',
                padding: '4px 14px',
                marginBottom: '16px',
              }}>
                <span>{risk.emoji}</span>
                <span style={{ color: risk.color, fontWeight: 700, fontSize: '0.8rem' }}>
                  {risk.level.toUpperCase()} RISK
                </span>
              </div>

              <div style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '8px', letterSpacing: '0.1em' }}>
                ENSEMBLE AVERAGE PREMIUM
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                color: risk.color,
                marginBottom: '8px',
              }}>
                {fmtRupee(result.ensemble_average)}
              </div>
              <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>per year</div>
            </div>

            {/* Per-model breakdown */}
            <div className="glass-card fade-in" style={{ padding: '24px' }}>
              <h4 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: '1rem',
                color: '#F9FAFB', marginBottom: '16px',
              }}>Model-wise Predictions</h4>
              {[
                { name: 'Linear Regression', value: result.linear_regression, color: '#6366F1' },
                { name: 'Ridge Regression',  value: result.ridge_regression,  color: '#8B5CF6' },
                { name: 'Random Forest',     value: result.random_forest,     color: '#3B82F6' },
                { name: 'Ensemble Average',  value: result.ensemble_average,  color: risk.color, bold: true },
              ].map(item => (
                <div key={item.name} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(31,41,55,0.5)',
                }}>
                  <span style={{
                    color: item.bold ? '#F9FAFB' : '#9CA3AF',
                    fontWeight: item.bold ? 700 : 400,
                    fontSize: '0.875rem',
                  }}>{item.name}</span>
                  <span style={{
                    color: item.color,
                    fontWeight: item.bold ? 800 : 700,
                    fontSize: item.bold ? '1.1rem' : '0.95rem',
                  }}>
                    {fmtRupee(item.value)}
                  </span>
                </div>
              ))}
            </div>

            {/* Risk flags */}
            {riskFlags.length > 0 && (
              <div className="glass-card fade-in" style={{ padding: '24px' }}>
                <h4 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: '1rem',
                  color: '#F9FAFB', marginBottom: '16px',
                }}>⚠ Risk Factor Flags</h4>
                {riskFlags.map(f => (
                  <div key={f.label} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(31,41,55,0.5)',
                  }}>
                    <div style={{
                      width: '10px', height: '10px',
                      borderRadius: '50%',
                      background: f.color,
                      marginTop: '5px',
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${f.color}`,
                    }} />
                    <div>
                      <div style={{ color: f.color, fontWeight: 600, fontSize: '0.875rem' }}>{f.label}</div>
                      <div style={{ color: '#6B7280', fontSize: '0.78rem', marginTop: '2px' }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {riskFlags.length === 0 && (
              <div style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '12px',
                padding: '16px 20px',
                color: '#10B981',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                ✓ No significant risk flags detected for this profile
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
