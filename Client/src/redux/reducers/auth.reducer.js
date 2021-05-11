import * as types from "../constants/auth.constants";

const initialState = {
  user: {},
  isLoggingIn: false,
  isLoggingOut: false,
  loginError: false,
  logoutError: false,
  isAuthenticated: false,
  loading: false,
  token: localStorage.getItem("accessToken"),
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.GET_CURRENT_USER_REQUEST:
      return { ...state, loading: true };

    case types.LOGIN_REQUEST:
    case types.REGISTER_REQUEST:
      // case types.UPDATE_PROFILE_REQUEST:
      return { ...state, isLoggingIn: true, loginError: false };

    case types.LOGIN_SUCCESS:
      localStorage.setItem("accessToken", payload.token);
      return {
        ...state,
        accessToken: payload.token,
        loading: false,
        isAuthenticated: true,
        isLoggingIn: false,
        user: action.user,
      };

    case types.GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        user: payload.user,
        loading: false,
        isAuthenticated: true,
      };

    case types.LOGIN_FAILURE:
    case types.REGISTER_FAILURE:
    case types.GET_CURRENT_USER_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        loginError: true,
      };

    case types.REGISTER_SUCCESS:
      return {
        ...state,
        user: { ...payload.user },
        accessToken: payload.accessToken,
        loading: false,
        isAuthenticated: true,
      };
    case types.LOGOUT:
      return {
        ...state,
        accessToken: null,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    default:
      return state;
  }
};

export default authReducer;
