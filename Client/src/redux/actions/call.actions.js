import * as types from "../constants/call.constants";
import api from "../api";
import { alertActions } from "./alert.actions";
// import { alertActions } from "./alert.actions";

// Get single Calls from RawAudio
const getSingleCall = (callId) => async (dispatch) => {
  dispatch({ type: types.GET_SINGLE_CALL_REQUEST, payload: null });
  try {
    const res = await api.get(`calls/${callId}`);
    // Get the inital state from reducer call.reducers.
    dispatch({
      type: types.GET_SINGLE_CALL_REQUEST_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_SINGLE_CALL_REQUEST_FAILURE,
      payload: error.data,
    });
    // dispatch(alertActions.setAlert("Not calls found", "danger"));
  }
};

const clearCallsReducer = () => (dispatch) => {
  dispatch({ type: types.CLEAR_CALLS, payload: null });
};

// Create new comment to Call.
const addCommentSingleCall = (comment, callId) => async (dispatch) => {
  dispatch({ type: types.CREATE_COMMENT_SINGLE_CALL_REQUEST, payload: null });
  try {
    const res = await api.put(`calls/addcomment/${callId}`, {
      comment,
      callId,
    });
    dispatch({
      type: types.CREATE_COMMENT_SINGLE_CALL_SUCCESS,
      payload: res.data.data,
    });
    dispatch(alertActions.setAlert("New comment has been Added!", "success"));
  } catch (error) {
    dispatch({
      type: types.CREATE_COMMENT_SINGLE_CALL_FAILURE,
      payload: error,
    });
  }
};

const deleteCommentCall = (callId) => async (dispatch) => {
  dispatch({ type: types.DELETE_COMMENT_CALL_REQUEST, payload: null });
  try {
    const res = await api.put(`calls/deletecomment/${callId}`);
    dispatch({
      type: types.DELETE_COMMENT_CALL_SUCCESS,
      payload: res.data,
    });

    dispatch(alertActions.setAlert("Comment has been DELETED!", "success"));
  } catch (error) {
    dispatch({ type: types.DELETE_COMMENT_CALL_FAILURE, payload: error });
  }
};

export const callActions = {
  getSingleCall,
  clearCallsReducer,
  addCommentSingleCall,
  deleteCommentCall,
};
