import Predict from './components/Predict.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-textPrimary p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center py-6">
          <h1 className="text-4xl font-bold text-primary tracking-tight">QuickCover</h1>
          <p className="text-textMuted mt-2 text-lg">Insurance Premium Prediction</p>
        </header>
        <main>
          <Predict />
        </main>
      </div>
    </div>
  )
}
