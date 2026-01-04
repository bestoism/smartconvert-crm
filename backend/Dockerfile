# Gunakan image Python standar
FROM python:3.9-slim

# Set working directory
WORKDIR /code

# Copy requirements dan install
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy semua file backend
COPY . /code

# Jalankan FastAPI lewat Uvicorn
# Hugging Face mendengarkan pada port 7860 secara default
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]