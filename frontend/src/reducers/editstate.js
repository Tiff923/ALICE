import data from './data.json';
// import memoirData from './memoir.json';
import { initialLayout } from '../utils/layout';
import { initialOverviewLayout } from '../utils/overviewLayout';

export const initialState = {
  corpusData: null,
  fileNames: [],
  layout: {},

  // corpusData: data,
  // fileNames: [
  //   'Overview',
  //   'Conclusion.pdf',
  //   'Abstract.pdf',
  //   'Chapter1.pdf',
  //   'Chapter2.pdf',
  //   'Chapter3.pdf',
  //   'Chapter4.pdf',
  // ],
  // layout: {
  //   Overview: initialOverviewLayout,
  //   'Conclusion.pdf': initialLayout,
  //   'Abstract.pdf': initialLayout,
  //   'Chapter1.pdf': initialLayout,
  //   'Chapter2.pdf': initialLayout,
  //   'Chapter3.pdf': initialLayout,
  //   'Chapter4.pdf': initialLayout,
  // },

  // corpusData: memoirData,
  // fileNames: [
  //   'Overview',
  //   'Chapter 1.pdf',
  //   'Chapter 2.pdf',
  //   'Chapter 3.pdf',
  //   'Chapter 4.pdf',
  //   'Chapter 5.pdf',
  //   'Chapter 6.pdf',
  //   'Chapter 7.pdf',
  //   'Chapter 8.pdf',
  //   'Chapter 9.pdf',
  //   'Chapter 10.pdf',
  //   'Chapter 11.pdf',
  //   'Chapter 12.pdf',
  //   'Chapter 13.pdf',
  //   'Chapter 14.pdf',
  //   'Chapter 15.pdf',
  // ],
  // layout: {
  //   Overview: initialOverviewLayout,
  //   'Chapter 1.pdf': initialLayout,
  //   'Chapter 2.pdf': initialLayout,
  //   'Chapter 3.pdf': initialLayout,
  //   'Chapter 4.pdf': initialLayout,
  //   'Chapter 5.pdf': initialLayout,
  //   'Chapter 6.pdf': initialLayout,
  //   'Chapter 7.pdf': initialLayout,
  //   'Chapter 8.pdf': initialLayout,
  //   'Chapter 9.pdf': initialLayout,
  //   'Chapter 10.pdf': initialLayout,
  //   'Chapter 11.pdf': initialLayout,
  //   'Chapter 12.pdf': initialLayout,
  //   'Chapter 13.pdf': initialLayout,
  //   'Chapter 14.pdf': initialLayout,
  //   'Chapter 15.pdf': initialLayout,
  // },

  fileUploaded: false,
  uploadingData: false,
  uploadStatus: null, // SUCCESS/FAILURE/null

  updatingRelationData: false,
  updatingNerData: false,
  nerSearch: [new Set(), null],

  aliceID: null,
};

// Actions
export const types = {
  RESET_STATE: 'RESET_STATE',

  UPDATING_RELATION_DATA: 'UPDATING_RELATION_DATA',
  UPDATING_NER_DATA: 'UPDATING_NER_DATA',
  UPDATED_RELATION_DATA: 'UPDATED_RELATION_DATA',
  UPDATED_NER_DATA: 'UPDATED_NER_DATA',
  UPDATED_NETWORK_DATA: 'UPDATED_NETWORK_DATA',

  UPLOADING_DATA: 'UPLOADING_DATA',
  UPLOAD_SUCCESS: 'UPLOAD_SUCCESS',
  UPLOAD_FAILURE: 'UPLOAD_FAILURE',
  FILE_UPLOADED: 'FILE_UPLOADED',

  UPLOADED_CORPUS_DATA: 'UPLOADED_CORPUS_DATA',
  SET_FILENAMES: 'SET_FILENAMES',

  SEARCH_NER: 'SEARCH_NER',
  SAVE_CONFIG: 'SAVE_CONFIG',
  CHANGE_LAYOUT: 'CHANGE_LAYOUT',
};

// Reducers
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.RESET_STATE:
      return { ...initialState };
    case types.UPDATING_RELATION_DATA:
      return {
        ...state,
        updatingRelationData: true,
      };
    case types.UPDATING_NER_DATA:
      return {
        ...state,
        updatingNerData: true,
      };
    case types.UPDATED_RELATION_DATA:
      var currentFileName = action.currentFileName;
      return {
        ...state,
        corpusData: {
          ...state.corpusData,
          [currentFileName]: {
            ...state.corpusData[currentFileName],
            relation: action.payload,
          },
        },
        updatingRelationData: false,
      };
    case types.UPDATED_NETWORK_DATA:
      currentFileName = action.currentFileName;
      return {
        ...state,
        corpusData: {
          ...state.corpusData,
          [currentFileName]: {
            ...state.corpusData[currentFileName],
            network: action.payload,
          },
        },
      };
    case types.UPDATED_NER_DATA:
      currentFileName = action.currentFileName;
      return {
        ...state,
        corpusData: {
          ...state.corpusData,
          [currentFileName]: {
            ...state.corpusData[currentFileName],
            ner: action.payload,
          },
        },
        updatingNerData: false,
      };
    case types.SEARCH_NER:
      return {
        ...state,
        nerSearch: action.payload,
      };

    case types.UPLOADED_CORPUS_DATA:
      return {
        ...state,
        corpusData: action.payload,
      };
    case types.UPLOADING_DATA:
      return {
        ...state,
        uploadingData: true,
        fileUploaded: true,
      };
    case types.UPLOAD_SUCCESS:
      return {
        ...state,
        uploadingData: false,
        uploadStatus: 'SUCCESS',
      };
    case types.UPLOAD_FAILURE:
      return {
        ...state,
        uploadingData: false,
        uploadStatus: 'FAILURE',
      };
    case types.SET_FILENAMES:
      return {
        ...state,
        fileNames: action.payload,
      };
    case types.SAVE_CONFIG:
      return {
        ...state,
        aliceID: action.payload,
      };
    case types.CHANGE_LAYOUT:
      return {
        ...state,
        layout: {
          ...state.layout,
          [action.fileName]: action.layouts,
        },
      };
    default:
      return state;
  }
}

// Action Creators
export function resetState(payload) {
  return { type: types.RESET_STATE, payload };
}

export function updateRelation(payload) {
  return {
    type: types.UPDATING_RELATION_DATA,
    payload,
  };
}

export function updateNer(payload) {
  return {
    type: types.UPDATING_NER_DATA,
    payload,
  };
}

export function udpateNerSearch(payload) {
  return {
    type: types.SEARCH_NER,
    payload,
  };
}

export function uploadingData(payload) {
  return {
    type: types.UPLOADING_DATA,
    payload,
  };
}

export function saveConfig(payload) {
  return {
    type: types.SAVE_CONFIG,
    payload,
  };
}

export function changeLayout(payload) {
  var layouts = payload.layouts;
  var fileName = payload.fileName;
  return {
    type: types.CHANGE_LAYOUT,
    layouts,
    fileName,
  };
}

// Selectors
export function getNerData(store, ...args) {
  const currentFileName = args;
  return store.editstate.corpusData[currentFileName].ner;
}

export function getRelationData(store, ...args) {
  const currentFileName = args;
  return store.editstate.corpusData[currentFileName].relation;
}

export function getCorpusData(store) {
  return store.editstate.corpusData;
}

export function getFileNames(store) {
  return store.editstate.fileNames;
}

export function getNerSearch(store) {
  return store.editstate.nerSearch;
}

export function getUploadStatus(store) {
  return store.editstate.uploadStatus;
}

export function isUploadingData(store) {
  return store.editstate.isUploadingData;
}

export function getLayout(store) {
  return store.editstate.layout;
}

export function getFileStatus(store) {
  return store.editstate.fileUploaded;
}
