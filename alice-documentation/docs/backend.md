# Flask-Python Backend

![flaskpython-logo](./img/backend/flaskpython-logo.jpeg)

## Structure

The backend flask module links all the machine learning (ML) modules together. After receiving a POST request from the frontend, the backend will run the text through the respective ML modules and return the output to the frontend.

`backend/app.py`

```python
# Sentiment
def postSentimentRequest(text):
    # If using Openshift
    url = "http://sentiment-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/sentiment"
    # If running locally using Docker Compose
    url = 'http://sentiment:5050/sentiment
    requestJson = {"text": text}
    result = requests.post(url, json=requestJson)
    return result.json()

# NER
def postNerRequest(text):

# Relation
def postRelationRequest(ner):

# Topic Modelling
def postTopicRequest(text, no_topic, no_top_words):

# Text Classifier
def postClassifierRequest(text):

# Wordcloud
def postWordCloud(text):

# Document Clustering
def postCluster(corpus):
```

## Routes

`@app.route("/")` is a Python decorator that Flask provides to assign URLs in our app to functions easily. The decorator executes a function whenever a user visits the domain at the given .route(<route_name>).

E.g. The function `loadExistingFile()` is executed whenever the route `/loadExistingFile` is accessed.

```python
@app.route("/loadExistingFile", methods=["POST"])
def loadExistingFile():
    ...
```

### /loadDbFile

The path accessed when the user inputs a MongoDB ObjectID.

```python
@app.route("/loadDbFile", methods=["POST"])
def dbRetrieval():
    try:
        ...

        data = mongo.db.Documents.find_one({"_id": objectID}) # Access MongoDB and retrieve the document based on the ObjectID
        ...
    except Exception as err:
        print(f"Error retrieving data from database: {err}", flush=True)
        returnJson = {"Error": err}
    return returnJson
```

### /loadExistingFile

The path accessed when the user inputs an existing .json file.

```python
@app.route("/loadExistingFile", methods=["POST"])
def loadExistingFile():
    file = request.files['existingFile']
    jsonData = json.loads(file.read())
    return jsonData
```

### /updateNetwork

The path accessed when the relation data is updated and sent to the backend. The corresponding updated network data is generated and returned to the frontend.

```python
@app.route("/updateNetwork", methods=['POST'])
def updateNetwork():
    relationData = json.loads(request.form['relationData'])
    networkData = relationToNetwork(relationData)
    return json.JSONEncoder().encode(networkData)
```

### /uploadFile

### /saveToDb

## Parallel Branch (Threading)
