import * as types from "../constants/call.constants";

// Initial State for all single calls.
const initialState = {
  call: [],
  loading: false,
};
// Every time there is a dispatch action will return the state of the call.

const callReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.CLEAR_CALLS:
      return { ...state, call: [] };
    case types.GET_SINGLE_CALL_REQUEST:
      return { ...state, call: [], loading: true };
    case types.GET_SINGLE_CALL_SUCCESS:
      return {
        ...state,
        call: [...state.call, payload],
        loading: false,
      };
    case types.GET_SINGLE_CALL_FAILURE:
      return { ...state, loading: false };

    case types.DELETE_COMMENT_CALL_REQUEST:
      return { ...state, loading: true };
    case types.DELETE_COMMENT_CALL_SUCCESS:
      return { ...state, payload };
    case types.DELETE_COMMENT_CALL_FAILURE:
      return { ...state, loading: false };

    case types.CREATE_COMMENT_SINGLE_CALL_SUCCESS:
    case types.DELETE_CALL_SUCCESS:
      return {
        ...state,
        call: [...state.call],
        payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default callReducer;
