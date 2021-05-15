import * as types from "../constants/auth.constants";
import { myFirebase } from "../../Firebase/firebase";

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
  console.log(`email`, email, password);
  dispatch(requestLogin());
  myFirebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      dispatch(receiveLogin(user));
    })
    .catch((error) => {
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

// -------------------------- OLD CODE ---------------------- //

// const loginRequest = (email, password) => async (dispatch) => {
//   dispatch({ type: types.LOGIN_REQUEST, payload: null });
//   try {
//     const res = await api.post("user/login", { email, password });
//     dispatch({ type: types.LOGIN_SUCCESS, payload: res.data });
//     api.defaults.headers.common["authorization"] = "Bearer " + res.data.token;
//     localStorage.setItem("accessToken", res.data.token);
//     let name = res.data.user.email;
//     dispatch(alertActions.setAlert(`Welcome back, ${name}`, "success"));
//   } catch (error) {
//     dispatch({ type: types.LOGIN_FAILURE, payload: error });
//   }
// };

// const register = (name, email, password) => async (dispatch) => {
//   dispatch({ type: types.REGISTER_REQUEST, payload: null });
//   try {
//     const res = await api.post("user/users", { name, email, password });
//     dispatch({ type: types.REGISTER_SUCCESS, payload: res.data.data });
//   } catch (error) {
//     dispatch({ type: types.REGISTER_FAILURE, payload: error });
//   }
// };

// const getCurrentUser = (accessToken) => async (dispatch) => {
//   dispatch({ type: types.GET_CURRENT_USER_REQUEST, payload: null });
//   if (accessToken) {
//     const bearer = "Bearer " + accessToken;
//     // api.defaults.headers.common["authorization"] = bearer;
//   }
//   try {
//     const res = await api.get("user/me");
//     dispatch({
//       type: types.GET_CURRENT_USER_SUCCESS,
//       payload: res.data,
//     });
//   } catch (error) {
//     dispatch({ type: types.GET_CURRENT_USER_FAILURE, payload: error });
//   }
// };

// const logout = () => (dispatch) => {
//   // delete api.defaults.headers.common["authorization"];
//   localStorage.setItem("accessToken", "");
//   dispatch({ type: types.LOGOUT, payload: null });
// };

// export const authActions = {
//   loginRequest,
//   register,
//   getCurrentUser,
//   logout,
// };
