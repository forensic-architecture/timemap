import React from 'react'
import ReactDOM from 'react-dom'
import configureStore, { history } from './store/index.js'
import { Provider } from 'react-redux'

import App from './components/App'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('explore-app')
)
