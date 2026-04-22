import { useState } from 'react'
import Predict from './components/Predict.jsx'
import Landing from './components/Landing.jsx'

export default function App() {
  const [view, setView] = useState('landing')

  if (view === 'landing') {
    return <Landing onEnter={() => setView('predict')} />
  }

  return (
    <div className="min-h-screen bg-bg text-textPrimary p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-center py-6 border-b border-gray-200">
          <div className="text-left cursor-pointer" onClick={() => setView('landing')}>
             <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
              Quick<span className="text-indigo-400">Cover</span>
             </h1>
             <p className="text-textMuted mt-1 text-sm font-medium">Enterprise Premium Predictor</p>
          </div>
          <button 
            onClick={() => setView('landing')} 
            className="text-sm font-semibold text-textMuted hover:text-primary transition-colors border border-gray-200 px-4 py-2 rounded-lg bg-white shadow-sm"
          >
            ← Back to Home
          </button>
        </header>

        <main>
          <Predict />
        </main>
      </div>
    </div>
  )
}
