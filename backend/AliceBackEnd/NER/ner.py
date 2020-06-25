from utils import normalize_corpus
import nltk
import spacy
from spacy import displacy
from flair.data import Sentence
from flair.models import SequenceTagger
import sys
from collections import defaultdict

from flask import Flask, send_file, request, make_response

app = Flask(__name__)

tagger_fast = SequenceTagger.load('ner-ontonotes-fast')


@app.route('/')
def run():
    return 'NER running'


def combine(data):

    res = []
    l = len(data['ents'])
    text = data['text']

    def combineHelper(path, idx, count):
        if count == 2:
            e1 = path[0]['text']
            e1_label = path[0]['type']
            e2 = path[1]['text']
            e2_label = path[1]['type']
            # e11 = path[0]['start']
            # e12 = path[0]['end']
            # e21 = path[1]['start']
            # e22 = path[1]['end']
            # new_text = text[:e11] + '<e1>' + text[e11:e12] + '</e1> ' + text[e12:e21] + '<e2>' + text[e21:e22] +\
            #     '</e2>' + text[e22:]
            res.append(
                {
                    "text": text,
                    'h': {'pos': (path[0]['start'], path[0]['end'])},
                    't': {'pos': (path[1]['start'], path[1]['end'])},
                    "e1": e1,
                    "e2": e2,
                    "e1_label": e1_label,
                    "e2_label": e2_label,
                    "e1_id": path[0]['id'],
                    "e2_id": path[1]['id']
                }
            )
            return
        else:
            for i in range(idx, l):
                path.append(data['ents'][i])
                combineHelper(path, i+1, count+1)
                path.pop()

    combineHelper([], 0, 0)
    return res


def generateTextToNer(text):
    clean_text = normalize_corpus([text], to_lower=False, to_remove_html=False,
                                  to_remove_accent=True, to_expand_contractions=True,
                                  to_lemmatize=False, to_remove_special=False,
                                  to_remove_stopword=False)
    clean_text = clean_text[0]
    idTracker = defaultdict(int)
    res = {'ents': [], 'text': '', 'passToRelation': []}

    lst_sentences = nltk.sent_tokenize(clean_text)
    prevLen = 0
    for s in lst_sentences:
        sentence = Sentence(s, use_tokenizer=True)
        tagger_fast.predict(sentence)
        dict_flair = sentence.to_dict(tag_type='ner')
        for idx in dict_flair['entities']:
            idx['id'] = idTracker[idx['text']]
            idTracker[idx['text']] += 1
            idx['end'] = idx.pop('end_pos')
            idx['start'] = idx.pop('start_pos')
            full_label = idx.pop('labels')[0]
            full_label = str(full_label)
            idx['type'] = full_label[:full_label.find(' ')]
        dict_flair['ents'] = dict_flair.pop('entities')
        combination = combine(dict_flair)
        res['passToRelation'].extend(combination)

        for idx in dict_flair['ents']:
            idx['end'] = idx['end'] + prevLen
            idx['start'] = idx['start'] + prevLen

        dict_flair.pop('labels')
        res['text'] += ' '+dict_flair['text']
        res['ents'].extend(dict_flair['ents'])
        prevLen += len(dict_flair['text']) + 1

    res['text'] = res['text'].strip()

    return res


def generateNerToRelation(text):
    clean_text = normalize_corpus([text], to_lower=False, to_remove_html=False,
                                  to_remove_accent=True, to_expand_contractions=True,
                                  to_lemmatize=False, to_remove_special=False,
                                  to_remove_stopword=False)
    clean_text = clean_text[0]
    lst_sentences = nltk.sent_tokenize(clean_text)

    res = []
    idTracker = defaultdict(int)

    for s in lst_sentences:
        sentence = Sentence(s, use_tokenizer=True)
        tagger_fast.predict(sentence)
        d = sentence.to_dict(tag_type='ner')
        d.pop('labels')
        for idx in d['entities']:
            idx['id'] = idTracker[idx['text']]
            idTracker[idx['text']] += 1
            idx['end'] = idx.pop('end_pos')
            idx['start'] = idx.pop('start_pos')
            full_label = idx.pop('labels')[0]
            full_label = str(full_label)
            idx['type'] = full_label[:full_label.find(' ')]
        d['ents'] = d.pop('entities')
        combination = combine(d)
        res.extend(combination)
    return res


@ app.route('/ner', methods=['GET', 'POST'])
def textToNer():
    data = request.json
    text = data['text']
    res = generateTextToNer(text)
    returnJson = {"ner": res}
    return returnJson


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5020)
