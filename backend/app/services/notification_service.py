import os
import re
import smtplib
import urllib.parse
import urllib.request
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple

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

def _sanitize_phone(phone: str) -> str:
    """Strip all non-digits, keep leading country code if present."""
    if not phone:
        return ""
    cleaned = re.sub(r"[^\d+]", "", phone.strip())
    if cleaned.startswith("+"):
        return cleaned[1:]
    # Default to India 91 if 10 digits
    if len(cleaned) == 10:
        return "91" + cleaned
    return cleaned

def _send_smtp_email(recipient_emails: List[str], subject: str, message: str) -> Tuple[bool, str]:
    """Dispatches a real email via configured SMTP server (Gmail, Yahoo, Outlook, custom)."""
    if not settings.has_real_email or not recipient_emails:
        return False, "SMTP credentials not configured"

    from_addr = settings.smtp_from_email or settings.smtp_user
    
    html_body = f"""
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #080C15; color: #F8FAFC; padding: 24px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: #10182B; border: 1px solid rgba(244,63,94,0.4); border-radius: 12px; padding: 24px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <span style="background: rgba(244,63,94,0.15); color: #FB7185; border: 1px solid rgba(244,63,94,0.3); padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 11px;">
              EMERGENCY SOS ALERT
            </span>
          </div>
          <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px;">ScamSaathi Urgent Assistance Request</h2>
          <div style="background: #080C15; border-left: 4px solid #F43F5E; padding: 14px; border-radius: 6px; margin: 18px 0; color: #E2E8F0; font-size: 14px; line-height: 1.6;">
            {message}
          </div>
          <p style="color: #94A3B8; font-size: 12px; line-height: 1.5;">
            This alert was manually dispatched from ScamSaathi by your trusted contact. Please call them directly on their primary phone number to verify their safety. Do NOT transfer funds or authorize OTPs.
          </p>
          <div style="border-top: 1px solid rgba(255,255,255,0.08); margin-top: 20px; padding-top: 14px; color: #64748B; font-size: 11px;">
            ScamSaathi • Cognitive Firewall & Anti-Phishing Console • Zero-Message-Retention Framework
          </div>
        </div>
      </body>
    </html>
    """

    try:
        from email.utils import formatdate, make_msgid

        if settings.smtp_port == 465:
            server = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=12)
        else:
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=12)
            server.ehlo()
            server.starttls()
            server.ehlo()

        server.login(settings.smtp_user, settings.smtp_password)

        valid_recipients = [e for e in recipient_emails if not e.endswith("@example.com")]
        if not valid_recipients:
            valid_recipients = recipient_emails

        delivered = []
        for to_addr in valid_recipients:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"ScamSaathi Security Alert <{from_addr}>"
            msg["To"] = to_addr
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="scamsaathi.local")
            msg["X-Priority"] = "1"
            msg["Importance"] = "High"

            msg.attach(MIMEText(message, "plain", "utf-8"))
            msg.attach(MIMEText(html_body, "html", "utf-8"))

            server.sendmail(from_addr, [to_addr], msg.as_string())
            delivered.append(to_addr)

        server.quit()
        return True, f"Real Email dispatched directly to inbox: {', '.join(delivered)}"
    except Exception as e:
        return False, f"SMTP delivery error: {str(e)}"

def _send_twilio_sms(recipient_phones: List[str], message: str) -> Tuple[bool, str]:
    """Dispatches real SMS via Twilio REST API using standard urllib."""
    if not settings.has_real_sms or not recipient_phones:
        return False, "Twilio credentials not configured"

    account_sid = settings.twilio_account_sid
    auth_token = settings.twilio_auth_token
    from_number = settings.twilio_phone_number

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    auth_str = base64.b64encode(f"{account_sid}:{auth_token}".encode("utf-8")).decode("utf-8")

    sent_count = 0
    errors = []

    for raw_phone in recipient_phones:
        phone = raw_phone.strip()
        if not phone.startswith("+"):
            phone = "+" + phone.lstrip("0")
        
        data = urllib.parse.urlencode({
            "To": phone,
            "From": from_number,
            "Body": message
        }).encode("utf-8")

        req = urllib.request.Request(url, data=data, method="POST")
        req.add_header("Authorization", f"Basic {auth_str}")
        req.add_header("Content-Type", "application/x-www-form-urlencoded")

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                if 200 <= resp.status < 300:
                    sent_count += 1
        except Exception as e:
            errors.append(f"{phone}: {str(e)}")

    if sent_count > 0:
        return True, f"Twilio SMS sent to {sent_count} phone(s). " + (f"Errors: {', '.join(errors)}" if errors else "")
    else:
        return False, f"Twilio SMS failed: {', '.join(errors)}"

def _build_action_links(recipients: List[Dict[str, Any]], message: str, subject: str) -> List[Dict[str, Any]]:
    """Builds instant 1-click WhatsApp, SMS, and Email direct links for client-side action."""
    encoded_msg = urllib.parse.quote(message)
    encoded_sub = urllib.parse.quote(subject)
    
    links = []
    for c in recipients:
        phone = c.get("phone", "") or ""
        clean_p = _sanitize_phone(phone)
        email = c.get("email", "") or ""
        
        item = {
            "id": c.get("id"),
            "name": c.get("name", "Contact"),
            "relationship": c.get("relationship", ""),
            "phone": phone,
            "email": email,
            "whatsapp_url": f"https://api.whatsapp.com/send?phone={clean_p}&text={encoded_msg}" if clean_p else "",
            "sms_url": f"sms:{phone}?body={encoded_msg}" if phone else "",
            "mailto_url": f"mailto:{email}?subject={encoded_sub}&body={encoded_msg}" if email else ""
        }
        links.append(item)
    return links

def preview_sos_alert(
    contact_ids: Optional[List[int]] = None,
    custom_note: Optional[str] = None,
    language: str = "en"
) -> SOSPreviewResponse:
    all_contacts = get_all_contacts()
    
    if contact_ids:
        recipients = [c for c in all_contacts if c["id"] in contact_ids]
    else:
        recipients = all_contacts

    recipient_info = [
        {
            "name": c["name"],
            "relationship": c["relationship"],
            "phone": c.get("phone", "") or "",
            "email": c.get("email", "") or ""
        }
        for c in recipients
    ]

    base_message = DEFAULT_ALERT_HI if language == "hi" else DEFAULT_ALERT_EN
    if custom_note:
        base_message += f"\nNote: {custom_note}"

    modes = []
    if settings.has_real_email:
        modes.append("LIVE_SMTP_EMAIL")
    if settings.has_real_sms:
        modes.append("LIVE_TWILIO_SMS")
    if not modes:
        modes.append("DIRECT_DEVICE_DISPATCH + SAFE_SIMULATION")

    provider_mode = " + ".join(modes)
    
    privacy_guarantee = (
        "गोपनीयता सुरक्षा: इस अलर्ट में आपका मूल संदेश, बैंक विवरण या संवेदनशील जानकारी शामिल नहीं की जाती। केवल एक सुरक्षित सहायता अनुरोध भेजा जाता है।"
        if language == "hi" else
        "Privacy Guarantee: Raw phishing payloads and sensitive banking credentials are never included. Only a clean, sanitized assistance dispatch is transmitted."
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

    subject = "URGENT: ScamSaathi Safety Alert — Verification Needed"
    now_iso = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Generate instant 1-click links for each recipient
    action_links = _build_action_links(recipients, base_message, subject)

    # Collect recipient emails & phones
    recipient_emails = [c["email"].strip() for c in recipients if c.get("email") and "@" in c["email"]]
    recipient_phones = [c["phone"].strip() for c in recipients if c.get("phone")]

    channels = {}
    logs = []

    # 1. Attempt Real Email via SMTP if configured
    if settings.has_real_email:
        email_ok, email_msg = _send_smtp_email(recipient_emails, subject, base_message)
        channels["email"] = {"success": email_ok, "detail": email_msg, "recipients": recipient_emails}
        logs.append(f"[EMAIL] {email_msg}")
    else:
        channels["email"] = {
            "success": False,
            "detail": "SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASSWORD) not configured in .env",
            "recipients": recipient_emails
        }

    # 2. Attempt Real SMS via Twilio if configured
    if settings.has_real_sms:
        sms_ok, sms_msg = _send_twilio_sms(recipient_phones, base_message)
        channels["sms"] = {"success": sms_ok, "detail": sms_msg, "recipients": recipient_phones}
        logs.append(f"[SMS] {sms_msg}")
    else:
        channels["sms"] = {
            "success": False,
            "detail": "Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) not configured in .env",
            "recipients": recipient_phones
        }

    is_live = settings.has_real_email or settings.has_real_sms
    mode_str = "LIVE" if is_live else "DIRECT_DISPATCH"

    is_hi = language == "hi"
    if is_live:
        summary_notice = " | ".join(logs)
    else:
        summary_notice = (
            f"अलर्ट तैयार है: {len(recipients)} संपर्कों के लिए 1-क्लिक व्हाट्सएप, एसएमएस और ईमेल लिंक नीचे सक्रिय कर दिए गए हैं। सर्वर से सीधे ईमेल/एसएमएस भेजने के लिए .env में SMTP या Twilio क्रेडेंशियल सेट करें।"
            if is_hi else
            f"SOS Alert prepared for {len(recipients)} contact(s). Instant 1-click WhatsApp, SMS, and Mailto links are activated below. To enable automated background server dispatch, configure SMTP (Gmail) or Twilio in your .env file."
        )

    return SOSTriggerResponse(
        success=True,
        status="DISPATCH_EXECUTED",
        mode=mode_str,
        message_delivered=base_message,
        timestamp=now_iso,
        notice=summary_notice,
        channels_dispatched=channels,
        action_links=action_links
    )
