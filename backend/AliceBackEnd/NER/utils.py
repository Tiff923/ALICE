import re
import unicodedata
from bs4 import BeautifulSoup
from contractions import CONTRACTION_MAP
import spacy
import nltk
import textract
nlp = spacy.load("en")


def remove_html_tags(text):
    """Removes HTML tags."""
    soup = BeautifulSoup(text, "html.parser")
    stripped_text = soup.get_text()
    return stripped_text


def remove_accents(text):
    """Removes accented words from text"""
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8', 'ignore')
    return text


def expand_contractions(text, contraction_mapping=CONTRACTION_MAP):
    """Expands contractions into proper words"""
    contractions_pattern = re.compile('({})'.format('|'.join(contraction_mapping.keys())),
                                      flags=re.IGNORECASE | re.DOTALL)

    def expand_match(contraction):
        match = contraction.group(0)
        first_char = match[0]
        expanded_contraction = contraction_mapping.get(match)\
            if contraction_mapping.get(match)\
            else contraction_mapping.get(match.lower())
        expanded_contraction = first_char+expanded_contraction[1:]
        return expanded_contraction

    expanded_text = contractions_pattern.sub(expand_match, text)
    expanded_text = re.sub("'", "", expanded_text)
    return expanded_text


def remove_special_characters(text, remove_digits=False):
    """Removes special characters (non-alphanumeric characters)."""
    pattern = r'[^a-zA-z0-9\s]' if not remove_digits else r'[^a-zA-z\s]'
    text = re.sub(pattern, ' ', text)
    text = re.sub(' +', ' ', text)
    return text


def lemmatization(text):
    """Removes word affixes to return the base form of a word."""
    text = nlp(text)
    text = ' '.join([word.lemma_ if word.lemma_ != '-PRON-'
                     else word.text for word in text])
    return text


def remove_stopwords(text):
    """Removes stopwords, i.e. words with little or no significance,
    such as a, an, the, and."""
    doc = nlp(text)
    tokens = [token.orth_ for token in doc if not token.is_stop]
    # | token.is_punct | token.is_space
    filtered_text = ' '.join(tokens)
    return filtered_text


def normalize_corpus(corpus, to_lower=True, to_remove_html=False,
                     to_remove_accent=True, to_expand_contractions=True,
                     to_lemmatize=True, to_remove_special=True,
                     to_remove_stopword=True):

    normalized_corpus = []
    for sentence in corpus:
        # Remove line break
        if to_remove_html:
            sentence = remove_html_tags(sentence)
        if to_remove_accent:
            sentence = remove_accents(sentence)
        sentence = re.sub(r'[\r|\n|\r\n]+', ' ', sentence)
        if to_expand_contractions:
            sentence = expand_contractions(sentence)
        if to_remove_special:
            # insert spaces between special characters to isolate them
            special_char_pattern = re.compile(r'([{.(-)!}])')
            sentence = special_char_pattern.sub(" \\1 ", sentence)
            sentence = remove_special_characters(sentence)

        if not sentence:
            continue

        if to_lower:
            sentence = sentence.lower()

        if to_lemmatize:
            sentence = lemmatization(sentence)
        if to_remove_stopword:
            sentence = remove_stopwords(sentence)

        # remove extra whitespace
        sentence = re.sub(' +', ' ', sentence)
        sentence = sentence.strip()
        if sentence:
            normalized_corpus.append(sentence)

    return normalized_corpus


def extract_text(source, to_lower=True, to_remove_html=False,
                 to_remove_accent=True, to_expand_contractions=True,
                 to_lemmatize=True, to_remove_special=True,
                 to_remove_stopword=True):
    raw_text = textract.process(source)
    text = raw_text.decode()
    sentences = nltk.sent_tokenize(text)
    corpus = normalize_corpus(sentences, to_lower=to_lower, to_remove_html=to_remove_html,
                              to_remove_accent=to_remove_accent, to_expand_contractions=to_expand_contractions,
                              to_lemmatize=to_lemmatize, to_remove_special=to_remove_special,
                              to_remove_stopword=to_remove_stopword)
    return corpus


# test = "Please, Ma'am, is this New Zealand or Australia?' (and\nshe tried to curtsey as she spoke--fancy CURTSEYING as you're falling\nthrough the air! Do you think you could manage it?) 'And what an\nignorant little girl she'll think me for asking! No, it'll never do to\nask: perhaps I shall see it written up somewhere.'"
# print(extract_text('./test/alice_c1.txt', to_lower=False, to_lemmatize=False, to_remove_stopword=False))
