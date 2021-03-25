import * as types from "../constants/audio.constants";
import api from "../api";
import { alertActions } from "./alert.actions";

const audiosRequest = (
  page = 1,
  limit = 5,
  sortBy = "audioId",
  order = ""
  // query = null,
) => async (dispatch) => {
  dispatch({ type: types.AUDIO_REQUEST, payload: null });
  try {
    let queryString = "";
    // if (query) {
    //   queryString = `&title[$regex]=${query}&title[$options]=i`;
    // }
    // let sortBy = "";
    // if (sortBy?.key) {
    //   sortBy = `&sortBy[${sortBy.key}]=${sortBy.ascending}`;
    // }
    const res = await api.get(
      `audio/audiolist/filter/page${page}/limit${limit}/sortBy${sortBy}/order${order}`
    );
    console.log("RESULTAUDIOSSS", res.data);
    dispatch({
      type: types.AUDIO_REQUEST_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: types.AUDIO_REQUEST_FAILURE, payload: error });
  }
};

export const audioActions = {
  audiosRequest,
};
