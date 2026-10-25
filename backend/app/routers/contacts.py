from typing import List
from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    ContactCreate, ContactResponse,
    SOSPreviewRequest, SOSPreviewResponse,
    SOSTriggerRequest, SOSTriggerResponse
)
from ..database import get_all_contacts, add_contact, delete_contact
from ..services.notification_service import preview_sos_alert, dispatch_sos_alert

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
