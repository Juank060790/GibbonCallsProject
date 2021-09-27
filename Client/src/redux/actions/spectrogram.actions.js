import * as types from "../constants/spectrogram.constants";
import { db } from "../../Firebase/firebase";
// import { toast } from "react-toastify";

const playAudio = () => (dispatch) => {
  dispatch({ type: types.PLAY, payload: null });
};

const stopAudio = () => (dispatch) => {
  dispatch({ type: types.STOP, payload: null });
};

const createSelection = (start, end) => (dispatch) => {
  dispatch({ type: types.MOUSE_DOWN, payload: null });
  dispatch({ type: types.UPDATE_SELECTION, payload: { start, end } });
};

const clearSelection = () => (dispatch) => {
  dispatch({ type: types.CLEAR_SELECTION, payload: null });
};
const clearSingleSelection = (callId) => (dispatch) => {
  dispatch({ type: types.CLEAR_SINGLE_SELECTION, payload: callId });
};

const handleMouseUp = (selection) => (dispatch) => {
  dispatch({ type: types.MOUSE_UP, payload: null });
  if (selection.start < selection.end) {
    dispatch({ type: types.SAVE_SELECTION, payload: selection });
  }
  dispatch({ type: types.NEW_SELECTION, payload: null });
};

const handleMouseMove = (start, end) => (dispatch) => {
  dispatch({ type: types.UPDATE_SELECTION, payload: { start, end } });
};

const highlightSelection = (id) => (dispatch) => {
  dispatch({ type: types.MOUSE_DOWN, payload: null });
  dispatch({ type: types.HIGHLIGHT_SELECTION, payload: id });
};

const updateHighlightedSelection = (start, end) => (dispatch) => {
  dispatch({
    type: types.UPDATE_HIGHLIGHTED_SELECTION,
    payload: { start, end },
  });
};

const updatePlayTracker = (v) => (dispatch) => {
  dispatch({ type: types.UPDATE_PLAYTRACKER_POS, payload: v });
};

const updateCanvasWidth = (w) => (dispatch) => {
  dispatch({ type: types.UPDATE_CANVAS_WIDTH, payload: w });
};

const updateAudioTime = (w) => (dispatch) => {
  dispatch({ type: types.UPDATE_AUDIO_CURRENT_TIME, payload: w });
};
const showImage = (call) => (dispatch) => {
  dispatch({ type: types.SHOW_IMAGE, payload: call });
};

const updateSelectionTime = (start, end, callId) => (dispatch) => {
  dispatch({ type: types.UPDATE_SELECTION_TIME_REQUEST, payload: null });

  db.collection("calls")
    .doc(`${callId}`)
    .update({
      start: start,
      end: end,
    })
    .then(() => {
      dispatch({
        type: types.UPDATE_SELECTION_TIME_SUCCESS,
        payload: "Call update it successfully ",
      });
      // toast.success("Call has been updated it", "success");
    })
    .catch(() => {
      dispatch({
        type: types.UPDATE_SELECTION_TIME_FAILURE,
        payload: `Error updating call:${callId}`,
      });
    });
};

export const spectrogramActions = {
  playAudio,
  stopAudio,
  createSelection,
  clearSelection,
  handleMouseUp,
  handleMouseMove,
  highlightSelection,
  updatePlayTracker,
  updateHighlightedSelection,
  updateCanvasWidth,
  updateAudioTime,
  clearSingleSelection,
  updateSelectionTime,
  showImage,
};
