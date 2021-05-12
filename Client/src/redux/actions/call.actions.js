import * as types from "../constants/call.constants";
import api from "../api";
import { alertActions } from "./alert.actions";
import { db } from "../../Firebase/firebase";
// import { alertActions } from "./alert.actions";

// const getSingleCall = (callId) => (dispatch) => {
//   dispatch({ type: types.GET_SINGLE_CALL_REQUEST, payload: null });
//   let singleCall = {};
//   db.collection("calls")
//     .doc(callId)
//     .onSnapshot((docSnapshot) => {
//       console.log("singleCallsize", docSnapshot);
//       singleCall = {};
//       if (docSnapshot.exists) {
//         singleCall = docSnapshot.data();
//         console.log(`singleCall`, singleCall);
//         dispatch({
//           type: types.GET_SINGLE_CALL_SUCCESS,
//           payload: singleCall,
//         });
//       } else {
//         console.log(`NO cAAAAAALLLS`);
//       }
//     });
// };

const getSingleCall = (callId) => (dispatch) => {
  let singleCall = {};
  dispatch({ type: types.GET_SINGLE_CALL_REQUEST, payload: null });

  db.doc(`calls/${callId}`).onSnapshot((doc) => {
    if (doc.exists) {
      singleCall = doc.data();
      dispatch({
        type: types.GET_SINGLE_CALL_SUCCESS,
        payload: singleCall,
      });
      console.log(`singleCall`, singleCall);
    } else {
      dispatch({
        type: types.GET_SINGLE_CALL_FAILURE,
        payload: "Audio not found",
      });
    }
  });
};

const clearCallsReducer = () => (dispatch) => {
  dispatch({ type: types.CLEAR_CALLS, payload: null });
};

// Create new comment to Call.
const addCommentSingleCall = (comment, callId) => async (dispatch) => {
  dispatch({ type: types.CREATE_COMMENT_SINGLE_CALL_REQUEST, payload: null });
  db.collection("calls")
    .doc(`${callId}`)
    .update({
      comment: comment,
    })
    .then(() => {
      dispatch({
        type: types.CREATE_COMMENT_SINGLE_CALL_SUCCESS,
        payload: "Comment was created successfully ",
      });
    })
    .catch((err) => {
      dispatch({
        type: types.CREATE_COMMENT_SINGLE_CALL_FAILURE,
        payload: err,
      });
    });
};

const deleteCommentCall = (callId) => async (dispatch) => {
  dispatch({ type: types.DELETE_COMMENT_CALL_REQUEST, payload: null });
  db.collection("calls")
    .doc(`${callId}`)
    .update({
      comment: "",
    })
    .then(() => {
      dispatch({
        type: types.DELETE_COMMENT_CALL_SUCCESS,
        payload: "Comment has been DELETED!",
      });
    })
    .catch(() => {
      dispatch({
        type: types.DELETE_COMMENT_CALL_FAILURE,
        payload: `Error removing comment from document:${callId} `,
      });
    });
};

// ------------ Old CODE --------------//

// Get single Calls from RawAudio

// const getSingleCall = (callId) => async (dispatch) => {
//   dispatch({ type: types.GET_SINGLE_CALL_REQUEST, payload: null });
//   try {
//     const res = await api.get(`calls/${callId}`);
//     // Get the inital state from reducer call.reducers.
//     dispatch({
//       type: types.GET_SINGLE_CALL_REQUEST_SUCCESS,
//       payload: res.data,
//     });
//   } catch (error) {
//     dispatch({
//       type: types.GET_SINGLE_CALL_REQUEST_FAILURE,
//       payload: error.data,
//     });
//     // dispatch(alertActions.setAlert("Not calls found", "danger"));
//   }
// };

// // Create new comment to Call.
// const addCommentSingleCall = (comment, callId) => async (dispatch) => {
//   dispatch({ type: types.CREATE_COMMENT_SINGLE_CALL_REQUEST, payload: null });
//   try {
//     const res = await api.put(`calls/addcomment/${callId}`, {
//       comment,
//       callId,
//     });
//     dispatch({
//       type: types.CREATE_COMMENT_SINGLE_CALL_SUCCESS,
//       payload: res.data.data,
//     });
//     dispatch(alertActions.setAlert("New comment has been Added!", "success"));
//   } catch (error) {
//     dispatch({
//       type: types.CREATE_COMMENT_SINGLE_CALL_FAILURE,
//       payload: error,
//     });
//   }
// };

// const deleteCommentCall = (callId) => async (dispatch) => {
//   dispatch({ type: types.DELETE_COMMENT_CALL_REQUEST, payload: null });
//   try {
//     const res = await api.put(`calls/deletecomment/${callId}`);
//     dispatch({
//       type: types.DELETE_COMMENT_CALL_SUCCESS,
//       payload: res.data,
//     });

//     dispatch(alertActions.setAlert("Comment has been DELETED!", "success"));
//   } catch (error) {
//     dispatch({ type: types.DELETE_COMMENT_CALL_FAILURE, payload: error });
//   }
// };

export const callActions = {
  getSingleCall,
  clearCallsReducer,
  addCommentSingleCall,
  deleteCommentCall,
};
