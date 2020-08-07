import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_selection import SelectPercentile, f_classif
from flask import Flask, request


app = Flask(__name__)


@app.route('/')
def run():
    return 'Classifier running'


@app.route('/classifier', methods=['GET', 'POST'])
def classifier_api():
    data = request.json
    document = data['document']
    classes = multi_final_class([document])
    returnJson = {"classify": classes}
    return returnJson


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


def multi_final_class(data):

    """
    Args: 
    	data: list of strings, each string is document (This function is applicable for only 1 document)
   
    Returns: 
    	list of strings, specifying the categories the document belong to 
    	
    """

    model_path_list = ['./health_model.bin', './crime_model.bin', './terrorism_model.bin', './finance_model.bin', './politics_model.bin', './tech_model.bin']
    vectorizer_path_list = ['./health_vectorizer.pickle', './crime_vectorizer.pickle', './terrorism_vectorizer.pickle', './finance_vectorizer.pickle', './politics_vectorizer.pickle', './tech_vectorizer.pickle']
    selector_path_list = ['./health_selector.pickle', './crime_selector.pickle', './terrorism_selector.pickle', './finance_selector.pickle', './politics_selector.pickle', './tech_selector.pickle']

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


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5030)