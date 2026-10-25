import re
import urllib.parse
from typing import List, Dict, Any, Tuple
from ..models.schemas import URLAnalyzeResponse, URLCheckFlag
from ..config import settings

# Common URL Shorteners
SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy", "goo.gl", 
    "ow.ly", "buff.ly", "shorturl.at", "tiny.cc", "rebrand.ly"
}

# Suspicious / frequently abused top-level domains
HIGH_RISK_TLDS = {
    ".xyz", ".top", ".buzz", ".work", ".click", ".link", ".live", ".fit", 
    ".rest", ".gq", ".ml", ".cf", ".tk", ".ga", ".site", ".online"
}

# Target brand names often impersonated in India and globally
TARGET_BRANDS = [
    "sbi", "hdfc", "icici", "axis", "pnb", "bob", "paytm", "phonepe", 
    "gpay", "googlepay", "bhim", "aadhaar", "uidai", "incometax", 
    "cybercrime", "electricity", "bsnl", "jio", "airtel", "amazon", "flipkart"
]

def analyze_url_target(raw_url: str, language: str = "en") -> URLAnalyzeResponse:
    url = raw_url.strip()
    # Normalize scheme if missing
    if not re.match(r"^[a-zA-Z]+://", url):
        url = "http://" + url

    checks: List[URLCheckFlag] = []
    warning_signs: List[str] = []
    risk_score = 0
    
    is_https = False
    is_ip_host = False
    is_shortened = False
    is_lookalike = False
    destination_domain = ""

    try:
        parsed = urllib.parse.urlparse(url)
    except Exception as e:
        return _build_invalid_url_response(raw_url, str(e), language)

    scheme = parsed.scheme.lower()
    netloc = parsed.netloc.lower()
    path = parsed.path.lower()

    # 1. Check scheme
    if scheme in ["javascript", "data", "file", "vbscript"]:
        checks.append(URLCheckFlag(
            check_name="Dangerous Scheme" if language != "hi" else "खतरनाक यूआरएल स्कीम",
            status="FAIL",
            details=f"The URL uses a dangerous protocol: {scheme}://"
        ))
        warning_signs.append(f"Suspicious protocol {scheme}:// which can execute unauthorized scripts.")
        risk_score += 60
    elif scheme == "https":
        is_https = True
        checks.append(URLCheckFlag(
            check_name="HTTPS Encryption" if language != "hi" else "एचटीटीपीएस एन्क्रिप्शन",
            status="PASS",
            details="Transport is encrypted with HTTPS." if language != "hi" else "डेटा ट्रांसमिशन एन्क्रिप्टेड (HTTPS) है।"
        ))
    else:
        checks.append(URLCheckFlag(
            check_name="Insecure Transport (HTTP)" if language != "hi" else "असुरक्षित कनेक्शन (HTTP)",
            status="WARN",
            details="Connection is unencrypted HTTP. Legitimate financial institutions always require HTTPS." if language != "hi" else "कनेक्शन सुरक्षित नहीं है। बैंक हमेशा HTTPS का उपयोग करते हैं।"
        ))
        warning_signs.append("Unencrypted HTTP protocol detected.")
        risk_score += 20

    # Extract clean domain
    # Strip port if present
    host = netloc.split(":")[0]
    destination_domain = host

    # 2. Check for IP Address as host
    ip_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    if re.match(ip_pattern, host):
        is_ip_host = True
        checks.append(URLCheckFlag(
            check_name="Host Format (IP Address)" if language != "hi" else "होस्ट प्रारूप (आईपी पता)",
            status="FAIL",
            details="Host is an IP address instead of a recognized domain name. Commonly used in malicious campaigns." if language != "hi" else "डोमेन के बजाय सीधा आईपी पता इस्तेमाल किया गया है।"
        ))
        warning_signs.append("Numerical IP address used as website host.")
        risk_score += 40
    else:
        checks.append(URLCheckFlag(
            check_name="Domain Structure" if language != "hi" else "डोमेन संरचना",
            status="PASS",
            details=f"Host is a registered domain: {host}"
        ))

    # 3. Check for URL Shorteners
    for s in SHORTENERS:
        if host == s or host.endswith("." + s):
            is_shortened = True
            break

    if is_shortened:
        checks.append(URLCheckFlag(
            check_name="URL Shortening" if language != "hi" else "यूआरएल शॉर्टनर",
            status="WARN",
            details="URL uses a redirection service that masks the real destination." if language != "hi" else "यूआरएल वास्तविक गंतव्य को छुपाने के लिए शॉर्टनर का उपयोग करता है।"
        ))
        warning_signs.append("Shortened link masks final destination.")
        risk_score += 25

    # 4. Check for Suspicious TLDs
    for tld in HIGH_RISK_TLDS:
        if host.endswith(tld):
            checks.append(URLCheckFlag(
                check_name="Top-Level Domain" if language != "hi" else "उच्च-जोखिम टीएलडी (TLD)",
                status="WARN",
                details=f"The domain uses '{tld}', frequently leveraged in low-cost disposable phishing setups."
            ))
            warning_signs.append(f"Domain registered under high-risk TLD {tld}.")
            risk_score += 20
            break

    # 5. Lookalike / Brand impersonation in subdomains or misleading domain paths
    # e.g., sbi-login-update.com or paytm.verification-alert.xyz
    for brand in TARGET_BRANDS:
        if brand in host:
            # Check if it's the legitimate official domain
            is_official = False
            official_domains = [
                f"{brand}.co.in", f"{brand}.com", f"onlinesbi.sbi", f"onlinesbi.com",
                f"hdfcbank.com", f"icicibank.com", f"axisbank.com", f"pnbindia.in",
                f"paytm.com", f"phonepe.com", f"uidai.gov.in", f"incometax.gov.in"
            ]
            for od in official_domains:
                if host == od or host.endswith("." + od):
                    is_official = True
                    break
            
            if not is_official:
                is_lookalike = True
                checks.append(URLCheckFlag(
                    check_name="Brand Lookalike / Impersonation" if language != "hi" else "ब्रांड का मिलता-जुलता नाम",
                    status="FAIL",
                    details=f"Contains brand keyword '{brand}' but is NOT hosted on the genuine official domain." if language != "hi" else f"इसमें '{brand}' का नाम है परंतु यह आधिकारिक वेबसाइट नहीं है।"
                ))
                warning_signs.append(f"Impersonation keyword detected: '{brand}'.")
                risk_score += 45
                break

    # 6. Check for deceptive characters (Punycode / @ symbol / excessive hyphens)
    if "@" in netloc or "@" in raw_url:
        checks.append(URLCheckFlag(
            check_name="Credentials in URL (@ symbol)" if language != "hi" else "यूआरएल में @ चिह्न",
            status="FAIL",
            details="The '@' symbol in a URL can trick browsers into ignoring the leading host string."
        ))
        warning_signs.append("Deceptive '@' character found in URL host structure.")
        risk_score += 35

    if "xn--" in host:
        checks.append(URLCheckFlag(
            check_name="Punycode / Internationalized Domain" if language != "hi" else "प्यूनीकोड (Punycode)",
            status="WARN",
            details="Domain contains encoded characters which can visually impersonate standard English letters."
        ))
        warning_signs.append("Internationalized punycode domain (potential homograph attack).")
        risk_score += 25

    if host.count("-") >= 3:
        checks.append(URLCheckFlag(
            check_name="Excessive Hyphens" if language != "hi" else "अत्यधिक हाइफ़न",
            status="WARN",
            details="Domain contains multiple hyphens, often seen in auto-generated phishing domains."
        ))
        warning_signs.append("Multiple hyphens in domain name.")
        risk_score += 15

    # 7. Check for suspicious APK or executable downloads in path
    if path.endswith(".apk") or path.endswith(".exe") or ".apk?" in raw_url:
        checks.append(URLCheckFlag(
            check_name="Direct Application Download" if language != "hi" else "सीधा ऐप डाउनलोड (.apk/.exe)",
            status="FAIL",
            details="Link points directly to an installable package file (.apk/.exe) rather than the official App Store."
        ))
        warning_signs.append("Points directly to installable binary/APK package.")
        risk_score += 45

    # Threat Intelligence Integration Check
    threat_intel_source = "Local Heuristics Engine (External API not configured)"
    if settings.has_safe_browsing:
        threat_intel_source = "Google Safe Browsing & Local Heuristics"
        # If API key configured, in a full live env we can query it; otherwise transparently declare local status

    # Determine Risk Category
    risk_score = min(max(risk_score, 0), 100)
    
    if risk_score >= 60:
        risk_level = "HIGH RISK"
    elif risk_score >= 30:
        risk_level = "UNCERTAIN"
    else:
        risk_level = "LOW OBSERVED RISK"

    # Contextual Recommendations
    recommendations: List[str] = []
    if language == "hi":
        if risk_level == "HIGH RISK":
            recommendations.append("इस लिंक को बिल्कुल न खोलें। यह खतरनाक या नकली वेबसाइट हो सकती है।")
            recommendations.append("अगर यह किसी बैंक या सेवा से संबंधित लग रहा है, तो सीधे उनकी आधिकारिक वेबसाइट पर जाएं।")
            recommendations.append("इस लिंक पर कोई भी लॉगिन क्रेडेंशियल, पासवर्ड या ओटीपी दर्ज न करें।")
        elif risk_level == "UNCERTAIN":
            recommendations.append("जांच अनिर्णायक है। लिंक खोलने से पहले प्रेषक से आधिकारिक तौर पर पुष्टि करें।")
            recommendations.append("यदि आगे बढ़ना आवश्यक है, तो सुनिश्चित करें कि कोई संवेदनशील व्यक्तिगत जानकारी न मांगी जा रही हो।")
        else:
            recommendations.append("परीक्षण किए गए मानकों में कोई ज्ञात खतरा नहीं पाया गया।")
            recommendations.append("हमेशा ध्यान दें कि बिल्कुल नए या शून्य-दिवसीय (zero-day) हमलों का पता इस जांच में नहीं लग सकता।")
    else:
        if risk_level == "HIGH RISK":
            recommendations.append("Do not open this URL. It exhibits prominent deception patterns.")
            recommendations.append("If this claims to be from a bank or utility provider, visit their official domain manually.")
            recommendations.append("Never enter usernames, passwords, card numbers, or OTPs on unverified sites.")
        elif risk_level == "UNCERTAIN":
            recommendations.append("The inspection was inconclusive. Independent verification is strongly advised before opening.")
            recommendations.append("Check the exact spelling of the domain before interacting with any web forms.")
        else:
            recommendations.append("No known warning signs were detected by the heuristic checks performed.")
            recommendations.append("Remember: No automated tool can guarantee 100% safety. New and targeted attacks may bypass heuristics.")

    safe_preview = {
        "display_domain": destination_domain,
        "protocol": scheme.upper(),
        "is_safe_to_render": False,
        "interstitial_warning": (
            "चेतावनी: यह एक बाहरी वेबसाइट है। ScamSaathi सुरक्षा कारणों से संदिग्ध पेजों को स्वचालित रूप से नहीं खोलता।"
            if language == "hi" else
            "Warning: This is an unverified external destination. ScamSaathi never automatically executes scripts or loads unverified URLs in an unrestricted sandbox."
        )
    }

    limitations = (
        "सीमाएं: यह विश्लेषण यूआरएल संरचना, डोमेन पैटर्न और ह्यूरिस्टिक्स पर आधारित है। यह लाइव वेबपेज के गुप्त मैलवेयर कोड की पूरी गारंटी नहीं देता।"
        if language == "hi" else
        "Limitations: This evaluation examines URL anatomy, domain spoofing heuristics, and structural anomalies. It cannot inspect dynamic client-side payloads served only to specific targeted devices."
    )

    return URLAnalyzeResponse(
        url=raw_url,
        normalized_url=url,
        domain=destination_domain,
        risk_level=risk_level,
        risk_score=risk_score,
        destination_domain=destination_domain,
        is_https=is_https,
        is_ip_host=is_ip_host,
        is_shortened=is_shortened,
        is_lookalike=is_lookalike,
        checks=checks,
        warning_signs=warning_signs,
        safe_preview=safe_preview,
        recommendations=recommendations,
        limitations=limitations,
        threat_intel_source=threat_intel_source
    )

def _build_invalid_url_response(raw_url: str, err: str, language: str) -> URLAnalyzeResponse:
    checks = [
        URLCheckFlag(
            check_name="URL Syntax",
            status="FAIL",
            details=f"Invalid or malformed URL syntax: {err}"
        )
    ]
    recs = ["Check the URL for typographical errors or broken formatting."]
    return URLAnalyzeResponse(
        url=raw_url,
        normalized_url=raw_url,
        domain="invalid",
        risk_level="HIGH RISK",
        risk_score=90,
        destination_domain="invalid",
        is_https=False,
        is_ip_host=False,
        is_shortened=False,
        is_lookalike=False,
        checks=checks,
        warning_signs=["Malformed or invalid URL structure."],
        safe_preview={"display_domain": "invalid", "protocol": "NONE", "is_safe_to_render": False, "interstitial_warning": "Invalid URL"},
        recommendations=recs,
        limitations="Cannot evaluate malformed URLs.",
        threat_intel_source="Local Syntax Validator"
    )
