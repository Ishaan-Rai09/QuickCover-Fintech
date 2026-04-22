import React, { useState, useEffect } from 'react';

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
    <div className="flex flex-col min-h-[85vh] justify-center items-center text-center px-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-primary tracking-tight mb-6">
          Intelligent Insurance Pricing
        </h1>
        <p className="text-xl text-textMuted mb-10 leading-relaxed">
          Leverage a robust ensemble of machine learning models to instantly calculate precise, context-aware health insurance premiums based on individual risk profiles.
        </p>

        <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-left mx-auto mb-10">
          <h2 className="text-2xl font-bold text-textPrimary mb-6 border-b border-border pb-4">
            Current Model Performance
          </h2>
          
          {loading ? (
            <div className="text-textMuted italic">Loading metrics processing...</div>
          ) : metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(metrics).map(([name, data]) => (
                <div key={name} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-textPrimary mb-3">{name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-textMuted font-medium">Accuracy (R²)</span>
                      <span className="font-bold text-success">{data.accuracy_pct}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-textMuted font-medium">Error (MAE)</span>
                      <span className="font-semibold text-textPrimary">₹{data.mae.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${data.accuracy_pct}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-danger italic">Model metrics unavailable. Ensure the backend is trained.</div>
          )}
        </div>

        <button 
          onClick={onEnter}
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-primary hover:bg-blue-700 rounded-lg shadow-md transition-colors"
        >
          Open Prediction Dashboard
          <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
