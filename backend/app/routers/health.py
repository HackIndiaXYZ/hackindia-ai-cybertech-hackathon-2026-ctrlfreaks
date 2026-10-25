from fastapi import APIRouter
from ..config import settings

router = APIRouter(prefix="/api", tags=["Health & Status"])

@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "integrations": {
            "ai_provider": {
                "configured": settings.has_ai_credentials,
                "name": settings.ai_provider if settings.has_ai_credentials else "Local Deterministic Heuristics Fallback"
            },
            "safe_browsing": {
                "configured": settings.has_safe_browsing,
                "name": "Google Safe Browsing" if settings.has_safe_browsing else "Local URL Heuristics Fallback"
            },
            "sms_provider": {
                "configured": settings.has_real_sms,
                "name": "Twilio SMS" if settings.has_real_sms else "Safe Simulation Demo Mode"
            }
        }
    }
