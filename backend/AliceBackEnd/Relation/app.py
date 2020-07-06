from flask import Flask, send_file, request, make_response
from flask_cors import CORS, cross_origin
import os
import opennre


app = Flask(__name__)
cors = CORS(app)

modelBERT = opennre.get_model('wiki80_bert_softmax')
modelCNN = opennre.get_model('wiki80_cnn_softmax')


@app.route('/')
def run():
    return 'Relation running'


def extract_relation(ner_output):
    res = []
    for obj in ner_output:
        obj['h']['pos'] = tuple(obj['h']['pos'])
        obj['t']['pos'] = tuple(obj['t']['pos'])
        CNNres = modelCNN.infer(obj)
        BERTres = modelBERT.infer(obj)
        if CNNres[1] > 0.5 or BERTres[1] > 0.5:
            if CNNres[1] >= BERTres[1]:
                obj['relation'] = CNNres[0]
            else:
                obj['relation'] = BERTres[0]
            res.append(obj)
    return res


@app.route('/relation', methods=['GET', 'POST'])
def nerToRelation():
    data = request.json
    ner = data['ner']
    res = extract_relation(ner)
    print('output from relation model', res, flush=True)
    returnJson = {'relation': res}
    print('returnJson from Relation', returnJson, flush=True)
    return returnJson


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5010)
