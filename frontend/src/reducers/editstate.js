import data from './politics_in_cyberspace.json';
import { initialLayout } from '../utils/layout.js';
import { initialOverviewLayout } from '../utils/overviewLayout.js';

export const initialState = {
  // corpusData: data.corpusData,
  // fileNames: data.fileNames,
  // layout: {
  //   Chapter1: initialLayout,
  //   Chapter2: initialLayout,
  //   Chapter3: initialLayout,
  //   Chapter4: initialLayout,
  //   Conclusion: initialLayout,
  //   Overview: initialOverviewLayout,
  // },
  corpusData: null,
  fileNames: [],
  layout: {},
  fileUploaded: false,
  uploadingData: false,
  uploadStatus: null, // SUCCESS/FAILURE/null

  updatingRelationData: false,
  updatingNerData: false,
  updatingSentimentWordcloud: false,
  nerSearch: [new Set(), null],

  documentId: '',
};

// Actions
export const types = {
  RESET_STATE: 'RESET_STATE',

  UPDATING_RELATION_DATA: 'UPDATING_RELATION_DATA',
  UPDATING_NER_DATA: 'UPDATING_NER_DATA',
  UPDATED_RELATION_DATA: 'UPDATED_RELATION_DATA',
  UPDATED_NER_DATA: 'UPDATED_NER_DATA',
  UPDATED_NETWORK_DATA: 'UPDATED_NETWORK_DATA',
  UPDATING_SENTIMENT_WORDCLOUD: 'UPDATING_SENTIMENT_WORDCLOUD',
  UPDATED_SENTIMENT_WORDCLOUD: 'UPDATED_SENTIMENT_WORDCLOUD',

  UPLOADING_DATA: 'UPLOADING_DATA',
  UPLOAD_SUCCESS: 'UPLOAD_SUCCESS',
  UPLOAD_FAILURE: 'UPLOAD_FAILURE',
  FILE_UPLOADED: 'FILE_UPLOADED',

  UPLOADED_CORPUS_DATA: 'UPLOADED_CORPUS_DATA',
  SET_FILENAMES: 'SET_FILENAMES',
  SET_LAYOUT: 'SET_LAYOUT',
  CHANGE_LAYOUT: 'CHANGE_LAYOUT',

  SEARCH_NER: 'SEARCH_NER',
  SAVE_DOCUMENT_ID: 'SAVE_DOCUMENT_ID',
  SET_EXISTING_DOCUMENT: 'SET_EXISTING_DOCUMENT',
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
    case types.UPDATING_SENTIMENT_WORDCLOUD:
      return {
        ...state,
        updatingSentimentWordcloud: true,
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
    case types.UPDATED_SENTIMENT_WORDCLOUD:
      currentFileName = action.currentFileName;
      return {
        ...state,
        corpusData: {
          ...state.corpusData,
          [currentFileName]: {
            ...state.corpusData[currentFileName],
            sentiment: action.payload,
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
    case types.SAVE_DOCUMENT_ID:
      return {
        ...state,
        documentId: action.payload,
      };
    case types.SET_LAYOUT:
      return {
        ...state,
        layout: action.payload,
      };
    case types.CHANGE_LAYOUT:
      return {
        ...state,
        layout: {
          ...state.layout,
          [action.fileName]: action.layouts,
        },
      };
    case types.SET_EXISTING_DOCUMENT:
      return {
        ...state,
        corpusData: action.payload.corpusData,
        fileNames: action.payload.fileNames,
        layout: action.payload.layout,
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

export function updateSentimentWordcloud(payload) {
  return {
    type: types.UPDATING_SENTIMENT_WORDCLOUD,
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

export function saveDocumentId(payload) {
  return {
    type: types.SAVE_DOCUMENT_ID,
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

export function getSentimentData(store, ...args) {
  const currentFileName = args;
  return store.editstate.corpusData[currentFileName].sentiment;
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
  return store.editstate.uploadingData;
}

export function getLayout(store) {
  return store.editstate.layout;
}

export function getFileStatus(store) {
  return store.editstate.fileUploaded;
}

export function getDocumentId(store) {
  return store.editstate.documentId;
}
