"use strict";

exports.__esModule = true;
exports.isDefined = isDefined;
exports.asyncWrap = asyncWrap;
exports.rafThrottle = rafThrottle;
exports.mapping = mapping;
exports.clamp = clamp;
exports.isObject = exports.get = exports.debounce = exports.clone = exports.cloneDeep = exports.throttle = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function isDefined(obj) {
  return !(obj === null || obj === undefined);
}

function asyncWrap(_x) {
  return _asyncWrap.apply(this, arguments);
}

function _asyncWrap() {
  _asyncWrap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(promiseLike) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(promiseLike instanceof Promise || promiseLike.then && typeof promiseLike.then === 'function')) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", promiseLike.then(function (res) {
              return [res, null];
            }).catch(function (e) {
              return [null, e];
            }));

          case 4:
            return _context.abrupt("return", [promiseLike, null]);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _asyncWrap.apply(this, arguments);
}

function rafThrottle(step) {
  if (!(step instanceof Function)) return;
  var lock = false;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!lock) {
      lock = true;
      var self = this;
      requestAnimationFrame(function () {
        var res;

        try {
          res = step.call.apply(step, [self].concat(args));

          if (res && (res instanceof Promise || res.then && res.then instanceof Function)) {
            res.then(function () {
              lock = false;
            });
          } else {
            lock = false;
          }
        } catch (e) {
          lock = false;
          console.log(e);
          throw e;
        }
      });
    }
  };
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

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

var throttle = require('loadsh/throttle.js');

exports.throttle = throttle;

var cloneDeep = require('loadsh/cloneDeep');

exports.cloneDeep = cloneDeep;

var clone = require('loadsh/clone');

exports.clone = clone;

var debounce = require('loadsh/debounce');

exports.debounce = debounce;

var get = require('loadsh/get');

exports.get = get;

var isObject = require('loadsh/isObject');

exports.isObject = isObject;