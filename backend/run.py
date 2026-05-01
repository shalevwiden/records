# #region agent log
import json
import os
import time

try:
    _dbg_p = "/Users/shalevwiden/Downloads/Projects/cursor/records/.cursor/debug-b293ff.log"
    _dbg_payload = {
        "sessionId": "b293ff",
        "hypothesisId": "E",
        "location": "backend/run.py:module",
        "message": "backend.run module loaded",
        "data": {"cwd": os.getcwd(), "runfile": __file__},
        "timestamp": int(time.time() * 1000),
    }
    with open(_dbg_p, "a", encoding="utf-8") as _df:
        _df.write(json.dumps(_dbg_payload) + "\n")
except Exception:
    pass
# #endregion

from .app import app
from dotenv import load_dotenv


load_dotenv()


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)

