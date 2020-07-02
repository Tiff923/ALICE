#!/bin/bash
echo "Download Models"
(
    cd ./benchmark && mkdir nyt10
    wget -P nyt10 https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/nyt10/nyt10_rel2id.json
    wget -P nyt10 https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/nyt10/nyt10_train.txt
    wget -P nyt10 https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/nyt10/nyt10_val.txt
    wget -P nyt10 https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/nyt10/nyt10_test.txt
)
(
    cd ./benchmark && mkdir semeval
    wget -P semeval https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/semeval/semeval_rel2id.json
    wget -P semeval https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/semeval/semeval_train.txt
    wget -P semeval https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/semeval/semeval_val.txt
    wget -P semeval https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/semeval/semeval_test.txt
)
(
    cd ./benchmark && mkdir wiki80
    wget -P wiki80 https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/wiki80/wiki80_rel2id.json
    wget -P wiki80 https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/wiki80/wiki80_train.txt
    wget -P wiki80 https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/benchmark/wiki80/wiki80_val.txt
)
(
    cd ./pretrain && mkdir bert-base-uncased
    wget -P bert-base-uncased https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/pretrain/bert-base-uncased/config.json
    wget -P bert-base-uncased https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/pretrain/bert-base-uncased/pytorch_model.bin
    wget -P bert-base-uncased https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/pretrain/bert-base-uncased/vocab.txt
)
(
    cd ./pretrain && mkdir glove
    wget -P glove https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/pretrain/glove/glove.6B.50d_mat.npy
    wget -P glove https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/pretrain/glove/glove.6B.50d_word2id.json
)
(
    cd ./pretrain && mkdir nre
    wget -P nre https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/pretrain/nre/wiki80_bert_softmax.pth.tar
    wget -P nre https://thunlp.oss-cn-qingdao.aliyuncs.com/opennre/pretrain/nre/wiki80_cnn_softmax.pth.tar
)
