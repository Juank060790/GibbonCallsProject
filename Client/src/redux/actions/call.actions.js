import * as types from "../constants/call.constants";
import { db } from "../../Firebase/firebase";
import firebase from "firebase/app";

const getSingleCall = (callId) => (dispatch) => {
  dispatch({ type: types.GET_SINGLE_CALL_REQUEST, payload: null });
  db.doc(`calls/${callId}`).onSnapshot((doc) => {
    let singleCall = [];
    if (doc.exists) {
      singleCall = doc.data();
      dispatch({
        type: types.GET_SINGLE_CALL_SUCCESS,
        payload: singleCall,
      });
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
      comment: comment || "",
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

const deleteCall = (callId) => (dispatch) => {
  dispatch({ type: types.DELETE_CALL_REQUEST, payload: null });
  db.collection("calls")
    .doc(`${callId}`)
    .update({
      isDeleted: true,
    })
    .then(() => {
      dispatch({
        type: types.DELETE_CALL_SUCCESS,
        payload: "Audio deleted successfully ",
      });
    })
    .catch((err) => {
      dispatch({
        type: types.DELETE_CALL_FAILURE,
        payload: `Error removing document:${callId}`,
      });
    });
};

const updateIsCallCorrect = (callId) => (dispatch) => {
  dispatch({ type: types.UPDATE_IS_CORRECT_CALL_REQUEST, payload: null });
  db.collection("calls")
    .doc(`${callId}`)
    .update({
      isCorrect: false,
    })
    .then(() => {
      dispatch({
        type: types.UPDATE_IS_CORRECT_CALL_SUCCESS,
        payload: "Call update it successfully ",
      });
    })
    .catch(() => {
      dispatch({
        type: types.UPDATE_IS_CORRECT_CALL_FAILURE,
        payload: `Error updating call:${callId}`,
      });
    });
};

const saveRegionCall = (singleCall, audioId) => (dispatch) => {
  let singleCallId = singleCall.callId;
  dispatch({ type: types.SAVE_REGION_CALL_REQUEST, payload: null });
  db.collection(`calls`)
    .doc(singleCallId)
    .set(singleCall)
    .then(() => {
      db.collection("rawData")
        .doc(audioId)
        .update(
          "gibbonCallsList",
          firebase.firestore.FieldValue.arrayUnion(singleCallId)
        );
      dispatch({
        type: types.SAVE_REGION_CALL_SUCCESS,
        payload: null,
      });
    })
    .catch(() => {
      dispatch({
        type: types.SAVE_REGION_CALL_FAILURE,
        payload: `Error creating call:${audioId}`,
      });
    });
  console.log(`The region was created successfully`);
};

export const callActions = {
  getSingleCall,
  clearCallsReducer,
  addCommentSingleCall,
  deleteCommentCall,
  deleteCall,
  updateIsCallCorrect,
  saveRegionCall,
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
