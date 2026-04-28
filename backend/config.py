import os
from datetime import timedelta


class Config:
    # Flask
    SECRET_KEY = os.getenv("RECORDS_SECRET_KEY", "dev-secret-change-me")

    # JWT
    JWT_SECRET_KEY = os.getenv("RECORDS_JWT_SECRET_KEY", os.getenv("RECORDS_SECRET_KEY", "dev-secret-change-me"))
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # Database
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        # Default for local docker-compose
        "postgresql+psycopg://records:records@localhost:5432/records",
    )

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if origin.strip()
    ]

    # Dev-only convenience
    AUTO_CREATE_DB = os.getenv("RECORDS_AUTO_CREATE_DB", "true").lower() in ("1", "true", "yes")

