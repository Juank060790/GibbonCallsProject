import * as types from "../constants/spectrogram.constants";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  mousedown: false,
  selections: [],
  newSelection: {
    id: uuidv4(),
    start: 0,
    end: 0,
    highlighted: false,
    color: { r: 255, g: 0, b: 0 },
    accuracy: "-",
    createdBy: "Manual",
    label: "Female",
  },
  playtrackerPos: 0,
  play: false,
  canvasWidth: 0,
  audioCurrentTime: 0,
};

const spectrogramReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.MOUSE_DOWN:
      return { ...state, mousedown: true };
    case types.MOUSE_UP:
      return { ...state, mousedown: false };
    case types.SAVE_SELECTION:
      let selections = [...state.selections, payload];
      selections = selections.sort((a, b) => a.start - b.start);
      return { ...state, selections: selections };
    case types.NEW_SELECTION:
      return {
        ...state,
        newSelection: {
          id: uuidv4(),
          start: 0,
          end: 0,
          highlighted: false,
          color: { r: 255, g: 0, b: 0 },
          accuracy: "-",
          createdBy: "Manual",
          label: "Female",
        },
      };
    case types.UPDATE_SELECTION:
      return {
        ...state,
        newSelection: { ...state.newSelection, ...payload },
      };
    case types.CLEAR_SELECTION:
      return {
        ...state,
        selections: [],
      };
    case types.HIGHLIGHT_SELECTION:
      return {
        ...state,
        selections: state.selections.map((sel) => {
          if (sel.id === payload) {
            sel.highlighted = true;
          } else {
            sel.highlighted = false;
          }
          return sel;
        }),
      };
    case types.UPDATE_HIGHLIGHTED_SELECTION:
      return {
        ...state,
        selections: state.selections.map((sel) => {
          if (sel.highlighted) {
            sel.start = payload.start;
            sel.end = payload.end;
          }
          return sel;
        }),
      };
    case types.UPDATE_PLAYTRACKER_POS:
      return { ...state, playtrackerPos: payload };
    case types.UPDATE_AUDIO_CURRENT_TIME:
      return { ...state, audioCurrentTime: payload };
    case types.PLAY:
      return { ...state, play: true };
    case types.STOP:
      return { ...state, play: false };

    case types.UPDATE_CANVAS_WIDTH:
      return { ...state, canvasWidth: payload };

    default:
      return state;
  }
};

export default spectrogramReducer;
