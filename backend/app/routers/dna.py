from fastapi import APIRouter
from ..models.schemas import ScamDNARequest, ScamDNAResponse
from ..services.scam_dna import generate_scam_dna

router = APIRouter(prefix="/api/dna", tags=["Scam DNA Fingerprint"])

@router.post("/generate", response_model=ScamDNAResponse)
def create_dna_fingerprint(payload: ScamDNARequest):
    result = generate_scam_dna(
        risk_score=payload.risk_score,
        risk_level=payload.risk_level,
        tactics=payload.tactics,
        indicators=payload.indicators,
        text_preview=payload.text_preview,
        language=payload.language
    )
    return result
