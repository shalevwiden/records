# Records

Records is a React + Flask + PostgreSQL app for logging the albums you’ve listened to, writing reviews, favoriting favorites, and following friends.

## Prerequisites

- Docker (for PostgreSQL)
- Node.js (for the React frontend)
- Python 3.11+ (for the Flask backend)

## Start Postgres

```bash
docker compose up -d
```

## Backend (Flask)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env by copying .env.example and adjusting values if needed
cp .env.example .env 2>/dev/null || true

python run.py
```

Backend runs on `http://localhost:5000`.

## Frontend (React)

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API

- Base path: `http://localhost:5000/api`

