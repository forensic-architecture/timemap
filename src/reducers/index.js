import { combineReducers } from "redux";
import rootReducer from "./root.js";
import domain from "./domain.js";
import app from "./app.js";
import ui from "./ui.js";
import features from "./features.js";

function decorateRootReducer(rootReducer, reducer) {
  return (state, action) =>
    reducer(
      {
        ...rootReducer(state, action),
      },
      action
    );
}

export default decorateRootReducer(
  rootReducer,
  combineReducers({
    app,
    domain,
    ui,
    features,
  })
);
