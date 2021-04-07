import * as types from "../constants/auth.constants";
import api from "../api";
import { alertActions } from "./alert.actions";

const loginRequest = (email, password) => async (dispatch) => {
  dispatch({ type: types.LOGIN_REQUEST, payload: null });
  try {
    const res = await api.post("user/login", { email, password });
    dispatch({ type: types.LOGIN_SUCCESS, payload: res.data });
    api.defaults.headers.common["authorization"] = "Bearer " + res.data.token;
    localStorage.setItem("accessToken", res.data.token);
    let name = res.data.user.email;
    dispatch(alertActions.setAlert(`Welcome back, ${name}`, "success"));
  } catch (error) {
    dispatch({ type: types.LOGIN_FAILURE, payload: error });
  }
};

const register = (name, email, password) => async (dispatch) => {
  dispatch({ type: types.REGISTER_REQUEST, payload: null });
  try {
    const res = await api.post("user/users", { name, email, password });
    dispatch({ type: types.REGISTER_SUCCESS, payload: res.data.data });
  } catch (error) {
    dispatch({ type: types.REGISTER_FAILURE, payload: error });
  }
};

const getCurrentUser = (accessToken) => async (dispatch) => {
  dispatch({ type: types.GET_CURRENT_USER_REQUEST, payload: null });
  if (accessToken) {
    const bearer = "Bearer " + accessToken;
    api.defaults.headers.common["authorization"] = bearer;
  }
  try {
    const res = await api.get("user/me");
    dispatch({
      type: types.GET_CURRENT_USER_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: types.GET_CURRENT_USER_FAILURE, payload: error });
  }
};

const logout = () => (dispatch) => {
  delete api.defaults.headers.common["authorization"];
  localStorage.setItem("accessToken", "");
  dispatch({ type: types.LOGOUT, payload: null });
};

export const authActions = {
  loginRequest,
  register,
  getCurrentUser,
  logout,
};
