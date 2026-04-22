import { useState } from 'react'
import Landing from './components/Landing.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'dashboard'
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {view === 'landing'
        ? <Landing onEnter={() => setView('dashboard')} />
        : <Dashboard onBack={() => setView('landing')} />
      }
    </div>
  )
}
