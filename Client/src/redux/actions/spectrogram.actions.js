import * as types from "../constants/spectrogram.constants";

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

const clearSelection = (start, end) => (dispatch) => {
  dispatch({ type: types.CLEAR_SELECTION, payload: null });
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
  console.log("w :>> ", w);
  dispatch({ type: types.UPDATE_AUDIO_CURRENT_TIME, payload: w });
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
};
