

# Topic Modelling

- Topic Modelling is the process of using unsupervised learning to extract main topics, represented as a collection of words, found in a document. 

- 3 common unsupervised learning approaches are as follows: 
    1. Latent Dirichlet Allocation (LDA)
        - LDA is a probabilistic model. It models each document as a Dirichlet distribution of topics and each topic as a Dirichlet distribution of words. 
        Through an iterative process, it searches for the best topic mix and best word mix. 
    2. Non-Negative Matrix Decomposition (NMF)
        - NMF decomposes high dimensional vectors into lower dimensional vectors. In this context, NMF decomposes the article-word matrix to article-topic matrix and topic-word matrix. The two lower dimensional matrices are optimised over an objective function for example Euclidean distance and updated iteratively until convergence. 
    3. Principal Component Analysis (PCA), followed by Term Frequency Inverse Document Frequency (TF-IDF)
        - Documents are represented as word embeddings with a length of 7168. PCA is used to reduce the dimensionality of the word embedding to length 768, speeding up agglomerative clustering. Subsequently, we find words or phrases in each topic with the highest TF-IDF scores to make sense of each topic. 

- The approach adopted is NMF. This is because the topics could be more accurately deciphered from the list of words outputted from the NMF model. In other words, the list of words provided by the NMF model consists of more significant words. Moreover, given a small corpus, the NMF model is less likely to generate a repeated list of words for different topics. 

## Scikit-learn
![scikit-learn-logo](./img/clustering/scikit-learn-logo.jpg)

`backend/AliceBackEnd/TopicModelling/app.py`

```python
def topic_modelling(documents, no_topics=3, no_top_words=5):

    """
    Args:
            documents: list of strings, each string is a document 
            no_topics: integer, number of topics to be extracted 
            no_top_words: integer, number of words describing each topic 
    
    """
   
    no_features = 1000

    # NMF is able to use tf-idf
    tfidf_vectorizer = TfidfVectorizer(max_features=no_features, stop_words='english')
    tfidf = tfidf_vectorizer.fit_transform(documents)
    tfidf_feature_names = tfidf_vectorizer.get_feature_names()

    # Run NMF
    nmf = NMF(n_components=no_topics, random_state=1, alpha=.1, l1_ratio=.5).fit(tfidf)

	# Extract words describing each topic, appending each topics's description to list_of_topics
    list_of_topics = []
    for topic_idx, topic in enumerate(nmf.components_):
        words_of_topic = " ".join([tfidf_feature_names[i]
                                   for i in topic.argsort()[:-no_top_words - 1:-1]])
        list_of_topics.append(words_of_topic)

	# Altering data structure to pass to frontend 
    topics_words = []
    for topics in list_of_topics:
        words = topics.split()
        topics_words.append(words)

    outJson = {
        'name': 'Topics',
        'color': "hsl(13, 70%, 50%)",
        'children': []
    }

    t = 0
    for topic in topics_words:
        t = t + 1
        topic_vis = {
            "name": f"Topic{t}",
                    "color": "hsl(50, 70%, 50%)",
                    "children": []
        }

        for word in topic:
            loc = random.randint(5000, 100000)
            word_vis = {
                "name": word,
                "color": "hsl(196, 70%, 50%)",
                "loc": loc
            }
            topic_vis['children'].append(word_vis)
        outJson['children'].append(topic_vis)
    return outJson
```

The variable list_of_topics is in the form: 

```python
 [
 'hydroxychloroquine trials study patients drug',
  'people certificates recovered said evidence', 
  'pandemic china resolution assembly president'
  ]
```

The final result returned from our module (i.e. the variable outJson) is in the form: 

```python
{
'name': 'Topics', 
'color': 'hsl(13, 70%, 50%)', 
'children': [
	{
    'name': 'Topic1', 
    'color': 'hsl(50, 70%, 50%)', 
    'children': [
    	{
        'name': 'hydroxychloroquine', 
    	'color': 'hsl(196, 70%, 50%)',
        'loc': 26991
        }, 
        {
        'name': 'trials',
        'color': 'hsl(196, 70%, 50%)',
        'loc': 81705
        },
        {
        'name': 'study',
        'color': 'hsl(196, 70%, 50%)',
        'loc': 96555
        },
        {
        'name': 'patients',
        'color': 'hsl(196, 70%, 50%)',
        'loc': 26480
        },
        {
        'name': 'drug',
        'color': 'hsl(196, 70%, 50%)',
        'loc': 86286
        }
        ]
    },
    {
    'name': 'Topic2',
    'color': 'hsl(50, 70%, 50%)',
    'children': [
    	{
        'name': 'people',
        'color': 'hsl(196, 70%, 50%)',
        'loc': 96924
        },
        {
        'name': 'certificates',
        'color': 'hsl(196, 70%, 50%)',
        'loc': 71518
        },
        {
        'name': 'recovered',
        'color': 'hsl(196, 70%, 50%)',
        'loc': 9895
        },
        {
        'name': 'said',
        'color': 'hsl(196, 70%, 50%)',
        'loc': 79790
        },
        {
        'name': 'evidence',
        'color': 'hsl(196, 70%, 50%)',
        'loc': 45051
        }
        ]
     }
   ]
}
```
