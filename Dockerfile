FROM python:3.9-slim
WORKDIR /code
# Ambil requirements dari root
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
# Copy seluruh folder backend ke dalam container
COPY ./backend /code/backend
# Copy model assets juga agar terbaca
COPY ./backend/ml_assets /code/ml_assets
# Jalankan dari folder app di dalam backend
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "7860"]