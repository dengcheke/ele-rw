import Vue from "vue";
import {getScrollBarWidth, on} from "@src/utils/dom";

//滚动条宽度监听器
export const barWidthOb = Vue.observable({
    barWidth: Math.ceil(getScrollBarWidth())
});
let _dpr = window.devicePixelRatio;
on(window, 'resize', () => {
    const dpr = window.devicePixelRatio;
    if (dpr !== _dpr) {
        _dpr = dpr;
        barWidthOb.barWidth = Math.ceil(getScrollBarWidth());
    }
});

//table 全局 id
let tableGlobalId = 0;

export function getTableId() {
    return ++tableGlobalId
}

//col 全局 id
let colGlobalId = 0;

export function getColId() {
    return ++colGlobalId;
}

//style class 解析
const _toString = Object.prototype.toString,
    _Object = '[object Object]',
    _Function = '[object Function]',
    _Array = '[object Array]',
    _Set = '[object Set]';

/**
 * 解析宽度
 * @param v 当前宽度
 * @param W 整体宽度值
 * @returns {number}
 */
export function parseWidth(v, W) {
    const vStr = String(v);
    v = parseFloat(vStr);
    if (isNaN(v)) return 0;
    if (vStr.indexOf('px') !== -1) { //100.5px, v = 100.5; 取整
        return v >> 0;
    } else if (vStr.indexOf('%') !== -1) { //20.5% v = 20.5, W * 20.5% 然后取整
        return (W * v / 100) >> 0;
    } else {
        return v >> 0;
    }
}

//获取样式 object|function
export function resolveStyle(style, ...args) {
    if (!style) return {};
    let s, type = _toString.call(style);
    if (type === _Object) {
        s = style
    } else if (type === _Function) {
        s = style.call(null, args);
        if (_toString.call(s) !== _Object) {
            throw new Error('style func must return an object');
        }
    } else {
        throw new Error('style must be object or function');
    }
    return s;
}

//获取class string | Object | array<string> | function
export function resolveClass(clazz, ...args) {
    if (!clazz) return {};
    let c, type = _toString.call(clazz);
    if (type === _Object) {
        c = clazz
    } else if (type === _Function) {
        c = clazz.call(null, args)
        if (_toString.call(c) === _Function) {
            throw new Error('invalid value class func returned');
        } else {
            c = resolveClass(c)
        }
    } else if (Array.isArray(clazz)) {
        c = clazz.reduce((res, cur) => {
            res[String(cur)] = true;
            return res;
        }, {})
    } else {
        c = {[String(clazz)]: true}
    }
    return c;
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

export function appendRow(list, row) {
    let i = list.indexOf(row);
    if (i === -1) list.push(row);
}

export function removeRow(list, row) {
    let i = list.indexOf(row);
    if (i !== -1) list.splice(i, 1);
}

//****
export function moveItemNewHasInOld(iter, older, newly) {
    let type = _toString.call(older);
    if (type === _Array) {
        moveItemNewHasInOld_Array(iter, older, newly);
    } else if (type === _Set) {
        moveItemNewHasInOld_Set(iter, older, newly);
    } else {
        throw new Error('??奇怪的类型')
    }
}
export function moveItemNewHasInOld_Array(iter, oldArr, arr) {
    iter.forEach(item => {
        let i = oldArr.indexOf(item);
        if (i !== -1) {
            arr.push(item);
            oldArr.splice(i, 1);
        }
    });
}
export function moveItemNewHasInOld_Set(iter, oldSet, s) {
    iter.forEach(item => {
        if (oldSet.has(item)) {
            s.add(item);
            oldSet.delete(item);
        }
    })
}
//****


export const isNotEmptyArray = (array) => (Array.isArray(array) && array.length);

//遍历树节点
export function walkTreeNode(root, cb, childrenKey = 'children', lazyKey = 'hasChildren') {
    function _walker(self, parent, children, level) {
        cb(self, parent, children, level);
        Array.isArray(children) && children.forEach(item => {
            /*if (item[lazyKey]) {
                cb(item, null, null, level + 1);
                return;
            }*/
            _walker(item, self, item[childrenKey], level + 1);
        });
    }

    [].concat(root).forEach(item => {
        /*if (item[lazyKey]) {
            cb(item, null, null, 0);
            return;
        }*/
        _walker(item, null, item[childrenKey], 0);
    });
}
