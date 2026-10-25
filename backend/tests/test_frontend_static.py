import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_index_html_served():
    res = client.get("/")
    assert res.status_code == 200
    assert "ScamSaathi" in res.text
    assert "navbar-container" in res.text

def test_static_css_served():
    res = client.get("/css/styles.css")
    assert res.status_code == 200
    assert "cyber-card" in res.text

def test_static_js_served():
    res = client.get("/js/app.js")
    assert res.status_code == 200
    assert "PAGE_RENDERERS" in res.text

def test_static_i18n_served():
    res = client.get("/js/i18n.js")
    assert res.status_code == 200
    assert "translations" in res.text

def test_static_modules_served():
    res = client.get("/js/pages/messageAnalyzer.js")
    assert res.status_code == 200
    assert "renderMessageAnalyzer" in res.text
