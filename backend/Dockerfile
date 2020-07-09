FROM python:3-slim
ADD . /code
WORKDIR /code
RUN pip3 install -r requirements.txt
RUN pip3 install pymongo[srv]
EXPOSE 5000
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:5000", "wsgi:app"]

