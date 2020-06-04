import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_selection import SelectPercentile, f_classif

def classify_one_category(model_file_path, vectorizer_file_path, selector_file_path, data): 
  model = pickle.load(open(model_file_path, 'rb'))
  vectorizer = pickle.load(open(vectorizer_file_path, "rb"))
  selector = pickle.load(open(selector_file_path, "rb"))
  features_test = vectorizer.transform(data)
  features_test = selector.transform(features_test).toarray()
  predictions = model.predict(features_test)
  return predictions 

def classify_all_category(data):
    model_path_list = ['C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\health_model.bin', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\crime_model.bin', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\terrorism_model.bin', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\finance_model.bin', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\politics_model.bin', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\tech_model.bin']
    vectorizer_path_list = ['C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\health_vectorizer.pickle', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\crime_vectorizer.pickle', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\terrorism_vectorizer.pickle', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\finance_vectorizer.pickle', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\politics_vectorizer.pickle', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\tech_vectorizer.pickle']
    selector_path_list = ['C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\health_selector.pickle', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\crime_selector.pickle', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\terrorism_selector.pickle', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\finance_selector.pickle', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\politics_selector.pickle', 'C:\\Users\\ALICE\\Documents\\backend\\AliceBackEnd\\Classifier\\tech_selector.pickle']

    predictions = {}
    keys = {0:'health', 1:'crime', 2:'terrorism', 3:'finance', 4:'politics', 5:'tech'}
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
    keys = {0:'Health', 1:'Crime', 2:'Terrorism', 3:'Finance', 4:'Politics', 5:'Tech'}

    predictions_list = list(predictions.values())
    index = maximumSum(predictions_list)
    returnJson = {"classify": keys[index]}

    return returnJson

