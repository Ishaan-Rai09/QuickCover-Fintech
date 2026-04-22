import { useState, useEffect } from 'react'

const stats = [
  { val: '800+', label: 'Records Trained' },
  { val: '3',    label: 'ML Models' },
  { val: '6',    label: 'Risk Factors' },
  { val: '99%',  label: 'Uptime SLA' },
]

const features = [
  {
    icon: '🧠',
    color: '#3b82f6',
    title: 'Multi-Model Ensemble',
    desc: 'Linear Regression, Ridge & Random Forest predictions averaged for maximum accuracy.',
  },
  {
    icon: '📊',
    color: '#10b981',
    title: 'Full EDA Dashboard',
    desc: 'Interactive charts: correlations, distributions, outliers and regional breakdowns.',
  },
  {
    icon: '⚡',
    color: '#f59e0b',
    title: 'Instant Predictions',
    desc: 'Sub-second premium quotes for any customer profile — no page reload needed.',
  },
  {
    icon: '🛡️',
    color: '#8b5cf6',
    title: 'Fairness-First Design',
    desc: 'Built on actuarially-sound features only. No protected attributes used in scoring.',
  },
  {
    icon: '🔍',
    color: '#06b6d4',
    title: 'Explainable AI',
    desc: 'Random Forest feature importances reveal exactly what drives each premium decision.',
  },
  {
    icon: '🏆',
    color: '#ef4444',
    title: 'Benchmark Comparison',
    desc: 'Three pre-loaded risk profiles vs real industry benchmarks with deviation analysis.',
  },
]

const steps = [
  { num: '01', title: 'Train the Models', desc: 'Click "Train All Models" to fit 3 ML algorithms on 800 insurance records.' },
  { num: '02', title: 'Explore the Data', desc: 'Dive into the EDA tab for statistical summaries & interactive visualizations.' },
  { num: '03', title: 'Get a Quote', desc: 'Fill in the Predict form and receive instant multi-model premium estimates.' },
]

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const num = parseInt(target.replace(/[^0-9]/g, ''))
    if (!num) { setCount(target); return }
    let start = 0
    const step = Math.ceil(num / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= num) { setCount(target); clearInterval(timer) }
      else setCount(start + suffix)
    }, 30)
    return () => clearInterval(timer)
  }, [target, suffix])
  return <span>{count}</span>
}

export default function Landing({ onEnter }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>

      {/* ── Ambient orbs ─────────────────────────────────────── */}
      <div className="orb" style={{
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)',
        top: -200, left: -150,
      }} />
      <div className="orb" style={{
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
        top: 100, right: -120,
      }} />
      <div className="orb" style={{
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)',
        top: 600, left: '40%',
      }} />

      {/* ══════════════════════════════════════════════════════
          NAV BAR
      ══════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(24px, 6vw, 80px)',
        height: 68,
        background: 'rgba(5,9,20,0.8)',
        borderBottom: '1px solid rgba(30,45,69,0.6)',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42,
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(59,130,246,0.45)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z"
                fill="white" fillOpacity="0.95"/>
              <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800, fontSize: '1.35rem',
            background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>QuickCover</span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['Features', 'How It Works'].map(l => (
            <a key={l} href={`#${l.replace(' ','-').toLowerCase()}`} style={{
              padding: '8px 16px', borderRadius: 10,
              color: 'var(--text2)', fontSize: '0.85rem', fontWeight: 600,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text)'}
            onMouseLeave={e => e.target.style.color = 'var(--text2)'}
            >{l}</a>
          ))}
          <button className="btn btn-primary btn-sm" style={{ marginLeft: 8 }} onClick={onEnter}>
            Launch App →
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px clamp(24px, 6vw, 80px) 60px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div className="hero-grid" />

        {/* Floating pill badge */}
        <div className="fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: 999, padding: '7px 18px',
          marginBottom: 28, position: 'relative', zIndex: 1,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#3b82f6',
            boxShadow: '0 0 8px #3b82f6',
            animation: 'pulse-ring 1.5s ease-out infinite',
          }} />
          <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.06em' }}>
            AI-POWERED INSURANCE UNDERWRITING
          </span>
        </div>

        {/* Headline */}
        <h1 className="fade-up d1" style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          maxWidth: 900,
          position: 'relative', zIndex: 1,
          marginBottom: 24,
        }}>
          Predict Insurance<br />
          <span className="g-text">Premiums in Seconds</span>
        </h1>

        {/* Sub-headline */}
        <p className="fade-up d2" style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          color: 'var(--text2)', lineHeight: 1.7,
          maxWidth: 620, marginBottom: 44,
          position: 'relative', zIndex: 1,
        }}>
          QuickCover harnesses <strong style={{ color: 'var(--text)' }}>three machine learning models</strong> trained
          on 800 real insurance records to deliver accurate, explainable premium quotes —
          powered by FastAPI and React.
        </p>

        {/* CTA buttons */}
        <div className="fade-up d3" style={{
          display: 'flex', gap: 14, flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: 64,
          position: 'relative', zIndex: 1,
        }}>
          <button className="btn btn-primary btn-lg"
            onClick={onEnter}
            style={{ animation: 'borderGlow 2.5s ease-in-out infinite' }}
          >
            🚀 Open Dashboard
          </button>
          <a href="#features" className="btn btn-outline btn-lg" style={{ textDecoration: 'none', color: 'var(--text)' }}>
            See Features ↓
          </a>
        </div>

        {/* Stats row */}
        <div className="fade-up d4" style={{
          display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center',
          position: 'relative', zIndex: 1,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '2.2rem', fontWeight: 900,
                background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {s.val}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text3)', fontWeight: 600, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Hero mockup card */}
        <div className="fade-up d5 float-anim" style={{
          marginTop: 64, maxWidth: 760, width: '100%',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{
            background: 'rgba(13,20,36,0.85)',
            border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 24,
            padding: '28px 32px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)',
          }}>
            {/* Fake window chrome */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              {['#ef4444','#f59e0b','#10b981'].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
              <div style={{
                marginLeft: 'auto', padding: '4px 16px',
                background: 'rgba(30,45,69,0.5)', borderRadius: 8,
                fontSize: '0.75rem', color: 'var(--text3)',
              }}>localhost:5173 / predict</div>
            </div>

            {/* Fake prediction result */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
                {['Age: 42', 'BMI: 28.5', '🚬 Smoker', 'North'].map(t => (
                  <span key={t} style={{
                    padding: '5px 12px', borderRadius: 8,
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600,
                  }}>{t}</span>
                ))}
              </div>
              {[
                { label: 'Linear Regression', val: '₹41,200', color: '#6366f1' },
                { label: 'Ridge Regression',  val: '₹40,850', color: '#8b5cf6' },
                { label: 'Random Forest',     val: '₹43,100', color: '#3b82f6' },
              ].map(m => (
                <div key={m.label} style={{
                  background: 'rgba(5,9,20,0.6)',
                  border: '1px solid rgba(30,45,69,0.6)',
                  borderRadius: 14, padding: '14px 18px',
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.4rem', fontWeight: 800, color: m.color }}>{m.val}</div>
                </div>
              ))}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 14, padding: '14px 18px',
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 6 }}>Ensemble Average</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#fcd34d' }}>₹41,717</div>
                <span style={{ fontSize: '0.7rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>🟡 MEDIUM RISK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section id="features" style={{
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 80px)',
        position: 'relative',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="badge badge-blue" style={{ marginBottom: 14, fontSize: '0.72rem' }}>⚡ CAPABILITIES</div>
          <h2 className="sec-title" style={{ marginBottom: 14 }}>
            Everything you need for<br /><span className="g-text">modern insurance pricing</span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
            Built for a college InsurTech project — but production-quality in design and engineering.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20, maxWidth: 1200, margin: '0 auto',
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="glass"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '28px',
                transition: 'all 0.3s ease',
                ...(hovered === i ? {
                  borderColor: `${f.color}55`,
                  boxShadow: `0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px ${f.color}30`,
                  transform: 'translateY(-6px)',
                } : {}),
              }}
            >
              <div className="feature-icon" style={{
                background: `${f.color}18`,
                border: `1px solid ${f.color}30`,
                marginBottom: 18,
              }}>{f.icon}</div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: '1.05rem',
                color: 'var(--text)', marginBottom: 10,
              }}>{f.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 80px)',
        background: 'rgba(13,20,36,0.5)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge badge-purple" style={{ marginBottom: 14 }}>🔍 WORKFLOW</div>
            <h2 className="sec-title">Three steps to your<br /><span className="g-text">premium prediction</span></h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 20, alignItems: 'flex-start',
                background: 'rgba(13,20,36,0.7)',
                border: '1px solid var(--border)',
                borderRadius: 18, padding: '24px 28px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'; e.currentTarget.style.transform = 'translateX(6px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div className="step-num">{s.num}</div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: 6 }}>{s.title}</div>
                  <div style={{ color: 'var(--text2)', fontSize: '0.875rem', lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA FOOTER
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="orb" style={{
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          bottom: -200, left: '30%', transform: 'translateX(-50%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900, color: 'var(--text)',
            marginBottom: 20, lineHeight: 1.1,
          }}>
            Ready to predict?<br />
            <span className="g-text">Launch the dashboard.</span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Train models, explore insights, and get instant premium estimates — all in one platform.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={onEnter}
            style={{ animation: 'borderGlow 2.5s ease-in-out infinite' }}
          >
            🚀 Open QuickCover Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px clamp(24px, 6vw, 80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>
          © 2026 QuickCover — InsurTech Project
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-blue">FastAPI</span>
          <span className="badge badge-purple">React + Vite</span>
          <span className="badge badge-green">Scikit-learn</span>
        </div>
      </footer>
    </div>
  )
}
