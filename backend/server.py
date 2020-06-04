from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import random
from RunAlice import runAlice

app = Flask(__name__)
cors = CORS(app)

@app.route("/")
def mainPage():
    return f"<h1>Hello</h1>"

@app.route("/uploadFile", methods=["GET", "POST"])
def receiveFile():
    file = request.files['file']
    text = file.read()
    text = str(text)
    text = text.replace("b", "", 1)
    returnJson = runAlice(text)
    returnJson = jsonify(returnJson)
    return returnJson

@app.route("/uploadText", methods=["GET","POST"])
def receiveText():
    data = request.get_json()
    text = data['data']
    returnJson = runAlice(text)
    returnJson = jsonify(returnJson)
    return returnJson




if __name__ == "__main__":
    app.run(debug=True)