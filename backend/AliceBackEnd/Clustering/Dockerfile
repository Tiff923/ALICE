FROM python:3.6-slim
WORKDIR /app
ADD . /app
RUN pip install -r requirements.txt
EXPOSE 5080
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:5080", "wsgi:app"]
