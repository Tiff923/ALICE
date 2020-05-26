import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import sentiwordnet as swn
import utils
import Normalization
import pandas as pd
from pattern.en import sentiment, mood, modality 

def analyze_sentiment_vader_lexicon(text, threshold = 0.1, verbose = False):
    #process the text, might 
    #processed_text = Normalization.normalize_accented_characters(text)

    #analyze sentiment for review
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)

    #Get the aggregate scores and final sentiment
    agg_score = scores['compound']
    if agg_score > threshold:
        final_sentiment = 'Positive'
    elif agg_score == threshold:
        final_sentiment = 'Neutral'
    else:
        final_sentiment = 'Negative'
    
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



    

def test():
    text = "Researchers in Singapore have joined hands with their overseas counterparts in the race to discover vaccines or treatments for Covid-19.The Agency for Science, Technology and Research has partnered with Japanese pharmaceutical company Chugai Pharmabody Research to develop an antibody that targets specific areas of the coronavirus, preventing it from infecting cells.Duke-NUS Medical School, together with United States medicine company Arcturus Therapeutics, is working on a vaccine that gets the human body to produce part of the virus in order to fight it"
    print("Using Vader Lexicon")
    print(analyze_sentiment_vader_lexicon(text, 0.1, True))
    print("\nUsing SynsSet Lexicon")
    print(analyze_sentiment_sentiwordnet_lexicon(text, True))
    print("\nUsing Pattern Lexicon")
    print(analyze_sentiment_pattern_lexicon(text,0.1,True))

test()



