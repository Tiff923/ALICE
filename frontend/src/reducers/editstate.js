// import rdat from '../components/RelationExtraction/relationdata.json';
// import ndat from '../components/NerTable/nerdata.json';
// import ntwkdat from '../components/NetworkGraph/networkdata.json';
// import sentimentdat from '../components/SentimentGraph/sentimentdata.json';
// import topicdat from '../components/TopicModelling/topicdata.json';

export const initialState = {
  relationData: null,
  nerData: null,
  networkData: null,
  sentimentData: null,
  topicData: null,
  classifierData: null,
  summaryData: null,
  keyData: null,

  uploadingData: false,
  uploadStatus: null, // SUCCESS/FAILURE/null
  // uploadingClassifierData: false,
  // uploadingRelationData: false,
  // uploadingNerData: false,
  // uploadingSummaryData: false,
  // uploadingSentimentData: false,
  // uploadingTopicData: false,

  updatingRelationData: false,
  updatingNerData: false,

  nerSearch: new Set(),
};

// Actions
export const types = {
  UPDATING_RELATION_DATA: "UPDATING_RELATION_DATA",
  UPDATING_NER_DATA: "UPDATING_NER_DATA",
  UPDATED_RELATION_DATA: "UPDATED_RELATION_DATA",
  UPDATED_NER_DATA: "UPDATED_NER_DATA",
  UPDATED_NETWORK_DATA: "UPDATED_NETWORK_DATA",

  UPLOADING_DATA: "UPLOADING_DATA",
  UPLOAD_SUCCESS: "UPLOAD_SUCCESS",
  UPLOAD_FAILURE: "UPLOAD_FAILURE",

  // UPLOADING_SENTIMENT_DATA: "UPLOADING_SENTIMENT_DATA",
  // UPLOADING_TOPIC_DATA: "UPLOADING_TOPIC_DATA",
  // UPLOADING_RELATION_DATA: "UPLOADING_RELATION_DATA",
  // UPLOADING_NER_DATA: "UPLOADING_NER_DATA",
  // UPLOADING_CLASSIFIER_DATA: "UPLOADING_CLASSIFIER_DATA",
  // UPLOADING_SUMMARY_DATA: "UPLOADING_SUMMARY_DATA",

  UPLOADED_SENTIMENT_DATA: "UPLOADED_SENTIMENT_DATA",
  UPLOADED_TOPIC_DATA: "UPLOADED_TOPIC_DATA",
  UPLOADED_RELATION_DATA: "UPLOADED_RELATION_DATA",
  UPLOADED_NER_DATA: "UPLOADED_NER_DATA",
  UPLOADED_CLASSIFIER_DATA: "UPLOADED_CLASSIFIER_DATA",
  UPLOADED_SUMMARY_DATA: "UPLOADED_SUMMARY_DATA",
  UPLOADED_KEY_DATA: "UPLOADED_KEY_DATA",

  SEARCH_NER: "SEARCH_NER",
};

// Reducers
export default function reducer(state = initialState, action) {
  switch (action.type) {
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
        // uploadingSentimentData: true,
        // uploadingTopicData: true,
        // uploadingRelationData: true,
        // uploadingNerData: true,
        // uploadingClassifierData: true,
        // uploadingSummaryData: true,
      };
    case types.UPLOAD_SUCCESS:
      return {
        ...state,
        uploadingData: false,
        uploadStatus: "SUCCESS",
      };
    case types.UPLOAD_FAILURE:
      return {
        ...state,
        uploadingData: false,
        uploadStatus: "FAILURE",
      };

    // case types.UPLOADING_SENTIMENT_DATA:
    //   return {
    //     ...state,
    //     uploadingSentimentData: true,
    //   };
    // case types.UPLOADING_TOPIC_DATA:
    //   return {
    //     ...state,
    //     uploadingTopicData: true,
    //   };
    // case types.UPLOADING_RELATION_DATA:
    //   return {
    //     ...state,
    //     uploadingRelationData: true,
    //   };
    // case types.UPLOADING_NER_DATA:
    //   return {
    //     ...state,
    //     uploadingNerData: true,
    //   };
    // case types.UPLOADING_CLASSIFIER_DATA:
    //   return {
    //     ...state,
    //     uploadingClassifierData: true,
    //   };
    // case types.UPLOADING_SUMMARY_DATA:
    //   return {
    //     ...state,
    //     uploadingSummaryData: true,
    //   };
    case types.UPLOADED_SENTIMENT_DATA:
      return {
        ...state,
        sentimentData: action.payload,
        // uploadingSentimentData: false,
      };
    case types.UPLOADED_TOPIC_DATA:
      return {
        ...state,
        topicData: action.payload,
        // uploadingTopicData: false,
      };
    case types.UPLOADED_RELATION_DATA:
      return {
        ...state,
        relationData: action.payload,
        // uploadingRelationData: false,
      };
    case types.UPLOADED_NER_DATA:
      return {
        ...state,
        nerData: action.payload,
        // uploadingNerData: false,
      };
    case types.UPLOADED_CLASSIFIER_DATA:
      return {
        ...state,
        classifierData: action.payload,
        // uploadingClassifierData: false,
      };
    case types.UPLOADED_SUMMARY_DATA:
      return {
        ...state,
        summaryData: action.payload,
        // uploadingSummaryData: false,
      };
    case types.UPLOADED_KEY_DATA:
      return {
        ...state,
        keyData: action.payload,
      };
    default:
      return state;
  }
}

// Action Creators
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

export function getNerSearch(store) {
  return store.editstate.nerSearch;
}

export function getUploadStatus(store) {
  return store.editstate.uploadStatus;
}

export function isUploadingData(store) {
  return store.editstate.isUploadingData;
}
