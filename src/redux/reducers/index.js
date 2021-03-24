import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import alertReducer from "./alert.reducer";
import audioReducer from "./audio.reducer";

export default combineReducers({
  audio: audioReducer,
  auth: authReducer,
  alert: alertReducer,
});
