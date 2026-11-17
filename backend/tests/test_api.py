import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

TEST_EMAIL = "pytest_user@example.com"
TEST_PASSWORD = "TestPassword123"


@pytest.fixture(scope="module")
def auth_token():
    # Inscription (ignore l'erreur si l'utilisateur existe déjà d'un run précédent)
    client.post("/auth/register", json={
        "name": "Pytest User",
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
    })
    response = client.post("/auth/login", json={
        "name": "x",
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
    })
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_and_list_expense(auth_headers):
    create_response = client.post("/expenses", json={
        "amount": 42.5,
        "category": "Test",
        "description": "Dépense de test",
        "date": "2026-10-09T00:00:00",
        "payment_method": "Carte",
    }, headers=auth_headers)
    assert create_response.status_code == 200, create_response.text
    expense_id = create_response.json()["id"]

    list_response = client.get("/expenses", headers=auth_headers)
    assert list_response.status_code == 200
    ids = [e["id"] for e in list_response.json()]
    assert expense_id in ids


def test_forecast_endpoint(auth_headers):
    response = client.get("/ml/forecast", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    # Avec un seul utilisateur de test neuf, pas assez d'historique -> message d'erreur attendu
    assert "error" in data or "forecast" in data


def test_anomalies_endpoint(auth_headers):
    response = client.get("/ml/anomalies", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "error" in data or "anomalies" in data


def test_import_csv(auth_headers):
    csv_content = (
        "amount,category,date,description,payment_method\n"
        "45.50,Alimentation,2026-10-01,Courses test,Carte\n"
        "15.00,Transport,2026-10-02,Taxi test,Espèces\n"
    )
    files = {"file": ("test.csv", csv_content, "text/csv")}
    response = client.post("/expenses/import-csv", files=files, headers=auth_headers)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["created"] == 2
    assert data["skipped"] == 0


def test_import_csv_missing_columns(auth_headers):
    csv_content = "amount,category\n45.50,Alimentation\n"
    files = {"file": ("bad.csv", csv_content, "text/csv")}
    response = client.post("/expenses/import-csv", files=files, headers=auth_headers)
    assert response.status_code == 400