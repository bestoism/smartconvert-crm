from app.ml_service import ml_service

# Contoh data dummy (satu nasabah)
dummy_data = {
    "age": 30,
    "job": "admin.", # Perhatikan ada titik di akhir kalau dari dataset bank UCI
    "marital": "married",
    "education": "university.degree",
    "default": "no",
    "housing": "yes",
    "loan": "no",
    "contact": "cellular",
    "month": "may",
    "day_of_week": "mon",
    "campaign": 1,
    "pdays": 999, # Nanti harus jadi pernah_dihubungi = 0
    "previous": 0,
    "poutcome": "nonexistent",
    "emp_var_rate": -1.8,
    "cons_price_idx": 92.893,
    "cons_conf_idx": -46.2,
    "euribor3m": 1.2,
    "nr_employed": 5099.1
}

print("--- Testing Prediction ---")
result = ml_service.predict(dummy_data)
print("Result:", result)