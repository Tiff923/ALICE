import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import sentiwordnet as swn
# import utils
# import Normalization
# import numpy as np
from . import *
import pandas as pd
from pattern.en import sentiment, mood, modality 
from textblob import TextBlob
import json
from flair.data import Sentence
from sklearn.model_selection import train_test_split
from flair.models import TextClassifier
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from keras.models import load_model
from pickle import load
from tensorflow.python.keras.preprocessing.text import Tokenizer
from tensorflow.python.keras.preprocessing.sequence import pad_sequences

def analyze_sentiment_vader_lexicon(text, threshold = 0.1, verbose = False):
    #process the text, might 
    #processed_text = Normalization.normalize_accented_characters(text)

    #analyze sentiment for review
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)

    #Get the aggregate scores and final sentiment
    print("\nUsing Vader: \n")
    agg_score = scores['compound']
    if agg_score > threshold:
        final_sentiment = 'Positive'
    elif agg_score == threshold:
        final_sentiment = 'Neutral'
    else:
        final_sentiment = 'Negative'
    print(final_sentiment)
    
    if verbose:
        positive = str(round(scores['pos'], 2)*100) + '%'
        final = round(agg_score, 2)
        negative = str(round(scores['neg'], 2)*100) + '%'
        neutral = str(round(scores['neu'], 2)) + '%'
        sentiment_frame = pd.DataFrame([[final_sentiment, final, positive, negative, neutral]],
        columns = pd.MultiIndex(levels = [['Sentiment Stats:'], ['Predicted Sentiment', 'Polarity Score', 'Positive', 'Negative',
        'Neutral']], labels = [[0,0,0,0,0], [0,1,2,3,4,]]))
        print(sentiment_frame)
    return final_sentiment

def analyze_sentiment_sentiwordnet_lexicon(text, verbose = False):
    print("\nUsing SentiWordNet: \n")
    #Tokenize and POS tag the text
    text_tokens = nltk.word_tokenize(text)
    text_tags = nltk.pos_tag(text_tokens)

    #Initialise the scores
    positive_score = negative_score = objective_score = 0
    token_count = 0 #used to normalize the scores afterwards

    #Get wordnet synsets based on POS tags and get the sentiment scores if synsets are found
    for word, tag in text_tags:
        synset_score = None
        if 'NN' in tag and swn.senti_synsets(word, 'n'):
            synset_score_list = list(swn.senti_synsets(word, 'n'))
            if len(synset_score_list) > 0:
                synset_score = synset_score_list[0]
        elif 'VB' in tag and swn.senti_synsets(word, 'v'):
            synset_score_list = list(swn.senti_synsets(word, 'v'))
            if len(synset_score_list) > 0:
                synset_score = synset_score_list[0]
        elif 'JJ' in tag and swn.senti_synsets(word, 'a'):
            synset_score_list = list(swn.senti_synsets(word, 'a'))
            if len(synset_score_list) >0:
                synset_score = synset_score_list[0]
        elif 'RB' in tag and swn.senti_synsets(word, 'r'):
            synset_score_list = list(swn.senti_synsets(word, 'r'))
            if len(synset_score_list) > 0:
                synset_score = synset_score_list[0]
        
        #Add up the scores if the synsets are found
        if synset_score:
            positive_score += synset_score.pos_score()
            negative_score += synset_score.neg_score()
            objective_score += synset_score.obj_score()
            token_count += 1
    
    #Aggregate the final score
    final_score = positive_score - negative_score
    normalized_final_score = round(float(final_score) / token_count, 2)
    if normalized_final_score >= 0:
        final_sentiment = "Positive"
    else:
        final_sentiment = "Negative"
    print(final_sentiment)
    
    if verbose:
        normalized_objective_score = round(float(objective_score) / token_count, 2)
        normalized_positive_score = round(float(positive_score / token_count), 2)
        normalized_negative_score = round(float(negative_score / token_count), 2)
        sentiment_frame = pd.DataFrame([[final_sentiment, normalized_objective_score, normalized_positive_score,
        normalized_negative_score, normalized_final_score]], columns = pd.MultiIndex(levels = [["Sentiment Stats:"],
        ["Predicted Sentiment", "Objectivity", "Positve", "Negative", "Overall"]], labels = [[0,0,0,0,0],
        [0,1,2,3,4]]))
        print(sentiment_frame)
    return final_sentiment

def analyze_sentiment_pattern_lexicon(text, threshold = 0.1, verbose = False):
    print("\nUsing Pattern: \n")
    #Get sentiment score
    analysis = sentiment(text)
    sentiment_score = round(analysis[0], 2)
    sentiment_subjectivity = round(analysis[1], 2)
    #Get final Sentiment
    if sentiment_score > threshold:
        final_sentiment = "Positive"
    elif sentiment_score == threshold:
        final_sentiment = "Neutral"
    else:
        final_sentiment = "Negative"
    print(final_sentiment)
    
    if verbose:
        sentiment_frame = pd.DataFrame([[final_sentiment, sentiment_score, sentiment_subjectivity]], 
        columns=pd.MultiIndex(levels = [["Sentiment Stats:"], ["Predicted Sentiment","Polarity Score", "Subjectivity Score"]],
        labels = [[0,0,0], [0,1,2]]))
        print(sentiment_frame)

        assessment = analysis.assessments
        assessment_frame = pd.DataFrame(assessment, columns=pd.MultiIndex([['Detailed Assessment Stats'],
        ['Key Terms', 'Polarity Score', 'Subjectivity Score', 'Type']], labels=[[0,0,0,0],[0,1,2,3]]))
        print(assessment_frame)
    
    return final_sentiment

def textblob_sentiment(text):
    blob = TextBlob(text)
    result = str(blob.sentiment)
    print("\nUsing TextBlob: \n")
    print(result)
    return result

def flair_sentiment(text):
    classifier = TextClassifier.load('sentiment')
    data = Sentence(text)
    classifier.predict(data)
    for label in data.get_labels('class'):
        result = label
    return result

def custom_ML_sentiment(text):
    df = pd.read_csv("./DataSets/IMDB Dataset.csv")
    X = df['review']
    y = df['sentiment']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33)
    text_clf = Pipeline([('tfidf', TfidfVectorizer()),('clf', LinearSVC()),])
    # Feed the training data through the pipeline
    text_clf.fit(X_train, y_train) 
    predictions = text_clf.predict([text])
    return predictions

def custom_DL_sentiment(text):
    model = load_model("./DataSets/SentimentLSTM500.h5")
    tokenizer = load(open('./Datasets/SentimentLSTM500Tokenizer', 'rb'))
    encoded_text = tokenizer.texts_to_sequences([text])[0]
    encoded_pad = pad_sequences([encoded_text], maxlen=500, padding = 'post')
    sentimentScore = model.predict_classes(encoded_pad, verbose = 0)[0]
    if sentimentScore == [1]:
        sentiment = "Positive"
    else:
        sentiment = "Negative"
    return sentiment




def load_json(filepath):
    with open(filepath) as f:
        data = json.load(f)
    return data


def test():
    text = "Researchers in Singapore have joined hands with their overseas counterparts in the race to discover vaccines or treatments for Covid-19.The Agency for Science, Technology and Research has partnered with Japanese pharmaceutical company Chugai Pharmabody Research to develop an antibody that targets specific areas of the coronavirus, preventing it from infecting cells.Duke-NUS Medical School, together with United States medicine company Arcturus Therapeutics, is working on a vaccine that gets the human body to produce part of the virus in order to fight it"
    print("Using Vader Lexicon")
    print(analyze_sentiment_vader_lexicon(text, 0.1, True))
    print("\nUsing SynsSet Lexicon")
    print(analyze_sentiment_sentiwordnet_lexicon(text, True))
    print("\nUsing Pattern Lexicon")
    print(analyze_sentiment_pattern_lexicon(text,0.1,True))

def writeToFile(filepath = "sentiment_analysis_result.txt", text = ""):
    with open(filepath, "a") as f:
        f.write(text)

def makeJSONCorpus(noOfArticles):
    crimeData = load_json("/Users/cornelius/Documents/ISTD/ALICE Internship/Corpus/crime.json")
    healthData = load_json("/Users/cornelius/Documents/ISTD/ALICE Internship/Corpus/health.json")
    financeData = load_json("/Users/cornelius/Documents/ISTD/ALICE Internship/Corpus/finance.json")
    techData = load_json("/Users/cornelius/Documents/ISTD/ALICE Internship/Corpus/tech.json")
    politicsData = load_json("/Users/cornelius/Documents/ISTD/ALICE Internship/Corpus/politics.json")
    terrorismData = load_json("/Users/cornelius/Documents/ISTD/ALICE Internship/Corpus/terrorism.json")
    data = []
    crimeDataSelected = retrieveArticles(noOfArticles, crimeData)
    healthDataSelected = retrieveArticles(noOfArticles, healthData)
    financeDataSelected = retrieveArticles(noOfArticles, financeData)
    techDataSelected = retrieveArticles(noOfArticles, techData)
    politicsDataSelected = retrieveArticles(noOfArticles, politicsData)
    terrorismDataSelected = retrieveArticles(noOfArticles, terrorismData)
    data.extend(crimeDataSelected)
    data.extend(healthDataSelected)
    data.extend(financeDataSelected)
    data.extend(politicsDataSelected)
    data.extend(techDataSelected)
    data.extend(terrorismDataSelected)
    return data

def retrieveArticles(noOfArticles, input_data):
    return_data = []
    i = 0
    while len(return_data) < noOfArticles:
        if len(input_data[i]["text"]) == 0:
            i+=1
            continue
        else:
            return_data.append(input_data[i])
            i+=1
    return return_data


def testCorpus():
    writeTo = "sentiment_analysis_result_base_corpus.txt"
    f = open(writeTo,"w")
    f.close()
    data = makeJSONCorpus(2)
    for x in range(0,len(data)):
        article = data[x]["text"]
        articleNo = x + 1
        print(articleNo)
        writeToFile(writeTo, "\n Article %d:\n\n" %articleNo)
        writeToFile(writeTo, article)
        writeToFile(writeTo,"\nUsing Vader Lexicon: ")
        writeToFile(writeTo,analyze_sentiment_vader_lexicon(article, 0.1, True))
        writeToFile(writeTo,"\nUsing SynsSet Lexicon: ")
        writeToFile(writeTo,analyze_sentiment_sentiwordnet_lexicon(article, True))
        writeToFile(writeTo,"\nUsing Pattern Lexicon: ")
        writeToFile(writeTo,analyze_sentiment_pattern_lexicon(article,0.1,True))
        writeToFile(writeTo,"\nUsing TextBlob: ")
        writeToFile(writeTo,textblob_sentiment(article))
        writeToFile(writeTo, "\nUsing Flair:")
        writeToFile(writeTo, str(flair_sentiment(article)))
        writeToFile(writeTo, "\nUsing Custom ML:")
        writeToFile(writeTo, custom_ML_sentiment(article)[0])
        writeToFile(writeTo, "\nUsing Custom DL:")
        writeToFile(writeTo,custom_DL_sentiment(article))
        writeToFile(writeTo, "\n##################################################\n")
        print("##################################################\n")


def testFlair():
    data = load_json("/Users/cornelius/Documents/ISTD/ALICE Internship/res.json")
    for i in range(0, 5):
        print(flair_sentiment(data[i]['text']))

def testCustomML():
    data = load_json("/Users/cornelius/Documents/ISTD/ALICE Internship/res.json")
    # for i in range(0,5):
    #     print(custom_ML_sentiment(data[i]['text']))
    print(custom_ML_sentiment("This is so smart. I like this"))
def testCustomDL():
    print(custom_DL_sentiment("I am so happy"))

def getSentiment(text):
    sentiment = analyze_sentiment_pattern_lexicon(text, 0, True)
    return sentiment




    




