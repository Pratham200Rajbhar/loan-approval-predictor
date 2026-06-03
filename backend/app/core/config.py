from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Loan Prediction API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str] = ["*"]
    MODELS_DIR: str = "models"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()