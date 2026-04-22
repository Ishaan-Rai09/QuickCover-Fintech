from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib
import os

app = FastAPI(title="QuickCover API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_PATH = "./P7_Insurance_Premium.csv"
MODEL_DIR = "./models"
os.makedirs(MODEL_DIR, exist_ok=True)

# ─── Pydantic model ────────────────────────────────────────────────────────────
class PredictInput(BaseModel):
    age: float
    bmi: float
    smoker: str          # "Yes" / "No"
    region: str          # "North" / "South" / "East" / "West"
    no_of_dependents: int
    pre_existing_conditions: int


# ─── Helpers ──────────────────────────────────────────────────────────────────
def load_data():
    if not os.path.exists(CSV_PATH):
        raise HTTPException(status_code=404, detail=f"CSV not found at {CSV_PATH}")
    df = pd.read_csv(CSV_PATH)
    return df


def preprocess(df: pd.DataFrame):
    """Return X (scaled), y, feature_names, scaler."""
    df = df.copy()

    # Label-encode Smoker
    df["Smoker"] = df["Smoker"].map({"No": 0, "Yes": 1})

    # One-hot-encode Region (drop_first → drop North as baseline)
    df = pd.get_dummies(df, columns=["Region"], drop_first=True)

    feature_cols = [c for c in df.columns if c != "Annual_Premium_INR"]
    X = df[feature_cols].astype(float)
    y = df["Annual_Premium_INR"].astype(float)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y.values, feature_cols, scaler


def preprocess_single(data: PredictInput, feature_cols, scaler):
    """Encode + scale a single prediction input to match training feature order."""
    smoker_enc = 1 if data.smoker == "Yes" else 0

    # Region dummies (drop_first drops alphabetically first → "East")
    # After get_dummies on ["East","North","South","West"] drop_first drops "East"
    # So remaining dummies: Region_North, Region_South, Region_West
    region_north = 1 if data.region == "North" else 0
    region_south = 1 if data.region == "South" else 0
    region_west  = 1 if data.region == "West" else 0

    # Build a dict matching feature_cols order
    row = {
        "Age": data.age,
        "BMI": data.bmi,
        "Smoker": smoker_enc,
        "No_of_Dependents": data.no_of_dependents,
        "Pre_Existing_Conditions": data.pre_existing_conditions,
        "Region_North": region_north,
        "Region_South": region_south,
        "Region_West": region_west,
    }

    # Keep only features that exist in trained feature_cols, in order
    vec = [row.get(col, 0) for col in feature_cols]
    X = np.array(vec).reshape(1, -1)
    return scaler.transform(X)


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/api/eda")
def eda():
    df = load_data()

    numeric_cols = ["Age", "BMI", "No_of_Dependents", "Pre_Existing_Conditions", "Annual_Premium_INR"]

    # Feature distributions
    distributions = {}
    for col in numeric_cols:
        distributions[col] = {
            "mean":   round(float(df[col].mean()), 2),
            "median": round(float(df[col].median()), 2),
            "std":    round(float(df[col].std()), 2),
            "min":    round(float(df[col].min()), 2),
            "max":    round(float(df[col].max()), 2),
        }

    # Encode for correlation
    df_enc = df.copy()
    df_enc["Smoker"] = df_enc["Smoker"].map({"No": 0, "Yes": 1})
    df_enc = pd.get_dummies(df_enc, columns=["Region"], drop_first=True)
    corr_cols = [c for c in df_enc.columns if c != "Annual_Premium_INR"]
    correlations = {
        col: round(float(df_enc[col].corr(df_enc["Annual_Premium_INR"])), 4)
        for col in corr_cols
    }

    # Outliers (IQR)
    outliers = {}
    for col in numeric_cols:
        Q1, Q3 = df[col].quantile(0.25), df[col].quantile(0.75)
        IQR = Q3 - Q1
        count = int(((df[col] < Q1 - 1.5 * IQR) | (df[col] > Q3 + 1.5 * IQR)).sum())
        outliers[col] = count

    # Smoker vs Non-Smoker premiums
    smoker_avg     = round(float(df[df["Smoker"] == "Yes"]["Annual_Premium_INR"].mean()), 2)
    non_smoker_avg = round(float(df[df["Smoker"] == "No"]["Annual_Premium_INR"].mean()), 2)

    # Region-wise premiums
    region_avg = (
        df.groupby("Region")["Annual_Premium_INR"]
        .mean()
        .round(2)
        .to_dict()
    )
    region_avg = {k: float(v) for k, v in region_avg.items()}

    return {
        "total_records": len(df),
        "distributions": distributions,
        "correlations": correlations,
        "outliers": outliers,
        "smoker_avg_premium": smoker_avg,
        "non_smoker_avg_premium": non_smoker_avg,
        "avg_premium": round(float(df["Annual_Premium_INR"].mean()), 2),
        "region_avg_premium": region_avg,
    }


@app.get("/api/train")
def train():
    df = load_data()
    X, y, feature_cols, scaler = preprocess(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    models = {
        "Linear Regression": LinearRegression(),
        "Ridge Regression": Ridge(alpha=1.0, random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42),
    }

    results = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
        mae  = float(mean_absolute_error(y_test, preds))
        r2   = float(r2_score(y_test, preds))
        results[name] = {
            "rmse": round(rmse, 2),
            "mae":  round(mae, 2),
            "r2":   round(r2, 4),
        }
        safe_name = name.replace(" ", "_").lower()
        joblib.dump(model, f"{MODEL_DIR}/{safe_name}.pkl")

    # Save scaler + feature_cols
    joblib.dump(scaler,       f"{MODEL_DIR}/scaler.pkl")
    joblib.dump(feature_cols, f"{MODEL_DIR}/feature_cols.pkl")

    # Feature importances from Random Forest
    rf_model = models["Random Forest"]
    importances = rf_model.feature_importances_
    fi = sorted(
        zip(feature_cols, importances.tolist()),
        key=lambda x: x[1], reverse=True
    )[:6]
    feature_importances = [{"feature": f, "importance": round(v, 4)} for f, v in fi]

    return {
        "model_metrics": results,
        "feature_importances": feature_importances,
    }


@app.post("/api/predict")
def predict(data: PredictInput):
    # Load saved artifacts
    required = [
        f"{MODEL_DIR}/linear_regression.pkl",
        f"{MODEL_DIR}/ridge_regression.pkl",
        f"{MODEL_DIR}/random_forest.pkl",
        f"{MODEL_DIR}/scaler.pkl",
        f"{MODEL_DIR}/feature_cols.pkl",
    ]
    for path in required:
        if not os.path.exists(path):
            raise HTTPException(
                status_code=400,
                detail="Models not trained yet. Please call GET /api/train first.",
            )

    scaler       = joblib.load(f"{MODEL_DIR}/scaler.pkl")
    feature_cols = joblib.load(f"{MODEL_DIR}/feature_cols.pkl")
    lr_model     = joblib.load(f"{MODEL_DIR}/linear_regression.pkl")
    ridge_model  = joblib.load(f"{MODEL_DIR}/ridge_regression.pkl")
    rf_model     = joblib.load(f"{MODEL_DIR}/random_forest.pkl")

    X = preprocess_single(data, feature_cols, scaler)

    lr_pred    = round(float(lr_model.predict(X)[0]), 2)
    ridge_pred = round(float(ridge_model.predict(X)[0]), 2)
    rf_pred    = round(float(rf_model.predict(X)[0]), 2)
    ensemble   = round((lr_pred + ridge_pred + rf_pred) / 3, 2)

    return {
        "linear_regression": lr_pred,
        "ridge_regression":  ridge_pred,
        "random_forest":     rf_pred,
        "ensemble_average":  ensemble,
    }


@app.get("/api/sample-predictions")
def sample_predictions():
    profiles = [
        {
            "label": "Low Risk",
            "age": 28, "bmi": 22.1, "smoker": "No",
            "region": "South", "no_of_dependents": 0,
            "pre_existing_conditions": 0,
            "industry_benchmark_INR": 12000,
        },
        {
            "label": "Medium Risk",
            "age": 45, "bmi": 31.5, "smoker": "Yes",
            "region": "North", "no_of_dependents": 2,
            "pre_existing_conditions": 1,
            "industry_benchmark_INR": 45000,
        },
        {
            "label": "High Risk",
            "age": 60, "bmi": 38.2, "smoker": "Yes",
            "region": "West", "no_of_dependents": 3,
            "pre_existing_conditions": 3,
            "industry_benchmark_INR": 95000,
        },
    ]

    required = [
        f"{MODEL_DIR}/linear_regression.pkl",
        f"{MODEL_DIR}/ridge_regression.pkl",
        f"{MODEL_DIR}/random_forest.pkl",
        f"{MODEL_DIR}/scaler.pkl",
        f"{MODEL_DIR}/feature_cols.pkl",
    ]
    for path in required:
        if not os.path.exists(path):
            raise HTTPException(
                status_code=400,
                detail="Models not trained yet. Please call GET /api/train first.",
            )

    scaler       = joblib.load(f"{MODEL_DIR}/scaler.pkl")
    feature_cols = joblib.load(f"{MODEL_DIR}/feature_cols.pkl")
    lr_model     = joblib.load(f"{MODEL_DIR}/linear_regression.pkl")
    ridge_model  = joblib.load(f"{MODEL_DIR}/ridge_regression.pkl")
    rf_model     = joblib.load(f"{MODEL_DIR}/random_forest.pkl")

    results = []
    for p in profiles:
        inp = PredictInput(
            age=p["age"], bmi=p["bmi"], smoker=p["smoker"],
            region=p["region"], no_of_dependents=p["no_of_dependents"],
            pre_existing_conditions=p["pre_existing_conditions"],
        )
        X = preprocess_single(inp, feature_cols, scaler)

        lr_pred    = round(float(lr_model.predict(X)[0]), 2)
        ridge_pred = round(float(ridge_model.predict(X)[0]), 2)
        rf_pred    = round(float(rf_model.predict(X)[0]), 2)
        ensemble   = round((lr_pred + ridge_pred + rf_pred) / 3, 2)

        benchmark = p["industry_benchmark_INR"]
        pct_diff  = round(((ensemble - benchmark) / benchmark) * 100, 1)

        results.append({
            "label":                 p["label"],
            "inputs":                {k: v for k, v in p.items() if k not in ("label", "industry_benchmark_INR")},
            "linear_regression":     lr_pred,
            "ridge_regression":      ridge_pred,
            "random_forest":         rf_pred,
            "ensemble_average":      ensemble,
            "industry_benchmark_INR": benchmark,
            "pct_diff_from_benchmark": pct_diff,
        })

    return {"profiles": results}
