import pytest
from app.services.message_analyzer import analyze_message_content

def test_urgency_detection():
    msg = "Action required immediately! Your account will expire within 10 minutes."
    res = analyze_message_content(msg, language="en")
    assert res.risk_score >= 18
    tactic_ids = [t.tactic_id for t in res.psychological_tactics]
    assert "tactic_urgency" in tactic_ids

def test_fear_and_coercion():
    msg = "Your electricity will be disconnected tonight. Police legal action will be taken."
    res = analyze_message_content(msg, language="en")
    assert res.risk_level in ["HIGH", "CRITICAL"]
    tactic_ids = [t.tactic_id for t in res.psychological_tactics]
    assert "tactic_fear" in tactic_ids

def test_credential_theft_critical():
    msg = "Share your OTP and enter UPI PIN to receive the payment immediately."
    res = analyze_message_content(msg, language="en")
    assert res.risk_score >= 50
    assert res.pause_intervention is True
    tactic_ids = [t.tactic_id for t in res.psychological_tactics]
    assert "tactic_credentials" in tactic_ids

def test_technical_deception_apk():
    msg = "Download and install support.apk to claim your refund."
    res = analyze_message_content(msg, language="en")
    assert res.risk_score >= 25
    tactic_ids = [t.tactic_id for t in res.psychological_tactics]
    assert "tactic_tech" in tactic_ids

def test_hindi_detection():
    msg = "आपका बैंक खाता तुरंत ब्लॉक कर दिया जाएगा। 10 मिनट में अपना ओटीपी बताएं।"
    res = analyze_message_content(msg, language="hi")
    assert res.risk_score >= 40
    assert res.language == "hi"
    assert "ब्लॉक" in res.explanation or "जोखिम" in res.explanation or "ओटीपी" in str(res.detected_phrases)

def test_benign_message_false_positive_prevention():
    msg = "Good morning! Just a reminder that our group project meeting is tomorrow at 4 PM in the library. See you there."
    res = analyze_message_content(msg, language="en")
    assert res.risk_level == "LOW"
    assert res.risk_score <= 20
    assert res.pause_intervention is False

def test_score_never_exceeds_100():
    heavily_loaded = (
        "URGENT: Delhi Police and CBI officer speaking. Your SBI bank account is blocked. "
        "Do not tell anyone, keep confidential! Download anydesk.apk immediately, "
        "share OTP and enter UPI PIN to claim 25 Lakh lottery prize: http://fake-sbi.xyz/scam"
    )
    res = analyze_message_content(heavily_loaded, language="en")
    assert res.risk_score <= 100
    assert res.risk_level == "CRITICAL"
    assert res.pause_intervention is True
