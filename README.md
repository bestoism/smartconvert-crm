# SmartConvert: End-to-End Predictive Lead Scoring CRM 🚀

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![XGBoost](https://img.shields.io/badge/ML-XGBoost-EB6024?style=for-the-badge)](https://xgboost.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/XAI-SHAP-blueviolet?style=for-the-badge)](https://shap.readthedocs.io/)

**SmartConvert** is a sophisticated Fullstack CRM application designed for banking sales teams. It leverages Machine Learning to predict the probability of a customer subscribing to a term deposit, provides transparent explanations for every prediction using **Explainable AI (XAI)**, and manages the entire sales follow-up workflow.

This project was developed as part of the **Independent Study Program (MSIB)** in collaboration with **PT Dicoding Akademi Indonesia** and serves as a portfolio for academic conversion at **Universitas Negeri Surabaya (UNESA)**.

---

## 📖 The Journey: From Data to Deployment

This project documents a rigorous engineering journey, transitioning from a theoretical model to a production-ready system.

### 1. The Critical Turning Point (V1 vs V2)
Initially, the project produced a model with ~91% accuracy (V1). However, deep analysis revealed **Data Leakage**; the model was using the `duration` feature (call length), which is unknown before a call is made. 
*   **The Solution:** I performed a complete "re-modeling" (V2), removing leaky features and engineering a new feature: `was_contacted` (`pernah_dihubungi`).
*   **The Result:** A valid, honest, and business-ready model that predicts outcomes **before** the sales agent picks up the phone.

### 2. Fullstack Architecture
To satisfy Software Engineering (RPL) requirements, the project evolved from simple scripts into a **Decoupled Client-Server Architecture**:
*   **Backend:** A robust API built with FastAPI, managing data persistence and ML inference.
*   **Frontend:** A modern, interactive dashboard built with React and Chakra UI.

---

## 🌟 Key Features

*   **🔐 Secure Authentication:** JWT-based login system with hashed passwords using Bcrypt.
*   **📊 Business Intelligence Dashboard:** Interactive charts (Donut, Bar, Area) visualizing lead distribution, demographics (Age, Job, Education), and economic context.
*   **📁 Batch Lead Processing:** Upload thousands of customer records via CSV and get instant AI predictions.
*   **🧠 Explainable AI (XAI):** A dedicated detail page for every lead showing **SHAP Values**—explaining *why* the AI gave a specific score.
*   **📞 Next Best Conversation:** Automated sales recommendations based on the top influencing factors.
*   **📝 Sales Follow-up System:** Real-time activity logs and a note-taking system to track sales progress.

---

## 🛠️ Tech Stack

### Data Science & ML
*   **Modeling:** XGBoost (Tuned with GridSearchCV)
*   **Interpretation:** SHAP (SHapley Additive exPlanations)
*   **Analysis:** Pandas, NumPy, Matplotlib, Seaborn
*   **Environment:** Jupyter Notebooks

### Backend (The "Engine")
*   **Framework:** FastAPI (Python)
*   **Database:** SQLite with SQLAlchemy ORM
*   **Security:** JWT (python-jose), Passlib (Bcrypt)
*   **Data Validation:** Pydantic

### Frontend (The "Face")
*   **Framework:** React.js (Vite)
*   **UI Library:** Chakra UI (Dark Mode support)
*   **Charts:** Recharts
*   **State Management:** React Hooks (useEffect, useState)

---

## 📂 Project Structure

```text
SmartConvert-CRM/
├── backend/
│   ├── app/
│   │   ├── ml_assets/       # Model (.pkl) and Feature Config (.json)
│   │   ├── auth.py          # Security and JWT Logic
│   │   ├── crud.py          # Database Transactions
│   │   ├── main.py          # FastAPI Endpoints & CORS
│   │   ├── models.py        # SQLAlchemy Database Schemas
│   │   ├── schemas.py       # Pydantic Data Validation
│   │   └── ml_service.py    # ML Inference & SHAP Logic
│   ├── .env                 # Environment Variables (Secret Keys)
│   └── crm.db               # SQLite Database
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (Sidebar, etc)
│   │   ├── pages/           # Dashboard, Leads, Detail, Login, Profile
│   │   ├── api.js           # Central Axios Configuration
│   │   └── main.jsx         # App Entry & Provider Setup
├── notebooks/               # EDA & Modeling Documentation (V1 & V2)
└── README.md
```

---

## 🚀 Getting Started

### Backend Setup
1. Navigate to `/backend`.
2. Create virtual environment: `python -m venv venv`.
3. Activate venv: `venv\Scripts\activate` (Windows).
4. Install dependencies: `pip install -r requirements.txt`.
5. Create a `.env` file based on `.env.example`.
6. Run server: `uvicorn app.main:app --reload`.

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Run development server: `npm run dev`.
4. Open `http://localhost:5173` in your browser.

---

## 🎓 Academic Conversion Mapping (UNESA)

This project fulfills the requirements for the following courses:
*   **Arsitektur Perangkat Lunak:** Implementation of Decoupled Client-Server Architecture and RESTful API.
*   **Intelegensia Bisnis:** Data aggregation and visualization of market trends and AI performance.
*   **Kecerdasan Komputasional:** End-to-end ML lifecycle, including hyperparameter tuning and XAI.
*   **Desain Antarmuka (UX):** Modern, responsive, and intuitive CRM design with minimal interaction cost.
*   **Rekayasa Kebutuhan:** Functional requirements implementation including security, batch processing, and data management.

---

**Developed by Ryan Besto Saragih – 2026**