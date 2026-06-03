from pydantic import BaseModel, Field, field_validator
from typing import Literal


class LoanApplicationRequest(BaseModel):
    Gender: Literal["Male", "Female"] = Field(..., example="Male")
    Married: Literal["Yes", "No"] = Field(..., example="Yes")
    Dependents: Literal["0", "1", "2", "3+"] = Field(..., example="0")
    Education: Literal["Graduate", "Not Graduate"] = Field(..., example="Graduate")
    Self_Employed: Literal["Yes", "No"] = Field(..., example="No")
    ApplicantIncome: float = Field(..., gt=0, example=5000, description="Monthly applicant income")
    CoapplicantIncome: float = Field(..., ge=0, example=1500, description="Monthly co-applicant income")
    LoanAmount: float = Field(..., gt=0, example=120, description="Loan amount in thousands")
    Loan_Amount_Term: float = Field(..., gt=0, example=360, description="Loan term in months")
    Credit_History: Literal[0.0, 1.0] = Field(..., example=1.0, description="1 = good, 0 = bad")
    Property_Area: Literal["Urban", "Semiurban", "Rural"] = Field(..., example="Urban")

    @field_validator("ApplicantIncome", "CoapplicantIncome", "LoanAmount", "Loan_Amount_Term")
    @classmethod
    def must_be_positive(cls, v):
        if v < 0:
            raise ValueError("Value must be non-negative")
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "Gender": "Female",
                "Married": "Yes",
                "Dependents": "0",
                "Education": "Graduate",
                "Self_Employed": "No",
                "ApplicantIncome": 8500,
                "CoapplicantIncome": 3000,
                "LoanAmount": 120,
                "Loan_Amount_Term": 360,
                "Credit_History": 1.0,
                "Property_Area": "Urban",
            }
        }
    }


class LoanPredictionResponse(BaseModel):
    success: bool
    status: Literal["Approved", "Rejected"]
    message: str
    details: dict


class ErrorResponse(BaseModel):
    success: bool = False
    detail: str
    error: str = ""