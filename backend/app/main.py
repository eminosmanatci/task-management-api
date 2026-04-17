from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, tasks

# FastAPI uygulaması oluştur
app = FastAPI(
    title=settings.APP_NAME,
    description="Professional Task Management API with FastAPI, PostgreSQL, JWT Authentication",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"  # ReDoc
)

# CORS middleware (Frontend/Mobil için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Prodüksiyonda spesifik domain yaz
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ları ekle
app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/")
def root():
    """API Durum kontrolü"""
    return {
        "message": "Task Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}