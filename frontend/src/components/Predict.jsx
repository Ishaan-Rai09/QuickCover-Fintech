import React, { useState } from 'react'

const API = 'http://localhost:8000'

const fmtRupee = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function riskLevel(amount) {
  if (amount < 20000)  return { level: 'Low',    color: 'text-success',  bg: 'bg-green-50',  border: 'border-green-200' }
  if (amount <= 50000) return { level: 'Medium', color: 'text-warning',  bg: 'bg-amber-50',  border: 'border-amber-200' }
  return                      { level: 'High',   color: 'text-danger',   bg: 'bg-red-50',    border: 'border-red-200' }
}

function SliderField({ label, id, value, onChange, min, max, step = 1, unit = '' }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <label htmlFor={id} className="text-sm font-semibold text-textPrimary">{label}</label>
        <span className="text-sm font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{value}{unit}</span>
      </div>
      <input 
        id={id} 
        type="range" 
        min={min} max={max} step={step} value={value}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        onChange={e => onChange(step === 1 ? parseInt(e.target.value) : parseFloat(e.target.value))}
      />
      <div className="flex justify-between mt-1 text-xs text-textMuted">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
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

  const risk = result && result.ensemble_average ? riskLevel(result.ensemble_average) : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Form */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h3 className="text-xl font-bold text-textPrimary mb-6 pb-4 border-b border-border">Customer Profile Details</h3>
        
        {error && (
          <div className="p-4 mb-6 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
            {error.includes('not trained') ? 'Models not trained yet on the backend.' : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <SliderField label="Age" id="inp-age" value={form.age} onChange={set('age')} min={18} max={65} unit=" yrs" />
          <SliderField label="BMI" id="inp-bmi" value={form.bmi} onChange={set('bmi')} min={15} max={50} step={0.1} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-textPrimary block mb-2">Smoking Status</label>
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button type="button" onClick={() => set('smoker')('No')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${form.smoker === 'No' ? 'bg-white shadow text-success border border-gray-200' : 'text-textMuted'}`}>Non-Smoker</button>
                <button type="button" onClick={() => set('smoker')('Yes')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${form.smoker === 'Yes' ? 'bg-white shadow text-danger border border-gray-200' : 'text-textMuted'}`}>Smoker</button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-textPrimary block mb-2">Region</label>
              <select className="w-full bg-gray-50 border border-gray-200 text-textPrimary text-sm rounded-lg focus:ring-primary focus:border-primary block p-2" value={form.region} onChange={e => set('region')(e.target.value)}>
                {['North', 'South', 'East', 'West'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <SliderField label="Dependents" id="inp-dependents" value={form.no_of_dependents} onChange={set('no_of_dependents')} min={0} max={5} />
             <SliderField label="Conditions" id="inp-conditions" value={form.pre_existing_conditions} onChange={set('pre_existing_conditions')} min={0} max={5} />
          </div>

          <button type="submit" disabled={loading} className="w-full text-white bg-primary hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4">
            {loading ? 'Processing...' : 'Calculate Premium Quote'}
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {result ? (
          <>
            <div className={`rounded-xl p-8 border text-center ${risk.bg} ${risk.border}`}>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white border shadow-sm mb-4 uppercase tracking-wide">
                <span className={`${risk.color}`}>{risk.level} Risk Level</span>
              </div>
              <p className="text-sm font-medium text-textMuted uppercase tracking-wider mb-1">Recommended Average Premium</p>
              <p className={`text-5xl font-extrabold tracking-tight mb-2 ${risk.color}`}>
                {fmtRupee(result.ensemble_average)}
              </p>
              <p className="text-sm text-textMuted">yearly coverage estimate</p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h4 className="text-md font-bold text-textPrimary mb-4">Underlying Model Outputs</h4>
              <div className="space-y-3">
                 {result.linear_regression && (
                   <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-textMuted font-medium">Linear Regression</span>
                      <span className="text-sm font-semibold text-textPrimary">{fmtRupee(result.linear_regression)}</span>
                   </div>
                 )}
                 {result.ridge_regression && (
                   <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-textMuted font-medium">Ridge Regression</span>
                      <span className="text-sm font-semibold text-textPrimary">{fmtRupee(result.ridge_regression)}</span>
                   </div>
                 )}
                 {result.random_forest && (
                   <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-textMuted font-medium">Random Forest</span>
                      <span className="text-sm font-semibold text-textPrimary">{fmtRupee(result.random_forest)}</span>
                   </div>
                 )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border h-full flex flex-col items-center justify-center text-center pb-24">
            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <h4 className="text-lg font-bold text-textPrimary mb-2">No Estimate Generated</h4>
            <p className="text-sm text-textMuted max-w-sm">Adjust the customer profile parameters on the left and click calculate to view the premium prediction outputs.</p>
          </div>
        )}
      </div>
    </div>
  )
}
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
