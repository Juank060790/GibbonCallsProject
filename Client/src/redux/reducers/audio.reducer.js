import * as types from "../constants/audio.constants";

const initialState = {
  loading: false,
  selectedAudio: null,
  audio: [],
  lastDocument: null,
  firstDocument: null,
  callsList: [],
};

const audioReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.AUDIO_REQUEST:
    case types.AUDIO_SEARCH_REQUEST:
    case types.GET_SINGLE_AUDIO_REQUEST:
    case types.DELETE_COMMENT_RAW_AUDIO_REQUEST:
    case types.DELETE_RAW_AUDIO_REQUEST:
      return { ...state, loading: true };

    case types.AUDIO_REQUEST_SUCCESS:
      return {
        ...state,
        audio: payload.filteredaudioList,
        latestDoc: payload.latestDoc,
        firstDocument: payload.firstDocument,
        loading: false,
      };

    case types.AUDIO_SEARCH_SUCCESS:
      return { ...state, audio: payload };

    case types.DELETE_COMMENT_RAW_AUDIO_SUCCESS:
    case types.DELETE_RAW_AUDIO_SUCCESS:
      return { ...state, loading: false };

    case types.GET_SINGLE_AUDIO_REQUEST_SUCCESS:
      return {
        ...state,
        selectedAudio: payload,
        loading: false,
        callsList: payload.gibbonCallsList,
      };

    case types.AUDIO_REQUEST_FAILURE:
    case types.DELETE_COMMENT_RAW_AUDIO_FAILURE:
    case types.DELETE_RAW_AUDIO_FAILURE:
    case types.AUDIO_SEARCH_FAILURE:
    case types.GET_SINGLE_AUDIO_REQUEST_FAILURE:
      return { ...state, loading: false };

    case types.CLEAR_SELECTED_AUDIO:
      return { ...state, selectedAudio: undefined, callsList: [] };

    case types.AUDIO_REQUEST_NOMORE_DATA:
      return { ...state, lastPage: true, loading: false };

    default:
      return state;
  }
};

export default audioReducer;
