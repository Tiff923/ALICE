import { put, all, call, select, takeEvery } from 'redux-saga/effects';
import { types, getNerData, getRelationData } from '../reducers/editstate';
import { nercolors } from '../utils/colors';
import $ from 'jquery';
import axios from 'axios';
import { initialLayout } from '../utils/layout';
import { initialOverviewLayout } from '../utils/overviewLayout';

export function* updateNetwork({ data, currentFileName }) {
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
      temp['relation'] = el['relation'];
    }
    var node_t = temp['target'];
    var node_t_label = node_t === el['e1'] ? el['e1_label'] : el['e2_label'];
    var node_s = temp['source'];
    var node_s_label = node_s === el['e2'] ? el['e2_label'] : el['e1_label'];
    if (node_t in nodes_temp) {
      nodes_temp[node_t]['val'] += 2;
      nodes_temp[node_t]['neighbors'].add(node_s);
    } else {
      nodes_temp[node_t] = {
        id: node_t,
        name: node_t,
        val: 2,
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
    currentFileName: currentFileName,
  });
}

function* setCorpusData({ data }) {
  yield put({
    type: types.UPLOADED_CORPUS_DATA,
    payload: data,
  });
}

function* setFileNames({ data }) {
  const fileNames = Object.keys(data);
  yield put({
    type: types.SET_FILENAMES,
    payload: fileNames,
  });
  var layouts = {};
  if (fileNames.length > 1) {
    fileNames
      .filter((e) => e !== 'Overview')
      .forEach((e) => (layouts[e] = initialLayout));
    layouts['Overview'] = initialOverviewLayout;
  } else {
    layouts[fileNames[0]] = initialLayout;
  }
  yield put({
    type: types.SET_LAYOUT,
    payload: layouts,
  });
}

const apiPost = (payload) => {
  const formData = new FormData();
  var fileNames = [];
  for (var i = 0; i < payload.length; i++) {
    formData.append('file'.concat(i.toString()), payload[i]);
    fileNames.push(payload[i].name);
  }
  fileNames = JSON.stringify(fileNames);
  formData.append('fileNames', fileNames);
  formData.append('length', payload.length);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  return axios.post(
    'http://backend-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/uploadFile',
    formData,
    {
      headers: headers,
    }
  );
};

const apiPostExisting = (payload) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  return axios.post(
    'http://getfromdb-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/getFromDB',
    { ID: payload },
    {
      headers: headers,
    }
  );
};

export function* uploadData({ payload }) {
  try {
    let res;
    if (payload.existing) {
      res = yield call(apiPostExisting, payload.docId);
      const existingData = res.data;
      yield put({
        type: types.SET_EXISTING_DOCUMENT,
        payload: existingData,
      });
    } else {
      res = yield call(apiPost, payload.files);
      console.log('DATA', res.data);
      const args = { data: res.data };
      yield all([call(setCorpusData, args), call(setFileNames, args)]);
    }
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
  const { newNer, nerToRelation, currentFileName } = payload;
  const currentNerData = yield select(getNerData, [currentFileName]);
  const text = currentNerData.text;
  const currentRelationData = yield select(getRelationData, currentFileName);
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
    currentFileName: currentFileName,
  });
  const args = { data: newRelationData, currentFileName: currentFileName };
  yield all([call(updateRelationHelper, args), call(updateNetwork, args)]);
}

export function* updateRelationHelper({ data, currentFileName }) {
  yield put({
    type: types.UPDATED_RELATION_DATA,
    payload: data,
    currentFileName: currentFileName,
  });
}

export function* updateRelation({ payload }) {
  const { newRelation, currentFileName } = payload;
  const args = { data: newRelation, currentFileName: currentFileName };
  yield all([call(updateRelationHelper, args), call(updateNetwork, args)]);
}

export default [
  takeEvery(types.UPLOADING_DATA, uploadData),
  takeEvery(types.UPDATING_NER_DATA, updateNer),
  takeEvery(types.UPDATING_RELATION_DATA, updateRelation),
];
