import * as types from "../constants/auth.constants";
import { myFirebase } from "../../Firebase/firebase";
import { toast } from "react-toastify";

// Firebase Auth

const requestLogin = () => {
  return {
    type: types.LOGIN_REQUEST,
  };
};

const receiveLogin = (user) => {
  return {
    type: types.LOGIN_SUCCESS,
    user,
  };
};

const loginError = () => {
  return {
    type: types.LOGIN_FAILURE,
  };
};

const requestLogout = () => {
  return {
    type: types.LOGOUT_REQUEST,
  };
};

const receiveLogout = () => {
  return {
    type: types.LOGOUT_SUCCESS,
  };
};

const logoutError = () => {
  return {
    type: types.LOGOUT_FAILURE,
  };
};

const verifyRequest = () => {
  return {
    type: types.VERIFY_REQUEST,
  };
};

const verifySuccess = () => {
  return {
    type: types.VERIFY_SUCCESS,
  };
};

export const loginUser = (email, password) => (dispatch) => {
  dispatch(requestLogin());
  myFirebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      dispatch(receiveLogin(user));
    })
    .catch((error) => {
      toast.warning("Username/ password incorrect");
      dispatch({ type: types.LOGIN_FAILURE, payload: error });
      dispatch(loginError());
    });
};

export const logoutUser = () => (dispatch) => {
  dispatch(requestLogout());
  myFirebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(receiveLogout());
    })
    .catch((error) => {
      dispatch(logoutError());
    });
};

export const verifyAuth = () => (dispatch) => {
  dispatch(verifyRequest());
  myFirebase.auth().onAuthStateChanged((user) => {
    if (user !== null) {
      dispatch(receiveLogin(user));
    }
    dispatch(verifySuccess());
  });
};
