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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/empty-slot/main.vue?vue&type=template&id=7d4ccb16&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        { name: "show", rawName: "v-show", value: _vm.show, expression: "show" }
      ],
      staticClass: "ele-rw-empty-slot"
    },
    [
      _vm._t("default", [
        _c("i", { staticClass: "el-icon-s-data default-icon" }),
        _c("span", { staticClass: "default-text" }, [_vm._v("暂无数据")])
      ])
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/empty-slot/main.vue?vue&type=template&id=7d4ccb16&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/empty-slot/main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
/* harmony default export */ var mainvue_type_script_lang_js_ = ({
  name: "EleRwEmptySlot",
  props: {
    show: {
      type: Boolean,
      default: true
    }
  }
});
// CONCATENATED MODULE: ./packages/empty-slot/main.vue?vue&type=script&lang=js&
 /* harmony default export */ var empty_slot_mainvue_type_script_lang_js_ = (mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(4);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options!./packages/empty-slot/main.vue?vue&type=style&index=0&lang=less&
var mainvue_type_style_index_0_lang_less_ = __webpack_require__(7);

// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options!./packages/empty-slot/main.vue?vue&type=style&index=0&lang=less&

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = injectStylesIntoStyleTag_default()(mainvue_type_style_index_0_lang_less_["a" /* default */], options);



/* harmony default export */ var empty_slot_mainvue_type_style_index_0_lang_less_ = (mainvue_type_style_index_0_lang_less_["a" /* default */].locals || {});
// CONCATENATED MODULE: ./packages/empty-slot/main.vue?vue&type=style&index=0&lang=less&
 /* harmony default export */ var packages_empty_slot_mainvue_type_style_index_0_lang_less_ = (empty_slot_mainvue_type_style_index_0_lang_less_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./packages/empty-slot/main.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  empty_slot_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/empty-slot/main.vue"
/* harmony default export */ var main = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".ele-rw-empty-slot {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ele-rw-empty-slot .default-icon {\n  font-size: 24px;\n}\n.ele-rw-empty-slot .default-text {\n  font-size: 15px;\n  margin-left: 5px;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".ele-rw-table {\n  width: 100%;\n  color: black;\n  position: relative;\n  /*border*/\n  /*.table__header {\n    td {\n      border-bottom: 1px solid red;\n      border-right: 1px solid red;\n    }\n  }\n  .table__body {\n    tr:not(:last-child) {\n      td {\n        border-bottom: 1px solid cyan;\n      }\n    }\n\n    td:not(:last-child) {\n      border-right: 1px solid cyan;\n    }\n  }*/\n}\n.ele-rw-table .inner-wrapper {\n  position: relative;\n}\n.ele-rw-table .inner-wrapper:hover .scrollbar__bar {\n  opacity: 1;\n  transition: opacity 340ms ease-out;\n}\n.ele-rw-table table {\n  table-layout: fixed;\n}\n.ele-rw-table .table-middle {\n  height: 100%;\n  width: 100%;\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.ele-rw-table .table-middle .table__header-wrapper {\n  overflow: hidden;\n  flex: none;\n}\n.ele-rw-table .table-middle .table__body-wrapper {\n  display: inline-block;\n  vertical-align: top;\n  /*fix父元素scrollHeight bug*/\n}\n.ele-rw-table .table-middle .scroll-wrapper {\n  overflow: hidden;\n  position: relative;\n  flex: 1 0 0;\n}\n.ele-rw-table .table-middle .scroll-wrapper .scroll-view {\n  overflow: scroll;\n}\n.ele-rw-table .table__fixed-left {\n  position: absolute;\n  left: 0;\n  top: 0;\n  overflow: hidden;\n}\n.ele-rw-table .table__fixed-left.fixed-shadow {\n  box-shadow: 5px 0 10px -5px;\n}\n.ele-rw-table .table__fixed-left .table__header-wrapper,\n.ele-rw-table .table__fixed-left .table__body-wrapper {\n  width: 100%;\n  overflow: hidden;\n}\n.ele-rw-table .table__fixed-right {\n  position: absolute;\n  overflow: hidden;\n  right: 0;\n  top: 0;\n}\n.ele-rw-table .table__fixed-right.fixed-shadow {\n  box-shadow: -5px 0 10px -5px;\n}\n.ele-rw-table .table__fixed-right .table__header-wrapper,\n.ele-rw-table .table__fixed-right .table__body-wrapper {\n  width: 100%;\n  position: relative;\n  overflow: hidden;\n}\n.ele-rw-table .scrollbar__bar {\n  position: absolute;\n  right: 2px;\n  bottom: 2px;\n  z-index: 1;\n  border-radius: 4px;\n  opacity: 0;\n  transition: opacity 120ms ease-out;\n}\n.ele-rw-table .scrollbar__bar.is-vertical {\n  width: 6px;\n  top: 2px;\n}\n.ele-rw-table .scrollbar__bar.is-vertical > div {\n  width: 100%;\n}\n.ele-rw-table .scrollbar__bar.is-horizontal {\n  height: 6px;\n  left: 2px;\n}\n.ele-rw-table .scrollbar__bar.is-horizontal > div {\n  height: 100%;\n}\n.ele-rw-table .scrollbar__thumb {\n  position: relative;\n  display: block;\n  width: 0;\n  height: 0;\n  cursor: pointer;\n  border-radius: inherit;\n  background-color: #30688b;\n  transition: 0.3s background-color;\n}\n.ele-rw-table .scrollbar__thumb:hover {\n  background-color: rgba(144, 147, 153, 0.5);\n}\n.ele-rw-table .table__header {\n  color: #69d6f1;\n  background-color: #144e74;\n}\n.ele-rw-table .table__header .sort-caret-wrapper {\n  display: inline-flex;\n  margin-left: 5px;\n  flex-direction: column;\n  align-items: center;\n  height: 34px;\n  width: 16px;\n  vertical-align: middle;\n  cursor: pointer;\n  position: relative;\n}\n.ele-rw-table .table__header .sort-caret-wrapper .sort-caret {\n  width: 0;\n  height: 0;\n  border: 5px solid transparent;\n  position: absolute;\n  transition: 0.1s border-color;\n  transform: scale(1.05);\n}\n.ele-rw-table .table__header .sort-caret-wrapper .sort-caret.asc {\n  border-bottom-color: #c0c4cc;\n  top: 4px;\n}\n.ele-rw-table .table__header .sort-caret-wrapper .sort-caret.asc.is-active {\n  border-bottom-color: #409eff;\n}\n.ele-rw-table .table__header .sort-caret-wrapper .sort-caret.desc {\n  border-top-color: #c0c4cc;\n  bottom: 4px;\n}\n.ele-rw-table .table__header .sort-caret-wrapper .sort-caret.desc.is-active {\n  border-top-color: #409eff;\n}\n.ele-rw-table .table__body {\n  color: white;\n}\n.ele-rw-table .table__body tr.row {\n  transition: 0.1s background-color;\n  background-color: #002534;\n}\n.ele-rw-table .table__body tr.row.is-hover,\n.ele-rw-table .table__body tr.row.is-selected {\n  background-color: #133e58;\n}\n.ele-rw-table .table__body td > .cell {\n  text-align: center;\n  white-space: normal;\n  word-break: break-word;\n}\n.ele-rw-table td.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.ele-rw-table .empty-slot {\n  background-color: #002534;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module, exports) {

module.exports = require("ele-rw-ui/lib/directives/v-mousewheel");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("resize-observer-polyfill");

/***/ }),
/* 14 */,
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/table/src/table.vue?vue&type=template&id=493fe34e&
var tablevue_type_template_id_493fe34e_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "ele-rw-table outer-wrapper", style: _vm.calcElStyle() },
    [
      _c("div", { staticClass: "inner-wrapper", style: _vm.calcInnerStyle() }, [
        _c(
          "div",
          { staticClass: "table-middle" },
          [
            _c(
              "div",
              { ref: "headerWrap", staticClass: "table__header-wrapper" },
              [_c("table-header")],
              1
            ),
            _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: !_vm.empty,
                    expression: "!empty"
                  }
                ],
                ref: "scrollWrap",
                staticClass: "scroll-wrapper",
                on: { mouseleave: _vm.mouseLeaveTable }
              },
              [
                _c(
                  "div",
                  {
                    ref: "scrollView",
                    staticClass: "scroll-view",
                    style: {
                      width: "calc(100% + " + _vm.barWidth + "px)",
                      height: "calc(100% + " + _vm.barWidth + "px)"
                    },
                    on: {
                      "&scroll": function($event) {
                        return _vm.handleScroll($event)
                      }
                    }
                  },
                  [
                    _c(
                      "div",
                      { ref: "bodyWrap", staticClass: "table__body-wrapper" },
                      [
                        _c("table-body", {
                          ref: "tbody",
                          attrs: { "debug-flag": "middle-tbody" }
                        })
                      ],
                      1
                    )
                  ]
                ),
                _c("bar", {
                  ref: "barX",
                  attrs: { move: _vm.moveX, size: _vm.sizeWidth }
                }),
                _c("bar", {
                  ref: "barY",
                  attrs: { vertical: "", move: _vm.moveY, size: _vm.sizeHeight }
                })
              ],
              1
            ),
            _c("empty-slot", {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.empty,
                  expression: "empty"
                }
              ],
              staticStyle: { color: "white", flex: "1 0 0" }
            })
          ],
          1
        ),
        _vm.fixedLeftCount
          ? _c(
              "div",
              {
                staticClass: "table__fixed-left",
                class: { "fixed-shadow": _vm.showLeftShadow },
                style: { width: _vm.fixedLeftWidth + "px" }
              },
              [
                _c(
                  "div",
                  { staticClass: "table__header-wrapper fixed-left" },
                  [_c("table-header", { attrs: { fixed: "left" } })],
                  1
                ),
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "mousewheel",
                        rawName: "v-mousewheel",
                        value: _vm.handleFixedMousewheel,
                        expression: "handleFixedMousewheel"
                      }
                    ],
                    ref: "leftScrollWrap",
                    staticClass: "table__body-wrapper fixed-left",
                    style: { height: _vm.scrollWrapHeight + "px" }
                  },
                  [
                    _c("table-body", {
                      attrs: { fixed: "left", "debug-flag": "fixed-left-tbody" }
                    })
                  ],
                  1
                )
              ]
            )
          : _vm._e(),
        _vm.fixedRightCount
          ? _c(
              "div",
              {
                staticClass: "table__fixed-right",
                class: { "fixed-shadow": _vm.showRightShadow },
                style: { width: _vm.fixedRightWidth + "px" }
              },
              [
                _c(
                  "div",
                  {
                    staticClass: "table__header-wrapper fixed-right",
                    style: { height: _vm.headerWrapHeight + "px" }
                  },
                  [
                    _c("table-header", {
                      staticStyle: {
                        position: "absolute",
                        right: "0",
                        top: "0"
                      },
                      attrs: { fixed: "right" }
                    })
                  ],
                  1
                ),
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "mousewheel",
                        rawName: "v-mousewheel",
                        value: _vm.handleFixedMousewheel,
                        expression: "handleFixedMousewheel"
                      }
                    ],
                    ref: "rightScrollWrap",
                    staticClass: "table__body-wrapper fixed-right",
                    style: { height: _vm.scrollWrapHeight + "px" }
                  },
                  [
                    _c("table-body", {
                      staticStyle: {
                        position: "absolute",
                        right: "0",
                        top: "0"
                      },
                      attrs: {
                        fixed: "right",
                        "debug-flag": "fixed-right-tbody"
                      }
                    })
                  ],
                  1
                )
              ]
            )
          : _vm._e()
      ])
    ]
  )
}
var staticRenderFns = []
tablevue_type_template_id_493fe34e_render._withStripped = true


// CONCATENATED MODULE: ./packages/table/src/table.vue?vue&type=template&id=493fe34e&

// EXTERNAL MODULE: external "ele-rw-ui/lib/utils/dom"
var dom_ = __webpack_require__(0);

// EXTERNAL MODULE: external "ele-rw-ui/lib/utils/index"
var index_ = __webpack_require__(3);

// EXTERNAL MODULE: external "ele-rw-ui/lib/directives/v-mousewheel"
var v_mousewheel_ = __webpack_require__(11);

// EXTERNAL MODULE: ./packages/empty-slot/main.vue + 6 modules
var main = __webpack_require__(6);

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(12);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: ./packages/table/src/store.js
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



var LEFT = "left",
    Middle = "middle",
    RIGHT = "right";
var ASC = "asc",
    DESC = 'desc';
var id = 0;

function ColumnNode(col) {
  var node = {
    key: col.key,
    //键,字段的值,
    label: col.label,
    //键名
    render: col.render,
    //渲染函数 cell
    renderHeader: col.renderHeader,
    //表头渲染函数
    sortable: !!col.sortable,
    //是否排序
    sort: null,
    //当前排序方式 asc / desc
    level: 1,
    //节点等级,从上往下增加,根为1
    isLeaf: false,
    //是否是叶子节点
    leafNum: 0,
    //子节点中叶子数目
    width: 80,
    //真实宽度 px值
    fixed: Middle,
    //固定位置，默认中间
    parent: null,
    //父节点
    children: [],
    //子节点
    col: col,
    //原始col对象
    _noRightBorder: false //表头td 没有右border

  };
  Object.defineProperty(node, '_uid', {
    value: "".concat(id, "_").concat(col.key)
  });
  return node;
}
/**
 * 获取宽度
 * @param v 当前宽度
 * @param W 整体宽度值
 * @returns {number}
 */


function parseWidth(v, W) {
  var vStr = v + "";
  v = parseFloat(vStr);
  if (isNaN(v)) return 0;

  if (vStr.indexOf('px') !== -1) {
    //100.5px, v = 100.5; 取整
    return v >> 0;
  } else if (vStr.indexOf('%') !== -1) {
    //20.5% v = 20.5, W * 20.5% 然后取整
    return W * v / 100 >> 0;
  } else {
    return v >> 0;
  }
}

function mapping(attrName, mapper) {
  var res = {};
  Object.keys(mapper).forEach(function (key) {
    var value = mapper[key];
    var fn;

    if (typeof value === 'string') {
      fn = function fn() {
        return this[attrName] ? this[attrName][value] : null;
      };
    } else if (typeof value === 'function') {
      fn = function fn() {
        return value.call(this, this[attrName]);
      };
    } else {
      console.error('invalid value type');
    }

    if (fn) {
      res[key] = fn;
    }
  });
  return res;
}
var TableStore = external_vue_default.a.extend({
  data: function data() {
    return {
      //barWidth: 0,
      containerWidth: 0,
      //容器宽度,列宽%以此为基准
      tableBodyWidth: 0,
      //表个内容宽度
      tableBodyHeight: 0,
      //表格内容高度
      defaultColWidth: 80,
      //col默认最小宽度
      //col info
      maxLevel: 0,
      //最大表头等级，（多级表头）
      columnLevelMap: {},
      //每一层节点信息 1:[{col1},{col2}...]
      leafColumns: [],
      //叶子节点数组,
      sortColumns: [],
      //所有排序的节点, sortable 为true的
      fixedLeftCount: 0,
      //左边固定列个数 ,一组算一个
      fixedRightCount: 0,
      //右边固定列个数
      fixedLeftWidth: 0,
      //左边固定列宽
      fixedRightWidth: 0,
      //右边固定列宽
      //data
      tableData: [],
      //表格数据
      curSelectIdx: null,
      curHoverIdx: null //当前悬浮的item

    };
  },
  methods: {
    _updateNodeWidthInfo: function _updateNodeWidthInfo(node) {
      node.width = computedWidth(node);

      function computedWidth(node) {
        if (node.isLeaf) {
          return node.width;
        } else {
          var w = node.children.reduce(function (pre, child) {
            pre += computedWidth(child);
            return pre;
          }, 0);
          node.width = w;
          return w;
        }
      }
    },
    _setBorderFlag: function _setBorderFlag(nodes) {
      var last = nodes[nodes.length - 1];
      last._noRightBorder = true;
      var childs = last.children || [];
      childs.length && this._setBorderFlag(childs);
    },
    checkFixedCol: function checkFixedCol(cols) {
      var left = [],
          middle = [],
          right = [];
      cols.forEach(function (col) {
        var fixed = findFixed(col);

        if (fixed === LEFT) {
          left.push(col);
        } else if (fixed === RIGHT) {
          right.push(col);
        } else {
          middle.push(col);
        }
      });
      var leftNodes = left.map(function (col) {
        var node = new ColumnNode(col);
        node.fixed = LEFT;
        return node;
      });
      var middleNodes = middle.map(function (col) {
        var node = new ColumnNode(col);
        node.fixed = Middle;
        return node;
      });
      var rightNodes = right.map(function (col) {
        var node = new ColumnNode(col);
        node.fixed = RIGHT;
        return node;
      });
      this.fixedLeftCount = leftNodes.length;
      this.fixedRightCount = rightNodes.length;
      return [].concat(_toConsumableArray(leftNodes), _toConsumableArray(middleNodes), _toConsumableArray(rightNodes)); //查找列的fix信息,取第一个值

      function findFixed(col) {
        var fixed,
            stack = [col];

        while (!fixed && stack.length) {
          var c = stack.shift();
          fixed = c.fixed;
          if (fixed) break;
          c.children && c.children.forEach(function (child) {
            stack.push(child);
          });
        }

        return fixed;
      }
    },
    //计算col信息
    computedCols: function computedCols(cols) {
      var columnLevelMap = {},
          leafColumns = [];
      var rootNodes = this.checkFixedCol(cols);

      var stack = _toConsumableArray(rootNodes); // 左  中 右


      var maxLevel = 1;

      while (stack.length) {
        var node = stack.shift();
        var col = node.col;

        if (node.sortable) {
          this.sortColumns.push(node);
        }

        if (node.parent) {
          node.level = node.parent.level + 1;
          node.fixed = node.parent.fixed;
          maxLevel = Math.max(node.level, maxLevel); //更新 maxLevel
        } else {
          node.level = 1;
        }

        if (columnLevelMap[node.level]) {
          columnLevelMap[node.level].push(node);
        } else {
          columnLevelMap[node.level] = [node];
        }

        if (col.children && col.children.length) {
          node.isLeaf = false;

          var _iterator = _createForOfIteratorHelper(_toConsumableArray(col.children).reverse()),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var childCol = _step.value;
              var childNode = new ColumnNode(childCol);
              stack.unshift(childNode);
              childNode.parent = node;
              node.children.unshift(childNode);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else {
          node.isLeaf = true;
          leafColumns.push(node);
          var p = node.parent;

          while (p) {
            p.leafNum += 1; //更新每个父节点 的 叶子个数

            p = p.parent;
          }
        }
      }
      /*Object.keys(columnLevelMap).sort().forEach(level => {
          console.log(level, columnLevelMap[level].map(node => node.label));
      });*/


      console.log(columnLevelMap);
      this.maxLevel = maxLevel;
      this.columnLevelMap = columnLevelMap;
      this.leafColumns = leafColumns;
    },
    //计算col宽度布局，决定table整体宽度
    computedColWidth: function computedColWidth() {
      var _this = this;

      var sumW = 0,
          W = this.containerWidth,
          flexNum = 0,
          len = this.leafColumns.length;
      if (!W || !len) return;

      for (var i = 0; i < len; i++) {
        var node = this.leafColumns[i],
            col = node.col;

        if (Object(index_["isDefined"])(col.minWidth)) {
          node.width = parseWidth(col.minWidth, W);
          sumW += node.width;
          flexNum++;
        } else if (Object(index_["isDefined"])(col.width)) {
          node.width = parseWidth(col.width, W);
          sumW += node.width;
        } else {
          node.width = this.defaultColWidth;
          sumW += node.width;
        }
      }

      var leftWidth = W - sumW; //剩余可分配宽度

      if (flexNum && leftWidth > 0) {
        var aver = leftWidth / flexNum >> 0; //每列分得平均宽度 取整

        for (var _i = 0; _i < this.leafColumns.length; _i++) {
          var _node = this.leafColumns[_i];

          if (Object(index_["isDefined"])(_node.col.minWidth)) {
            if (flexNum > 1) {
              _node.width += aver;
              flexNum -= 1;
              leftWidth -= aver;
            } else {
              _node.width += leftWidth; //所有的小数误差都分给最后一列
            }
          }
        }
      }

      var fixedLeft = 0,
          fixedRight = 0;
      this.tableBodyWidth = this.leafColumns.reduce(function (pre, cur) {
        pre += cur.width;
        if (cur.fixed === LEFT) fixedLeft += cur.width;
        if (cur.fixed === RIGHT) fixedRight += cur.width;
        return pre;
      }, 0); //这一步可以不做

      var ROOT = this.columnLevelMap[1];
      ROOT.forEach(function (node) {
        !node.isLeaf && _this._updateNodeWidthInfo(node);
      });

      this._setBorderFlag(ROOT);

      console.log(ROOT);
      this.fixedLeftWidth = fixedLeft;
      this.fixedRightWidth = fixedRight;
    }
  },
  watch: {
    containerWidth: function containerWidth(v) {
      this.computedColWidth(); //重新计算每列布局
    },
    tableData: function tableData() {
      this.curSelectIdx = this.curHoverIdx = null;
    }
  }
});
/* harmony default export */ var store = (TableStore);
// EXTERNAL MODULE: external "@vue/babel-helper-vue-jsx-merge-props"
var babel_helper_vue_jsx_merge_props_ = __webpack_require__(2);
var babel_helper_vue_jsx_merge_props_default = /*#__PURE__*/__webpack_require__.n(babel_helper_vue_jsx_merge_props_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/table/src/table-header.vue?vue&type=script&lang=js&




function table_headervue_type_script_lang_js_toConsumableArray(arr) { return table_headervue_type_script_lang_js_arrayWithoutHoles(arr) || table_headervue_type_script_lang_js_iterableToArray(arr) || table_headervue_type_script_lang_js_unsupportedIterableToArray(arr) || table_headervue_type_script_lang_js_nonIterableSpread(); }

function table_headervue_type_script_lang_js_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function table_headervue_type_script_lang_js_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return table_headervue_type_script_lang_js_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return table_headervue_type_script_lang_js_arrayLikeToArray(o, minLen); }

function table_headervue_type_script_lang_js_iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function table_headervue_type_script_lang_js_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return table_headervue_type_script_lang_js_arrayLikeToArray(arr); }

function table_headervue_type_script_lang_js_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/* harmony default export */ var table_headervue_type_script_lang_js_ = ({
  name: "table-header",
  inject: ['table', 'store'],
  props: {
    fixed: {
      default: "middle"
    }
  },
  computed: _objectSpread({}, Object(index_["mapping"])('store', {
    maxLevel: function maxLevel(store) {
      return store.maxLevel || 0;
    },
    columnLevelMap: function columnLevelMap(store) {
      return store.columnLevelMap || {};
    },
    leafColumns: function leafColumns(store) {
      return store.leafColumns || [];
    },
    tableBodyWidth: function tableBodyWidth(store) {
      return store.tableBodyWidth || 0;
    }
  })),
  render: function render(h) {
    var _this = this;

    var colGroup = h("colgroup", [this.leafColumns.map(function (leafNode) {
      return h("col", {
        "key": leafNode.key,
        "attrs": {
          "width": leafNode.width
        }
      });
    })]);
    var trs = [];

    for (var i = 1; i <= this.maxLevel; i++) {
      var columns = this.columnLevelMap[i];
      var tds = columns.map(function (column) {
        var tdAttr = {
          'class': {
            'is-hidden': column.fixed !== _this.fixed,
            'is-leaf': column.isLeaf
          },
          style: {
            borderRight: column._noRightBorder ? 'none' : null,
            textAlign: column.align || 'center'
          },
          key: column.key,
          attrs: {
            rowspan: column.isLeaf ? _this.maxLevel - column.level + 1 : 1,
            colspan: column.leafNum || 1
          }
        };
        var headerRender = [];

        if (column.renderHeader && typeof column.renderHeader === "function") {
          headerRender = [column.renderHeader(h, {
            col: column.col
          })];
        } else {
          headerRender = [h("span", [column.label])];
        }
        /*排序按钮*/


        if (column.sortable) {
          var ascAttrs = {
            'class': {
              'sort-caret': true,
              'asc': true,
              'is-active': column.sort === ASC
            },
            on: {
              click: function click(e) {
                if (column.sort === ASC) {
                  column.sort = null;
                } else {
                  column.sort = ASC;
                }

                _this.table.dispatchEvent('sort-change', column, _this.store.sortColumns);
              }
            }
          },
              descAttrs = {
            'class': {
              'sort-caret': true,
              'desc': true,
              'is-active': column.sort === DESC
            },
            on: {
              click: function click(e) {
                if (column.sort === DESC) {
                  column.sort = null;
                } else {
                  column.sort = DESC;
                }

                _this.table.dispatchEvent('sort-change', column, _this.store.sortColumns);
              }
            }
          };
          var cartWrapper = h("span", {
            "class": "sort-caret-wrapper"
          }, [h("i", babel_helper_vue_jsx_merge_props_default()([{}, ascAttrs])), h("i", babel_helper_vue_jsx_merge_props_default()([{}, descAttrs]))]);
          headerRender = [].concat(table_headervue_type_script_lang_js_toConsumableArray(headerRender), [cartWrapper]);
        }

        return h("td", babel_helper_vue_jsx_merge_props_default()([{}, tdAttr]), [h("div", {
          "class": "cell"
        }, [headerRender])]);
      });
      trs.push(h("tr", [tds]));
    }

    return h("table", {
      "class": "table__header",
      "style": {
        width: this.tableBodyWidth + 'px'
      }
    }, [colGroup, h("thead", [trs])]);
  }
});
// CONCATENATED MODULE: ./packages/table/src/table-header.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_table_headervue_type_script_lang_js_ = (table_headervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./packages/table/src/table-header.vue
var table_header_render, table_header_staticRenderFns




/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  src_table_headervue_type_script_lang_js_,
  table_header_render,
  table_header_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/table/src/table-header.vue"
/* harmony default export */ var table_header = (component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/table/src/tbody-tr-render.vue?vue&type=script&lang=js&




function tbody_tr_rendervue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function tbody_tr_rendervue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { tbody_tr_rendervue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { tbody_tr_rendervue_type_script_lang_js_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { tbody_tr_rendervue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function tbody_tr_rendervue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


/* harmony default export */ var tbody_tr_rendervue_type_script_lang_js_ = ({
  name: "tbody-tr-render",
  inject: ['table', 'store'],
  props: ['row', 'idx', 'fixed'],
  computed: tbody_tr_rendervue_type_script_lang_js_objectSpread({}, Object(index_["mapping"])('store', {
    leafColumns: function leafColumns(store) {
      return store.leafColumns || [];
    },
    curHoverIdx: function curHoverIdx(store) {
      return store.curHoverIdx;
    }
  })),
  render: function render(h) {
    var _this = this;

    var columns = this.leafColumns,
        idx = this.idx,
        fixed = this.fixed,
        row = this.row;
    var trAttr = {
      'class': {
        row: true
      },
      on: {
        mouseenter: function mouseenter(e) {
          _this.store.curHoverIdx = _this.idx;
        },
        click: function click(e) {
          _this.store.curSelectIdx = _this.idx;

          _this.table.dispatchEvent('click-row', {
            row: row,
            idx: idx,
            event: e
          });
        }
      },
      key: 'row_' + idx
    };
    return h("tr", babel_helper_vue_jsx_merge_props_default()([{}, trAttr]), [columns.map(function (column) {
      var tdAttr = {
        'class': {
          'is-hidden': column.fixed !== fixed
        },
        key: column.key
      };
      var renderCell;

      if (column.render && typeof column.render === "function") {
        renderCell = column.render(h, {
          row: row,
          col: column.col,
          rowIndex: idx
        });
      } else {
        renderCell = row[column.key];
      } //自定义cell class, String 或者 Array<String>


      var cellClass = column.col.cellClass ? [].concat(column.col.cellClass) : [];
      return h("td", babel_helper_vue_jsx_merge_props_default()([{}, tdAttr]), [h("div", babel_helper_vue_jsx_merge_props_default()([{}, {
        style: tbody_tr_rendervue_type_script_lang_js_objectSpread({}, column.col.cellStyle || {}),
        class: tbody_tr_rendervue_type_script_lang_js_objectSpread({
          "cell": true
        }, cellClass.reduce(function (pre, cur) {
          pre[cur] = true;
          return pre;
        }, {}))
      }]), [renderCell])]);
    })]);
  }
});
// CONCATENATED MODULE: ./packages/table/src/tbody-tr-render.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_tbody_tr_rendervue_type_script_lang_js_ = (tbody_tr_rendervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/table/src/tbody-tr-render.vue
var tbody_tr_render_render, tbody_tr_render_staticRenderFns




/* normalize component */

var tbody_tr_render_component = Object(componentNormalizer["a" /* default */])(
  src_tbody_tr_rendervue_type_script_lang_js_,
  tbody_tr_render_render,
  tbody_tr_render_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var tbody_tr_render_api; }
tbody_tr_render_component.options.__file = "packages/table/src/tbody-tr-render.vue"
/* harmony default export */ var tbody_tr_render = (tbody_tr_render_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/table/src/table-body.vue?vue&type=script&lang=js&


function table_bodyvue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function table_bodyvue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { table_bodyvue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { table_bodyvue_type_script_lang_js_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { table_bodyvue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function table_bodyvue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/* harmony default export */ var table_bodyvue_type_script_lang_js_ = ({
  name: "table-body",
  inject: ['table', 'store'],
  components: {
    BodyTrRender: tbody_tr_render
  },
  props: {
    fixed: {
      default: "middle"
    },
    debugFlag: {
      default: null
    }
  },
  computed: table_bodyvue_type_script_lang_js_objectSpread({}, Object(index_["mapping"])('store', {
    leafColumns: function leafColumns(store) {
      return store.leafColumns || [];
    },
    tableData: function tableData(store) {
      return store.tableData || [];
    },
    tableBodyWidth: function tableBodyWidth(store) {
      return store.tableBodyWidth || 0;
    },
    curHoverIdx: function curHoverIdx(store) {
      return store.curHoverIdx;
    }
  })),
  render: function render(h) {
    var _this = this;

    //console.log('render-tablebody', this.debugFlag);
    var columns = this.leafColumns,
        data = this.tableData;
    var colGroup = h("colgroup", [columns.map(function (column) {
      return h("col", {
        "key": column.key,
        "attrs": {
          "width": column.width
        }
      });
    })]);
    var trs = data.map(function (row, idx) {
      return h(tbody_tr_render, {
        "attrs": {
          "row": row,
          "idx": idx,
          "fixed": _this.fixed
        }
      });
    });
    var tableAttr = {
      'class': {
        'table__body': true
      },
      style: {
        width: this.tableBodyWidth + 'px'
      },
      attrs: {
        cellspacing: "0",
        cellpadding: "0",
        border: "0"
      }
    };
    var table = h("table", babel_helper_vue_jsx_merge_props_default()([{}, tableAttr]), [colGroup, h("tbody", [trs])]);
    return table;
  },
  watch: {
    curHoverIdx: function curHoverIdx(newRowIdx, oldRowIdx) {
      var rows = this.$el.querySelectorAll('.row');
      var oldRowDom = rows[oldRowIdx];
      var newRowDom = rows[newRowIdx];

      if (oldRowDom) {
        oldRowDom.classList.remove('is-hover');
      }

      if (newRowDom) {
        newRowDom.classList.add('is-hover');
      }
    },
    'store.curSelectIdx': {
      handler: function handler(newRowIdx, oldRowIdx) {
        var rows = this.$el.querySelectorAll('.row');
        var oldRowDom = rows[oldRowIdx];
        var newRowDom = rows[newRowIdx];

        if (oldRowDom) {
          oldRowDom.classList.remove('is-selected');
        }

        if (newRowDom) {
          newRowDom.classList.add('is-selected');
        }
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/table/src/table-body.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_table_bodyvue_type_script_lang_js_ = (table_bodyvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/table/src/table-body.vue
var table_body_render, table_body_staticRenderFns




/* normalize component */

var table_body_component = Object(componentNormalizer["a" /* default */])(
  src_table_bodyvue_type_script_lang_js_,
  table_body_render,
  table_body_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var table_body_api; }
table_body_component.options.__file = "packages/table/src/table-body.vue"
/* harmony default export */ var table_body = (table_body_component.exports);
// EXTERNAL MODULE: external "resize-observer-polyfill"
var external_resize_observer_polyfill_ = __webpack_require__(13);
var external_resize_observer_polyfill_default = /*#__PURE__*/__webpack_require__.n(external_resize_observer_polyfill_);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/bar.vue?vue&type=template&id=005121ff&
var barvue_type_template_id_005121ff_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { class: ["scrollbar__bar", "is-" + _vm.bar.key] }, [
    _c("div", {
      ref: "thumb",
      staticClass: "scrollbar__thumb",
      style: _vm.renderThumbStyle({
        size: _vm.size,
        move: _vm.move,
        bar: _vm.bar
      }),
      on: { mousedown: _vm.clickThumbHandler }
    })
  ])
}
var barvue_type_template_id_005121ff_staticRenderFns = []
barvue_type_template_id_005121ff_render._withStripped = true


// CONCATENATED MODULE: ./packages/bar.vue?vue&type=template&id=005121ff&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/bar.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
var BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top'
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left'
  }
};

/* harmony default export */ var barvue_type_script_lang_js_ = ({
  name: 'EleRwBar',
  props: {
    vertical: Boolean,
    size: Number,
    move: Number
  },
  data: function data() {
    return {
      wrap: null
    };
  },
  computed: {
    bar: function bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    }
  },
  methods: {
    renderThumbStyle: function renderThumbStyle(_ref) {
      var move = _ref.move,
          size = _ref.size,
          bar = _ref.bar;
      var style = {};
      var translate = "translate".concat(bar.axis, "(").concat(move, "%)");
      style[bar.size] = size ? size + '%' : 0;
      style.transform = translate;
      style.msTransform = translate;
      style.webkitTransform = translate;
      return style;
    },
    clickThumbHandler: function clickThumbHandler(e) {
      if (e.ctrlKey || e.button === 2) {
        return;
      }

      this.startDrag(e);
      var axis = this.bar.axis,
          thumb = e.currentTarget,
          rect = thumb.getBoundingClientRect();
      this[axis] = thumb[this.bar.offset] - (e[this.bar.client] - rect[this.bar.direction]);
    },
    clickTrackHandler: function clickTrackHandler(e) {
      var wrap = this.wrap;
      if (!wrap) return;
      var offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      var thumbHalf = this.$refs.thumb[this.bar.offset] / 2;
      var thumbPositionPercentage = (offset - thumbHalf) * 100 / this.$el[this.bar.offset];
      wrap[this.bar.scroll] = thumbPositionPercentage * wrap[this.bar.scrollSize] / 100;
    },
    startDrag: function startDrag(e) {
      e.stopPropagation();
      this.cursorDown = true;
      Object(dom_["on"])(document, 'mousemove', this.mouseMoveDocumentHandler);
      Object(dom_["on"])(document, 'mouseup', this.mouseUpDocumentHandler);

      document.onselectstart = function () {
        return false;
      };
    },
    mouseMoveDocumentHandler: function mouseMoveDocumentHandler(e) {
      var wrap = this.wrap;
      if (!wrap) return;
      if (this.cursorDown === false) return;
      var prevPage = this[this.bar.axis];
      if (!prevPage) return;
      var offset = (this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1;
      var thumbClickPosition = this.$refs.thumb[this.bar.offset] - prevPage;
      var thumbPositionPercentage = (offset - thumbClickPosition) * 100 / this.$el[this.bar.offset];
      wrap[this.bar.scroll] = thumbPositionPercentage * wrap[this.bar.scrollSize] / 100;
    },
    mouseUpDocumentHandler: function mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      Object(dom_["off"])(document, 'mousemove', this.mouseMoveDocumentHandler);
      document.onselectstart = null;
    }
  },
  destroyed: function destroyed() {
    Object(dom_["off"])(document, 'mouseup', this.mouseUpDocumentHandler);
  }
});
// CONCATENATED MODULE: ./packages/bar.vue?vue&type=script&lang=js&
 /* harmony default export */ var packages_barvue_type_script_lang_js_ = (barvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/bar.vue





/* normalize component */

var bar_component = Object(componentNormalizer["a" /* default */])(
  packages_barvue_type_script_lang_js_,
  barvue_type_template_id_005121ff_render,
  barvue_type_template_id_005121ff_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var bar_api; }
bar_component.options.__file = "packages/bar.vue"
/* harmony default export */ var bar = (bar_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/table/src/table.vue?vue&type=script&lang=js&
function tablevue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function tablevue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { tablevue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { tablevue_type_script_lang_js_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { tablevue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function tablevue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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









/* $emit
*      click-row:  {row: 当前点击row, idx: row索引(第几行), event: 点击事件},
*      sort-change:  column:当前排序变化的列node, sortColumns:所有排序的列的node
*/

/* harmony default export */ var tablevue_type_script_lang_js_ = ({
  name: "EleRwTable",
  directives: {
    'mousewheel': v_mousewheel_["MouseWheel"]
  },
  provide: function provide() {
    return {
      table: this,
      store: this.store
    };
  },
  props: {
    tableCols: {
      default: function _default() {
        return [];
      } //{ key:'xx' ,lable:'xx',render:fn,renderHeader:fn}

    },
    tableData: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    height: {
      type: Number | String,
      default: 'auto',
      desc: '定义height就表示外部高度固定了(有滚动条),不定义就是无限增长模式(无滚动条)'
    },
    maxHeight: {
      type: Number,
      default: null
    },
    minHeight: {
      type: Number,
      default: null
    }
  },
  components: {
    EmptySlot: main["a" /* default */],
    TableHeader: table_header,
    TableBody: table_body,
    Bar: bar
  },
  data: function data() {
    this.store = new store();
    var barWidth = Math.ceil(Object(dom_["getScrollBarWidth"])());
    return {
      headerWrapHeight: 0,
      //header内容高度
      bodyWrapHeight: 0,
      //bodywrap内容高度
      bodyWrapWidth: 0,
      //bodywrap内容宽度
      scrollWrapHeight: 0,
      //滚动区域高度， fixed left/right body 高度应该与此一致，
      barWidth: barWidth,
      //滚动条宽度
      dpr: window.devicePixelRatio,
      //dpr变化导致滚动条宽度也变了。
      //滚动相关
      sizeWidth: 0,
      //滚动条宽度
      sizeHeight: 0,
      //滚动条高度
      moveX: 0,
      moveY: 0,
      scrollLeft: 0,
      scrollTop: 0,
      scrollPosition: 'left'
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.initEvent();
    setTimeout(function () {
      _this.updateScrollBar();
    });
  },
  computed: tablevue_type_script_lang_js_objectSpread({
    showLeftShadow: function showLeftShadow() {
      var scrollX = Number(this.sizeWidth),
          //水平可滚动
      scrollPosition = this.scrollPosition,
          empty = this.empty;
      return scrollX && scrollPosition !== 'left' && !empty;
    },
    showRightShadow: function showRightShadow() {
      var scrollX = Number(this.sizeWidth),
          scrollPosition = this.scrollPosition,
          empty = this.empty;
      return scrollX && scrollPosition !== 'right' && !empty;
    }
  }, Object(index_["mapping"])('store', {
    containerWidth: function containerWidth(store) {
      return store.containerWidth || 0;
    },
    fixedLeftCount: function fixedLeftCount(store) {
      return store.fixedLeftCount || 0;
    },
    fixedLeftWidth: function fixedLeftWidth(store) {
      return store.fixedLeftWidth || 0;
    },
    fixedRightCount: function fixedRightCount(store) {
      return store.fixedRightCount || 0;
    },
    fixedRightWidth: function fixedRightWidth(store) {
      return store.fixedRightWidth || 0;
    },
    tableBodyHeight: function tableBodyHeight(store) {
      return store.tableBodyHeight || 0;
    },
    tableBodyWidth: function tableBodyWidth(store) {
      return store.tableBodyWidth || 0;
    },
    empty: function empty(store) {
      return !store.tableData || store.tableData.length === 0;
    }
  })),
  methods: {
    calcElStyle: function calcElStyle() {
      var style = {};
      style.height = typeof this.height === 'number' ? "".concat(this.height, "px") : this.height;
      if (this.minHeight) style.minHeight = this.minHeight + 'px';
      if (this.maxHeight) style.maxHeight = this.maxHeight + 'px';
      return style;
    },
    //内部wrap样式
    calcInnerStyle: function calcInnerStyle() {
      var style = {},
          W = this.containerWidth;
      style.width = Math.min(W, this.bodyWrapWidth || this.tableBodyWidth) + 'px';

      if (this.height === 'auto') {
        //内容增长模式
        var min = this.minHeight,
            max = this.maxHeight;
        var contentH;

        if (this.empty) {
          contentH = this.headerWrapHeight; //内容高度
        } else {
          contentH = this.headerWrapHeight + this.bodyWrapHeight; //内容高度
        }

        if (min && !max) {
          style.height = Math.max(contentH, min) + 'px';
        } else if (!min && max) {
          style.height = Math.min(contentH, max) + 'px';
        } else if (min && max) {
          style.height = Object(index_["clamp"])(contentH, min, max) + 'px';
        } else {
          style.height = contentH + 'px';
        }
      } else {
        //高度受限于外部
        style.height = '100%';
      }

      return style;
    },
    //初始化
    initEvent: function initEvent() {
      var _this2 = this;

      var un = Object(dom_["on"])(window, 'resize', function () {
        var dpr = window.devicePixelRatio;

        if (dpr != _this2.dpr) {
          _this2.dpr = dpr;
          _this2.barWidth = Math.ceil(Object(dom_["getScrollBarWidth"])());
          console.log(_this2.barWidth);
        }
      }); //初始化滚动组件关联

      var view = this.$refs.scrollView,
          barX = this.$refs.barX,
          barY = this.$refs.barY;
      barX.wrap = barY.wrap = view; //监听

      var el = this.$el;
      var headerWrap = this.$refs.headerWrap;
      var bodyWrap = this.$refs.bodyWrap;
      var scrollWrap = this.$refs.scrollWrap;
      var ro = new external_resize_observer_polyfill_default.a(function (entries) {
        var elEn = entries.find(function (en) {
          return en.target === el;
        });

        if (elEn) {
          var w = el.clientWidth,
              h = el.clientHeight;

          if (w && h) {
            _this2.store.containerWidth = w;
          }
        }

        var hwEn = entries.find(function (en) {
          return en.target === headerWrap;
        });

        if (hwEn) {
          _this2.headerWrapHeight = headerWrap.offsetHeight;
        }

        var bwEn = entries.find(function (en) {
          return en.target === bodyWrap;
        });

        if (bwEn && !_this2.empty) {
          _this2.bodyWrapHeight = bodyWrap.offsetHeight;
          _this2.bodyWrapWidth = bodyWrap.offsetWidth;
        }

        var swEn = entries.find(function (en) {
          return en.target === scrollWrap;
        });

        if (swEn && !_this2.empty) {
          _this2.scrollWrapHeight = scrollWrap.offsetHeight;
        }

        _this2.$nextTick(function () {
          _this2.updateScrollBar();
        });
      });
      ro.observe(el);
      ro.observe(headerWrap);
      ro.observe(bodyWrap);
      ro.observe(scrollWrap);
      this.$once("hooK:beforeDestroy", function () {
        ro.disconnect();
        un();
      });
    },

    /*在中间非固定表滚动时*/
    handleScroll: function handleScroll(e) {
      var _this3 = this;

      var target = this.$refs.scrollView,
          leftWrap = this.$refs.leftScrollWrap,
          rightWrap = this.$refs.rightScrollWrap,
          header = this.$refs.headerWrap;
      this.scrollLeft = target.scrollLeft;
      this.scrollTop = target.scrollTop;

      if (target.scrollWidth > target.clientWidth) {
        //存在滚动条
        if (this.scrollLeft === 0) {
          this.scrollPosition = "left";
        } else if (this.scrollLeft === target.scrollWidth - target.clientWidth) {
          this.scrollPosition = "right";
        } else {
          this.scrollPosition = "middle";
        }
      }

      this.moveX = target.scrollLeft * 100 / target.clientWidth;
      this.moveY = target.scrollTop * 100 / target.clientHeight;
      [leftWrap, rightWrap].forEach(function (w) {
        if (w) {
          w.scrollTop = _this3.scrollTop;
        }
      });

      if (header) {
        header.scrollLeft = this.scrollLeft;
      }
    },
    //更新滚动条宽高
    updateScrollBar: function updateScrollBar() {
      var heightPercentage, widthPercentage;
      var wrap = this.$refs.scrollView;
      if (!wrap) return; //bug ? chrome 表格高度为 144px, scrollHeight却有145px;

      if (wrap.scrollHeight - wrap.clientHeight <= 1) {
        heightPercentage = 100;
      } else {
        heightPercentage = wrap.clientHeight * 100 / wrap.scrollHeight;
      }

      widthPercentage = wrap.clientWidth * 100 / wrap.scrollWidth;
      this.sizeHeight = heightPercentage < 100 ? heightPercentage : 0;
      this.sizeWidth = widthPercentage < 100 ? widthPercentage : 0;
    },

    /*在固定的列上滚动时*/
    handleFixedMousewheel: function handleFixedMousewheel(event, data) {
      var scrollView = this.$refs.scrollView;
      if (!scrollView) return;

      if (Math.abs(data.spinY) > 0) {
        var currentScrollTop = scrollView.scrollTop;

        if (data.pixelY < 0 && currentScrollTop !== 0) {
          event.preventDefault();
        }

        if (data.pixelY > 0 && scrollView.scrollHeight - scrollView.clientHeight > currentScrollTop) {
          event.preventDefault();
        }

        scrollView.scrollTop += Math.ceil(data.pixelY / 5);
      } else {
        scrollView.scrollLeft += Math.ceil(data.pixelX / 5);
      }
    },

    /*鼠标离开组件时*/
    mouseLeaveTable: function mouseLeaveTable() {
      this.store.curHoverIdx = null;
    },

    /*代理子组件事件*/
    dispatchEvent: function dispatchEvent(topic) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.$emit.apply(this, [topic].concat(args));
    },
    //列相关
    getSortColumnNodes: function getSortColumnNodes() {
      return this.store.sortColumns;
    },
    //清空所有选中对象
    clearSelectedRow: function clearSelectedRow() {
      this.store.curSelectIdx = null;
    }
  },
  watch: {
    tableCols: {
      handler: function handler(cols) {
        if (cols && cols.length) {
          this.store.computedCols(cols); //计算列信息

          this.store.computedColWidth(); //计算table宽度
        }
      },
      immediate: true
    },
    tableData: {
      handler: function handler(newly, older) {
        var _this4 = this;

        if (newly !== older) {
          this.store.tableData = newly || [];
          this.$nextTick(function () {
            [_this4.$refs.scrollView, _this4.$refs.leftScrollWrap, _this4.$refs.rightScrollWrap].forEach(function (wrap) {
              if (wrap) {
                wrap.scrollTop = wrap.scrollLeft = 0;
              }
            });
          });
        }
      },
      immediate: true
    }
  }
});
// CONCATENATED MODULE: ./packages/table/src/table.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_tablevue_type_script_lang_js_ = (tablevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(4);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options!./packages/table/src/table.vue?vue&type=style&index=0&lang=less&
var tablevue_type_style_index_0_lang_less_ = __webpack_require__(9);

// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options!./packages/table/src/table.vue?vue&type=style&index=0&lang=less&

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = injectStylesIntoStyleTag_default()(tablevue_type_style_index_0_lang_less_["a" /* default */], options);



/* harmony default export */ var src_tablevue_type_style_index_0_lang_less_ = (tablevue_type_style_index_0_lang_less_["a" /* default */].locals || {});
// CONCATENATED MODULE: ./packages/table/src/table.vue?vue&type=style&index=0&lang=less&
 /* harmony default export */ var table_src_tablevue_type_style_index_0_lang_less_ = (src_tablevue_type_style_index_0_lang_less_); 
// CONCATENATED MODULE: ./packages/table/src/table.vue






/* normalize component */

var table_component = Object(componentNormalizer["a" /* default */])(
  src_tablevue_type_script_lang_js_,
  tablevue_type_template_id_493fe34e_render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var table_api; }
table_component.options.__file = "packages/table/src/table.vue"
/* harmony default export */ var src_table = (table_component.exports);
// CONCATENATED MODULE: ./packages/table/index.js


src_table.install = function (Vue) {
  Vue.component(src_table.name, src_table);
};

/* harmony default export */ var packages_table = __webpack_exports__["default"] = (src_table);

/***/ })
/******/ ]);