# Hosting on local computer

To host A.L.I.C.E. on a local computer, we use Docker Compose instead of Openshift. Follow the instructions on [Docker](./docker.md) to set it up.

In the root directory, run:

```bash
docker-compose build
docker-compose up
```

To complete the set-up, there are a few routes to change:

## `backend/app.py`

```python
def postSummaryRequest(text, no_of_sentence):
    # "http://summary-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/textSummarizer"
    url = "http://summary:5060/textSummarizer"
    requestJson = {"text": text, "no_of_sentence": no_of_sentence}
    result = requests.post(url, json=requestJson)
    return result.json()


def postSentimentRequest(text):
    # "http://sentiment-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/sentiment"
    url = "http://sentiment:5050/sentiment"
    requestJson = {"text": text}
    result = requests.post(url, json=requestJson)
    return result.json()


def postNerRequest(text):
    # "http://ner-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/ner"
    url = "http://ner:5020/ner"
    requestJson = {"text": text}
    result = requests.post(url, json=requestJson)
    return result.json()


def postRelationRequest(ner):
    # "http://relation-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/relation"
    url = "http://relation:5010/relation"
    requestJson = {"ner": ner}
    try:
        result = requests.post(url, json=requestJson)
    except Exception as err:
        print("Relation Error", err, flush=True)
    return result.json()


def postTopicRequest(text, no_topic, no_top_words):
    # "http://topics-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/topic_modelling"
    url = "http://topics:5040/topic_modelling"
    requestJson = {"document": text, "no_topic": no_topic, "no_top_words": no_top_words}
    result = requests.post(url, json=requestJson)
    return result.json()


def postClassifierRequest(text):
    # "http://classifier-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/classifier"
    url = "http://classifier:5030/classifier"
    requestJson = {"document": text}
    result = requests.post(url, json=requestJson)
    return result.json()


def postWordCloud(text):
    # "http://wordcloud-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/wordcloud"
    url = "http://wordcloud:5070/wordcloud"
    requestJson = {"data": text}
    result = requests.post(url, json=requestJson)
    return result.json()


def postCluster(corpus):
    # "http://clustering-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/cluster"
    url = "http://clustering:5080/cluster"
    print("Corpus is: ", corpus, flush=True)
    result = requests.post(url, json=corpus)
    print("result in server: ", result)
    return result.json()

def postABSA(data):
    try:
        # http://absa-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/aspectSentiment
        url = "http://absa:5090/aspectSentiment"
        result = requests.post(url, json=data)
        result = result.json()
    except Exception as err:
         print(f"Error in ABSA: {err}", flush=True)
    return result

def postwcabsa(data):
    try: 
        # http://wcabsa-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/wordCloudABSA
        url = "http://wordcloudabsa:5100/wordCloudABSA"
        result = requests.post(url, json=data)
        result = result.json()
    except Exception as err: 
        print(f'Error in wcabsa:{err}', flush=True)
    return result 
```

## `frontend/src/sagas/editstate.js`

```js
// Posts the updated relation data to the backend and returns the updated network data.
const apiPostNetwork = (data) => {
  const formData = new FormData();
  formData.append('relationData', JSON.stringify(data));
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST',
  };
  // 'http://updatenetwork-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/updateNetwork',
  return axios.post('http://localhost:5000/updateNetwork', formData, {
    headers: headers,
  });
};

// Posts the filtered sentiment data to the backend and returns the updated sentiment wordcloud data.
const apiPostSentimentWordcloud = (payload) => {
  const { data, currentFileName } = payload;
  const formData = new FormData();
  formData.append('sentimentData', JSON.stringify(data));
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST',
  };

  if (currentFileName === 'Overview') {
    // 'http://wcabsaoverview-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/wcABSAOverview',
    return axios.post('http://localhost:5000/wcABSAOverview', data, {
      headers: headers,
    });
  } else {
    // 'http://wcabsa-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/wordCloudABSA'
    return axios.post('http://localhost:5000/wordCloudABSA', data, {
      headers: headers,
    });
  }
};

// Posts the uploaded files to the backend and returns the output.
const apiPost = (payload) => {
  const formData = new FormData();
  var fileNames = [];
  for (var i = 0; i < payload.length; i++) {
    formData.append('file'.concat(i.toString()), payload[i]);
    fileNames.push(payload[i].name);
  }
  fileNames = JSON.stringify(fileNames);
  formData.append('fileNames', fileNames);
  formData.append('length', payload.length);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // 'http://backend-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/uploadFile'
  return axios.post('http://localhost:5000/uploadFile', formData, {
    headers: headers,
  });
};

// Posts the JSON document to the backend and returns the output.
const apiPostJson = (payload) => {
  const formData = new FormData();
  formData.append('existingFile', payload);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // 'http://loadexistingfile-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/loadExistingFile'
  return axios.post('http://localhost:5000/loadExistingFile', formData, {
    headers: headers,
  });
};

// Posts the ObjectID of the document and returns the output from the MongoDB entry corresponding
// to that ObjectID.
const apiPostDb = (payload) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // 'http://loaddbfile-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/loadDbFile'
  return axios.post(
    'http://localhost:5000/loadDbFile',
    { ID: payload },
    {
      headers: headers,
    }
  );
};
```

## `frontend/src/components/Settings/Settings.js`

```js
const saveToDb = async () => {
  setIsLoading(true);
  const data = {
    fileNames: fileNames,
    corpusData: corpusData,
    layout: layout,
  };
  // 'http://savetodb-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/saveToDb'
  await axios
    .post('http://localhost:5000/saveToDb', {
      data: data,
    })
    .then((res) => {
      saveDocumentId(res.data);
      setIsLoading(false);
    });
};
```

## `frontend/src/components/FrontPageHeader/FrontPageHeader.js`

```js
...
// "http://docs-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io"
<a href="http://localhost:8000">
  <span className="front-page-link-text">Docs</span>
</a>
```
