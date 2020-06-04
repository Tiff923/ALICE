from AliceBackEnd.NER.utils import normalize_corpus
import nltk
import spacy
from spacy import displacy
from flair.data import Sentence
from flair.models import SequenceTagger
import sys
from collections import defaultdict

tagger_fast = SequenceTagger.load('ner-ontonotes-fast')

raw = "LONDON \u2014 The sound of crisply struck golf balls could be heard in England for the first time in nearly two months as courses reopened Wednesday, part of a modest easing of coronavirus lockdown restrictions.  But delight at the resumption of some recreation was mixed with anxiety among commuters and transit staff as people began to return to workplaces. After seven weeks of lockdown, people in England were allowed to exercise more than once a day and with one person from outside their household, provided they remained 2 meters (around 6.5 feet) apart. Other sporting activities, such as tennis, fishing, boating and lake swimming, also resumed. David Baillie, the pro at Dulwich & Sydenham Hill Golf Club in southeast London, said 170 members booked tee-off times to play in pairs on Wednesday and that all slots are taken through Tuesday.  \u201cIt's gone swimmingly well,\u201d he said. Stores selling gardening supplies reported busy trade as they reopened, and potential home buyers were told they could once again visit properties. And, importantly in the context of getting the ailing British economy back on its feet, people who can't work from home, such as those in construction and manufacturing, were being encouraged by the government to return to work if they can do so safely. Some construction sites have resumed work, and automaker Ford announced plans to restart production at two factories in the U.K. The easing of restrictions applies only in England. The semi-autonomous governments of Scotland, Wales and Northern Ireland are going more slowly and sticking with the \u201cStay Home\u201d message, partly because the epidemic is at different stages in different parts of the country, Johnson justified the modest easing on the grounds that Britain has passed the peak of the outbreak, with deaths and new infections in decline. The U.K. has officially recorded the most coronavirus-related deaths in Europe, more than 33,000, a toll second only to the United States. The government is trying to defeat the outbreak while gradually restarting an economy that shrank by 2% in the first quarter of the year, with output falling 5.8% in March, the month everyday life began to shut down. Treasury chief Rishi Sunak said the U.K. was headed for a \"significant recession. But there was confusion about the \u201cback to work\u201d guidance, first announced by U.K. Prime Minister Boris Johnson on Sunday. Critics of Johnson's Conservative government say the changes, spelled out in a 50-page document, are confusing and potentially dangerous. Johnson denied that there had been mixed messaging and told lawmakers that \u201cthe common sense of the British people is shining through.\u201d One of the main concerns centers on how people can travel to work while keeping to social distancing requirements, especially in London, where most commuters use public transit. Transport for London said that in the morning hours up to 10 a.m., the number of passengers on the capital\u2019s subway system was around 7.3% higher than on the same day last week. Carl Moss, 39, traveling to his job as a gardener at St. Thomas\u2019 Hospital in central London, said it's been \u201cbusier today\u201d and that he'd seen \u201cmore office, finance-type people\u201d as well as manual workers. The union that represents train drivers voiced concerns about overcrowding following images on social media showing passengers crowded together on Tube trains and buses. At London's Victoria train and subway station, worker Linda Freitas said she felt \u201canxious and a bit scared\u201d about the prospect of more commuters. A ticket office worker at the station died with COVID-19 last month after being spat at by a man claiming to have the coronavirus. \u201cIf it\u2019s done gradually let\u2019s see, but if it\u2019s too many people then it will be a bit of a problem,\" Freitas said. Meanwhile, Johnson is under fire for his government's handling of an outbreak that has infected more than 200,000 Britons \u2014 including the prime minister, who spent three nights in intensive care last month. On Wednesday, the government announced 600 million pounds ($735 million) in funding to stop coronavirus infections in nursing homes. But opponents said the money was too late to save thousands of vulnerable residents. More than 8,000 people with the coronavirus died in nursing homes up to the start of May, according to Britain\u2019s Office for National Statistics, and the full figure is likely substantially higher. Keir Starmer, the leader of the opposition Labour Party, accused the government of being lax for releasing people from hospitals into nursing homes earlier in the outbreak without testing them for the coronavirus. Johnson called the situation in care homes \u201ca tragedy\u201d but said the number of infections and deaths was now falling."


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
            e11 = path[0]['start']
            e12 = path[0]['end']
            e21 = path[1]['start']
            e22 = path[1]['end']
            new_text = text[:e11] + '<e1>' + text[e11:e12] + '</e1> ' + text[e12:e21] + '<e2>' + text[e21:e22] +\
                '</e2>' + text[e22:]
            res.append(
                {
                    "text": new_text.strip(),
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
    sentence = Sentence(clean_text, use_tokenizer=True)
    tagger_fast.predict(sentence)

    idTracker = defaultdict(int)

    dict_flair = sentence.to_dict(tag_type='ner')
    for idx in dict_flair['entities']:
        idx['id'] = idTracker[idx['text']]
        idTracker[idx['text']] += 1
        idx['end'] = idx.pop('end_pos')
        idx['start'] = idx.pop('start_pos')
        full_label = idx.pop('labels')[0]
        full_label = str(full_label)
        idx['type'] = full_label[:full_label.find(' ')]
    dict_flair.pop('labels')
    dict_flair['ents'] = dict_flair.pop('entities')
    return dict_flair


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
