"use strict";

exports.__esModule = true;
exports.getScrollBarWidth = getScrollBarWidth;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.getStyle = exports.removeResizeListener = exports.addResizeListener = exports.removeIntersectListener = exports.addIntersectListener = exports.IntersectionObserver = exports.off = exports.on = void 0;

var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var on = function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
        return function () {
          element.removeEventListener(event, handler, false);
        };
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
        return function (element, event, handler) {
          element.detachEvent('on' + event, handler);
        };
      }
    };
  }
}();

exports.on = on;

var off = function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
}();
/*-------intersect observer----------*/


exports.off = off;

require('intersection-observer');

var IntersectionObserver = window.IntersectionObserver; //即使listener为空，observer仍然存在

exports.IntersectionObserver = IntersectionObserver;

var intersectHandler = function intersectHandler(entries) {
  var _loop = function _loop() {
    var entry = _step.value;
    var listeners = entry.target.__intersectListeners__ || [];

    if (listeners.length) {
      listeners.forEach(function (fn) {
        fn(entry);
      });
    }
  };

  for (var _iterator = _createForOfIteratorHelperLoose(entries), _step; !(_step = _iterator()).done;) {
    _loop();
  }
};

var addIntersectListener = function addIntersectListener(element, fn, opts) {
  if (typeof fn !== 'function' || !(element instanceof HTMLElement)) return;

  if (!element.__intersectListeners__) {
    element.__intersectListeners__ = [];
    var io = element.__intersectObserver__ = new IntersectionObserver(intersectHandler, opts || {});
    io.observe(element);
  }

  element.__intersectListeners__.push(fn);

  return function () {
    removeIntersectListener(element, fn);
  };
};

exports.addIntersectListener = addIntersectListener;

var removeIntersectListener = function removeIntersectListener(element, fn) {
  var listeners = element.__intersectListeners__;
  if (!element || !listeners) return;

  if (fn) {
    listeners.splice(listeners.indexOf(fn), 1);
  } else {
    element.__intersectListeners__ = null;

    element.__intersectObserver__.disconnect();

    element.__intersectObserver__ = null;
  }
};
/*-------resize observer--------*/


exports.removeIntersectListener = removeIntersectListener;

//即使listener为空，observer仍然存在
var resizeHandler = function resizeHandler(entries) {
  var _loop2 = function _loop2() {
    var entry = _step2.value;
    var listeners = entry.target.__resizeListeners__ || [];

    if (listeners.length) {
      listeners.forEach(function (fn) {
        fn(entry);
      });
    }
  };

  for (var _iterator2 = _createForOfIteratorHelperLoose(entries), _step2; !(_step2 = _iterator2()).done;) {
    _loop2();
  }
};

var addResizeListener = function addResizeListener(element, fn) {
  if (typeof fn !== 'function' || !(element instanceof HTMLElement)) return;

  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    var ro = element.__resizeObserver__ = new _resizeObserverPolyfill.default(resizeHandler);
    ro.observe(element);
  }

  element.__resizeListeners__.push(fn);

  return function () {
    removeResizeListener(element, fn);
  };
};

exports.addResizeListener = addResizeListener;

var removeResizeListener = function removeResizeListener(element, fn) {
  var listeners = element.__resizeListeners__;
  if (!element || !listeners) return;

  if (fn) {
    listeners.splice(listeners.indexOf(fn), 1);
  } else {
    element.__resizeListeners__ = null;

    element.__resizeObserver__.disconnect();

    element.__resizeObserver__ = null;
  }
};

exports.removeResizeListener = removeResizeListener;

function getScrollBarWidth() {
  var noScroll,
      scroll,
      oDiv = document.createElement('div');
  oDiv.style.cssText = 'position:absolute; top:-9999px;width:100px; height:100px; overflow:hidden;visibility:hidden';
  noScroll = document.body.appendChild(oDiv).clientWidth;
  oDiv.style.overflowY = 'scroll';
  scroll = oDiv.clientWidth;
  document.body.removeChild(oDiv);
  return noScroll - scroll; //向上取整 不缓存
} //获得样式


var getStyle = function () {
  if (window.document.currentStyle) {
    return function (dom, attr) {
      return attr ? dom.currentStyle[attr] : dom.currentStyle;
    };
  } else {
    return function (dom, attr) {
      return attr ? getComputedStyle(dom, false)[attr] : getComputedStyle(dom, false);
    };
  }
}();

exports.getStyle = getStyle;

function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');

  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}

function trim(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}
/**
 * 给元素添加 class
 * @param el  htmlElement
 * @param cls Array<String> | String(空格分隔)
 */


function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className,
      classes;

  if (Array.isArray(cls)) {
    classes = cls;
  } else if (typeof cls === 'string') {
    classes = (cls || '').split(' ');
  } else {
    throw new Error("\u65E0\u6548\u7684\u683C\u5F0F,\u5E94\u4E3A Array<String> \u6216\u8005 String(\u7A7A\u683C\u5206\u9694)");
  }

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }

  if (!el.classList) {
    el.className = curClass;
  }
}
/**
 * 移除样式
 * @param el htmlElement
 * @param cls Array<String> | String(空格分隔)
 */


function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes;

  if (Array.isArray(cls)) {
    classes = cls;
  } else if (typeof cls === 'string') {
    classes = cls.split(' ');
  } else {
    throw new Error("\u65E0\u6548\u7684\u683C\u5F0F,\u5E94\u4E3A Array<String> \u6216\u8005 String(\u7A7A\u683C\u5206\u9694)");
  }

  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }

  if (!el.classList) {
    el.className = trim(curClass);
  }
}