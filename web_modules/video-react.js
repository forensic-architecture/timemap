import { c as createCommonjsModule, g as getDefaultExportFromCjs } from './common/_commonjsHelpers-4f955397.js';
import { r as react } from './common/index-abdc4d2d.js';
import { p as propTypes } from './common/index-ad697a84.js';
import { r as reactDom } from './common/index-ab268656.js';
import { i as interopRequireDefault, c as classCallCheck, b as createClass, o as objectSpread, h as interopRequireWildcard, p as possibleConstructorReturn, g as getPrototypeOf, e as assertThisInitialized, d as inherits, a as objectWithoutProperties, f as defineProperty } from './common/inherits-8fe2188b.js';
import { r as result } from './common/index-7edab99c.js';
import { c as classnames } from './common/index-d4b0dc1b.js';

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
  }

  var boundActionCreators = {};

  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

var redux = /*#__PURE__*/Object.freeze({
  __proto__: null,
  __DO_NOT_USE__ActionTypes: ActionTypes,
  applyMiddleware: applyMiddleware,
  bindActionCreators: bindActionCreators,
  combineReducers: combineReducers,
  compose: compose,
  createStore: createStore
});

var video = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleLoadStart = handleLoadStart;
exports.handleCanPlay = handleCanPlay;
exports.handleWaiting = handleWaiting;
exports.handleCanPlayThrough = handleCanPlayThrough;
exports.handlePlaying = handlePlaying;
exports.handlePlay = handlePlay;
exports.handlePause = handlePause;
exports.handleEnd = handleEnd;
exports.handleSeeking = handleSeeking;
exports.handleSeeked = handleSeeked;
exports.handleDurationChange = handleDurationChange;
exports.handleTimeUpdate = handleTimeUpdate;
exports.handleVolumeChange = handleVolumeChange;
exports.handleProgressChange = handleProgressChange;
exports.handleRateChange = handleRateChange;
exports.handleSuspend = handleSuspend;
exports.handleAbort = handleAbort;
exports.handleEmptied = handleEmptied;
exports.handleStalled = handleStalled;
exports.handleLoadedMetaData = handleLoadedMetaData;
exports.handleLoadedData = handleLoadedData;
exports.handleResize = handleResize;
exports.handleError = handleError;
exports.handleSeekingTime = handleSeekingTime;
exports.handleEndSeeking = handleEndSeeking;
exports.ERROR = exports.RESIZE = exports.LOADED_DATA = exports.LOADED_META_DATA = exports.STALLED = exports.EMPTIED = exports.ABORT = exports.SUSPEND = exports.RATE_CHANGE = exports.PROGRESS_CHANGE = exports.VOLUME_CHANGE = exports.TIME_UPDATE = exports.DURATION_CHANGE = exports.END_SEEKING = exports.SEEKING_TIME = exports.SEEKED = exports.SEEKING = exports.END = exports.PAUSE = exports.PLAY = exports.PLAYING = exports.CAN_PLAY_THROUGH = exports.WAITING = exports.CAN_PLAY = exports.LOAD_START = void 0;
var LOAD_START = 'video-react/LOAD_START';
exports.LOAD_START = LOAD_START;
var CAN_PLAY = 'video-react/CAN_PLAY';
exports.CAN_PLAY = CAN_PLAY;
var WAITING = 'video-react/WAITING';
exports.WAITING = WAITING;
var CAN_PLAY_THROUGH = 'video-react/CAN_PLAY_THROUGH';
exports.CAN_PLAY_THROUGH = CAN_PLAY_THROUGH;
var PLAYING = 'video-react/PLAYING';
exports.PLAYING = PLAYING;
var PLAY = 'video-react/PLAY';
exports.PLAY = PLAY;
var PAUSE = 'video-react/PAUSE';
exports.PAUSE = PAUSE;
var END = 'video-react/END';
exports.END = END;
var SEEKING = 'video-react/SEEKING';
exports.SEEKING = SEEKING;
var SEEKED = 'video-react/SEEKED';
exports.SEEKED = SEEKED;
var SEEKING_TIME = 'video-react/SEEKING_TIME';
exports.SEEKING_TIME = SEEKING_TIME;
var END_SEEKING = 'video-react/END_SEEKING';
exports.END_SEEKING = END_SEEKING;
var DURATION_CHANGE = 'video-react/DURATION_CHANGE';
exports.DURATION_CHANGE = DURATION_CHANGE;
var TIME_UPDATE = 'video-react/TIME_UPDATE';
exports.TIME_UPDATE = TIME_UPDATE;
var VOLUME_CHANGE = 'video-react/VOLUME_CHANGE';
exports.VOLUME_CHANGE = VOLUME_CHANGE;
var PROGRESS_CHANGE = 'video-react/PROGRESS_CHANGE';
exports.PROGRESS_CHANGE = PROGRESS_CHANGE;
var RATE_CHANGE = 'video-react/RATE_CHANGE';
exports.RATE_CHANGE = RATE_CHANGE;
var SUSPEND = 'video-react/SUSPEND';
exports.SUSPEND = SUSPEND;
var ABORT = 'video-react/ABORT';
exports.ABORT = ABORT;
var EMPTIED = 'video-react/EMPTIED';
exports.EMPTIED = EMPTIED;
var STALLED = 'video-react/STALLED';
exports.STALLED = STALLED;
var LOADED_META_DATA = 'video-react/LOADED_META_DATA';
exports.LOADED_META_DATA = LOADED_META_DATA;
var LOADED_DATA = 'video-react/LOADED_DATA';
exports.LOADED_DATA = LOADED_DATA;
var RESIZE = 'video-react/RESIZE';
exports.RESIZE = RESIZE;
var ERROR = 'video-react/ERROR';
exports.ERROR = ERROR;

function handleLoadStart(videoProps) {
  return {
    type: LOAD_START,
    videoProps: videoProps
  };
}

function handleCanPlay(videoProps) {
  return {
    type: CAN_PLAY,
    videoProps: videoProps
  };
}

function handleWaiting(videoProps) {
  return {
    type: WAITING,
    videoProps: videoProps
  };
}

function handleCanPlayThrough(videoProps) {
  return {
    type: CAN_PLAY_THROUGH,
    videoProps: videoProps
  };
}

function handlePlaying(videoProps) {
  return {
    type: PLAYING,
    videoProps: videoProps
  };
}

function handlePlay(videoProps) {
  return {
    type: PLAY,
    videoProps: videoProps
  };
}

function handlePause(videoProps) {
  return {
    type: PAUSE,
    videoProps: videoProps
  };
}

function handleEnd(videoProps) {
  return {
    type: END,
    videoProps: videoProps
  };
}

function handleSeeking(videoProps) {
  return {
    type: SEEKING,
    videoProps: videoProps
  };
}

function handleSeeked(videoProps) {
  return {
    type: SEEKED,
    videoProps: videoProps
  };
}

function handleDurationChange(videoProps) {
  return {
    type: DURATION_CHANGE,
    videoProps: videoProps
  };
}

function handleTimeUpdate(videoProps) {
  return {
    type: TIME_UPDATE,
    videoProps: videoProps
  };
}

function handleVolumeChange(videoProps) {
  return {
    type: VOLUME_CHANGE,
    videoProps: videoProps
  };
}

function handleProgressChange(videoProps) {
  return {
    type: PROGRESS_CHANGE,
    videoProps: videoProps
  };
}

function handleRateChange(videoProps) {
  return {
    type: RATE_CHANGE,
    videoProps: videoProps
  };
}

function handleSuspend(videoProps) {
  return {
    type: SUSPEND,
    videoProps: videoProps
  };
}

function handleAbort(videoProps) {
  return {
    type: ABORT,
    videoProps: videoProps
  };
}

function handleEmptied(videoProps) {
  return {
    type: EMPTIED,
    videoProps: videoProps
  };
}

function handleStalled(videoProps) {
  return {
    type: STALLED,
    videoProps: videoProps
  };
}

function handleLoadedMetaData(videoProps) {
  return {
    type: LOADED_META_DATA,
    videoProps: videoProps
  };
}

function handleLoadedData(videoProps) {
  return {
    type: LOADED_DATA,
    videoProps: videoProps
  };
}

function handleResize(videoProps) {
  return {
    type: RESIZE,
    videoProps: videoProps
  };
}

function handleError(videoProps) {
  return {
    type: ERROR,
    videoProps: videoProps
  };
}

function handleSeekingTime(time) {
  return {
    type: SEEKING_TIME,
    time: time
  };
}

function handleEndSeeking(time) {
  return {
    type: END_SEEKING,
    time: time
  };
}
});

var fullscreen = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var Fullscreen =
/*#__PURE__*/
function () {
  function Fullscreen() {
    (0, _classCallCheck2["default"])(this, Fullscreen);
  }

  (0, _createClass2["default"])(Fullscreen, [{
    key: "request",
    value: function request(elm) {
      if (elm.requestFullscreen) {
        elm.requestFullscreen();
      } else if (elm.webkitRequestFullscreen) {
        elm.webkitRequestFullscreen();
      } else if (elm.mozRequestFullScreen) {
        elm.mozRequestFullScreen();
      } else if (elm.msRequestFullscreen) {
        elm.msRequestFullscreen();
      }
    }
  }, {
    key: "exit",
    value: function exit() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(handler) {
      document.addEventListener('fullscreenchange', handler);
      document.addEventListener('webkitfullscreenchange', handler);
      document.addEventListener('mozfullscreenchange', handler);
      document.addEventListener('MSFullscreenChange', handler);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(handler) {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
      document.removeEventListener('mozfullscreenchange', handler);
      document.removeEventListener('MSFullscreenChange', handler);
    }
  }, {
    key: "isFullscreen",
    get: function get() {
      return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    }
  }, {
    key: "enabled",
    get: function get() {
      return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
    }
  }]);
  return Fullscreen;
}();

var _default = new Fullscreen();

exports["default"] = _default;
});

var player = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleFullscreenChange = handleFullscreenChange;
exports.activate = activate;
exports.userActivate = userActivate;
exports.play = play;
exports.pause = pause;
exports.togglePlay = togglePlay;
exports.seek = seek;
exports.forward = forward;
exports.replay = replay;
exports.changeRate = changeRate;
exports.changeVolume = changeVolume;
exports.mute = mute;
exports.toggleFullscreen = toggleFullscreen;
exports.USER_ACTIVATE = exports.PLAYER_ACTIVATE = exports.FULLSCREEN_CHANGE = exports.OPERATE = void 0;

var _fullscreen = interopRequireDefault(fullscreen);

var OPERATE = 'video-react/OPERATE';
exports.OPERATE = OPERATE;
var FULLSCREEN_CHANGE = 'video-react/FULLSCREEN_CHANGE';
exports.FULLSCREEN_CHANGE = FULLSCREEN_CHANGE;
var PLAYER_ACTIVATE = 'video-react/PLAYER_ACTIVATE';
exports.PLAYER_ACTIVATE = PLAYER_ACTIVATE;
var USER_ACTIVATE = 'video-react/USER_ACTIVATE';
exports.USER_ACTIVATE = USER_ACTIVATE;

function handleFullscreenChange(isFullscreen) {
  return {
    type: FULLSCREEN_CHANGE,
    isFullscreen: isFullscreen
  };
}

function activate(activity) {
  return {
    type: PLAYER_ACTIVATE,
    activity: activity
  };
}

function userActivate(activity) {
  return {
    type: USER_ACTIVATE,
    activity: activity
  };
}

function play() {
  var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    action: 'play',
    source: ''
  };
  this.video.play();
  return {
    type: OPERATE,
    operation: operation
  };
}

function pause() {
  var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    action: 'pause',
    source: ''
  };
  this.video.pause();
  return {
    type: OPERATE,
    operation: operation
  };
}

function togglePlay() {
  var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    action: 'toggle-play',
    source: ''
  };
  this.video.togglePlay();
  return {
    type: OPERATE,
    operation: operation
  };
} // seek video by time


function seek(time) {
  var operation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    action: 'seek',
    source: ''
  };
  this.video.seek(time);
  return {
    type: OPERATE,
    operation: operation
  };
} // jump forward x seconds


function forward(seconds) {
  var operation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    action: "forward-".concat(seconds),
    source: ''
  };
  this.video.forward(seconds);
  return {
    type: OPERATE,
    operation: operation
  };
} // jump back x seconds


function replay(seconds) {
  var operation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    action: "replay-".concat(seconds),
    source: ''
  };
  this.video.replay(seconds);
  return {
    type: OPERATE,
    operation: operation
  };
}

function changeRate(rate) {
  var operation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    action: 'change-rate',
    source: ''
  };
  this.video.playbackRate = rate;
  return {
    type: OPERATE,
    operation: operation
  };
}

function changeVolume(volume) {
  var operation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    action: 'change-volume',
    source: ''
  };
  var v = volume;

  if (volume < 0) {
    v = 0;
  }

  if (volume > 1) {
    v = 1;
  }

  this.video.volume = v;
  return {
    type: OPERATE,
    operation: operation
  };
}

function mute(muted) {
  var operation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    action: muted ? 'muted' : 'unmuted',
    source: ''
  };
  this.video.muted = muted;
  return {
    type: OPERATE,
    operation: operation
  };
}

function toggleFullscreen(player) {
  if (_fullscreen["default"].enabled) {
    if (_fullscreen["default"].isFullscreen) {
      _fullscreen["default"].exit();
    } else {
      _fullscreen["default"].request(this.rootElement);
    }

    return {
      type: OPERATE,
      operation: {
        action: 'toggle-fullscreen',
        source: ''
      }
    };
  }

  return {
    type: FULLSCREEN_CHANGE,
    isFullscreen: !player.isFullscreen
  };
}
});

var player_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = player$1;

var _objectSpread2 = interopRequireDefault(objectSpread);





var initialState = {
  currentSrc: null,
  duration: 0,
  currentTime: 0,
  seekingTime: 0,
  buffered: null,
  waiting: false,
  seeking: false,
  paused: true,
  autoPaused: false,
  ended: false,
  playbackRate: 1,
  muted: false,
  volume: 1,
  readyState: 0,
  networkState: 0,
  videoWidth: 0,
  videoHeight: 0,
  hasStarted: false,
  userActivity: true,
  isActive: false,
  isFullscreen: false
};

function player$1() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case player.USER_ACTIVATE:
      return (0, _objectSpread2["default"])({}, state, {
        userActivity: action.activity
      });

    case player.PLAYER_ACTIVATE:
      return (0, _objectSpread2["default"])({}, state, {
        isActive: action.activity
      });

    case player.FULLSCREEN_CHANGE:
      return (0, _objectSpread2["default"])({}, state, {
        isFullscreen: !!action.isFullscreen
      });

    case video.SEEKING_TIME:
      return (0, _objectSpread2["default"])({}, state, {
        seekingTime: action.time
      });

    case video.END_SEEKING:
      return (0, _objectSpread2["default"])({}, state, {
        seekingTime: 0
      });

    case video.LOAD_START:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        hasStarted: false,
        ended: false
      });

    case video.CAN_PLAY:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        waiting: false
      });

    case video.WAITING:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        waiting: true
      });

    case video.CAN_PLAY_THROUGH:
    case video.PLAYING:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        waiting: false
      });

    case video.PLAY:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        ended: false,
        paused: false,
        autoPaused: false,
        waiting: false,
        hasStarted: true
      });

    case video.PAUSE:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        paused: true
      });

    case video.END:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        ended: true
      });

    case video.SEEKING:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        seeking: true
      });

    case video.SEEKED:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        seeking: false
      });

    case video.ERROR:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        error: 'UNKNOWN ERROR',
        ended: true
      });

    case video.DURATION_CHANGE:
    case video.TIME_UPDATE:
    case video.VOLUME_CHANGE:
    case video.PROGRESS_CHANGE:
    case video.RATE_CHANGE:
    case video.SUSPEND:
    case video.ABORT:
    case video.EMPTIED:
    case video.STALLED:
    case video.LOADED_META_DATA:
    case video.LOADED_DATA:
    case video.RESIZE:
      return (0, _objectSpread2["default"])({}, state, action.videoProps);

    default:
      return state;
  }
}
});

var operation_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = operation;

var _objectSpread2 = interopRequireDefault(objectSpread);



var initialState = {
  count: 0,
  operation: {
    action: '',
    source: ''
  }
};

function operation() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case player.OPERATE:
      return (0, _objectSpread2["default"])({}, state, {
        count: state.count + 1,
        operation: (0, _objectSpread2["default"])({}, state.operation, action.operation)
      });

    default:
      return state;
  }
}
});

var reducers = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
exports.operationReducer = exports.playerReducer = void 0;

var _player = interopRequireDefault(player_1);

var _operation = interopRequireDefault(operation_1);

function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  return {
    player: (0, _player["default"])(state.player, action),
    operation: (0, _operation["default"])(state.operation, action)
  };
}

var playerReducer = _player["default"];
exports.playerReducer = playerReducer;
var operationReducer = _operation["default"];
exports.operationReducer = operationReducer;
});

var Manager_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = interopRequireDefault(objectSpread);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);



var _reducers = interopRequireDefault(reducers);

var playerActions = interopRequireWildcard(player);

var videoActions = interopRequireWildcard(video);

var Manager =
/*#__PURE__*/
function () {
  function Manager(store) {
    (0, _classCallCheck2["default"])(this, Manager);
    this.store = store || (0, redux.createStore)(_reducers["default"]);
    this.video = null;
    this.rootElement = null;
  }

  (0, _createClass2["default"])(Manager, [{
    key: "getActions",
    value: function getActions() {
      var manager = this;
      var dispatch = this.store.dispatch;
      var actions = (0, _objectSpread2["default"])({}, playerActions, videoActions);

      function bindActionCreator(actionCreator) {
        return function bindAction() {
          // eslint-disable-next-line prefer-rest-params
          var action = actionCreator.apply(manager, arguments);

          if (typeof action !== 'undefined') {
            dispatch(action);
          }
        };
      }

      return Object.keys(actions).filter(function (key) {
        return typeof actions[key] === 'function';
      }).reduce(function (boundActions, key) {
        boundActions[key] = bindActionCreator(actions[key]);
        return boundActions;
      }, {});
    }
  }, {
    key: "getState",
    value: function getState() {
      return this.store.getState();
    } // subscribe state change

  }, {
    key: "subscribeToStateChange",
    value: function subscribeToStateChange(listener, getState) {
      if (!getState) {
        getState = this.getState.bind(this);
      }

      var prevState = getState();

      var handleChange = function handleChange() {
        var state = getState();

        if (state === prevState) {
          return;
        }

        var prevStateCopy = prevState;
        prevState = state;
        listener(state, prevStateCopy);
      };

      return this.store.subscribe(handleChange);
    } // subscribe to operation state change

  }, {
    key: "subscribeToOperationStateChange",
    value: function subscribeToOperationStateChange(listener) {
      var _this = this;

      return this.subscribeToStateChange(listener, function () {
        return _this.getState().operation;
      });
    } // subscribe to player state change

  }, {
    key: "subscribeToPlayerStateChange",
    value: function subscribeToPlayerStateChange(listener) {
      var _this2 = this;

      return this.subscribeToStateChange(listener, function () {
        return _this2.getState().player;
      });
    }
  }]);
  return Manager;
}();

exports["default"] = Manager;
});

var BigPlayButton_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  actions: _propTypes["default"].object,
  player: _propTypes["default"].object,
  position: _propTypes["default"].string,
  className: _propTypes["default"].string
};
var defaultProps = {
  position: 'left'
};

var BigPlayButton =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(BigPlayButton, _Component);

  function BigPlayButton(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, BigPlayButton);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BigPlayButton).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(BigPlayButton, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "handleClick",
    value: function handleClick() {
      var actions = this.props.actions;
      actions.play();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          player = _this$props.player,
          position = _this$props.position;
      return _react["default"].createElement("button", {
        className: (0, _classnames["default"])('video-react-big-play-button', "video-react-big-play-button-".concat(position), this.props.className, {
          'big-play-button-hide': player.hasStarted || !player.currentSrc
        }),
        type: "button",
        "aria-live": "polite",
        tabIndex: "0",
        onClick: this.handleClick
      }, _react["default"].createElement("span", {
        className: "video-react-control-text"
      }, "Play Video"));
    }
  }]);
  return BigPlayButton;
}(_react.Component);

exports["default"] = BigPlayButton;
BigPlayButton.propTypes = propTypes$1;
BigPlayButton.defaultProps = defaultProps;
BigPlayButton.displayName = 'BigPlayButton';
});

var LoadingSpinner_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = LoadingSpinner;

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

function LoadingSpinner(_ref) {
  var player = _ref.player,
      className = _ref.className;

  if (player.error) {
    return null;
  }

  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-loading-spinner', className)
  });
}

LoadingSpinner.propTypes = propTypes$1;
LoadingSpinner.displayName = 'LoadingSpinner';
});

var PosterImage_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  poster: _propTypes["default"].string,
  player: _propTypes["default"].object,
  actions: _propTypes["default"].object,
  className: _propTypes["default"].string
};

function PosterImage(_ref) {
  var poster = _ref.poster,
      player = _ref.player,
      actions = _ref.actions,
      className = _ref.className;

  if (!poster || player.hasStarted) {
    return null;
  }

  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-poster', className),
    style: {
      backgroundImage: "url(\"".concat(poster, "\")")
    },
    onClick: function onClick() {
      if (player.paused) {
        actions.play();
      }
    }
  });
}

PosterImage.propTypes = propTypes$1;
PosterImage.displayName = 'PosterImage';
var _default = PosterImage;
exports["default"] = _default;
});

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var arrayLikeToArray = _arrayLikeToArray;

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

var arrayWithoutHoles = _arrayWithoutHoles;

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

var iterableToArray = _iterableToArray;

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

var unsupportedIterableToArray = _unsupportedIterableToArray;

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var nonIterableSpread = _nonIterableSpread;

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

var toConsumableArray = _toConsumableArray;

var utils = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatTime = formatTime;
exports.isVideoChild = isVideoChild;
exports.mergeAndSortChildren = mergeAndSortChildren;
exports.deprecatedWarning = deprecatedWarning;
exports.throttle = throttle;
exports.mediaProperties = void 0;

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var _objectSpread2 = interopRequireDefault(objectSpread);

var _objectWithoutProperties2 = interopRequireDefault(objectWithoutProperties);

var _react = interopRequireDefault(react);

// NaN is the only value in javascript which is not equal to itself.
// eslint-disable-next-line no-self-compare
var isNaN = Number.isNaN || function (value) {
  return value !== value;
};
/**
 * @file format-time.js
 *
 * Format seconds as a time string, H:MM:SS or M:SS
 * Supplying a guide (in seconds) will force a number of leading zeros
 * to cover the length of the guide
 *
 * @param  {Number} seconds Number of seconds to be turned into a string
 * @param  {Number} guide   Number (in seconds) to model the string after
 * @return {String}         Time formatted as H:MM:SS or M:SS
 * @private
 * @function formatTime
 */


function formatTime() {
  var seconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var guide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : seconds;
  var s = Math.floor(seconds % 60);
  var m = Math.floor(seconds / 60 % 60);
  var h = Math.floor(seconds / 3600);
  var gm = Math.floor(guide / 60 % 60);
  var gh = Math.floor(guide / 3600); // handle invalid times

  if (isNaN(seconds) || seconds === Infinity) {
    // '-' is false for all relational operators (e.g. <, >=) so this setting
    // will add the minimum number of fields specified by the guide
    h = '-';
    m = '-';
    s = '-';
  } // Check if we need to show hours


  h = h > 0 || gh > 0 ? "".concat(h, ":") : ''; // If hours are showing, we may need to add a leading zero.
  // Always show at least one digit of minutes.

  m = "".concat((h || gm >= 10) && m < 10 ? "0".concat(m) : m, ":"); // Check if leading zero is need for seconds

  s = s < 10 ? "0".concat(s) : s;
  return h + m + s;
} // Check if the element belongs to a video element
// only accept <source />, <track />,
// <MyComponent isVideoChild />
// elements


function isVideoChild(c) {
  if (c.props && c.props.isVideoChild) {
    return true;
  }

  return c.type === 'source' || c.type === 'track';
}

var find = function find(elements, func) {
  return elements.filter(func)[0];
}; // check if two components are the same type


var isTypeEqual = function isTypeEqual(component1, component2) {
  var type1 = component1.type;
  var type2 = component2.type;

  if (typeof type1 === 'string' || typeof type2 === 'string') {
    return type1 === type2;
  }

  if (typeof type1 === 'function' && typeof type2 === 'function') {
    return type1.displayName === type2.displayName;
  }

  return false;
}; // merge default children
// sort them by `order` property
// filter them by `disabled` property


function mergeAndSortChildren(defaultChildren, _children, _parentProps) {
  var defaultOrder = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  var children = _react["default"].Children.toArray(_children);

  var order = _parentProps.order,
      parentProps = (0, _objectWithoutProperties2["default"])(_parentProps, ["order"]); // ignore order from parent

  return children.filter(function (e) {
    return !e.props.disabled;
  }) // filter the disabled components
  .concat(defaultChildren.filter(function (c) {
    return !find(children, function (component) {
      return isTypeEqual(component, c);
    });
  })).map(function (element) {
    var defaultComponent = find(defaultChildren, function (c) {
      return isTypeEqual(c, element);
    });
    var defaultProps = defaultComponent ? defaultComponent.props : {};
    var props = (0, _objectSpread2["default"])({}, parentProps, defaultProps, element.props);

    var e = _react["default"].cloneElement(element, props, element.props.children);

    return e;
  }).sort(function (a, b) {
    return (a.props.order || defaultOrder) - (b.props.order || defaultOrder);
  });
}
/**
 * Temporary utility for generating the warnings
 */


function deprecatedWarning(oldMethodCall, newMethodCall) {
  // eslint-disable-next-line no-console
  console.warn("WARNING: ".concat(oldMethodCall, " will be deprecated soon! Please use ").concat(newMethodCall, " instead."));
}

function throttle(callback, limit) {
  var _arguments = arguments;
  var wait = false;
  return function () {
    if (!wait) {
      // eslint-disable-next-line prefer-rest-params
      callback.apply(void 0, (0, _toConsumableArray2["default"])(_arguments));
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  };
}

var mediaProperties = ['error', 'src', 'srcObject', 'currentSrc', 'crossOrigin', 'networkState', 'preload', 'buffered', 'readyState', 'seeking', 'currentTime', 'duration', 'paused', 'defaultPlaybackRate', 'playbackRate', 'played', 'seekable', 'ended', 'autoplay', 'loop', 'mediaGroup', 'controller', 'controls', 'volume', 'muted', 'defaultMuted', 'audioTracks', 'videoTracks', 'textTracks', 'width', 'height', 'videoWidth', 'videoHeight', 'poster'];
exports.mediaProperties = mediaProperties;
});

var Video_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = interopRequireDefault(objectSpread);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);



var propTypes$1 = {
  actions: _propTypes["default"].object,
  player: _propTypes["default"].object,
  children: _propTypes["default"].any,
  startTime: _propTypes["default"].number,
  loop: _propTypes["default"].bool,
  muted: _propTypes["default"].bool,
  autoPlay: _propTypes["default"].bool,
  playsInline: _propTypes["default"].bool,
  src: _propTypes["default"].string,
  poster: _propTypes["default"].string,
  className: _propTypes["default"].string,
  preload: _propTypes["default"].oneOf(['auto', 'metadata', 'none']),
  crossOrigin: _propTypes["default"].string,
  onLoadStart: _propTypes["default"].func,
  onWaiting: _propTypes["default"].func,
  onCanPlay: _propTypes["default"].func,
  onCanPlayThrough: _propTypes["default"].func,
  onPlaying: _propTypes["default"].func,
  onEnded: _propTypes["default"].func,
  onSeeking: _propTypes["default"].func,
  onSeeked: _propTypes["default"].func,
  onPlay: _propTypes["default"].func,
  onPause: _propTypes["default"].func,
  onProgress: _propTypes["default"].func,
  onDurationChange: _propTypes["default"].func,
  onError: _propTypes["default"].func,
  onSuspend: _propTypes["default"].func,
  onAbort: _propTypes["default"].func,
  onEmptied: _propTypes["default"].func,
  onStalled: _propTypes["default"].func,
  onLoadedMetadata: _propTypes["default"].func,
  onLoadedData: _propTypes["default"].func,
  onTimeUpdate: _propTypes["default"].func,
  onRateChange: _propTypes["default"].func,
  onVolumeChange: _propTypes["default"].func,
  onResize: _propTypes["default"].func
};

var Video =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Video, _Component);

  function Video(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Video);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Video).call(this, props));
    _this.video = null; // the html5 video

    _this.play = _this.play.bind((0, _assertThisInitialized2["default"])(_this));
    _this.pause = _this.pause.bind((0, _assertThisInitialized2["default"])(_this));
    _this.seek = _this.seek.bind((0, _assertThisInitialized2["default"])(_this));
    _this.forward = _this.forward.bind((0, _assertThisInitialized2["default"])(_this));
    _this.replay = _this.replay.bind((0, _assertThisInitialized2["default"])(_this));
    _this.toggleFullscreen = _this.toggleFullscreen.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getProperties = _this.getProperties.bind((0, _assertThisInitialized2["default"])(_this));
    _this.renderChildren = _this.renderChildren.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleLoadStart = _this.handleLoadStart.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleCanPlay = _this.handleCanPlay.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleCanPlayThrough = _this.handleCanPlayThrough.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handlePlay = _this.handlePlay.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handlePlaying = _this.handlePlaying.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handlePause = _this.handlePause.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleEnded = _this.handleEnded.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleWaiting = _this.handleWaiting.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleSeeking = _this.handleSeeking.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleSeeked = _this.handleSeeked.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFullscreenChange = _this.handleFullscreenChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleError = _this.handleError.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleSuspend = _this.handleSuspend.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleAbort = _this.handleAbort.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleEmptied = _this.handleEmptied.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleStalled = _this.handleStalled.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleLoadedMetaData = _this.handleLoadedMetaData.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleLoadedData = _this.handleLoadedData.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleTimeUpdate = _this.handleTimeUpdate.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleRateChange = _this.handleRateChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleVolumeChange = _this.handleVolumeChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleDurationChange = _this.handleDurationChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleProgress = (0, utils.throttle)(_this.handleProgress.bind((0, _assertThisInitialized2["default"])(_this)), 250);
    _this.handleKeypress = _this.handleKeypress.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(Video, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.forceUpdate(); // make sure the children can get the video property
    } // get all video properties

  }, {
    key: "getProperties",
    value: function getProperties() {
      var _this2 = this;

      if (!this.video) {
        return null;
      }

      return utils.mediaProperties.reduce(function (properties, key) {
        properties[key] = _this2.video[key];
        return properties;
      }, {});
    } // get playback rate

  }, {
    key: "play",
    // play the video
    value: function play() {
      var promise = this.video.play();

      if (promise !== undefined) {
        promise["catch"](function () {}).then(function () {});
      }
    } // pause the video

  }, {
    key: "pause",
    value: function pause() {
      var promise = this.video.pause();

      if (promise !== undefined) {
        promise["catch"](function () {}).then(function () {});
      }
    } // Change the video source and re-load the video:

  }, {
    key: "load",
    value: function load() {
      this.video.load();
    } // Add a new text track to the video

  }, {
    key: "addTextTrack",
    value: function addTextTrack() {
      var _this$video;

      (_this$video = this.video).addTextTrack.apply(_this$video, arguments);
    } // Check if your browser can play different types of video:

  }, {
    key: "canPlayType",
    value: function canPlayType() {
      var _this$video2;

      (_this$video2 = this.video).canPlayType.apply(_this$video2, arguments);
    } // toggle play

  }, {
    key: "togglePlay",
    value: function togglePlay() {
      if (this.video.paused) {
        this.play();
      } else {
        this.pause();
      }
    } // seek video by time

  }, {
    key: "seek",
    value: function seek(time) {
      try {
        this.video.currentTime = time;
      } catch (e) {// console.log(e, 'Video is not ready.')
      }
    } // jump forward x seconds

  }, {
    key: "forward",
    value: function forward(seconds) {
      this.seek(this.video.currentTime + seconds);
    } // jump back x seconds

  }, {
    key: "replay",
    value: function replay(seconds) {
      this.forward(-seconds);
    } // enter or exist full screen

  }, {
    key: "toggleFullscreen",
    value: function toggleFullscreen() {
      var _this$props = this.props,
          player = _this$props.player,
          actions = _this$props.actions;
      actions.toggleFullscreen(player);
    } // Fired when the user agent
    // begins looking for media data

  }, {
    key: "handleLoadStart",
    value: function handleLoadStart() {
      var _this$props2 = this.props,
          actions = _this$props2.actions,
          onLoadStart = _this$props2.onLoadStart;
      actions.handleLoadStart(this.getProperties());

      if (onLoadStart) {
        onLoadStart.apply(void 0, arguments);
      }
    } // A handler for events that
    // signal that waiting has ended

  }, {
    key: "handleCanPlay",
    value: function handleCanPlay() {
      var _this$props3 = this.props,
          actions = _this$props3.actions,
          onCanPlay = _this$props3.onCanPlay;
      actions.handleCanPlay(this.getProperties());

      if (onCanPlay) {
        onCanPlay.apply(void 0, arguments);
      }
    } // A handler for events that
    // signal that waiting has ended

  }, {
    key: "handleCanPlayThrough",
    value: function handleCanPlayThrough() {
      var _this$props4 = this.props,
          actions = _this$props4.actions,
          onCanPlayThrough = _this$props4.onCanPlayThrough;
      actions.handleCanPlayThrough(this.getProperties());

      if (onCanPlayThrough) {
        onCanPlayThrough.apply(void 0, arguments);
      }
    } // A handler for events that
    // signal that waiting has ended

  }, {
    key: "handlePlaying",
    value: function handlePlaying() {
      var _this$props5 = this.props,
          actions = _this$props5.actions,
          onPlaying = _this$props5.onPlaying;
      actions.handlePlaying(this.getProperties());

      if (onPlaying) {
        onPlaying.apply(void 0, arguments);
      }
    } // Fired whenever the media has been started

  }, {
    key: "handlePlay",
    value: function handlePlay() {
      var _this$props6 = this.props,
          actions = _this$props6.actions,
          onPlay = _this$props6.onPlay;
      actions.handlePlay(this.getProperties());

      if (onPlay) {
        onPlay.apply(void 0, arguments);
      }
    } // Fired whenever the media has been paused

  }, {
    key: "handlePause",
    value: function handlePause() {
      var _this$props7 = this.props,
          actions = _this$props7.actions,
          onPause = _this$props7.onPause;
      actions.handlePause(this.getProperties());

      if (onPause) {
        onPause.apply(void 0, arguments);
      }
    } // Fired when the duration of
    // the media resource is first known or changed

  }, {
    key: "handleDurationChange",
    value: function handleDurationChange() {
      var _this$props8 = this.props,
          actions = _this$props8.actions,
          onDurationChange = _this$props8.onDurationChange;
      actions.handleDurationChange(this.getProperties());

      if (onDurationChange) {
        onDurationChange.apply(void 0, arguments);
      }
    } // Fired while the user agent
    // is downloading media data

  }, {
    key: "handleProgress",
    value: function handleProgress() {
      var _this$props9 = this.props,
          actions = _this$props9.actions,
          onProgress = _this$props9.onProgress;

      if (this.video) {
        actions.handleProgressChange(this.getProperties());
      }

      if (onProgress) {
        onProgress.apply(void 0, arguments);
      }
    } // Fired when the end of the media resource
    // is reached (currentTime == duration)

  }, {
    key: "handleEnded",
    value: function handleEnded() {
      var _this$props10 = this.props,
          loop = _this$props10.loop,
          player = _this$props10.player,
          actions = _this$props10.actions,
          onEnded = _this$props10.onEnded;

      if (loop) {
        this.seek(0);
        this.play();
      } else if (!player.paused) {
        this.pause();
      }

      actions.handleEnd(this.getProperties());

      if (onEnded) {
        onEnded.apply(void 0, arguments);
      }
    } // Fired whenever the media begins waiting

  }, {
    key: "handleWaiting",
    value: function handleWaiting() {
      var _this$props11 = this.props,
          actions = _this$props11.actions,
          onWaiting = _this$props11.onWaiting;
      actions.handleWaiting(this.getProperties());

      if (onWaiting) {
        onWaiting.apply(void 0, arguments);
      }
    } // Fired whenever the player
    // is jumping to a new time

  }, {
    key: "handleSeeking",
    value: function handleSeeking() {
      var _this$props12 = this.props,
          actions = _this$props12.actions,
          onSeeking = _this$props12.onSeeking;
      actions.handleSeeking(this.getProperties());

      if (onSeeking) {
        onSeeking.apply(void 0, arguments);
      }
    } // Fired when the player has
    // finished jumping to a new time

  }, {
    key: "handleSeeked",
    value: function handleSeeked() {
      var _this$props13 = this.props,
          actions = _this$props13.actions,
          onSeeked = _this$props13.onSeeked;
      actions.handleSeeked(this.getProperties());

      if (onSeeked) {
        onSeeked.apply(void 0, arguments);
      }
    } // Handle Fullscreen Change

  }, {
    key: "handleFullscreenChange",
    value: function handleFullscreenChange() {} // Fires when the browser is
    // intentionally not getting media data

  }, {
    key: "handleSuspend",
    value: function handleSuspend() {
      var _this$props14 = this.props,
          actions = _this$props14.actions,
          onSuspend = _this$props14.onSuspend;
      actions.handleSuspend(this.getProperties());

      if (onSuspend) {
        onSuspend.apply(void 0, arguments);
      }
    } // Fires when the loading of an audio/video is aborted

  }, {
    key: "handleAbort",
    value: function handleAbort() {
      var _this$props15 = this.props,
          actions = _this$props15.actions,
          onAbort = _this$props15.onAbort;
      actions.handleAbort(this.getProperties());

      if (onAbort) {
        onAbort.apply(void 0, arguments);
      }
    } // Fires when the current playlist is empty

  }, {
    key: "handleEmptied",
    value: function handleEmptied() {
      var _this$props16 = this.props,
          actions = _this$props16.actions,
          onEmptied = _this$props16.onEmptied;
      actions.handleEmptied(this.getProperties());

      if (onEmptied) {
        onEmptied.apply(void 0, arguments);
      }
    } // Fires when the browser is trying to
    // get media data, but data is not available

  }, {
    key: "handleStalled",
    value: function handleStalled() {
      var _this$props17 = this.props,
          actions = _this$props17.actions,
          onStalled = _this$props17.onStalled;
      actions.handleStalled(this.getProperties());

      if (onStalled) {
        onStalled.apply(void 0, arguments);
      }
    } // Fires when the browser has loaded
    // meta data for the audio/video

  }, {
    key: "handleLoadedMetaData",
    value: function handleLoadedMetaData() {
      var _this$props18 = this.props,
          actions = _this$props18.actions,
          onLoadedMetadata = _this$props18.onLoadedMetadata,
          startTime = _this$props18.startTime;

      if (startTime && startTime > 0) {
        this.video.currentTime = startTime;
      }

      actions.handleLoadedMetaData(this.getProperties());

      if (onLoadedMetadata) {
        onLoadedMetadata.apply(void 0, arguments);
      }
    } // Fires when the browser has loaded
    // the current frame of the audio/video

  }, {
    key: "handleLoadedData",
    value: function handleLoadedData() {
      var _this$props19 = this.props,
          actions = _this$props19.actions,
          onLoadedData = _this$props19.onLoadedData;
      actions.handleLoadedData(this.getProperties());

      if (onLoadedData) {
        onLoadedData.apply(void 0, arguments);
      }
    } // Fires when the current
    // playback position has changed

  }, {
    key: "handleTimeUpdate",
    value: function handleTimeUpdate() {
      var _this$props20 = this.props,
          actions = _this$props20.actions,
          onTimeUpdate = _this$props20.onTimeUpdate;
      actions.handleTimeUpdate(this.getProperties());

      if (onTimeUpdate) {
        onTimeUpdate.apply(void 0, arguments);
      }
    }
    /**
     * Fires when the playing speed of the audio/video is changed
     */

  }, {
    key: "handleRateChange",
    value: function handleRateChange() {
      var _this$props21 = this.props,
          actions = _this$props21.actions,
          onRateChange = _this$props21.onRateChange;
      actions.handleRateChange(this.getProperties());

      if (onRateChange) {
        onRateChange.apply(void 0, arguments);
      }
    } // Fires when the volume has been changed

  }, {
    key: "handleVolumeChange",
    value: function handleVolumeChange() {
      var _this$props22 = this.props,
          actions = _this$props22.actions,
          onVolumeChange = _this$props22.onVolumeChange;
      actions.handleVolumeChange(this.getProperties());

      if (onVolumeChange) {
        onVolumeChange.apply(void 0, arguments);
      }
    } // Fires when an error occurred
    // during the loading of an audio/video

  }, {
    key: "handleError",
    value: function handleError() {
      var _this$props23 = this.props,
          actions = _this$props23.actions,
          onError = _this$props23.onError;
      actions.handleError(this.getProperties());

      if (onError) {
        onError.apply(void 0, arguments);
      }
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      var _this$props24 = this.props,
          actions = _this$props24.actions,
          onResize = _this$props24.onResize;
      actions.handleResize(this.getProperties());

      if (onResize) {
        onResize.apply(void 0, arguments);
      }
    }
  }, {
    key: "handleKeypress",
    value: function handleKeypress() {}
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      var _this3 = this;

      var props = (0, _objectSpread2["default"])({}, this.props, {
        video: this.video
      }); // to make sure the children can get video property

      if (!this.video) {
        return null;
      } // only keep <source />, <track />, <MyComponent isVideoChild /> elements


      return _react["default"].Children.toArray(this.props.children).filter(utils.isVideoChild).map(function (c) {
        var cprops;

        if (typeof c.type === 'string') {
          // add onError to <source />
          if (c.type === 'source') {
            cprops = (0, _objectSpread2["default"])({}, c.props);
            var preOnError = cprops.onError;

            cprops.onError = function () {
              if (preOnError) {
                preOnError.apply(void 0, arguments);
              }

              _this3.handleError.apply(_this3, arguments);
            };
          }
        } else {
          cprops = props;
        }

        return _react["default"].cloneElement(c, cprops);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props25 = this.props,
          loop = _this$props25.loop,
          poster = _this$props25.poster,
          preload = _this$props25.preload,
          src = _this$props25.src,
          autoPlay = _this$props25.autoPlay,
          playsInline = _this$props25.playsInline,
          muted = _this$props25.muted,
          crossOrigin = _this$props25.crossOrigin,
          videoId = _this$props25.videoId;
      return _react["default"].createElement("video", {
        className: (0, _classnames["default"])('video-react-video', this.props.className),
        id: videoId,
        crossOrigin: crossOrigin,
        ref: function ref(c) {
          _this4.video = c;
        },
        muted: muted,
        preload: preload,
        loop: loop,
        playsInline: playsInline,
        autoPlay: autoPlay,
        poster: poster,
        src: src,
        onLoadStart: this.handleLoadStart,
        onWaiting: this.handleWaiting,
        onCanPlay: this.handleCanPlay,
        onCanPlayThrough: this.handleCanPlayThrough,
        onPlaying: this.handlePlaying,
        onEnded: this.handleEnded,
        onSeeking: this.handleSeeking,
        onSeeked: this.handleSeeked,
        onPlay: this.handlePlay,
        onPause: this.handlePause,
        onProgress: this.handleProgress,
        onDurationChange: this.handleDurationChange,
        onError: this.handleError,
        onSuspend: this.handleSuspend,
        onAbort: this.handleAbort,
        onEmptied: this.handleEmptied,
        onStalled: this.handleStalled,
        onLoadedMetadata: this.handleLoadedMetaData,
        onLoadedData: this.handleLoadedData,
        onTimeUpdate: this.handleTimeUpdate,
        onRateChange: this.handleRateChange,
        onVolumeChange: this.handleVolumeChange,
        tabIndex: "-1"
      }, this.renderChildren());
    }
  }, {
    key: "playbackRate",
    get: function get() {
      return this.video.playbackRate;
    } // set playback rate
    // speed of video
    ,
    set: function set(rate) {
      this.video.playbackRate = rate;
    }
  }, {
    key: "muted",
    get: function get() {
      return this.video.muted;
    },
    set: function set(val) {
      this.video.muted = val;
    }
  }, {
    key: "volume",
    get: function get() {
      return this.video.volume;
    },
    set: function set(val) {
      if (val > 1) {
        val = 1;
      }

      if (val < 0) {
        val = 0;
      }

      this.video.volume = val;
    } // video width

  }, {
    key: "videoWidth",
    get: function get() {
      return this.video.videoWidth;
    } // video height

  }, {
    key: "videoHeight",
    get: function get() {
      return this.video.videoHeight;
    }
  }]);
  return Video;
}(_react.Component);

exports["default"] = Video;
Video.propTypes = propTypes$1;
Video.displayName = 'Video';
});

var Bezel_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  manager: _propTypes["default"].object,
  className: _propTypes["default"].string
};

var Bezel =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Bezel, _Component);

  function Bezel(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, Bezel);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Bezel).call(this, props, context));
    _this.timer = null;
    props.manager.subscribeToOperationStateChange(_this.handleStateChange.bind((0, _assertThisInitialized2["default"])(_this)));
    _this.state = {
      hidden: true,
      operation: {}
    };
    return _this;
  }

  (0, _createClass2["default"])(Bezel, [{
    key: "handleStateChange",
    value: function handleStateChange(state, prevState) {
      var _this2 = this;

      if (state.count !== prevState.count && state.operation.source === 'shortcut') {
        if (this.timer) {
          // previous animation is not finished
          clearTimeout(this.timer); // cancel it

          this.timer = null;
        } // show it
        // update operation


        this.setState({
          hidden: false,
          count: state.count,
          operation: state.operation
        }); // hide it after 0.5s

        this.timer = setTimeout(function () {
          _this2.setState({
            hidden: true
          });

          _this2.timer = null;
        }, 500);
      }
    }
  }, {
    key: "render",
    value: function render() {
      // only displays for shortcut so far
      if (this.state.operation.source !== 'shortcut') {
        return null;
      }

      var style = this.state.hidden ? {
        display: 'none'
      } : null;
      return _react["default"].createElement("div", {
        className: (0, _classnames["default"])({
          'video-react-bezel': true,
          'video-react-bezel-animation': this.state.count % 2 === 0,
          'video-react-bezel-animation-alt': this.state.count % 2 === 1
        }, this.props.className),
        style: style,
        role: "status",
        "aria-label": this.state.operation.action
      }, _react["default"].createElement("div", {
        className: (0, _classnames["default"])('video-react-bezel-icon', "video-react-bezel-icon-".concat(this.state.operation.action))
      }));
    }
  }]);
  return Bezel;
}(_react.Component);

exports["default"] = Bezel;
Bezel.propTypes = propTypes$1;
Bezel.displayName = 'Bezel';
});

var dom = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findElPosition = findElPosition;
exports.getPointerPosition = getPointerPosition;
exports.blurNode = blurNode;
exports.focusNode = focusNode;
exports.hasClass = hasClass;



/**
 * Offset Left
 * getBoundingClientRect technique from
 * John Resig http://ejohn.org/blog/getboundingclientrect-is-awesome/
 *
 * @function findElPosition
 * @param {Element} el Element from which to get offset
 * @return {Object}
 */
function findElPosition(el) {
  var box;

  if (el.getBoundingClientRect && el.parentNode) {
    box = el.getBoundingClientRect();
  }

  if (!box) {
    return {
      left: 0,
      top: 0
    };
  }

  var _document = document,
      body = _document.body,
      docEl = _document.documentElement;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;
  var scrollLeft = window.pageXOffset || body.scrollLeft;
  var left = box.left + scrollLeft - clientLeft;
  var clientTop = docEl.clientTop || body.clientTop || 0;
  var scrollTop = window.pageYOffset || body.scrollTop;
  var top = box.top + scrollTop - clientTop; // Android sometimes returns slightly off decimal values, so need to round

  return {
    left: Math.round(left),
    top: Math.round(top)
  };
}
/**
 * Get pointer position in element
 * Returns an object with x and y coordinates.
 * The base on the coordinates are the bottom left of the element.
 *
 * @function getPointerPosition
 * @param {Element} el Element on which to get the pointer position on
 * @param {Event} event Event object
 * @return {Object} This object will have x and y coordinates corresponding to the mouse position
 */


function getPointerPosition(el, event) {
  var position = {};
  var box = findElPosition(el);
  var boxW = el.offsetWidth;
  var boxH = el.offsetHeight;
  var boxY = box.top;
  var boxX = box.left;
  var evtPageY = event.pageY;
  var evtPageX = event.pageX;

  if (event.changedTouches) {
    evtPageX = event.changedTouches[0].pageX;
    evtPageY = event.changedTouches[0].pageY;
  }

  position.y = Math.max(0, Math.min(1, (boxY - evtPageY + boxH) / boxH));
  position.x = Math.max(0, Math.min(1, (evtPageX - boxX) / boxW));
  return position;
} // blur an element


function blurNode(reactNode) {
  var domNode = (0, reactDom.findDOMNode)(reactNode);

  if (domNode && domNode.blur) {
    domNode.blur();
  }
} // focus an element


function focusNode(reactNode) {
  var domNode = (0, reactDom.findDOMNode)(reactNode);

  if (domNode && domNode.focus) {
    domNode.focus();
  }
} // check if an element has a class name


function hasClass(elm, cls) {
  var classes = elm.className.split(' ');

  for (var i = 0; i < classes.length; i++) {
    if (classes[i].toLowerCase() === cls.toLowerCase()) {
      return true;
    }
  }

  return false;
}
});

var Shortcut_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = interopRequireDefault(defineProperty);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);



var _propTypes = interopRequireDefault(propTypes);



var propTypes$1 = {
  clickable: _propTypes["default"].bool,
  dblclickable: _propTypes["default"].bool,
  manager: _propTypes["default"].object,
  actions: _propTypes["default"].object,
  player: _propTypes["default"].object,
  shortcuts: _propTypes["default"].array
};
var defaultProps = {
  clickable: true,
  dblclickable: true
};

var Shortcut =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Shortcut, _Component);

  function Shortcut(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, Shortcut);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Shortcut).call(this, props, context));
    _this.defaultShortcuts = [{
      keyCode: 32,
      // spacebar
      handle: _this.togglePlay
    }, {
      keyCode: 75,
      // k
      handle: _this.togglePlay
    }, {
      keyCode: 70,
      // f
      handle: _this.toggleFullscreen
    }, {
      keyCode: 37,
      // Left arrow
      handle: function handle(player, actions) {
        if (!player.hasStarted) {
          return;
        }

        actions.replay(5, {
          action: 'replay-5',
          source: 'shortcut'
        }); // Go back 5 seconds
      }
    }, {
      keyCode: 74,
      // j
      handle: function handle(player, actions) {
        if (!player.hasStarted) {
          return;
        }

        actions.replay(10, {
          action: 'replay-10',
          source: 'shortcut'
        }); // Go back 10 seconds
      }
    }, {
      keyCode: 39,
      // Right arrow
      handle: function handle(player, actions) {
        if (!player.hasStarted) {
          return;
        }

        actions.forward(5, {
          action: 'forward-5',
          source: 'shortcut'
        }); // Go forward 5 seconds
      }
    }, {
      keyCode: 76,
      // l
      handle: function handle(player, actions) {
        if (!player.hasStarted) {
          return;
        }

        actions.forward(10, {
          action: 'forward-10',
          source: 'shortcut'
        }); // Go forward 10 seconds
      }
    }, {
      keyCode: 36,
      // Home
      handle: function handle(player, actions) {
        if (!player.hasStarted) {
          return;
        }

        actions.seek(0); // Go to beginning of video
      }
    }, {
      keyCode: 35,
      // End
      handle: function handle(player, actions) {
        if (!player.hasStarted) {
          return;
        } // Go to end of video


        actions.seek(player.duration);
      }
    }, {
      keyCode: 38,
      // Up arrow
      handle: function handle(player, actions) {
        // Increase volume 5%
        var v = player.volume + 0.05;

        if (v > 1) {
          v = 1;
        }

        actions.changeVolume(v, {
          action: 'volume-up',
          source: 'shortcut'
        });
      }
    }, {
      keyCode: 40,
      // Down arrow
      handle: function handle(player, actions) {
        // Decrease volume 5%
        var v = player.volume - 0.05;

        if (v < 0) {
          v = 0;
        }

        var action = v > 0 ? 'volume-down' : 'volume-off';
        actions.changeVolume(v, {
          action: action,
          source: 'shortcut'
        });
      }
    }, {
      keyCode: 190,
      // Shift + >
      shift: true,
      handle: function handle(player, actions) {
        // Increase speed
        var playbackRate = player.playbackRate;

        if (playbackRate >= 1.5) {
          playbackRate = 2;
        } else if (playbackRate >= 1.25) {
          playbackRate = 1.5;
        } else if (playbackRate >= 1.0) {
          playbackRate = 1.25;
        } else if (playbackRate >= 0.5) {
          playbackRate = 1.0;
        } else if (playbackRate >= 0.25) {
          playbackRate = 0.5;
        } else if (playbackRate >= 0) {
          playbackRate = 0.25;
        }

        actions.changeRate(playbackRate, {
          action: 'fast-forward',
          source: 'shortcut'
        });
      }
    }, {
      keyCode: 188,
      // Shift + <
      shift: true,
      handle: function handle(player, actions) {
        // Decrease speed
        var playbackRate = player.playbackRate;

        if (playbackRate <= 0.5) {
          playbackRate = 0.25;
        } else if (playbackRate <= 1.0) {
          playbackRate = 0.5;
        } else if (playbackRate <= 1.25) {
          playbackRate = 1.0;
        } else if (playbackRate <= 1.5) {
          playbackRate = 1.25;
        } else if (playbackRate <= 2) {
          playbackRate = 1.5;
        }

        actions.changeRate(playbackRate, {
          action: 'fast-rewind',
          source: 'shortcut'
        });
      }
    }];
    _this.shortcuts = (0, _toConsumableArray2["default"])(_this.defaultShortcuts);
    _this.mergeShortcuts = _this.mergeShortcuts.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleKeyPress = _this.handleKeyPress.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleDoubleClick = _this.handleDoubleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(Shortcut, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mergeShortcuts();
      document.addEventListener('keydown', this.handleKeyPress);
      document.addEventListener('click', this.handleClick);
      document.addEventListener('dblclick', this.handleDoubleClick);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.shortcuts !== this.props.shortcuts) {
        this.mergeShortcuts();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeyPress);
      document.removeEventListener('click', this.handleClick);
      document.removeEventListener('dblclick', this.handleDoubleClick);
    } // merge the shortcuts from props

  }, {
    key: "mergeShortcuts",
    value: function mergeShortcuts() {
      var getShortcutKey = function getShortcutKey(_ref) {
        var _ref$keyCode = _ref.keyCode,
            keyCode = _ref$keyCode === void 0 ? 0 : _ref$keyCode,
            _ref$ctrl = _ref.ctrl,
            ctrl = _ref$ctrl === void 0 ? false : _ref$ctrl,
            _ref$shift = _ref.shift,
            shift = _ref$shift === void 0 ? false : _ref$shift,
            _ref$alt = _ref.alt,
            alt = _ref$alt === void 0 ? false : _ref$alt;
        return "".concat(keyCode, ":").concat(ctrl, ":").concat(shift, ":").concat(alt);
      };

      var defaultShortcuts = this.defaultShortcuts.reduce(function (shortcuts, shortcut) {
        return Object.assign(shortcuts, (0, _defineProperty2["default"])({}, getShortcutKey(shortcut), shortcut));
      }, {});
      var mergedShortcuts = (this.props.shortcuts || []).reduce(function (shortcuts, shortcut) {
        var keyCode = shortcut.keyCode,
            handle = shortcut.handle;

        if (keyCode && typeof handle === 'function') {
          return Object.assign(shortcuts, (0, _defineProperty2["default"])({}, getShortcutKey(shortcut), shortcut));
        }

        return shortcuts;
      }, defaultShortcuts);

      var gradeShortcut = function gradeShortcut(s) {
        var score = 0;
        var ps = ['ctrl', 'shift', 'alt'];
        ps.forEach(function (key) {
          if (s[key]) {
            score++;
          }
        });
        return score;
      };

      this.shortcuts = Object.keys(mergedShortcuts).map(function (key) {
        return mergedShortcuts[key];
      }).sort(function (a, b) {
        return gradeShortcut(b) - gradeShortcut(a);
      });
    }
  }, {
    key: "togglePlay",
    value: function togglePlay(player, actions) {
      if (player.paused) {
        actions.play({
          action: 'play',
          source: 'shortcut'
        });
      } else {
        actions.pause({
          action: 'pause',
          source: 'shortcut'
        });
      }
    }
  }, {
    key: "toggleFullscreen",
    value: function toggleFullscreen(player, actions) {
      actions.toggleFullscreen(player);
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(e) {
      var _this$props = this.props,
          player = _this$props.player,
          actions = _this$props.actions;

      if (!player.isActive) {
        return;
      }

      if (document.activeElement && ((0, dom.hasClass)(document.activeElement, 'video-react-control') || (0, dom.hasClass)(document.activeElement, 'video-react-menu-button-active') || // || hasClass(document.activeElement, 'video-react-slider')
      (0, dom.hasClass)(document.activeElement, 'video-react-big-play-button'))) {
        return;
      }

      var keyCode = e.keyCode || e.which;
      var ctrl = e.ctrlKey || e.metaKey;
      var shift = e.shiftKey;
      var alt = e.altKey;
      var shortcut = this.shortcuts.filter(function (s) {
        if (!s.keyCode || s.keyCode - keyCode !== 0) {
          return false;
        }

        if (s.ctrl !== undefined && s.ctrl !== ctrl || s.shift !== undefined && s.shift !== shift || s.alt !== undefined && s.alt !== alt) {
          return false;
        }

        return true;
      })[0];

      if (shortcut) {
        shortcut.handle(player, actions);
        e.preventDefault();
      }
    } // only if player is active and player is ready

  }, {
    key: "canBeClicked",
    value: function canBeClicked(player, e) {
      if (!player.isActive || e.target.nodeName !== 'VIDEO' || player.readyState !== 4) {
        return false;
      }

      return true;
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      var _this$props2 = this.props,
          player = _this$props2.player,
          actions = _this$props2.actions,
          clickable = _this$props2.clickable;

      if (!this.canBeClicked(player, e) || !clickable) {
        return;
      }

      this.togglePlay(player, actions); // e.preventDefault();
    }
  }, {
    key: "handleDoubleClick",
    value: function handleDoubleClick(e) {
      var _this$props3 = this.props,
          player = _this$props3.player,
          actions = _this$props3.actions,
          dblclickable = _this$props3.dblclickable;

      if (!this.canBeClicked(player, e) || !dblclickable) {
        return;
      }

      this.toggleFullscreen(player, actions); // e.preventDefault();
    } // this component dose not render anything
    // it's just for the key down event

  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);
  return Shortcut;
}(react.Component);

exports["default"] = Shortcut;
Shortcut.propTypes = propTypes$1;
Shortcut.defaultProps = defaultProps;
Shortcut.displayName = 'Shortcut';
});

var _extends_1 = createCommonjsModule(function (module) {
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;
});

var Slider_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);



var _classnames = interopRequireDefault(classnames);

var Dom = interopRequireWildcard(dom);

var propTypes$1 = {
  className: _propTypes["default"].string,
  onMouseDown: _propTypes["default"].func,
  onMouseMove: _propTypes["default"].func,
  stepForward: _propTypes["default"].func,
  stepBack: _propTypes["default"].func,
  sliderActive: _propTypes["default"].func,
  sliderInactive: _propTypes["default"].func,
  onMouseUp: _propTypes["default"].func,
  onFocus: _propTypes["default"].func,
  onBlur: _propTypes["default"].func,
  onClick: _propTypes["default"].func,
  getPercent: _propTypes["default"].func,
  vertical: _propTypes["default"].bool,
  children: _propTypes["default"].node,
  label: _propTypes["default"].string,
  valuenow: _propTypes["default"].string,
  valuetext: _propTypes["default"].string
};

var Slider =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Slider, _Component);

  function Slider(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, Slider);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Slider).call(this, props, context));
    _this.handleMouseDown = _this.handleMouseDown.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseMove = _this.handleMouseMove.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseUp = _this.handleMouseUp.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFocus = _this.handleFocus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleBlur = _this.handleBlur.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleKeyPress = _this.handleKeyPress.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepForward = _this.stepForward.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepBack = _this.stepBack.bind((0, _assertThisInitialized2["default"])(_this));
    _this.calculateDistance = _this.calculateDistance.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getProgress = _this.getProgress.bind((0, _assertThisInitialized2["default"])(_this));
    _this.renderChildren = _this.renderChildren.bind((0, _assertThisInitialized2["default"])(_this));
    _this.state = {
      active: false
    };
    return _this;
  }

  (0, _createClass2["default"])(Slider, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('mousemove', this.handleMouseMove, true);
      document.removeEventListener('mouseup', this.handleMouseUp, true);
      document.removeEventListener('touchmove', this.handleMouseMove, true);
      document.removeEventListener('touchend', this.handleMouseUp, true);
      document.removeEventListener('keydown', this.handleKeyPress, true);
    }
  }, {
    key: "getProgress",
    value: function getProgress() {
      var getPercent = this.props.getPercent;

      if (!getPercent) {
        return 0;
      }

      var progress = getPercent(); // Protect against no duration and other division issues

      if (typeof progress !== 'number' || progress < 0 || progress === Infinity) {
        progress = 0;
      }

      return progress;
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(event) {
      var onMouseDown = this.props.onMouseDown; // event.preventDefault();
      // event.stopPropagation();

      document.addEventListener('mousemove', this.handleMouseMove, true);
      document.addEventListener('mouseup', this.handleMouseUp, true);
      document.addEventListener('touchmove', this.handleMouseMove, true);
      document.addEventListener('touchend', this.handleMouseUp, true);
      this.setState({
        active: true
      });

      if (this.props.sliderActive) {
        this.props.sliderActive(event);
      }

      this.handleMouseMove(event);

      if (onMouseDown) {
        onMouseDown(event);
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      var onMouseMove = this.props.onMouseMove;

      if (onMouseMove) {
        onMouseMove(event);
      }
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(event) {
      var onMouseUp = this.props.onMouseUp;
      document.removeEventListener('mousemove', this.handleMouseMove, true);
      document.removeEventListener('mouseup', this.handleMouseUp, true);
      document.removeEventListener('touchmove', this.handleMouseMove, true);
      document.removeEventListener('touchend', this.handleMouseUp, true);
      this.setState({
        active: false
      });

      if (this.props.sliderInactive) {
        this.props.sliderInactive(event);
      }

      if (onMouseUp) {
        onMouseUp(event);
      }
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(e) {
      document.addEventListener('keydown', this.handleKeyPress, true);

      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      document.removeEventListener('keydown', this.handleKeyPress, true);

      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      event.preventDefault(); // event.stopPropagation();

      if (this.props.onClick) {
        this.props.onClick(event);
      }
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(event) {
      if (event.which === 37 || event.which === 40) {
        // Left and Down Arrows
        event.preventDefault();
        event.stopPropagation();
        this.stepBack();
      } else if (event.which === 38 || event.which === 39) {
        // Up and Right Arrows
        event.preventDefault();
        event.stopPropagation();
        this.stepForward();
      }
    }
  }, {
    key: "stepForward",
    value: function stepForward() {
      if (this.props.stepForward) {
        this.props.stepForward();
      }
    }
  }, {
    key: "stepBack",
    value: function stepBack() {
      if (this.props.stepBack) {
        this.props.stepBack();
      }
    }
  }, {
    key: "calculateDistance",
    value: function calculateDistance(event) {
      var node = (0, reactDom.findDOMNode)(this);
      var position = Dom.getPointerPosition(node, event);

      if (this.props.vertical) {
        return position.y;
      }

      return position.x;
    }
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      var progress = this.getProgress();
      var percentage = "".concat((progress * 100).toFixed(2), "%");
      return _react["default"].Children.map(this.props.children, function (child) {
        return _react["default"].cloneElement(child, {
          progress: progress,
          percentage: percentage
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          vertical = _this$props.vertical,
          label = _this$props.label,
          valuenow = _this$props.valuenow,
          valuetext = _this$props.valuetext;
      return _react["default"].createElement("div", {
        className: (0, _classnames["default"])(this.props.className, {
          'video-react-slider-vertical': vertical,
          'video-react-slider-horizontal': !vertical,
          'video-react-sliding': this.state.active
        }, 'video-react-slider'),
        tabIndex: "0",
        role: "slider",
        onMouseDown: this.handleMouseDown,
        onTouchStart: this.handleMouseDown,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onClick: this.handleClick,
        "aria-label": label || '',
        "aria-valuenow": valuenow || '',
        "aria-valuetext": valuetext || '',
        "aria-valuemin": 0,
        "aria-valuemax": 100
      }, this.renderChildren());
    }
  }]);
  return Slider;
}(_react.Component);

exports["default"] = Slider;
Slider.propTypes = propTypes$1;
Slider.displayName = 'Slider';
});

var PlayProgressBar_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PlayProgressBar;

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);



var propTypes$1 = {
  currentTime: _propTypes["default"].number,
  duration: _propTypes["default"].number,
  percentage: _propTypes["default"].string,
  className: _propTypes["default"].string
}; // Shows play progress

function PlayProgressBar(_ref) {
  var currentTime = _ref.currentTime,
      duration = _ref.duration,
      percentage = _ref.percentage,
      className = _ref.className;
  return _react["default"].createElement("div", {
    "data-current-time": (0, utils.formatTime)(currentTime, duration),
    className: (0, _classnames["default"])('video-react-play-progress video-react-slider-bar', className),
    style: {
      width: percentage
    }
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }, "Progress: ".concat(percentage)));
}

PlayProgressBar.propTypes = propTypes$1;
PlayProgressBar.displayName = 'PlayProgressBar';
});

var LoadProgressBar_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = LoadProgressBar;

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  duration: _propTypes["default"].number,
  buffered: _propTypes["default"].object,
  className: _propTypes["default"].string
}; // Shows load progress

function LoadProgressBar(_ref) {
  var buffered = _ref.buffered,
      duration = _ref.duration,
      className = _ref.className;

  if (!buffered || !buffered.length) {
    return null;
  }

  var bufferedEnd = buffered.end(buffered.length - 1);
  var style = {};

  if (bufferedEnd > duration) {
    bufferedEnd = duration;
  } // get the percent width of a time compared to the total end


  function percentify(time, end) {
    var percent = time / end || 0; // no NaN

    return "".concat((percent >= 1 ? 1 : percent) * 100, "%");
  } // the width of the progress bar


  style.width = percentify(bufferedEnd, duration);
  var parts = []; // add child elements to represent the individual buffered time ranges

  for (var i = 0; i < buffered.length; i++) {
    var start = buffered.start(i);
    var end = buffered.end(i); // set the percent based on the width of the progress bar (bufferedEnd)

    var part = _react["default"].createElement("div", {
      style: {
        left: percentify(start, bufferedEnd),
        width: percentify(end - start, bufferedEnd)
      },
      key: "part-".concat(i)
    });

    parts.push(part);
  }

  if (parts.length === 0) {
    parts = null;
  }

  return _react["default"].createElement("div", {
    style: style,
    className: (0, _classnames["default"])('video-react-load-progress', className)
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }, "Loaded: 0%"), parts);
}

LoadProgressBar.propTypes = propTypes$1;
LoadProgressBar.displayName = 'LoadProgressBar';
});

var MouseTimeDisplay_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);



function MouseTimeDisplay(_ref) {
  var duration = _ref.duration,
      mouseTime = _ref.mouseTime,
      className = _ref.className,
      text = _ref.text;

  if (!mouseTime.time) {
    return null;
  }

  var time = text || (0, utils.formatTime)(mouseTime.time, duration);
  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-mouse-display', className),
    style: {
      left: "".concat(mouseTime.position, "px")
    },
    "data-current-time": time
  });
}

MouseTimeDisplay.propTypes = {
  duration: _propTypes["default"].number,
  mouseTime: _propTypes["default"].object,
  className: _propTypes["default"].string
};
MouseTimeDisplay.displayName = 'MouseTimeDisplay';
var _default = MouseTimeDisplay;
exports["default"] = _default;
});

var SeekBar_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var _Slider = interopRequireDefault(Slider_1);

var _PlayProgressBar = interopRequireDefault(PlayProgressBar_1);

var _LoadProgressBar = interopRequireDefault(LoadProgressBar_1);

var _MouseTimeDisplay = interopRequireDefault(MouseTimeDisplay_1);



var propTypes$1 = {
  player: _propTypes["default"].object,
  mouseTime: _propTypes["default"].object,
  actions: _propTypes["default"].object,
  className: _propTypes["default"].string
};

var SeekBar =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(SeekBar, _Component);

  function SeekBar(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, SeekBar);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SeekBar).call(this, props, context));
    _this.getPercent = _this.getPercent.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getNewTime = _this.getNewTime.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepForward = _this.stepForward.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepBack = _this.stepBack.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseDown = _this.handleMouseDown.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseMove = _this.handleMouseMove.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseUp = _this.handleMouseUp.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(SeekBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {}
    /**
     * Get percentage of video played
     *
     * @return {Number} Percentage played
     * @method getPercent
     */

  }, {
    key: "getPercent",
    value: function getPercent() {
      var _this$props$player = this.props.player,
          currentTime = _this$props$player.currentTime,
          seekingTime = _this$props$player.seekingTime,
          duration = _this$props$player.duration;
      var time = seekingTime || currentTime;
      var percent = time / duration;
      return percent >= 1 ? 1 : percent;
    }
  }, {
    key: "getNewTime",
    value: function getNewTime(event) {
      var duration = this.props.player.duration;
      var distance = this.slider.calculateDistance(event);
      var newTime = distance * duration; // Don't let video end while scrubbing.

      return newTime === duration ? newTime - 0.1 : newTime;
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown() {}
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(event) {
      var actions = this.props.actions;
      var newTime = this.getNewTime(event); // Set new time (tell video to seek to new time)

      actions.seek(newTime);
      actions.handleEndSeeking(newTime);
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      var actions = this.props.actions;
      var newTime = this.getNewTime(event);
      actions.handleSeekingTime(newTime);
    }
  }, {
    key: "stepForward",
    value: function stepForward() {
      var actions = this.props.actions;
      actions.forward(5);
    }
  }, {
    key: "stepBack",
    value: function stepBack() {
      var actions = this.props.actions;
      actions.replay(5);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          _this$props$player2 = _this$props.player,
          currentTime = _this$props$player2.currentTime,
          seekingTime = _this$props$player2.seekingTime,
          duration = _this$props$player2.duration,
          buffered = _this$props$player2.buffered,
          mouseTime = _this$props.mouseTime;
      var time = seekingTime || currentTime;
      return _react["default"].createElement(_Slider["default"], {
        ref: function ref(input) {
          _this2.slider = input;
        },
        label: "video progress bar",
        className: (0, _classnames["default"])('video-react-progress-holder', this.props.className),
        valuenow: (this.getPercent() * 100).toFixed(2),
        valuetext: (0, utils.formatTime)(time, duration),
        onMouseDown: this.handleMouseDown,
        onMouseMove: this.handleMouseMove,
        onMouseUp: this.handleMouseUp,
        getPercent: this.getPercent,
        stepForward: this.stepForward,
        stepBack: this.stepBack
      }, _react["default"].createElement(_LoadProgressBar["default"], {
        buffered: buffered,
        currentTime: time,
        duration: duration
      }), _react["default"].createElement(_MouseTimeDisplay["default"], {
        duration: duration,
        mouseTime: mouseTime
      }), _react["default"].createElement(_PlayProgressBar["default"], {
        currentTime: time,
        duration: duration
      }));
    }
  }]);
  return SeekBar;
}(_react.Component);

exports["default"] = SeekBar;
SeekBar.propTypes = propTypes$1;
SeekBar.displayName = 'SeekBar';
});

var ProgressControl_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = interopRequireDefault(_extends_1);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);



var _classnames = interopRequireDefault(classnames);

var Dom = interopRequireWildcard(dom);

var _SeekBar = interopRequireDefault(SeekBar_1);

var propTypes$1 = {
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

var ProgressControl =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ProgressControl, _Component);

  function ProgressControl(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, ProgressControl);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ProgressControl).call(this, props, context));
    _this.state = {
      mouseTime: {
        time: null,
        position: 0
      }
    };
    _this.handleMouseMoveThrottle = _this.handleMouseMove.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ProgressControl, [{
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      if (!event.pageX) {
        return;
      }

      var duration = this.props.player.duration;
      var node = (0, reactDom.findDOMNode)(this.seekBar);
      var newTime = Dom.getPointerPosition(node, event).x * duration;
      var position = event.pageX - Dom.findElPosition(node).left;
      this.setState({
        mouseTime: {
          time: newTime,
          position: position
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var className = this.props.className;
      return _react["default"].createElement("div", {
        onMouseMove: this.handleMouseMoveThrottle,
        className: (0, _classnames["default"])('video-react-progress-control video-react-control', className)
      }, _react["default"].createElement(_SeekBar["default"], (0, _extends2["default"])({
        mouseTime: this.state.mouseTime,
        ref: function ref(c) {
          _this2.seekBar = c;
        }
      }, this.props)));
    }
  }]);
  return ProgressControl;
}(_react.Component);

exports["default"] = ProgressControl;
ProgressControl.propTypes = propTypes$1;
ProgressControl.displayName = 'ProgressControl';
});

var PlayToggle_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  actions: _propTypes["default"].object,
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

var PlayToggle =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(PlayToggle, _Component);

  function PlayToggle(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, PlayToggle);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PlayToggle).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(PlayToggle, [{
    key: "handleClick",
    value: function handleClick() {
      var _this$props = this.props,
          actions = _this$props.actions,
          player = _this$props.player;

      if (player.paused) {
        actions.play();
      } else {
        actions.pause();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          player = _this$props2.player,
          className = _this$props2.className;
      var controlText = player.paused ? 'Play' : 'Pause';
      return _react["default"].createElement("button", {
        ref: function ref(c) {
          _this2.button = c;
        },
        className: (0, _classnames["default"])(className, {
          'video-react-play-control': true,
          'video-react-control': true,
          'video-react-button': true,
          'video-react-paused': player.paused,
          'video-react-playing': !player.paused
        }),
        type: "button",
        tabIndex: "0",
        onClick: this.handleClick
      }, _react["default"].createElement("span", {
        className: "video-react-control-text"
      }, controlText));
    }
  }]);
  return PlayToggle;
}(_react.Component);

exports["default"] = PlayToggle;
PlayToggle.propTypes = propTypes$1;
PlayToggle.displayName = 'PlayToggle';
});

var ForwardReplayControl = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var propTypes$1 = {
  actions: _propTypes["default"].object,
  className: _propTypes["default"].string,
  seconds: _propTypes["default"].oneOf([5, 10, 30])
};
var defaultProps = {
  seconds: 10
};

var _default = function _default(mode) {
  var ForwardReplayControl =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(ForwardReplayControl, _Component);

    function ForwardReplayControl(props, context) {
      var _this;

      (0, _classCallCheck2["default"])(this, ForwardReplayControl);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ForwardReplayControl).call(this, props, context));
      _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
      return _this;
    }

    (0, _createClass2["default"])(ForwardReplayControl, [{
      key: "handleClick",
      value: function handleClick() {
        var _this$props = this.props,
            actions = _this$props.actions,
            seconds = _this$props.seconds; // Depends mode to implement different actions

        if (mode === 'forward') {
          actions.forward(seconds);
        } else {
          actions.replay(seconds);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props2 = this.props,
            seconds = _this$props2.seconds,
            className = _this$props2.className;
        var classNames = ['video-react-control', 'video-react-button', 'video-react-icon'];
        classNames.push("video-react-icon-".concat(mode, "-").concat(seconds), "video-react-".concat(mode, "-control"));

        if (className) {
          classNames.push(className);
        }

        return _react["default"].createElement("button", {
          ref: function ref(c) {
            _this2.button = c;
          },
          className: classNames.join(' '),
          type: "button",
          onClick: this.handleClick
        }, _react["default"].createElement("span", {
          className: "video-react-control-text"
        }, "".concat(mode, " ").concat(seconds, " seconds")));
      }
    }]);
    return ForwardReplayControl;
  }(_react.Component);

  ForwardReplayControl.propTypes = propTypes$1;
  ForwardReplayControl.defaultProps = defaultProps;
  return ForwardReplayControl;
};

exports["default"] = _default;
});

var ForwardControl_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ForwardReplayControl = interopRequireDefault(ForwardReplayControl);

// Pass mode into parent function
var ForwardControl = (0, _ForwardReplayControl["default"])('forward');
ForwardControl.displayName = 'ForwardControl';
var _default = ForwardControl;
exports["default"] = _default;
});

var ReplayControl_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ForwardReplayControl = interopRequireDefault(ForwardReplayControl);

// Pass mode into parent function
var ReplayControl = (0, _ForwardReplayControl["default"])('replay');
ReplayControl.displayName = 'ReplayControl';
var _default = ReplayControl;
exports["default"] = _default;
});

var FullscreenToggle_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  actions: _propTypes["default"].object,
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

var FullscreenToggle =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(FullscreenToggle, _Component);

  function FullscreenToggle(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, FullscreenToggle);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(FullscreenToggle).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(FullscreenToggle, [{
    key: "handleClick",
    value: function handleClick() {
      var _this$props = this.props,
          player = _this$props.player,
          actions = _this$props.actions;
      actions.toggleFullscreen(player);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          player = _this$props2.player,
          className = _this$props2.className;
      return _react["default"].createElement("button", {
        className: (0, _classnames["default"])(className, {
          'video-react-icon-fullscreen-exit': player.isFullscreen,
          'video-react-icon-fullscreen': !player.isFullscreen
        }, 'video-react-fullscreen-control video-react-control video-react-button video-react-icon'),
        ref: function ref(c) {
          _this2.button = c;
        },
        type: "button",
        tabIndex: "0",
        onClick: this.handleClick
      }, _react["default"].createElement("span", {
        className: "video-react-control-text"
      }, "Non-Fullscreen"));
    }
  }]);
  return FullscreenToggle;
}(_react.Component);

exports["default"] = FullscreenToggle;
FullscreenToggle.propTypes = propTypes$1;
FullscreenToggle.displayName = 'FullscreenToggle';
});

var RemainingTimeDisplay_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);



var propTypes$1 = {
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

function RemainingTimeDisplay(_ref) {
  var _ref$player = _ref.player,
      currentTime = _ref$player.currentTime,
      duration = _ref$player.duration,
      className = _ref.className;
  var remainingTime = duration - currentTime;
  var formattedTime = (0, utils.formatTime)(remainingTime);
  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-remaining-time video-react-time-control video-react-control', className)
  }, _react["default"].createElement("div", {
    className: "video-react-remaining-time-display",
    "aria-live": "off"
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }, "Remaining Time "), "-".concat(formattedTime)));
}

RemainingTimeDisplay.propTypes = propTypes$1;
RemainingTimeDisplay.displayName = 'RemainingTimeDisplay';
var _default = RemainingTimeDisplay;
exports["default"] = _default;
});

var CurrentTimeDisplay_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);



var propTypes$1 = {
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

function CurrentTimeDisplay(_ref) {
  var _ref$player = _ref.player,
      currentTime = _ref$player.currentTime,
      duration = _ref$player.duration,
      className = _ref.className;
  var formattedTime = (0, utils.formatTime)(currentTime, duration);
  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-current-time video-react-time-control video-react-control', className)
  }, _react["default"].createElement("div", {
    className: "video-react-current-time-display",
    "aria-live": "off"
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }, "Current Time "), formattedTime));
}

CurrentTimeDisplay.propTypes = propTypes$1;
CurrentTimeDisplay.displayName = 'CurrentTimeDisplay';
var _default = CurrentTimeDisplay;
exports["default"] = _default;
});

var DurationDisplay_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);



var propTypes$1 = {
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

function DurationDisplay(_ref) {
  var duration = _ref.player.duration,
      className = _ref.className;
  var formattedTime = (0, utils.formatTime)(duration);
  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])(className, 'video-react-duration video-react-time-control video-react-control')
  }, _react["default"].createElement("div", {
    className: "video-react-duration-display",
    "aria-live": "off"
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }, "Duration Time "), formattedTime));
}

DurationDisplay.propTypes = propTypes$1;
DurationDisplay.displayName = 'DurationDisplay';
var _default = DurationDisplay;
exports["default"] = _default;
});

var TimeDivider_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TimeDivider;

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  separator: _propTypes["default"].string,
  className: _propTypes["default"].string
};

function TimeDivider(_ref) {
  var separator = _ref.separator,
      className = _ref.className;
  var separatorText = separator || '/';
  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-time-control video-react-time-divider', className),
    dir: "ltr"
  }, _react["default"].createElement("div", null, _react["default"].createElement("span", null, separatorText)));
}

TimeDivider.propTypes = propTypes$1;
TimeDivider.displayName = 'TimeDivider';
});

var ClickableComponent_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = interopRequireDefault(_extends_1);

var _objectSpread2 = interopRequireDefault(objectSpread);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  tagName: _propTypes["default"].string,
  onClick: _propTypes["default"].func.isRequired,
  onFocus: _propTypes["default"].func,
  onBlur: _propTypes["default"].func,
  className: _propTypes["default"].string
};
var defaultProps = {
  tagName: 'div'
};

var ClickableComponent =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ClickableComponent, _Component);

  function ClickableComponent(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, ClickableComponent);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ClickableComponent).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFocus = _this.handleFocus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleBlur = _this.handleBlur.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleKeypress = _this.handleKeypress.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ClickableComponent, [{
    key: "handleKeypress",
    value: function handleKeypress(event) {
      // Support Space (32) or Enter (13) key operation to fire a click event
      if (event.which === 32 || event.which === 13) {
        event.preventDefault();
        this.handleClick(event);
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      var onClick = this.props.onClick;
      onClick(event);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(e) {
      document.addEventListener('keydown', this.handleKeypress);

      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      document.removeEventListener('keydown', this.handleKeypress);

      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var Tag = this.props.tagName;
      var props = (0, _objectSpread2["default"])({}, this.props);
      delete props.tagName;
      delete props.className;
      return _react["default"].createElement(Tag, (0, _extends2["default"])({
        className: (0, _classnames["default"])(this.props.className),
        role: "button",
        tabIndex: "0",
        onClick: this.handleClick,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur
      }, props));
    }
  }]);
  return ClickableComponent;
}(_react.Component);

exports["default"] = ClickableComponent;
ClickableComponent.propTypes = propTypes$1;
ClickableComponent.defaultProps = defaultProps;
ClickableComponent.displayName = 'ClickableComponent';
});

var Popup_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var propTypes$1 = {
  player: _propTypes["default"].object,
  children: _propTypes["default"].any
};

var Popup =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Popup, _Component);

  function Popup(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, Popup);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Popup).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(Popup, [{
    key: "handleClick",
    value: function handleClick(event) {
      event.preventDefault(); // event.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return _react["default"].createElement("div", {
        className: "video-react-menu",
        onClick: this.handleClick
      }, _react["default"].createElement("div", {
        className: "video-react-menu-content"
      }, children));
    }
  }]);
  return Popup;
}(_react.Component);

exports["default"] = Popup;
Popup.propTypes = propTypes$1;
Popup.displayName = 'Popup';
});

var PopupButton_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PopupButton;

var _extends2 = interopRequireDefault(_extends_1);

var _objectSpread2 = interopRequireDefault(objectSpread);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);

var _ClickableComponent = interopRequireDefault(ClickableComponent_1);

var _Popup = interopRequireDefault(Popup_1);

var propTypes$1 = {
  inline: _propTypes["default"].bool,
  onClick: _propTypes["default"].func.isRequired,
  onFocus: _propTypes["default"].func,
  onBlur: _propTypes["default"].func,
  className: _propTypes["default"].string
};
var defaultProps = {
  inline: true
};

function PopupButton(props) {
  var inline = props.inline,
      className = props.className;
  var ps = (0, _objectSpread2["default"])({}, props);
  delete ps.children;
  delete ps.inline;
  delete ps.className;
  return _react["default"].createElement(_ClickableComponent["default"], (0, _extends2["default"])({
    className: (0, _classnames["default"])(className, {
      'video-react-menu-button-inline': !!inline,
      'video-react-menu-button-popup': !inline
    }, 'video-react-control video-react-button video-react-menu-button')
  }, ps), _react["default"].createElement(_Popup["default"], props));
}

PopupButton.propTypes = propTypes$1;
PopupButton.defaultProps = defaultProps;
PopupButton.displayName = 'PopupButton';
});

var VolumeLevel_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireDefault(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  percentage: _propTypes["default"].string,
  vertical: _propTypes["default"].bool,
  className: _propTypes["default"].string
};
var defaultProps = {
  percentage: '100%',
  vertical: false
};

function VolumeLevel(_ref) {
  var percentage = _ref.percentage,
      vertical = _ref.vertical,
      className = _ref.className;
  var style = {};

  if (vertical) {
    style.height = percentage;
  } else {
    style.width = percentage;
  }

  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])(className, 'video-react-volume-level'),
    style: style
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }));
}

VolumeLevel.propTypes = propTypes$1;
VolumeLevel.defaultProps = defaultProps;
VolumeLevel.displayName = 'VolumeLevel';
var _default = VolumeLevel;
exports["default"] = _default;
});

var VolumeBar_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = interopRequireDefault(_extends_1);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var _Slider = interopRequireDefault(Slider_1);

var _VolumeLevel = interopRequireDefault(VolumeLevel_1);

var propTypes$1 = {
  actions: _propTypes["default"].object,
  player: _propTypes["default"].object,
  className: _propTypes["default"].string,
  onFocus: _propTypes["default"].func,
  onBlur: _propTypes["default"].func
};

var VolumeBar =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(VolumeBar, _Component);

  function VolumeBar(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, VolumeBar);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(VolumeBar).call(this, props, context));
    _this.state = {
      percentage: '0%'
    };
    _this.handleMouseMove = _this.handleMouseMove.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handlePercentageChange = _this.handlePercentageChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.checkMuted = _this.checkMuted.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getPercent = _this.getPercent.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepForward = _this.stepForward.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepBack = _this.stepBack.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFocus = _this.handleFocus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleBlur = _this.handleBlur.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(VolumeBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "getPercent",
    value: function getPercent() {
      var player = this.props.player;

      if (player.muted) {
        return 0;
      }

      return player.volume;
    }
  }, {
    key: "checkMuted",
    value: function checkMuted() {
      var _this$props = this.props,
          player = _this$props.player,
          actions = _this$props.actions;

      if (player.muted) {
        actions.mute(false);
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      var actions = this.props.actions;
      this.checkMuted();
      var distance = this.slider.calculateDistance(event);
      actions.changeVolume(distance);
    }
  }, {
    key: "stepForward",
    value: function stepForward() {
      var _this$props2 = this.props,
          player = _this$props2.player,
          actions = _this$props2.actions;
      this.checkMuted();
      actions.changeVolume(player.volume + 0.1);
    }
  }, {
    key: "stepBack",
    value: function stepBack() {
      var _this$props3 = this.props,
          player = _this$props3.player,
          actions = _this$props3.actions;
      this.checkMuted();
      actions.changeVolume(player.volume - 0.1);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(e) {
      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    }
  }, {
    key: "handlePercentageChange",
    value: function handlePercentageChange(percentage) {
      if (percentage !== this.state.percentage) {
        this.setState({
          percentage: percentage
        });
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      event.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props4 = this.props,
          player = _this$props4.player,
          className = _this$props4.className;
      var volume = (player.volume * 100).toFixed(2);
      return _react["default"].createElement(_Slider["default"], (0, _extends2["default"])({
        ref: function ref(c) {
          _this2.slider = c;
        },
        label: "volume level",
        valuenow: volume,
        valuetext: "".concat(volume, "%"),
        onMouseMove: this.handleMouseMove,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onClick: this.handleClick,
        sliderActive: this.handleFocus,
        sliderInactive: this.handleBlur,
        getPercent: this.getPercent,
        onPercentageChange: this.handlePercentageChange,
        stepForward: this.stepForward,
        stepBack: this.stepBack
      }, this.props, {
        className: (0, _classnames["default"])(className, 'video-react-volume-bar video-react-slider-bar')
      }), _react["default"].createElement(_VolumeLevel["default"], this.props));
    }
  }]);
  return VolumeBar;
}(_react.Component);

VolumeBar.propTypes = propTypes$1;
VolumeBar.displayName = 'VolumeBar';
var _default = VolumeBar;
exports["default"] = _default;
});

var VolumeMenuButton_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = interopRequireDefault(_extends_1);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var _PopupButton = interopRequireDefault(PopupButton_1);

var _VolumeBar = interopRequireDefault(VolumeBar_1);

var propTypes$1 = {
  player: _propTypes["default"].object,
  actions: _propTypes["default"].object,
  vertical: _propTypes["default"].bool,
  className: _propTypes["default"].string,
  alwaysShowVolume: _propTypes["default"].bool
};
var defaultProps = {
  vertical: false
};

var VolumeMenuButton =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(VolumeMenuButton, _Component);

  function VolumeMenuButton(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, VolumeMenuButton);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(VolumeMenuButton).call(this, props, context));
    _this.state = {
      active: false
    };
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFocus = _this.handleFocus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleBlur = _this.handleBlur.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(VolumeMenuButton, [{
    key: "handleClick",
    value: function handleClick() {
      var _this$props = this.props,
          player = _this$props.player,
          actions = _this$props.actions;
      actions.mute(!player.muted);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus() {
      this.setState({
        active: true
      });
    }
  }, {
    key: "handleBlur",
    value: function handleBlur() {
      this.setState({
        active: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          vertical = _this$props2.vertical,
          player = _this$props2.player,
          className = _this$props2.className;
      var inline = !vertical;
      var level = this.volumeLevel;
      return _react["default"].createElement(_PopupButton["default"], {
        className: (0, _classnames["default"])(className, {
          'video-react-volume-menu-button-vertical': vertical,
          'video-react-volume-menu-button-horizontal': !vertical,
          'video-react-vol-muted': player.muted,
          'video-react-vol-0': level === 0 && !player.muted,
          'video-react-vol-1': level === 1,
          'video-react-vol-2': level === 2,
          'video-react-vol-3': level === 3,
          'video-react-slider-active': this.props.alwaysShowVolume || this.state.active,
          'video-react-lock-showing': this.props.alwaysShowVolume || this.state.active
        }, 'video-react-volume-menu-button'),
        onClick: this.handleClick,
        inline: inline
      }, _react["default"].createElement(_VolumeBar["default"], (0, _extends2["default"])({
        onFocus: this.handleFocus,
        onBlur: this.handleBlur
      }, this.props)));
    }
  }, {
    key: "volumeLevel",
    get: function get() {
      var _this$props$player = this.props.player,
          volume = _this$props$player.volume,
          muted = _this$props$player.muted;
      var level = 3;

      if (volume === 0 || muted) {
        level = 0;
      } else if (volume < 0.33) {
        level = 1;
      } else if (volume < 0.67) {
        level = 2;
      }

      return level;
    }
  }]);
  return VolumeMenuButton;
}(_react.Component);

VolumeMenuButton.propTypes = propTypes$1;
VolumeMenuButton.defaultProps = defaultProps;
VolumeMenuButton.displayName = 'VolumeMenuButton';
var _default = VolumeMenuButton;
exports["default"] = _default;
});

var Menu_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var propTypes$1 = {
  children: _propTypes["default"].any
};

var Menu =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Menu, _Component);

  function Menu(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, Menu);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Menu).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(Menu, [{
    key: "handleClick",
    value: function handleClick(event) {
      event.preventDefault(); // event.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement("div", {
        className: "video-react-menu video-react-lock-showing",
        role: "presentation",
        onClick: this.handleClick
      }, _react["default"].createElement("ul", {
        className: "video-react-menu-content"
      }, this.props.children));
    }
  }]);
  return Menu;
}(_react.Component);

exports["default"] = Menu;
Menu.propTypes = propTypes$1;
Menu.displayName = 'Menu';
});

var MenuItem_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var propTypes$1 = {
  item: _propTypes["default"].object,
  index: _propTypes["default"].number,
  activateIndex: _propTypes["default"].number,
  onSelectItem: _propTypes["default"].func
};

var MenuItem =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(MenuItem, _Component);

  function MenuItem(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, MenuItem);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MenuItem).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(MenuItem, [{
    key: "handleClick",
    value: function handleClick() {
      var _this$props = this.props,
          index = _this$props.index,
          onSelectItem = _this$props.onSelectItem;
      onSelectItem(index);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          item = _this$props2.item,
          index = _this$props2.index,
          activateIndex = _this$props2.activateIndex;
      return _react["default"].createElement("li", {
        className: (0, _classnames["default"])({
          'video-react-menu-item': true,
          'video-react-selected': index === activateIndex
        }),
        role: "menuitem",
        onClick: this.handleClick
      }, item.label, _react["default"].createElement("span", {
        className: "video-react-control-text"
      }));
    }
  }]);
  return MenuItem;
}(_react.Component);

exports["default"] = MenuItem;
MenuItem.propTypes = propTypes$1;
MenuItem.displayName = 'MenuItem';
});

var MenuButton_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var _Menu = interopRequireDefault(Menu_1);

var _MenuItem = interopRequireDefault(MenuItem_1);

var _ClickableComponent = interopRequireDefault(ClickableComponent_1);

var propTypes$1 = {
  inline: _propTypes["default"].bool,
  items: _propTypes["default"].array,
  className: _propTypes["default"].string,
  onSelectItem: _propTypes["default"].func,
  children: _propTypes["default"].any,
  selectedIndex: _propTypes["default"].number
};

var MenuButton =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(MenuButton, _Component);

  function MenuButton(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, MenuButton);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MenuButton).call(this, props, context));
    _this.state = {
      active: false,
      activateIndex: props.selectedIndex || 0
    };
    _this.commitSelection = _this.commitSelection.bind((0, _assertThisInitialized2["default"])(_this));
    _this.activateMenuItem = _this.activateMenuItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.renderMenu = _this.renderMenu.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFocus = _this.handleFocus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleBlur = _this.handleBlur.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleUpArrow = _this.handleUpArrow.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleDownArrow = _this.handleDownArrow.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleEscape = _this.handleEscape.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleReturn = _this.handleReturn.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleTab = _this.handleTab.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleKeyPress = _this.handleKeyPress.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleSelectItem = _this.handleSelectItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleIndexChange = _this.handleIndexChange.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(MenuButton, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.selectedIndex !== this.props.selectedIndex) {
        this.activateMenuItem(this.props.selectedIndex);
      }
    }
  }, {
    key: "commitSelection",
    value: function commitSelection(index) {
      this.setState({
        activateIndex: index,
        active: false
      });
      this.handleIndexChange(index);
    }
  }, {
    key: "activateMenuItem",
    value: function activateMenuItem(index) {
      this.setState({
        activateIndex: index
      });
      this.handleIndexChange(index);
    }
  }, {
    key: "handleIndexChange",
    value: function handleIndexChange(index) {
      var onSelectItem = this.props.onSelectItem;
      onSelectItem(index);
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      this.setState(function (prevState) {
        return {
          active: !prevState.active
        };
      });
    }
  }, {
    key: "handleFocus",
    value: function handleFocus() {
      document.addEventListener('keydown', this.handleKeyPress);
    }
  }, {
    key: "handleBlur",
    value: function handleBlur() {
      this.setState({
        active: false
      });
      document.removeEventListener('keydown', this.handleKeyPress);
    }
  }, {
    key: "handleUpArrow",
    value: function handleUpArrow(e) {
      var items = this.props.items;

      if (this.state.active) {
        e.preventDefault();
        var newIndex = this.state.activateIndex - 1;

        if (newIndex < 0) {
          newIndex = items.length ? items.length - 1 : 0;
        }

        this.activateMenuItem(newIndex);
      }
    }
  }, {
    key: "handleDownArrow",
    value: function handleDownArrow(e) {
      var items = this.props.items;

      if (this.state.active) {
        e.preventDefault();
        var newIndex = this.state.activateIndex + 1;

        if (newIndex >= items.length) {
          newIndex = 0;
        }

        this.activateMenuItem(newIndex);
      }
    }
  }, {
    key: "handleTab",
    value: function handleTab(e) {
      if (this.state.active) {
        e.preventDefault();
        this.commitSelection(this.state.activateIndex);
      }
    }
  }, {
    key: "handleReturn",
    value: function handleReturn(e) {
      e.preventDefault();

      if (this.state.active) {
        this.commitSelection(this.state.activateIndex);
      } else {
        this.setState({
          active: true
        });
      }
    }
  }, {
    key: "handleEscape",
    value: function handleEscape() {
      this.setState({
        active: false,
        activateIndex: 0
      });
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(event) {
      // Escape (27) key
      if (event.which === 27) {
        this.handleEscape(event);
      } else if (event.which === 9) {
        // Tab (9) key
        this.handleTab(event);
      } else if (event.which === 13) {
        // Enter (13) key
        this.handleReturn(event);
      } else if (event.which === 38) {
        // Up (38) key
        this.handleUpArrow(event);
      } else if (event.which === 40) {
        // Down (40) key press
        this.handleDownArrow(event);
      }
    }
  }, {
    key: "handleSelectItem",
    value: function handleSelectItem(i) {
      this.commitSelection(i);
    }
  }, {
    key: "renderMenu",
    value: function renderMenu() {
      var _this2 = this;

      if (!this.state.active) {
        return null;
      }

      var items = this.props.items;
      return _react["default"].createElement(_Menu["default"], null, items.map(function (item, i) {
        return _react["default"].createElement(_MenuItem["default"], {
          item: item,
          index: i,
          onSelectItem: _this2.handleSelectItem,
          activateIndex: _this2.state.activateIndex,
          key: "item-".concat(i++)
        });
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          inline = _this$props.inline,
          className = _this$props.className;
      return _react["default"].createElement(_ClickableComponent["default"], {
        className: (0, _classnames["default"])(className, {
          'video-react-menu-button-inline': !!inline,
          'video-react-menu-button-popup': !inline,
          'video-react-menu-button-active': this.state.active
        }, 'video-react-control video-react-button video-react-menu-button'),
        role: "button",
        tabIndex: "0",
        ref: function ref(c) {
          _this3.menuButton = c;
        },
        onClick: this.handleClick,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur
      }, this.props.children, this.renderMenu());
    }
  }]);
  return MenuButton;
}(_react.Component);

exports["default"] = MenuButton;
MenuButton.propTypes = propTypes$1;
MenuButton.displayName = 'MenuButton';
});

var PlaybackRateMenuButton_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var _MenuButton = interopRequireDefault(MenuButton_1);

var propTypes$1 = {
  player: _propTypes["default"].object,
  actions: _propTypes["default"].object,
  rates: _propTypes["default"].array,
  className: _propTypes["default"].string
};
var defaultProps = {
  rates: [2, 1.5, 1.25, 1, 0.5, 0.25]
};

var PlaybackRateMenuButton =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(PlaybackRateMenuButton, _Component);

  function PlaybackRateMenuButton(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, PlaybackRateMenuButton);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PlaybackRateMenuButton).call(this, props, context));
    _this.handleSelectItem = _this.handleSelectItem.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(PlaybackRateMenuButton, [{
    key: "handleSelectItem",
    value: function handleSelectItem(index) {
      var _this$props = this.props,
          rates = _this$props.rates,
          actions = _this$props.actions;

      if (index >= 0 && index < rates.length) {
        actions.changeRate(rates[index]);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          rates = _this$props2.rates,
          player = _this$props2.player;
      var items = rates.map(function (rate) {
        return {
          label: "".concat(rate, "x"),
          value: rate
        };
      });
      var selectedIndex = rates.indexOf(player.playbackRate) || 0;
      return _react["default"].createElement(_MenuButton["default"], {
        className: (0, _classnames["default"])('video-react-playback-rate', this.props.className),
        onSelectItem: this.handleSelectItem,
        items: items,
        selectedIndex: selectedIndex
      }, _react["default"].createElement("span", {
        className: "video-react-control-text"
      }, "Playback Rate"), _react["default"].createElement("div", {
        className: "video-react-playback-rate-value"
      }, "".concat(player.playbackRate.toFixed(2), "x")));
    }
  }]);
  return PlaybackRateMenuButton;
}(_react.Component);

PlaybackRateMenuButton.propTypes = propTypes$1;
PlaybackRateMenuButton.defaultProps = defaultProps;
PlaybackRateMenuButton.displayName = 'PlaybackRateMenuButton';
var _default = PlaybackRateMenuButton;
exports["default"] = _default;
});

var ControlBar_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectWithoutProperties2 = interopRequireDefault(objectWithoutProperties);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var _ProgressControl = interopRequireDefault(ProgressControl_1);

var _PlayToggle = interopRequireDefault(PlayToggle_1);

var _ForwardControl = interopRequireDefault(ForwardControl_1);

var _ReplayControl = interopRequireDefault(ReplayControl_1);

var _FullscreenToggle = interopRequireDefault(FullscreenToggle_1);

var _RemainingTimeDisplay = interopRequireDefault(RemainingTimeDisplay_1);

var _CurrentTimeDisplay = interopRequireDefault(CurrentTimeDisplay_1);

var _DurationDisplay = interopRequireDefault(DurationDisplay_1);

var _TimeDivider = interopRequireDefault(TimeDivider_1);

var _VolumeMenuButton = interopRequireDefault(VolumeMenuButton_1);

var _PlaybackRateMenuButton = interopRequireDefault(PlaybackRateMenuButton_1);



var propTypes$1 = {
  children: _propTypes["default"].any,
  autoHide: _propTypes["default"].bool,
  autoHideTime: _propTypes["default"].number,
  // used in Player
  disableDefaultControls: _propTypes["default"].bool,
  disableCompletely: _propTypes["default"].bool,
  className: _propTypes["default"].string
};
var defaultProps = {
  autoHide: true,
  disableCompletely: false
};

var ControlBar =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ControlBar, _Component);

  function ControlBar(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ControlBar);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ControlBar).call(this, props));
    _this.getDefaultChildren = _this.getDefaultChildren.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getFullChildren = _this.getFullChildren.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ControlBar, [{
    key: "getDefaultChildren",
    value: function getDefaultChildren() {
      return [_react["default"].createElement(_PlayToggle["default"], {
        key: "play-toggle",
        order: 1
      }), _react["default"].createElement(_VolumeMenuButton["default"], {
        key: "volume-menu-button",
        order: 4
      }), _react["default"].createElement(_CurrentTimeDisplay["default"], {
        key: "current-time-display",
        order: 5.1
      }), _react["default"].createElement(_TimeDivider["default"], {
        key: "time-divider",
        order: 5.2
      }), _react["default"].createElement(_DurationDisplay["default"], {
        key: "duration-display",
        order: 5.3
      }), _react["default"].createElement(_ProgressControl["default"], {
        key: "progress-control",
        order: 6
      }), _react["default"].createElement(_FullscreenToggle["default"], {
        key: "fullscreen-toggle",
        order: 8
      })];
    }
  }, {
    key: "getFullChildren",
    value: function getFullChildren() {
      return [_react["default"].createElement(_PlayToggle["default"], {
        key: "play-toggle",
        order: 1
      }), _react["default"].createElement(_ReplayControl["default"], {
        key: "replay-control",
        order: 2
      }), _react["default"].createElement(_ForwardControl["default"], {
        key: "forward-control",
        order: 3
      }), _react["default"].createElement(_VolumeMenuButton["default"], {
        key: "volume-menu-button",
        order: 4
      }), _react["default"].createElement(_CurrentTimeDisplay["default"], {
        key: "current-time-display",
        order: 5
      }), _react["default"].createElement(_TimeDivider["default"], {
        key: "time-divider",
        order: 6
      }), _react["default"].createElement(_DurationDisplay["default"], {
        key: "duration-display",
        order: 7
      }), _react["default"].createElement(_ProgressControl["default"], {
        key: "progress-control",
        order: 8
      }), _react["default"].createElement(_RemainingTimeDisplay["default"], {
        key: "remaining-time-display",
        order: 9
      }), _react["default"].createElement(_PlaybackRateMenuButton["default"], {
        rates: [1, 1.25, 1.5, 2],
        key: "playback-rate",
        order: 10
      }), _react["default"].createElement(_FullscreenToggle["default"], {
        key: "fullscreen-toggle",
        order: 11
      })];
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      var children = _react["default"].Children.toArray(this.props.children);

      var defaultChildren = this.props.disableDefaultControls ? [] : this.getDefaultChildren();
      var _this$props = this.props,
          className = _this$props.className,
          parentProps = (0, _objectWithoutProperties2["default"])(_this$props, ["className"]); // remove className

      return (0, utils.mergeAndSortChildren)(defaultChildren, children, parentProps);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          autoHide = _this$props2.autoHide,
          className = _this$props2.className,
          disableCompletely = _this$props2.disableCompletely;
      var children = this.getChildren();
      return disableCompletely ? null : _react["default"].createElement("div", {
        className: (0, _classnames["default"])('video-react-control-bar', {
          'video-react-control-bar-auto-hide': autoHide
        }, className)
      }, children);
    }
  }]);
  return ControlBar;
}(_react.Component);

exports["default"] = ControlBar;
ControlBar.propTypes = propTypes$1;
ControlBar.defaultProps = defaultProps;
ControlBar.displayName = 'ControlBar';
});

var browser = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IS_IOS = exports.IS_IPOD = exports.IS_IPHONE = exports.IS_IPAD = void 0;
var USER_AGENT = typeof window !== 'undefined' && window.navigator ? window.navigator.userAgent : ''; // const webkitVersionMap = (/AppleWebKit\/([\d.]+)/i).exec(USER_AGENT);
// const appleWebkitVersion = webkitVersionMap ? parseFloat(webkitVersionMap.pop()) : null;

/*
 * Device is an iPhone
 *
 * @type {Boolean}
 * @constant
 * @private
 */

var IS_IPAD = /iPad/i.test(USER_AGENT); // The Facebook app's UIWebView identifies as both an iPhone and iPad, so
// to identify iPhones, we need to exclude iPads.
// http://artsy.github.io/blog/2012/10/18/the-perils-of-ios-user-agent-sniffing/

exports.IS_IPAD = IS_IPAD;
var IS_IPHONE = /iPhone/i.test(USER_AGENT) && !IS_IPAD;
exports.IS_IPHONE = IS_IPHONE;
var IS_IPOD = /iPod/i.test(USER_AGENT);
exports.IS_IPOD = IS_IPOD;
var IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD;
exports.IS_IOS = IS_IOS;
});

var Player_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = interopRequireDefault(objectSpread);

var _defineProperty2 = interopRequireDefault(defineProperty);

var _objectWithoutProperties2 = interopRequireDefault(objectWithoutProperties);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _inherits2 = interopRequireDefault(inherits);

var _propTypes = interopRequireDefault(propTypes);

var _react = interopRequireWildcard(react);

var _classnames = interopRequireDefault(classnames);

var _Manager = interopRequireDefault(Manager_1);

var _BigPlayButton = interopRequireDefault(BigPlayButton_1);

var _LoadingSpinner = interopRequireDefault(LoadingSpinner_1);

var _PosterImage = interopRequireDefault(PosterImage_1);

var _Video = interopRequireDefault(Video_1);

var _Bezel = interopRequireDefault(Bezel_1);

var _Shortcut = interopRequireDefault(Shortcut_1);

var _ControlBar = interopRequireDefault(ControlBar_1);

var browser$1 = interopRequireWildcard(browser);





var _fullscreen = interopRequireDefault(fullscreen);

var propTypes$1 = {
  children: _propTypes["default"].any,
  width: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  height: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  fluid: _propTypes["default"].bool,
  muted: _propTypes["default"].bool,
  playsInline: _propTypes["default"].bool,
  aspectRatio: _propTypes["default"].string,
  className: _propTypes["default"].string,
  videoId: _propTypes["default"].string,
  startTime: _propTypes["default"].number,
  loop: _propTypes["default"].bool,
  autoPlay: _propTypes["default"].bool,
  src: _propTypes["default"].string,
  poster: _propTypes["default"].string,
  preload: _propTypes["default"].oneOf(['auto', 'metadata', 'none']),
  onLoadStart: _propTypes["default"].func,
  onWaiting: _propTypes["default"].func,
  onCanPlay: _propTypes["default"].func,
  onCanPlayThrough: _propTypes["default"].func,
  onPlaying: _propTypes["default"].func,
  onEnded: _propTypes["default"].func,
  onSeeking: _propTypes["default"].func,
  onSeeked: _propTypes["default"].func,
  onPlay: _propTypes["default"].func,
  onPause: _propTypes["default"].func,
  onProgress: _propTypes["default"].func,
  onDurationChange: _propTypes["default"].func,
  onError: _propTypes["default"].func,
  onSuspend: _propTypes["default"].func,
  onAbort: _propTypes["default"].func,
  onEmptied: _propTypes["default"].func,
  onStalled: _propTypes["default"].func,
  onLoadedMetadata: _propTypes["default"].func,
  onLoadedData: _propTypes["default"].func,
  onTimeUpdate: _propTypes["default"].func,
  onRateChange: _propTypes["default"].func,
  onVolumeChange: _propTypes["default"].func,
  store: _propTypes["default"].object
};
var defaultProps = {
  fluid: true,
  muted: false,
  playsInline: false,
  preload: 'auto',
  aspectRatio: 'auto'
};

var Player =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Player, _Component);

  function Player(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Player);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Player).call(this, props));
    _this.controlsHideTimer = null;
    _this.video = null; // the Video component

    _this.manager = new _Manager["default"](props.store);
    _this.actions = _this.manager.getActions();

    _this.manager.subscribeToPlayerStateChange(_this.handleStateChange.bind((0, _assertThisInitialized2["default"])(_this)));

    _this.getStyle = _this.getStyle.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleResize = _this.handleResize.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getChildren = _this.getChildren.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseMove = (0, utils.throttle)(_this.handleMouseMove.bind((0, _assertThisInitialized2["default"])(_this)), 250);
    _this.handleMouseDown = _this.handleMouseDown.bind((0, _assertThisInitialized2["default"])(_this));
    _this.startControlsTimer = _this.startControlsTimer.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFullScreenChange = _this.handleFullScreenChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFocus = _this.handleFocus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleBlur = _this.handleBlur.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(Player, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);

      _fullscreen["default"].addEventListener(this.handleFullScreenChange);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // Remove event listener
      window.removeEventListener('resize', this.handleResize);

      _fullscreen["default"].removeEventListener(this.handleFullScreenChange);

      if (this.controlsHideTimer) {
        window.clearTimeout(this.controlsHideTimer);
      }
    }
  }, {
    key: "getDefaultChildren",
    value: function getDefaultChildren(originalChildren) {
      var _this2 = this;

      return [_react["default"].createElement(_Video["default"], {
        ref: function ref(c) {
          _this2.video = c;
          _this2.manager.video = _this2.video;
        },
        key: "video",
        order: 0.0
      }, originalChildren), _react["default"].createElement(_PosterImage["default"], {
        key: "poster-image",
        order: 1.0
      }), _react["default"].createElement(_LoadingSpinner["default"], {
        key: "loading-spinner",
        order: 2.0
      }), _react["default"].createElement(_Bezel["default"], {
        key: "bezel",
        order: 3.0
      }), _react["default"].createElement(_BigPlayButton["default"], {
        key: "big-play-button",
        order: 4.0
      }), _react["default"].createElement(_ControlBar["default"], {
        key: "control-bar",
        order: 5.0
      }), _react["default"].createElement(_Shortcut["default"], {
        key: "shortcut",
        order: 99.0
      })];
    }
  }, {
    key: "getChildren",
    value: function getChildren(props) {
      var _ = props.className,
          originalChildren = props.children,
          propsWithoutChildren = (0, _objectWithoutProperties2["default"])(props, ["className", "children"]);

      var children = _react["default"].Children.toArray(this.props.children).filter(function (e) {
        return !(0, utils.isVideoChild)(e);
      });

      var defaultChildren = this.getDefaultChildren(originalChildren);
      return (0, utils.mergeAndSortChildren)(defaultChildren, children, propsWithoutChildren);
    }
  }, {
    key: "setWidthOrHeight",
    value: function setWidthOrHeight(style, name, value) {
      var styleVal;

      if (typeof value === 'string') {
        if (value === 'auto') {
          styleVal = 'auto';
        } else if (value.match(/\d+%/)) {
          styleVal = value;
        }
      } else if (typeof value === 'number') {
        styleVal = "".concat(value, "px");
      }

      Object.assign(style, (0, _defineProperty2["default"])({}, name, styleVal));
    }
  }, {
    key: "getStyle",
    value: function getStyle() {
      var _this$props = this.props,
          fluid = _this$props.fluid,
          propsAspectRatio = _this$props.aspectRatio,
          propsHeight = _this$props.height,
          propsWidth = _this$props.width;

      var _this$manager$getStat = this.manager.getState(),
          player = _this$manager$getStat.player;

      var style = {};
      var width;
      var height;
      var aspectRatio; // The aspect ratio is either used directly or to calculate width and height.

      if (propsAspectRatio !== undefined && propsAspectRatio !== 'auto') {
        // Use any aspectRatio that's been specifically set
        aspectRatio = propsAspectRatio;
      } else if (player.videoWidth) {
        // Otherwise try to get the aspect ratio from the video metadata
        aspectRatio = "".concat(player.videoWidth, ":").concat(player.videoHeight);
      } else {
        // Or use a default. The video element's is 2:1, but 16:9 is more common.
        aspectRatio = '16:9';
      } // Get the ratio as a decimal we can use to calculate dimensions


      var ratioParts = aspectRatio.split(':');
      var ratioMultiplier = ratioParts[1] / ratioParts[0];

      if (propsWidth !== undefined) {
        // Use any width that's been specifically set
        width = propsWidth;
      } else if (propsHeight !== undefined) {
        // Or calulate the width from the aspect ratio if a height has been set
        width = propsHeight / ratioMultiplier;
      } else {
        // Or use the video's metadata, or use the video el's default of 300
        width = player.videoWidth || 400;
      }

      if (propsHeight !== undefined) {
        // Use any height that's been specifically set
        height = propsHeight;
      } else {
        // Otherwise calculate the height from the ratio and the width
        height = width * ratioMultiplier;
      }

      if (fluid) {
        style.paddingTop = "".concat(ratioMultiplier * 100, "%");
      } else {
        // If Width contains "auto", set "auto" in style
        this.setWidthOrHeight(style, 'width', width);
        this.setWidthOrHeight(style, 'height', height);
      }

      return style;
    } // get redux state
    // { player, operation }

  }, {
    key: "getState",
    value: function getState() {
      return this.manager.getState();
    } // get playback rate

  }, {
    key: "play",
    // play the video
    value: function play() {
      this.video.play();
    } // pause the video

  }, {
    key: "pause",
    value: function pause() {
      this.video.pause();
    } // Change the video source and re-load the video:

  }, {
    key: "load",
    value: function load() {
      this.video.load();
    } // Add a new text track to the video

  }, {
    key: "addTextTrack",
    value: function addTextTrack() {
      var _this$video;

      (_this$video = this.video).addTextTrack.apply(_this$video, arguments);
    } // Check if your browser can play different types of video:

  }, {
    key: "canPlayType",
    value: function canPlayType() {
      var _this$video2;

      (_this$video2 = this.video).canPlayType.apply(_this$video2, arguments);
    } // seek video by time

  }, {
    key: "seek",
    value: function seek(time) {
      this.video.seek(time);
    } // jump forward x seconds

  }, {
    key: "forward",
    value: function forward(seconds) {
      this.video.forward(seconds);
    } // jump back x seconds

  }, {
    key: "replay",
    value: function replay(seconds) {
      this.video.replay(seconds);
    } // enter or exist full screen

  }, {
    key: "toggleFullscreen",
    value: function toggleFullscreen() {
      this.video.toggleFullscreen();
    } // subscribe to player state change

  }, {
    key: "subscribeToStateChange",
    value: function subscribeToStateChange(listener) {
      return this.manager.subscribeToPlayerStateChange(listener);
    } // player resize

  }, {
    key: "handleResize",
    value: function handleResize() {}
  }, {
    key: "handleFullScreenChange",
    value: function handleFullScreenChange(event) {
      if (event.target === this.manager.rootElement) {
        this.actions.handleFullscreenChange(_fullscreen["default"].isFullscreen);
      }
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown() {
      this.startControlsTimer();
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove() {
      this.startControlsTimer();
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown() {
      this.startControlsTimer();
    }
  }, {
    key: "startControlsTimer",
    value: function startControlsTimer() {
      var _this3 = this;

      var controlBarActiveTime = 3000;

      _react["default"].Children.forEach(this.props.children, function (element) {
        if (!_react["default"].isValidElement(element) || element.type !== _ControlBar["default"]) {
          return;
        }

        var autoHideTime = element.props.autoHideTime;

        if (typeof autoHideTime === 'number') {
          controlBarActiveTime = autoHideTime;
        }
      });

      this.actions.userActivate(true);
      clearTimeout(this.controlsHideTimer);
      this.controlsHideTimer = setTimeout(function () {
        _this3.actions.userActivate(false);
      }, controlBarActiveTime);
    }
  }, {
    key: "handleStateChange",
    value: function handleStateChange(state, prevState) {
      if (state.isFullscreen !== prevState.isFullscreen) {
        this.handleResize(); // focus root when switching fullscreen mode to avoid confusion #276

        (0, dom.focusNode)(this.manager.rootElement);
      }

      this.forceUpdate(); // re-render
    }
  }, {
    key: "handleFocus",
    value: function handleFocus() {
      this.actions.activate(true);
    }
  }, {
    key: "handleBlur",
    value: function handleBlur() {
      this.actions.activate(false);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var fluid = this.props.fluid;

      var _this$manager$getStat2 = this.manager.getState(),
          player = _this$manager$getStat2.player;

      var paused = player.paused,
          hasStarted = player.hasStarted,
          waiting = player.waiting,
          seeking = player.seeking,
          isFullscreen = player.isFullscreen,
          userActivity = player.userActivity;
      var props = (0, _objectSpread2["default"])({}, this.props, {
        player: player,
        actions: this.actions,
        manager: this.manager,
        store: this.manager.store,
        video: this.video ? this.video.video : null
      });
      var children = this.getChildren(props);
      return _react["default"].createElement("div", {
        className: (0, _classnames["default"])({
          'video-react-controls-enabled': true,
          'video-react-has-started': hasStarted,
          'video-react-paused': paused,
          'video-react-playing': !paused,
          'video-react-waiting': waiting,
          'video-react-seeking': seeking,
          'video-react-fluid': fluid,
          'video-react-fullscreen': isFullscreen,
          'video-react-user-inactive': !userActivity,
          'video-react-user-active': userActivity,
          'video-react-workinghover': !browser$1.IS_IOS
        }, 'video-react', this.props.className),
        style: this.getStyle(),
        ref: function ref(c) {
          _this4.manager.rootElement = c;
        },
        role: "region",
        onTouchStart: this.handleMouseDown,
        onMouseDown: this.handleMouseDown,
        onMouseMove: this.handleMouseMove,
        onKeyDown: this.handleKeyDown,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        tabIndex: "-1"
      }, children);
    }
  }, {
    key: "playbackRate",
    get: function get() {
      return this.video.playbackRate;
    } // set playback rate
    // speed of video
    ,
    set: function set(rate) {
      this.video.playbackRate = rate;
    }
  }, {
    key: "muted",
    get: function get() {
      return this.video.muted;
    },
    set: function set(val) {
      this.video.muted = val;
    }
  }, {
    key: "volume",
    get: function get() {
      return this.video.volume;
    },
    set: function set(val) {
      this.video.volume = val;
    } // video width

  }, {
    key: "videoWidth",
    get: function get() {
      return this.video.videoWidth;
    } // video height

  }, {
    key: "videoHeight",
    get: function get() {
      return this.video.videoHeight;
    }
  }]);
  return Player;
}(_react.Component);

exports["default"] = Player;
Player.contextTypes = {
  store: _propTypes["default"].object
};
Player.propTypes = propTypes$1;
Player.defaultProps = defaultProps;
Player.displayName = 'Player';
});

var PlaybackRate_1 = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _inherits2 = interopRequireDefault(inherits);

var _react = interopRequireWildcard(react);

var _PlaybackRateMenuButton = interopRequireDefault(PlaybackRateMenuButton_1);



var PlaybackRate =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(PlaybackRate, _Component);

  function PlaybackRate(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, PlaybackRate);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PlaybackRate).call(this, props, context));
    (0, utils.deprecatedWarning)('PlaybackRate', 'PlaybackRateMenuButton');
    return _this;
  }

  (0, _createClass2["default"])(PlaybackRate, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_PlaybackRateMenuButton["default"], this.props);
    }
  }]);
  return PlaybackRate;
}(_react.Component);

exports["default"] = PlaybackRate;
PlaybackRate.displayName = 'PlaybackRate';
});

var lib = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Player", {
  enumerable: true,
  get: function get() {
    return _Player["default"];
  }
});
Object.defineProperty(exports, "Video", {
  enumerable: true,
  get: function get() {
    return _Video["default"];
  }
});
Object.defineProperty(exports, "BigPlayButton", {
  enumerable: true,
  get: function get() {
    return _BigPlayButton["default"];
  }
});
Object.defineProperty(exports, "LoadingSpinner", {
  enumerable: true,
  get: function get() {
    return _LoadingSpinner["default"];
  }
});
Object.defineProperty(exports, "PosterImage", {
  enumerable: true,
  get: function get() {
    return _PosterImage["default"];
  }
});
Object.defineProperty(exports, "Slider", {
  enumerable: true,
  get: function get() {
    return _Slider["default"];
  }
});
Object.defineProperty(exports, "Bezel", {
  enumerable: true,
  get: function get() {
    return _Bezel["default"];
  }
});
Object.defineProperty(exports, "Shortcut", {
  enumerable: true,
  get: function get() {
    return _Shortcut["default"];
  }
});
Object.defineProperty(exports, "ControlBar", {
  enumerable: true,
  get: function get() {
    return _ControlBar["default"];
  }
});
Object.defineProperty(exports, "PlayToggle", {
  enumerable: true,
  get: function get() {
    return _PlayToggle["default"];
  }
});
Object.defineProperty(exports, "ForwardControl", {
  enumerable: true,
  get: function get() {
    return _ForwardControl["default"];
  }
});
Object.defineProperty(exports, "ReplayControl", {
  enumerable: true,
  get: function get() {
    return _ReplayControl["default"];
  }
});
Object.defineProperty(exports, "FullscreenToggle", {
  enumerable: true,
  get: function get() {
    return _FullscreenToggle["default"];
  }
});
Object.defineProperty(exports, "ProgressControl", {
  enumerable: true,
  get: function get() {
    return _ProgressControl["default"];
  }
});
Object.defineProperty(exports, "SeekBar", {
  enumerable: true,
  get: function get() {
    return _SeekBar["default"];
  }
});
Object.defineProperty(exports, "PlayProgressBar", {
  enumerable: true,
  get: function get() {
    return _PlayProgressBar["default"];
  }
});
Object.defineProperty(exports, "LoadProgressBar", {
  enumerable: true,
  get: function get() {
    return _LoadProgressBar["default"];
  }
});
Object.defineProperty(exports, "MouseTimeDisplay", {
  enumerable: true,
  get: function get() {
    return _MouseTimeDisplay["default"];
  }
});
Object.defineProperty(exports, "VolumeMenuButton", {
  enumerable: true,
  get: function get() {
    return _VolumeMenuButton["default"];
  }
});
Object.defineProperty(exports, "PlaybackRateMenuButton", {
  enumerable: true,
  get: function get() {
    return _PlaybackRateMenuButton["default"];
  }
});
Object.defineProperty(exports, "PlaybackRate", {
  enumerable: true,
  get: function get() {
    return _PlaybackRate["default"];
  }
});
Object.defineProperty(exports, "RemainingTimeDisplay", {
  enumerable: true,
  get: function get() {
    return _RemainingTimeDisplay["default"];
  }
});
Object.defineProperty(exports, "CurrentTimeDisplay", {
  enumerable: true,
  get: function get() {
    return _CurrentTimeDisplay["default"];
  }
});
Object.defineProperty(exports, "DurationDisplay", {
  enumerable: true,
  get: function get() {
    return _DurationDisplay["default"];
  }
});
Object.defineProperty(exports, "TimeDivider", {
  enumerable: true,
  get: function get() {
    return _TimeDivider["default"];
  }
});
Object.defineProperty(exports, "MenuButton", {
  enumerable: true,
  get: function get() {
    return _MenuButton["default"];
  }
});
Object.defineProperty(exports, "playerReducer", {
  enumerable: true,
  get: function get() {
    return reducers.playerReducer;
  }
});
Object.defineProperty(exports, "operationReducer", {
  enumerable: true,
  get: function get() {
    return reducers.operationReducer;
  }
});
exports.videoActions = exports.playerActions = void 0;

var _Player = interopRequireDefault(Player_1);

var _Video = interopRequireDefault(Video_1);

var _BigPlayButton = interopRequireDefault(BigPlayButton_1);

var _LoadingSpinner = interopRequireDefault(LoadingSpinner_1);

var _PosterImage = interopRequireDefault(PosterImage_1);

var _Slider = interopRequireDefault(Slider_1);

var _Bezel = interopRequireDefault(Bezel_1);

var _Shortcut = interopRequireDefault(Shortcut_1);

var _ControlBar = interopRequireDefault(ControlBar_1);

var _PlayToggle = interopRequireDefault(PlayToggle_1);

var _ForwardControl = interopRequireDefault(ForwardControl_1);

var _ReplayControl = interopRequireDefault(ReplayControl_1);

var _FullscreenToggle = interopRequireDefault(FullscreenToggle_1);

var _ProgressControl = interopRequireDefault(ProgressControl_1);

var _SeekBar = interopRequireDefault(SeekBar_1);

var _PlayProgressBar = interopRequireDefault(PlayProgressBar_1);

var _LoadProgressBar = interopRequireDefault(LoadProgressBar_1);

var _MouseTimeDisplay = interopRequireDefault(MouseTimeDisplay_1);

var _VolumeMenuButton = interopRequireDefault(VolumeMenuButton_1);

var _PlaybackRateMenuButton = interopRequireDefault(PlaybackRateMenuButton_1);

var _PlaybackRate = interopRequireDefault(PlaybackRate_1);

var _RemainingTimeDisplay = interopRequireDefault(RemainingTimeDisplay_1);

var _CurrentTimeDisplay = interopRequireDefault(CurrentTimeDisplay_1);

var _DurationDisplay = interopRequireDefault(DurationDisplay_1);

var _TimeDivider = interopRequireDefault(TimeDivider_1);

var _MenuButton = interopRequireDefault(MenuButton_1);

var playerActions = interopRequireWildcard(player);

exports.playerActions = playerActions;

var videoActions = interopRequireWildcard(video);

exports.videoActions = videoActions;
});

var __pika_web_default_export_for_treeshaking__ = /*@__PURE__*/getDefaultExportFromCjs(lib);

var Bezel = lib.Bezel;
var BigPlayButton = lib.BigPlayButton;
var ControlBar = lib.ControlBar;
var CurrentTimeDisplay = lib.CurrentTimeDisplay;
var DurationDisplay = lib.DurationDisplay;
var ForwardControl = lib.ForwardControl;
var FullscreenToggle = lib.FullscreenToggle;
var LoadProgressBar = lib.LoadProgressBar;
var LoadingSpinner = lib.LoadingSpinner;
var MenuButton = lib.MenuButton;
var MouseTimeDisplay = lib.MouseTimeDisplay;
var PlayProgressBar = lib.PlayProgressBar;
var PlayToggle = lib.PlayToggle;
var PlaybackRate = lib.PlaybackRate;
var PlaybackRateMenuButton = lib.PlaybackRateMenuButton;
var Player = lib.Player;
var PosterImage = lib.PosterImage;
var ProgressControl = lib.ProgressControl;
var RemainingTimeDisplay = lib.RemainingTimeDisplay;
var ReplayControl = lib.ReplayControl;
var SeekBar = lib.SeekBar;
var Shortcut = lib.Shortcut;
var Slider = lib.Slider;
var TimeDivider = lib.TimeDivider;
var Video = lib.Video;
var VolumeMenuButton = lib.VolumeMenuButton;
var __esModule = lib.__esModule;
export default __pika_web_default_export_for_treeshaking__;
var operationReducer = lib.operationReducer;
var playerActions = lib.playerActions;
var playerReducer = lib.playerReducer;
var videoActions = lib.videoActions;
export { Bezel, BigPlayButton, ControlBar, CurrentTimeDisplay, DurationDisplay, ForwardControl, FullscreenToggle, LoadProgressBar, LoadingSpinner, MenuButton, MouseTimeDisplay, PlayProgressBar, PlayToggle, PlaybackRate, PlaybackRateMenuButton, Player, PosterImage, ProgressControl, RemainingTimeDisplay, ReplayControl, SeekBar, Shortcut, Slider, TimeDivider, Video, VolumeMenuButton, __esModule, operationReducer, playerActions, playerReducer, videoActions };
