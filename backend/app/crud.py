from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas

# 1. Simpan Lead Baru ke Database
def create_lead(db: Session, lead_data: dict, prediction: dict):
    db_lead = models.Lead(
        **lead_data, # Unpack data input nasabah
        prediction_score=prediction.get("score"),
        prediction_label=prediction.get("label")
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

# 2. Ambil List Leads (dengan Pagination biar ringan)
def get_leads(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Lead).order_by(models.Lead.id.desc()).offset(skip).limit(limit).all()

# 3. Ambil Detail Satu Lead
def get_lead_by_id(db: Session, lead_id: int):
    return db.query(models.Lead).filter(models.Lead.id == lead_id).first()

# 4. Hitung Statistik untuk Dashboard (BI Logic)
def get_dashboard_stats(db: Session):
    total = db.query(models.Lead).count()
    high = db.query(models.Lead).filter(models.Lead.prediction_label == "High Potential").count()
    medium = db.query(models.Lead).filter(models.Lead.prediction_label == "Medium Potential").count()
    low = db.query(models.Lead).filter(models.Lead.prediction_label == "Low Potential").count()
    
    # Hitung persentase High Potential sebagai estimasi konversi
    rate = (high / total * 100) if total > 0 else 0.0
    
    return {
        "total_leads": total,
        "high_potential": high,
        "medium_potential": medium,
        "low_potential": low,
        "conversion_rate_estimate": round(rate, 2)
    }