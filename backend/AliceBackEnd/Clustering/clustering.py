import gensim
from gensim.models.doc2vec import Doc2Vec
import pickle
import os
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA, NMF
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from flask import Flask, request

app = Flask(__name__)


@app.route('/')
def run():
    return 'Clustering running'


@app.route("/cluster", methods=['GET', 'POST'])
def getDEMCluster():
    data = request.json
    corpus = data["corpus"]
    fileNames = data["fileNames"]
    topic_every_cluster, datapoint, centroidpoint, labels = algorithm(corpus)
    returnJson = {'clusterData': {"topic_all_cluster": topic_every_cluster, "dataPoints": datapoint.tolist(),
                                  "centroidPoints": centroidpoint.tolist(), "labels": labels, "fileNames": fileNames}}
    return returnJson


def process_corpus(corpus):
    corpus_tokens = []
    for i, doc in enumerate(corpus):
        tokens = gensim.utils.simple_preprocess(doc)
        corpus_tokens.append(tokens)
    return corpus_tokens


def doc2vec(test_corpus):
    model_file_path = './model.bin'
    m = pickle.load(open(model_file_path, 'rb'))
    test_doc2vec = []
    for doc in test_corpus:
        test_doc2vec.append(m.infer_vector(doc))
    return test_doc2vec


def optimal_k(test_doc2vec):
    n = len(test_doc2vec)
    if n == 2:
        return 2, None
    else:
        silhouette_vals = []
        for k in range(2, n):
            km = KMeans(n_clusters=k)
            labels = km.fit_predict(test_doc2vec)
            centroids = km.cluster_centers_
            silhouette_val = silhouette_score(test_doc2vec, labels)
            silhouette_vals.append(silhouette_val)
        max_val = max(silhouette_vals)
    return silhouette_vals.index(max_val) + 2, max_val


def k_means(test_doc2vec):
    k, sil = optimal_k(test_doc2vec)
    kmeans_model = KMeans(n_clusters=k, init='k-means++', max_iter=100)
    X = kmeans_model.fit(test_doc2vec)
    labels = kmeans_model.labels_.tolist()

    pca = PCA(n_components=2).fit(test_doc2vec)
    datapoint = pca.transform(test_doc2vec)

    centroids = kmeans_model.cluster_centers_
    centroidpoint = pca.transform(centroids)

    return datapoint, centroidpoint, labels


def duplicates(lst, item):
    return [i for i, x in enumerate(lst) if x == item]


def prepare_corpus_topic(labels, corpus):
    clusters = sorted(list(set(labels)))
    text_all_clusters = []
    for cluster in clusters:
        index_list = duplicates(labels, cluster)
        text_per_cluster = [corpus[i] for i in index_list]
        text_all_clusters.append(text_per_cluster)
    return text_all_clusters


def obtain_filenames(labels, filenames):
    clusters = sorted(list(set(labels)))
    filename_all_clusters = []
    for cluster in clusters:
        index_list = duplicates(labels, cluster)
        filename_per_cluster = [filenames[i] for i in index_list]
        filename_all_clusters.append(filename_per_cluster)
    return filename_all_clusters


def topic_modelling(documents, no_topics=3, no_top_words=5):
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

    return list_of_topics


def topic_all_cluster(text_all_cluster):
    topic_all_cluster = []
    for text_per_cluster in text_all_cluster:
        topic_per_cluster = topic_modelling(text_per_cluster, 1, 10)
        topic_all_cluster = topic_all_cluster + topic_per_cluster
    return topic_all_cluster


def algorithm(corpus):
    test_corpus = process_corpus(corpus)
    test_doc2vec = doc2vec(test_corpus)
    datapoint, centroidpoint, labels = k_means(test_doc2vec)
    text_every_clusters = prepare_corpus_topic(labels, corpus)
    topic_every_cluster = topic_all_cluster(text_every_clusters)
    return topic_every_cluster, datapoint, centroidpoint, labels


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5080)
