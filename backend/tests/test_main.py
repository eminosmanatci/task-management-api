import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db

# Test database (SQLite in-memory)
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Task Management API"

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_register(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "123456"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_login(client):
    # Önce register
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "123456"}
    )
    
    # Sonra login
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "123456"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_create_task(client):
    # Register ve login
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "123456"}
    )
    login = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "123456"}
    )
    token = login.json()["access_token"]
    
    # Task oluştur
    response = client.post(
        "/api/v1/tasks/",
        json={
            "title": "Test Task",
            "description": "Test Description",
            "status": "todo",
            "priority": "high"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["owner_id"] == 1