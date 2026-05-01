# 1) DB (if Docker installed)

docker compose up -d

# 2) Backend

# Run these from the **repository root** (the directory that contains both `backend/` and `frontend/`).

# If your terminal is inside `frontend/` (for example after `cd frontend`), run `cd ..` first.

python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env 2>/dev/null || true
python -m backend.run

# 3) Frontend (new terminal)

cd frontend
npm install
npm run dev

# refresh port

npx kill-port 5173

### To see the database

_This means open a postgre shell_
docker compose exec db psql -U records -d records

The run commands like \dt to list all tables
Hit q when it shows output

### Docker down note:

docker compose down -v
this wipes data
docker compose down
this keeps it

### May 1

Docer-compose.yml not required for local dev.
