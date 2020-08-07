# Wordcloud
- Word cloud highlights the most frequent words in the chapter or the entire document 

## Routes
- `/wordcloud`

## Python wordcloud library 

`backend/AliceBackEnd/WordCloud/app.py`

```python
def show_wordcloud():

    data = request.json
    # text is a string that contains the chapter or document when we are on chapter level dashboard or document level (overview) dashboard respectively 
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
```