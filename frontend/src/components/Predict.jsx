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
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="text-sm font-semibold text-textPrimary">{label}</label>
        <div className="flex items-center bg-blue-50 border border-blue-200 rounded-md overflow-hidden shadow-inner">
          <input 
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onChange(step === 1 ? parseInt(e.target.value) || 0 : parseFloat(e.target.value) || 0)}
            className="w-20 text-right px-2 py-1 text-sm font-bold text-primary bg-transparent outline-none focus:bg-white transition-colors"
          />
          {unit && <span className="text-sm font-bold text-primary pr-2 pointer-events-none select-none">{unit}</span>}
        </div>
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
