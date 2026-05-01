#!/usr/bin/env python3
"""One-shot debug logger for backend startup path issues (session b293ff)."""
# #region agent log
import json
import os
import time
from pathlib import Path

_SESSION = "b293ff"
_REPO = Path(__file__).resolve().parents[1]
_LOG = _REPO / ".cursor" / "debug-b293ff.log"


def _append(payload: dict) -> None:
    _LOG.parent.mkdir(parents=True, exist_ok=True)
    with open(_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(payload) + "\n")


if __name__ == "__main__":
    cwd = Path.cwd()
    req_from_cwd = cwd / "backend" / "requirements.txt"
    req_at_repo = _REPO / "backend" / "requirements.txt"
    _append(
        {
            "sessionId": _SESSION,
            "hypothesisId": "A",
            "location": "scripts/debug_log_cwd.py",
            "message": "cwd vs requirements paths",
            "data": {
                "cwd": str(cwd),
                "repo_root_from_script": str(_REPO),
                "requirements_exists_relative_to_cwd": req_from_cwd.is_file(),
                "requirements_exists_at_repo_root": req_at_repo.is_file(),
            },
            "timestamp": int(time.time() * 1000),
        }
    )
    _append(
        {
            "sessionId": _SESSION,
            "hypothesisId": "B",
            "location": "scripts/debug_log_cwd.py",
            "message": "venv parent if user runs venv command from cwd",
            "data": {
                "would_create_venv_at": str(cwd / "backend" / ".venv"),
            },
            "timestamp": int(time.time() * 1000),
        }
    )
# #endregion
