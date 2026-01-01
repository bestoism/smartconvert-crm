from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Base Schema (Data dasar nasabah)
class LeadBase(BaseModel):
    age: int
    job: str
    marital: str
    education: str
    default: str
    housing: str
    loan: str
    contact: str
    month: str
    day_of_week: str
    campaign: int
    pdays: int
    previous: int
    poutcome: str
    emp_var_rate: float
    cons_price_idx: float
    cons_conf_idx: float
    euribor3m: float
    nr_employed: float

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