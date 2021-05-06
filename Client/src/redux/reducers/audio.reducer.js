import * as types from "../constants/audio.constants";

const initialState = {
  audio: [],
  loading: false,
  selectedAudio: null,
  lastPage: false,
};

const audioReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.AUDIO_REQUEST:
    case types.GET_SINGLE_AUDIO_REQUEST:
    case types.DELETE_COMMENT_RAW_AUDIO_REQUEST:
    case types.DELETE_RAW_AUDIO_REQUEST:
      return { ...state, loading: true };

    case types.AUDIO_REQUEST_SUCCESS:
      return {
        ...state,
        audio: payload,
        loading: false,
        lastPage: false,
      };

    case types.DELETE_COMMENT_RAW_AUDIO_SUCCESS:
    case types.DELETE_RAW_AUDIO_SUCCESS:
      return { ...state, loading: false };

    case types.GET_SINGLE_AUDIO_REQUEST_SUCCESS:
      return {
        ...state,
        selectedAudio: payload,
        loading: false,
      };

    case types.AUDIO_REQUEST_FAILURE:
    case types.DELETE_COMMENT_RAW_AUDIO_FAILURE:
    case types.DELETE_RAW_AUDIO_FAILURE:
    case types.GET_SINGLE_AUDIO_REQUEST_FAILURE:
      return { ...state, loading: false };
    case types.CLEAR_SELECTED_AUDIO:
      return { ...state, selectedAudio: undefined };
    case types.AUDIO_REQUEST_NOMORE_DATA:
      return { ...state, lastPage: true, loading: false };
    default:
      return state;
  }
};

export default audioReducer;
