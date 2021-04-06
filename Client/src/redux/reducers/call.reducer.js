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
    case types.GET_SINGLE_CALL_REQUEST:
      return { ...state, loading: true };

    // This case will return all the state including the single call.

    case types.GET_SINGLE_CALL_REQUEST_SUCCESS:
      return {
        ...state,
        call: payload,
        loading: false,
      };
    case types.GET_SINGLE_CALL_REQUEST_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default callReducer;
