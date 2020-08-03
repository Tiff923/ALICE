FROM python:3-slim
ADD . /code
WORKDIR /code
RUN pip3 install -r requirements.txt
RUN pip3 install pymongo[srv]
RUN python3 -m nltk.downloader punkt
EXPOSE 5000
CMD ["python3", "app.py"]