from fastapi import APIRouter, HTTPException
from ..models.schemas import MessageAnalyzeRequest, MessageAnalyzeResponse
from ..services.ai_service import run_hybrid_message_analysis

router = APIRouter(prefix="/api/analyze", tags=["Message Analyzer"])

@router.post("/message", response_model=MessageAnalyzeResponse)
def analyze_message(payload: MessageAnalyzeRequest):
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    if len(payload.text) > 10000:
        raise HTTPException(status_code=400, detail="Input text exceeds maximum allowed size of 10,000 characters.")

    result = run_hybrid_message_analysis(payload.text, payload.language)
    return result
