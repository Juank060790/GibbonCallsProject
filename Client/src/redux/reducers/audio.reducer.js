import * as types from "../constants/audio.constants";

const initialState = {
  loading: false,
  loadingAudio: false,
  selectedAudio: null,
  audio: [],
  lastDoc: null,
  firstDoc: null,
  callsList: [],
};

const audioReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_SINGLE_AUDIO_REQUEST:
    case types.GET_IMAGE_FROM_FIREBASE_REQUEST:
    case types.CREATE_COMMENT_RAW_AUDIO_REQUEST:
    case types.DELETE_COMMENT_RAW_AUDIO_REQUEST:
    case types.AUDIO_SEARCH_REQUEST:
    case types.DELETE_RAW_AUDIO_REQUEST:
      return { ...state, loading: true };
    case types.GET_AUDIO_FROM_FIREBASE_REQUEST:
      return { ...state, loading: true, loadingAudio: true };
    case types.AUDIO_SEARCHBYDATE_REQUEST:
    case types.AUDIO_REQUEST:
      return { ...state, loading: true, audio: [] };

    case types.AUDIO_REQUEST_SUCCESS:
      return {
        ...state,
        audio: payload.audioList,
        lastDoc: payload.lastDoc,
        firstDoc: payload.firstDoc,
        loading: false,
      };
    case types.GET_IMAGE_FROM_FIREBASE_SUCCESS:
      state.selectedAudio.imageUrl = payload;
      return {
        ...state,
        loading: false,
      };
    case types.GET_AUDIO_FROM_FIREBASE_SUCCESS:
      // state.selectedAudio.audio = payload;
      return {
        ...state,
        selectedAudio: { ...state.selectedAudio, audio: payload },
        loadingAudio: false,
      };

    case types.AUDIO_SEARCH_SUCCESS:
    case types.AUDIO_SEARCHBYDATE_SUCCESS:
      return { ...state, audio: payload };

    case types.DELETE_COMMENT_RAW_AUDIO_SUCCESS:
    case types.DELETE_RAW_AUDIO_SUCCESS:
      return { ...state, loading: false };

    case types.GET_SINGLE_AUDIO_REQUEST_SUCCESS:
      return {
        ...state,
        selectedAudio: payload,
        callsList: payload.gibbonCallsList,
      };

    case types.AUDIO_REQUEST_FAILURE:
    case types.DELETE_COMMENT_RAW_AUDIO_FAILURE:
    case types.DELETE_RAW_AUDIO_FAILURE:
    case types.AUDIO_SEARCH_FAILURE:
    case types.AUDIO_SEARCHBYDATE_FAILURE:
    case types.GET_SINGLE_AUDIO_REQUEST_FAILURE:
    case types.GET_IMAGE_FROM_FIREBASE_FAILURE:
    case types.GET_AUDIO_FROM_FIREBASE_FAILURE:
      return { ...state, loadingAudio: false };

    case types.CLEAR_SELECTED_AUDIO:
      return { ...state, selectedAudio: undefined, callsList: [] };

    case types.AUDIO_REQUEST_NOMORE_DATA:
      return { ...state, lastPage: true, loading: false };

    default:
      return state;
  }
};

export default audioReducer;
