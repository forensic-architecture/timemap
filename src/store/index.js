import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import middleware from './middleware'
import createRootReducer from '../reducers'

import thunk from 'redux-thunk'

export const history = createBrowserHistory()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore (preloadedState) {
  const store = createStore(
    createRootReducer(history),
    composeEnhancers(
      compose(
        applyMiddleware(
          routerMiddleware(history),
          thunk,
          middleware
        )
      )
    )
  )

  return store
}
