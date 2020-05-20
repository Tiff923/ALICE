from gensim import corpora, models
from util import normalize_corpus,tokenize_text

def print_topics_gensim(topic_model, total_topics=1,
                        weight_threshold=0.0001,
                        display_weights=False,
                        num_terms=None):
     for index in range(total_topics):
         topic = topic_model.show_topic(index)
         topic = [(word, round(wt,2))for word, wt in topic if abs(wt) >= weight_threshold]
         if display_weights:
             print ('Topic #'+str(index+1)+' with weights')
             print (topic[:num_terms] if num_terms else topic)
         else:
             print ('Topic #'+str(index+1)+' without weights')
             tw = [term for term, wt in topic]
             print (tw[:num_terms] if num_terms else tw)
             

def train_lda_model_gensim(corpus, total_topics=2):
     norm_corpus = normalize_corpus(corpus) 
     norm_tokenized_corpus = tokenize_text(norm_corpus)
     dictionary = corpora.Dictionary(norm_tokenized_corpus)
     mapped_corpus = [dictionary.doc2bow(text)for text in norm_tokenized_corpus]
     tfidf = models.TfidfModel(mapped_corpus)
     corpus_tfidf = tfidf[mapped_corpus]
     lda = models.LdaModel(corpus_tfidf,
                           id2word=dictionary,
                           iterations=1000,
                           num_topics=total_topics)
     return lda

corpus= [
    "A team of local researchers are working on a Covid-19 vaccine that can be modified within three weeks to tackle the Sars-CoV-2 virus if it mutates, and they are hoping for human trials within six months.Home-grown Esco Aster is developing the vaccine with United States biotechnology company Vivaldi Biosciences, tapping chimeric vaccines which are created by merging proteins from different viruses.The work-in-progress vaccine, currently named Esco Aster DeltaCov, was constructed by joining antigens from the Sars-CoV-2 virus - which causes Covid-19 - with a protein backbone from the flu virus.", 
    "Researchers at Singapore's Agency for Science, Technology and Research (A*Star) have discovered an antibody that targets a specific part of the coronavirus, preventing it from infecting human cells, and are moving to develop it to defend against the Covid-19 disease.Dr Wang Cheng-I, senior principal investigator at A*Star's Singapore Immunology Network, said that his team discovered the antibody in mid-March, finding it in a collection of 30 billion human antibodies made by recombinant DNA technology.They confirmed its ability to prevent infection early last month.", 
    "A biotechnology firm based in Singapore has joined in the global effort to find a vaccine against Covid-19.Immunoscape has tied up with partners here and overseas on two studies to find out how patients' immune systems react to the coronavirus which causes Covid-19.The goal of the projects, which started earlier this month, is to study the behaviour of Covid-19-specific immune cells, which recognise and kill cells infected by the virus.", 
    "Coping during the circuit breaker period could be sometimes lonely and difficult for Madam Izamzamah Kusmon, 49, a single mother and caregiver to her 68-year-old mother, who suffers from a heart disease. I don't have many friends that I can talk to, and my mother and I don't really talk or share so much with each other, she said. As a stroke survivor, she is at greater risk of complications like pneumonia if she contracts the coronavirus, which means she should try to stay home as much as possible.", 
    "SINGAPORE - Senior Parliamentary Secretary for Education and Manpower Low Yen Ling has come down with dengue fever, placing her among the hundreds of people who have fallen ill in recent days as Singapore enters its peak season for the disease.Ms Low is an MP for Chua Chu Kang GRC, home to some of the high-risk areas for dengue in Singapore.She said in a Facebook post on Monday (May 11) morning: As I have just come down with dengue fever, please bear with me if my email response is delayed. Doctor has advised me to take some time out these few days to rest and recover."]

lda_gensim = train_lda_model_gensim(corpus,
                                    total_topics=5)

print_topics_gensim(topic_model=lda_gensim,
                     total_topics=5,
                     num_terms=5,
                     display_weights=True)
