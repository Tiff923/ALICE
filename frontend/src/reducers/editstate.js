// import rdat from '../components/RelationExtraction/relationdata.json';
// import ndat from '../components/NerTable/nerdata.json';
// import ntwkdat from '../components/NetworkGraph/networkdata.json';
// import sentimentdat from '../components/SentimentGraph/sentimentdata.json';
// import topicdat from '../components/TopicModelling/topicdata.json';

export const initialState = {
  // relationData: rdat,
  // nerData: ndat,
  // networkData: ntwkdat,
  // sentimentData: sentimentdat,
  // topicData: topicdat,
  // summaryData: 'HIHIHIHI',
  // keyData: {
  //   num_words: 10,
  //   topic_classifier: 'crime',
  //   sentiment: 'positive',
  //   legitimacy: 'trusted',
  // },
  relationData: null,
  nerData: null,
  networkData: null,
  sentimentData: null,
  topicData: null,
  classifierData: null,
  summaryData: null,
  keyData: null,
  wordCloud: null,

  uploadingData: false,
  uploadStatus: null, // SUCCESS/FAILURE/null
  updatingRelationData: false,
  updatingNerData: false,

  nerSearch: new Set(),
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

  UPLOADED_SENTIMENT_DATA: 'UPLOADED_SENTIMENT_DATA',
  UPLOADED_TOPIC_DATA: 'UPLOADED_TOPIC_DATA',
  UPLOADED_RELATION_DATA: 'UPLOADED_RELATION_DATA',
  UPLOADED_NER_DATA: 'UPLOADED_NER_DATA',
  UPLOADED_CLASSIFIER_DATA: 'UPLOADED_CLASSIFIER_DATA',
  UPLOADED_SUMMARY_DATA: 'UPLOADED_SUMMARY_DATA',
  UPLOADED_KEY_DATA: 'UPLOADED_KEY_DATA',
  UPLOADED_WORD_CLOUD: 'UPLOADED_WORD_CLOUD',

  SEARCH_NER: 'SEARCH_NER',
};

// Reducers
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.RESET_STATE:
      return {...initialState}
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
      return {
        ...state,
        relationData: action.payload,
        updatingRelationData: false,
      };
    case types.UPDATED_NETWORK_DATA:
      return {
        ...state,
        networkData: action.payload,
      };
    case types.UPDATED_NER_DATA:
      return {
        ...state,
        nerData: action.payload,
        updatingNerData: false,
      };
    case types.SEARCH_NER:
      return {
        ...state,
        nerSearch: action.payload,
      };

    case types.UPLOADING_DATA:
      return {
        ...state,
        uploadingData: true,
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
    case types.UPLOADED_SENTIMENT_DATA:
      return {
        ...state,
        sentimentData: action.payload,
      };
    case types.UPLOADED_TOPIC_DATA:
      return {
        ...state,
        topicData: action.payload,
      };
    case types.UPLOADED_RELATION_DATA:
      return {
        ...state,
        relationData: action.payload,
      };
    case types.UPLOADED_NER_DATA:
      return {
        ...state,
        nerData: action.payload,
      };
    case types.UPLOADED_CLASSIFIER_DATA:
      return {
        ...state,
        classifierData: action.payload,
      };
    case types.UPLOADED_SUMMARY_DATA:
      return {
        ...state,
        summaryData: action.payload,
      };
    case types.UPLOADED_KEY_DATA:
      return {
        ...state,
        keyData: action.payload,
      };

    case types.UPLOADED_WORD_CLOUD:
      return {
        ...state,
        wordCloud: action.payload
      }
    default:
      return state;
  }
}

// Action Creators
export function resetState(payload) {
return {type: types.RESET_STATE,
payload};
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

// Selectors
export function getNerData(store) {
  return store.editstate.nerData;
}

export function getRelationData(store) {
  return store.editstate.relationData;
}

export function getNetworkData(store) {
  return store.editstate.networkData;
}

export function getSentimentData(store) {
  return store.editstate.sentimentData;
}

export function getTopicData(store) {
  return store.editstate.topicData;
}

export function getClassifierData(store) {
  return store.editstate.classifierData;
}

export function getSummaryData(store) {
  return store.editstate.summaryData;
}

export function getKeyData(store) {
  return store.editstate.keyData;
}

export function getWordCloud(store) {
  return store.editstate.wordCloud
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
