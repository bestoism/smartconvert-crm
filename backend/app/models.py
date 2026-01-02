from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    # Relasi ke Profile (One-to-One)
    # uselist=False memastikan satu user hanya punya satu profil
    profile = relationship("UserProfile", back_populates="owner", uselist=False)

class UserProfile(Base):
    __tablename__ = "user_profile"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id")) # Menghubungkan ke tabel users
    
    name = Column(String, default="Sales User")
    role = Column(String, default="Senior Sales Representative")
    email = Column(String, default="sales@bank-asah.co.id")
    id_emp = Column(String, default="SLS-2025-001")
    monthly_target = Column(Integer, default=150)
    joined_date = Column(DateTime, server_default=func.now())

    # Relasi balik ke User
    owner = relationship("User", back_populates="profile")

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    
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
    
    # Campaign info
    campaign = Column(Integer)
    pdays = Column(Integer)
    previous = Column(Integer)
    poutcome = Column(String)
    
    # Socio-economic context
    emp_var_rate = Column(Float)
    cons_price_idx = Column(Float)
    cons_conf_idx = Column(Float)
    euribor3m = Column(Float)
    nr_employed = Column(Float)

    # Financial & Notes (Added in Step 7/8)
    balance = Column(Float, default=0.0)
    notes = Column(String, nullable=True)

    # Prediction Results
    prediction_score = Column(Float, nullable=True)
    prediction_label = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())