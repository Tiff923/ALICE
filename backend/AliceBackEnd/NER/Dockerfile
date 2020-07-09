FROM python:3
WORKDIR /app
ADD . /app
RUN pip3 install -r requirements.txt
RUN python3 -m spacy download en
RUN python3 -m nltk.downloader punkt
RUN python3 -c 'import flair; _ = flair.models.SequenceTagger.load("ner-ontonotes-fast")'
EXPOSE 5020
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:5020", "wsgi:app"]
