from fastapi import FastAPI
from . import models
from .database import engine

# Create Database Tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartConvert CRM API",
    description="Backend API for Predictive Lead Scoring Bank System",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to SmartConvert API",
        "docs_url": "/docs",
        "status": "active"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "database": "connected"}