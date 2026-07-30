"""
Sync database engine — used ONLY by Celery workers and Alembic migrations.

Rationale: Celery's default worker model (prefork) does not manage an
asyncio event loop, so mixing it with an async engine leads to
"attached to a different loop" errors under load. Alembic's autogenerate
also expects a sync connection. FastAPI request handling must continue to
use app.core.db (async) exclusively.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

sync_engine = create_engine(
    settings.database_url_sync,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

SyncSessionLocal = sessionmaker(bind=sync_engine, expire_on_commit=False, autoflush=False)


def get_sync_db() -> Generator[Session, None, None]:
    """Session context manager for use inside Celery tasks."""
    session = SyncSessionLocal()
    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
