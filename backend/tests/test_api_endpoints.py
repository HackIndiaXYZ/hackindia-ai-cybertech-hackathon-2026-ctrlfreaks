import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app"] == "ScamSaathi"
    assert "integrations" in data

def test_message_analysis_api():
    payload = {
        "text": "Your bank account is blocked. Call manager immediately with OTP.",
        "language": "en"
    }
    response = client.post("/api/analyze/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] > 40
    assert len(data["psychological_tactics"]) > 0
    assert len(data["recommended_actions"]) > 0

def test_url_analysis_api():
    payload = {
        "url": "http://185.220.101.5/sbi-kyc",
        "language": "en"
    }
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_ip_host"] is True
    assert data["risk_level"] in ["UNCERTAIN", "HIGH RISK"]

def test_honeyshield_scenarios_api():
    response = client.get("/api/scenarios?lang=en")
    assert response.status_code == 200
    scenarios = response.json()
    assert len(scenarios) >= 5
    
    # Test evaluation
    eval_payload = {
        "scenario_id": "scenario_kyc",
        "selected_option_id": "opt_b",
        "language": "en"
    }
    eval_resp = client.post("/api/scenarios/evaluate", json=eval_payload)
    assert eval_resp.status_code == 200
    eval_data = eval_resp.json()
    assert eval_data["is_safe"] is True
    assert eval_data["score_impact"] > 0

def test_trusted_contacts_api():
    # 1. Get contacts
    get_res = client.get("/api/contacts")
    assert get_res.status_code == 200
    contacts = get_res.json()
    assert isinstance(contacts, list)

    # 2. Add contact
    new_contact = {
        "name": "Test Guardian",
        "relationship": "Sister",
        "phone": "+91 99999 88888",
        "email": "guardian@example.com"
    }
    post_res = client.post("/api/contacts", json=new_contact)
    assert post_res.status_code == 200
    created = post_res.json()
    contact_id = created["id"]

    # 3. Preview SOS
    sos_preview = client.post("/api/contacts/sos/preview", json={"language": "en"})
    assert sos_preview.status_code == 200
    assert sos_preview.json()["recipient_count"] >= 1

    # 4. Trigger SOS (demo simulation)
    sos_trigger = client.post("/api/contacts/sos/trigger", json={
        "confirmed": True,
        "language": "en"
    })
    assert sos_trigger.status_code == 200
    assert sos_trigger.json()["success"] is True

    # 5. Clean up contact
    del_res = client.delete(f"/api/contacts/{contact_id}")
    assert del_res.status_code == 200

def test_privacy_endpoints():
    status_res = client.get("/api/privacy/status")
    assert status_res.status_code == 200
    assert "Zero-Message-Retention" in status_res.json()["storage_mode"]

    clear_res = client.post("/api/privacy/clear")
    assert clear_res.status_code == 200
    assert clear_res.json()["success"] is True
