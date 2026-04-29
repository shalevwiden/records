import os
from datetime import timedelta
from pathlib import Path

_BACKEND_DIR = Path(__file__).resolve().parent


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

    # Uploaded images (covers, avatars) — served from /uploads/<filename>
    UPLOAD_FOLDER = str(_BACKEND_DIR / "instance" / "uploads")
    MAX_CONTENT_LENGTH = int(os.getenv("RECORDS_MAX_UPLOAD_MB", "5")) * 1024 * 1024

