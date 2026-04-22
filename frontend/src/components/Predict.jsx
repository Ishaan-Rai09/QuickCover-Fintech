import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { ShieldCheck, Zap, Activity, Info, ActivitySquare } from 'lucide-react'

const API = 'http://localhost:8000'

const fmtRupee = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function riskLevel(amount) {
  if (amount < 20000)  return { level: 'Low',    color: 'text-emerald-400',  bg: 'bg-emerald-400/10',  border: 'border-emerald-400/20' }
  if (amount <= 50000) return { level: 'Medium', color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20' }
  return                      { level: 'High',   color: 'text-rose-400',   bg: 'bg-rose-400/10',    border: 'border-rose-400/20' }
}

function SliderField({ label, id, value, onChange, min, max, step = 1, unit = '' }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-3">
        <label htmlFor={id} className="text-sm font-medium tracking-wide text-white/80">{label}</label>
        <div className="flex items-center px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg shadow-inner">
          <input 
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onChange(step === 1 ? parseInt(e.target.value) || 0 : parseFloat(e.target.value) || 0)}
            className="w-16 text-right text-sm font-bold text-white bg-transparent outline-none focus:ring-0"
          />
          {unit && <span className="text-xs font-bold text-white/40 pl-1 select-none">{unit}</span>}
        </div>
      </div>
      <div className="relative w-full h-1.5 bg-white/10 rounded-full">
        <div 
          className="absolute top-0 left-0 h-full bg-cyan-400 rounded-full" 
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        <input 
          id={id} 
          type="range" 
          min={min} max={max} step={step} value={value}
          className="absolute top-0 left-0 w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cyan-400 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
          onChange={e => onChange(step === 1 ? parseInt(e.target.value) : parseFloat(e.target.value))}
        />
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-medium tracking-widest uppercase text-white/30">
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
    if(e) e.preventDefault()
    setLoading(true)
    setError(null)
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

  // Auto-fetch on initial load
  useEffect(() => {
    handleSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const risk = result && result.ensemble_average ? riskLevel(result.ensemble_average) : null

  const chartData = result ? [
    { name: 'Linear', value: result.linear_regression },
    { name: 'Ridge', value: result.ridge_regression },
    { name: 'Forest', value: result.random_forest },
  ] : []

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6 relative z-10 font-body">
      
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Intelligent Quote <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Predictor</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Adjust the risk parameters below and watch our ensemble ML engine recalculate premiums in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-xl -z-10" />
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <ActivitySquare className="text-cyan-400 w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">Risk Profile</h3>
              </div>
              
              {error && (
                <div className="p-4 mb-8 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/20 flex items-start gap-3">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{error.includes('not trained') ? 'Models not trained yet on the backend.' : error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <SliderField label="Age" id="inp-age" value={form.age} onChange={set('age')} min={18} max={65} unit="y" />
                <SliderField label="BMI" id="inp-bmi" value={form.bmi} onChange={set('bmi')} min={15} max={50} step={0.1} />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-white/50 block mb-3">Smoking Status</label>
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                      <button type="button" onClick={() => set('smoker')('No')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${form.smoker === 'No' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/80'}`}>No</button>
                      <button type="button" onClick={() => set('smoker')('Yes')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${form.smoker === 'Yes' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-white/40 hover:text-white/80'}`}>Yes</button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-white/50 block mb-3">Region</label>
                    <div className="relative">
                      <select className="w-full bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 block p-2.5 appearance-none cursor-pointer outline-none" value={form.region} onChange={e => set('region')(e.target.value)}>
                        {['North', 'South', 'East', 'West'].map(r => <option key={r} value={r} className="bg-zinc-900">{r}</option>)}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <SliderField label="Dependents" id="inp-dependents" value={form.no_of_dependents} onChange={set('no_of_dependents')} min={0} max={5} />
                   <SliderField label="Conditions" id="inp-conditions" value={form.pre_existing_conditions} onChange={set('pre_existing_conditions')} min={0} max={5} />
                </div>

                <button type="submit" disabled={loading} className="w-full relative group overflow-hidden rounded-xl p-[1px]">
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-cyan-400 rounded-xl opacity-70 group-hover:opacity-100 blur transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center gap-2 px-8 py-4 bg-black rounded-xl border border-white/10 transition-all group-hover:bg-black/50">
                    <Zap className={`w-5 h-5 text-cyan-400 ${loading ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-bold text-white tracking-wide uppercase">
                      {loading ? 'Crunching Numbers...' : 'Calculate Premium'}
                    </span>
                  </div>
                </button>
              </form>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {result ? (
              <>
                {/* Hero Stat Card */}
                <div className={`relative overflow-hidden rounded-2xl md:rounded-[2rem] border p-8 md:p-12 backdrop-blur-md ${risk.bg} ${risk.border}`}>
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <ShieldCheck className="w-48 h-48" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border mb-8 ${risk.bg} ${risk.border} ${risk.color}`}>
                      <Activity className="w-3.5 h-3.5" />
                      {risk.level} Risk Profile
                    </div>
                    
                    <p className="text-sm font-semibold tracking-widest uppercase text-white/40 mb-3">Ensemble Recommended Premium</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className={`text-6xl md:text-8xl font-black tracking-tighter ${risk.color} drop-shadow-2xl`}>
                        {fmtRupee(result.ensemble_average)}
                      </h4>
                      <span className="text-xl font-bold text-white/30 uppercase tracking-widest">/YR</span>
                    </div>
                  </div>
                </div>

                {/* Data Viz Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                    <h5 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      Model Consensus
                    </h5>
                    
                    <div className="space-y-5">
                       {chartData.map((item, idx) => (
                         <div key={item.name} className="relative">
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-sm font-medium text-white/70">{item.name}</span>
                              <span className="text-sm font-bold text-white font-mono">{fmtRupee(item.value)}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.value / result.ensemble_average) * 80}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                              />
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col min-h-[250px]">
                    <h5 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Variance Chart
                    </h5>
                    
                    <div className="flex-1 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                          <RechartsTooltip 
                            cursor={{ fill: '#ffffff05' }}
                            contentStyle={{ backgroundColor: '#000000e6', border: '1px solid #ffffff20', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            formatter={(value) => [fmtRupee(value), 'Premium']}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#8b5cf6' : '#22d3ee'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-[2rem] h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 backdrop-blur-md">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-6">
                  <Activity className="w-8 h-8 text-white/20" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">Awaiting Parameters</h4>
                <p className="text-white/40 max-w-sm text-sm leading-relaxed">
                  The ensemble model requires input parameters to generate a premium quote. Adjust the profile and calculate to begin.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
