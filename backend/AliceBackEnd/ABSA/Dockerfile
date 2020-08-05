FROM python:3.6-slim

WORKDIR /app

ADD . /app

RUN pip install gdown

#RUN gdown https://drive.google.com/u/0/uc?id=1f39YozZez4cVIGPXy32tpm7_qTF5U9D8

RUN pip install -r requirements.txt

EXPOSE 5090

CMD ["python3", "app.py"]



