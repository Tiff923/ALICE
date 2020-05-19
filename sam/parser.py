from nltk.tag import UnigramTagger, BigramTagger
from nltk.chunk import ChunkParserI
from nltk.chunk.util import tree2conlltags, conlltags2tree


def conll_tag_chunks(chunk_sents):
    """Extracts POS and chunk tags from sentences with chunked annotations.
    tree2conlltags returns triples of word, tag, and chunk tags for each token."""
    tagged_sents = [tree2conlltags(tree) for tree in chunk_sents]
    return [[(t, c) for (w, t, c) in sent] for sent in tagged_sents]


def combined_tagger(train_data, taggers, backoff=None):
    """Trains multiple taggers with backoff taggers
    (e.g. unigram and bigram taggers). If a tagger doesn’t know about the 
    tagging of a word, then it passes this tagging task to the next backoff 
    tagger."""
    for tagger in taggers:
        backoff = tagger(train_data, backoff=backoff)
    return backoff


class NGramTagChunker(ChunkParserI):

    def __init__(self, train_sentences,
                 tagger_classes=[UnigramTagger, BigramTagger]):
        #  conlltags2tree generates a parse tree from these token triples
        train_sent_tags = conll_tag_chunks(train_sentences)
        self.chunk_tagger = combined_tagger(train_sent_tags, tagger_classes)

    def parse(self, tagged_sentence):
        if not tagged_sentence:
            return None
        pos_tags = [tag for word, tag in tagged_sentence]
        chunk_pos_tags = self.chunk_tagger.tag(pos_tags)
        chunk_tags = [chunk_tag for (pos_tag, chunk_tag) in chunk_pos_tags]
        wpc_tags = [(word, pos_tag, chunk_tag) for ((word, pos_tag), chunk_tag)
                    in zip(tagged_sentence, chunk_tags)]
        return conlltags2tree(wpc_tags)
