import * as types from "../constants/audio.constants";
import { db } from "../../Firebase/firebase";

const audiosRequest =
  (limit, sortBy, order, lastDoc, firstDoc) => (dispatch) => {
    dispatch({ type: types.AUDIO_REQUEST, payload: null });
    let query = {
      limit: parseInt(limit) || 5,
      sortBy: sortBy || "recordDate",
      order: order || "desc",
      lastDocument: lastDoc || null,
      firstDocument: firstDoc || null,
    };
    const refIsDeleted = db
      .collection("rawData")
      .where("isDeleted", "==", false)
      .orderBy(query.sortBy, query.order);

    if (query.lastDocument) {
      refIsDeleted
        .limit(query.limit)
        .startAt(query.lastDocument)
        .onSnapshot((querySnapshot) => {
          let filteredaudioList = [];
          let latestDoc = [];
          let firstDocument = [];
          querySnapshot.docChanges().forEach(() => {
            filteredaudioList = [];
            querySnapshot.forEach((doc) => {
              filteredaudioList.push(doc.data());
            });
          });
          latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          firstDocument = querySnapshot.docs[0];
          dispatch({
            type: types.AUDIO_REQUEST_SUCCESS,
            payload: { filteredaudioList, latestDoc, firstDocument },
          });
        });
    }
    if (query.firstDocument) {
      refIsDeleted
        .limit(query.limit)
        .endAt(query.firstDocument)
        .onSnapshot((querySnapshot) => {
          let filteredaudioList = [];
          let latestDoc = [];
          let firstDocument = [];
          querySnapshot.docChanges().forEach(() => {
            filteredaudioList = [];
            querySnapshot.forEach((doc) => {
              filteredaudioList.push(doc.data());
            });
          });
          latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          firstDocument = querySnapshot.docs[0];
          dispatch({
            type: types.AUDIO_REQUEST_SUCCESS,
            payload: { filteredaudioList, latestDoc, firstDocument },
          });
        });
    }
    if (query.firstDocument === null && query.lastDocument === null) {
      refIsDeleted.limit(query.limit).onSnapshot((querySnapshot) => {
        let filteredaudioList = [];
        let latestDoc = [];
        let firstDocument = [];
        querySnapshot.docChanges().forEach(() => {
          filteredaudioList = [];
          querySnapshot.forEach((doc) => {
            filteredaudioList.push(doc.data());
          });
        });
        latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        firstDocument = querySnapshot.docs[0];
        dispatch({
          type: types.AUDIO_REQUEST_SUCCESS,
          payload: { filteredaudioList, latestDoc, firstDocument },
        });
      });
    }
  };

const getSingleAudio = (audioId) => (dispatch) => {
  let singleAudio = {};
  dispatch({ type: types.GET_SINGLE_AUDIO_REQUEST, payload: null });

  db.doc(`rawData/${audioId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        singleAudio = doc.data();
        dispatch({
          type: types.GET_SINGLE_AUDIO_REQUEST_SUCCESS,
          payload: singleAudio,
        });
      } else {
        dispatch({
          type: types.GET_SINGLE_AUDIO_REQUEST_FAILURE,
          payload: "Audio not found",
        });
      }
    });
};

// Create new comment to audio.
const addCommentRawAudio = (comment, audioId) => (dispatch) => {
  dispatch({ type: types.CREATE_COMMENT_RAW_AUDIO_REQUEST, payload: null });
  db.collection("rawData")
    .doc(`${audioId}`)
    .update({
      comments: comment,
    })
    .then(() => {
      dispatch({
        type: types.CREATE_COMMENT_RAW_AUDIO_SUCCESS,
        payload: "Comment created ",
      });
    })
    .catch((err) => {
      dispatch({
        type: types.CREATE_COMMENT_RAW_AUDIO_FAILURE,
        payload: "Comment not created ",
      });
    });
};

const deleteCommentAudio = (audioId) => (dispatch) => {
  dispatch({ type: types.DELETE_COMMENT_RAW_AUDIO_REQUEST, payload: null });

  db.collection("rawData")
    .doc(`${audioId}`)
    .update({
      comments: "",
    })
    .then(() => {
      dispatch({
        type: types.DELETE_COMMENT_RAW_AUDIO_SUCCESS,
      });
    })
    .catch((error) => {
      dispatch({
        type: types.DELETE_COMMENT_RAW_AUDIO_FAILURE,
        payload: `Error removing comment from document:${audioId} `,
      });
    });
};

const deleteAudio = (audioId) => (dispatch) => {
  dispatch({ type: types.DELETE_RAW_AUDIO_REQUEST, payload: null });
  db.collection("rawData")
    .doc(`${audioId}`)
    .update({
      isDeleted: true,
    })
    .then(() => {
      dispatch({
        type: types.DELETE_RAW_AUDIO_SUCCESS,
        payload: "Audio deleted successfully ",
      });
    })
    .catch((err) => {
      dispatch({
        type: types.DELETE_RAW_AUDIO_FAILURE,
        payload: `Error removing document:${audioId}`,
      });
    });
};

// Helps to clear audio reducer when close modal.
const clearSelectedAudioReducer = () => (dispatch) => {
  dispatch({ type: types.CLEAR_SELECTED_AUDIO, payload: null });
};

const searchDocuments = (searchQuery) => (dispatch) => {
  dispatch({ type: types.AUDIO_SEARCH_REQUEST });

  let query = {
    limit: 5,
    sortBy: "recordDate",
    order: "desc",
    searchDoc: searchQuery,
  };

  let searchList = [];
  db.collection("rawData")
    .where("fileName", "==", query.searchDoc)
    .orderBy(query.sortBy, query.order)
    .limit(query.limit)
    .onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach(() => {
        querySnapshot.forEach((doc) => {
          searchList.push(doc.data());
        });
      });
      console.log(`searchList`, searchList);
      dispatch({
        type: types.AUDIO_SEARCH_SUCCESS,
        payload: searchList,
      });
    });
};

export const audioActions = {
  audiosRequest,
  getSingleAudio,
  clearSelectedAudioReducer,
  addCommentRawAudio,
  deleteCommentAudio,
  deleteAudio,
  searchDocuments,
};
