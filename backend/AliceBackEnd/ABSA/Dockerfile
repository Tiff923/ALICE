FROM python:3.6-slim

WORKDIR /app

ADD . /app

RUN ./gdown.pl https://drive.google.com/file/d/1f39YozZez4cVIGPXy32tpm7_qTF5U9D8/view?usp=sharing aen_bert_restaurant_val_acc_0.8098

RUN pip install -r requirements.txt

EXPOSE 5090

CMD ["python3", "app.py"]



