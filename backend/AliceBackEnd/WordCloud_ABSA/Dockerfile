# Use an official Python runtime as a parent image
FROM python:3.6-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Download nltk punkt, vader_lexicon
RUN python -c "import nltk; nltk.download('punkt')"
RUN python -c "import nltk; nltk.download('vader_lexicon')"

# Port used in container 
EXPOSE 5100

CMD ["python3", "app.py"]
