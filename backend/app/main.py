import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .config import settings
from .database import init_db
from .routers import health, analyze, safelink, dna, honeyshield, contacts, privacy

# Initialize database schema
init_db()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Privacy-focused, AI-assisted cybersecurity web platform for scam detection and prevention.",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Suitable for local development & hybrid web interface
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response

# Include API Routers first
app.include_router(health.router)
app.include_router(analyze.router)
app.include_router(safelink.router)
app.include_router(dna.router)
app.include_router(honeyshield.router)
app.include_router(contacts.router)
app.include_router(privacy.router)

# Mount Frontend static files
FRONTEND_DIR = Path(__file__).parent.parent.parent / "frontend"
if FRONTEND_DIR.exists():
    app.mount("/css", StaticFiles(directory=str(FRONTEND_DIR / "css")), name="css")
    app.mount("/js", StaticFiles(directory=str(FRONTEND_DIR / "js")), name="js")
    
    @app.get("/")
    async def serve_index():
        return FileResponse(str(FRONTEND_DIR / "index.html"))


@app.on_event("startup")
async def on_startup():
    print(f"[*] {settings.app_name} v{settings.app_version} initialized.")
    print(f"[*] AI Provider: {'Configured' if settings.has_ai_credentials else 'Local Deterministic Fallback'}")
    print(f"[*] Safe Browsing: {'Configured' if settings.has_safe_browsing else 'Local URL Heuristics'}")
    print(f"[*] SMS Delivery: {'Configured' if settings.has_real_sms else 'Safe Simulation Demo'}")
