from util import extract_text
import pandas as pd
import nltk
import spacy
nlp = spacy.load("en")


def spacy_pos_tagger(source):
    normalized_corpus = extract_text(source)

    spacy_pos_tagged = []
    for sentence in normalized_corpus:
        sentence_nlp = nlp(sentence)
        for word in sentence_nlp:
            spacy_pos_tagged.append((word, word.tag_, word.pos_))
    return spacy_pos_tagged
    # df = pd.DataFrame(spacy_pos_tagged, columns=['Word', 'POS tag', 'Tag type'])
    # return df


def nltk_pos_tagger(source):
    normalized_corpus = extract_text(source)

    nltk_pos_tagged = []
    for sentence in normalized_corpus:
        nltk_pos_tagged.extend(nltk.pos_tag(sentence))
    return nltk_pos_tagged

    # Hardcoded right now because this returns the entire text as a one element list.
    # I believe it should be a list of sentences, where you loop through the sentences
    # return nltk.pos_tag(normalized_corpus[0].split())

    # df = pd.DataFrame(nltk_pos_tagged, columns=['Word', 'POS tag'])
    # return df
