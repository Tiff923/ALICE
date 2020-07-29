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
        print('data from frontend wc', data, flush=True)
        sentimentWord_c = entity_sentimentwords_chapter(data)
        key = list(sentimentWord_c.keys())[0]
        pos = sentimentWord_c[key]['pos']
        neg = sentimentWord_c[key]['neg']
        text = ' '.join(pos + neg)
        print('pos /wordCloudABSA', pos, flush=True)
        print('neg /wordCloudABSA', neg, flush=True)
        wc = wc_green_red(text, pos, neg)
        returnJson = {'sentimentWordCloud': wc, 'sentimentWordChapter':sentimentWord_c}
    except Exception as err: 
        print('error in /wordCloudABSA', err, flush=True)
    return returnJson

@app.route('/wcABSAOverview', methods=['GET', 'POST'])
def wc_ABSA_Overview(): 
    try: 
        data = request.json
        print('data from frontend wc overview', data, flush=True)
        key = list(data.keys())[0]
        pos = data[key]['pos']
        neg = data[key]['neg']
        text = ' '.join(pos + neg)
        print('pos /wcABSAOverview', pos, flush=True)
        print('neg /wcABSAOverview', neg, flush=True)
        wc = wc_green_red(text, pos, neg)
        returnJson = {'sentimentWordCloud': wc}
    except Exception as err: 
        print('error in /wcABSAOverview', err, flush=True)
    return returnJson

def extract_sentiment_words(sentence): 
  tokenized_sentence = nltk.word_tokenize(sentence)

  sid = SentimentIntensityAnalyzer()
  pos_word_list=[]
  neg_word_list=[]

  for word in tokenized_sentence:
      if (sid.polarity_scores(word)['compound']) >= 0.1:
          pos_word_list.append(word)
      if (sid.polarity_scores(word)['compound']) <= -0.1:
          neg_word_list.append(word)

  if len(pos_word_list) == 0 and len(neg_word_list) == 0: 
      pos_word_list = ['no', 'positive', 'word'] 
      neg_word_list = ['no', 'negative', 'word']
          

  return pos_word_list, neg_word_list


def entity_sentimentwords_chapter(l):
  out = {}
  for element in l: 
    aspect = element['aspect']
    sentence = element['sentence']
    pos, neg = extract_sentiment_words(sentence)
    if aspect in out.keys(): 
      out[aspect]['pos'] = out[aspect]['pos'] + pos 
      out[aspect]['neg'] = out[aspect]['neg'] + neg 
    else:
      out[aspect] = {}
      out[aspect]['pos'] = pos 
      out[aspect]['neg'] = neg 
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
    custom_mask = np.array(Image.open("Book4.jpg"))
    wc = WordCloud(collocations=False, background_color = "white", mask = custom_mask).generate(text.lower())
    color_to_words = {
        'green': pos, 
        'red': neg
    }
    default_color = 'grey'
    grouped_color_func = SimpleGroupedColorFunc(color_to_words, default_color)
    wc.recolor(color_func=grouped_color_func)
    imageRes = wc.to_image()

    # Convert to bytes
    file_object = io.BytesIO()
    imageRes.save(file_object, format='PNG')
    bytestring = base64.b64encode(file_object.getvalue())
    result = bytestring.decode('utf-8')

    return result

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5100)