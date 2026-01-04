FROM python:3.9

# Buat user baru agar aman di HF
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:${PATH}"

WORKDIR /app

# Salin requirements dan install
COPY --chown=user:user requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Salin seluruh kode backend
COPY --chown=user:user . .

# HF Spaces berjalan di port 7860 secara default
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]