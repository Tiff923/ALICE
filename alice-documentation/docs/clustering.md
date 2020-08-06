# Document Clustering

- Given a corpus, we would cluster documents with similar content together. 
- The clustering algorithm used is K-Means. Upon deciding the desired number of clusters, k, K-Means starts with a group of k randomly selected centroids. They are used as the beginning points of each cluster and then perform iterative calculation to optimise the position of the centroids. 
- The optimal k value was determined by performing K means with different k values and finding the k value that has the highest Silhouette value. 
- We tried two ways to encode the document, namely using TF-IDF and Doc2Vec. Doc2Vec is an extension of the Word2Vec approach. It adds an additional input node representing the document as an additional context in predicting the next word in a sentence. 
- The clustering model chosen is Doc2Vec, along with K means. 


## Scikit-learn 
![scikit-learn-logo](./img/clustering/scikit-learn-logo.jpg)

`backend/AliceBackEnd/Clustering/app.py`

```python
def process_corpus(corpus):

    """
    Args: 
        corpus: list of strings, each string is a document
        
    Returns: 
    	Nested list, each sub list is a list of lowercased, tokenized words found in a document  
    """
    
    corpus_tokens = []
    for i, doc in enumerate(corpus):
        tokens = gensim.utils.simple_preprocess(doc)
        corpus_tokens.append(tokens)
    return corpus_tokens
```

```python
def doc2vec(test_corpus):

	"""
    Args:
    	test_corpus: Nested list, each sub list is a list of lowercased, tokenized words found in a document 
        
    Returns: 
    	Nested list, each sub list is a vectorized representation of a document 
    """
    
    model_file_path = './model.bin'
    m = pickle.load(open(model_file_path, 'rb'))
    test_doc2vec = []
    for doc in test_corpus:
        test_doc2vec.append(m.infer_vector(doc))
    return test_doc2vec
```

```python
def optimal_k(test_doc2vec):
	
    """
    Args: 
    	test_doc2vec: Nested list, each sub list is a vectorized representation of a document
        
    Returns:
    	the number of clusters (k) that gives highest silhouette_val
    """
    
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
```

```python
def k_means(test_doc2vec):

	"""
    Args: 
    	test_doc2vec: Nested list, each sub list is a vectorized representation of a document
    
    Returns: 
    	datapoint: 2D list, vectorized representation of every document in 2D
        centroidpoint: 2D list, centriods of every cluster in 2D
        labels: 1D list, each label represents the cluster each document belongs to 
    """
    
    k, sil = optimal_k(test_doc2vec)
    kmeans_model = KMeans(n_clusters=k, init='k-means++', max_iter=100)
    X = kmeans_model.fit(test_doc2vec)
    labels = kmeans_model.labels_.tolist()

	# Transform test_doc2vec and centroids to 2D for drawing scatterplot 
    pca = PCA(n_components=2).fit(test_doc2vec)
    datapoint = pca.transform(test_doc2vec)

    centroids = kmeans_model.cluster_centers_
    centroidpoint = pca.transform(centroids)

    return datapoint, centroidpoint, labels
```

```python
def duplicates(lst, item):

	"""
    Args: 
    	lst: list
        item: element in list
    
    Returns: 
    	list of index of elements in lst that are equal to item 
    """
    
    return [i for i, x in enumerate(lst) if x == item]


def prepare_corpus_topic(labels, corpus):
	
    """
    Args: 
    	labels: 1D list, each label represents the cluster each document belongs to 
        corpus: list of strings, each string is a document
        
    Returns: 
    	nested list, each sub list contains documents that belong to the same cluster 
    """
    
    clusters = sorted(list(set(labels)))
    text_all_clusters = []
    for cluster in clusters:
        index_list = duplicates(labels, cluster)
        text_per_cluster = [corpus[i] for i in index_list]
        text_all_clusters.append(text_per_cluster)
    return text_all_clusters
```

```python
def topic_modelling(documents, no_topics=3, no_top_words=5):
	
    """
	Args:
    	documents: list of strings, each string is a document 
        no_topics: integer, number of topics to be extracted 
        no_top_words: integer, number of words describing each topic 
            
    Returns: 
    	list of strings, each string describes a topic 
    """
    
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
```

```python 
def topic_all_cluster(text_all_cluster):

	"""
    Args: 
    	text_all_cluster: nested list, each sub list contains documents that belong to the same cluster 
    
    Returns: 
    	list of strings, each string describes a topic
    """

    topic_all_cluster = []
    for text_per_cluster in text_all_cluster:
        topic_per_cluster = topic_modelling(text_per_cluster, 1, 10)
        topic_all_cluster = topic_all_cluster + topic_per_cluster
    return topic_all_cluster
```

```python 
def algorithm(corpus):

    # Document clustering  
    test_corpus = process_corpus(corpus)
    test_doc2vec = doc2vec(test_corpus)
    datapoint, centroidpoint, labels = k_means(test_doc2vec)

    # Extracting words that describe each cluster 
    text_every_clusters = prepare_corpus_topic(labels, corpus)
    topic_every_cluster = topic_all_cluster(text_every_clusters)
    
    return topic_every_cluster, datapoint, centroidpoint, labels
```
