import os
from pathlib import Path
from pydantic import BaseModel

def _load_env_file():
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    if env_path.exists():
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, val = line.split("=", 1)
                        key = key.strip()
                        val = val.strip().strip("'").strip('"')
                        if key not in os.environ:
                            os.environ[key] = val
        except Exception:
            pass

_load_env_file()

class Settings(BaseModel):
    app_name: str = "ScamSaathi"
    app_version: str = "2.4.0"
    environment: str = os.getenv("ENVIRONMENT", "development")
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    
    # Feature flags & provider configs
    ai_provider: str = os.getenv("AI_PROVIDER", "none")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    safe_browsing_api_key: str = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY", "")
    
    # Twilio SMS Provider
    twilio_account_sid: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    twilio_auth_token: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    twilio_phone_number: str = os.getenv("TWILIO_PHONE_NUMBER", "")

    # SMTP Real Email Provider (Gmail, Yahoo, Outlook, or custom SMTP)
    smtp_host: str = os.getenv("SMTP_HOST", "")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    smtp_from_email: str = os.getenv("SMTP_FROM_EMAIL", "")

    @property
    def has_ai_credentials(self) -> bool:
        return bool(self.openai_api_key or self.gemini_api_key)

    @property
    def has_safe_browsing(self) -> bool:
        return bool(self.safe_browsing_api_key)

    @property
    def has_real_sms(self) -> bool:
        return bool(self.twilio_account_sid and self.twilio_auth_token and self.twilio_phone_number)

    @property
    def has_real_email(self) -> bool:
        if not (self.smtp_host and self.smtp_user and self.smtp_password):
            try:
                from .database import get_setting
                db_user = get_setting("SMTP_USER", "")
                db_pass = get_setting("SMTP_PASSWORD", "")
                if db_user and db_pass:
                    self.smtp_host = get_setting("SMTP_HOST", "smtp.gmail.com")
                    self.smtp_port = int(get_setting("SMTP_PORT", "587"))
                    self.smtp_user = db_user
                    self.smtp_password = db_pass
            except Exception:
                pass
        return bool(self.smtp_host and self.smtp_user and self.smtp_password)

settings = Settings()

