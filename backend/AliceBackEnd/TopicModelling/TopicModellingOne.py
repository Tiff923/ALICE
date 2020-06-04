from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import NMF, LatentDirichletAllocation
import random

def topic_modelling(documents,no_topics,no_top_words):
    no_features = 1000

    # NMF is able to use tf-idf
    tfidf_vectorizer = TfidfVectorizer(max_features=no_features, stop_words='english')
    tfidf = tfidf_vectorizer.fit_transform(documents)
    tfidf_feature_names = tfidf_vectorizer.get_feature_names()

    # Run NMF
    nmf = NMF(n_components=no_topics, random_state=1, alpha=.1, l1_ratio=.5).fit(tfidf)

    list_of_topics = []
    for topic_idx, topic in enumerate(nmf.components_):
        words_of_topic = " ".join([tfidf_feature_names[i]
                            for i in topic.argsort()[:-no_top_words - 1:-1]])
        list_of_topics.append(words_of_topic)
    
    topics_words = []
    for topics in list_of_topics:
        words = topics.split()
        topics_words.append(words)

    outJson = {
    'name': 'Topics', 
    'color': "hsl(13, 70%, 50%)", 
    'children': []
    }

    for topic in topics_words:
        topic_vis = {
                    "name": "Topic 1",
                    "color": "hsl(50, 70%, 50%)",
                    "children": []
                    }

        for word in topic:
            loc = random.randint(500, 100000)
            word_vis = {
                        "name": word,
                        "color": "hsl(196, 70%, 50%)",
                        "loc": loc
                        }
            topic_vis['children'].append(word_vis)
        outJson['children'].append(topic_vis)
    return outJson
    
    
    # returnJson = {"topics": list_of_topics}
    # return returnJson
