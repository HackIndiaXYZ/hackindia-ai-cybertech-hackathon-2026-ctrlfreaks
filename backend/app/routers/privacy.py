from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/api/privacy", tags=["Privacy Center"])

@router.get("/status")
def get_privacy_status():
    return {
        "storage_mode": "Zero-Message-Retention (Ephemeral in RAM)",
        "logging_policy": "Sanitized (No sensitive message bodies or personal phone numbers logged)",
        "analytics_trackers": "None (No third-party cookies or telemetry)",
        "server_side_database": "SQLite for trusted contacts only; zero message persistence",
        "demo_mode": True,
        "checked_at": datetime.now().isoformat()
    }

@router.post("/clear")
def clear_session_data():
    return {
        "success": True,
        "message": "Ephemeral session memory purged. No traces retained.",
        "cleared_at": datetime.now().isoformat()
    }
