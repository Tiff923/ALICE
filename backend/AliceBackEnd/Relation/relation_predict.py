import numpy as np
import pandas as pd
import os
import AliceBackEnd.Relation.utils as utils
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
import tensorflow as tf

if tf.test.gpu_device_name():
    print('GPU found')
else:
    print("No GPU found")

def main(ner_output):
    test_text, test_e1, test_e2, test_pos1, test_pos2 = utils.process_input(ner_output)

    # Encode input_text
    model_dir = os.path.join(os.getcwd(), "AliceBackEnd\\Relation\\model")
    text_path = os.path.join(model_dir, "vocab")
    vocab_processor = tf.contrib.learn.preprocessing.VocabularyProcessor.restore(text_path)
    x = np.array(list(vocab_processor.transform(test_text)))

    # Get Vocab Size
    test_text = np.array(test_text)
    print("\nText Vocabulary Size: {:d}".format(len(vocab_processor.vocabulary_)))
    print("test_x = {0}".format(x.shape))

    # Encode position of entities
    position_path = os.path.join(model_dir, "pos_vocab")
    pos_vocab_processor = tf.contrib.learn.preprocessing.VocabularyProcessor.restore(position_path)
    test_p1 = np.array(list(pos_vocab_processor.transform(test_pos1)))
    test_p2 = np.array(list(pos_vocab_processor.transform(test_pos2)))
    print("test_p1 = {0}".format(test_p1.shape))
    print("test_p2 = {0}".format(test_p2.shape))
    print("\nPosition Vocabulary Size: {:d}".format(len(pos_vocab_processor.vocabulary_)))

    # Get model path
    model_path = os.path.join(model_dir, "model-83.8-34600")

    # Load trained model and make predictions
    graph = tf.Graph()
    preds=[]
    with tf.Session(graph=graph) as sess:
        # Load the graph with the trained states
        loader = tf.train.import_meta_graph(model_path+'.meta')
        loader.restore(sess, model_path)
        
        input_x = graph.get_operation_by_name("input_x").outputs[0]
        input_y = graph.get_operation_by_name("input_y").outputs[0]
        input_text = graph.get_operation_by_name("input_text").outputs[0]
        input_e1 = graph.get_operation_by_name("input_e1").outputs[0]
        input_e2 = graph.get_operation_by_name("input_e2").outputs[0]
        input_p1 = graph.get_operation_by_name("input_p1").outputs[0]
        input_p2 = graph.get_operation_by_name("input_p2").outputs[0]
        emb_dropout_keep_prob = graph.get_operation_by_name("emb_dropout_keep_prob").outputs[0]
        rnn_dropout_keep_prob = graph.get_operation_by_name("rnn_dropout_keep_prob").outputs[0]
        dropout_keep_prob = graph.get_operation_by_name("dropout_keep_prob").outputs[0]
        predictions = graph.get_operation_by_name("output/predictions").outputs[0]
        
        for i in range(len(x)):
            feed_dict = {
                input_x: [x[i]],
                input_text: [test_text[i]],
                input_e1: [test_e1[i]],
                input_e2: [test_e2[i]],
                input_p1: [test_p1[i]],
                input_p2: [test_p2[i]],
                emb_dropout_keep_prob: 1.0,
                rnn_dropout_keep_prob: 1.0,
                dropout_keep_prob: 1.0
                }
            pred = sess.run(predictions, feed_dict)
            ner_output[i]['relation'] = utils.label2class[pred[0]]
    returnJson = {"relation": ner_output}
    return returnJson



