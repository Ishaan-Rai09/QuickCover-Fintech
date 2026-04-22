import React, { useState, useEffect } from 'react';
import { GLSLHills } from './ui/glsl-hills';
import Casestudies from './ui/case-studies';
import { ClientsSection } from './ClientsSection';
import HoverFooter from './ui/hover-footer';

const API = 'http://localhost:8000';

export default function Landing({ onEnter }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/metrics`)
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch metrics", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
          Quick<span className="text-indigo-400">Cover</span>
        </h1>
        <button 
          onClick={onEnter}
          className="px-6 py-2.5 bg-white text-indigo-900 rounded-full font-semibold hover:bg-indigo-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transform hover:-translate-y-0.5"
        >
          Try Predictor
        </button>
      </header>

      {/* Hero Section */}
      <div className="relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-black">
        <GLSLHills />
        <div className="space-y-6 pointer-events-none z-10 text-center absolute flex flex-col items-center">
          <h1 className="font-semibold text-5xl md:text-7xl whitespace-pre-wrap text-white">
            <span className="italic text-5xl md:text-6xl font-thin block mb-2">Predictions That Speak <br/> </span>
            Louder Than Guesses
          </h1>
          <p className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto px-4">
            We craft stunning ML visuals and accurate risk experiences that help your insurance brand stand out and issue policies instantly.
          </p>
          <div className="pointer-events-auto mt-8 flex flex-col sm:flex-row gap-4">
             <button
                onClick={onEnter}
                className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
              >
                Calculate Premium Now
              </button>
          </div>
          
          {/* Live Metrics Ticker */}
          <div className="mt-8 flex gap-6 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            {loading ? (
              <div className="text-white/60 text-sm">Loading Live Accuracy...</div>
            ) : metrics ? (
              <div className="flex gap-6 items-center">
                {Object.entries(metrics).slice(0, 1).map(([name, data]) => (
                  <React.Fragment key={name}>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-white/60 uppercase tracking-widest font-semibold">{name} R²</span>
                      <span className="text-xl text-white font-bold">{data.accuracy_pct}%</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-white/60 uppercase tracking-widest font-semibold">{name} MAE</span>
                      <span className="text-xl text-white font-bold">₹{Math.floor(data.mae).toLocaleString()}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ) : null}
          </div>
        </div> 
      </div>

      <Casestudies />
      <ClientsSection />
      
      <div className="px-6 py-12 bg-background z-20 relative">
        <HoverFooter />
      </div>
      
    </div>
  );
}
