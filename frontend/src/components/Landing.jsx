import React, { useEffect, useState } from 'react';
import { ClientsSection } from './ClientsSection';
import DemoOne from './ui/demo';
import { GLSLHills } from './ui/glsl-hills';
import HoverFooter from './ui/hover-footer';

const API = 'http://localhost:8000';

export default function Landing({ onEnter }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/metrics`)
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch metrics', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans selection:bg-cyan-400/30">
      <header className="absolute top-0 z-50 w-full p-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-slate-950/35 px-4 py-3 backdrop-blur-xl md:px-6">
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
            Quick<span className="text-indigo-400">Cover</span>
          </h1>
          <button
            onClick={onEnter}
            className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-6 py-2.5 font-semibold text-cyan-100 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/15 hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]"
          >
            Try Predictor
          </button>
        </div>
      </header>

      <section className="relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-black">
        <GLSLHills />

        <div className="pointer-events-none absolute z-10 flex flex-col items-center space-y-6 px-4 text-center">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-cyan-200 backdrop-blur-md">
            ML-powered insurance pricing
          </div>
          <h1 className="whitespace-pre-wrap text-5xl font-semibold text-white md:text-7xl">
            <span className="mb-2 block text-5xl font-thin italic md:text-6xl">Predictions That Speak</span>
            Louder Than Guesses
          </h1>
          <p className="mx-auto max-w-2xl px-4 text-sm text-white/80 md:text-lg">
            We craft a cinematic risk platform for insurers who want faster decisions, cleaner premium logic, and a digital experience that feels future ready.
          </p>

          <div className="pointer-events-auto mt-6 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={onEnter}
              className="rounded-full bg-cyan-400 px-8 py-4 text-lg font-bold text-slate-950 transition-all hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
            >
              Calculate Premium Now
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md">
            {loading ? (
              <div className="text-sm text-white/60">Loading live model quality...</div>
            ) : metrics ? (
              <div className="flex items-center gap-6">
                {Object.entries(metrics)
                  .slice(0, 1)
                  .map(([name, data]) => (
                    <React.Fragment key={name}>
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold uppercase tracking-widest text-white/60">{name} R2</span>
                        <span className="text-xl font-bold text-white">{data.accuracy_pct}%</span>
                      </div>
                      <div className="h-8 w-px bg-white/10" />
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold uppercase tracking-widest text-white/60">{name} MAE</span>
                        <span className="text-xl font-bold text-white">
                          Rs {Math.floor(data.mae).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <DemoOne />
      <ClientsSection />

      <div className="relative z-20 bg-background px-6 py-12">
        <HoverFooter />
      </div>
    </div>
  );
}
