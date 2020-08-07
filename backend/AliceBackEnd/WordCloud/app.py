from wordcloud import WordCloud
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
import base64
import io
from flask import Flask, request

app = Flask(__name__)


@app.route('/')
def run():
    return 'Wordcloud running'


@app.route('/wordcloud', methods=['GET', 'POST'])
def show_wordcloud():
    
    data = request.json
    # text is a string that contains the chapter or document if we are on chapter level dashboard or document level (overview) dashboard respectively
    text = data['data']

    # Defines shape of word cloud
    custom_mask = np.array(Image.open("./Book4.jpg"))

    # Generate word cloud 
    wc = WordCloud(background_color="white", mask=custom_mask)
    wc.generate(text)
    imageRes = wc.to_image()

    # Convert to bytestring 
    file_object = io.BytesIO()
    imageRes.save(file_object, format='PNG')
    bytestring = base64.b64encode(file_object.getvalue())
    returnJson = {"data": bytestring.decode('utf-8')}
    return returnJson


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5070)