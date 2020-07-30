import numpy as np
import torch
import torch.nn.functional as F
from models.aen import AEN_BERT
from pytorch_transformers import BertModel
from data_utils import Tokenizer4Bert
import argparse
import json
from flask import Flask, request

app = Flask(__name__)

@app.route('/aspectSentiment', methods=['GET', 'POST'])
def aspectSentiment_api():
    data = request.json
    print('Received Data', flush=True)

    opt = get_parameters()
    opt.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    tokenizer = Tokenizer4Bert(opt.max_seq_len, opt.pretrained_bert_name)
    bert = BertModel.from_pretrained(opt.pretrained_bert_name)
    model = AEN_BERT(bert, opt).to(opt.device)
    
    print('loading model {0} ...'.format(opt.model_name))
    model.load_state_dict(torch.load('aen_bert_restaurant_val_acc0.8098', map_location=opt.device))
    model.eval()
    torch.autograd.set_grad_enabled(False)
    
    out = []
    for entity, sentences in data.items():
        for sentence in sentences:
            sentence_d = {'aspect':'', 'sentiment':'', 'sentence':''}
            sentiment_d = {-1: 'Negative', 0:'Neutral', 1:'Positive'}

            left = sentence['left']
            aspect = sentence['aspect']
            right = sentence['right'] 
            sentence = left + aspect + right 
            text_bert_indices, bert_segments_ids, text_raw_bert_indices, aspect_bert_indices = prepare_data(left, aspect, right, tokenizer)
      
            text_bert_indices = torch.tensor([text_bert_indices], dtype=torch.int64).to(opt.device)
            bert_segments_ids = torch.tensor([bert_segments_ids], dtype=torch.int64).to(opt.device)
            text_raw_bert_indices = torch.tensor([text_raw_bert_indices], dtype=torch.int64).to(opt.device)
            aspect_bert_indices = torch.tensor([aspect_bert_indices], dtype=torch.int64).to(opt.device)
            
            inputs = [text_raw_bert_indices, aspect_bert_indices]
            outputs = model(inputs)
            t_probs = F.softmax(outputs, dim=-1).cpu().numpy()
            aspect_sentiment_n = t_probs.argmax(axis=-1) - 1
            print(aspect_sentiment_n)
            aspect_sentiment = sentiment_d[aspect_sentiment_n[0]]

            sentence_d['aspect']= aspect
            sentence_d['sentiment']= aspect_sentiment
            sentence_d['sentence']= sentence
            out.append(sentence_d)

    dic = absa_chapter_combined_s(out)
    absaChapterCombinedS = absa_chapter_to_react(dic)
    # absa_c = absa_chapter(absa_c_combined_s)
    print('Model complete', flush=True)
    returnJson = {'sentimentTableData': absaChapterCombinedS, 'absaChapter': dic}
    return returnJson 

def pad_and_truncate(sequence, maxlen, dtype='int64', padding='post', truncating='post', value=0):
    x = (np.ones(maxlen) * value).astype(dtype)
    if truncating == 'pre':
        trunc = sequence[-maxlen:]
    else:
        trunc = sequence[:maxlen]
    trunc = np.asarray(trunc, dtype=dtype)
    if padding == 'post':
        x[:len(trunc)] = trunc
    else:
        x[-len(trunc):] = trunc
    return x

def prepare_data(text_left, aspect, text_right, tokenizer):
    text_left = text_left.lower().strip()
    text_right = text_right.lower().strip()
    aspect = aspect.lower().strip()
    
    text_raw_indices = tokenizer.text_to_sequence(text_left + " " + aspect + " " + text_right)            
    aspect_indices = tokenizer.text_to_sequence(aspect)
    aspect_len = np.sum(aspect_indices != 0)
    text_bert_indices = tokenizer.text_to_sequence('[CLS] ' + text_left + " " + aspect + " " + text_right + ' [SEP] ' + aspect + " [SEP]")
    text_raw_bert_indices = tokenizer.text_to_sequence(
        "[CLS] " + text_left + " " + aspect + " " + text_right + " [SEP]")
    bert_segments_ids = np.asarray([0] * (np.sum(text_raw_indices != 0) + 2) + [1] * (aspect_len + 1))
    bert_segments_ids = pad_and_truncate(bert_segments_ids, tokenizer.max_seq_len)
    aspect_bert_indices = tokenizer.text_to_sequence("[CLS] " + aspect + " [SEP]")

    return text_bert_indices, bert_segments_ids, text_raw_bert_indices, aspect_bert_indices


def get_parameters():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model_name', default='aen_bert', type=str)
    parser.add_argument('--dataset', default='restaurant', type=str, help='twitter, restaurant, laptop')
    parser.add_argument('--optimizer', default='adam', type=str)
    parser.add_argument('--initializer', default='xavier_uniform_', type=str)
    parser.add_argument('--learning_rate', default=2e-5, type=float, help='try 5e-5, 2e-5 for BERT, 1e-3 for others')
    parser.add_argument('--dropout', default=0.1, type=float)
    parser.add_argument('--l2reg', default=0.01, type=float)
    parser.add_argument('--num_epoch', default=10, type=int, help='try larger number for non-BERT models')
    parser.add_argument('--batch_size', default=16, type=int, help='try 16, 32, 64 for BERT models')
    parser.add_argument('--log_step', default=5, type=int)
    parser.add_argument('--embed_dim', default=300, type=int)
    parser.add_argument('--hidden_dim', default=300, type=int)
    parser.add_argument('--bert_dim', default=768, type=int)
    parser.add_argument('--pretrained_bert_name', default='bert-base-uncased', type=str)
    parser.add_argument('--max_seq_len', default=80, type=int)
    parser.add_argument('--polarities_dim', default=3, type=int)
    parser.add_argument('--hops', default=3, type=int)
    parser.add_argument('--device', default=None, type=str, help='e.g. cuda:0')
    parser.add_argument('--seed', default=None, type=int, help='set seed for reproducibility')
    parser.add_argument('--valset_ratio', default=0, type=float,
                        help='set ratio between 0 and 1 for validation support')
    opt = parser.parse_args()
    return opt

def absa_chapter_combined_s(l):
  dic = {}
  for element in l: 
    entity = element['aspect']
    sentiment = element['sentiment']
    sentence = element['sentence']
    if entity not in dic.keys():
      dic[entity] = {
          'sentiment':'', 
          'sentences':{
              'Positive': [], 
              'Negative': [], 
              'Neutral': []
          }
      }
    dic[entity]['sentences'][sentiment].append(sentence)
    
  for ent in dic.keys():
    index_label = {0: 'Positive', 1:'Negative', 2:'Neutral'}
    pos_list_len = len(dic[ent]['sentences']['Positive'])
    neg_list_len = len(dic[ent]['sentences']['Negative'])
    neu_list_len = len(dic[ent]['sentences']['Neutral'])
    len_list = [pos_list_len, neg_list_len, neu_list_len]
    index = len_list.index(max(len_list))
    label = index_label[index]
    dic[ent]['sentiment'] = label
  return dic 

def absa_chapter_to_react(dic):
  returnlist = []
  for entity in dic.keys():
    returnlist.append({
        'aspect':entity, 
        'sentiment':dic[entity]['sentiment'], 
        'sentences':{
            'Positive': dic[entity]['sentences']['Positive'], 
            'Negative': dic[entity]['sentences']['Negative'], 
            'Neutral': dic[entity]['sentences']['Neutral']
            }
    }) 
  return returnlist 

# def absa_chapter(l):
#     summary = {}
#     for element in l:
#       aspect = element['aspect']
#       sentiment = element['sentiment']
#       if aspect in summary.keys():
#         if sentiment == 'Negative': 
#           summary[aspect][0] += 1
#         elif sentiment == 'Neutral':
#           summary[aspect][1] += 1
#         else: 
#           summary[aspect][2] += 1
#       else:
#         if sentiment == 'Negative': 
#           summary[aspect] = [1, 0, 0]
#         elif sentiment == 'Neutral':
#           summary[aspect] = [0, 1, 0]
#         else: 
#           summary[aspect] = [0, 0, 1]
    
#     out = {}
#     sentiment_dic = {0:'Negative', 1:'Neutral', 2:'Positive'}
#     for aspect, sentimentList in summary.items():
#       index = sentimentList.index(max(sentimentList))
#       out[aspect] = sentiment_dic[index]

#     return out 


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5090)
