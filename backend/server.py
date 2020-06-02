from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import random
from .Sentiment import SentimentAnalysis

app = Flask(__name__)
cors = CORS(app)

@app.route("/")
def mainPage():
    return f"<h1>Hello</h1>"

@app.route("/testReceive", methods=['GET', 'POST'])
def receive():
    data = request.get_json(force = True)
    print(data)
    requestType = data["request"]
    text = data["data"]
    returnMsg = f"data received:\n request = {requestType} \ndata = {text}"
    print(returnMsg)
    
    return returnMsg

@app.route("/testSend", methods=['GET', 'POST'])
def send():
    idNumber = random.randint(10000,100000000)
    sendData = {"request": "TestReceive", "id": idNumber}
    return jsonify(sendData)

@app.route("/uploadFile", methods=["GET", "POST"])
def receiveFile():
    file = request.files['file']
    text = file.read()
    text = text.decode("utf-8")
    sentiment = SentimentAnalysis.getSentiment(text)
    print(sentiment)
    return f"<h1>Success</h1>"

@app.route("/uploadText", methods=["GET","POST"])
def receiveText():
    data = request.get_json()
    text = data['data']
    print(text)
    return f"<h1>Success</h1>"




if __name__ == "__main__":
    app.run(debug=True)