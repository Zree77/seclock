FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY crypto_engine.py .
COPY ocr_engine.py .
COPY audit_ledger.py .
COPY generate_certificates.py .

COPY static/ ./static/
COPY sample_certificates/ ./sample_certificates/

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
