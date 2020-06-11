FROM debian:stable-slim
ADD . /code
WORKDIR /code

RUN apt-get update
RUN apt-get install -y apt-transport-https

RUN apt-get install -y curl
RUN apt-get install -y python-pip

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install requests
EXPOSE 5000
CMD ["python", "mainWeb.py"]

