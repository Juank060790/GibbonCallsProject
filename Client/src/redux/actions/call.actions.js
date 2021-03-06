import * as types from "../constants/spectrogram.constants";
import { db } from "../../Firebase/firebase";
import firebase from "firebase/app";
import { toast } from "react-toastify";

// Main collection where we store all audio files
const collectionData = "rawData";

const getSingleCall = (callId) => (dispatch) => {
  dispatch({ type: types.GET_SINGLE_CALL_REQUEST, payload: null });
  db.doc(`calls/${callId}`).onSnapshot((doc) => {
    let singleCall = [];
    if (doc.exists) {
      singleCall = { id: doc.id, ...doc.data(), dataBase: true };
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
      toast.success("Comment saved");
    })
    .catch((err) => {
      dispatch({
        type: types.CREATE_COMMENT_SINGLE_CALL_FAILURE,
        payload: err,
      });
      toast.warning("Comment not saved");
    });
};

const deleteCall = (callId, selectedAudio) => (dispatch) => {
  dispatch({ type: types.DELETE_CALL_REQUEST, payload: null });
  db.collection("calls")
    .doc(`${callId}`)
    .delete()
    .then(() => {
      db.collection(collectionData)
        .doc(selectedAudio)
        .update({
          gibbonCallsList: firebase.firestore.FieldValue.arrayRemove(callId),
        });

      dispatch({
        type: types.DELETE_CALL_SUCCESS,
        payload: "Call deleted successfully ",
      });
      getSingleCall(selectedAudio);
    })
    .catch((err) => {
      dispatch({
        type: types.DELETE_CALL_FAILURE,
        payload: `Error removing document:${callId}`,
        err,
      });
    });
};

const updateIsCallCorrect = (callId, slectedAudioId, isCorrect) => (
  dispatch
) => {
  let validate = isCorrect;

  dispatch({ type: types.UPDATE_IS_CORRECT_CALL_REQUEST, payload: null });
  db.collection("calls")
    .doc(`${callId}`)
    .update({
      isCorrect: validate,
    })
    .then(() => {
      dispatch({
        type: types.UPDATE_IS_CORRECT_CALL_SUCCESS,
        payload: "Call update it successfully ",
      });
      // toast.success("Call has been updated it", "success");
    })
    .catch(() => {
      dispatch({
        type: types.UPDATE_IS_CORRECT_CALL_FAILURE,
        payload: `Error updating call:${callId}`,
      });
    });
};

const saveRegionCall = (singleCall, audioId, addCallCount) => (dispatch) => {
  let singleCallId = singleCall.id;
  dispatch({ type: types.SAVE_REGION_CALL_REQUEST, payload: null });
  db.collection(`calls`)
    .doc(singleCallId)
    .set(singleCall)
    .then(() => {
      db.collection(collectionData)
        .doc(audioId)
        .update(
          "gibbonCallsList",
          firebase.firestore.FieldValue.arrayUnion(singleCallId)
        );

      dispatch({
        type: types.SAVE_REGION_CALL_SUCCESS,
        payload: singleCallId,
      });
    })
    .catch(() => {
      dispatch({
        type: types.SAVE_REGION_CALL_FAILURE,
        payload: `Error creating call:${audioId}`,
      });
    });
};

export const callActions = {
  getSingleCall,
  clearCallsReducer,
  addCommentSingleCall,
  deleteCall,
  updateIsCallCorrect,
  saveRegionCall,
};
