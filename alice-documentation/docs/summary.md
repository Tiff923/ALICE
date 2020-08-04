# Text Summarizer

## About
The purpose of text summarizer is to provide a short summary of the given text. 

There is two types of summary: Abstractive and Extractive.

For Abstractive summary, the computer will take in the text and generates its own original summary of the text.

For Extractive summary, the computer will take in the text and extracts some sentences in the text to be used as the summary. Thus, the summary will just be a few sentences that was taken from the original text

## Current Implementation

We have tried using both abstractive and extractive summary. 

The extractive summary is performed using a TextRank algorithm which basically finds the most important sentences in a given text by comparing the similarity between all the sentences. The sentence with the most similarities is deemed as the most important sentence, as the context of that particular sentence should be a good indication on what the entire text is about.

The abstractive summary is performed using the state of the art T5 NLP model made by Google. This model has extraordinary performance and provides a fairly accurate summary most of the time.

However, we decided to go with extractive summary using TextRank algorithm as the T5 model do produce some broken sentences, albeit rarely.

## Code and Usage

`ALICE/backend/AliceBackEnd/TextSummarize/app.py`

Like the rest of the NLP modules, the summary module is meant to be accessed through an api call. Thus, the code is structured as a flask server. The backend will perform a POST request, storing the text to be analysed and number of sentences to return into a JSON with key `text` and `no_of_sentence` respectively to the route `/textSummarizer`. 

Currently the default number of sentences to be returned as a summary is defined to be 3 in `ALICE/backend/app.py`

The result will be returned as a string in a JSON with key `summary`.



### Route
``` python
@app.route("/textSummarizer", methods=["GET", "POST"])
def textSummaryAPI():
    data = request.get_json()
    text = data["text"]
    no_of_sentence = data["no_of_sentence"]
    summary = textSummarizer(text, no_of_sentence)
    returnJson = {"summary": summary}
    return returnJson
```
### Text Rank Code
``` python
def textSummarizer(text, no_of_sentences=2):
    # Tokenize the text into sentences and lemmatize it
    text = text.replace("\n", " ")
    doc = sent_tokenize(text)
    # VectorizedText is a matrix containing the tfidf scores
    vectorizer = TfidfVectorizer(min_df=0, max_df=1.0)
    vectorizedText = vectorizer.fit_transform(doc)

    # Compute similarity matrix by multiplying the tfidf matrix with its transpose
    similarityMatrix = (vectorizedText * vectorizedText.T)

    # Get the graph
    graph = networkx.from_scipy_sparse_matrix(similarityMatrix)

    # Obtain the scores
    scores = networkx.pagerank(graph)

    # Sort from highest scores to lowest
    ranking = ((score, index) for index, score in scores.items())
    rankingSorted = sorted(ranking, reverse=True)

    # Get the index of the sentences to be included in the summary
    sentenceIndexList = [rankingSorted[index][1] for index in range(0, no_of_sentences)]
    sentenceIndexList.sort()

    # Get the final summary
    summary = ""
    for index in sentenceIndexList:
        summary = summary + doc[index] + "\n\n"

    return summary
```

## Interpretation of Output

The final result that is returned to the backend will be a dictionary with the following format:

``` json
{
    "summary": "This sentence is taken from the text to be used as an extractive summary"
}
```
