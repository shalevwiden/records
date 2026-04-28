from dotenv import load_dotenv

load_dotenv()

from .app import app

__all__ = ["app"]

