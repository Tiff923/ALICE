import { put, all, call, select, takeEvery } from 'redux-saga/effects';
import { types, getNerData, getRelationData } from '../reducers/editstate';
import { nercolors } from '../utils/colors';
import $ from 'jquery';
import axios from 'axios';

export function* updateNetwork({ data }) {
  // console.log(data, 'data');
  const links = [];
  const links_template = {
    source: '',
    target: '',
  };
  // Edges
  const nodes_temp = {};
  for (var i = 0; i < data.length; i++) {
    var temp = $.extend(true, {}, links_template);
    var el = data[i];
    if (el['relation'].slice(-7) === '(e2,e1)') {
      temp['source'] = el['e2'];
      temp['target'] = el['e1'];
    } else {
      temp['source'] = el['e1'];
      temp['target'] = el['e2'];
    }
    var node_t = temp['target'];
    var node_t_label = node_t === el['e1'] ? el['e1_label'] : el['e2_label'];
    var node_s = temp['source'];
    var node_s_label = node_s === el['e2'] ? el['e2_label'] : el['e1_label'];
    if (node_t in nodes_temp) {
      nodes_temp[node_t]['val'] += 4;
      nodes_temp[node_t]['neighbors'].add(node_s);
    } else {
      nodes_temp[node_t] = {
        id: node_t,
        name: node_t,
        val: 4,
        color: nercolors[node_t_label],
        neighbors: new Set(node_s),
      };
    }
    if (node_s in nodes_temp) {
      nodes_temp[node_s]['val'] += 2;
      nodes_temp[node_s]['neighbors'].add(node_t);
    } else {
      nodes_temp[node_s] = {
        id: node_s,
        name: node_s,
        val: 2,
        color: nercolors[node_s_label],
        neighbors: new Set(node_t),
      };
    }
    links.push(temp);
  }

  const nodes = $.map(nodes_temp, function (value, key) {
    value['neighbors'] = Array.from(value['neighbors']);
    return value;
  });
  yield put({
    type: types.UPDATED_NETWORK_DATA,
    payload: { nodes: nodes, links: links },
  });
}

export function* setSentiment({ data }) {
  const { negativity, positivity, subjectivity } = data.sentiment;

  yield put({
    type: types.UPLOADED_SENTIMENT_DATA,
    payload: [
      {
        sentiment: 'sentiment',
        positivity: positivity * 100,
        negativity: negativity * 100,
      },
      {
        sentiment: 'subjective',
        subjectivity: subjectivity * 100,
      },
    ],
  });
}

export function* setTopic({ data }) {
  yield put({
    type: types.UPLOADED_TOPIC_DATA,
    payload: data.topics,
  });
}

export function* setClassifier({ data }) {
  yield put({
    type: types.UPLOADED_CLASSIFIER_DATA,
    payload: data.classify.classify,
  });
}

export function* setNer({ data }) {
  yield put({
    type: types.UPLOADED_NER_DATA,
    payload: data.ner,
  });
}

export function* setSummary({ data }) {
  yield put({
    type: types.UPLOADED_SUMMARY_DATA,
    payload: data.summary.summary,
  });
}

export function* setRelationHelper({ data }) {
  yield put({
    type: types.UPLOADED_RELATION_DATA,
    payload: data,
  });
}

export function* setRelation({ data }) {
  const args = { data: data.relation.relation };
  yield all([call(setRelationHelper, args), call(updateNetwork, args)]);
}

export function* setKeyData({ data }) {
  const num_words = data.ner.text.split(' ').length;
  const topic_classifier = data.classify.classify;
  const sentiment = data.sentiment.sentiment;
  const legitimacy = 'Trusted';
  yield put({
    type: types.UPLOADED_KEY_DATA,
    payload: {
      num_words: num_words,
      topic_classifier: topic_classifier,
      sentiment: sentiment,
      legitimacy: legitimacy,
    },
  });
}

export function* setWordCloud({ data }) {
  const wordcloud = data.wordcloud;
  yield put({
    type: types.UPLOADED_WORD_CLOUD,
    payload: wordcloud,
  });
}

const apiPost = (payload) => {
  if (payload[1] === 'STRING') {
    return axios.post('http://0ee4fc55f51d.ngrok.io/uploadText', {
      data: payload[0],
    });
  } else if (payload[1] === 'TXT') {
    var formData = new FormData();
    formData.append('file', payload[0]);
    return axios.post('http://0ee4fc55f51d.ngrok.io/uploadFile', formData);
  }
};

export function* uploadData({ payload }) {
  try {
    const res = yield call(apiPost, payload);
    console.log(res.data);
    const args = { data: res.data };
    yield all([
      call(setSentiment, args),
      call(setTopic, args),
      call(setWordCloud, args),
      call(setSummary, args),
      call(setRelation, args),
      call(setNer, args),
      call(setKeyData, args),
    ]);
    yield put({
      type: types.UPLOAD_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: types.UPLOAD_FAILURE,
    });
    console.log('ERROR', error);
  }
}

export function* updateNer({ payload }) {
  const { newNer, nerToRelation } = payload;

  const currentNerData = yield select(getNerData);
  const text = currentNerData.text;
  const currentRelationData = yield select(getRelationData);
  var newRelationData;
  if (nerToRelation[3] === 'DELETE') {
    newRelationData = currentRelationData.filter((e) => {
      return (
        (e.e1 !== nerToRelation[0] || e.e1_id !== nerToRelation[1]) &&
        (e.e2 !== nerToRelation[0] || e.e2_id !== nerToRelation[1])
      );
    });
  } else {
    newRelationData = currentRelationData.map((e) => {
      if (e.e1 === nerToRelation[0] && e.e1_id === nerToRelation[1]) {
        e.e1_label = nerToRelation[2];
      } else if (e.e2 === nerToRelation[0] && e.e2_id === nerToRelation[1]) {
        e.e2_label = nerToRelation[2];
      }
      return e;
    });
  }

  yield put({
    type: types.UPDATED_NER_DATA,
    payload: {
      text: text,
      ents: newNer,
    },
  });
  const args = { data: newRelationData };
  yield all([call(updateRelationHelper, args), call(updateNetwork, args)]);
}

export function* updateRelationHelper({ data }) {
  yield put({
    type: types.UPDATED_RELATION_DATA,
    payload: data,
  });
}

export function* updateRelation({ payload }) {
  const args = { data: payload };
  yield all([call(updateRelationHelper, args), call(updateNetwork, args)]);
}

export default [
  takeEvery(types.UPLOADING_DATA, uploadData),
  takeEvery(types.UPDATING_NER_DATA, updateNer),
  takeEvery(types.UPDATING_RELATION_DATA, updateRelation),
];
