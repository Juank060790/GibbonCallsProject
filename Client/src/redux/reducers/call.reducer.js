import * as types from "../constants/call.constants";

const initialState = {
  call: [],
  loading: false,
};

const callReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_SINGLE_CALL_REQUEST:
      return { ...state, loading: true };
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
