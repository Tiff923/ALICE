# Aspect-Based Sentiment Analysis (ABSA)

- Sentiment Analysis focuses on classifying the overall sentiment of a document into positive or negative. On the other hand, aspect-based sentiment analysis allows us to understand the specific sentiment towards an aspect (in our case an entity). 
- The model includes a bert encoder, 2 attention network and a softmax output layer. The model learns the representation of an aspect and its context within a sentence with two attention network interactively. This gives rise to an accurate representation of the sentence and a precise classification subsequently. 
- The model is trained on restaurant reviews.
- The GitHub repository and research paper can be found [here](https://github.com/songyouwei/ABSA-PyTorch)

## Routes 
- `/aspectSentiment`

## Torch 
![torch-logo](./img/aspect-basedSentimentAnalysis/torch-logo.jpg)

`backend/AliceBackEnd/ABSA/app.py`

```python
def aspectSentiment_api():
    data = request.json
    print('Received Data', flush=True)

    # Obtain default parameters
    opt = get_parameters()
    opt.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # Load pre-trained tokenizer, bert model
    tokenizer = Tokenizer4Bert(opt.max_seq_len, opt.pretrained_bert_name)
    bert = BertModel.from_pretrained(opt.pretrained_bert_name)
    model = AEN_BERT(bert, opt).to(opt.device)
    
    # Load trained attention model 
    print('loading model {0} ...'.format(opt.model_name))
    model.load_state_dict(torch.load('aen_bert_restaurant_val_acc0.8098', map_location=opt.device))
    model.eval()
    torch.autograd.set_grad_enabled(False)
    
    # out, the result of the attention model, tells us the sentiment towards an aspect at sentence level 
    out = []
    for entity, sentences in data.items():
        for sentence in sentences:
            sentence_d = {'aspect':'', 'sentiment':'', 'sentence':''}
            sentiment_d = {-1: 'Negative', 0:'Neutral', 1:'Positive'}

            # aspect: Entity of interest 
            # left: Segment of the sentence that appears on the left of aspect 
            # right: Segement of the sentence that appears on the right of aspect 
            left = sentence['left']
            aspect = sentence['aspect']
            right = sentence['right'] 
            sentence = left + aspect + right 
            # Preparing data to feed into bert encoder 
            text_bert_indices, bert_segments_ids, text_raw_bert_indices, aspect_bert_indices = prepare_data(left, aspect, right, tokenizer)
      
            text_bert_indices = torch.tensor([text_bert_indices], dtype=torch.int64).to(opt.device)
            bert_segments_ids = torch.tensor([bert_segments_ids], dtype=torch.int64).to(opt.device)
            text_raw_bert_indices = torch.tensor([text_raw_bert_indices], dtype=torch.int64).to(opt.device)
            aspect_bert_indices = torch.tensor([aspect_bert_indices], dtype=torch.int64).to(opt.device)
            
            inputs = [text_raw_bert_indices, aspect_bert_indices]
            outputs = model(inputs)
            t_probs = F.softmax(outputs, dim=-1).cpu().numpy()
            aspect_sentiment_n = t_probs.argmax(axis=-1) - 1
            aspect_sentiment = sentiment_d[aspect_sentiment_n[0]]

            sentence_d['aspect']= aspect
            sentence_d['sentiment']= aspect_sentiment
            sentence_d['sentence']= sentence
            out.append(sentence_d)

    # Determines the sentiment towards an aspect at chapter level (a document) and consolidate all sentences related to the aspect 
    dic = absa_chapter_combined_s(out)
    # Altering data structure to pass to frontend 
    absaChapterCombinedS = absa_chapter_to_react(dic)
    print('Model complete', flush=True)
    returnJson = {'sentimentTableData': absaChapterCombinedS, 'absaChapter': dic}
    return returnJson 
```

The variable data is in the form: 

```python
{
'Malaysia': [
	{
    'left': 'Freedom House gave ',
    'aspect': 'Malaysia',
    'right': 'a score of 64 out of 100 for press freedom in 2011 (0 is best; 100 is worst).'
    },
  	{
    'left': 'When',
    'aspect': 'Malaysia',
    'right': 'plunged from 92nd place (of 169 countries surveyed) in 2006 to 124th in 2007, the organization cited the states targeting of online journalists and bloggers in particular, and its concern with obstructing or censoring critical voices online.'
    }
    ],
 'Media Prima': [
 	{
    'left': 'Together the UMNO-linked conglomerate',
   	'aspect': 'Media Prima',
    'right': 'and Utusan Melayu group, for instance, own nearly all mainstream Malay and English-language newspapers, as well as a number of television channels and magazines.'
   }
   ],
   ...
}
```

The variable out is in the form: 

```python
 [
 {
 'aspect': 'Malaysia',
 'sentiment': 'Negative',
 'sentence': 'Freedom House gave Malaysia a score of 64 out of 100 for press freedom in 2011 (0 is best; 100 is worst).'
 },
 {
 'aspect': 'Malaysia',
 'sentiment': 'Negative',
 'sentence': 'When Malaysia plunged from 92nd place (of 169 countries surveyed) in 2006 to 124th in 2007, the organization cited the states targeting of online journalists and bloggers in particular, and its concern with obstructing or censoring critical voices online.'
 },
 {
 'aspect': 'Media Prima',
 'sentiment': 'Positive',
 'sentence': 'Together the UMNO-linked conglomerate Media Prima and Utusan Melayu group, for instance, own nearly all mainstream Malay and English-language newspapers, as well as a number of television channels and magazines.'
 },
 ...
 ]
```

The variable dic is in the form: 

```python
{ 
'Malaysia': { 
			'sentiment': 'Negative', 
            'sentences':{
                        'Positive': [...], 
                        'Negative': [
                                    'Freedom House gave Malaysia a score of 64 out of 100 for press freedom in 2011 (0 is best; 100 is worst).', 
                                    'When Malaysia plunged from 92nd place (of 169 countries surveyed) in 2006 to 124th in 2007, the organization cited the states targeting of online journalists and bloggers in particular, and its concern with obstructing or censoring critical voices online.', 
                                    ...
                                    ], 
                        'Neutral':[...]
            },
'Media Prima': { 
			    'sentiment': 'Positive', 
                'sentences':{
            	            'Positive': [
                                        'Together the UMNO-linked conglomerate Media Prima and Utusan Melayu group, for instance, own nearly all mainstream Malay and English-language newspapers, as well as a number of television channels and magazines.', 
                                        ...
                            			], 
                			'Negative': [...], 
                			'Neutral':[...]
                			}, 
...
}
```

The variable absaChapterCombinedS  is in the form: 

```python
[
{
'aspect': 'Malaysia',
'sentiment': 'Negative',
'sentences': {
			'Positive': [...],
            'Negative': [
            			'Freedom House gave Malaysia a score of 64 out of 100 for press freedom in 2011 (0 is best; 100 is worst).',
                        'When Malaysia plunged from 92nd place (of 169 countries surveyed) in 2006 to 124th in 2007, the organization cited the states targeting of online journalists and bloggers in particular, and its concern with obstructing or censoring critical voices online.', 
                        ...
                        ],
            'Neutral':[...]
            }
}, 
{
'aspect': 'Media Prima',
'sentiment': 'Positive',
'sentences': {
			'Positive': [
            			'Together the UMNO-linked conglomerate Media Prima and Utusan Melayu group, for instance, own nearly all mainstream Malay and English-language newspapers, as well as a number of television channels and magazines.', 
                        ...
                        ],
            'Negative': [...],
            'Neutral':[...]
            }
}, 
...
]
```

`backend/app.py`

```python
def absa_document_combined_c(dc, inc, filename):
  for entity, value in inc.items():
    sentiment = value['sentiment']
    if entity not in dc.absaDocument.keys():
      dc.absaDocument[entity]={
          'sentiment':'', 
          'chapters': {
              'Positive':[], 
              'Negative':[], 
              'Neutral':[]
          }
      }
    dc.absaDocument[entity]['chapters'][sentiment].append(filename)
  
  for ent, val in dc.absaDocument.items():
    index_label = {0: 'Positive', 1:'Negative', 2:'Neutral'}
    pos_list_len = len(val['chapters']['Positive']) 
    neg_list_len = len(val['chapters']['Negative']) 
    neu_list_len = len(val['chapters']['Neutral'])
    len_list = [pos_list_len, neg_list_len, neu_list_len]
    index = len_list.index(max(len_list))
    label = index_label[index]
    dc.absaDocument[ent]['sentiment'] = label
    
  return
```

Assuming the output absaChapterCombinedS as seen above is generated from Chapter1.pdf, we would label 'Chapter1' as a chapter with negative sentiments with regards to Malaysia and positive sentiments with regards to Media Prima. The  sentiment towards each entity at the (entire) document level is determined by the sentiment expressed by most chapters. 


The output of `def absa_document_combined_c(dc, inc, filename):` is in the form: 

```python
{
'Malaysia': { 
			'sentiment': 'Negative',
            'chapters': [
            			'Positive':[], 
              			'Negative':['Chapter1'], 
              			'Neutral':[]
                        ]
            }, 
'Media Prima': { 
			'sentiment': 'Positive',
            'chapters': [
            			'Positive':['Chapter1'], 
              			'Negative':[], 
              			'Neutral':[]
                        ]
                }, 
...  
}
```