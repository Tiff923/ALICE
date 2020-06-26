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
    print("accessing files")
    model = pickle.load(open(model_file_path, 'rb'))
    vectorizer = pickle.load(open(vectorizer_file_path, "rb"))
    selector = pickle.load(open(selector_file_path, "rb"))
    print("file access succeed?")
    features_test = vectorizer.transform(data)
    features_test = selector.transform(features_test).toarray()
    predictions = model.predict(features_test)
    return predictions


def classify_all_category(data):
    model_path_list = ['./health_model.bin',
                       './crime_model.bin',
                       './terrorism_model.bin',
                       './finance_model.bin',
                       './politics_model.bin',
                       './tech_model.bin']
    vectorizer_path_list = [
        './health_vectorizer.pickle',
        './crime_vectorizer.pickle',
        './terrorism_vectorizer.pickle',
        './finance_vectorizer.pickle',
        './politics_vectorizer.pickle',
        './tech_vectorizer.pickle']
    selector_path_list = [
        './health_selector.pickle',
        './crime_selector.pickle',
        './terrorism_selector.pickle',
        './finance_selector.pickle',
        './politics_selector.pickle',
        './tech_selector.pickle']

    predictions = {}
    keys = {0: 'health', 1: 'crime', 2: 'terrorism', 3: 'finance', 4: 'politics', 5: 'tech'}
    for i in range(6):
        key = keys[i]
        prediction = classify_one_category(model_path_list[i], vectorizer_path_list[i], selector_path_list[i], data)
        predictions[key] = prediction
    return predictions


def maximumSum(list1):
    maxi = 0
    i = 0

    for i in range(6):
        prev_maxi = maxi
        maxi = max(sum(list1[i]), maxi)
        if maxi != prev_maxi:
            index = i

    return index


def final_class(predictions):
    keys = {0: 'Health', 1: 'Crime', 2: 'Terrorism', 3: 'Finance', 4: 'Politics', 5: 'Tech'}

    predictions_list = list(predictions.values())
    index = maximumSum(predictions_list)

    return keys[index]


def multi_final_class(data):
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
    for i in range(6):
        key = keys[i]
        prediction = classify_one_category(model_path_list[i], vectorizer_path_list[i], selector_path_list[i], data)
        print('prediction', prediction)
        if 1 in prediction:
            classes.append(key)

    return classes


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5030)
