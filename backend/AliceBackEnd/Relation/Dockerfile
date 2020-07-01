FROM python:3.6-slim
WORKDIR /app
ADD . /app
RUN apt-get update && \
    apt-get install -y wget
RUN pip3 install -r requirements.txt
RUN python3 -m nltk.downloader punkt
RUN python3 setup.py install
RUN chmod +x ./start.sh && ./start.sh
EXPOSE 5010
CMD ["python3", "app.py" ]
