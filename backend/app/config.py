"""Application configuration."""
from pathlib import Path

# Database
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_PATH = str(BASE_DIR / "data" / "processed" / "cannalchemy.db")

# CORS
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

# API
API_V1_PREFIX = "/api/v1"
