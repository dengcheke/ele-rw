"use strict";

exports.__esModule = true;
exports.MouseWheel = void 0;

var _normalizeWheel = _interopRequireDefault(require("normalize-wheel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

var mousewheel = function mousewheel(element, callback) {
  if (element && element.addEventListener) {
    element.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', function (event) {
      var normalized = (0, _normalizeWheel.default)(event);
      callback && callback.apply(this, [event, normalized]);
    });
  }
};

var MouseWheel = {
  bind: function bind(el, binding) {
    mousewheel(el, binding.value);
  }
};
exports.MouseWheel = MouseWheel;