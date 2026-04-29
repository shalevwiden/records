from flask import Flask, jsonify
from sqlalchemy.exc import OperationalError

from .config import Config
from .extensions import init_extensions
from .routes import api_bp
from . import models  # noqa: F401


def create_app() -> Flask:
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)

    init_extensions(app)
    app.register_blueprint(api_bp, url_prefix="/api")

    @app.errorhandler(OperationalError)
    def _db_unavailable(_err):
        return jsonify({"error": "database unavailable; ensure Postgres is running and DATABASE_URL is correct"}), 503

    if app.config.get("AUTO_CREATE_DB"):
        # Dev-only: allow a first run without migrations.
        with app.app_context():
            from .extensions import db as _db

            _db.create_all()

    @app.get("/healthz")
    def healthz():
        return {"ok": True}

    return app


app = create_app()

