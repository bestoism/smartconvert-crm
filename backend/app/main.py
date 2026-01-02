from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware  # <--- IMPORT INI
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

# --- KONFIGURASI CORS (PENTING BUAT REACT) ---
origins = [
    "http://localhost:5173",    # Alamat Frontend React kamu
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Izinkan frontend mengakses
    allow_credentials=True,
    allow_methods=["*"],        # Izinkan semua method (GET, POST, dll)
    allow_headers=["*"],        # Izinkan semua header
)
# ---------------------------------------------

@app.get("/")
def read_root():
    return {"message": "SmartConvert API is running 🚀"}

# --- 1. Endpoint Upload CSV (Batch Processing) ---
@app.post("/api/v1/upload-csv")
async def upload_leads_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    try:
        contents = await file.read()
        try:
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')), sep=';')
            if df.shape[1] < 2:
                 df = pd.read_csv(io.StringIO(contents.decode('utf-8')), sep=',')
        except:
             df = pd.read_csv(io.StringIO(contents.decode('utf-8')), sep=',')

        # --- PERBAIKAN DI SINI ---
        # JANGAN ubah df.columns secara global agar ML tetap dapat nama kolom asli (pakai titik)
        # df.columns = [c.replace('.', '_') for c in df.columns] <--- HAPUS BARIS INI
        
        results = []
        for index, row in df.iterrows():
            lead_data_raw = row.to_dict() # Ini masih pakai titik (emp.var.rate), BAGUS UNTUK ML
            
            # 1. Prediksi pakai data RAW (sesuai JSON features)
            prediction = ml_service.predict(lead_data_raw)
            
            # 2. Siapkan data untuk Database (Ganti titik jadi underscore HANYA DISINI)
            lead_data_for_db = {}
            valid_db_columns = models.Lead.__table__.columns.keys()
            
            for k, v in lead_data_raw.items():
                # Ubah key misal 'emp.var.rate' jadi 'emp_var_rate'
                clean_key = k.replace('.', '_')
                
                # Masukkan hanya jika kolomnya ada di tabel Database
                if clean_key in valid_db_columns:
                    lead_data_for_db[clean_key] = v
            
            # 3. Simpan
            saved_lead = crud.create_lead(db, lead_data_for_db, prediction)
            results.append(saved_lead)

        return {
            "status": "success", 
            "message": f"Successfully processed {len(results)} leads",
            "sample_data": results[:5] 
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
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
    # 1. Ambil data dari Database
    db_lead = crud.get_lead_by_id(db, lead_id=lead_id)
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # 2. Konversi object Database ke Dictionary
    lead_dict = db_lead.__dict__.copy()
    
    # 3. Hitung Penjelasan SHAP secara Real-time
    # Kita harus memfilter key yang bukan fitur (seperti id, created_at, prediction_score)
    # Cara gampangnya: kita kirim lead_dict, nanti ml_service yang filter via preprocess
    explanation = ml_service.explain_prediction(lead_dict)
    
    # 4. Tempelkan hasil penjelasan ke respons
    # (Kita tidak simpan ke DB biar hemat storage, hitung on-the-fly aja)
    db_lead.explanation = explanation
    
    return db_lead

@app.get("/api/v1/user/profile")
def read_user_profile(db: Session = Depends(get_db)):
    return crud.get_user_profile(db)

@app.put("/api/v1/user/profile")
def update_profile(data: dict, db: Session = Depends(get_db)):
    return crud.update_user_profile(db, data)

@app.put("/api/v1/leads/{lead_id}/notes")
def update_lead_notes(lead_id: int, notes_data: dict, db: Session = Depends(get_db)):
    db_lead = crud.get_lead_by_id(db, lead_id=lead_id)
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    db_lead.notes = notes_data.get("notes")
    db.commit()
    return {"status": "success", "message": "Note saved"}