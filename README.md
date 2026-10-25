<div align="center">

# ScamSaathi (स्कैमसाथी)

**Real-time scam detection, behavioral manipulation analysis, and link safety platform.**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0B1220?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Pytest-26%20Passed-10B981?style=for-the-badge)](https://pytest.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal?style=for-the-badge)](LICENSE)

*Built by **Team Ctrl+Freaks** for **HackIndia AI Cybertech Hackathon 2026***

</div>

---

## Overview

Cyber scams in India and across the globe have evolved beyond simple phishing links into sophisticated psychological extortion — fake police video calls ("Digital Arrest"), urgent electricity disconnection threats, fake bank KYC locks, and malicious APK files. 

Most conventional security tools only say "Safe" or "Unsafe" without explaining **why**. **ScamSaathi** is designed to bridge this gap:
- It deconstructs incoming SMS, WhatsApp chats, emails, and call transcripts.
- It identifies the exact **psychological coercion levers** being used (Urgency, Fear, False Authority, Secrecy, Greed, APK downloads).
- It checks URLs for domain spoofing, typosquatting, and hidden IP hosts before you click.
- It delivers proactive behavioral interventions ("Pause Before You Act") to disrupt panic.
- It processes everything **ephemerally in-memory (RAM)** with zero storage of user messages, protecting user privacy.

---

## Core Modules

### 1. Scam Message Analyzer & Psychological Decoder
- Analyzes text from SMS, WhatsApp, Emails, and call transcripts.
- Flags 7 psychological pressure vectors:
  - **Urgency & Artificial Deadlines:** Detects time pressure phrases (`immediately`, `within 10 minutes`, `turant`, `aaj raat`).
  - **Fear & Intimidation:** Identifies coercive threats (`account blocked`, `electricity cut`, `FIR`, `arrest`).
  - **False Authority:** Recognizes impersonation of police, CBI, customs, and banks (SBI, HDFC, TRAI, RBI).
  - **Secrecy & Isolation:** Catches isolation commands (`keep confidential`, `don't tell anyone`, `stay on video call`).
  - **Reward Enticement:** Identifies unsolicited lottery and task scams (`KBC draw`, `earn 5000/day`).
  - **Credential Harvesting:** Flags OTP, UPI PIN, and processing fee requests.
  - **Malware & APK Deception:** Identifies side-loaded Android package files (`.apk`, `AnyDesk`, `TeamViewer`).
- **Pause Before You Act Modal:** A behavioral intervention popup triggered when high urgency or panic language is detected, reminding the user to step back before transferring money or sharing OTPs.

### 2. SafeLink Protection
- Inspects URLs before navigation:
  - Numerical IP address hosts (`http://185.220.101.5/...`)
  - Banking brand typosquatting (e.g., `sbi-verification-update.xyz`)
  - High-risk / disposable TLDs (`.xyz`, `.top`, `.buzz`, `.online`)
  - Masked redirect services (Bitly, TinyURL, is.gd)
  - Direct APK / binary download endpoints
- **Safe Interstitial Gateway:** Displays destination domain details and forces explicit user confirmation before opening external sites.

### 3. Scam DNA Fingerprint
- Generates a real-time **8-axis SVG radar visualization** mapping the detected manipulation vectors.
- Assigns a unique tracking identifier (e.g. `DNA-7F2A9B1C`).
- **PII-Sanitized Export:** Generates an exportable PNG summary card via HTML5 Canvas with all phone numbers, email addresses, names, URLs, and OTP codes automatically scrubbed.

### 4. HoneyShield Simulation Lab
- Interactive training module with 6 branching real-world scenarios:
  1. Urgent Bank KYC Account Suspension
  2. Late-Night Electricity Disconnection Threat
  3. Digital Arrest & Fake Police Video Call
  4. WhatsApp Lottery & Upfront Processing Fee
  5. Part-Time Work-From-Home Task Scheme
  6. Courier Delivery Failure with APK Download
- Provides real-time feedback on safe vs. risky choices, explaining attacker psychology and tracking defense scores.

### 5. Safety Center & National Helpline 1930
- Direct one-click dialer for India's **National Cybercrime Helpline: 1930**.
- Link to the official portal [cybercrime.gov.in](https://cybercrime.gov.in/).
- Interactive incident checklist and step-by-step evidence preservation guidelines (screenshots, UTR numbers).

### 6. Trusted Contacts & Consent-Based SOS
- Local SQLite database to manage family guardians and emergency contacts.
- Explicit confirmation workflow: previews the outbound alert, verifies zero sensitive message data is transmitted, and supports both live SMS dispatch and safe simulation demo mode.

### 7. Bilingual Experience (English & हिन्दी)
- Central i18n translation dictionary allowing instant toggling between English and Hindi across all 9 pages, result cards, and educational scenarios.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2, SQLite, Uvicorn |
| **Frontend** | Modern JavaScript (ES Modules), Tailwind CSS, HTML5 Canvas, SVG Radar Charts |
| **Testing** | Pytest (26 unit and integration tests) |
| **Security** | Zero message persistence (RAM-only), sanitized logging, CSP, nosniff & DENY headers |

---

## Project Structure

```
scamsaathi/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application & security middleware
│   │   ├── config.py               # Application settings & feature flags
│   │   ├── database.py             # SQLite helper for trusted contacts
│   │   ├── models/                 # Pydantic schemas
│   │   ├── services/
│   │   │   ├── message_analyzer.py # Psychological & heuristic detection engine
│   │   │   ├── url_analyzer.py     # SafeLink domain spoofing & link analyzer
│   │   │   ├── scam_dna.py         # 8-axis radar vector generator & PII scrubber
│   │   │   ├── honeyshield.py      # 6 interactive simulation scenarios
│   │   │   ├── notification_service.py # SOS preview & dispatcher
│   │   │   └── ai_service.py       # Hybrid engine with local deterministic fallback
│   │   └── routers/                # REST endpoints
│   └── tests/                      # Automated test suite (26 tests)
├── frontend/
│   ├── index.html                  # Responsive Single-Page Application shell
│   ├── css/styles.css              # Custom styling & radar animations
│   └── js/
│       ├── app.js                  # Main client router
│       ├── i18n.js                 # Bilingual translation engine (EN & HI)
│       ├── store.js                # Ephemeral session state
│       ├── api.js                  # API client with fallback handling
│       ├── components/             # Navbar, sidebar, intervention modals, toasts
│       └── pages/                  # 9 individual page modules
├── data/                           # Curated sample messages and test fixtures
├── docs/                           # Architecture and test documentation
├── run.py                          # Unified one-command application launcher
├── pytest.ini                      # Test runner configuration
└── LICENSE                         # MIT License
```

---

## Quickstart

### Prerequisites
- Python 3.11 or newer

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aatikaparveen36-cpu/hackindia-ai-cybertech-hackathon-2026-ctrlfreaks.git
   cd hackindia-ai-cybertech-hackathon-2026-ctrlfreaks
   ```

2. **Install dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Run the application:**
   ```bash
   python run.py
   ```

4. **Open in browser:**
   - Web App: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - Interactive API Docs: [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)

---

## Running Tests

ScamSaathi includes an automated test suite verifying detection accuracy, false-positive prevention on benign messages, PII redaction, and API endpoints:

```bash
python -m pytest -v
```

All 26 tests pass cleanly out of the box with zero external dependencies.

---

## Privacy Architecture

- **No Message Storage:** Text submitted for analysis is processed strictly in temporary server memory and is never saved to database or disk.
- **Sanitized Logs:** Private identifiers, passwords, phone numbers, and raw messages are excluded from server logs.
- **Client-Side Sanitization:** The Scam DNA export module cleanses all identifiable personal information directly before generating graphics or text snippets.

---

## Team

**Team Ctrl+Freaks**  
Built for **HackIndia AI Cybertech Hackathon 2026**  
Licensed under the [MIT License](LICENSE).
