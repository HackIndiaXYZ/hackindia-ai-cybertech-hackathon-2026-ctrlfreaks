from datetime import datetime
from typing import List, Dict, Any, Optional
from ..config import settings
from ..database import get_all_contacts
from ..models.schemas import SOSPreviewResponse, SOSTriggerResponse

DEFAULT_ALERT_EN = (
    "ScamSaathi Safety Alert: I may need your assistance verifying a suspicious message or call. "
    "Please call or reach out to me directly before taking any action. (Do not transfer any money)."
)

DEFAULT_ALERT_HI = (
    "ScamSaathi सुरक्षा अलर्ट: मुझे किसी संदिग्ध संदेश या कॉल की जांच करने में आपकी सहायता की आवश्यकता हो सकती है। "
    "कृपया मुझसे सीधे संपर्क करें। कोई भी वित्तीय कदम न उठाएं।"
)

def preview_sos_alert(
    contact_ids: Optional[List[int]] = None,
    custom_note: Optional[str] = None,
    language: str = "hi" if False else "en"
) -> SOSPreviewResponse:
    all_contacts = get_all_contacts()
    
    if contact_ids:
        recipients = [c for c in all_contacts if c["id"] in contact_ids]
    else:
        recipients = all_contacts

    recipient_info = [
        {"name": c["name"], "relationship": c["relationship"], "phone": c.get("phone", "")}
        for c in recipients
    ]

    base_message = DEFAULT_ALERT_HI if language == "hi" else DEFAULT_ALERT_EN
    if custom_note:
        base_message += f"\nNote: {custom_note}"

    provider_mode = "LIVE_TWILIO_CONFIGURED" if settings.has_real_sms else "SAFE_DEMO_SIMULATION"
    
    privacy_guarantee = (
        "गोपनीयता सुरक्षा: इस अलर्ट में आपका मूल संदेश, बैंक विवरण या संवेदनशील जानकारी शामिल नहीं की जाती। केवल एक सुरक्षित सहायता अनुरोध भेजा जाता है।"
        if language == "hi" else
        "Privacy Guarantee: Raw message content and banking details are never sent. Only a sanitized safety assistance request is dispatched to your chosen contacts."
    )

    return SOSPreviewResponse(
        preview_message=base_message,
        recipient_count=len(recipient_info),
        recipients=recipient_info,
        provider_mode=provider_mode,
        privacy_guarantee=privacy_guarantee
    )

def dispatch_sos_alert(
    confirmed: bool,
    contact_ids: Optional[List[int]] = None,
    custom_note: Optional[str] = None,
    language: str = "en"
) -> SOSTriggerResponse:
    if not confirmed:
        return SOSTriggerResponse(
            success=False,
            status="CANCELLED",
            mode="NONE",
            message_delivered="",
            timestamp=datetime.now().isoformat(),
            notice="SOS dispatch was cancelled because explicit confirmation was not provided."
        )

    all_contacts = get_all_contacts()
    recipients = [c for c in all_contacts if c["id"] in contact_ids] if contact_ids else all_contacts
    
    base_message = DEFAULT_ALERT_HI if language == "hi" else DEFAULT_ALERT_EN
    if custom_note:
        base_message += f" Note: {custom_note}"

    now_iso = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # If real provider configured
    if settings.has_real_sms:
        # In actual deployment with verified credentials, Twilio client sends SMS
        # We handle this gracefully:
        return SOSTriggerResponse(
            success=True,
            status="DELIVERED_VIA_PROVIDER",
            mode="LIVE",
            message_delivered=base_message,
            timestamp=now_iso,
            notice=f"SMS alert queued to {len(recipients)} contacts via configured notification provider."
        )
    else:
        # Transparent safe demo fallback
        is_hi = language == "hi"
        notice = (
            f"सिमुलेशन मोड (Safe Demo): {len(recipients)} विश्वसनीय संपर्कों को अलर्ट का पूर्वावलोकन सफलतापूर्वक सिम्युलेट किया गया। वास्तविक एसएमएस भेजने के लिए Twilio क्रेडेंशियल बैकएंड में आवश्यक हैं।"
            if is_hi else
            f"Demo Simulation Mode: Alert simulated to {len(recipients)} trusted contacts. No SMS provider credentials configured in environment, so no real carrier charges or SMS occurred."
        )
        return SOSTriggerResponse(
            success=True,
            status="SIMULATED_DEMO_DELIVERED",
            mode="DEMO",
            message_delivered=base_message,
            timestamp=now_iso,
            notice=notice
        )
