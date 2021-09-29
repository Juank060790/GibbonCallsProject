import * as types from "../constants/audio.constants";
import { db, storage } from "../../Firebase/firebase";
import { toast } from "react-toastify";
const collectionData = "rawData";

const audiosRequest = (limit, sortBy, order, lastDoc, firstDoc, pagination) => (
  dispatch
) => {
  dispatch({ type: types.AUDIO_REQUEST, payload: null });
  let queryConfigs = {
    limit: parseInt(limit + 1) || 11, // Take one more document to check for end of collection
    sortBy: sortBy || "audioLink",
    order: order || "desc",
    lastDoc: lastDoc || null,
    firstDoc: firstDoc || null,
  };

  let ref = db
    .collection(collectionData)
    .where("isDeleted", "==", false)
    .orderBy(queryConfigs.sortBy, queryConfigs.order);

  switch (pagination) {
    case "next":
      ref = ref.startAfter(queryConfigs.lastDoc).limit(queryConfigs.limit);

      break;
    case "previous":
      ref = ref
        .endBefore(queryConfigs.firstDoc)
        .limitToLast(queryConfigs.limit - 1);

      break;

    default:
      ref = ref.limit(queryConfigs.limit);
  }

  try {
    ref.get().then((documents) => {
      let audioList = [];
      documents.forEach((doc) => {
        audioList.push(doc);
      });

      const lastDoc = audioList[queryConfigs.limit - 2]; // Offset the extra document
      const firstDoc = audioList[0];

      audioList = audioList.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      dispatch({
        type: types.AUDIO_REQUEST_SUCCESS,
        payload: { audioList, lastDoc, firstDoc },
      });
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.AUDIO_REQUEST_FAILURE,
      payload: null,
    });
  }

  // const refIsDeleted = db
  //   .collection(collectionData)
  //   .where("isDeleted", "==", false)
  //   .orderBy(queryConfigs.sortBy, queryConfigs.order);
  // if (queryConfigs.lastDocument) {
  //   refIsDeleted
  //     .limit(queryConfigs.limit)
  //     .startAfter(queryConfigs.lastDocument)
  //     .get((querySnapshot) => {
  //       let filteredaudioList = [];
  //       let latestDoc = [];
  //       let firstDocument = [];
  //       querySnapshot.docChanges().forEach(() => {
  //         filteredaudioList = [];
  //         querySnapshot.forEach((doc) => {
  //           filteredaudioList.push({ id: doc.id, ...doc.data() });
  //         });
  //       });
  //       latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  //       firstDocument = querySnapshot.docs[0];

  //       dispatch({
  //         type: types.AUDIO_REQUEST_SUCCESS,
  //         payload: { filteredaudioList, latestDoc, firstDocument },
  //       });
  //     });
  // }
  // if (queryConfigs.firstDocument) {
  //   refIsDeleted
  //     .endBefore(queryConfigs.firstDocument)
  //     .limitToLast(queryConfigs.limit)
  //     .get((querySnapshot) => {
  //       let filteredaudioList = [];
  //       let latestDoc = [];
  //       let firstDocument = [];
  //       querySnapshot.docChanges().forEach(() => {
  //         filteredaudioList = [];
  //         querySnapshot.forEach((doc) => {
  //           filteredaudioList.push({ id: doc.id, ...doc.data() });
  //         });
  //       });
  //       latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  //       firstDocument = querySnapshot.docs[0];
  //       dispatch({
  //         type: types.AUDIO_REQUEST_SUCCESS,
  //         payload: { filteredaudioList, latestDoc, firstDocument },
  //       });
  //     });
  // }
  // if (
  //   queryConfigs.firstDocument === null &&
  //   queryConfigs.lastDocument === null
  // ) {
  //   refIsDeleted.limit(queryConfigs.limit).get((querySnapshot) => {
  //     let filteredaudioList = [];
  //     let latestDoc = [];
  //     let firstDocument = [];
  //     querySnapshot.docChanges().forEach(() => {
  //       filteredaudioList = [];
  //       querySnapshot.forEach((doc) => {
  //         filteredaudioList.push({ id: doc.id, ...doc.data() });
  //       });
  //     });
  //     latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  //     firstDocument = querySnapshot.docs[0];
  //     dispatch({
  //       type: types.AUDIO_REQUEST_SUCCESS,
  //       payload: { filteredaudioList, latestDoc, firstDocument },
  //     });
  //   });
  // }
};

const getSingleAudio = (audioId) => (dispatch) => {
  let singleAudio = {};
  dispatch({ type: types.GET_SINGLE_AUDIO_REQUEST, payload: null });

  var storageRef = storage.ref();

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
        return;
      }
    })
    .then(() => {
      dispatch({ type: types.GET_IMAGE_FROM_FIREBASE_REQUEST, payload: null });
      // get image from firestore with the path of a selected audio
      if (singleAudio?.spectrogram) {
        storageRef
          .child(`/${singleAudio.spectrogram}`)
          .getDownloadURL()
          .then(function (imgUrl) {
            dispatch({
              type: types.GET_IMAGE_FROM_FIREBASE_SUCCESS,
              payload: imgUrl,
            });
          })
          .catch(function (error) {
            console.log(error);
            dispatch({
              type: types.GET_IMAGE_FROM_FIREBASE_FAILURE,
              payload: "Image not found",
            });
          });
      }

      dispatch({ type: types.GET_AUDIO_FROM_FIREBASE_REQUEST, payload: null });
      storageRef
        .child(singleAudio.audioLink)
        .getDownloadURL()
        .then(function (url) {
          console.log(url);
          dispatch({
            type: types.GET_AUDIO_FROM_FIREBASE_SUCCESS,
            payload: url,
          });
        })
        .catch(function (error) {
          console.log(error);
          dispatch({
            type: types.GET_AUDIO_FROM_FIREBASE_FAILURE,
            payload: "Audio not found",
          });
        });
    });
};

// Get audio from firestore with the path of a selected audio
const getAudioFromFirebase = (audioLink) => (dispatch) => {
  dispatch({ type: types.GET_AUDIO_FROM_FIREBASE_REQUEST, payload: null });
  var storageRef = storage.ref(audioLink);
  storageRef
    .getDownloadURL()
    .then(function (url) {
      console.log(url);
      dispatch({
        type: types.GET_AUDIO_FROM_FIREBASE_SUCCESS,
        payload: url,
      });
    })
    .catch(function (error) {
      console.log(error);
      dispatch({
        type: types.GET_AUDIO_FROM_FIREBASE_FAILURE,
        payload: "Audio not found",
      });
    });
};

// Create new comment to audio.
const addCommentRawAudio = (comment, audioId) => (dispatch) => {
  dispatch({ type: types.CREATE_COMMENT_RAW_AUDIO_REQUEST, payload: null });
  toast.success("Saving...");
  db.collection(collectionData)
    .doc(`${audioId}`)
    .update({
      comments: comment,
    })
    .then(() => {
      dispatch({
        type: types.CREATE_COMMENT_RAW_AUDIO_SUCCESS,
        payload: "Comment saved",
      });
      toast.success("Comment saved");
      // dispatch(alertActions.setAlert(`Comment saved`, "success"));
    })
    .catch((err) => {
      dispatch({
        type: types.CREATE_COMMENT_RAW_AUDIO_FAILURE,
        payload: "Comment not created ",
      });
      toast.warning("Comment not saved");
    });
};

const deleteAudio = (audioId) => (dispatch) => {
  // console.log(`audioId`, audioId);
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
  deleteAudio,
  searchDocuments,
  searchByDate,
  getAudioFromFirebase,
};
