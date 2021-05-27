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
    case types.SAVE_REGION_CALL_REQUEST:
    case types.GET_SINGLE_CALL_REQUEST:
      return { ...state, loading: true };
    case types.SAVE_REGION_CALL_SUCCESS:
      return { ...state, loading: false };
    case types.GET_SINGLE_CALL_SUCCESS:
      const callArray = state.call;
      // console.log(`state`, callArray);
      const isCallInTheArray = (el) => el.callId === payload.callId;
      const findIndexOfCall = callArray.findIndex(isCallInTheArray);

      if (callArray[findIndexOfCall]?.callId === payload.callId) {
        callArray[findIndexOfCall] = payload;
        console.log(`Call is equal to payload`, callArray);
      } else {
        callArray.push(payload);
        console.log("Call is not equal", callArray);
      }

      return {
        ...state,
        call: callArray,
      };

    case types.UPDATE_IS_CORRECT_CALL_REQUEST:
    case types.DELETE_COMMENT_CALL_REQUEST:
      return { ...state, loading: true };

    case types.DELETE_COMMENT_CALL_SUCCESS:
      return { ...state, payload };

    case types.GET_SINGLE_CALL_FAILURE:
      return { ...state, loading: false };
    case types.DELETE_COMMENT_CALL_FAILURE:
    case types.SAVE_REGION_CALL_FAILURE:
    case types.UPDATE_IS_CORRECT_CALL_SUCCESS:
    case types.UPDATE_IS_CORRECT_CALL_FAILURE:
      return { ...state, loading: false };

    case types.CREATE_COMMENT_SINGLE_CALL_SUCCESS:
    case types.DELETE_CALL_SUCCESS:
      return {
        ...state,
        call: [...state.call],
        payload,
        loading: false,
      };

    case types.CLEAR_CALLS:
      return { ...state, call: [] };

    default:
      return state;
  }
};

export default callReducer;
