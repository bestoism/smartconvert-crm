from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Base Schema (Data dasar nasabah)
class LeadBase(BaseModel):
    age: Optional[int] = None
    job: Optional[str] = None
    marital: Optional[str] = None
    education: Optional[str] = None
    default: Optional[str] = None
    housing: Optional[str] = None
    loan: Optional[str] = None
    contact: Optional[str] = None
    month: Optional[str] = None
    day_of_week: Optional[str] = None
    campaign: Optional[int] = None
    pdays: Optional[int] = None
    previous: Optional[int] = None
    poutcome: Optional[str] = None
    
    # INI YANG BIKIN ERROR TADI, KITA JADIKAN OPTIONAL
    emp_var_rate: Optional[float] = None
    cons_price_idx: Optional[float] = None
    cons_conf_idx: Optional[float] = None
    euribor3m: Optional[float] = None
    nr_employed: Optional[float] = None

# Schema untuk Create (sama dengan Base)
class LeadCreate(LeadBase):
    pass

# Schema untuk Response (Data yang dikirim balik ke Frontend)
class LeadResponse(LeadBase):
    id: int
    prediction_score: Optional[float] = None
    prediction_label: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True # Dulu orm_mode = True

# Schema untuk Dashboard Stats
class DashboardStats(BaseModel):
    total_leads: int
    high_potential: int
    medium_potential: int
    low_potential: int
    conversion_rate_estimate: float