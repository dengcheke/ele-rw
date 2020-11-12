export function isDefined(obj) {
    return !(obj === null || obj === undefined)
}

export async function asyncWrap(promiseLike) {
    if (promiseLike instanceof Promise || (promiseLike.then && typeof promiseLike.then === 'function')) {
        return promiseLike.then(res => [res, null]).catch(e => [null, e]);
    } else {
        return [promiseLike, null];
    }
}

export function rafThrottle(step) {
    if (!(step instanceof Function)) return;
    let lock = false;
    return function (...args) {
        if (!lock) {
            lock = true;
            const self = this;
            requestAnimationFrame(() => {
                let res;
                try {
                    res = step.call(self, ...args);
                    if (res && (
                        res instanceof Promise || (res.then && res.then instanceof Function)
                    )) {
                        res.then(() => {
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
    }
}

export function mapping(attrName, mapper) {
    const res = {};
    Object.keys(mapper).forEach(key => {
        const value = mapper[key];
        let fn;
        if (typeof value === 'string') {
            fn = function () {
                return this[attrName] ? this[attrName][value] : null;
            };
        } else if (typeof value === 'function') {
            fn = function () {
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

export function clamp(n,min,max){
    return Math.max(min, Math.min(max, n));
}

export const throttle = require('loadsh/throttle.js');
export const cloneDeep = require('loadsh/cloneDeep');
export const clone = require('loadsh/clone');
export const debounce = require('loadsh/debounce');
export const get = require('loadsh/get');
export const isObject = require('loadsh/isObject');
