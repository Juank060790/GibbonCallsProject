import * as types from "../constants/audio.constants";
import { db } from "../../Firebase/firebase";
const collectionData = "rawData";

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
      .collection(collectionData)
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
              filteredaudioList.audios.push({ id: doc.id, ...doc.data() });
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
        .endBefore(query.firstDocument)
        .limitToLast(query.limit)
        .onSnapshot((querySnapshot) => {
          let filteredaudioList = [];
          let latestDoc = [];
          let firstDocument = [];
          querySnapshot.docChanges().forEach(() => {
            filteredaudioList = [];
            querySnapshot.forEach((doc) => {
              filteredaudioList.push({ id: doc.id, ...doc.data() });
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
            filteredaudioList.push({ id: doc.id, ...doc.data() });
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

  db.doc(`${collectionData}/${audioId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        singleAudio = { id: doc.id, ...doc.data() };
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
  db.collection(collectionData)
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

  db.collection(collectionData)
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
  console.log(`audioId`, audioId);
  dispatch({ type: types.DELETE_RAW_AUDIO_REQUEST, payload: null });
  db.collection(collectionData)
    .doc(audioId)
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

const searchDocuments = (searchQuery, searchCategory) => (dispatch) => {
  dispatch({ type: types.AUDIO_SEARCH_REQUEST });

  let query = {
    limit: 10,
    sortBy: "recordDate",
    order: "desc",
    searchDoc: searchQuery,
    category: searchCategory,
  };

  let searchList = [];
  db.collection(collectionData)
    .where(query.category, "==", query.searchDoc)
    .orderBy(query.sortBy, query.order)
    .limit(query.limit)
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        searchList.push({ id: doc.id, ...doc.data() });
      });

      dispatch({
        type: types.AUDIO_SEARCH_SUCCESS,
        payload: searchList,
      });
    });
};

const searchByDate = (searchQuery, searchCategory) => (dispatch) => {
  dispatch({ type: types.AUDIO_SEARCHBYDATE_REQUEST });

  let query = {
    sortBy: "recordDate",
    order: "desc",
    searchDoc: searchQuery,
    category: searchCategory,
  };

  let searchList = [];
  db.collection(collectionData)
    .where(query.category, "<", query.searchDoc)
    .orderBy(query.sortBy, query.order)
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        searchList.push({ id: doc.id, ...doc.data() });
      });

      dispatch({
        type: types.AUDIO_SEARCHBYDATE_SUCCESS,
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
  searchByDate,
};
