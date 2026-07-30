"""
Integration test for the /healthz endpoint.

Note: this test requires a running Postgres + Redis (see docker-compose.yml).
It's an integration test, not a unit test, precisely because it verifies
real connectivity — that's the whole point of a healthcheck.
"""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_healthz_returns_200_with_status_fields() -> None:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/healthz")

    assert response.status_code == 200
    body = response.json()
    assert "status" in body
    assert "database" in body
    assert "redis" in body
