import joblib
import pandas as pd
from pathlib import Path
from functools import lru_cache
from app.core.config import settings


@lru_cache(maxsize=1)
def load_artifacts() -> dict:
    """Load and cache model artifacts once at startup."""
    base = Path(settings.MODELS_DIR)

    missing = [f for f in ["rf_model.pkl", "scaler.pkl", "label_encoders.pkl"]
               if not (base / f).exists()]
    if missing:
        raise FileNotFoundError(
            f"Missing model files in '{base}': {missing}. "
            "Run your training notebooks first."
        )

    return {
        "model":          joblib.load(base / "rf_model.pkl"),
        "scaler":         joblib.load(base / "scaler.pkl"),
        "label_encoders": joblib.load(base / "label_encoders.pkl"),
    }


def run_inference(data: dict) -> dict:
    """
    Full inference pipeline (mirrors training pipeline exactly):
      1. Build DataFrame
      2. Feature engineering
      3. Categorical encoding
      4. Numerical scaling
      5. Predict
    Returns a dict with raw label, computed features, and confidence.
    """
    artifacts = load_artifacts()
    model     = artifacts["model"]
    scaler    = artifacts["scaler"]
    le_dict   = artifacts["label_encoders"]

    df = pd.DataFrame([data])

    # --- Feature Engineering ---
    df["Dependents"]   = df["Dependents"].astype(str).replace("3+", "3").astype(int)
    df["Total_Income"] = df["ApplicantIncome"] + df["CoapplicantIncome"]
    df["EMI"]          = (df["LoanAmount"] * 1000) / df["Loan_Amount_Term"]

    computed = {
        "total_income": round(df["Total_Income"].iloc[0], 2),
        "emi":          round(df["EMI"].iloc[0], 2),
        "dependents":   int(df["Dependents"].iloc[0]),
    }

    # --- Categorical Encoding ---
    for col in ["Gender", "Married", "Education", "Self_Employed", "Property_Area"]:
        df[col] = le_dict[col].transform(df[col])

    # --- Scaling ---
    num_cols = ["ApplicantIncome", "CoapplicantIncome", "LoanAmount",
                "Loan_Amount_Term", "Total_Income", "EMI"]
    df[num_cols] = scaler.transform(df[num_cols])

    # --- Prediction ---
    raw_pred   = model.predict(df)
    proba      = model.predict_proba(df)[0]
    label      = le_dict["Loan_Status"].inverse_transform(raw_pred)[0]
    confidence = round(float(max(proba)) * 100, 2)

    return {
        "label":      label,
        "confidence": confidence,
        "computed":   computed,
    }