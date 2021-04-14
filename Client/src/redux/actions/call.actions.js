import * as types from "../constants/call.constants";
import api from "../api";
import { alertActions } from "./alert.actions";

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
    dispatch(alertActions.setAlert("Not calls found", "danger"));
  }
};

const clearCallsReducer = () => (dispatch) => {
  dispatch({ type: types.CLEAR_CALLS, payload: null });
};

export const callActions = {
  getSingleCall,
  clearCallsReducer,
};
