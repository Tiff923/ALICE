FROM python:3
WORKDIR /app
ADD . /app
RUN pip3 install -r requirements.txt
RUN python3 -m spacy download en
RUN python -c "import nltk; nltk.download('punkt')"
RUN python3 -c 'import flair; _ = flair.models.SequenceTagger.load("ner-ontonotes-fast")'
EXPOSE 5020
CMD [ "python3", "app.py" ]