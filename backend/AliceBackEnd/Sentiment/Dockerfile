FROM python:3.6.7-slim
WORKDIR /app
ADD . /app
RUN apt-get update
RUN apt install -y default-libmysqlclient-dev
RUN apt-get -y install gcc
RUN pip install --upgrade pip
RUN pip install --default-timeout=100 future
RUN pip install -r requirements.txt
EXPOSE 5050
CMD ["python3", "app.py"]
