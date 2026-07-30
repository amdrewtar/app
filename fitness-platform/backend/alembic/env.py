"""
Alembic environment.

Uses the SYNC database URL (Settings.database_url_sync) — Alembic's
autogenerate machinery expects a synchronous connection, and mixing it
with the app's async engine adds complexity for no benefit here.

As each module adds SQLAlchemy models, import them below so their tables
are registered on Base.metadata and picked up by `alembic revision --autogenerate`.
"""

from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.config import get_settings
from app.core.db import Base

# --- Import all ORM models here so Base.metadata is complete ---
# from app.users.models import User  # noqa: F401
# from app.exercises.models import Exercise  # noqa: F401
# (uncomment/extend as each module's models.py is implemented)

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

settings = get_settings()
config.set_main_option("sqlalchemy.url", settings.database_url_sync)


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
