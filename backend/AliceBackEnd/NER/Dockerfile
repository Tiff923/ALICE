FROM python:3
WORKDIR /app
ADD . /app
RUN pip install -r requirements.txt
RUN python -m spacy download en
RUN python -m nltk.downloader punkt
RUN python -c 'import flair; _ = flair.models.SequenceTagger.load("ner-ontonotes-fast")'
EXPOSE 5020
CMD [ "python", "app.py" ]