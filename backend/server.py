from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
import random
from RunAlice import runAlice
from AliceBackEnd.TopicModelling.WordCloud import show_wordcloud
import io
import base64

app = Flask(__name__)
cors = CORS(app)
app.config['MONGO_URI'] = 'mongodb+srv://alice_guest:aliceandjarvis@alice-onmay.mongodb.net/Alice_Corpus?retryWrites=true&w=majority'
mongo = PyMongo(app)


def getWordCloud(text):
    image = show_wordcloud(text)
    file_object = io.BytesIO()
    image.save(file_object, format='PNG')
    bytestring = base64.b64encode(file_object.getvalue())
    return bytestring.decode('utf-8')

@app.route("/")
def mainPage():
    return f"<h1>Hello World</h1>"

@app.route("/uploadFile", methods=["GET", "POST"])
def receiveFile():
    file = request.files['file']
    text = file.read()
    print("type", type(text))
    text = text.decode('cp1251')
    returnJson= runAlice(text)
    returnJson['wordcloud'] = getWordCloud(text)
    returnJson = jsonify(returnJson)
    return returnJson

@app.route("/uploadText", methods=["GET","POST"])
def receiveText():
    data = request.get_json()
    text = data['data']
    returnJson = runAlice(text)
    returnJson['wordcloud'] = getWordCloud(text)
    returnJson = jsonify(returnJson)
    return returnJson

@app.route("/saveConfig", methods=["GET","POST"])
def saveConfig():
    data = request.get_json()
    res = mongo.db.collection.insert_one(data)
    res_id = str(res.inserted_id)
    print(res_id)
    return res_id

if __name__ == "__main__":
    app.run(debug=True)