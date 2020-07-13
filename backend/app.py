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
import threading

app = Flask(__name__)
cors = CORS(app)
app.config['MONGO_URI'] = 'mongodb+srv://alice_guest:aliceandjarvis@alice-onmay.mongodb.net/Alice_Corpus?retryWrites=true&w=majority'
app.config['SECRET_KEY'] = "a very secret key"
mongo = PyMongo(app)
print("server started", flush=True)


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



class dataClass():
    def __init__(self):
        self.returnJsonLock = threading.Lock()
        self.returnJson = {}  
        self.corpusEntity = {}
        self.corpusEntityLock = threading.Lock()
        self.corpusRelation = []
        self.corpusRelationLock = threading.Lock()
        self.users = 0

    
def saveResults(data):
    res = mongo.db.collection.insert_one(data)
    res_id = res.inserted_id
    return res_id





@app.route("/uploadFile", methods=["GET", "POST"])
def receiveFile():
    data = dataClass()
    print(f"New file, creating new dataclass. Data: {data.corpusEntity}", flush=True) 
    print("Receiving File", flush=True)
    length = int(request.form['length'])
    fileNames = json.loads(request.form['fileNames'])
    corpus = []
    threads = []
    for i in range(length):
        file = request.files[f'file{i}']

        # Get filename
        fileName = fileNames[i]

        # Get file extension
        name, extension = os.path.splitext(fileName)
        print('POST SUCCESSFUL', fileName, flush=True)
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
        corpus.append(text)
        thread = threading.Thread(target=thread_task, args=(text,fileName, i, data))
        thread.start()
        threads.append(thread)
    
    for thread in threads:
        try:
            thread.join()
        except Exception as err:
            print("Error in joining: " + err, flush=True)
    print("All threads finished", flush=True)

    try:
        if length > 1:
            data.returnJson['Overview'] = getOverview(corpus, data.corpusEntity, data.corpusRelation, fileNames)
        returnDict = data.returnJson
        returnJson = jsonify(returnDict)
    except Exception as err:
        print(f"Error in completing overview: {err}", flush=True)

    try:
        saveResults(returnDict)
    except Exception as err:
        print(f"Error in saving to database: {err}", flush=True)

    return returnJson


def thread_task(text, fileName, number, data):
    print(f"Thread {number} running", flush=True)
    try:
        tempJson = runAlice(text)
        newRelation = tempJson['relation'].copy()
        ##Semaphore this later
        data.returnJsonLock.acquire()
        data.returnJson[fileName] = tempJson
        data.returnJsonLock.release()
        ##Semaphore this later as well
        tempEntity = tempJson['ner']['ents']
        for entity in tempEntity:
            key = entity['text']+'_'+entity['type']
            data.corpusEntityLock.acquire()
            if key in data.corpusEntity:
                data.corpusEntity[key]['value'] += 1
                data.corpusEntity[key]['documents'].add(fileName)
            else:
                data.corpusEntity[key] = {
                    'id': entity['text'],
                    'label': entity['text'],
                    'value': 1,
                    'documents': set([fileName]),
                    'type': entity['type'],
                    'color': nercolors[entity['type']]
                }
            data.corpusEntityLock.release()

        for relation in newRelation:
            relation['documents'] = [fileName]
            ##Semaphore this
            data.corpusRelationLock.acquire()
            data.corpusRelation.append(relation)
            data.corpusRelationLock.release()
        print(f"Thread {number} finish", flush=True)

    except Exception as err:
        print(err, "occured in "+fileName + " in thread " + str(number), flush=True)
    except:
        print('Unknown error in'+fileName, flush=True)




def getOverview(corpus, corpusEntity, corpusRelation, fileNames):
    print('Start overview', flush=True)
    text = ' '.join(corpus)
    text = text.replace("\\x92", "")
    text = text.replace("\\x93", "")
    text = text.replace("\\x94", "")
    num_words = len(text.split(' '))

    # Cluster
    print("sending cluster", flush=True)
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
    print("Overview finished", flush=True)
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
    
    # Topic Modelling
    print("Sending topic")
    topicJson = postTopicRequest([text], 1, 10)
    topics = topicJson['topics']
    print("receive topic")
    
     # Sentiment
    sentimentJson = postSentimentRequest(text)
    sentimentList = sentimentJson["sentiment"]
    key_data_sentiment = sentimentList[0]["sentiment"]
    key_data_legitimacy = sentimentList[1]["sentiment"]
    sentimentList[0]["sentiment"] = "sentiment"
    sentimentList[1]["sentiment"] = "subjective"

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
    
     # Summary
    print("Sending to summary")
    summaryJson = postSummaryRequest(text, 3)
    summary = summaryJson["summary"]
    print("Receive from summary")
    
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
    try:
        url = "http://summary-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/textSummarizer"
        requestJson = {"text": text, "no_of_sentence": no_of_sentence}
        result = requests.post(url, json=requestJson)
        result = result.json()
    except Exception as err:
        print(f"Error in Summary: {err}", flush=True)
    return result


def postSentimentRequest(text):
    try:
        url = "http://sentiment-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/sentiment"
        requestJson = {"text": text}
        result = requests.post(url, json=requestJson)
        result = result.json()
    except Exception as err:
        print(f"Error in Sentiment: {err}", flush=True)
    return result


def postNerRequest(text):
    try:
        url = "http://ner-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/ner"
        requestJson = {"text": text}
        result = requests.post(url, json=requestJson)
        result = result.json()
    except Exception as err:
        print(f"Error in NER: {err}", flush=True)
    return result


def postRelationRequest(ner):
    try:
        url = "http://relation-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/relation"
        requestJson = {"ner": ner}
        result = requests.post(url, json=requestJson)
        result = result.json()
    except Exception as err:
        print(f"Error in Relation: {err}", flush=True)
    return result


def postTopicRequest(text, no_topic, no_top_words):
    try:
        url = "http://topics-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/topic_modelling"
        requestJson = {"document": text, "no_topic": no_topic, "no_top_words": no_top_words}
        result = requests.post(url, json=requestJson)
        result = result.json()
    except Exception as err:
        print(f"Error in Topic: {err}", flush=True)
    return result


def postClassifierRequest(text):
    try:
        url = "http://classifier-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/classifier"
        requestJson = {"document": text}
        result = requests.post(url, json=requestJson)
        result = result.json()
    except Exception as err:
        print(f"Error in Classifier: {err}", flush=True)
    return result


def postWordCloud(text):
    try:
        url = "http://wordcloud-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/wordcloud"
        requestJson = {"data": text}
        result = requests.post(url, json=requestJson)
        result = result.json()
    except Exception as err:
        print(f"Error in WordCloud: {err}", flush=True)
    return result


def postCluster(corpus):
    try:
        url = "http://clustering-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/cluster"
        result = requests.post(url, json=corpus)
        result = result.json()
    except Exception as err:
        print(f"Error in Clustering: {err}", flush=True)
    return result


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5000, threaded=True)
