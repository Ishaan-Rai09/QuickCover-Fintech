# QuickCover 🛡️
### AI-Powered Health Insurance Premium Prediction Platform

> An end-to-end InsurTech web application built with **FastAPI + React + Vite + TailwindCSS** for a college project, demonstrating machine learning-based premium underwriting.

---

## 📋 Project Overview

QuickCover predicts health insurance premiums using three supervised learning models trained on 800 insurance records. The platform features:

- **3 ML Models**: Linear Regression, Ridge Regression, Random Forest
- **REST API**: FastAPI backend with 4 endpoints
- **Interactive Dashboard**: Full SPA with 6 tabs — Overview, EDA, Model Training, Predict, Sample Profiles, Insights
- **Rich Visualizations**: Recharts correlation, feature importance, and comparison charts
- **Risk Classification**: Low / Medium / High premium tiers with visual indicators

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm 9+

### 1. Place the Dataset
Copy `P7_Insurance_Premium.csv` into the `backend/` directory:
```
quickcover/backend/P7_Insurance_Premium.csv
```

### 2. Start the Backend
```bash
cd quickcover/backend
pip install -r requirements.txt
uvicorn main:app --reload
```
API will be available at: `http://localhost:8000`

### 3. Start the Frontend
```bash
cd quickcover/frontend
npm install
npm run dev
```
App will be available at: `http://localhost:5173`

### 4. Usage Flow
1. Open `http://localhost:5173`
2. Go to **Model Training** tab → click **Train All Models**
3. Explore **EDA** for data insights
4. Use **Predict** tab to get live premium estimates
5. Check **Sample Profiles** for benchmark comparisons
6. Review **Insights** for presentation talking points

---

## 📡 API Endpoint Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/eda` | Returns EDA summary: distributions, correlations, outliers, smoker/region averages |
| `GET` | `/api/train` | Trains all 3 models and returns RMSE, MAE, R² + feature importances |
| `POST` | `/api/predict` | Accepts customer profile JSON, returns predictions from all 3 models + ensemble |
| `GET` | `/api/sample-predictions` | Returns predictions for 3 hardcoded benchmark profiles |

### POST /api/predict — Request Body
```json
{
  "age": 35,
  "bmi": 28.5,
  "smoker": "Yes",
  "region": "North",
  "no_of_dependents": 2,
  "pre_existing_conditions": 1
}
```

### POST /api/predict — Response
```json
{
  "linear_regression": 42500.00,
  "ridge_regression": 41800.00,
  "random_forest": 44100.00,
  "ensemble_average": 42800.00
}
```

---

## 🤖 Model Performance Summary

> Run `GET /api/train` to populate actual values. Below are representative benchmarks.

| Model | RMSE (₹) | MAE (₹) | R² Score | Rating |
|-------|----------|---------|----------|--------|
| Linear Regression | ~TBD | ~TBD | ~TBD | 🔵 |
| Ridge Regression | ~TBD | ~TBD | ~TBD | 🔵 |
| **Random Forest** | **~TBD** | **~TBD** | **~TBD** | ⭐ Best |

*Train the models and update the table above with actual values.*

---

## 👥 Sample Prediction Results

| Profile | Age | BMI | Smoker | Region | Dependents | Conditions | Predicted (₹) | Benchmark (₹) |
|---------|-----|-----|--------|--------|------------|------------|---------------|---------------|
| 🟢 Low Risk | 28 | 22.1 | No | South | 0 | 0 | ~12,000 | 12,000 |
| 🟡 Medium Risk | 45 | 31.5 | Yes | North | 2 | 1 | ~45,000 | 45,000 |
| 🔴 High Risk | 60 | 38.2 | Yes | West | 3 | 3 | ~95,000 | 95,000 |

---

## 🏗️ Project Structure

```
quickcover/
├── backend/
│   ├── main.py                    # FastAPI app with all 4 endpoints
│   ├── requirements.txt           # Python dependencies
│   ├── P7_Insurance_Premium.csv   # Dataset (place here)
│   └── models/                    # Auto-created: saved model .pkl files
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Root SPA with tab routing
│   │   ├── main.jsx               # React entry point
│   │   ├── index.css              # Global design system styles
│   │   └── components/
│   │       ├── Header.jsx         # Sticky header with logo + tabs
│   │       ├── Overview.jsx       # Hero, stat cards, dataset table
│   │       ├── EDA.jsx            # EDA charts and stats
│   │       ├── ModelTraining.jsx  # Model cards + comparison charts
│   │       ├── Predict.jsx        # Prediction form + results
│   │       ├── SampleProfiles.jsx # Benchmark profile cards
│   │       └── Insights.jsx       # Presentation talking points
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

---

## 🧠 ML Pipeline

1. **Label Encoding**: Smoker (No→0, Yes→1)
2. **One-Hot Encoding**: Region (drop_first=True → East as baseline)
3. **Standard Scaling**: Applied to all numeric features post-encoding
4. **Train/Test Split**: 80/20, random_state=42
5. **Models**: All with random_state=42 where applicable

---

## 📚 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, Uvicorn |
| ML | Scikit-learn, NumPy, Pandas |
| Model Persistence | Joblib |
| Frontend | React 18, Vite 5 |
| Styling | TailwindCSS 3 |
| Charts | Recharts 2 |
| Fonts | Google Fonts (Plus Jakarta Sans, Syne) |

---

*Built for InsurTech Domain — College Project*
