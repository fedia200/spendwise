# SpendWise

A personal finance platform to track expenses, understand spending habits and spot unusual activity. Built full-stack with FastAPI, React and PostgreSQL, with machine learning for forecasting and anomaly detection.

<!-- Replace the paths below with your real screenshots (e.g. docs/screenshots/dashboard.png) -->
![Dashboard](docs/screenshots/dashboard.png)

## Features

- **Authentication**: register and log in with JWT; expense routes are protected
- **Expenses**: create, list, update and delete expenses (full CRUD)
- **Analytics** (Pandas): spending summary, breakdown by category, monthly breakdown
- **CSV import**: upload a CSV file to add many expenses at once
- **Machine learning**: monthly spending forecast and detection of unusual expenses
- **Dashboard**: React interface connected to the analytics endpoints
- **Tests**: automated API tests with pytest

## Tech stack

| Layer | Tools |
|---|---|
| Backend | Python, FastAPI, SQLAlchemy, Pydantic, Pandas, scikit-learn |
| Auth | JWT (python-jose), bcrypt |
| Database | PostgreSQL (Docker) |
| Frontend | React, Vite, Tailwind CSS |
| Tooling | Docker Compose, pytest, uv |

## Screenshots

<!-- Add 3 or 4 screenshots: login, dashboard, expenses list, CSV import -->
| Login | Dashboard | Expenses |
|---|---|---|
| ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Expenses](docs/screenshots/expenses.png) |

## Getting started

### 1. Database

Make sure Docker Desktop is running, then from the project root:

```bash
docker compose up -d
```

### 2. Backend

Requires Python 3.14+ and [uv](https://docs.astral.sh/uv/).

```bash
cd backend
uv sync
```

Create a `backend/.env` file:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME
SECRET_KEY=change-me-to-a-long-random-string
```

Start the API:

```bash
uv run uvicorn app.main:app --reload
```

Interactive API docs: http://127.0.0.1:8000/docs

Optional: load sample data with `uv run python seed_data.py`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### 4. Tests

```bash
cd backend
uv run pytest
```

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in and get a JWT |
| GET / POST | `/expenses` | List / create expenses |
| GET / PUT / DELETE | `/expenses/{id}` | Read / update / delete an expense |
| POST | `/expenses/import-csv` | Import expenses from a CSV file |
| GET | `/analytics/summary` | Spending summary |
| GET | `/analytics/categories` | Breakdown by category |
| GET | `/analytics/monthly` | Breakdown by month |
| GET | `/ml/forecast` | Spending forecast |
| GET | `/ml/anomalies` | Unusual expenses |

## Roadmap

- [ ] AI assistant connected to the analytics
- [ ] Budgets and recommendations
- [ ] Deployment

## Author

Fedia, computer science student. [GitHub](https://github.com/fedia200)
