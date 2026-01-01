from fastapi import FastAPI

app = FastAPI(
    title="SmartConvert CRM API",
    description="Backend API untuk Predictive Lead Scoring Bank",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to SmartConvert API",
        "status": "active",
        "version": "v1"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}