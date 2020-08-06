# Use an official Python runtime as a parent image
FROM python:3.6-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Download nltk punkt, vader_lexicon
RUN python3 -m nltk.downloader punkt
RUN python3 -m nltk.downloader vader_lexicon

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Port used in container 
EXPOSE 5100

CMD ["python3", "app.py"]
