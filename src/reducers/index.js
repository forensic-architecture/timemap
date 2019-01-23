import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import domain from './domain.js'
import app from './app.js'
import ui from './ui.js'

export default (history) => combineReducers({
  router: connectRouter(history),
  app,//: (appState, action) => { return app(appState, action, history); },
  domain,
  ui
});
