function InsightCard({ emoji, title, children, accentColor = '#3B82F6' }) {
  return (
    <div className="glass-card" style={{
      padding: '28px',
      borderLeft: `3px solid ${accentColor}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700, fontSize: '1.1rem',
          color: '#F9FAFB',
        }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function BulletPoint({ children, color = '#3B82F6' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: color, marginTop: '6px', flexShrink: 0,
        boxShadow: `0 0 6px ${color}`,
      }} />
      <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.7 }}>{children}</p>
    </div>
  )
}

export default function Insights() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      <div>
        <h2 className="section-heading" style={{ fontSize: '1.8rem' }}>💡 Insights & Presentation Notes</h2>
        <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
          Key analytical insights and answers to exam hint questions
        </p>
      </div>

      {/* Q1: RMSE vs MAE */}
      <InsightCard emoji="📐" title="Why RMSE over MAE in Insurance Pricing?" accentColor="#3B82F6">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '16px' }}>
          <div style={{
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '12px', padding: '16px',
          }}>
            <div style={{ color: '#3B82F6', fontWeight: 700, marginBottom: '8px' }}>RMSE — Why We Use It</div>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.7 }}>
              RMSE squares each error before averaging, making it <em style={{ color: '#F9FAFB' }}>extremely sensitive to large errors</em>. 
              A single catastrophic mispricing (e.g., predicting ₹5,000 for a ₹90,000 risk) inflates RMSE dramatically — 
              forcing the model to prioritize reducing such outlier errors.
            </p>
          </div>
          <div style={{
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '12px', padding: '16px',
          }}>
            <div style={{ color: '#8B5CF6', fontWeight: 700, marginBottom: '8px' }}>MAE — Why It Falls Short</div>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.7 }}>
              MAE treats a ₹500 error identically to a ₹50,000 error. In actuarial science, 
              systematically under-pricing high-risk customers leads to <em style={{ color: '#F9FAFB' }}>adverse selection</em> and 
              potential insurer insolvency. MAE is blind to this catastrophic tail risk.
            </p>
          </div>
        </div>
        <div style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: '10px', padding: '14px 18px',
          color: '#F59E0B', fontSize: '0.875rem', fontWeight: 600,
        }}>
          📌 Rule of Thumb: When the cost of large errors is disproportionately high (as in insurance pricing), 
          always prefer RMSE. Use MAE only when all error magnitudes carry equal business consequences.
        </div>
      </InsightCard>

      {/* Q2: Fairness */}
      <InsightCard emoji="⚖️" title="How Do We Ensure the Model Is Not Discriminatory?" accentColor="#10B981">
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '16px' }}>
          Insurance pricing models carry inherent fairness risks. Here is how QuickCover mitigates bias:
        </p>
        <BulletPoint color="#10B981">
          <strong style={{ color: '#F9FAFB' }}>Feature Selection:</strong> We only include actuarially-justified risk factors (Age, BMI, Smoking, Region, Dependents, Conditions). 
          Protected attributes like gender, ethnicity, religion, or caste are explicitly excluded from the dataset and model.
        </BulletPoint>
        <BulletPoint color="#10B981">
          <strong style={{ color: '#F9FAFB' }}>Region Fairness Review:</strong> Region is used as a geographic risk factor (e.g., pollution, healthcare access), 
          not as a proxy for ethnicity. Regional premiums should be reviewed against actuarial loss data to confirm validity.
        </BulletPoint>
        <BulletPoint color="#10B981">
          <strong style={{ color: '#F9FAFB' }}>Disparate Impact Testing:</strong> Before deployment, compute premium prediction distributions across demographic groups. 
          Apply the 80% rule — no group's average premium may exceed 1.25× the baseline group without actuarial justification.
        </BulletPoint>
        <BulletPoint color="#10B981">
          <strong style={{ color: '#F9FAFB' }}>Model Explainability (XAI):</strong> Feature importances from Random Forest and SHAP values can be audited by regulators (IRDAI) 
          to verify that no protected proxy variables are implicitly driving pricing decisions.
        </BulletPoint>
        <BulletPoint color="#10B981">
          <strong style={{ color: '#F9FAFB' }}>Regular Bias Audits:</strong> Periodically retrain models on updated data and run fairness metrics  
          (Demographic Parity, Equalized Odds) using libraries like Fairlearn or AIF360 to detect and correct emerging biases.
        </BulletPoint>
        <div style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: '10px', padding: '14px 18px', marginTop: '8px',
          color: '#10B981', fontSize: '0.875rem', fontWeight: 600,
        }}>
          ✅ Regulatory Note: In India, IRDAI strictly prohibits discriminatory pricing. All ML-based underwriting systems 
          must comply with IRDAI's Health Insurance Regulations, 2016.
        </div>
      </InsightCard>

      {/* Q3: Additional data */}
      <InsightCard emoji="📡" title="What Additional Data Would Improve Accuracy?" accentColor="#F59E0B">
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '16px' }}>
          Five high-impact data sources that would significantly improve prediction accuracy:
        </p>
        {[
          {
            n: '01', title: 'Claims History',
            desc: 'Historical insurance claims (frequency + severity) of the individual are the single strongest predictor of future premium risk. Even 2–3 years of claims data can reduce RMSE by 30–40%.',
            color: '#F59E0B',
          },
          {
            n: '02', title: 'Lifestyle Metrics (Wearable Data)',
            desc: 'Step count, resting heart rate, sleep quality from wearables (Fitbit, Apple Watch) provide real-time health telemetry far more precise than BMI or age alone.',
            color: '#F59E0B',
          },
          {
            n: '03', title: 'Family Medical History',
            desc: 'Hereditary risk factors (diabetes, hypertension, cancer history) in first-degree relatives are strong actuarial predictors. Currently entirely absent from this dataset.',
            color: '#F59E0B',
          },
          {
            n: '04', title: 'Lab Biomarkers',
            desc: 'Blood glucose, cholesterol, HbA1c, blood pressure readings provide objective medical risk signals that are far more predictive than BMI for chronic conditions like diabetes.',
            color: '#F59E0B',
          },
          {
            n: '05', title: 'Socioeconomic & Occupation Data',
            desc: 'Occupation type (desk job vs manual labour), income level, and educational attainment correlate strongly with health outcomes and claims frequency in actuarial research.',
            color: '#F59E0B',
          },
        ].map(item => (
          <div key={item.n} style={{
            display: 'flex', gap: '16px', marginBottom: '16px',
            padding: '14px',
            background: 'rgba(245,158,11,0.05)',
            border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: '10px',
          }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'rgba(245,158,11,0.15)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#F59E0B', fontWeight: 800, fontSize: '0.75rem',
              flexShrink: 0,
            }}>{item.n}</div>
            <div>
              <div style={{ color: '#F9FAFB', fontWeight: 700, marginBottom: '4px', fontSize: '0.9rem' }}>{item.title}</div>
              <p style={{ color: '#9CA3AF', fontSize: '0.82rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </InsightCard>

      {/* Feature importance narrative */}
      <InsightCard emoji="🌲" title="Feature Importance Interpretation" accentColor="#8B5CF6">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {[
            { feature: 'Smoker', imp: 'Very High (~35-45%)', color: '#EF4444', desc: 'Dominant predictor. Smoking status alone accounts for the largest share of premium variance, consistent with actuarial data globally.' },
            { feature: 'Age', imp: 'High (~20-25%)', color: '#F59E0B', desc: 'Older individuals have higher age-related healthcare costs. Risk increases non-linearly after age 50.' },
            { feature: 'Pre-Existing Conditions', imp: 'High (~15-20%)', color: '#F59E0B', desc: 'Each additional chronic condition significantly raises expected claim costs and thus premiums.' },
            { feature: 'BMI', imp: 'Moderate (~10-15%)', color: '#3B82F6', desc: 'Strong correlation with obesity-related conditions (diabetes, hypertension, sleep apnea) and their associated claims.' },
            { feature: 'No. of Dependents', imp: 'Low-Moderate (~5-10%)', color: '#6366F1', desc: 'Each dependent adds incremental risk but individual members\' health profiles matter more than count alone.' },
            { feature: 'Region', imp: 'Low (~2-5%)', color: '#10B981', desc: 'Geographic variation in healthcare costs and pollution levels creates modest regional premium differences.' },
          ].map(item => (
            <div key={item.feature} style={{
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: '10px', padding: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ color: '#F9FAFB', fontWeight: 700, fontSize: '0.875rem' }}>{item.feature}</span>
                <span style={{
                  background: `${item.color}20`, color: item.color,
                  border: `1px solid ${item.color}40`,
                  borderRadius: '999px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700,
                }}>{item.imp}</span>
              </div>
              <p style={{ color: '#6B7280', fontSize: '0.78rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </InsightCard>

      {/* Model recommendation */}
      <InsightCard emoji="🏆" title="Model Recommendation & Justification" accentColor="#10B981">
        <div style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.07))',
          border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: '12px', padding: '20px', marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>⭐</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#10B981' }}>
              Recommended: Random Forest Regressor
            </span>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Random Forest consistently outperforms the linear models on this dataset due to its ability to capture 
            <strong style={{ color: '#F9FAFB' }}> non-linear interactions and feature dependencies</strong>. 
            For example, the risk amplification when a customer is simultaneously old, a smoker, and has pre-existing conditions 
            is a multiplicative (non-linear) effect that linear regression completely misses.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            { pro: '✅ Handles non-linear feature interactions', color: '#10B981' },
            { pro: '✅ Robust to outliers (ensemble of trees)', color: '#10B981' },
            { pro: '✅ Native feature importance scores', color: '#10B981' },
            { pro: '✅ No scaling required (but we scale anyway)', color: '#10B981' },
            { pro: '⚠ Less interpretable than linear models', color: '#F59E0B' },
            { pro: '⚠ Slower inference for very large datasets', color: '#F59E0B' },
          ].map((item, i) => (
            <div key={i} style={{
              background: `${item.color}08`,
              border: `1px solid ${item.color}25`,
              borderRadius: '8px', padding: '10px 14px',
              color: '#9CA3AF', fontSize: '0.82rem',
            }}>
              {item.pro}
            </div>
          ))}
        </div>
      </InsightCard>

    </div>
  )
}
