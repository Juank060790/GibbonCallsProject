import * as types from "../constants/audio.constants";
import api from "../api";
import { alertActions } from "./alert.actions";

// Get a list of Raw Audios
const audiosRequest = (
  // recieve the request with these specific values (limit, sortBy, order, startDoc).
  limit,
  sortBy,
  order,
  page
) => async (dispatch) => {
  dispatch({ type: types.AUDIO_REQUEST, payload: null });
  try {
    const res = await api.get(
      `audio/audiolist/filter/${limit}/${sortBy}/${order}/${page}`
    );

    if (res.data.length > 0) {
      // Dispatch the data to the reducer auido.reducer if success.
      dispatch({
        type: types.AUDIO_REQUEST_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.AUDIO_REQUEST_NOMORE_DATA,
        payload: "No more data",
      });
    }
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

// Helps to clear audio reducer when close modal.
const clearSelectedAudioReducer = () => (dispatch) => {
  dispatch({ type: types.CLEAR_SELECTED_AUDIO, payload: null });
};

// Create new comment to audio.
const addCommentRawAudio = (comment, audioId) => async (dispatch) => {
  dispatch({ type: types.CREATE_COMMENT_RAW_AUDIO_REQUEST, payload: null });
  try {
    const res = await api.put(`audio/audiolist/addcomment/${audioId}`, {
      comment,
      audioId,
    });

    dispatch({
      type: types.CREATE_COMMENT_RAW_AUDIO_SUCCESS,
      payload: res.data.data,
    });
    dispatch(alertActions.setAlert("New comment has been Added!", "success"));
  } catch (error) {
    dispatch({ type: types.CREATE_COMMENT_RAW_AUDIO_FAILURE, payload: error });
  }
};

const deleteCommentAudio = (audioId) => async (dispatch) => {
  dispatch({ type: types.DELETE_COMMENT_RAW_AUDIO_REQUEST, payload: null });
  try {
    const res = await api.put(`audio/audiolist/deletecomment/${audioId}`);

    dispatch({
      type: types.DELETE_COMMENT_RAW_AUDIO_SUCCESS,
      payload: res.data,
    });
    dispatch(alertActions.setAlert("Comment has been DELETED!", "success"));
  } catch (error) {
    dispatch({ type: types.DELETE_COMMENT_RAW_AUDIO_FAILURE, payload: error });
  }
};

const deleteAudio = (audioId) => async (dispatch) => {
  dispatch({ type: types.DELETE_COMMENT_RAW_AUDIO_REQUEST, payload: null });
  try {
    const res = await api.put(`audio/audiolist/deleteaudio/${audioId}`);

    dispatch({
      type: types.DELETE_COMMENT_RAW_AUDIO_SUCCESS,
      payload: res.data,
    });
    dispatch(alertActions.setAlert("Audio has been DELETED!", "success"));
  } catch (error) {
    dispatch({ type: types.DELETE_COMMENT_RAW_AUDIO_FAILURE, payload: error });
  }
};

export const audioActions = {
  audiosRequest,
  getSingleAudio,
  clearSelectedAudioReducer,
  addCommentRawAudio,
  deleteCommentAudio,
  deleteAudio,
};
