import os
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "ScamSaathi"
    app_version: str = "1.0.0"
    environment: str = os.getenv("ENVIRONMENT", "development")
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    
    # Feature flags & provider configs (always safe fallbacks)
    ai_provider: str = os.getenv("AI_PROVIDER", "none")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    safe_browsing_api_key: str = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY", "")
    
    twilio_account_sid: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    twilio_auth_token: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    twilio_phone_number: str = os.getenv("TWILIO_PHONE_NUMBER", "")

    @property
    def has_ai_credentials(self) -> bool:
        return bool(self.openai_api_key or self.gemini_api_key)

    @property
    def has_safe_browsing(self) -> bool:
        return bool(self.safe_browsing_api_key)

    @property
    def has_real_sms(self) -> bool:
        return bool(self.twilio_account_sid and self.twilio_auth_token and self.twilio_phone_number)

settings = Settings()
