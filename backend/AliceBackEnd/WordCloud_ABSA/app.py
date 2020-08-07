from wordcloud import (WordCloud, get_single_color_func)
import matplotlib.pyplot as plt
from PIL import Image 
import numpy as np
from flask import Flask, request
import base64
import io
import nltk
from nltk.tokenize import word_tokenize
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from flask_cors import CORS, cross_origin

nltk.download('punkt')
nltk.download('vader_lexicon')

app = Flask(__name__)
cors = CORS(app)

@app.route('/wordCloudABSA', methods=['GET', 'POST'])
def wordCloud_ABSA(): 
    try: 
        data = request.json
        sentimentWord_c = entity_sentimentwords_chapter(data)
        key = list(sentimentWord_c.keys())[0]
        pos = sentimentWord_c[key]['pos']
        neg = sentimentWord_c[key]['neg']
        text = ' '.join(pos + neg)
        wc = wc_green_red(text, pos, neg)
        returnJson = {'sentimentWordCloud': wc, 'sentimentWordChapter':sentimentWord_c}
    except Exception as err: 
        print('error in /wordCloudABSA', err, flush=True)
    return returnJson

@app.route('/wcABSAOverview', methods=['GET', 'POST'])
def wc_ABSA_Overview(): 
    try: 
        data = request.json
        key = list(data.keys())[0]
        pos = data[key]['pos']
        neg = data[key]['neg']
        text = ' '.join(pos + neg)
        wc = wc_green_red(text, pos, neg)
        returnJson = {'sentimentWordCloud': wc}
    except Exception as err: 
        print('error in /wcABSAOverview', err, flush=True)
    return returnJson

def extract_sentiment_words(sentence):
  
  """
  Args:
  		sentence: string, a sentence 
        
  Returns: 
  		pos_word_list: list of positive words present in the sentence  
        neg_word_list: list of negative words present in the sentence 
  """
  
  tokenized_sentence = nltk.word_tokenize(sentence)

  sid = SentimentIntensityAnalyzer()
  pos_word_list=[]
  neg_word_list=[]

  for word in tokenized_sentence:
      if (sid.polarity_scores(word)['compound']) >= 0.1:
          pos_word_list.append(word)
      if (sid.polarity_scores(word)['compound']) <= -0.1:
          neg_word_list.append(word)    

  return pos_word_list, neg_word_list


def entity_sentimentwords_chapter(l):
  out = {}
  for element in l:
    pos_entity = []
    neg_entity = [] 
    aspect = element['aspect']
    sentences = element['sentences']['Positive'] + element['sentences']['Negative'] + element['sentences']['Neutral']
    for sentence in sentences: 
        pos, neg = extract_sentiment_words(sentence)
        pos_entity += pos
        neg_entity += neg

    if len(pos_entity) == 0 and len (neg_entity) == 0: 
        pos_entity = ['neutral']
        neg_entity = ['neutral']

    out[aspect]={
        'pos':pos_entity, 
        'neg':neg_entity
    }
    
  return out 

class SimpleGroupedColorFunc(object):

    def __init__(self, color_to_words, default_color):
        self.word_to_color = {word: color
                              for (color, words) in color_to_words.items()
                              for word in words}

        self.default_color = default_color

    def __call__(self, word, **kwargs):
        return self.word_to_color.get(word, self.default_color)


def wc_green_red(text, pos, neg): 

     """
    Args: 
    	text: string, contains positive and negative words from pos and neg respectively 
        pos: list of positive words
        neg: list of negative words
        
    Returns: 
    	bytestring of wordcloud 
    """

    # Defines shape of word cloud 
    custom_mask = np.array(Image.open("Book4.jpg"))

    # Generate word cloud 
    wc = WordCloud(collocations=False, background_color = "white", mask = custom_mask).generate(text)

    # color_to_words is a mapping of color and words 
    # default color is the color of words that are absent in color_to_words 
    color_to_words = {
        'green': pos, 
        'red': neg, 
        '#80CED7': ['neutral']
    }
    default_color = 'grey'
    grouped_color_func = SimpleGroupedColorFunc(color_to_words, default_color)
    wc.recolor(color_func=grouped_color_func)
    imageRes = wc.to_image()

    # Convert to bytestring 
    file_object = io.BytesIO()
    imageRes.save(file_object, format='PNG')
    bytestring = base64.b64encode(file_object.getvalue())
    result = bytestring.decode('utf-8')

    return result

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5100)
