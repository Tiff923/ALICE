import { put, all, call, select, takeEvery } from 'redux-saga/effects';
import { types, getNerData, getRelationData } from '../reducers/editstate';
import { nercolors } from '../utils/colors';
import $ from 'jquery';

// function getDocumentStore(issuer) {
//   return issuer.certificateStore || issuer.documentStore;
// }

export function* setNer({ payload }) {
  yield put({
    type: types.UPDATED_NER_DATA,
    payload: payload,
  });
}

export function* setRelation({ payload }) {
  yield put({
    type: types.UPDATED_RELATION_DATA,
    payload: payload,
  });
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

export function* updateNetwork({ data }) {
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
  takeEvery(types.UPDATING_NER_DATA, updateNer),
  takeEvery(types.UPDATING_RELATION_DATA, updateRelation),
];
