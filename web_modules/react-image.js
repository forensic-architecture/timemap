import { c as createCommonjsModule, g as getDefaultExportFromCjs } from './common/_commonjsHelpers-4f955397.js';
import { r as react } from './common/index-abdc4d2d.js';
import { i as interopRequireDefault, o as objectSpread, a as objectWithoutProperties, c as classCallCheck, b as createClass, p as possibleConstructorReturn, g as getPrototypeOf, d as inherits, e as assertThisInitialized, f as defineProperty, h as interopRequireWildcard } from './common/inherits-8fe2188b.js';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

function emptyFunction() {}

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var es = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = interopRequireDefault(objectSpread);

var _objectWithoutProperties2 = interopRequireDefault(objectWithoutProperties);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _createClass2 = interopRequireDefault(createClass);

var _possibleConstructorReturn2 = interopRequireDefault(possibleConstructorReturn);

var _getPrototypeOf2 = interopRequireDefault(getPrototypeOf);

var _inherits2 = interopRequireDefault(inherits);

var _assertThisInitialized2 = interopRequireDefault(assertThisInitialized);

var _defineProperty2 = interopRequireDefault(defineProperty);

var _react = interopRequireWildcard(react);



var cache = {};
var imgPropTypes = {
  loader: propTypes.node,
  unloader: propTypes.node,
  decode: propTypes.bool,
  src: (0, propTypes.oneOfType)([propTypes.string, propTypes.array]),
  container: propTypes.func,
  loaderContainer: propTypes.func,
  unloaderContainer: propTypes.func
};

var Img =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(Img, _Component);

  function Img(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Img);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Img).call(this, props)); // default loader/unloader container to just container. If no container was set
    // this will be a noop

    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "srcToArray", function (src) {
      return (Array.isArray(src) ? src : [src]).filter(function (x) {
        return x;
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "onLoad", function () {
      cache[_this.sourceList[_this.state.currentIndex]] = true;
      /* istanbul ignore else */

      if (_this.i) _this.setState({
        isLoaded: true
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "onError", function () {
      cache[_this.sourceList[_this.state.currentIndex]] = false; // if the current image has already been destroyed, we are probably no longer mounted
      // no need to do anything then

      /* istanbul ignore else */

      if (!_this.i) return false; // before loading the next image, check to see if it was ever loaded in the past

      for (var nextIndex = _this.state.currentIndex + 1; nextIndex < _this.sourceList.length; nextIndex++) {
        // get next img
        var src = _this.sourceList[nextIndex]; // if we have never seen it, its the one we want to try next

        if (!(src in cache)) {
          _this.setState({
            currentIndex: nextIndex
          });

          break;
        } // if we know it exists, use it!


        if (cache[src] === true) {
          _this.setState({
            currentIndex: nextIndex,
            isLoading: false,
            isLoaded: true
          });

          return true;
        } // if we know it doesn't exist, skip it!

        /* istanbul ignore else */


        if (cache[src] === false) continue;
      } // currentIndex is zero bases, length is 1 based.
      // if we have no more sources to try, return - we are done


      if (nextIndex === _this.sourceList.length) return _this.setState({
        isLoading: false
      }); // otherwise, try the next img

      _this.loadImg();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "loadImg", function () {
      {
        _this.i = new Image();
      }

      _this.i.src = _this.sourceList[_this.state.currentIndex];

      if (_this.props.decode && _this.i.decode) {
        _this.i.decode().then(_this.onLoad).catch(_this.onError);
      } else {
        _this.i.onload = _this.onLoad;
      }

      _this.i.onerror = _this.onError;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "unloadImg", function () {
      delete _this.i.onerror;
      delete _this.i.onload;

      try {
        delete _this.i.src;
      } catch (e) {// On Safari in Strict mode this will throw an exception,
        //  - https://github.com/mbrevda/react-image/issues/187
        // We don't need to do anything about it.
      }

      delete _this.i;
    });
    _this.loaderContainer = props.loaderContainer || props.container;
    _this.unloaderContainer = props.unloaderContainer || props.container;
    _this.sourceList = _this.srcToArray(_this.props.src); // check cache to decide at which index to start

    for (var i = 0; i < _this.sourceList.length; i++) {
      // if we've never seen this image before, the cache wont help.
      // no need to look further, just start loading

      /* istanbul ignore else */
      if (!(_this.sourceList[i] in cache)) break; // if we have loaded this image before, just load it again

      /* istanbul ignore else */

      if (cache[_this.sourceList[i]] === true) {
        _this.state = {
          currentIndex: i,
          isLoading: false,
          isLoaded: true
        };
        return (0, _possibleConstructorReturn2.default)(_this, true);
      }
    }

    _this.state = _this.sourceList.length ? // 'normal' opperation: start at 0 and try to load
    {
      currentIndex: 0,
      isLoading: true,
      isLoaded: false
    } : // if we dont have any sources, jump directly to unloaded
    {
      isLoading: false,
      isLoaded: false
    };
    return _this;
  }

  (0, _createClass2.default)(Img, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // kick off process

      /* istanbul ignore else */
      if (this.state.isLoading) this.loadImg();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // ensure that we dont leave any lingering listeners

      /* istanbul ignore else */
      if (this.i) this.unloadImg();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      this.loaderContainer = nextProps.loaderContainer || nextProps.container;
      this.unloaderContainer = nextProps.unloaderContainer || nextProps.container;
      var src = this.srcToArray(nextProps.src);
      var srcAdded = src.filter(function (s) {
        return _this2.sourceList.indexOf(s) === -1;
      });
      var srcRemoved = this.sourceList.filter(function (s) {
        return src.indexOf(s) === -1;
      }); // if src prop changed, restart the loading process

      if (srcAdded.length || srcRemoved.length) {
        this.sourceList = src; // if we dont have any sources, jump directly to unloader

        if (!src.length) return this.setState({
          isLoading: false,
          isLoaded: false
        });
        this.setState({
          currentIndex: 0,
          isLoading: true,
          isLoaded: false
        }, this.loadImg);
      }
    }
  }, {
    key: "render",
    value: function render() {
      // set img props as rest
      var _this$props = this.props,
          container = _this$props.container,
          loader = _this$props.loader,
          unloader = _this$props.unloader,
          src = _this$props.src,
          decode = _this$props.decode,
          loaderContainer = _this$props.loaderContainer,
          unloaderContainer = _this$props.unloaderContainer,
          mockImage = _this$props.mockImage,
          rest = (0, _objectWithoutProperties2.default)(_this$props, ["container", "loader", "unloader", "src", "decode", "loaderContainer", "unloaderContainer", "mockImage"]); //eslint-disable-line
      // if we have loaded, show img

      if (this.state.isLoaded) {
        var imgProps = (0, _objectSpread2.default)({}, {
          src: this.sourceList[this.state.currentIndex]
        }, rest);
        return container(_react.default.createElement("img", imgProps));
      } // if we are still trying to load, show img and a loader if requested


      if (!this.state.isLoaded && this.state.isLoading) {
        return loader ? this.loaderContainer(loader) : null;
      } // if we have given up on loading, show a place holder if requested, or nothing

      /* istanbul ignore else */


      if (!this.state.isLoaded && !this.state.isLoading) {
        return unloader ? this.unloaderContainer(unloader) : null;
      }
    }
  }]);
  return Img;
}(_react.Component);

(0, _defineProperty2.default)(Img, "defaultProps", {
  loader: false,
  unloader: false,
  decode: true,
  src: [],
  // by default, just return what gets sent in. Can be used for advanced rendering
  // such as animations
  container: function container(x) {
    return x;
  }
});
Img.propTypes =  {};
var _default = Img;
exports.default = _default;
});

var __pika_web_default_export_for_treeshaking__ = /*@__PURE__*/getDefaultExportFromCjs(es);

var __esModule = es.__esModule;
export default __pika_web_default_export_for_treeshaking__;
export { __esModule };
