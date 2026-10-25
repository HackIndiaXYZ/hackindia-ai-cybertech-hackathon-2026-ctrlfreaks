import re
from typing import List, Dict, Any, Tuple
from ..models.schemas import MessageAnalyzeResponse, PsychologicalTactic, Indicator

# Pattern definitions for psychological tactics & scam indicators
# Supports English and Hindi/Hinglish vocabulary common in cyber fraud

PATTERNS = {
    "urgency": {
        "id": "tactic_urgency",
        "name_en": "Urgency & Time Pressure",
        "name_hi": "जल्दबाजी और समय का दबाव (Urgency)",
        "patterns": [
            r"\b(urgent|urgently|immediately|immediate|hurry|action required|within \d+ (minutes|hours|mins)|expires? (today|soon|in \d+)|last chance|deadline|right now|at once|tonight)\b",
            r"\b(turant|jaldi|aaj hi|aaj raat|24 ghante|10 minute|abhi karo|antim din|samay seema)\b",
            r"(तत्काल|तुरंत|जल्दी|आज ही|आज रात|24 घंटे|समय समाप्त|\d+\s*मिनट)"
        ],
        "explanation_en": "Creates artificial scarcity of time to prevent you from calmly thinking or verifying the claim.",
        "explanation_hi": "यह आपको शांति से सोचने या पुष्टि करने से रोकने के लिए समय का बनावटी दबाव बनाता है।",
        "why_effective_en": "Under time pressure, the brain's emotional center overrides rational analytical decision-making.",
        "why_effective_hi": "दबाव में दिमाग तर्कसंगत जांच करने के बजाय घबराहट में निर्णय लेता है।",
        "counter_en": "Pause completely. Legitimate organizations and banks will never demand decisions within minutes.",
        "counter_hi": "पूरी तरह रुकें। कोई भी बैंक या संस्था मिनटों में कार्रवाई करने की मांग नहीं करती।",
        "severity": "medium",
        "weight": 20
    },
    "fear_threat": {
        "id": "tactic_fear",
        "name_en": "Fear & Coercion (Intimidation)",
        "name_hi": "डर और धमकी (Fear & Intimidation)",
        "patterns": [
            r"\b(blocked|suspended|terminated|deactivated|disconnected|disconnect|legal action|court|arrest|warrant|penalty|fine|lawsuit|jail|frozen|investigation)\b",
            r"\b(bijli kat|khata band|kat jayegi|police case|giraftari|kanooni karwayi|jurmana|freeze)\b",
            r"(बिजली कट|खाता बंद|ब्लॉक|निलंबित|कानूनी कार्रवाई|गिरफ्तारी|जुर्माना|अरेस्ट|जेल|कार्रवाई)"
        ],
        "explanation_en": "Uses threats of financial loss, legal penalties, or utility disconnection to cause panic.",
        "explanation_hi": "घबराहट पैदा करने के लिए कानूनी कार्रवाई, बिजली कटने या खाता बंद होने की धमकी दी जाती है।",
        "why_effective_en": "Fear triggers a defensive panic state where people comply just to avoid the perceived negative consequence.",
        "why_effective_hi": "डर के कारण व्यक्ति नुकसान से बचने के लिए बिना सोचे-समझे सामने वाले की बात मान लेता है।",
        "counter_en": "Do not panic. Official notices are delivered via formal postal or registered channels, not threatening SMS.",
        "counter_hi": "घबराएं नहीं। आधिकारिक नोटिस पंजीकृत डाक या बैंक ऐप में आते हैं, धमकी भरे एसएमएस से नहीं।",
        "severity": "high",
        "weight": 25
    },
    "false_authority": {
        "id": "tactic_authority",
        "name_en": "False Authority (Impersonation)",
        "name_hi": "झूठा अधिकार / फर्जी पहचान (False Authority)",
        "patterns": [
            r"\b(rbi|sbi|hdfc|icici|axis|punjab national|trai|cbi|police|cyber crime branch|police officer|customs officer|income tax department|head office|government officer|bank manager|discom officer|electricity officer)\b",
            r"\b(trai verification|customs clearance|court order|ebill head office|discom officer)\b",
            r"(आरबीआई|एसबीआई|सीबीआई|साइबर क्राइम|पुलिस|पुलिस अधिकारी|बैंक प्रबंधक|आयकर विभाग|बिजली अधिकारी)"
        ],
        "explanation_en": "Pretends to be a high-ranking official or trusted institution to command automatic obedience.",
        "explanation_hi": "विश्वास और आज्ञाकारिता हासिल करने के लिए बैंक, पुलिस या सरकारी अधिकारी होने का ढोंग किया जाता है।",
        "why_effective_en": "Society conditions us to respect and obey authority figures without questioning their identity.",
        "why_effective_hi": "हम आमतौर पर वर्दी या पद का सम्मान करते हैं, ठग इसी का दुरुपयोग करते हैं।",
        "counter_en": "Verify independently. Look up official contact details on the organization's official website, not numbers provided in the message.",
        "counter_hi": "स्वतंत्र रूप से जांचें। संस्था की आधिकारिक वेबसाइट से नंबर लेकर सीधे संपर्क करें।",
        "severity": "high",
        "weight": 22
    },
    "secrecy_isolation": {
        "id": "tactic_secrecy",
        "name_en": "Secrecy & Isolation",
        "name_hi": "गोपनीयता और अलगाव (Secrecy & Isolation)",
        "patterns": [
            r"\b(do not tell|keep (this|it) confidential|private investigation|do not disconnect|stay on call|don't inform|do not share with family|secret)\b",
            r"\b(kisi ko mat batana|phone mat katna|gupt|call par bane rahein|kisi se baat mat karo)\b",
            r"(किसी को मत बताना|फोन मत काटना|गोपनीय|कॉल डिस्कनेक्ट मत करो|गुप्त)"
        ],
        "explanation_en": "Commands you to keep the matter secret or stay on the line to prevent family or friends from intervening.",
        "explanation_hi": "आपको किसी से बात न करने या कॉल पर बने रहने को कहा जाता है ताकि कोई आपकी मदद न कर सके।",
        "why_effective_en": "Cutting off access to a second opinion leaves the victim entirely reliant on the scammer's deceptive reality.",
        "why_effective_hi": "दूसरे व्यक्ति की राय न मिलने से पीड़ित केवल ठग की बातों पर निर्भर हो जाता है।",
        "counter_en": "Always discuss suspicious situations with a trusted family member, friend, or cybersecurity professional before acting.",
        "counter_hi": "किसी भी वित्तीय या संदिग्ध कदम से पहले अपने किसी विश्वसनीय परिजन या मित्र से अवश्य चर्चा करें।",
        "severity": "high",
        "weight": 22
    },
    "reward_greed": {
        "id": "tactic_reward",
        "name_en": "Reward & Enticement (False Gratification)",
        "name_hi": "इनाम और लालच (Reward & Greed)",
        "patterns": [
            r"\b(congratulations|won|lottery|prize|cashback|bonus|claim now|reward points?|free gift|lucky winner|guaranteed returns?|part-time job|earn \d+ per day|daily income)\b",
            r"\b(badhai ho|inaam|jeeta hai|crorepati|lucky draw|paisa kamayein|ghar baithe)\b",
            r"(बधाई|लॉटरी|इनाम|कैशबैक|रिवॉर्ड|लकी ड्रा|घर बैठे पैसे कमाएं|विजेता)"
        ],
        "explanation_en": "Offers unexpected money, prizes, or high-paying easy tasks to trigger excitement and lower critical scrutiny.",
        "explanation_hi": "अप्रत्याशित पैसे, नौकरी या उपहार का लालच देकर आपकी सतर्कता को कम करने का प्रयास।",
        "why_effective_en": "The thrill of sudden gain blinds people to obvious warning signs like requests for processing fees.",
        "why_effective_hi": "अचानक भारी लाभ की खुशी में लोग जोखिम या अग्रिम शुल्क की मांग पर ध्यान नहीं देते।",
        "counter_en": "Remember the golden rule: If you didn't buy a lottery ticket or apply for the contest, you cannot win. Legitimate prizes never ask for an upfront processing fee.",
        "counter_hi": "सुनहरा नियम याद रखें: अगर आपने लॉटरी नहीं खरीदी तो आप जीत नहीं सकते। वास्तविक पुरस्कार कभी अग्रिम शुल्क नहीं मांगते।",
        "severity": "medium",
        "weight": 20
    },
    "credential_harvesting": {
        "id": "tactic_credentials",
        "name_en": "Credential & Financial Extraction",
        "name_hi": "गोपनीय डेटा और वित्तीय दबाव (Credential Theft)",
        "patterns": [
            r"\b(otp|pin|upi pin|password|cvv|card details|net banking|send money|pay rs|transfer rs|processing fee|registration fee|refundable fee)\b",
            r"\b(otp share|pin dalein|paisa transfer|khata number|shulk jama karein)\b",
            r"(ओटीपी|पिन|यूपीआई पिन|पासवर्ड|सीवीवी|पैसे ट्रांसफर|शुल्क|ओटीपी बताएं)"
        ],
        "explanation_en": "Directly requests sensitive authentication credentials or money transfers.",
        "explanation_hi": "ओटीपी, यूपीआई पिन या सीधे पैसे ट्रांसफर करने की संवेदनशील मांग।",
        "why_effective_en": "Disguised as a verification or receiving step (e.g. 'Enter UPI PIN to receive payment').",
        "why_effective_hi": "अक्सर 'पैसे प्राप्त करने के लिए पिन डालें' जैसा झांसा दिया जाता है।",
        "counter_en": "NEVER share an OTP or enter your UPI PIN to receive money. UPI PIN is solely required to DEDUCT money from your account.",
        "counter_hi": "पैसे प्राप्त करने के लिए कभी यूपीआई पिन न डालें। पिन केवल पैसे भेजने के लिए होता है।",
        "severity": "critical",
        "weight": 32
    },
    "tech_deception": {
        "id": "tactic_tech",
        "name_en": "Technical Deception & Malicious Software",
        "name_hi": "तकनीकी धोखा और संदिग्ध ऍप (Technical Deception)",
        "patterns": [
            r"\b(\.apk|install (app|application|software)|download (app|apk|file)|anydesk|teamviewer|quicksupport|rustdesk|screen share|allow permissions?)\b",
            r"\b(apk file|app download|app install karein|screen share karein)\b",
            r"(एपीके|ऐप डाउनलोड|ऐप इनस्टॉल|स्क्रीन शेयर|\.apk)"
        ],
        "explanation_en": "Urges you to install side-loaded files (.apk) or remote access tools that allow scammers to control your device.",
        "explanation_hi": "संदिग्ध एपीके फ़ाइल या रिमोट स्क्रीन-शेयरिंग ऐप डाउनलोड करवाकर फोन का पूरा नियंत्रण हासिल करना।",
        "why_effective_en": "Victims believe they are following legitimate customer service support instructions.",
        "why_effective_hi": "पीड़ित समझता है कि वह तकनीकी सहायता ले रहा है, जबकि वह अपना फोन सौंप रहा होता है।",
        "counter_en": "Never install .apk files sent via WhatsApp or SMS. Never install screen-sharing apps on instructions from unknown callers.",
        "counter_hi": "व्हाट्सएप या मैसेज में आई किसी भी .apk फ़ाइल को इंस्टॉल न करें। किसी के कहने पर AnyDesk आदि न डालें।",
        "severity": "critical",
        "weight": 28
    }
}

URL_REGEX = re.compile(r"https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|xyz|top|live|info|in|co\.in|online|site|ru|cn|buzz)/[^\s]*", re.IGNORECASE)

def extract_urls(text: str) -> List[str]:
    found = URL_REGEX.findall(text)
    return list(dict.fromkeys(found))  # deduplicate preserving order

def analyze_message_content(text: str, language: str = "en") -> MessageAnalyzeResponse:
    lower_text = text.lower()
    
    detected_indicators: List[Indicator] = []
    psychological_tactics: List[PsychologicalTactic] = []
    detected_phrases: List[str] = []
    
    scoring_breakdown: Dict[str, Any] = {}
    total_score = 0
    
    # 1. Evaluate each tactic
    for category_key, tactic_info in PATTERNS.items():
        matched_category_phrases = []
        for pat in tactic_info["patterns"]:
            matches = re.finditer(pat, text, re.IGNORECASE)
            for m in matches:
                phrase = m.group(0).strip()
                if phrase and phrase.lower() not in [p.lower() for p in matched_category_phrases]:
                    matched_category_phrases.append(phrase)
        
        if matched_category_phrases:
            detected_phrases.extend(matched_category_phrases)
            category_points = tactic_info["weight"]
            
            # Subtle compounding for multiple distinct triggers in same category, capped
            if len(matched_category_phrases) > 1:
                category_points = min(int(category_points * 1.3), 35)
                
            total_score += category_points
            
            # Record indicator
            phrase_summary = ", ".join(f'"{p}"' for p in matched_category_phrases[:3])
            scoring_breakdown[category_key] = {
                "points": category_points,
                "matches": matched_category_phrases
            }
            
            exp_text = tactic_info["explanation_hi"] if language == "hi" else tactic_info["explanation_en"]
            name_text = tactic_info["name_hi"] if language == "hi" else tactic_info["name_en"]
            why_eff = tactic_info["why_effective_hi"] if language == "hi" else tactic_info["why_effective_en"]
            counter = tactic_info["counter_hi"] if language == "hi" else tactic_info["counter_en"]
            
            detected_indicators.append(Indicator(
                category=name_text,
                phrase=phrase_summary,
                explanation=exp_text,
                severity=tactic_info["severity"],
                points=category_points
            ))
            
            psychological_tactics.append(PsychologicalTactic(
                tactic_id=tactic_info["id"],
                name=name_text,
                detected_phrase=phrase_summary,
                explanation=exp_text,
                why_effective=why_eff,
                counter_action=counter
            ))

    # 2. Check for URLs
    found_urls = extract_urls(text)
    contains_url = len(found_urls) > 0
    if contains_url:
        url_points = 15
        total_score += url_points
        scoring_breakdown["suspicious_links"] = {
            "points": url_points,
            "urls": found_urls
        }
        url_exp = "संदेश में लिंक शामिल है। संदिग्ध लिंक अक्सर फ़िशिंग वेबसाइटों पर ले जाते हैं।" if language == "hi" else "Message contains external links. Cybercriminals use unfamiliar links to mimic legitimate services."
        detected_indicators.append(Indicator(
            category="Embedded Links" if language != "hi" else "शामिल लिंक (Embedded Links)",
            phrase=", ".join(found_urls[:2]),
            explanation=url_exp,
            severity="medium",
            points=url_points
        ))

    # 3. Apply synergy rules (e.g. Urgency + Credentials + Fear is almost always CRITICAL)
    has_urgency = "urgency" in scoring_breakdown
    has_fear = "fear_threat" in scoring_breakdown
    has_creds = "credential_harvesting" in scoring_breakdown
    has_tech = "tech_deception" in scoring_breakdown
    has_authority = "false_authority" in scoring_breakdown

    if has_urgency and (has_fear or has_creds):
        total_score += 10
        scoring_breakdown["synergy_urgency_coercion"] = 10
    if has_tech or (has_creds and contains_url):
        total_score += 10
        scoring_breakdown["synergy_technical_exploitation"] = 10

    # Cap score at 100
    risk_score = min(max(total_score, 0), 100)

    # Risk level categorization
    if risk_score >= 80:
        risk_level = "CRITICAL"
        confidence = "HIGH"
    elif risk_score >= 55:
        risk_level = "HIGH"
        confidence = "HIGH"
    elif risk_score >= 25:
        risk_level = "MEDIUM"
        confidence = "MODERATE"
    else:
        risk_level = "LOW"
        confidence = "HIGH" if len(text.split()) > 4 else "MODERATE"

    # Contextual Pause Intervention
    pause_intervention = (risk_score >= 55) or (has_urgency and has_fear) or has_creds
    pause_message = None
    if pause_intervention:
        if language == "hi":
            pause_message = "कृपया कुछ क्षण रुकें (Pause Before You Act)। जल्दबाजी में कोई भी कदम न उठाएं। किसी भी अनजान व्यक्ति के साथ ओटीपी या यूपीआई पिन कभी साझा न करें।"
        else:
            pause_message = "Pause for a moment before you act. You do not need to respond immediately. Legitimate institutions will never ask for your OTP, UPI PIN, or remote phone access."

    # Recommended Actions
    recommended_actions: List[str] = []
    if language == "hi":
        if risk_level in ["CRITICAL", "HIGH"]:
            recommended_actions.append("संदेश में दिए गए किसी भी लिंक पर क्लिक न करें और न ही कोई ऐप इंस्टॉल करें।")
            recommended_actions.append("अपनी बैंक शाखा या संबंधित संस्था के आधिकारिक नंबर पर खुद कॉल करके पुष्टि करें।")
            recommended_actions.append("किसी भी व्यक्ति को कॉल पर ओटीपी, पासवर्ड या यूपीआई पिन न बताएं।")
            recommended_actions.append("यदि वित्तीय धोखाधड़ी हुई है, तो तुरंत 1930 राष्ट्रीय साइबर हेल्पलाइन पर कॉल करें या cybercrime.gov.in पर रिपोर्ट करें।")
        elif risk_level == "MEDIUM":
            recommended_actions.append("प्रेषक की पहचान की स्वतंत्र रूप से पुष्टि करें।")
            recommended_actions.append("संदेश में दिए गए नंबरों के बजाय आधिकारिक ऐप या वेबसाइट का उपयोग करें।")
            recommended_actions.append("संदेह होने पर परिवार के किसी तकनीकी रूप से जागरूक सदस्य से परामर्श लें।")
        else:
            recommended_actions.append("इस संदेश में कोई स्पष्ट घोटाला नहीं दिखा, फिर भी व्यक्तिगत जानकारी साझा करते समय सावधानी बरतें।")
            recommended_actions.append("आधिकारिक लेनदेन के लिए हमेशा बैंक के आधिकारिक एप्लिकेशन का ही उपयोग करें।")
    else:
        if risk_level in ["CRITICAL", "HIGH"]:
            recommended_actions.append("Do not click any link or install any application mentioned in the message.")
            recommended_actions.append("Never share an OTP, password, or enter your UPI PIN on unverified screens.")
            recommended_actions.append("Contact the organization directly using their verified phone number from their official website.")
            recommended_actions.append("If financial loss occurred, immediately call the National Cybercrime Helpline 1930 or visit cybercrime.gov.in.")
        elif risk_level == "MEDIUM":
            recommended_actions.append("Verify the sender's identity independently before taking any requested action.")
            recommended_actions.append("Avoid calling phone numbers embedded in the message itself.")
            recommended_actions.append("Consult a trusted family member or peer before responding.")
        else:
            recommended_actions.append("No obvious manipulation patterns detected, but always verify before sharing credentials.")
            recommended_actions.append("Ensure you only access accounts via official verified applications.")

    # High level explanation
    if language == "hi":
        if risk_level == "CRITICAL":
            explanation = f"इस संदेश में अत्यंत उच्च जोखिम पाया गया है (स्कोर: {risk_score}/100)। इसमें गंभीर दबाव, भय अथवा संवेदनशील वित्तीय जानकारी/ऐप डाउनलोड के संकेत मिले हैं।"
        elif risk_level == "HIGH":
            explanation = f"इस संदेश में उच्च जोखिम के संकेत हैं (स्कोर: {risk_score}/100)। मनोवैज्ञानिक दबाव या अपुष्ट लिंक का उपयोग किया गया है।"
        elif risk_level == "MEDIUM":
            explanation = f"मध्यम स्तर का जोखिम देखा गया (स्कोर: {risk_score}/100)। इसमें कुछ संदिग्ध शब्द हैं, सावधानी से जांच आवश्यक है।"
        else:
            explanation = f"कम जोखिम देखा गया (स्कोर: {risk_score}/100)। ज्ञात साइबर धोखाधड़ी के प्रमुख पैटर्न इस संदेश में अनुपस्थित हैं।"
    else:
        if risk_level == "CRITICAL":
            explanation = f"Critical scam risk detected (Score: {risk_score}/100). The message exhibits high-severity coercion, credential harvesting, or unauthorized remote access patterns."
        elif risk_level == "HIGH":
            explanation = f"High scam probability (Score: {risk_score}/100). Indicators suggest artificial urgency, intimidation, or deceptive impersonation."
        elif risk_level == "MEDIUM":
            explanation = f"Moderate suspicion level (Score: {risk_score}/100). Ambiguous or mildly pressured language was detected. Independent verification advised."
        else:
            explanation = f"Low observed risk (Score: {risk_score}/100). No prominent fraud indicators were found in the examined text."

    limitations = (
        "सीमाएं: यह परिणाम ह्यूरिस्टिक और भाषा विश्लेषण पर आधारित है। एक परिष्कृत नया हमला इन ज्ञात कीवर्ड के बिना भी हो सकता है। कृपया अपने विवेक का उपयोग करें।"
        if language == "hi" else
        "Limitations: This score represents explainable heuristic analysis of observable patterns, not a statistical guarantee. Sophisticated zero-day scams or contextual pretexting may lack standard keywords. Always exercise independent caution."
    )

    return MessageAnalyzeResponse(
        risk_level=risk_level,
        risk_score=risk_score,
        confidence=confidence,
        detected_indicators=detected_indicators,
        psychological_tactics=psychological_tactics,
        detected_phrases=list(set(detected_phrases)),
        recommended_actions=recommended_actions,
        explanation=explanation,
        scoring_breakdown=scoring_breakdown,
        contains_url=contains_url,
        extracted_urls=found_urls,
        analysis_method="Explainable Heuristics & Behavioral Tactics Engine",
        limitations=limitations,
        pause_intervention=pause_intervention,
        pause_message=pause_message,
        language=language
    )
