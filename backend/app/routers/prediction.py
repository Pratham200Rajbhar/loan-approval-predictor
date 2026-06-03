from fastapi import APIRouter, HTTPException
from app.schemas.loan import LoanApplicationRequest, LoanPredictionResponse
from app.services.model import run_inference

router = APIRouter()


@router.post(
    "/predict",
    response_model=LoanPredictionResponse,
    summary="Predict loan approval",
    description="Submit a loan application and receive an approval prediction with confidence score.",
)
def predict_loan(application: LoanApplicationRequest):
    try:
        result = run_inference(application.model_dump())
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(exc)}")

    label      = result["label"]
    confidence = result["confidence"]
    computed   = result["computed"]

    if label == "Y":
        return LoanPredictionResponse(
            success=True,
            status="Approved",
            message=f"Congratulations! Your loan application is likely to be approved.",
            details={
                "confidence_pct":   confidence,
                "total_income":     computed["total_income"],
                "monthly_emi":      computed["emi"],
                "dependents":       computed["dependents"],
            },
        )

    return LoanPredictionResponse(
        success=True,
        status="Rejected",
        message="Unfortunately, your loan application is likely to be rejected. "
                "Please consider improving your financial profile and reapplying.",
        details={
            "confidence_pct":   confidence,
            "total_income":     computed["total_income"],
            "monthly_emi":      computed["emi"],
            "dependents":       computed["dependents"],
        },
    )