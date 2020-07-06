from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
import jwt
import random
import json
from utils import nercolors, relationToNetwork, overviewRelationToNetwork
import requests
import os
import pdfplumber
import chardet
import re
import datetime

app = Flask(__name__)
cors = CORS(app)
app.config['MONGO_URI'] = 'mongodb+srv://alice_guest:aliceandjarvis@alice-onmay.mongodb.net/Alice_Corpus?retryWrites=true&w=majority'
app.config['SECRET_KEY'] = "a very secret key"
mongo = PyMongo(app)
print("server started")


@app.route("/")
def mainPage():
    return f"<h1>Hello World</h1>"


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]
    userData = (mongo.db.Authentication.find_one({"Username": username}))
    if (userData != None):
        if (password == userData["Password"]):
            role = userData["Role"]
            token = jwt.encode({"user": username,
                                "exp": datetime.datetime.now() + datetime.timedelta(hours=3)},
                               app.config['SECRET_KEY'], algorithm="HS256")
            return jsonify({"token": token.decode('UTF-8'), "validity": "valid", "Role": role})
    return jsonify({"validity": "invalid"})


def authenticateUser(token):
    payload = jwt.decode(token, app.config["SECRET_KEY"], algorithm="HS256")
    creatorUser = payload['user']
    userData = mongo.db.Authentication.find_one({"Username": creatorUser})
    creatorRole = userData["Role"]
    if creatorRole == "Admin":
        return True
    else:
        return False


def findUser(user):
    exist = mongo.db.Authentication.find_one({'Username': user})
    if (exist == None):
        return False
    else:
        return True


@app.route("/create", methods=["POST"])
def createAcc():
    data = request.json
    try:
        creatorToken = data["creator"]
        if(authenticateUser(creatorToken) == False):
            return "invalid"
        userName = data['username']
        password = data['password']
        role = data['role']
        exist = findUser(userName)
        if (exist == True):
            return "exist"
        else:
            accountJson = {'Username': userName, 'Password': password, 'Role': role}
            result = mongo.db.Authentication.insert_one(accountJson)
            print(result)
            return "success"
    except:
        return "error"


@app.route("/uploadFile", methods=["GET", "POST"])
def receiveFile():
    print("Receiving File")
    length = int(request.form['length'])
    returnJson = {}
    fileNames = json.loads(request.form['fileNames'])

    corpus = []
    corpusEntity = {}
    # corpusPassToRelation = []
    corpusRelation = []
    for i in range(length):
        file = request.files[f'file{i}']

        # Get filename
        fileName = fileNames[i]

        # Get file extension
        name, extension = os.path.splitext(fileName)
        print('POST SUCCESSFUL', fileName)
        try:
            if extension == '.txt':
                byteString = file.read()
                encoding = chardet.detect(byteString)['encoding']
                text = byteString.decode(encoding)
            elif extension == '.pdf':
                text = ''
                with pdfplumber.load(file) as pdf:
                    for page in pdf.pages:
                        text += page.extract_text()
            text = re.sub('\\\\', '', text)
            tempJson = runAlice(text)
            returnJson[fileName] = tempJson

            tempEntity = tempJson['ner']['ents']
            for entity in tempEntity:
                key = entity['text']+'_'+entity['type']
                if key in corpusEntity:
                    corpusEntity[key]['value'] += 1
                    corpusEntity[key]['documents'].add(fileName)
                else:
                    corpusEntity[key] = {
                        'id': entity['text'],
                        'label': entity['text'],
                        'value': 1,
                        'documents': set([fileName]),
                        'type': entity['type'],
                        'color': nercolors[entity['type']]
                    }
            # corpusPassToRelation.extend(tempJson['ner'].pop('passToRelation'))
            corpus.append(text)

            newRelation = tempJson['relation'].copy()
            for relation in newRelation:
                relation['documents'] = [fileName]
                corpusRelation.append(relation)

        except Exception as err:
            print(err, "occured in"+fileName)
        except:
            print('Unknown error in'+fileName)
    if length > 1:
        returnJson['Overview'] = getOverview(corpus, corpusEntity, corpusRelation, fileNames)
    print('RESULT', json.dumps(returnJson))
    returnJson = jsonify(returnJson)
    return returnJson


def getOverview(corpus, corpusEntity, corpusRelation, fileNames):
    print('Start overview')
    text = ' '.join(corpus)
    text = text.replace("\\x92", "")
    text = text.replace("\\x93", "")
    text = text.replace("\\x94", "")
    num_words = len(text.split(' '))

    # Cluster
    print("sending cluster")
    sendJson = {"corpus": corpus, "fileNames": fileNames}
    clusterJson = postCluster(sendJson)
    cluster = clusterJson['clusterData']
    print('receive cluster')

    # NER
    print("Send to NER")
    ner = list(corpusEntity.values())
    for entity in ner:
        entity['documents'] = list(entity['documents'])
    print("Receive from NER")

    # Network
    print("start relation network")
    network = overviewRelationToNetwork(corpusRelation, corpusEntity)
    print("finished relation network")

    # Sentiment
    sentimentJson = postSentimentRequest(text)
    sentimentList = sentimentJson["sentiment"]
    key_data_sentiment = sentimentList[0]["sentiment"]
    key_data_legitimacy = sentimentList[1]["sentiment"]
    sentimentList[0]["sentiment"] = "sentiment"
    sentimentList[1]["sentiment"] = "subjective"

    # Topic Modelling
    print("Sending topic")
    topicJson = postTopicRequest(corpus, 3, 10)
    topics = topicJson['topics']
    print("receive topic")

    # Classifier
    print("sending classifier")
    classifyJson = postClassifierRequest(text)
    classify = classifyJson['classify']
    print("receive classifier")

    # Word cloud
    print("sending wordcloud")
    bytestringJson = postWordCloud(text)
    wordcloud = bytestringJson['data']
    print("receive wordcloud")

    # Key Data
    print('doing key data stuff')
    key_data_classification = classify
    keyData = {"num_words": num_words, "topic_classifier": key_data_classification, "sentiment": key_data_sentiment,
               "legitimacy": key_data_legitimacy}

    jsonToReact = {}
    jsonToReact["keyData"] = keyData
    jsonToReact['ner'] = ner
    jsonToReact['relation'] = corpusRelation
    jsonToReact['sentiment'] = sentimentList
    jsonToReact['topics'] = topics
    jsonToReact['classify'] = classify
    jsonToReact['network'] = network
    jsonToReact['wordcloud'] = wordcloud
    jsonToReact["cluster"] = cluster
    print("Overview finished")
    return jsonToReact


@app.route("/saveConfig", methods=["GET", "POST"])
def saveConfig():
    data = request.get_json()
    res = mongo.db.collection.insert_one(data)
    res_id = str(res.inserted_id)
    print(res_id)
    return res_id


def runAlice(text):
    text = text.replace("\\x92", "")
    text = text.replace("\\x93", "")
    text = text.replace("\\x94", "")
    num_words = len(text.split(' '))

    # NER
    print("Sending to NER")
    nerJson = postNerRequest(text)
    ner = nerJson['ner']
    passToRelation = ner.pop('passToRelation')
    print("Receive from NER")

    # Relation
    print("Send to relation")
    relationJson = postRelationRequest(passToRelation)
    relation = relationJson['relation']
    print("Receive from Relation")

    # Network
    print("start relation network")
    network = relationToNetwork(relation)
    print("finished relation network")

    # Sentiment
    sentimentJson = postSentimentRequest(text)
    sentimentList = sentimentJson["sentiment"]
    key_data_sentiment = sentimentList[0]["sentiment"]
    key_data_legitimacy = sentimentList[1]["sentiment"]
    sentimentList[0]["sentiment"] = "sentiment"
    sentimentList[1]["sentiment"] = "subjective"

    # Summary
    print("Sending to summary")
    summaryJson = postSummaryRequest(text, 3)
    summary = summaryJson["summary"]
    print("Receive from summary")

    # Topic Modelling
    print("Sending topic")
    topicJson = postTopicRequest([text], 1, 10)
    topics = topicJson['topics']
    print("receive topic")

    # Classifier
    print("sending classifier")
    classifyJson = postClassifierRequest(text)
    classify = classifyJson['classify']
    print("receive classifier")

    # Word cloud
    print("sending wordcloud")
    bytestringJson = postWordCloud(text)
    wordcloud = bytestringJson['data']
    print("receive wordcloud")

    # Key Data
    print('doing key data stuff')
    key_data_classification = classify
    keyData = {"num_words": num_words, "topic_classifier": key_data_classification, "sentiment": key_data_sentiment,
               "legitimacy": key_data_legitimacy}

    jsonToReact = {}
    jsonToReact["keyData"] = keyData
    jsonToReact['sentiment'] = sentimentList
    jsonToReact['summary'] = summary
    jsonToReact['topics'] = topics
    jsonToReact['classify'] = classify
    jsonToReact['ner'] = ner
    jsonToReact['relation'] = relation
    jsonToReact['network'] = network
    jsonToReact['wordcloud'] = wordcloud
    return jsonToReact


def postSummaryRequest(text, no_of_sentence):
    url = "http://summary-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/textSummarizer"
    requestJson = {"text": text, "no_of_sentence": no_of_sentence}
    result = requests.post(url, json=requestJson)
    return result.json()


def postSentimentRequest(text):
    url = "http://sentiment-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/sentiment"
    print(f"Sentiment {url}")
    requestJson = {"text": text}
    result = requests.post(url, json=requestJson)
    return result.json()


def postNerRequest(text):
    url = "http://ner-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/ner"
    requestJson = {"text": text}
    result = requests.post(url, json=requestJson)
    return result.json()


def postRelationRequest(ner):
    url = "http://relation-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/relation"
    requestJson = {"ner": ner}
    result = requests.post(url, json=requestJson)
    return result.json()


def postTopicRequest(text, no_topic, no_top_words):
    url = "http://topics-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/topic_modelling"
    requestJson = {"document": text, "no_topic": no_topic, "no_top_words": no_top_words}
    result = requests.post(url, json=requestJson)
    return result.json()


def postClassifierRequest(text):
    url = "http://classifier-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/classifier"
    requestJson = {"document": text}
    result = requests.post(url, json=requestJson)
    return result.json()


def postWordCloud(text):
    url = "http://wordcloud-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/wordcloud"
    requestJson = {"data": text}
    result = requests.post(url, json=requestJson)
    return result.json()


def postCluster(corpus):
    url = "http://clustering-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/cluster"
    result = requests.post(url, json=corpus)
    print("result in server: ", result)
    return result.json()


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5000, threaded=True)
