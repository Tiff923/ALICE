FROM python:3.6.7-slim
WORKDIR /app
ADD . /app

RUN pip install -r requirements.txt

RUN python -c "import nltk; nltk.download('punkt')"

RUN python -c "import nltk; nltk.download('wordnet')"

EXPOSE 5060

CMD ["python", "app.py"]
