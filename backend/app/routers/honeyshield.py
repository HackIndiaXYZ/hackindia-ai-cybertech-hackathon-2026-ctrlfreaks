from typing import List, Optional
from fastapi import APIRouter, Query
from ..models.schemas import HoneyShieldScenario, HoneyShieldEvaluateRequest, HoneyShieldEvaluateResponse
from ..services.honeyshield import get_scenarios, evaluate_scenario_choice

router = APIRouter(prefix="/api/scenarios", tags=["HoneyShield Simulator"])

@router.get("", response_model=List[HoneyShieldScenario])
def list_scenarios(lang: Optional[str] = Query("en", description="Language: 'en' or 'hi'")):
    return get_scenarios(language=lang)

@router.post("/evaluate", response_model=HoneyShieldEvaluateResponse)
def evaluate_choice(payload: HoneyShieldEvaluateRequest):
    return evaluate_scenario_choice(
        scenario_id=payload.scenario_id,
        option_id=payload.selected_option_id,
        language=payload.language
    )
