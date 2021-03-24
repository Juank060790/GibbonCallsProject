import * as types from "../constants/audio.constants";

const initialState = {
  audio: [],
  totalResults: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  // selectedAudio: null,
};

const audioReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.AUDIO_REQUEST:
      return { ...state, loading: true };

    case types.AUDIO_REQUEST_SUCCESS:
      return {
        ...state,
        audio: payload,
        loading: false,
        totalPageNum: payload.totalPages,
      };

    case types.AUDIO_REQUEST_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default audioReducer;
