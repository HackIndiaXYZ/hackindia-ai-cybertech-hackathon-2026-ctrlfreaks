import pytest
from app.services.scam_dna import generate_scam_dna, sanitize_text

def test_pii_sanitization():
    raw = "Contact Rahul at +91 9876543210 or email test@phishing.com with OTP 849201 at https://malicious.link/steal"
    sanitized = sanitize_text(raw)
    assert "+91 9876543210" not in sanitized
    assert "test@phishing.com" not in sanitized
    assert "849201" not in sanitized
    assert "https://malicious.link/steal" not in sanitized
    assert "[PHONE REDACTED]" in sanitized
    assert "[EMAIL REDACTED]" in sanitized
    assert "[URL REMOVED]" in sanitized

def test_dna_generation_vector():
    dna = generate_scam_dna(
        risk_score=85,
        risk_level="HIGH",
        tactics=["Urgency & Time Pressure", "Fear & Coercion"],
        indicators=["Urgent request", "Threat of block"],
        text_preview="Your account will be blocked in 10 minutes",
        language="en"
    )
    assert dna.dna_id.startswith("DNA-")
    assert dna.risk_category == "HIGH"
    assert dna.vector["urgency"] > 50
    assert dna.vector["fear"] > 50
    assert len(dna.three_recommendations) == 3
    assert "[PHONE REDACTED]" not in dna.sanitized_export_text or "DNA-" in dna.sanitized_export_text
