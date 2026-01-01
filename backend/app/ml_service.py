import pandas as pd
import pickle
import json
import os

# Definisikan Path secara dinamis agar tidak error di OS berbeda
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../ml_assets/xgboost_tuned_v2.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "../ml_assets/model_features.json")

class MLService:
    def __init__(self):
        self.model = None
        self.EXPECTED_COLUMNS = []
        
        self.load_model()
        self.load_features()

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
            # Fallback kosong, nanti akan error saat predict jika ini gagal
            self.EXPECTED_COLUMNS = []

    def preprocess_input(self, data: dict) -> pd.DataFrame:
        """
        Mengubah dictionary input mentah menjadi DataFrame yang siap diprediksi.
        """
        # 1. Buat DataFrame dari input dictionary
        df = pd.DataFrame([data])
        
        # 2. Feature Engineering: 'pernah_dihubungi'
        if 'pdays' in df.columns:
            # Pastikan pdays numeric dulu
            df['pdays'] = pd.to_numeric(df['pdays'], errors='coerce').fillna(999)
            df['pernah_dihubungi'] = df['pdays'].apply(lambda x: 0 if x == 999 else 1)
            df = df.drop(columns=['pdays'])
        
        # 3. One Hot Encoding
        # Kita encode semua kolom kategorikal yang ada di data input
        # Note: Kita tidak perlu list manual kategori, pandas akan encode yang string
        df_encoded = pd.get_dummies(df, drop_first=True)
        
        # 4. Alignment (Penyelarasan Kolom) - INI BAGIAN PENTING
        # Kita buat frame kosong dengan kolom yang SAMA PERSIS dengan model_features.json
        final_df = pd.DataFrame(0, index=df.index, columns=self.EXPECTED_COLUMNS)
        
        # Masukkan data yang cocok namanya
        for col in df_encoded.columns:
            # Kadang get_dummies menghasilkan separator beda, atau nama sedikit beda
            # Tapi asumsi kita pakai data standar UCI, namanya akan match
            if col in final_df.columns:
                final_df[col] = df_encoded[col]
            else:
                # Debugging: Cek jika ada kolom yang terbuang (opsional)
                pass
                
        return final_df

    def predict(self, data: dict):
        if not self.model:
            return {"error": "Model not loaded"}
        
        if not self.EXPECTED_COLUMNS:
            return {"error": "Model features config not loaded"}
        
        try:
            # Preprocess
            processed_data = self.preprocess_input(data)
            
            # Predict Probability
            probability = self.model.predict_proba(processed_data)[0][1]
            
            # Labeling
            label = "High Potential" if probability > 0.7 else "Medium Potential" if probability > 0.3 else "Low Potential"
            
            return {
                "score": float(probability),
                "label": label
            }
        except Exception as e:
            import traceback
            traceback.print_exc() # Print error di terminal biar kelihatan
            return {"error": str(e)}

ml_service = MLService()