import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import alertReducer from "./alert.reducer";
import audioReducer from "./audio.reducer";
import callReducer from "./call.reducer";

export default combineReducers({
  audio: audioReducer,
  call: callReducer,
  auth: authReducer,
  alert: alertReducer,
});
