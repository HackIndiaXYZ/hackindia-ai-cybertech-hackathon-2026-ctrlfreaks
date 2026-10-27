import json
import urllib.request
import urllib.parse
from typing import Optional, Dict, Any, List
from ..config import settings
from .message_analyzer import analyze_message_content
from ..models.schemas import MessageAnalyzeResponse, PsychologicalTactic

def _call_groq_api(messages: List[Dict[str, str]], json_mode: bool = False) -> Optional[str]:
    """Calls Groq Free API using Llama-3.3-70b-versatile or Llama-3.1-8b-instant."""
    if not settings.groq_api_key:
        return None

    url = "https://api.groq.com/openai/v1/chat/completions"
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 800
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", f"Bearer {settings.groq_api_key}")
    req.add_header("Content-Type", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            res_json = json.loads(response.read().decode("utf-8"))
            return res_json["choices"][0]["message"]["content"]
    except Exception as e:
        # Fallback to smaller fast model if 70b has rate limit
        try:
            payload["model"] = "llama-3.1-8b-instant"
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(url, data=data, method="POST")
            req.add_header("Authorization", f"Bearer {settings.groq_api_key}")
            req.add_header("Content-Type", "application/json")
            with urllib.request.urlopen(req, timeout=10) as response:
                res_json = json.loads(response.read().decode("utf-8"))
                return res_json["choices"][0]["message"]["content"]
        except Exception:
            return None

def _call_gemini_api(prompt: str, json_mode: bool = False) -> Optional[str]:
    """Calls Google Gemini API (gemini-1.5-flash) using standard urllib."""
    if not settings.gemini_api_key:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.gemini_api_key}"
    payload: Dict[str, Any] = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 800
        }
    }
    if json_mode:
        payload["generationConfig"]["responseMimeType"] = "application/json"

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            res_json = json.loads(response.read().decode("utf-8"))
            candidates = res_json.get("candidates", [])
            if candidates:
                return candidates[0]["content"]["parts"][0]["text"]
            return None
    except Exception:
        return None

def _call_openai_api(messages: List[Dict[str, str]], json_mode: bool = False) -> Optional[str]:
    """Calls OpenAI API if key configured."""
    if not settings.openai_api_key:
        return None

    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": "gpt-4o-mini",
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 800
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", f"Bearer {settings.openai_api_key}")
    req.add_header("Content-Type", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            res_json = json.loads(response.read().decode("utf-8"))
            return res_json["choices"][0]["message"]["content"]
    except Exception:
        return None

def call_ai_completion(messages: List[Dict[str, str]], json_mode: bool = False) -> Optional[str]:
    """Attempts configured AI providers in order of preference (Groq -> Gemini -> OpenAI)."""
    # 1. Try Groq (Fastest free tier)
    if settings.groq_api_key:
        res = _call_groq_api(messages, json_mode)
        if res:
            return res

    # 2. Try Gemini
    if settings.gemini_api_key:
        prompt_text = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in messages])
        res = _call_gemini_api(prompt_text, json_mode)
        if res:
            return res

    # 3. Try OpenAI
    if settings.openai_api_key:
        res = _call_openai_api(messages, json_mode)
        if res:
            return res

    return None

def run_hybrid_message_analysis(text: str, language: str = "en") -> MessageAnalyzeResponse:
    """
    Performs explainable scam detection using local deterministic heuristics first.
    If external AI provider credentials (Groq / Gemini) are configured, augments
    with deep contextual reasoning and psychological manipulation decoding.
    """
    local_result = analyze_message_content(text, language)

    # If AI credentials exist, enrich with Deep AI Cognitive Engine
    if settings.has_ai_credentials:
        system_instruction = (
            "You are ScamSaathi Cognitive Cybersecurity Engine. Analyze this inbound message or link for cyber fraud, "
            "social engineering, coercive pressure, psychological manipulation tactics, and financial scam patterns. "
            f"The user prefers analysis in {'Hindi/Hinglish' if language == 'hi' else 'English'}. "
            "Return valid JSON matching this schema:\n"
            "{\n"
            '  "risk_score": integer between 0 and 100,\n'
            '  "risk_level": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",\n'
            '  "explanation": "clear 2-3 sentence explainable reasoning",\n'
            '  "detected_tactics": [{"name": "Tactic Name", "explanation": "Why this tactic was used"}],\n'
            '  "recommended_actions": ["Action 1", "Action 2", "Action 3"],\n'
            '  "warning_signs": ["Sign 1", "Sign 2"]\n'
            "}"
        )

        messages = [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": f"Message to inspect:\n'''\n{text}\n'''"}
        ]

        ai_raw = call_ai_completion(messages, json_mode=True)
        if ai_raw:
            try:
                ai_data = json.loads(ai_raw)
                ai_score = int(ai_data.get("risk_score", 0))
                
                # Take highest score between AI and local forensics (safety-first principle)
                if ai_score > local_result.risk_score:
                    local_result.risk_score = min(100, max(ai_score, local_result.risk_score))
                    local_result.risk_level = ai_data.get("risk_level", local_result.risk_level)

                if ai_data.get("explanation"):
                    local_result.explanation = ai_data["explanation"]

                if ai_data.get("recommended_actions"):
                    local_result.recommended_actions = ai_data["recommended_actions"]

                if ai_data.get("warning_signs"):
                    for sign in ai_data["warning_signs"]:
                        if sign not in local_result.warning_signs:
                            local_result.warning_signs.append(sign)

                # Append any new tactics AI detected
                for tac in ai_data.get("detected_tactics", []):
                    tac_name = tac.get("name", "")
                    if tac_name and not any(t.name.lower() == tac_name.lower() for t in local_result.psychological_tactics):
                        local_result.psychological_tactics.append(PsychologicalTactic(
                            id=f"ai_{len(local_result.psychological_tactics)+1}",
                            name=tac_name,
                            explanation=tac.get("explanation", ""),
                            why_effective="Leverages contextual social engineering cues identified by deep cognitive reasoning.",
                            countermeasure="Pause, independently verify through official channels, and never send money or credentials.",
                            severity="high",
                            detected_in_message=True,
                            matched_phrases=[]
                        ))

                local_result.analysis_method = f"Deep Cognitive AI ({settings.active_ai_provider}) + Deterministic Forensics"
                return local_result
            except Exception:
                pass

        local_result.analysis_method = f"Deterministic Forensics (AI Provider Configured: {settings.active_ai_provider})"
    else:
        local_result.analysis_method = "Deterministic Local Forensics Engine (Free Local Mode)"

    return local_result

def run_ai_chat_response(query: str, history: List[Dict[str, str]] = None, language: str = "en") -> str:
    """Conversational CyberGuard AI Assistant."""
    is_hi = language == "hi"

    system_prompt = (
        "You are 'Saathi AI', an expert cybersecurity and anti-fraud assistant created for ScamSaathi. "
        "Your goal is to protect citizens from scams, phishing links, digital arrest extortion, fake bank KYC threats, "
        "electricity bill disconnection SMS, APK malware, and UPI/money fraud. "
        "Be concise, direct, empathetic, and highly protective. "
        "Always advise NEVER to share OTP/UPI PIN, never send money to unknown callers, and never click suspicious links. "
        "If financial fraud has already occurred, instruct the user to immediately dial 1930 (National Cybercrime Helpline) and file a complaint on cybercrime.gov.in. "
        "Reply naturally in Hinglish or English based on how the user speaks."
    )

    # 1. If AI credentials exist, use live AI completion
    if settings.has_ai_credentials:
        messages = [{"role": "system", "content": system_prompt}]
        if history:
            messages.extend(history[-6:])  # retain recent context
        messages.append({"role": "user", "content": query})

        ai_reply = call_ai_completion(messages, json_mode=False)
        if ai_reply and ai_reply.strip():
            return ai_reply.strip()

    # 2. High-Quality Deterministic Expert Fallback (when no API key or offline)
    q = query.lower()
    
    if any(k in q for k in ["1000", "500", "paisa", "paise", "money", "send me", "transfer", "link par", "qr"]):
        return (
            "🚨 **सावधानी: यह एक क्लासिक फाइनेंशियल स्कैम हो सकता है!**\n\n"
            "1. किसी भी अनजान व्यक्ति या लिंक पर **पैसे ट्रांसफर न करें**।\n"
            "2. पैसे 'प्राप्त' (receive) करने के लिए कभी **UPI PIN** नहीं डालना पड़ता। अगर कोई कहे कि 'पैसे लेने के लिए पिन डालो या क्यूआर स्कैन करो', तो वह 100% फ्रॉड है।\n"
            "3. अगर लिंक पर क्लिक करने को कहा गया है, तो उसे हमारे **SafeLink Protection** टूल में डालकर पहले डोमेन की सुरक्षा जांचें।"
            if is_hi or "kya" in q or "hai" in q else
            "🚨 **WARNING: This matches an unsolicited financial extraction vector!**\n\n"
            "1. **Never transfer money or scan QR codes** sent by unverified contacts or unfamiliar links.\n"
            "2. You **NEVER need to enter your UPI PIN** to receive payments. Anyone asking you to enter PIN to get funds is attempting fraud.\n"
            "3. Inspect the link safely using ScamSaathi's **SafeLink Protection** tool before clicking."
        )

    if any(k in q for k in ["kyc", "bank", "account", "block", "freeze", "sbi", "hdfc", "pan"]):
        return (
            "⚠️ **बैंक KYC व खाता ब्लॉक की धमकी:**\n\n"
            "• कोई भी बैंक एसएमएस या व्हाट्सएप पर खाता बंद करने की धमकी देकर लिंक पर तुरंत क्लिक करने को नहीं कहता।\n"
            "• मैसेज में दिए गए फोन नंबर पर कभी कॉल न करें।\n"
            "• सीधे अपनी बैंक शाखा जाएं या बैंक की आधिकारिक वेबसाइट पर दिए कस्टमर केयर नंबर पर संपर्क करें।"
        )

    if any(k in q for k in ["digital arrest", "police", "cbi", "arrest", "customs", "parcel"]):
        return (
            "🛑 **डिजिटल अरेस्ट (Digital Arrest) फ्रॉड अलर्ट:**\n\n"
            "• भारत में कानूनन **'डिजिटल अरेस्ट' जैसी कोई व्यवस्था नहीं है**।\n"
            "• पुलिस, सीबीआई या कस्टम्स कभी वीडियो कॉल (WhatsApp/Skype) पर किसी को गिरफ्तार नहीं करते और न ही 'वेरिफिकेशन' के नाम पर पैसे मांगते हैं।\n"
            "• तुरंत वीडियो कॉल काट दें, घबराएं नहीं और **1930** पर कॉल करके रिपोर्ट करें।"
        )

    if any(k in q for k in ["1930", "helpline", "complaint", "fraud hua", "paise kat", "cybercrime"]):
        return (
            "📞 **राष्ट्रीय साइबर अपराध हेल्पलाइन (1930):**\n\n"
            "1. अगर आपके साथ वित्तीय धोखाधड़ी हुई है, तो **तुरंत 1930** पर कॉल करें (गोल्डन ऑवर में बैंक ट्रांसफर फ्रीज हो सकता है)।\n"
            "2. ट्रांजेक्शन का UTR नंबर, बैंक खाता संख्या और स्क्रीनशॉट संभाल कर रखें।\n"
            "3. आधिकारिक पोर्टल **https://cybercrime.gov.in** पर जाकर औपचारिक शिकायत दर्ज करें।"
        )

    # General fallback
    return (
        "नमस्ते! मैं आपका **Saathi AI** सुरक्षा साथी हूँ।\n\n"
        "आप किसी भी संदिग्ध कॉल, मैसेज (जैसे बैंक KYC, बिजली बिल, लॉटरी, डिजिटल अरेस्ट) या लिंक के बारे में मुझसे पूछ सकते हैं।\n"
        "💡 **गोल्डन रूल:** कभी भी किसी के साथ OTP, UPI PIN या अनचाहे लिंक पर पैसे न भेजें!"
        if is_hi or "kya" in q or "batao" in q else
        "Hello! I am **Saathi AI**, your cybersecurity companion.\n\n"
        "You can ask me about suspicious messages, fake KYC calls, digital arrest extortion, or unverified links.\n"
        "💡 **Golden Rule:** Never share OTPs, never enter UPI PIN to receive money, and never install unverified APK files."
    )
