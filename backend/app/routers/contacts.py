from typing import List, Optional
from pathlib import Path
from fastapi import APIRouter, HTTPException
from ..config import settings
from ..models.schemas import (
    ContactCreate, ContactResponse,
    SOSPreviewRequest, SOSPreviewResponse,
    SOSTriggerRequest, SOSTriggerResponse,
    SMTPConfigRequest, SMTPConfigResponse
)
from ..database import get_all_contacts, add_contact, delete_contact, set_setting, get_setting
from ..services.notification_service import preview_sos_alert, dispatch_sos_alert, _send_smtp_email

router = APIRouter(prefix="/api/contacts", tags=["Trusted Contacts & SOS"])

@router.get("", response_model=List[ContactResponse])
def get_contacts():
    return get_all_contacts()

@router.post("", response_model=ContactResponse)
def create_contact(payload: ContactCreate):
    new_c = add_contact(payload.name, payload.relationship, payload.phone, payload.email)
    return new_c

@router.delete("/{contact_id}")
def remove_contact(contact_id: int):
    success = delete_contact(contact_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contact not found.")
    return {"success": True, "message": "Contact removed successfully."}

@router.post("/sos/preview", response_model=SOSPreviewResponse)
def preview_sos(payload: SOSPreviewRequest):
    return preview_sos_alert(payload.contact_ids, payload.custom_note, payload.language)

@router.post("/sos/trigger", response_model=SOSTriggerResponse)
def trigger_sos(payload: SOSTriggerRequest):
    return dispatch_sos_alert(
        confirmed=payload.confirmed,
        contact_ids=payload.contact_ids,
        custom_note=payload.custom_note,
        language=payload.language
    )

@router.get("/config/smtp")
def get_smtp_status():
    user = settings.smtp_user or get_setting("SMTP_USER", "")
    is_conf = bool(user and (settings.smtp_password or get_setting("SMTP_PASSWORD", "")))
    masked_user = ""
    if user and "@" in user:
        parts = user.split("@")
        masked_user = parts[0][:2] + "***@" + parts[1]
    return {
        "configured": is_conf,
        "smtp_host": settings.smtp_host or get_setting("SMTP_HOST", "smtp.gmail.com"),
        "smtp_port": settings.smtp_port or 587,
        "smtp_user_masked": masked_user
    }

@router.post("/config/smtp", response_model=SMTPConfigResponse)
def save_smtp_config(payload: SMTPConfigRequest):
    host = payload.smtp_host.strip() or "smtp.gmail.com"
    port = payload.smtp_port or 587
    user = payload.smtp_user.strip()
    password = payload.smtp_password.strip()

    if not user or not password:
        raise HTTPException(status_code=400, detail="Sender email and password are required.")

    # Update in-memory settings
    settings.smtp_host = host
    settings.smtp_port = port
    settings.smtp_user = user
    settings.smtp_password = password
    if payload.smtp_from_email:
        settings.smtp_from_email = payload.smtp_from_email.strip()

    # Persist to database
    set_setting("SMTP_HOST", host)
    set_setting("SMTP_PORT", str(port))
    set_setting("SMTP_USER", user)
    set_setting("SMTP_PASSWORD", password)

    # Persist to .env file
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    try:
        lines = []
        if env_path.exists():
            with open(env_path, "r", encoding="utf-8") as f:
                lines = [l for l in f if not l.startswith(("SMTP_HOST=", "SMTP_PORT=", "SMTP_USER=", "SMTP_PASSWORD=", "SMTP_FROM_EMAIL="))]
        lines.append(f"SMTP_HOST={host}\n")
        lines.append(f"SMTP_PORT={port}\n")
        lines.append(f"SMTP_USER={user}\n")
        lines.append(f"SMTP_PASSWORD={password}\n")
        with open(env_path, "w", encoding="utf-8") as f:
            f.writelines(lines)
    except Exception:
        pass

    # Optional test email verification
    if payload.send_test_email:
        test_ok, test_msg = _send_smtp_email(
            [user],
            "ScamSaathi Verification Test Email",
            "Your ScamSaathi Emergency SOS Email Gateway is successfully connected and verified!"
        )
        if not test_ok:
            raise HTTPException(status_code=400, detail=f"Failed to connect to SMTP server: {test_msg}")

    return SMTPConfigResponse(
        success=True,
        message=f"SMTP gateway configured successfully for {user}!"
    )
