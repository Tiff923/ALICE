from AliceBackEnd.Sentiment.SentimentAnalysisEP import getSentiment
from AliceBackEnd.TextSummarizer.TextRankSummarizer import textSummarizer
from AliceBackEnd.TopicModelling.TopicModellingOne import topic_modelling
from AliceBackEnd.Classifier.classify import classify_all_category, final_class
from AliceBackEnd.NER.ner import generateTextToNer, generateNerToRelation
from AliceBackEnd.Relation.relation_predict import main

def runAlice(text):
    text = text.replace("\\x92", "")
    text = text.replace("\\x93", "")
    text = text.replace("\\x94", "")
    sentiment = getSentiment(text)
    summary = textSummarizer(text, 3)
    topics = topic_modelling([text], 3, 10)
    classify = final_class(classify_all_category([text]))
    passToRelation = generateNerToRelation(text)
    ner = generateTextToNer(text)
    relation = main(passToRelation)
    jsonToReact = {}
    jsonToReact['sentiment'] = sentiment
    jsonToReact['summary'] = summary
    jsonToReact['topics'] = topics
    jsonToReact['classify'] = classify
    jsonToReact['ner'] = ner
    jsonToReact['relation'] = relation
    return jsonToReact

