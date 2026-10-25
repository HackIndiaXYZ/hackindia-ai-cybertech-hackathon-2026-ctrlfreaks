import pytest
from app.services.url_analyzer import analyze_url_target

def test_ip_address_host_detection():
    url = "http://192.168.1.100/login-verify"
    res = analyze_url_target(url, language="en")
    assert res.is_ip_host is True
    assert res.risk_level in ["UNCERTAIN", "HIGH RISK"]

def test_url_shortener_detection():
    url = "https://bit.ly/claim-free-prize-now"
    res = analyze_url_target(url, language="en")
    assert res.is_shortened is True
    assert any(c.check_name == "URL Shortening" for c in res.checks)

def test_brand_lookalike_detection():
    url = "http://sbi-verification-portal.xyz/login.html"
    res = analyze_url_target(url, language="en")
    assert res.is_lookalike is True
    assert res.risk_level == "HIGH RISK"
    assert any(c.status == "FAIL" for c in res.checks)

def test_malicious_apk_direct_download():
    url = "https://update-service.online/patch.apk"
    res = analyze_url_target(url, language="en")
    assert res.risk_level == "HIGH RISK"
    assert any("Direct Application Download" in c.check_name for c in res.checks)

def test_benign_legitimate_url():
    url = "https://onlinesbi.sbi/portal/login"
    res = analyze_url_target(url, language="en")
    assert res.is_lookalike is False
    assert res.is_https is True
    assert res.risk_level == "LOW OBSERVED RISK"

def test_hindi_language_output():
    url = "http://paytm-cash-reward.top/win"
    res = analyze_url_target(url, language="hi")
    assert "चेतावनी" in res.safe_preview["interstitial_warning"] or "जोखिम" in str(res.recommendations)
