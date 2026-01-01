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

from sqlalchemy import case

def get_dashboard_stats(db: Session):
    total = db.query(models.Lead).count()
    if total == 0: return {} # Handle empty DB

    # 1. Age Grouping (Binning)
    age_groups = db.query(
        case(
            (models.Lead.age <= 25, '18-25'),
            (models.Lead.age <= 35, '26-35'),
            (models.Lead.age <= 45, '36-45'),
            (models.Lead.age <= 55, '46-55'),
            (models.Lead.age <= 65, '56-65'),
            else_='65+'
        ).label('age_range'),
        func.count(models.Lead.id)
    ).group_by('age_range').all()

    # 2. Lead Score Distribution (Binning Score 0-100)
    score_dist = db.query(
        case(
            (models.Lead.prediction_score <= 0.2, '0-20'),
            (models.Lead.prediction_score <= 0.4, '21-40'),
            (models.Lead.prediction_score <= 0.6, '41-60'),
            (models.Lead.prediction_score <= 0.8, '61-80'),
            else_='81-100'
        ).label('score_range'),
        func.count(models.Lead.id)
    ).group_by('score_range').all()

    # 3. Marital & Education (Standard GroupBy)
    marital_data = db.query(models.Lead.marital, func.count(models.Lead.id)).group_by(models.Lead.marital).all()
    edu_data = db.query(models.Lead.education, func.count(models.Lead.id)).group_by(models.Lead.education).all()
    
    # 4. Economy Class (Based on euribor3m: High rates = High Class/Interest)
    economy_data = db.query(
        case(
            (models.Lead.euribor3m <= 1.5, 'Low Interest'),
            (models.Lead.euribor3m <= 4.0, 'Medium Interest'),
            else_='High Interest'
        ).label('econ_type'),
        func.count(models.Lead.id)
    ).group_by('econ_type').all()

    # 5. Job Distribution
    job_data = db.query(models.Lead.job, func.count(models.Lead.id)).group_by(models.Lead.job).all()

    return {
        "total_leads": total,
        "high_potential": db.query(models.Lead).filter(models.Lead.prediction_label == "High Potential").count(),
        "medium_potential": db.query(models.Lead).filter(models.Lead.prediction_label == "Medium Potential").count(),
        "low_potential": db.query(models.Lead).filter(models.Lead.prediction_label == "Low Potential").count(),
        "conversion_rate_estimate": round((db.query(models.Lead).filter(models.Lead.prediction_label == "High Potential").count() / total * 100), 2),
        
        # Data untuk Grafik
        "age_dist": [{"name": i[0], "value": i[1]} for i in age_groups],
        "score_dist": [{"name": i[0], "value": i[1]} for i in score_dist],
        "marital_dist": [{"name": i[0], "value": i[1]} for i in marital_data],
        "edu_dist": [{"name": i[0], "value": i[1]} for i in edu_data],
        "job_dist": [{"name": i[0], "value": i[1]} for i in job_data],
        "econ_dist": [{"name": i[0], "value": i[1]} for i in economy_data]
    }