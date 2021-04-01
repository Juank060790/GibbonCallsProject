import * as types from "../constants/audio.constants";

const initialState = {
  audio: [],
  loading: false,
  selectedAudio: null,
  starDoc: null,
};

const audioReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.AUDIO_REQUEST:
    case types.GET_SINGLE_AUDIO_REQUEST:
      return { ...state, loading: true };

    case types.AUDIO_REQUEST_SUCCESS:
      return {
        ...state,
        audio: payload,
        loading: false,
      };

    case types.GET_SINGLE_AUDIO_REQUEST_SUCCESS:
      return {
        ...state,
        selectedAudio: payload,
        loading: false,
      };

    case types.AUDIO_REQUEST_FAILURE:
    case types.GET_SINGLE_AUDIO_REQUEST_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default audioReducer;
