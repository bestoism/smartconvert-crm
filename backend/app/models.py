from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from .database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    
    # --- Input Features (Bank Marketing Dataset) ---
    # Client demographics
    age = Column(Integer)
    job = Column(String)
    marital = Column(String)
    education = Column(String)
    default = Column(String)
    housing = Column(String)
    loan = Column(String)
    
    # Last contact info
    contact = Column(String)
    month = Column(String)
    day_of_week = Column(String)
    
    # Campaign info (No 'duration' because it's leakage!)
    campaign = Column(Integer)
    pdays = Column(Integer) # We will transform this to 'pernah_dihubungi' logic later
    previous = Column(Integer)
    poutcome = Column(String)
    
    # Socio-economic context
    emp_var_rate = Column(Float)
    cons_price_idx = Column(Float)
    cons_conf_idx = Column(Float)
    euribor3m = Column(Float)
    nr_employed = Column(Float)

    # --- Prediction Results (Output) ---
    prediction_score = Column(Float, nullable=True) # Probability (e.g., 0.85)
    prediction_label = Column(String, nullable=True) # "High Potential" / "Low Potential"
    shap_explanation = Column(String, nullable=True) # JSON string for top influencing factors
    
    # --- System Info ---
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    balance = Column(Float, default=0.0) # Saldo Nasabah
    notes = Column(String, nullable=True) # Catatan dari Tim Sales
    
class UserProfile(Base):
        __tablename__ = "user_profile"

        id = Column(Integer, primary_key=True, index=True)
        name = Column(String, default="Ryan Besto Saragih")
        role = Column(String, default="Senior Sales Representative")
        email = Column(String, default="sales01@bank-asah.co.id")
        id_emp = Column(String, default="SLS-2025-088")
        monthly_target = Column(Integer, default=150)
        joined_date = Column(DateTime, server_default=func.now())