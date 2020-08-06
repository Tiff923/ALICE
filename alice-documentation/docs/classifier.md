# Text Classifier

# Text Classifier 
- Text Classification refers to categorising documents into either of the 6 categories: Crime, Technology, Health, Finance, Terrorism, Politics. 
- Below are models we have tested and their respective accuracy: 

  | Machine Learning           | Deep Learning                |
  | ---------------------------| -----------------------------|
  | Logistic Regression (0.84) | Word Embedding + LSTM (0.75) |
  | Linear SVC (0.82)          | XLNET (0.78)                 |
  | Naive Baye (0.88)          |                              |

- Our final model, Naive Baye, was trained as a binary classification model as it achieved a higher accuracy as compared to a multi-class classification model. This means that a single document needs to be passed into 6 binary classification models, one per domain to determine which domain the document belongs to. However, since the Naive Baye model implemented using Sklearn directly outputs whether a document falls in a certain domain rather than the probability of the document belonging to a domain, we were unable to determine the best category for the document. Through this experience, we understood the need for multi-label models. 
- We also looked into combining deep learning models to classify documents of variable length. We combined BERT with LSTM. We split each document into smaller text, 200 words each, with 50 words overlapped. Subsequent, we fed the smaller text into BERT to encode them. Before passing to LSTM, our classifier, we padded the shorter sequence with a special value to be masked. This ensures accurate encoding of documents with variable length.


## Scikit-learn 
![scikit-learn-logo](./img/clustering/scikit-learn-logo.jpg)

`backend/AliceBackEnd/Classifier/app.py`

```python
def classify_one_category(model_file_path, vectorizer_file_path, selector_file_path, data):
	
    """
    Args: 
    	model_file_path: string, path to trained model 
        vectorizer_file_path: string, path to trained TF-IDF vectorizer 
        selector_file_path: string, path to trained feature selector 
        data: list of strings, each string is document 
        
    Returns: 
    	list of zeros and ones, each index corresponds to the document in data args 
        zero if document in not classified as the selected catgeory. One otherwise. 
	"""
    
    # Load Naive Baye model, TF-IDF vectorizer and feature selector
    model = pickle.load(open(model_file_path, 'rb'))
    vectorizer = pickle.load(open(vectorizer_file_path, "rb"))
    selector = pickle.load(open(selector_file_path, "rb"))
    
    # Extract featrures from data and conduct binary classification  
    features_test = vectorizer.transform(data)
    features_test = selector.transform(features_test).toarray()
    predictions = model.predict(features_test)
    
    return predictions
```

```python
def multi_final_class(data):

    """
    Args: 
    	data: list of strings, each string is document (This function is applicable for only 1 document)
   
    Returns: 
    	list of strings, specifying the categories the document belong to 
    	
    """
    model_path_list = ['./health_model.bin',
                       './crime_model.bin',
                       './terrorism_model.bin',
                       './finance_model.bin',
                       './politics_model.bin',
                       './tech_model.bin']
    vectorizer_path_list = ['./health_vectorizer.pickle',
                            './crime_vectorizer.pickle',
                            './terrorism_vectorizer.pickle',
                            './finance_vectorizer.pickle',
                            './politics_vectorizer.pickle',
                            './tech_vectorizer.pickle']
    selector_path_list = ['./health_selector.pickle',
                          './crime_selector.pickle',
                          './terrorism_selector.pickle',
                          './finance_selector.pickle',
                          './politics_selector.pickle',
                          './tech_selector.pickle']

    classes = []
    keys = {0: 'Health', 1: 'Crime', 2: 'Terrorism', 3: 'Finance', 4: 'Politics', 5: 'Tech'}
    
    '''
    Each iteration
    	-  runs the document through a domain specific model (e.g. model trained on health dataset) 
    	-  to determine if the document should be classified into the domain
   	'''
    for i in range(6):
        key = keys[i]
        prediction = classify_one_category(model_path_list[i], vectorizer_path_list[i], selector_path_list[i], data)
        # To be modified for this function to be applicable to many documents
        if 1 in prediction:
            classes.append(key)

    return classes
```



