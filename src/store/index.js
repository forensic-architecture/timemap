import { createStore, applyMiddleware, compose } from "redux";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import createRootReducer from "../reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const history = createBrowserHistory();

export default function configureStore(intialState) {
  const store = createStore(
    createRootReducer(history),
    intialState,
    composeEnhancers(applyMiddleware(thunk, routerMiddleware(history)))
  );
  return store;
}
