"""
Application configuration.

All configuration MUST come from environment variables — never hardcode
secrets or environment-specific values here. See .env.example for the
full list of supported variables.
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- App ---
    app_name: str = "fitness-platform"
    environment: str = "local"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # --- Security ---
    secret_key: str = Field(..., description="Used to sign JWTs. Must be set via env var.")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # --- Database ---
    database_url: str = Field(..., description="Async SQLAlchemy connection string")
    database_url_sync: str = Field(..., description="Sync connection string (Celery, Alembic)")

    # --- Redis / Celery ---
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    # --- CORS ---
    cors_origins: list[str] = ["http://localhost:5173"]

    # --- Rate limiting ---
    rate_limit_default: str = "100/minute"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    """
    Cached settings accessor.

    Using a cached function (rather than a module-level singleton) makes it
    trivial to override settings in tests via `get_settings.cache_clear()`
    plus dependency_overrides in FastAPI.
    """
    return Settings()  # type: ignore[call-arg]
