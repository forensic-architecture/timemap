import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/index.js'
import App from './components/App.jsx'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('explore-app')
)

// Expressions from https://exceptionshub.com/how-to-detect-safari-chrome-ie-firefox-and-opera-browser.html

/* eslint-disable */
// Opera 8.0+
const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== 'undefined'
// Safari 3.0+ "[object HTMLElementConstructor]"
const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]' })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))
// Internet Explorer 6-11
const isIE = /* @cc_on!@ */false || !!document.documentMode
// Edge 20+
const isEdge = !isIE && !!window.StyleMedia
// Chrome 1+
const isChrome = !!window.chrome && !!window.chrome.webstore
// Blink engine detection
const isBlink = (isChrome || isOpera) && !!window.CSS

if (isEdge || isIE) {
  alert('Please view this website in Opera for best viewing. It is untested in your browser.')
}
/* eslint-enable */
