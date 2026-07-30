# Fitness Platform

Персональные тренировочные программы, рекомендации по питанию и трекинг прогресса.

Полный анализ проекта, PRD, архитектура, ER-диаграмма, API-дизайн и план разработки —
см. `fitness-app-architecture.md` (прислан отдельно на этапе планирования).

## Статус

**Этап 0 — Bootstrap.** Реализовано: структура проекта, Docker Compose,
`core`-модуль backend (config, db, redis, logging, exceptions, healthcheck),
скелет frontend с проверкой связи backend↔frontend↔postgres↔redis.

Модули `auth`, `users`, `exercises` и т.д. — в следующих этапах (см. план разработки).

## Быстрый старт

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Backend docs (Swagger): http://localhost:8000/docs
- Healthcheck: http://localhost:8000/healthz

Открыв http://localhost:5173, вы должны увидеть карточку "Статус системы"
с зелёными индикаторами API / PostgreSQL / Redis — это подтверждает, что
всё окружение поднялось корректно.

## Локальная разработка без Docker (backend)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

Альтернатива через `requirements.txt` (для окружений/хостингов без поддержки
`pyproject.toml`, например некоторых PaaS-buildpack'ов):

```bash
pip install -r requirements.txt -r requirements-dev.txt
```

`pyproject.toml` — источник истины; `requirements*.txt` синхронизируются с ним вручную
при добавлении/обновлении зависимостей.

## Тесты

```bash
# Backend
cd backend
pytest
ruff check .
mypy .

# Frontend
cd frontend
npm install
npm run test
npm run lint
```

## Структура проекта

См. раздел 6 в `fitness-app-architecture.md`.

## Миграции БД (Alembic)

```bash
cd backend
alembic revision --autogenerate -m "описание изменений"
alembic upgrade head
```

На Этапе 0 моделей ещё нет — папка `alembic/versions/` пуста намеренно,
первая миграция появится в Этапе 1 (Auth & Users).
