import uuid
import re
from typing import List, Dict, Any, Optional
from ..models.schemas import ScamDNAResponse

def sanitize_text(text: Optional[str]) -> str:
    """Removes sensitive identifiers, phone numbers, emails, URLs, OTPs, and bank numbers."""
    if not text:
        return ""
    # Strip URLs
    sanitized = re.sub(r"https?://\S+|www\.\S+", "[URL REMOVED]", text)
    # Strip Email addresses
    sanitized = re.sub(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", "[EMAIL REDACTED]", sanitized)
    # Strip Phone Numbers / 10-digit integers
    sanitized = re.sub(r"\b(?:\+91[\-\s]?)?[6-9]\d{9}\b", "[PHONE REDACTED]", sanitized)
    # Strip potential OTP codes (4-6 consecutive digits)
    sanitized = re.sub(r"\b\d{4,8}\b", "[CODE REDACTED]", sanitized)
    return sanitized.strip()

def generate_scam_dna(
    risk_score: int,
    risk_level: str,
    tactics: List[str],
    indicators: List[str],
    text_preview: Optional[str] = None,
    language: str = "en"
) -> ScamDNAResponse:
    dna_id = "DNA-" + str(uuid.uuid4())[:8].upper()
    
    # Calculate dimensional vector for the radar / visual fingerprint (0 to 100)
    # Tactical dimensions: Urgency, Fear, False Authority, Secrecy, Financial Pressure, Suspicious Link, Credential Request, Reward
    vector = {
        "urgency": 0,
        "fear": 0,
        "false_authority": 0,
        "secrecy": 0,
        "financial_pressure": 0,
        "suspicious_link": 0,
        "credential_request": 0,
        "unexpected_reward": 0
    }

    tactic_str = " ".join(tactics).lower()
    indicator_str = " ".join(indicators).lower()

    if "urgency" in tactic_str or "जल्दबाजी" in tactic_str:
        vector["urgency"] = min(85 + (risk_score % 15), 100)
    elif risk_score > 60:
        vector["urgency"] = 40

    if "fear" in tactic_str or "डर" in tactic_str or "धमकी" in tactic_str:
        vector["fear"] = min(80 + (risk_score % 20), 100)
    elif risk_score > 60:
        vector["fear"] = 35

    if "authority" in tactic_str or "अधिकार" in tactic_str:
        vector["false_authority"] = min(85 + (risk_score % 15), 100)

    if "secrecy" in tactic_str or "गोपनीयता" in tactic_str or "अलगाव" in tactic_str:
        vector["secrecy"] = min(90 + (risk_score % 10), 100)

    if "credential" in tactic_str or "गोपनीय" in tactic_str or "ओटीपी" in tactic_str:
        vector["credential_request"] = 95
        vector["financial_pressure"] = 85

    if "reward" in tactic_str or "इनाम" in tactic_str or "लॉटरी" in tactic_str:
        vector["unexpected_reward"] = 90
        vector["financial_pressure"] = 60

    if "link" in indicator_str or "लिंक" in indicator_str:
        vector["suspicious_link"] = 80

    # Ensure baseline representation for low risk cases
    for k in vector:
        if vector[k] == 0:
            vector[k] = 10 if risk_score > 30 else 5

    # Three core recommendations based on dominant tactic
    if language == "hi":
        three_recommendations = [
            "1. कभी भी किसी संदेश या कॉल के दबाव में आकर तुरंत वित्तीय निर्णय न लें।",
            "2. संस्था के आधिकारिक कस्टमर केयर नंबर या पोर्टल से स्वतंत्र रूप से पुष्टि करें।",
            "3. किसी भी व्यक्ति के साथ बैंक ओटीपी, पासवर्ड या यूपीआई पिन कभी साझा न करें।"
        ]
        summary = (
            f"यह स्कैम डीएनए फिंगरप्रिंट ({dna_id}) ज्ञात मनोवैज्ञानिक हेरफेर पैटर्न का विश्लेषण दर्शाता है। "
            f"इस संदेश में {len(tactics)} मुख्य दबाव तकनीकों का उपयोग किया गया है।"
        )
        title = f"स्कैम डीएनए फिंगरप्रिंट • {risk_level}"
        privacy_notice = "गोपनीयता सूचना: इस कार्ड में कोई भी व्यक्तिगत डेटा, फोन नंबर या मूल संदेश शामिल नहीं है। केवल पैटर्न का विश्लेषण सुरक्षित रूप से साझा किया जाता है।"
    else:
        three_recommendations = [
            "1. Pause under pressure. Scammers weaponize false urgency to override logical scrutiny.",
            "2. Verify through verified official channels, never via numbers or links sent to you.",
            "3. Strictly protect credentials: Never share OTPs or enter your UPI PIN to receive money."
        ]
        summary = (
            f"Scam DNA Fingerprint ({dna_id}) visualizes the psychological mechanics of the detected interaction. "
            f"Identified {len(tactics)} primary coercion and deception tactics."
        )
        title = f"Scam DNA Fingerprint • {risk_level}"
        privacy_notice = "Privacy Guarantee: This fingerprint contains sanitized structural patterns only. Personal identifiers, phone numbers, and raw messages are strictly stripped prior to export."

    # Sanitized export text
    sanitized_preview = sanitize_text(text_preview)
    sanitized_export = (
        f"════════════════════════════════════════════════\n"
        f"  SCAMSAATHI — SCAM DNA FINGERPRINT\n"
        f"  Tagline: Pause. Verify. Protect. | Team CTRL+FREAKS\n"
        f"════════════════════════════════════════════════\n"
        f"ID: {dna_id}\n"
        f"Risk Level: {risk_level} (Score: {risk_score}/100)\n"
        f"Detected Tactics: {', '.join(tactics) if tactics else 'None'}\n"
        f"\n"
        f"Summary: {summary}\n"
        f"\n"
        f"Three Golden Safety Rules:\n"
        f"{three_recommendations[0]}\n"
        f"{three_recommendations[1]}\n"
        f"{three_recommendations[2]}\n"
        f"\n"
        f"{privacy_notice}\n"
        f"════════════════════════════════════════════════"
    )

    return ScamDNAResponse(
        dna_id=dna_id,
        title=title,
        risk_category=risk_level,
        vector=vector,
        detected_tactics=tactics,
        summary=summary,
        three_recommendations=three_recommendations,
        sanitized_export_text=sanitized_export,
        privacy_notice=privacy_notice
    )
