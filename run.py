#!/usr/bin/env python3
"""
ScamSaathi Main Application Launcher
Tagline: Pause. Verify. Protect.
"""

import sys
import os
from pathlib import Path

# Fix Windows console encoding if needed
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(backend_dir))

import uvicorn
from app.config import settings

def main():
    print("=" * 60)
    print("  [SHIELD] SCAMSAATHI - AI-ASSISTED CYBERSECURITY COMPANION")
    print("  Tagline: Pause. Verify. Protect. | Zero-Log Architecture")
    print("=" * 60)
    print(f"[*] Starting ScamSaathi on http://{settings.host}:{settings.port}")
    print(f"[*] API Documentation: http://{settings.host}:{settings.port}/api/docs")
    print(f"[*] Frontend Web App: http://{settings.host}:{settings.port}/")
    print(f"[*] AI Provider: {'Configured' if settings.has_ai_credentials else 'Local Deterministic Fallback'}")
    print(f"[*] Safe Browsing: {'Configured' if settings.has_safe_browsing else 'Local URL Heuristics'}")
    print(f"[*] SMS SOS Mode: {'Live Twilio' if settings.has_real_sms else 'Safe Simulation Demo'}")
    print("=" * 60)
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=False,
        log_level="info"
    )

if __name__ == "__main__":
    main()
