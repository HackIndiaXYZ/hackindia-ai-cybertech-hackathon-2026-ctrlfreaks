// ScamSaathi Comprehensive Bilingual Dictionary (English & Hindi)

export const translations = {
  en: {
    app_name: "ScamSaathi",
    tagline: "Pause. Verify. Protect.",
    team: "CTRL+FREAKS",
    nav_dashboard: "Dashboard",
    nav_analyzer: "Message Analyzer",
    nav_safelink: "SafeLink Protection",
    nav_scamdna: "Scam DNA Fingerprint",
    nav_honeyshield: "HoneyShield Lab",
    nav_safetycenter: "Safety Center",
    nav_contacts: "Trusted Contacts & SOS",
    nav_privacy: "Privacy Center",
    nav_settings: "Settings",

    // Dashboard
    dash_welcome_title: "Pause. Verify. Protect.",
    dash_welcome_sub: "Your privacy-first cybersecurity companion against online scams, digital arrest coercion, and deceptive links.",
    dash_quick_check_title: "Check Before You Trust",
    dash_quick_check_sub: "Paste any suspicious SMS, WhatsApp message, email, or URL for instant explainable risk evaluation.",
    dash_quick_analyze_btn: "Analyze Message",
    dash_quick_safelink_btn: "Check URL",
    dash_stat_analyses: "Analyses This Session",
    dash_stat_threats: "Pressure Tactics Flagged",
    dash_stat_honeyshield: "HoneyShield Lessons Completed",
    dash_tip_title: "Cyber Safety Tip of the Day",
    dash_tip_body: "Legitimate organizations and banks will never demand decisions within minutes. Whenever you feel rushed, that artificial urgency is the primary indicator of social engineering.",
    dash_recent_activity: "Recent Session Inspections",
    dash_no_activity: "No analyses performed yet in this session. Your activity is kept private and never saved to a remote server.",

    // Message Analyzer
    analyzer_title: "Scam Message Analyzer",
    analyzer_sub: "Detect coercion tactics, credential harvesting patterns, and artificial urgency with transparent heuristic explanations.",
    analyzer_tab_sms: "SMS / Text",
    analyzer_tab_whatsapp: "WhatsApp",
    analyzer_tab_email: "Email Text",
    analyzer_tab_transcript: "Call Transcript",
    analyzer_input_placeholder: "Paste the suspicious message content here...",
    analyzer_sample_label: "Try a preloaded test case:",
    analyzer_btn_analyze: "Analyze Message",
    analyzer_btn_analyzing: "Analyzing Patterns...",
    analyzer_btn_clear: "Clear Input",
    analyzer_risk_title: "Risk Assessment",
    analyzer_tactics_title: "Psychological Manipulation Decoder",
    analyzer_tactics_sub: "Understand the psychological levers being used against you, not just a score.",
    analyzer_evidence_title: "Detected Warning Signs & Exact Phrases",
    analyzer_actions_title: "Recommended Immediate Protective Actions",
    analyzer_btn_scamdna: "Generate Scam DNA Fingerprint",
    analyzer_btn_another: "Analyze Another Message",
    analyzer_limitations_title: "Model Transparency & Limitations",

    // SafeLink
    safelink_title: "SafeLink Protection",
    safelink_sub: "Inspect suspicious links, domain spoofing, and IP-hosted traps before opening them in your browser.",
    safelink_placeholder: "Enter or paste website link (e.g. http://sbi-verification.xyz/login)...",
    safelink_btn_check: "Check Link Safety",
    safelink_btn_checking: "Inspecting URL Structure...",
    safelink_safe_preview_title: "Safe Interstitial Preview",
    safelink_preview_notice: "For your safety, ScamSaathi never automatically visits external sites or executes third-party scripts.",
    safelink_destination_domain: "Target Host / Domain",
    safelink_protocol: "Connection Protocol",
    safelink_warning_signs: "Security Check Flags",
    safelink_btn_external: "I Understand the Risks — Open Destination",

    // Scam DNA
    dna_title: "Scam DNA — Understand the Pattern, Not the Person",
    dna_sub: "A privacy-sanitized visual representation of the psychological tactics identified in your communication.",
    dna_radar_title: "Tactic Dimension Vector",
    dna_summary_title: "Structural Pattern Analysis",
    dna_rules_title: "Three Golden Counter-Rules",
    dna_btn_download_png: "Download Fingerprint Card (PNG)",
    dna_btn_copy_text: "Copy Sanitized Summary",
    dna_privacy_badge: "100% PII Stripped: Phone numbers, emails, URLs, and personal names are sanitized before export.",

    // HoneyShield
    honey_title: "HoneyShield Simulation Lab",
    honey_sub: "Train your cyber intuition through realistic fictional scam scenarios before encountering them in real life.",
    honey_score_label: "Session Defense Score",
    honey_completed_label: "Scenarios Completed",
    honey_btn_reset: "Reset Simulation Progress",
    honey_scenario_sender: "Simulated Sender",
    honey_scenario_prompt: "What is your immediate response?",
    honey_feedback_title: "Educational Breakdown",
    honey_why_title: "Why this matters:",
    honey_safer_title: "Safer Alternative:",

    // Safety Center
    safety_title: "Safety Center & Emergency Protocols",
    safety_sub: "Immediate step-by-step guidance, official government cybercrime helplines, and evidence preservation standards.",
    safety_helpline_banner: "National Cybercrime Helpline (India): Dial 1930",
    safety_helpline_sub: "Operated by the Ministry of Home Affairs for immediate reporting of financial cyber fraud.",
    safety_portal_btn: "Official Cybercrime Portal (cybercrime.gov.in)",
    safety_checklist_title: "Immediate Action Checklist (Session-Tracked)",
    safety_evidence_title: "How to Safely Preserve Evidence",
    safety_evidence_p1: "Take clear screenshots showing the full sender ID or phone number.",
    safety_evidence_p2: "Save the bank transaction UTR / Reference ID if funds were transferred.",
    safety_evidence_p3: "Do not delete the chat or call log until official reporting is logged.",

    // Trusted Contacts & SOS
    contacts_title: "Trusted Contacts & Consent-Based SOS",
    contacts_sub: "Empower family members and senior citizens to request trusted verification support with explicit consent.",
    contacts_sos_btn: "Trigger Safety SOS Alert",
    contacts_list_title: "Configured Trusted Contacts",
    contacts_add_btn: "+ Add Trusted Contact",
    contacts_name: "Contact Name",
    contacts_relation: "Relationship",
    contacts_phone: "Phone Number",
    contacts_email: "Email Address",
    contacts_save_btn: "Save Contact",
    contacts_empty: "No trusted contacts configured. Add family or peers who can help verify suspicious messages.",
    contacts_modal_sos_title: "Confirm Emergency SOS Alert",
    contacts_modal_sos_warning: "This will send a sanitized request for verification assistance to your chosen contacts. Your raw messages and personal banking details are NEVER sent.",
    contacts_modal_confirm_btn: "Yes, Dispatch SOS Alert",
    contacts_modal_cancel_btn: "Cancel",

    // Privacy Center
    privacy_title: "Privacy Center",
    privacy_sub: "Transparent disclosure of our zero-retention architecture, local heuristics, and privacy-first engineering.",
    privacy_card_retention: "Zero Message Retention",
    privacy_desc_retention: "Submitted message text and URLs are processed in transient server memory and are never persisted to a database or disk.",
    privacy_card_logging: "Sanitized Logging",
    privacy_desc_logging: "Application logs never record raw user messages, passwords, phone numbers, or recipient details.",
    privacy_card_local: "Deterministic Local Engine",
    privacy_desc_local: "Detection heuristics run locally without mandatory external AI dependencies or third-party telemetry.",
    privacy_btn_clear_all: "Clear Current Analysis & Memory",

    // Settings
    settings_title: "Settings & System Diagnostics",
    settings_sub: "Configure language, demo modes, and inspect underlying security provider status.",
    settings_lang_label: "Application Language",
    settings_demo_mode: "Demo / Simulation Mode",
    settings_demo_desc: "Simulates SMS delivery and external APIs safely without requiring paid developer keys.",
    settings_system_status: "Provider Diagnostic Checklist",
    settings_ai_status: "AI Contextual Engine",
    settings_url_intel_status: "Threat Intelligence Engine",
    settings_sms_status: "SMS Delivery Provider",

    // Common / Notifications
    common_loading: "Processing...",
    common_copied: "Copied to clipboard successfully!",
    common_cleared: "Current session data cleared safely.",
    common_error: "An error occurred. Please try again.",
    common_close: "Close"
  },

  hi: {
    app_name: "स्कैमसाथी (ScamSaathi)",
    tagline: "रुकें। परखें। सुरक्षित रहें।",
    team: "CTRL+FREAKS",
    nav_dashboard: "डैशबोर्ड",
    nav_analyzer: "संदेश विश्लेषक",
    nav_safelink: "सेफ़लिंक सुरक्षा",
    nav_scamdna: "स्कैम डीएनए फिंगरप्रिंट",
    nav_honeyshield: "हनीशील्ड लैब",
    nav_safetycenter: "सुरक्षा केंद्र",
    nav_contacts: "विश्वसनीय संपर्क व SOS",
    nav_privacy: "गोपनीयता केंद्र",
    nav_settings: "सेटिंग्स",

    // Dashboard
    dash_welcome_title: "रुकें। परखें। सुरक्षित रहें।",
    dash_welcome_sub: "ऑनलाइन धोखाधड़ी, डिजिटल अरेस्ट के दबाव और फर्जी लिंक से बचाव के लिए आपका गोपनीयता-सुरक्षित साथी।",
    dash_quick_check_title: "विश्वास करने से पहले जांचें",
    dash_quick_check_sub: "किसी भी संदिग्ध एसएमएस, व्हाट्सएप संदेश या लिंक को तुरंत जांचने के लिए यहाँ पेस्ट करें।",
    dash_quick_analyze_btn: "संदेश की जांच करें",
    dash_quick_safelink_btn: "लिंक जांचें",
    dash_stat_analyses: "इस सत्र में की गई जांच",
    dash_stat_threats: "पहचाने गए मनोवैज्ञानिक दबाव",
    dash_stat_honeyshield: "पूर्ण किए गए हनीशील्ड पाठ",
    dash_tip_title: "आज का साइबर सुरक्षा सुझाव",
    dash_tip_body: "कोई भी वास्तविक बैंक या सरकारी संस्था मिनटों में निर्णय लेने का दबाव नहीं बनाती। जब भी कोई जल्दबाजी करे, वही साइबर ठगी का सबसे पहला संकेत है।",
    dash_recent_activity: "सत्र की हालिया गतिविधियां",
    dash_no_activity: "इस सत्र में अभी तक कोई जांच नहीं की गई है। आपका डेटा किसी भी रिमोट सर्वर पर सुरक्षित नहीं रखा जाता।",

    // Message Analyzer
    analyzer_title: "संदेश विश्लेषक (Message Analyzer)",
    analyzer_sub: "मनोवैज्ञानिक दबाव, डेटा चोरी के प्रयास और बनावटी जल्दबाजी को पारदर्शी विश्लेषण के साथ समझें।",
    analyzer_tab_sms: "एसएमएस / टेक्स्ट",
    analyzer_tab_whatsapp: "व्हाट्सएप",
    analyzer_tab_email: "ईमेल संदेश",
    analyzer_tab_transcript: "कॉल विवरण",
    analyzer_input_placeholder: "संदिग्ध संदेश यहाँ पेस्ट करें...",
    analyzer_sample_label: "उदाहरण देखें:",
    analyzer_btn_analyze: "संदेश जांचें",
    analyzer_btn_analyzing: "विश्लेषण जारी है...",
    analyzer_btn_clear: "साफ करें",
    analyzer_risk_title: "जोखिम मूल्यांकन",
    analyzer_tactics_title: "मनोवैज्ञानिक छल डिकोडर (Tactics Decoder)",
    analyzer_tactics_sub: "केवल स्कोर ही नहीं, बल्कि आपके विरुद्ध इस्तेमाल की जा रही दबाव तकनीकों को भी समझें।",
    analyzer_evidence_title: "पहचाने गए चेतावनी संकेत और संदिग्ध वाक्य",
    analyzer_actions_title: "तत्काल आवश्यक सुरक्षा कदम",
    analyzer_btn_scamdna: "स्कैम डीएनए फिंगरप्रिंट बनाएं",
    analyzer_btn_another: "अन्य संदेश जांचें",
    analyzer_limitations_title: "मॉडल पारदर्शिता और सीमाएं",

    // SafeLink
    safelink_title: "सेफ़लिंक सुरक्षा (SafeLink Protection)",
    safelink_sub: "ब्राउज़र में खोलने से पहले संदिग्ध लिंक, फर्जी डोमेन और आईपी आधारित जाल की जांच करें।",
    safelink_placeholder: "वेबसाइट लिंक यहाँ दर्ज करें (उदा. http://sbi-verification.xyz/login)...",
    safelink_btn_check: "लिंक की जांच करें",
    safelink_btn_checking: "लिंक की संरचना जांची जा रही है...",
    safelink_safe_preview_title: "सुरक्षित पूर्वावलोकन (Safe Interstitial)",
    safelink_preview_notice: "आपकी सुरक्षा के लिए स्कैमसाथी कभी भी स्वचालित रूप से बाहरी वेबसाइट नहीं खोलता।",
    safelink_destination_domain: "लक्षित डोमेन",
    safelink_protocol: "कनेक्शन प्रोटोकॉल",
    safelink_warning_signs: "सुरक्षा जांच परिणाम",
    safelink_btn_external: "मैं जोखिम समझता हूँ — वेबसाइट पर जाएं",

    // Scam DNA
    dna_title: "स्कैम डीएनए — पैटर्न समझें, व्यक्ति नहीं",
    dna_sub: "संदेश में उपयोग किए गए मनोवैज्ञानिक दबाव का गोपनीयता-सुरक्षित दृश्य फिंगरप्रिंट।",
    dna_radar_title: "दबाव रणनीति आयाम (Radar Vector)",
    dna_summary_title: "पैटर्न विश्लेषण सारांश",
    dna_rules_title: "तीन स्वर्णिम सुरक्षा नियम",
    dna_btn_download_png: "फिंगरप्रिंट कार्ड डाउनलोड करें (PNG)",
    dna_btn_copy_text: "सारांश कॉपी करें",
    dna_privacy_badge: "100% व्यक्तिगत डेटा मुक्त: फोन नंबर, ईमेल, यूआरएल और नाम निर्यात से पहले हटा दिए जाते हैं।",

    // HoneyShield
    honey_title: "हनीशील्ड सिमुलेशन लैब",
    honey_sub: "वास्तविक साइबर ठगी से सामना होने से पहले काल्पनिक परिदृश्यों से सुरक्षित प्रतिक्रिया का अभ्यास करें।",
    honey_score_label: "सत्र सुरक्षा स्कोर",
    honey_completed_label: "पूर्ण परिदृश्य",
    honey_btn_reset: "प्रगति रीसेट करें",
    honey_scenario_sender: "काल्पनिक प्रेषक",
    honey_scenario_prompt: "आपकी तत्काल प्रतिक्रिया क्या होगी?",
    honey_feedback_title: "शैक्षणिक विश्लेषण",
    honey_why_title: "यह क्यों महत्वपूर्ण है:",
    honey_safer_title: "अधिक सुरक्षित विकल्प:",

    // Safety Center
    safety_title: "सुरक्षा केंद्र और आपातकालीन कदम",
    safety_sub: "चरणबद्ध मार्गदर्शन, राष्ट्रीय साइबर हेल्पलाइन और साक्ष्य सुरक्षित रखने के आधिकारिक नियम।",
    safety_helpline_banner: "राष्ट्रीय साइबर अपराध हेल्पलाइन (भारत): 1930 डायल करें",
    safety_helpline_sub: "वित्तीय साइबर धोखाधड़ी की तत्काल रिपोर्टिंग के लिए गृह मंत्रालय द्वारा संचालित।",
    safety_portal_btn: "आधिकारिक साइबर अपराध पोर्टल (cybercrime.gov.in)",
    safety_checklist_title: "तत्काल कार्रवाई चेकलिस्ट (सत्र में सुरक्षित)",
    safety_evidence_title: "साक्ष्य को सुरक्षित रखने के नियम",
    safety_evidence_p1: "संदेश भेजने वाले का नंबर या आईडी स्पष्ट दिखने वाला स्क्रीनशॉट लें।",
    safety_evidence_p2: "यदि पैसे भेजे गए हैं, तो बैंक ट्रांजैक्शन यूटीआर (UTR) नंबर संभाल कर रखें।",
    safety_evidence_p3: "आधिकारिक शिकायत दर्ज होने तक चैट या कॉल रिकॉर्ड को डिलीट न करें।",

    // Trusted Contacts & SOS
    contacts_title: "विश्वसनीय संपर्क और आपातकालीन SOS",
    contacts_sub: "वरिष्ठ नागरिकों और परिजनों को संदिग्ध संदेशों की पुष्टि के लिए एक क्लिक में सहायता मांगने की सुविधा।",
    contacts_sos_btn: "सुरक्षा SOS अलर्ट भेजें",
    contacts_list_title: "आपके विश्वसनीय संपर्क",
    contacts_add_btn: "+ नया संपर्क जोड़ें",
    contacts_name: "संपर्क का नाम",
    contacts_relation: "संबंध",
    contacts_phone: "फोन नंबर",
    contacts_email: "ईमेल पता",
    contacts_save_btn: "संपर्क सहेजें",
    contacts_empty: "कोई संपर्क नहीं जोड़ा गया है। कृपया परिवार के सदस्यों को जोड़ें जो संदिग्ध संदेशों की जांच में सहायता कर सकें।",
    contacts_modal_sos_title: "आपातकालीन SOS अलर्ट की पुष्टि करें",
    contacts_modal_sos_warning: "यह आपके संपर्कों को सत्यापन सहायता के लिए एक सुरक्षित अनुरोध भेजेगा। आपका मूल संदेश या बैंक विवरण कभी नहीं भेजा जाता।",
    contacts_modal_confirm_btn: "हाँ, SOS अलर्ट भेजें",
    contacts_modal_cancel_btn: "रद्द करें",

    // Privacy Center
    privacy_title: "गोपनीयता केंद्र (Privacy Center)",
    privacy_sub: "हमारी शून्य-प्रतिधारण (Zero-Retention) तकनीक और गोपनीयता-केंद्रित वास्तुकला की पूरी पारदर्शिता।",
    privacy_card_retention: "शून्य संदेश प्रतिधारण",
    privacy_desc_retention: "आपके द्वारा दर्ज किए गए संदेश और लिंक केवल क्षणिक मेमोरी में जाँचे जाते हैं और डेटाबेस में कभी सहेजे नहीं जाते।",
    privacy_card_logging: "सुरक्षित लॉगिंग नीति",
    privacy_desc_logging: "एप्लिकेशन लॉग्स में उपयोगकर्ताओं के संदेश, पासवर्ड या फोन नंबर कभी रिकॉर्ड नहीं होते।",
    privacy_card_local: "निश्चयात्मक स्थानीय इंजन",
    privacy_desc_local: "जांच का कार्य किसी अनिवार्य बाहरी एआई सेवा के बिना स्थानीय नियमों द्वारा किया जाता है।",
    privacy_btn_clear_all: "वर्तमान सत्र का डेटा मिटाएं",

    // Settings
    settings_title: "सेटिंग्स और सिस्टम स्थिति",
    settings_sub: "भाषा, डेमो मोड और सुरक्षा सेवा प्रदाताओं की स्थिति प्रबंधित करें।",
    settings_lang_label: "एप्लिकेशन भाषा",
    settings_demo_mode: "डेमो / सिमुलेशन मोड",
    settings_demo_desc: "बिना किसी सशुल्क एपीआई कुंजी के सुरक्षित रूप से सिमुलेटेड परीक्षण की अनुमति देता है।",
    settings_system_status: "प्रदाता नैदानिक सूची (Diagnostics)",
    settings_ai_status: "एआई प्रासंगिक इंजन",
    settings_url_intel_status: "थ्रेट इंटेलिजेंस इंजन",
    settings_sms_status: "एसएमएस डिलीवरी प्रदाता",

    // Common / Notifications
    common_loading: "प्रक्रिया जारी है...",
    common_copied: "क्लिपबोर्ड पर कॉपी किया गया!",
    common_cleared: "सत्र का डेटा सुरक्षित रूप से मिटा दिया गया।",
    common_error: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
    common_close: "बंद करें"
  }
};

let currentLanguage = localStorage.getItem("scamsaathi_lang") || "en";

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  if (lang === "en" || lang === "hi") {
    currentLanguage = lang;
    localStorage.setItem("scamsaathi_lang", lang);
    return true;
  }
  return false;
}

export function t(key) {
  const dict = translations[currentLanguage] || translations.en;
  return dict[key] || translations.en[key] || key;
}
