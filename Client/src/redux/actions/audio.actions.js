import * as types from "../constants/audio.constants";
import api from "../api";
// import { alertActions } from "./alert.actions";

// Get a list of Raw Audios
const audiosRequest = (
  // recieve the request with these specific values (limit, sortBy, order, startDoc).
  limit = 5,
  sortBy = "",
  order = "",
  startDoc = null
) => async (dispatch) => {
  dispatch({ type: types.AUDIO_REQUEST, payload: null });
  try {
    const res = await api.get(
      `audio/audiolist/filter/${limit}/${sortBy}/${order}/${startDoc}`
    );
    // Dispatch the data to the reducer auido.reducer if success.
    dispatch({
      type: types.AUDIO_REQUEST_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: types.AUDIO_REQUEST_FAILURE, payload: error });
  }
};

// GEt Single RawAudio

const getSingleAudio = (audioId) => async (dispatch) => {
  // recieve the request.
  dispatch({ type: types.GET_SINGLE_AUDIO_REQUEST, payload: null });
  try {
    const res = await api.get(`/audio/audiolist/${audioId}`);
    // Dispatch the data to audio.reducer.
    dispatch({
      type: types.GET_SINGLE_AUDIO_REQUEST_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: types.GET_SINGLE_AUDIO_REQUEST_FAILURE, payload: error });
  }
};

export const audioActions = {
  audiosRequest,
  getSingleAudio,
};
