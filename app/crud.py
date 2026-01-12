from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from datetime import datetime
from . import auth

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
def get_leads(db: Session, skip: int = 0, limit: int = 100, sort_by: str = "newest"):
    query = db.query(models.Lead)
    
    # Logika Sorting
    if sort_by == "score_high":
        query = query.order_by(models.Lead.prediction_score.desc())
    elif sort_by == "score_low":
        query = query.order_by(models.Lead.prediction_score.asc())
    elif sort_by == "oldest":
        query = query.order_by(models.Lead.id.asc())
    else: # Default: Newest (ID Descending)
        query = query.order_by(models.Lead.id.desc())
        
    return query.offset(skip).limit(limit).all()

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
    
def get_user_performance(db: Session):
    # Di sini kita asumsikan 'Sales User' saat ini memproses semua data di DB
    # Jika nanti ada sistem Login, kita bisa filter berdasarkan user_id
    total_processed = db.query(models.Lead).count()
    high_leads = db.query(models.Lead).filter(models.Lead.prediction_label == "High Potential").count()
    
    # Simulasi KPI sederhana
    return {
        "name": "Ryan Besto Saragih",
        "role": "Senior Sales Representative",
        "email": "sales01@bank-asah.co.id",
        "id_emp": "SLS-2025-088",
        "joined_date": "15 Januari 2025",
        "stats": {
            "leads_processed": total_processed,
            "conversion_rate": round((high_leads / total_processed * 100), 1) if total_processed > 0 else 0,
            "monthly_target": 150,
            "current_progress": high_leads
        }
    }
    
def get_user_profile(db: Session):
    # Ambil user pertama (karena kita cuma punya 1 user untuk sekarang)
    user = db.query(models.UserProfile).first()
    if not user:
        # Jika belum ada, buat default
        user = models.UserProfile()
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Hitung Performa Real-time
    total_leads = db.query(models.Lead).count()
    high_leads = db.query(models.Lead).filter(models.Lead.prediction_label == "High Potential").count()
    
    # Hitung Active Days (Selisih hari ini dengan data lead pertama)
    first_lead = db.query(models.Lead).order_by(models.Lead.created_at.asc()).first()
    active_days = (datetime.now() - first_lead.created_at).days + 1 if first_lead else 0

    # Ambil 5 Aktivitas Terbaru (Recent Activity)
    recent_leads = db.query(models.Lead).order_by(models.Lead.updated_at.desc()).limit(5).all()
    
    activities = []
    for lead in recent_leads:
        # Jika updated_at != created_at, berarti itu sebuah Update Notes
        is_updated = lead.updated_at > lead.created_at
        action = "Updated notes for" if is_updated else "Added to database"
        
        activities.append({
            "lead_id": lead.id, 
            "time": lead.updated_at.strftime("%Y-%m-%d %H:%M"),
            "content": f"{action} Nasabah-{lead.id}"
        })

    return {
        "id": user.id,
        "name": user.name,
        "role": user.role,
        "email": user.email,
        "id_emp": user.id_emp,
        "monthly_target": user.monthly_target,
        "joined_date": user.joined_date.strftime("%d %B %Y"),
        "active_days": active_days,
        "stats": {
            "leads_processed": total_leads,
            "conversion_rate": round((high_leads / total_leads * 100), 1) if total_leads > 0 else 0,
            "current_progress": high_leads
        },
        "recent_activities": activities
    }

def update_user_profile(db: Session, data: dict):
    # 1. Ambil profil yang ada di database
    profile = db.query(models.UserProfile).first()
    
    if profile:
        # 2. Tentukan field mana saja yang boleh di-update (Sesuai kolom di DB)
        allowed_fields = ["name", "role", "email", "id_emp", "monthly_target"]
        
        # 3. Lakukan update hanya untuk field yang diizinkan
        for key, value in data.items():
            if key in allowed_fields:
                setattr(profile, key, value)
        
        db.commit()
        db.refresh(profile)
    
    return profile

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user_data: dict):
    hashed_pwd = auth.get_password_hash(user_data['password'])
    db_user = models.User(username=user_data['username'], hashed_password=hashed_pwd)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Otomatis buatkan profil kosong saat user daftar
    db_profile = models.UserProfile(
        user_id=db_user.id, 
        name=db_user.username, # Default pake username dulu
        role="Junior Sales",
        email=f"{db_user.username}@bank-asah.co.id",
        id_emp=f"SLS-{db_user.id}"
    )
    db.add(db_profile)
    db.commit()
    
    return db_user