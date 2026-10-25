# ScamSaathi — Testing Strategy & Quality Assurance
**Team:** CTRL+FREAKS  
**Test Suite:** Pytest

---

## 1. Overview of Test Coverage

The automated test suite covers the complete application stack:

| Test Module | Focus Area | Status |
| :--- | :--- | :--- |
| `test_message_analyzer.py` | Psychological tactics, urgency, fear, authority, credential harvesting, APK detection, Hindi & English vocabulary, benign false-positive prevention, score capping | ✅ 100% Passed |
| `test_url_analyzer.py` | IP address hosts, URL shortening, brand lookalikes, direct APK downloads, legitimate bank domains, bilingual outputs | ✅ 100% Passed |
| `test_scam_dna.py` | PII sanitization (phone, email, OTP, URLs), 8-axis radar vector generation, 3 counter-rules | ✅ 100% Passed |
| `test_api_endpoints.py` | FastAPI REST endpoints: health, message analyzer, SafeLink, HoneyShield scenarios, trusted contacts CRUD, SOS preview, privacy clear | ✅ 100% Passed |
| `test_frontend_static.py` | SPA shell index.html, custom CSS styles, ES module JavaScript routing, bilingual translation dictionaries | ✅ 100% Passed |

---

## 2. Running Automated Tests

Run all unit and integration tests from the project root:

```bash
# Run complete test suite
python -m pytest

# Run with verbose test details
python -m pytest -v

# Run a specific test suite
python -m pytest backend/tests/test_message_analyzer.py -v
```

---

## 3. Synthetic Test Cases (Suspicious vs Benign)

To prevent false positives, the test suite verifies both malicious and benign inputs:

### Malicious Test Samples:
1. **Fake Bank KYC Alert:**
   `"URGENT: Your SBI account has been suspended due to incomplete KYC verification. Click https://sbi-verification-update.xyz/login immediately."`
   - *Expected:* Score >= 55 (HIGH/CRITICAL), `tactic_urgency`, `tactic_fear`.

2. **Electricity Disconnection Threat:**
   `"Your electricity will be disconnected tonight. Police legal action will be taken."`
   - *Expected:* Score >= 55 (HIGH), `tactic_fear`, `tactic_authority`.

3. **Credential Theft:**
   `"Share your OTP and enter UPI PIN to receive the payment immediately."`
   - *Expected:* Score >= 50, `pause_intervention == True`, `tactic_credentials`.

4. **Malicious APK Download:**
   `"Download and install support.apk to claim your refund."`
   - *Expected:* Score >= 25, `tactic_tech`.

5. **Hindi / Hinglish Coercion:**
   `"आपका बैंक खाता तुरंत ब्लॉक कर दिया जाएगा। 10 मिनट में अपना ओटीपी बताएं।"`
   - *Expected:* Score >= 40, Hindi language explanations.

### Benign Test Samples (False-Positive Prevention):
1. **Library Meeting Reminder:**
   `"Good morning! Just a reminder that our group project meeting is tomorrow at 4 PM in the library. See you there."`
   - *Expected:* Score <= 20, `risk_level == "LOW"`, `pause_intervention == False`.

2. **Clinic Appointment Reminder:**
   `"Hello, this is a reminder for your dental check-up scheduled tomorrow at 11:00 AM at City Dental Clinic. Call our front desk if you need to reschedule."`
   - *Expected:* Score <= 20, `risk_level == "LOW"`.

3. **Legitimate Bank Domain in SafeLink:**
   `"https://onlinesbi.sbi/portal/login"`
   - *Expected:* `is_lookalike == False`, `is_https == True`, `risk_level == "LOW OBSERVED RISK"`.
