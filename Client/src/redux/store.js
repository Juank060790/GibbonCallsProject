import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";
import { verifyAuth } from "./actions/";

export default function configureStore(persistedState) {
  // const initialState = {};
  const store = createStore(
    rootReducer,
    persistedState,
    // initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
  store.dispatch(verifyAuth());
  return store;
}
