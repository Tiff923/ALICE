FROM python:3.6-slim
WORKDIR /app
ADD . /app
RUN apt-get update && \
    apt-get install -y wget
RUN cd /app/pretrain && \
    sh ./download_wiki80_bert_softmax.sh && \
    sh download_wiki80_cnn_softmax.sh
RUN cd /app/benchmark && \
    sh ./download_fewrel.sh && \
    sh ./download_nyt10.sh && \
    sh ./download_semeval.sh && \
    sh ./download_wiki80.sh
RUN cd /app/pretrain && \
    sh ./download_bert.sh && \
    sh ./download_glove.sh
RUN cd /app && \
    pip install -r requirements.txt
RUN python -m nltk.downloader punkt
RUN python setup.py install 
EXPOSE 5010
CMD [ "python", "relation_predict.py" ]