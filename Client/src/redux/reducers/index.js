import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import alertReducer from "./alert.reducer";
import audioReducer from "./audio.reducer";
// import callReducer from "./call.reducer";
import spectrogramReducer from "./spectrogram.reducer";

// Combine all the reducers giving individual and short name to get the data.

export default combineReducers({
  audio: audioReducer,
  // call: callReducer,
  auth: authReducer,
  alert: alertReducer,
  spectrogram: spectrogramReducer,
});
