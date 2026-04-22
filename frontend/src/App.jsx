import { useState } from 'react'
import Predict from './components/Predict.jsx'
import Landing from './components/Landing.jsx'

export default function App() {
  const [view, setView] = useState('landing')

  return (
    <div className="min-h-screen bg-bg text-textPrimary p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center py-6 flex justify-between items-center border-b border-gray-200">
          <div className="text-left cursor-pointer" onClick={() => setView('landing')}>
             <h1 className="text-3xl font-bold text-primary tracking-tight">QuickCover</h1>
             <p className="text-textMuted mt-1 text-sm font-medium">Enterprise Premium API</p>
          </div>
          {view === 'predict' && (
             <button 
               onClick={() => setView('landing')} 
               className="text-sm font-semibold text-textMuted hover:text-primary transition-colors border border-gray-200 px-4 py-2 rounded-lg bg-white"
             >
               ← Back to Hub
             </button>
          )}
        </header>

        <main>
          {view === 'landing' ? (
            <Landing onEnter={() => setView('predict')} />
          ) : (
            <Predict />
          )}
        </main>
      </div>
    </div>
  )
}
