# ScamSaathi — Architecture & Technical Specifications
**Team:** Ctrl+Freaks | **Hackathon:** HackIndia AI Cybertech Hackathon 2026

---

## 1. System Overview

```mermaid
flowchart TD
    User["User Client (Web Browser)"]
    
    subgraph Frontend ["Frontend (SPA / ES Modules)"]
        UI_Shell["Application Shell & Responsive Navigation"]
        I18N["Bilingual Engine (English & Hindi)"]
        Store["Ephemeral Session State Store"]
        API_Client["API Client with Offline Fallback"]
        
        subgraph Views ["Application Modules"]
            V_Dash["Dashboard"]
            V_Msg["Message Analyzer"]
            V_Link["SafeLink Protection"]
            V_DNA["Scam DNA Fingerprint"]
            V_Honey["HoneyShield Simulation Lab"]
            V_Safety["Safety Center (1930)"]
            V_SOS["Trusted Contacts & SOS"]
            V_Priv["Privacy Center"]
            V_Set["Settings & Diagnostics"]
        end
    end

    subgraph Backend ["Backend (FastAPI & Python 3.11+)"]
        MainApp["FastAPI Router & Security Middleware"]
        
        subgraph Services ["Core Detection & Processing Engines"]
            MsgEngine["Behavioral Tactics & Psychology Engine"]
            UrlEngine["SafeLink Anatomy & Heuristics"]
            DnaEngine["Scam DNA Vector Generator & PII Stripper"]
            HoneyEngine["Interactive Scenario Evaluator"]
            SosEngine["Consent-Based SOS Dispatcher"]
            AiEngine["Hybrid Engine with Local Fallback"]
        end
        
        subgraph Storage ["Privacy-Preserving Storage"]
            SQLite["SQLite DB (Trusted Contacts Only)"]
            RAM["Transient RAM (Zero Message Retention)"]
        end
    end

    User --> UI_Shell
    UI_Shell --> Views
    Views --> Store
    Views --> API_Client
    API_Client -->|REST API| MainApp
    MainApp --> Services
    Services --> Storage
```

---

## 2. Detection & Scoring Model

ScamSaathi implements an explainable multi-axis heuristic scoring engine:

### 2.1 Psychological Manipulation Axes
1. **Urgency & Time Pressure:** Detects artificial deadlines (`immediately`, `within 10 minutes`, `turant`, `aaj raat`).
2. **Fear & Coercion:** Detects threats of legal penalty, utility cuts, or arrest (`account blocked`, `electricity disconnected`, `warrant`, `khata band`).
3. **False Authority:** Detects impersonation of trusted authorities (`SBI`, `CBI`, `Cyber Crime`, `TRAI`, `Police`).
4. **Secrecy & Isolation:** Detects isolation commands (`keep confidential`, `stay on video call`, `kisi ko mat batana`).
5. **Reward & Enticement:** Identifies unsolicited lottery and task schemes (`KBC winner`, `part-time tasks`, `25 Lakhs`).
6. **Credential Theft:** Flags demands for OTPs, UPI PINs, or processing fees.
7. **Technical Deception:** Detects unauthorized APK installations (`.apk`, `AnyDesk`, `TeamViewer`).

### 2.2 Risk Categorization Thresholds
- **0–24 (LOW):** Routine reminders, verified business communication.
- **25–54 (MEDIUM):** Unverified links or mildly pressured language. Independent verification suggested.
- **55–79 (HIGH):** Prominent coercion, spoofed authority, or suspicious URL structure.
- **80–100 (CRITICAL):** Direct credential harvesting, threat of immediate disconnection, or malicious APK distribution.

### 2.3 Behavioral Interventions
When high urgency combined with fear or credential requests is detected, the **"Pause Before You Act"** modal interrupts the user's emotional state, delivering supportive, blame-free protective advice.

---

## 3. SafeLink URL Inspection

SafeLink inspects user-submitted URLs through progressive checks:
1. **URL Syntax Parsing:** Strict validation using `urllib.parse` to prevent malformed strings.
2. **Dangerous Schemes:** Flags `javascript:`, `data:`, and `file:` protocols.
3. **Transport Security:** Evaluates HTTP vs HTTPS encryption.
4. **Host Format:** Detects raw numerical IP hosts (e.g. `http://192.168.1.1/` or `http://185.220.101.5/`).
5. **Brand Spoofing & Lookalikes:** Evaluates keywords of popular Indian banks and payment portals (SBI, HDFC, Paytm, PhonePe, India Post).
6. **URL Shorteners:** Detects redirection masking (Bitly, TinyURL, is.gd, etc.).
7. **Top-Level Domains:** Inspects frequently abused disposable TLDs (`.xyz`, `.top`, `.buzz`, `.online`).
8. **Direct Binary / APK Targets:** Identifies `.apk` and `.exe` downloads.
9. **Safe Interstitial Preview:** Isolates untrusted URLs from immediate execution, providing domain verification before user navigation.

---

## 4. Scam DNA & PII Scrubbing

The **Scam DNA** module generates an 8-axis radar vector representing the anatomy of the scam.

Before any export (as PNG image or copyable text summary):
- Raw message text is stripped.
- Phone numbers (`+91 ...`, 10-digit integers) are replaced with `[PHONE REDACTED]`.
- Email addresses are scrubbed with `[EMAIL REDACTED]`.
- Destination URLs are sanitized with `[URL REMOVED]`.
- Authentication codes (OTPs, PINs) are scrubbed with `[CODE REDACTED]`.

---

## 5. Security & Privacy Controls

- **Zero-Message-Retention:** Analyzed message content is processed solely in volatile memory and never persisted to SQLite, log files, or disk.
- **Sanitized Logging:** Application logs do not output user messages or personal contacts.
- **No Third-Party Trackers:** Zero external telemetry, cookies, or marketing trackers.
- **Local Fallback:** When external APIs are unconfigured, ScamSaathi defaults to deterministic local heuristics and demo simulation.
