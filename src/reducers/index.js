import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import domain from "./domain.js";
import app from "./app.js";
import ui from "./ui.js";
import features from "./features.js";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    app,
    domain,
    ui,
    features,
  });

export default createRootReducer;
