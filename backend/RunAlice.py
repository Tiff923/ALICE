from AliceBackEnd.Sentiment.SentimentAnalysisEP import getSentiment
from AliceBackEnd.TextSummarizer.TextRankSummarizer import textSummarizer
from AliceBackEnd.TopicModelling.TopicModellingOne import topic_modelling
from AliceBackEnd.Classifier.classify import classify_all_category, final_class
from AliceBackEnd.NER.ner import generateTextToNer, generateNerToRelation
from AliceBackEnd.Relation.relation_predict import main

nercolors = {'PERSON': '#FF5964',
  'NORP': '#30BCED',
  'FAC': '#30BCED',
  'ORG': '#30BCED',
  'GPE': '#C200FB',
  'LOC': '#C200FB',
  'PRODUCT': '#0DAB76',
  'EVENT': '#0DAB76',
  'WORK_OF_ART': '#FC7A1E',
  'LAW': '#FC7A1E',
  'LANGUAGE': '#FC7A1E',
  'DATE': '#FFBC0A',
  'TIME': '#FFBC0A',
  'PERCENT': '#FC7A1E',
  'MONEY': '#FC7A1E',
  'QUANTITY': '#FC7A1E',
  'ORDINAL': '#FC7A1E',
  'CARDINAL': '#FC7A1E'}

def relationToNetwork(relationData): 
    links = []
    links_template = {
        'source': '',
        'target': ''
    }

    # Links
    nodes_temp = {}
    for i in range(len(relationData)):
        temp = links_template.copy()
        el = relationData[i]
        if el['relation'][:-7] == '(e2,e1)':
            temp['source'] = el['e2']
            temp['target'] = el['e1']
        else:
            temp['source'] = el['e1']
            temp['target'] = el['e2']

        node_t = temp['target']
        node_t_label = el['e1_label'] if node_t == el['e1'] else el['e2_label']
        node_s = temp['source']
        node_s_label = el['e2_label'] if node_s == el['e2'] else el['e1_label']

        if node_t in nodes_temp:
            nodes_temp[node_t]['val'] += 4
            nodes_temp[node_t]['neighbors'].add(node_s)
        else:
            nodes_temp[node_t] = {
                'id': node_t,
                'name': node_t,
                'val': 4,
                'color': nercolors[node_t_label],
                'neighbors': set(node_s)
            }
        
        if node_s in nodes_temp:
            nodes_temp[node_s]['val'] += 2
            nodes_temp[node_s]['neighbors'].add(node_t)
        else:
            nodes_temp[node_s] = {
                'id': node_s,
                'name': node_s,
                'val': 2,
                'color': nercolors[node_s_label],
                'neighbors': set(node_t)
            }   
        links.append(temp)
    
    # Nodes
    nodes = list(nodes_temp.values())
    for n in nodes:
        n['neighbors'] = list(n['neighbors'])

    return {
        'nodes': nodes,
        'links': links
    }


def runAlice(text):
    text = text.replace("\\x92", "")
    text = text.replace("\\x93", "")
    text = text.replace("\\x94", "")
    num_words = len(text)
    sentiment = getSentiment(text)
    key_data_sentiment = sentiment[0]["sentiment"]
    key_data_legitimacy = sentiment[1]["sentiment"]
    sentiment[0]["sentiment"] = "sentiment"
    sentiment[1]["sentiment"] = "subjective"
    summary = textSummarizer(text, 3)
    topics = topic_modelling([text], 3, 10)
    classify = final_class(classify_all_category([text]))
    key_data_classification = classify
    passToRelation = generateNerToRelation(text)
    ner = generateTextToNer(text)
    relation = main(passToRelation)
    network = relationToNetwork(relation)
    keyData = {"num_words": num_words, "topic_classifier": key_data_classification, "sentiment": key_data_sentiment,
     "legitimacy": key_data_legitimacy}
    jsonToReact = {}
    jsonToReact["keyData"] = keyData
    jsonToReact['sentiment'] = sentiment
    jsonToReact['summary'] = summary
    jsonToReact['topics'] = topics
    jsonToReact['classify'] = classify
    jsonToReact['ner'] = ner
    jsonToReact['relation'] = relation
    jsonToReact['network'] = network
    return jsonToReact


