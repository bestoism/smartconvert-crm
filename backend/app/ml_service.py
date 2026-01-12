import pandas as pd
import pickle
import json
import os
import shap # Pastikan library shap terinstall
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../ml_assets/xgboost_tuned_v2.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "../ml_assets/model_features.json")

class MLService:
    def __init__(self):
        self.model = None
        self.explainer = None # Siapkan tempat untuk SHAP Explainer
        self.EXPECTED_COLUMNS = []
        
        self.load_model()
        self.load_features()
        self.init_explainer() # Inisialisasi explainer

    def load_model(self):
        try:
            with open(MODEL_PATH, 'rb') as f:
                self.model = pickle.load(f)
            print("✅ Model loaded successfully")
        except Exception as e:
            print(f"❌ Error loading model: {e}")

    def load_features(self):
        try:
            with open(FEATURES_PATH, 'r') as f:
                self.EXPECTED_COLUMNS = json.load(f)
            print(f"✅ Features loaded successfully ({len(self.EXPECTED_COLUMNS)} features)")
        except Exception as e:
            print(f"❌ Error loading features json: {e}")
            self.EXPECTED_COLUMNS = []

    def init_explainer(self):
        """Inisialisasi SHAP TreeExplainer sekali saja biar cepat"""
        if self.model:
            try:
                self.explainer = shap.TreeExplainer(self.model)
                print("✅ SHAP Explainer initialized")
            except Exception as e:
                print(f"⚠️ Failed to init SHAP explainer: {e}")

    def preprocess_input(self, data: dict) -> pd.DataFrame:
        # 1. Buat DataFrame
        df = pd.DataFrame([data])
        
        # 2. Feature Engineering
        if 'pdays' in df.columns:
            df['pdays'] = pd.to_numeric(df['pdays'], errors='coerce').fillna(999)
            df['pernah_dihubungi'] = df['pdays'].apply(lambda x: 0 if x == 999 else 1)
            df = df.drop(columns=['pdays'])
        
        # 3. Encoding & Alignment
        df_encoded = pd.get_dummies(df, drop_first=True)
        final_df = pd.DataFrame(0, index=df.index, columns=self.EXPECTED_COLUMNS)
        
        for col in df_encoded.columns:
            # Normalisasi nama kolom (titik ke underscore) untuk matching
            col_fixed = col.replace('.', '_')
            # Cek kedua kemungkinan (nama asli atau nama fixed)
            if col in final_df.columns:
                final_df[col] = df_encoded[col]
            elif col_fixed in final_df.columns:
                final_df[col_fixed] = df_encoded[col]
                
        return final_df

    def predict(self, data: dict):
        if not self.model: return {"error": "Model not loaded"}
        
        try:
            processed_data = self.preprocess_input(data)
            probability = self.model.predict_proba(processed_data)[0][1]
            label = "High Potential" if probability > 0.7 else "Medium Potential" if probability > 0.3 else "Low Potential"
            
            return {"score": float(probability), "label": label}
        except Exception as e:
            return {"error": str(e)}

    def explain_prediction(self, data: dict):
        """
        Menghasilkan penjelasan SHAP values dan Rekomendasi Percakapan
        """
        if not self.explainer:
            return None

        try:
            processed_data = self.preprocess_input(data)
            shap_values = self.explainer.shap_values(processed_data)
            
            # XGBoost binary classification return array of shape (1, n_features)
            # Kita ambil index 0
            values = shap_values[0]
            
            # Buat list fitur dan dampaknya
            explanation = []
            for i, col_name in enumerate(self.EXPECTED_COLUMNS):
                impact = float(values[i])
                if abs(impact) > 0.05: # Ambil hanya yang berdampak signifikan
                    explanation.append({
                        "feature": col_name,
                        "impact": impact,
                        "value": float(processed_data.iloc[0, i])
                    })
            
            # Sort by absolute impact (terbesar ke terkecil)
            explanation.sort(key=lambda x: abs(x['impact']), reverse=True)
            
            # Generate Simple Insight / Script (Next Best Conversation)
            top_feature = explanation[0]['feature'] if explanation else ""
            recommendation = "Gali kebutuhan nasabah secara umum."
            
            if "nr_employed" in top_feature or "euribor" in top_feature:
                recommendation = "Buka percakapan dengan membahas kondisi ekonomi yang sedang stabil/bagus untuk investasi."
            elif "pernah_dihubungi" in top_feature:
                recommendation = "Sebutkan bahwa kita pernah menghubungi beliau sebelumnya dan ada penawaran baru."
            elif "age" in top_feature:
                recommendation = "Sesuaikan nada bicara dengan usia nasabah (pensiunan vs pekerja aktif)."
            
            return {
                "shap_values": explanation[:5], 
                "recommendation": recommendation
            }
            
        except Exception as e:
            print(f"Explain Error: {e}")
            return None

ml_service = MLService()