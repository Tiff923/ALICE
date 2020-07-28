from wordcloud import (WordCloud, get_single_color_func)
import matplotlib.pyplot as plt
from PIL import Image 
import numpy as np
from flask import Flask, request

app = Flask(__name__)

@app.route('/wordCloudABSA', methods=['GET', 'POST'])
def wordCloud_ABSA(): 
    data = request.json
    pos = data['pos']
    neg = data['neg']
    text = ' '.join(pos + neg)
    returnJson = wc_green_red(text, pos, neg)
    return returnJson

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
    returnJson = {"data": bytestring.decode('utf-8')}
    return returnJson

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5100)