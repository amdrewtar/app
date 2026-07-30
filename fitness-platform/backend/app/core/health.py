"""
Health-check endpoint.

Deliberately lives in `core` rather than its own module: it has no
business logic and every other module in the system depends on core
already, so this avoids a circular-dependency trap.

Render/Fly.io/Docker healthchecks hit this endpoint to decide whether the
container is ready to receive traffic.
"""

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.db import check_db_connection
from app.core.redis import check_redis_connection

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: str
    database: bool
    redis: bool


@router.get("/healthz", response_model=HealthResponse)
async def healthz() -> HealthResponse:
    db_ok = await check_db_connection()
    redis_ok = await check_redis_connection()
    overall = "ok" if (db_ok and redis_ok) else "degraded"
    return HealthResponse(status=overall, database=db_ok, redis=redis_ok)
