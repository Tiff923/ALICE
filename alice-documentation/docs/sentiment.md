# Sentiment Analysis


## About
Sentiment analysis, also known as opinion analysis/mining, is used to extract subjective and opinion related information, such as emotions, attitudes, and moods. A polarity weight is given to the text, based on whether it expresses a positive, negative, or a neutral sentiment.
 
There are two major techniques for sentiment analysis: supervised machine learning and unsupervised lexicon-based learning. 

Lexicons refer to dictionaries or vocabularies specially constructed to be used for sentiment analysis and compute sentiment without any supervised techniques. Some examples are AFINN lexicon, Bing Liu’s lexicon, MPQA subjectivity lexicon, SentiWordNet, VADER lexicon, and Pattern lexicon.

## Current Implementation 

We tried using different methods to perform sentiment analysis such as Linear SVC machine learning, Deep Learning LSTM networks and various lexicons based methods. 

We found that the Linear SVC machine learning method has the best performance at 91% accuracy when trained and tested on the IMDB movie reviews dataset. The deep learning LSTM method comes close at 86% accuracy. 

However, when tested on news articles obtained through web scraping, we found that the lexicon based method has a more accurate prediction than the machine and deep learning methods. This could be due to the models being trained on movie reviews and thus did not perform well on news articles due to the mismatch on context. 

Therefore, for the current implementation of ALICE, we decided to go with the lexicon based method from the NLP library `Pattern`. In future, if there is a more suitable dataset available for training, the approach should be changed from lexicon to machine/deep learning.

## Code and Usage

`ALICE/backend/AliceBackEnd/Sentiment/app.py`

Like the rest of the NLP modules, the sentiment module is meant to be accessed through an api call. Thus, the code is structured as a flask server. The backend will perform a POST request, storing the text to be analysed into a JSON with key `text` to the route `/sentiment`. 

The result will be returned as a list in a JSON with key `sentiment`.

### Route
``` python
@app.route("/sentiment", methods=["GET", "POST"])
def sentimentAPI():
    data = request.get_json()
    text = data["text"]
    sentiment = getSentiment(text)
    returnJson = {"sentiment": sentiment}
    return returnJson
```

### Helper Function
The helper function is used by the `sentimentAPI()` function to call the lexicon function. The 2nd argument takes in a float of range 0-1 and serves as a threshold to determine if the text is positive or negative.

For convenient testing purposes, the `getSentiment()` function can be called independently without starting up a flask server,

``` python
def getSentiment(text):
    sentimentJson = analyze_sentiment_pattern_lexicon(text, 0)
    return sentimentJson
```

### Lexicon Code

The lexicon code makes use of the NLP library `Pattern` to perform the sentiment analysis. This returns a list containing the sentiment and subjectivity score of the given text. Based on the input threshold, the text will be classify either as **Positive** or **Negative**. 

For subjectivity, the threshold is fixed at 0.5. A subjectivity score above 0.5 would mean that the text is more subjective and a score below 0.5 would mean that the text is more objective.


``` python
from pattern.en import sentiment, mood, modality

def analyze_sentiment_pattern_lexicon(text, threshold=0.1):
    #print("\nUsing Pattern: \n")
    # Get sentiment score
    analysis = sentiment(text)
    sentiment_score = round(analysis[0], 2)
    sentiment_subjectivity = round(analysis[1], 2)
    sentimentJson = {"sentiment": "none", "positivity": 0, "negativity": 0}
    subjectivityJson = {"sentiment": "none", "subjectivity": 0}
    # Get final Sentiment
    if sentiment_score > threshold:
        final_sentiment = "Positive"
        sentimentJson["positivity"] = sentiment_score*100
        sentimentJson["sentiment"] = final_sentiment
    else:
        final_sentiment = "Negative"
        sentimentJson["negativity"] = sentiment_score*100
        sentimentJson["sentiment"] = final_sentiment
    if sentiment_subjectivity > 0.5:
        final_subjectivity = "Subjective"
        subjectivityJson["sentiment"] = final_subjectivity
        subjectivityJson["subjectivity"] = round(-(sentiment_subjectivity - 0.5) * 100, 3)
    else:
        final_subjectivity = "Objective"
        subjectivityJson["sentiment"] = final_subjectivity
        subjectivityJson['subjectivity'] = round(((1-sentiment_subjectivity) - 0.5) * 100, 3)
    returnList = [sentimentJson, subjectivityJson]
    return returnList
```

## Interpretation of Output

The final result that is returned to the backend will be in a dictionary with the following format:

``` json

" Assuming that the text is postive with a score of 0.7 and subjective with a subjectivity score of 0.75"

{"sentiment": 
    [
        {
            "sentiment": "Positive"
            "positivity": 70
            "negative": 0
        },
        {
            "sentiment": "Subjective"
            "subjectivity": -25
        }
    ]    
}
```
