module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("ele-rw-ui/lib/utils/dom");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("@vue/babel-helper-vue-jsx-merge-props");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("ele-rw-ui/lib/utils/index");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names

module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".ele-rw-dialog__wrapper {\n  position: absolute;\n  z-index: 1000;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n}\n.ele-rw-dialog__wrapper.has-shadow {\n  background-color: rgba(0, 0, 0, 0.4);\n  pointer-events: auto;\n}\n.ele-rw-dialog__wrapper.full-screen > .ele-rw-dialog {\n  position: fixed;\n  left: 0 !important;\n  top: 0 !important;\n  bottom: 0 !important;\n  right: 0 !important;\n  width: auto !important;\n  height: auto !important;\n}\n.ele-rw-dialog__wrapper .ele-rw-dialog {\n  backface-visibility: hidden;\n  pointer-events: auto;\n  position: absolute;\n  height: auto;\n  background-color: rgba(23, 75, 98, 0.9);\n  box-shadow: 2px 2px 10px 0 black;\n}\n.ele-rw-dialog__wrapper .dialog__title {\n  position: relative;\n  user-select: none;\n}\n.ele-rw-dialog__wrapper .dialog__title i.el-icon-close {\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n  color: white;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, exports) {

module.exports = require("ele-rw-ui/lib/directives/v-transfer-dom");

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "@vue/babel-helper-vue-jsx-merge-props"
var babel_helper_vue_jsx_merge_props_ = __webpack_require__(2);
var babel_helper_vue_jsx_merge_props_default = /*#__PURE__*/__webpack_require__.n(babel_helper_vue_jsx_merge_props_);

// EXTERNAL MODULE: external "ele-rw-ui/lib/utils/index"
var index_ = __webpack_require__(3);

// EXTERNAL MODULE: external "ele-rw-ui/lib/utils/dom"
var dom_ = __webpack_require__(0);

// EXTERNAL MODULE: external "ele-rw-ui/lib/directives/v-transfer-dom"
var v_transfer_dom_ = __webpack_require__(10);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/dialog/src/main.vue?vue&type=script&lang=js&


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var minZIndex = 1000; //最小的zIndex

var zIndex = minZIndex; //当前的zIndex

var gId = 1; //全局id

var winShowCache = []; //当前显示的所有dialog集合

function removeFromCache(dialog) {
  var idx = winShowCache.indexOf(dialog);
  idx !== -1 && winShowCache.splice(idx, 1);
}

Object(dom_["on"])(document.body, 'keyup', function (e) {
  if (e.keyCode === 27) {
    //Escape
    var top;

    for (var i = winShowCache.length - 1; i >= 0; i--) {
      var item = winShowCache[i];

      if (item.escClose && (item.shadow || item.fullScreen)) {
        top = item;
        break;
      }
    }

    top && top.$emit('update:show', false);
  }
});
/* harmony default export */ var mainvue_type_script_lang_js_ = ({
  name: "EleRwDialog",
  directives: {
    'transfer-dom': v_transfer_dom_["TransferDom"]
  },
  props: {
    classList: {
      default: null,
      type: Array,
      desc: '自定义class，添加到wrapper上'
    },
    width: {
      type: Number | String,
      default: null,
      desc: '宽度'
    },
    padding: {
      type: Array,
      default: function _default() {
        return [0, 0, 0, 0];
      },
      desc: 'dialog距离父元素的边距,限制拖拽范围,上右下左'
    },
    keepPosition: {
      type: Boolean,
      default: false,
      desc: '是否保持拖拽位置，否则每次重新显示，都会出现在正中间'
    },
    draggable: {
      type: Boolean,
      default: true,
      desc: '是否可拖动,只有表头可拖动,设置为true,需要header内容可见'
    },
    show: {
      type: Boolean,
      default: true,
      desc: '是否可见'
    },
    fullScreen: {
      type: Boolean,
      default: false,
      desc: '是否全屏'
    },
    appendToBody: {
      type: Boolean,
      default: true,
      desc: '是否添加到body下'
    },
    shadow: {
      type: Boolean,
      default: false,
      desc: '是否显示遮罩'
    },
    escClose: {
      type: Boolean,
      default: true,
      desc: '按下esc是否隐藏,仅在全屏或者shadow模式下有效'
    }
  },
  data: function data() {
    return {
      id: gId++,
      firstLoad: false //是否已加载过

    };
  },
  computed: {
    parentNode: function parentNode() {
      return this.appendToBody ? document.body : null;
    },
    dialogWidth: function dialogWidth() {
      var w = this.width;

      var type = _typeof(w);

      if (type === 'number') {
        return "".concat(w, "px");
      } else {
        return w;
      }
    }
  },
  render: function render() {
    var key = "_custom_dialog_".concat(this.id, "_"); //第一次可见才加载

    if (!this.firstLoad && !this.show) {
      //站位元素
      return h("div", {
        "class": "dialog-placeholder",
        "key": key
      });
    } else {
      !this.firstLoad && (this.firstLoad = true);
      var clazz = (this.classList || []).reduce(function (pre, cur) {
        pre[cur] = true;
        return pre;
      }, {});
      return h("div", {
        "class": "dialog-placeholder",
        "key": key
      }, [h("transition", {
        "attrs": {
          "name": "fade-out"
        }
      }, [h("div", babel_helper_vue_jsx_merge_props_default()([{}, {
        class: _objectSpread({
          'full-screen': this.fullScreen,
          'has-shadow': this.shadow,
          'ele-rw-dialog__wrapper': true
        }, clazz),
        directives: [{
          name: 'transfer-dom',
          value: this.parentNode //为null,代表不移动

        }, {
          name: 'show',
          value: this.show
        }],
        ref: "dialogWrapper"
      }]), [h("div", {
        "class": "ele-rw-dialog",
        "ref": "dialog",
        "style": {
          width: this.dialogWidth
        }
      }, [h("div", {
        "class": "dialog__title",
        "ref": "title",
        "style": {
          cursor: this.draggable ? 'move' : 'auto'
        }
      }, [this.$slots.title]), h("div", {
        "class": "dialog__content"
      }, [this.$slots.default]), h("div", {
        "class": "dialog__footer"
      }, [this.$slots.footer])])])])]);
    }
  },
  created: function created() {
    var _this = this;

    //加载后,绑定事件
    var un = this.$watch('firstLoad', function (v) {
      if (!v) return;
      un();
      un = null;

      _this.$nextTick(function () {
        _this.init();
      });
    });
    this.$once("hook:beforeDestroy", function () {
      un && un();
    });
  },
  methods: {
    init: function init() {
      var _this2 = this;

      var wrapper = this.$refs.dialogWrapper;
      var dialog = this.$refs.dialog;
      this.draggable && this.initDrag(); //初始化一次拖拽

      var unAppendToBody = this.$watch('appendToBody', function (v) {
        //drag需要考虑父节点, 切换appendToBody会改变父节点, 需要重新绑定drag
        if (_this2._unBindDrag) {
          _this2._clearDrag();

          _this2.draggable && _this2.initDrag();
        } //定位是相对于的父节点，切换时可能导致不可见,强制到中间


        requestAnimationFrame(function () {
          var parentNode = dialog.parentNode;
          dialog.style.left = "".concat((parentNode.clientWidth - dialog.offsetWidth) / 2, "px");
          dialog.style.top = "".concat((parentNode.clientHeight - dialog.offsetHeight) / 2, "px");
        });
      });
      var unDragWatch = this.$watch('draggable', function (v) {
        _this2._clearDrag();

        v && _this2.initDrag();
      });
      var unWatch = this.$watch('show', function (v) {
        if (v) {
          //送入缓存
          winShowCache.push(_this2);

          _this2.promoteDialogZIndex();

          if (!_this2.fullScreen) {
            !_this2.keepPosition && requestAnimationFrame(function () {
              var parentNode = dialog.parentNode;
              dialog.style.left = "".concat((parentNode.clientWidth - dialog.offsetWidth) / 2, "px");
              dialog.style.top = "".concat((parentNode.clientHeight - dialog.offsetHeight) / 2, "px");
            });
          }
        } else {
          //隐藏，从缓存中移除
          wrapper.style.zIndex = '1000';
          removeFromCache(_this2);
        }
      }, {
        immediate: true
      });
      var unFullScreen = this.$watch('fullScreen', function (v) {
        v ? dialog.classList.add('full-screen') : dialog.classList.remove('full-screen');
      }, {
        immediate: true
      });
      Object(dom_["on"])(dialog, 'mousedown', this.promoteDialogZIndex); //点击窗口会提升zindex

      this.$once('hook:beforeDestroy', function () {
        unWatch && unWatch();
        unFullScreen && unFullScreen();
        unDragWatch && unDragWatch();
        unAppendToBody && unAppendToBody();
        Object(dom_["off"])(dialog, 'mousedown', _this2.promoteDialogZIndex);
        _this2._unBindDrag && _this2._unBindDrag();
        removeFromCache(_this2);
      });
    },
    // 新显示的dialog，z-index提升到最上层
    // full-screen 和 带shadow的 除外, 不然其他会被遮挡，永远点不到
    promoteDialogZIndex: function promoteDialogZIndex() {
      var wrapper = this.$refs.dialogWrapper;

      if (winShowCache.length > 1) {
        if (this.fullScreen || this.shadow) return;
        zIndex += 1;
        wrapper.style.zIndex = zIndex; //点击的窗口提到最上层
      } else {
        zIndex = 1000;
      }
    },
    _clearDrag: function _clearDrag() {
      if (this._unBindDrag) {
        this._unBindDrag();

        this._unBindDrag = null;
      }
    },
    //初始化拖拽
    initDrag: function initDrag() {
      var _this3 = this;

      var dialog = this.$refs.dialog,
          wrap = dialog ? dialog.parentNode : null,
          title = this.$refs.title;
      if (!wrap || !dialog || !title) return; //容器的定位盒子,判断是否超出边界

      var titleOnMousedown = function titleOnMousedown(e) {
        //take snapshot
        document.body.style.userSelect = 'none'; //cur position

        var x = e.clientX; //当前页面点击X

        var y = e.clientY; //当前页面点击Y
        //wrap position

        var wrapRect = wrap.getBoundingClientRect();

        var _this3$padding = _slicedToArray(_this3.padding, 4),
            t = _this3$padding[0],
            r = _this3$padding[1],
            b = _this3$padding[2],
            l = _this3$padding[3];

        var W = wrapRect.width,
            H = wrapRect.height,
            Left = wrapRect.left,
            Top = wrapRect.top;
        var rect = dialog.getBoundingClientRect(); //dragwindow的定位盒子

        var h = rect.height,
            w = rect.width,
            //初始位置
        left = rect.left,
            top = rect.top;
        var onMousemove = Object(index_["rafThrottle"])(function (e) {
          if (_this3.fullScreen) return;
          var moveX = e.clientX - x; //x移动的距离

          var moveY = e.clientY - y; //y移动的距离

          var _left = left + moveX; //新的left


          var _top = top + moveY; //新的top
          // 边界处理


          if (_left < Left + l) {
            _left = Left + l + 1;
          } else if (_left + w > W + Left - r) {
            _left = W + Left - w - r - 1;
          }

          if (_top < Top + t) {
            _top = Top + t + 1;
          } else if (_top + h > H + Top - b) {
            _top = H + Top - h - b - 1;
          }

          _left = _left - Left; //boundingRect是相对于body的，style为相对于父元素,

          _top = _top - Top; // 移动当前元素

          dialog.style.left = "".concat(_left, "px");
          dialog.style.top = "".concat(_top, "px");
        });

        var onMouseup = function onMouseup() {
          Object(dom_["off"])(document, 'mousemove', onMousemove);
          Object(dom_["off"])(document, 'mouseup', onMouseup);
          document.body.style.userSelect = null;
        };

        Object(dom_["on"])(document, 'mousemove', onMousemove);
        Object(dom_["on"])(document, 'mouseup', onMouseup);
        return false;
      };

      Object(dom_["on"])(title, 'mousedown', titleOnMousedown);

      this._unBindDrag = function () {
        Object(dom_["off"])(title, 'mousedown', titleOnMousedown);
      };
    }
  }
});
// CONCATENATED MODULE: ./packages/dialog/src/main.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_mainvue_type_script_lang_js_ = (mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(4);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options!./packages/dialog/src/main.vue?vue&type=style&index=0&lang=less&
var mainvue_type_style_index_0_lang_less_ = __webpack_require__(8);

// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options!./packages/dialog/src/main.vue?vue&type=style&index=0&lang=less&

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = injectStylesIntoStyleTag_default()(mainvue_type_style_index_0_lang_less_["a" /* default */], options);



/* harmony default export */ var src_mainvue_type_style_index_0_lang_less_ = (mainvue_type_style_index_0_lang_less_["a" /* default */].locals || {});
// CONCATENATED MODULE: ./packages/dialog/src/main.vue?vue&type=style&index=0&lang=less&
 /* harmony default export */ var dialog_src_mainvue_type_style_index_0_lang_less_ = (src_mainvue_type_style_index_0_lang_less_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./packages/dialog/src/main.vue
var main_render, staticRenderFns





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  src_mainvue_type_script_lang_js_,
  main_render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/dialog/src/main.vue"
/* harmony default export */ var main = (component.exports);
// CONCATENATED MODULE: ./packages/dialog/index.js


main.install = function (Vue) {
  Vue.component(main.name, main);
};

/* harmony default export */ var packages_dialog = __webpack_exports__["default"] = (main);

/***/ })
/******/ ]);