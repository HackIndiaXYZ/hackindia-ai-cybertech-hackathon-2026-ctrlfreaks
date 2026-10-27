from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from pathlib import Path

from ..config import settings
from ..database import set_setting, get_setting
from ..services.ai_service import run_ai_chat_response, call_ai_completion

router = APIRouter(prefix="/api/ai", tags=["AI Copilot & Configuration"])

class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: Optional[List[Dict[str, str]]] = None
    language: str = "en"

class AIChatResponse(BaseModel):
    reply: str
    provider: str

class AIConfigRequest(BaseModel):
    provider: str = Field(..., description="'groq' or 'gemini'")
    api_key: str = Field(..., min_length=5)

class AIConfigResponse(BaseModel):
    success: bool
    message: str
    active_provider: str

@router.post("/chat", response_model=AIChatResponse)
def chat_with_ai(payload: AIChatRequest):
    reply = run_ai_chat_response(
        query=payload.message,
        history=payload.history,
        language=payload.language
    )
    return AIChatResponse(
        reply=reply,
        provider=settings.active_ai_provider
    )

@router.get("/config")
def get_ai_config_status():
    return {
        "configured": settings.has_ai_credentials,
        "active_provider": settings.active_ai_provider,
        "groq_configured": bool(settings.groq_api_key or get_setting("GROQ_API_KEY", "")),
        "gemini_configured": bool(settings.gemini_api_key or get_setting("GEMINI_API_KEY", "")),
        "openai_configured": bool(settings.openai_api_key or get_setting("OPENAI_API_KEY", ""))
    }

@router.post("/config", response_model=AIConfigResponse)
def save_ai_config(payload: AIConfigRequest):
    prov = payload.provider.lower().strip()
    key = payload.api_key.strip()

    if prov == "groq":
        settings.groq_api_key = key
        set_setting("GROQ_API_KEY", key)
        # Test Groq call
        test_messages = [{"role": "user", "content": "Hello, respond with 'OK'."}]
        ai_res = call_ai_completion(test_messages)
        if not ai_res:
            # Revert if failed
            settings.groq_api_key = ""
            set_setting("GROQ_API_KEY", "")
            raise HTTPException(status_code=400, detail="Failed to verify Groq API Key. Please check the key and try again.")
        active = "Groq (Llama-3.3 70B)"

    elif prov == "gemini":
        settings.gemini_api_key = key
        set_setting("GEMINI_API_KEY", key)
        # Test Gemini call
        test_messages = [{"role": "user", "content": "Hello, respond with 'OK'."}]
        ai_res = call_ai_completion(test_messages)
        if not ai_res:
            settings.gemini_api_key = ""
            set_setting("GEMINI_API_KEY", "")
            raise HTTPException(status_code=400, detail="Failed to verify Google Gemini API Key. Please check the key and try again.")
        active = "Google Gemini (1.5 Flash)"

    else:
        raise HTTPException(status_code=400, detail="Supported providers are 'groq' and 'gemini'.")

    # Persist to .env file as well
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    try:
        lines = []
        if env_path.exists():
            with open(env_path, "r", encoding="utf-8") as f:
                lines = [l for l in f if not l.startswith(f"{prov.upper()}_API_KEY=")]
        lines.append(f"{prov.upper()}_API_KEY={key}\n")
        with open(env_path, "w", encoding="utf-8") as f:
            f.writelines(lines)
    except Exception:
        pass

    return AIConfigResponse(
        success=True,
        message=f"Successfully connected to {active}!",
        active_provider=active
    )
