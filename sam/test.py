from pos import nltk_pos_tagger
from parser import NGramTagChunker
from nltk.corpus import conll2000

data = conll2000.chunked_sents()
train_data = data[:10900]
test_data = data[10900:]

# train chunker model
ntc = NGramTagChunker(train_data)

# evaluate chunker model performance
# print(ntc.evaluate(test_data))

chunk_tree = ntc.parse(nltk_pos_tagger('./test/alice_c1.txt'))
print(chunk_tree)
