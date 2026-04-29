# 1) DB (if Docker installed)

docker compose up -d

# 2) Backend

python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env 2>/dev/null || true
python -m backend.run

# 3) Frontend (new terminal)

cd frontend
npm install
npm run dev

### To see the database

_This means open a postgre shell_
docker compose exec db psql -U records -d records

The run commands like \dt to list all tables
Hit q when it shows output
