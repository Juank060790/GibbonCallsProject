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
    isCorrect: true,
  },
  playtrackerPos: 0,
  play: false,
  canvasWidth: 0,
  audioCurrentTime: 0,
  loading: false,
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
          isCorrect: true,
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
    case types.CLEAR_SINGLE_SELECTION:
      // remove item in array
      const selectionsArray = state.selections.filter(function (item) {
        return item.id !== payload;
      });
      return {
        ...state,
        selections: selectionsArray,
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

    case types.SAVE_REGION_CALL_REQUEST:
    case types.GET_SINGLE_CALL_REQUEST:
      return { ...state, loading: true };
    case types.SAVE_REGION_CALL_SUCCESS:
      return { ...state, loading: false };
    case types.GET_SINGLE_CALL_SUCCESS:
      const callArray = state.selections;
      const isCallInTheArray = (el) => el.id === payload.id;
      const findIndexOfCall = callArray.findIndex(isCallInTheArray);
      if (callArray[findIndexOfCall]?.id === payload.id) {
        callArray[findIndexOfCall] = payload;
      } else {
        callArray.push(payload);
      }
      return {
        ...state,
        selections: callArray,
      };

    case types.UPDATE_IS_CORRECT_CALL_REQUEST:
    case types.UPDATE_SELECTION_TIME_REQUEST:
    case types.DELETE_COMMENT_CALL_REQUEST:
      return { ...state, loading: true };

    case types.DELETE_COMMENT_CALL_SUCCESS:
      return { ...state, payload };

    case types.GET_SINGLE_CALL_FAILURE:
      return { ...state, loading: false };

    case types.UPDATE_IS_CORRECT_CALL_SUCCESS:
    case types.UPDATE_SELECTION_TIME_SUCCESS:
      return { ...state, loading: false };

    case types.SAVE_REGION_CALL_FAILURE:
    case types.DELETE_COMMENT_CALL_FAILURE:
    case types.UPDATE_IS_CORRECT_CALL_FAILURE:
    case types.UPDATE_SELECTION_TIME_FAILURE:
      return { ...state, loading: false };

    case types.CREATE_COMMENT_SINGLE_CALL_SUCCESS:
    case types.DELETE_CALL_SUCCESS:
      return {
        ...state,
        selections: [...state.selections],
        payload,
        loading: false,
      };

    case types.CLEAR_CALLS:
      return { ...state, selections: [] };

    default:
      return state;
  }
};

export default spectrogramReducer;
