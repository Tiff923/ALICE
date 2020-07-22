import { put, all, call, select, takeEvery } from 'redux-saga/effects';
import { types, getNerData, getRelationData } from '../reducers/editstate';
import axios from 'axios';
import { initialLayout } from '../utils/layout';
import { initialOverviewLayout } from '../utils/overviewLayout';

const apiPostNetwork = (data) => {
  const formData = new FormData();
  formData.append('relationData', JSON.stringify(data));
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST',
  };
  return axios.post(
    'http://updatenetwork-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/updateNetwork',
    formData,
    {
      headers: headers,
    }
  );
};

function* updateNetworkHelper({ data, currentFileName }) {
  const res = yield call(apiPostNetwork, data);
  const networkData = res.data;
  yield put({
    type: types.UPDATED_NETWORK_DATA,
    payload: networkData,
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

const apiPostJson = (payload) => {
  const formData = new FormData();
  formData.append('existingFile', payload);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  return axios.post(
    'http://loadexistingfile-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/loadExistingFile',
    formData,
    {
      headers: headers,
    }
  );
};

const apiPostDb = (payload) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  return axios.post(
    'http://loaddbfile-alice.apps.8d5714affbde4fa6828a.southeastasia.azmosa.io/loadDbFile',
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
      if (payload.docId) {
        res = yield call(apiPostDb, payload.docId);
      } else {
        res = yield call(apiPostJson, payload.files);
      }
      const existingData = res.data;

      // Remove bugs related to network graph when loading existing file
      existingData.fileNames.forEach((document) => {
        if (existingData.corpusData[document].network.links[0].source.id) {
          existingData.corpusData[document].network.links.forEach((link) => {
            link.source = link.source.id;
            link.target = link.target.id;
            delete link.__indexColor;
            delete link.__controlPoints;
            delete link.__photons;
            delete link.index;
          });

          existingData.corpusData[document].network.nodes.forEach((node) => {
            delete node.index;
            delete node.x;
            delete node.y;
            delete node.vx;
            delete node.vy;
            delete node.__indexColor;
          });
        }
      });

      yield put({
        type: types.SET_EXISTING_DOCUMENT,
        payload: existingData,
      });
    } else {
      res = yield call(apiPost, payload.files);
      const newData = res.data;

      // Remove bugs related to network graph when generating new data
      Object.keys(newData).forEach((document) => {
        if (newData[document].network.links[0].source.id) {
          newData.corpusData[document].network.links.forEach((link) => {
            link.source = link.source.id;
            link.target = link.target.id;
            delete link.__indexColor;
            delete link.__controlPoints;
            delete link.__photons;
            delete link.index;
          });

          newData[document].network.nodes.forEach((node) => {
            delete node.index;
            delete node.x;
            delete node.y;
            delete node.vx;
            delete node.vy;
            delete node.__indexColor;
          });
        }
      });
      const args = { data: newData };
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

function* updateNer({ payload }) {
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
  yield all([
    call(updateRelationHelper, args),
    call(updateNetworkHelper, args),
  ]);
}

function* updateRelationHelper({ data, currentFileName }) {
  yield put({
    type: types.UPDATED_RELATION_DATA,
    payload: data,
    currentFileName: currentFileName,
  });
}

function* updateRelation({ payload }) {
  const { newRelation, currentFileName } = payload;
  const args = { data: newRelation, currentFileName: currentFileName };
  yield all([
    call(updateRelationHelper, args),
    call(updateNetworkHelper, args),
  ]);
}

export default [
  takeEvery(types.UPLOADING_DATA, uploadData),
  takeEvery(types.UPDATING_NER_DATA, updateNer),
  takeEvery(types.UPDATING_RELATION_DATA, updateRelation),
];
