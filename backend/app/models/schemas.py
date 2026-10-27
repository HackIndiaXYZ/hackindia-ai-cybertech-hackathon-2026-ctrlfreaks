from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# --- Message Analyzer Schemas ---

class MessageAnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Content of the message to analyze")
    language: str = Field("en", description="Preferred output language: 'en' or 'hi'")
    message_type: Optional[str] = Field("auto", description="Source format: sms, whatsapp, email, transcript, or auto")

class PsychologicalTactic(BaseModel):
    tactic_id: str
    name: str
    detected_phrase: str
    explanation: str
    why_effective: str
    counter_action: str

class Indicator(BaseModel):
    category: str
    phrase: str
    explanation: str
    severity: str  # high, medium, low
    points: int

class MessageAnalyzeResponse(BaseModel):
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    risk_score: int  # 0 to 100
    confidence: str  # HIGH, MODERATE, PROVISIONAL
    detected_indicators: List[Indicator]
    psychological_tactics: List[PsychologicalTactic]
    detected_phrases: List[str]
    recommended_actions: List[str]
    explanation: str
    scoring_breakdown: Dict[str, Any]
    contains_url: bool
    extracted_urls: List[str]
    analysis_method: str
    limitations: str
    pause_intervention: bool
    pause_message: Optional[str] = None
    language: str

# --- SafeLink URL Schemas ---

class URLAnalyzeRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=2000, description="URL to check")
    language: str = Field("en", description="Output language: 'en' or 'hi'")

class URLCheckFlag(BaseModel):
    check_name: str
    status: str  # PASS, WARN, FAIL
    details: str

class URLAnalyzeResponse(BaseModel):
    url: str
    normalized_url: str
    domain: str
    risk_level: str  # LOW OBSERVED RISK, UNCERTAIN, HIGH RISK
    risk_score: int  # 0 to 100
    destination_domain: str
    is_https: bool
    is_ip_host: bool
    is_shortened: bool
    is_lookalike: bool
    checks: List[URLCheckFlag]
    warning_signs: List[str]
    safe_preview: Dict[str, Any]
    recommendations: List[str]
    limitations: str
    threat_intel_source: str

# --- Scam DNA Fingerprint Schemas ---

class ScamDNARequest(BaseModel):
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: str = "MEDIUM"
    tactics: List[str] = []
    indicators: List[str] = []
    text_preview: Optional[str] = None
    language: str = "en"

class ScamDNAResponse(BaseModel):
    dna_id: str
    title: str
    risk_category: str
    vector: Dict[str, int]  # radar chart dimensions
    detected_tactics: List[str]
    summary: str
    three_recommendations: List[str]
    sanitized_export_text: str
    privacy_notice: str

# --- HoneyShield Simulator Schemas ---

class HoneyShieldOption(BaseModel):
    id: str
    label: str
    description: str

class HoneyShieldScenario(BaseModel):
    id: str
    title: str
    category: str
    sender: str
    message: str
    options: List[HoneyShieldOption]
    manipulation_tactics: List[str]
    safe_alternative: str
    educational_summary: str

class HoneyShieldEvaluateRequest(BaseModel):
    scenario_id: str
    selected_option_id: str
    language: str = "en"

class HoneyShieldEvaluateResponse(BaseModel):
    scenario_id: str
    selected_option_id: str
    is_safe: bool
    outcome_type: str  # SAFE, VULNERABLE, DANGEROUS
    feedback_title: str
    feedback: str
    why_risky_or_safe: str
    tactics_exposed: List[str]
    safer_response: str
    score_impact: int

# --- Trusted Contacts & SOS Schemas ---

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    relationship: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=30)
    email: Optional[str] = Field(None, max_length=100)

class ContactResponse(BaseModel):
    id: int
    name: str
    relationship: str
    phone: Optional[str] = None
    email: Optional[str] = None
    created_at: Optional[str] = None

class SOSPreviewRequest(BaseModel):
    contact_ids: Optional[List[int]] = None
    custom_note: Optional[str] = None
    language: str = "en"

class SOSPreviewResponse(BaseModel):
    preview_message: str
    recipient_count: int
    recipients: List[Dict[str, Any]]
    provider_mode: str  # "DEMO_SIMULATION", "LIVE_EMAIL", "TWILIO_CONFIGURED", etc.
    privacy_guarantee: str

class SOSTriggerRequest(BaseModel):
    confirmed: bool = Field(..., description="Explicit user confirmation required")
    contact_ids: Optional[List[int]] = None
    custom_note: Optional[str] = None
    language: str = "en"

class SOSTriggerResponse(BaseModel):
    success: bool
    status: str
    mode: str  # "DEMO" or "LIVE"
    message_delivered: str
    timestamp: str
    notice: str
    channels_dispatched: Optional[Dict[str, Any]] = None
    action_links: Optional[List[Dict[str, Any]]] = None

class SMTPConfigRequest(BaseModel):
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str
    smtp_password: str
    smtp_from_email: Optional[str] = None
    send_test_email: bool = False

class SMTPConfigResponse(BaseModel):
    success: bool
    message: str
