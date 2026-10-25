from fastapi import APIRouter, HTTPException
from ..models.schemas import URLAnalyzeRequest, URLAnalyzeResponse
from ..services.url_analyzer import analyze_url_target

router = APIRouter(prefix="/api/analyze", tags=["SafeLink URL Analyzer"])

@router.post("/url", response_model=URLAnalyzeResponse)
def analyze_url(payload: URLAnalyzeRequest):
    if not payload.url or not payload.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")

    if len(payload.url) > 2000:
        raise HTTPException(status_code=400, detail="URL exceeds maximum supported length of 2,000 characters.")

    result = analyze_url_target(payload.url, payload.language)
    return result
