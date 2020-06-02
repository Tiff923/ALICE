from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import random

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




if __name__ == "__main__":
    app.run(debug=True)