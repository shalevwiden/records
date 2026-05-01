# syntax=docker/dockerfile:1
# Production image for Render Web Service (or any container host).
# Set DATABASE_URL to your PostgreSQL connection string.
# Set CORS_ORIGINS to your static site origin(s), comma-separated.

FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    RECORDS_AUTO_CREATE_DB=false

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./backend

ENV PYTHONPATH=/app

RUN useradd --create-home --system --uid 10001 appuser \
    && mkdir -p /app/backend/instance/uploads \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 5000

# Render injects PORT; default 5000 for local runs.
CMD ["sh", "-c", "exec gunicorn --bind 0.0.0.0:${PORT:-5000} backend.app:app"]


