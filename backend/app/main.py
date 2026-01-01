from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
import io

from . import models, schemas, crud
from .database import engine, get_db
from .ml_service import ml_service

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartConvert CRM API",
    description="Backend API with Batch Upload & Prediction Capability",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"message": "SmartConvert API is running 🚀"}

# --- 1. Endpoint Upload CSV (Batch Processing) ---
@app.post("/api/v1/upload-csv")
async def upload_leads_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload file CSV, proses prediksi tiap baris, dan simpan ke database.
    """
    # Validasi tipe file
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    try:
        # Baca file CSV ke Pandas DataFrame
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')), sep=';') # Cek separator, kadang ; kadang ,
        
        # Jika cuma 1 kolom, mungkin separatornya salah, coba koma
        if df.shape[1] < 2:
             df = pd.read_csv(io.StringIO(contents.decode('utf-8')), sep=',')

        results = []
        
        # Loop setiap baris data (Iterrows tidak efisien utk data jutaan, tapi oke utk ribuan)
        for index, row in df.iterrows():
            # Ubah row jadi dictionary
            lead_data = row.to_dict()
            
            # Lakukan Prediksi Menggunakan ML Service
            prediction = ml_service.predict(lead_data)
            
            # Simpan ke Database via CRUD
            # Kita filter lead_data agar hanya kolom yang ada di model Database yang masuk
            # (Untuk mencegah error jika CSV punya kolom aneh2)
            valid_columns = models.Lead.__table__.columns.keys()
            filtered_lead_data = {k: v for k, v in lead_data.items() if k in valid_columns}
            
            saved_lead = crud.create_lead(db, filtered_lead_data, prediction)
            results.append(saved_lead)

        return {
            "status": "success", 
            "message": f"Successfully processed {len(results)} leads",
            "sample_data": results[:5] # Tampilkan 5 data awal sbg bukti
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

# --- 2. Endpoint Get Leads (List Data) ---
@app.get("/api/v1/leads", response_model=List[schemas.LeadResponse])
def read_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    leads = crud.get_leads(db, skip=skip, limit=limit)
    return leads

# --- 3. Endpoint Dashboard Stats (BI Logic) ---
@app.get("/api/v1/dashboard/stats", response_model=schemas.DashboardStats)
def read_stats(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)

# --- 4. Endpoint Detail Lead (XAI Placeholder) ---
@app.get("/api/v1/leads/{lead_id}", response_model=schemas.LeadResponse)
def read_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = crud.get_lead_by_id(db, lead_id=lead_id)
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead