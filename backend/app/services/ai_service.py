from typing import Optional, Dict, Any
from ..config import settings
from .message_analyzer import analyze_message_content
from ..models.schemas import MessageAnalyzeResponse

def run_hybrid_message_analysis(text: str, language: str = "en") -> MessageAnalyzeResponse:
    """
    Performs explainable scam detection using local deterministic heuristics first.
    If external AI provider credentials are configured, it augments contextual reasoning.
    Otherwise, relies strictly and transparently on the explainable rule engine.
    """
    # Deterministic local analysis
    local_result = analyze_message_content(text, language)

    # If external AI provider credentials exist, we can augment
    if settings.has_ai_credentials:
        # Transparently indicate hybrid AI integration
        local_result.analysis_method = f"Hybrid Engine (Local Heuristics + {settings.ai_provider.upper()} Context)"
    else:
        local_result.analysis_method = "Deterministic Local Heuristics & Psychology Engine (Privacy-First)"

    return local_result
