import rdat from '../components/RelationExtraction/relationdata.json';
import ndat from '../components/NerTable/nerdata.json';
import ntwkdat from '../components/NetworkGraph/networkdata.json';
import sentimentdat from '../components/SentimentGraph/sentimentdata.json';
import topicdat from '../components/TopicModelling/topicdata.json';

export const initialState = {
  relationData: rdat,
  nerData: ndat,
  networkData: ntwkdat,
  sentimentData: sentimentdat,
  topicData: topicdat,
  updatingRelationData: false,
  updatingNerData: false,
  updatingSentimentData: false,
  updatingTopicData: false,
  nerSearch: new Set(),
};

// Actions
export const types = {
  UPDATING_RELATION_DATA: 'UPDATING_RELATION_DATA',
  UPDATING_NER_DATA: 'UPDATING_NER_DATA',
  UPDATING_NETWORK_DATA: 'UPDATING_NETWORK_DATA',
  UPDATING_SENTIMENT_DATA: 'UPDATING_SENTIMENT_DATA',
  UPDATING_TOPIC_DATA: 'UPDATING_TOPIC_DATA',
  UPDATED_RELATION_DATA: 'UPDATED_RELATION_DATA',
  UPDATED_NER_DATA: 'UPDATED_NER_DATA',
  UPDATED_NETWORK_DATA: 'UPDATED_NETWORK_DATA',
  UPDATED_SENTIMENT_DATA: 'UPDATED_SENTIMENT_DATA',
  UPDATED_TOPIC_DATA: 'UPDATED_TOPIC_DATA',
  SEARCH_NER: 'SEARCH_NER',
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
    case types.UPDATING_SENTIMENT_DATA:
      return {
        ...state,
        updatingSentimentData: true,
      };
    case types.UPDATING_TOPIC_DATA:
      return {
        ...state,
        updatingTopicData: true,
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
    case types.UPDATED_SENTIMENT_DATA:
      return {
        ...state,
        sentimentData: action.payload,
        updatingSentimentData: false,
      };
    case types.UPDATED_TOPIC_DATA:
      return {
        ...state,
        topicData: action.payload,
        updatingTopicData: false,
      };
    case types.SEARCH_NER:
      return {
        ...state,
        nerSearch: action.payload,
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

export function getNerSearch(store) {
  return store.editstate.nerSearch;
}

// export function isUpdatingNer(store) {
//   return store.editstate.updatingNerData;
// }

// export function isUpdatingRelation(store) {
//   return store.editstate.updatingRelationData;
// }
