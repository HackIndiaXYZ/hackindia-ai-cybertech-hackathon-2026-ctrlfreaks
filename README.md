# ScamSaathi (स्कैमसाथी) — AI-Assisted Cybersecurity Companion
**Tagline:** Pause. Verify. Protect.  
**Team:** CTRL+FREAKS  
**Category:** AI-Assisted Cybersecurity & Scam Prevention  
**Primary Users:** General internet users, first-time UPI users, students, senior citizens, and anyone seeking accessible cyber-safety guidance.

---

## 🌟 Executive Summary

**ScamSaathi** is a modern, privacy-focused cyber-safety companion engineered to help users recognize suspicious communications, understand psychological manipulation tactics, inspect dangerous links, seek trusted verification, and learn resilient cyber defense.

Rather than offering only a binary "Scam" or "Safe" verdict, ScamSaathi answers four essential questions:
1. **What makes this message or link suspicious?**
2. **Which psychological manipulation tactics are being weaponized?**
3. **What should the user do right now?**
4. **How can the user avoid similar scams in the future?**

The core user experience follows a proactive mental model:  
**RECOGNISE → INTERRUPT → PROTECT → LEARN**

---

## 🚀 Key Features

### 1. Executive Dashboard
- Reassuring, modern dark-navy (`#0B1220`) and emerald-green (`#10B981`) cybersecurity aesthetic.
- Session statistics tracking: analyses conducted, tactics flagged, and HoneyShield defense score.
- **Check Before You Trust:** Instant paste workspace routing automatically to message or link evaluation.
- Daily cyber safety tip and ephemeral session activity log.

### 2. Scam Message Analyzer
- Multi-format input support: SMS, WhatsApp, Email, or Call Transcript.
- Preloaded sample test cases in English and Hindi (Fake Bank KYC, Electricity Disconnection, Police Digital Arrest, Malicious APK Refund, and Benign Reminders).
- Explainable heuristic risk score (0–100) and risk tiers: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
- Transparent scoring breakdown with exact suspicious phrases and contextual explanations.

### 3. Psychological Scam Decoder
- Visual analysis cards dissecting 7 primary social engineering levers:
  - **Urgency & Time Pressure**
  - **Fear & Coercion (Intimidation)**
  - **False Authority (Impersonation)**
  - **Secrecy & Isolation**
  - **Reward & Greed Enticement**
  - **Credential Harvesting**
  - **Technical Deception (.APK & Screen-Sharing)**
- **Pause Before You Act Intervention:** Triggers a respectful behavioral interruption when high emotional pressure or fear is detected.

### 4. SafeLink Protection — Check Before You Click
- Deep URL anatomy inspection:
  - Dangerous URL schemes (`javascript:`, `data:`, `file:`)
  - Missing HTTPS encryption
  - Numerical IP address hosts (e.g., `http://185.220.101.5/`)
  - Domain spoofing & lookalike banking brands (SBI, HDFC, Paytm, PhonePe, India Post)
  - URL shorteners (Bitly, TinyURL, is.gd)
  - High-risk top-level domains (`.xyz`, `.top`, `.buzz`, `.online`)
  - Direct binary / APK downloads
- **Safe Interstitial Preview:** An isolated preview displaying the genuine target host with an explicit user decision barrier. Zero automatic script execution.

### 5. Scam DNA Fingerprint — Understand the Pattern, Not the Person
- Generates a visual 8-axis SVG radar chart representing the unique vector of manipulation tactics.
- Produces a unique DNA ID (e.g. `DNA-7F2A9B1C`), pattern summary, and three golden counter-rules.
- **PII-Sanitized Export:** Download high-resolution PNG summary card (generated via HTML5 Canvas) or copy scrubbed text summary. All phone numbers, emails, URLs, names, and OTPs are strictly redacted.

### 6. HoneyShield Simulation Lab
- Interactive cyber-awareness simulator featuring 6 branching real-world scenarios:
  1. Urgent Bank KYC Account Suspension
  2. Electricity Disconnection Threat
  3. Digital Arrest & Fake Police Video Call
  4. WhatsApp Lucky Draw & KBC Fee Trap
  5. Part-Time Work-From-Home Task Scam
  6. Courier Delivery Failure & Malicious APK
- Educational feedback explaining why choices are safe or dangerous, with score tracking and simulation reset capabilities.

### 7. Safety Center & Emergency Protocols
- Interactive safety checklist allowing users to check off immediate protective actions.
- Prominent **National Cybercrime Helpline (India): Dial 1930** banner with one-click direct dialing.
- Direct links to the official portal: [cybercrime.gov.in](https://cybercrime.gov.in/).
- Evidence preservation standard guide: screenshots with sender IDs, transaction UTR numbers, and digital record retention.

### 8. Trusted Contacts & Consent-Based SOS
- Manage trusted guardians and family advisors with local SQLite storage.
- **Consent-First Emergency SOS Routine:** Never silently sends alerts. Requires explicit user confirmation, provides a preview of the proposed message, discloses the provider mode (Live Twilio vs Safe Demo Simulation), and verifies zero sensitive message data is shared.

### 9. Privacy Center
- Transparent data processing matrix detailing what is processed, where it lives, and zero-retention guarantees.
- **Immediate Session Purge:** One-click wipe of all ephemeral session memory and cached analyses.
- Discloses the status of all underlying security engines.

### 10. Complete Bilingual Interface (English / हिन्दी)
- Central translation dictionary supporting full UI translation across all 9 pages, buttons, badges, descriptions, and analysis outputs.
- Persistent language switcher in the top navigation bar.

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, Tailwind CSS, Modern JavaScript (ES Modules), Custom SVG Radar Charts, HTML5 Canvas Export.
- **Backend:** Python 3.11+ / 3.13, FastAPI, Pydantic v2, SQLite.
- **Testing:** Pytest (Unit, Integration, and Static Asset verification).
- **Architecture:** Zero-retention RAM processing, strict CORS, security response headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`).

---

## 📦 Prerequisites

- Python 3.11 or newer (Python 3.13 supported).
- Modern web browser (Chrome, Edge, Firefox, Safari).

---

## ⚙️ Installation & Setup

1. **Clone or Navigate to the Workspace:**
   ```bash
   cd scamsaathi
   ```

2. **Install Backend Dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```
   *(Required packages: `fastapi`, `uvicorn`, `pydantic`, `pytest`, `httpx`)*

3. **Configure Environment Variables (Optional):**
   ```bash
   cp .env.example .env
   ```
   > **Note:** ScamSaathi runs completely out-of-the-box in deterministic local mode without any paid API keys or external services.

---

## 🚀 Launching ScamSaathi

Launch the unified application server with a single command:

```bash
python run.py
```

- **Web Application:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Interactive API Documentation:** [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)
- **Alternative API Docs:** [http://127.0.0.1:8000/api/redoc](http://127.0.0.1:8000/api/redoc)

---

## 🧪 Running Automated Tests

ScamSaathi includes a test suite with 26 automated unit and integration tests:

```bash
# Run all tests
python -m pytest

# Run with verbose details
python -m pytest -v
```

All 26 tests cover:
- Urgent, fear-based, authority, secrecy, reward, and credential extraction logic.
- False-positive prevention on benign everyday reminders.
- Hindi and English multilingual detection.
- SafeLink URL structure parsing, lookalike detection, and IP host checks.
- Scam DNA PII sanitization and vector calculation.
- FastAPI endpoints (health, analyze, safelink, honeyshield, contacts, privacy).
- Frontend static asset delivery.

---

## 🔒 Privacy & Limitations Disclaimer

- **Heuristic Model:** Detection scores represent explainable behavioral heuristics and vocabulary patterns, not a statistical guarantee. Zero-day attacks or novel pretexting schemes may lack known indicators.
- **No Direct Law Enforcement Action:** ScamSaathi does not file police reports or freeze bank accounts on its own. If financial fraud has occurred, users should immediately dial **1930** or report to **cybercrime.gov.in**.
- **Local Fallback Transparency:** When external API keys (OpenAI, Gemini, Google Safe Browsing, Twilio) are absent, ScamSaathi transparently utilizes its local deterministic heuristics engine and safe simulation modes.

---

## 👥 Credits
**ScamSaathi** is designed and engineered by **Team CTRL+FREAKS**.  
*Pause. Verify. Protect.*
