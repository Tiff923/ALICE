FROM python:3.6.7-slim
WORKDIR /app
ADD . /app

RUN pip install -r requirements.txt

RUN python -m nltk.downloader punkt

RUN python -m nltk.downloader wordnet

EXPOSE 5060

CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:5060", "wsgi:app"]
