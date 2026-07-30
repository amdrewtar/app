"""Shared Redis client, used for caching and by slowapi for rate limiting."""

from redis.asyncio import Redis

from app.core.config import get_settings

settings = get_settings()

redis_client: Redis = Redis.from_url(settings.redis_url, decode_responses=True)


async def check_redis_connection() -> bool:
    """Used by the /healthz endpoint to verify Redis connectivity."""
    try:
        return await redis_client.ping()
    except Exception:
        return False
