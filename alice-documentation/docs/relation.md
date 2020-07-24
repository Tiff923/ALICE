# Relation Extraction

Relation extraction is a natural language processing (NLP) task aiming at extracting relations (e.g., founder of) between entities (e.g., Bill Gates and Microsoft). For example, from the sentence Bill Gates founded Microsoft, we can extract the relation triple (Bill Gates, founder of, Microsoft).

The model we use is supervised relation extraction. The models are trained using the training and validation sets of FewRel (Han et al. 2018). The dataset contains 80 relations defined in Wikidata (Refer to Appendix II) and the corpus of totally 56,000 sentences comes from Wikipedia.

Our model adopts a best-of-breed approach - Convolutional Neural Networks (CNN) and Bidirectional Encoder Representations from Transformers (BERT).

- CNN works by first extracting semantic features from input sentences, obtaining the word embeddings and position embeddings of the sentences, and then sending them to the CNN to get the sentence representations. Finally those representations are fed to a fully-connected layer to calculate the probabilities for each relation;
- BERT (Devlin et al. 2018) is a self-attention-based text encoder that achieves state-of-the-arts on several NLP benchmarks.

A limitation of the supervised relation extraction approach is that the models will have to run for every combination of two entities within a sentence, i.e. if there are N entities in a sentence, the time complexity of our model is 2^N

## thunlp's OpenNRE

![thunlp logo](./img/relation/thunlp.png)

The python package for the relation extraction model is found [here](https://github.com/thunlp/OpenNRE) and a live demo of their website is at [http://opennre.thunlp.ai/#/sent_re](http://opennre.thunlp.ai/#/sent_re)

The models accept an input as such:

```python
>>> model.infer({'text': 'He was the son of Máel Dúin mac Máele Fithrich, and grandson of the high king Áed Uaridnach (died 612).', 'h': {'pos': (18, 46)}, 't': {'pos': (78, 91)}})

('father', 0.5108704566955566)
```

`backend/AliceBackEnd/Relation/app.py`

```python
import opennre
modelBERT = opennre.get_model('wiki80_bert_softmax')
modelCNN = opennre.get_model('wiki80_cnn_softmax')

def extract_relation(ner_output):
    res = []
    for obj in ner_output:
        # Convert the argument into an acceptable format
        obj['h']['pos'] = tuple(obj['h']['pos'])
        obj['t']['pos'] = tuple(obj['t']['pos'])

        # Both models are run.
        # If the output of both models have a confidence score below 0.5, we do not include this relation.
        # Else, we take the output of the model with a higher confidence score.
        CNNres = modelCNN.infer(obj)
        BERTres = modelBERT.infer(obj)
        if CNNres[1] > 0.5 or BERTres[1] > 0.5:
            if CNNres[1] >= BERTres[1]:
                obj['relation'] = CNNres[0]
            else:
                obj['relation'] = BERTres[0]
            res.append(obj)
    return res
```

## Relation Types

The full list of relation types can be found in the [appendix](./relation-types.md)
