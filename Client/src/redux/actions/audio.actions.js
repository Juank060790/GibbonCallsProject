import * as types from "../constants/audio.constants";
import api from "../api";
// import { alertActions } from "./alert.actions";

const audiosRequest = (
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
    dispatch({
      type: types.AUDIO_REQUEST_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: types.AUDIO_REQUEST_FAILURE, payload: error });
  }
};

// GEt Single Audio

const getSingleAudio = (audioId) => async (dispatch) => {
  dispatch({ type: types.GET_SINGLE_AUDIO_REQUEST, payload: null });
  try {
    const res = await api.get(`/audio/audiolist/${audioId}`);
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
