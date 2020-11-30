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

//遍历树节点,cb返回walkTreeNode.STOP停止遍历
export const walkTreeNode = function (root, cb, childrenKey = 'children', dfs = true, startLevel = 0) {
    let queue = [].concat(root).map(i => [i, null, startLevel]); //[self,parent,level]
    while (queue.length) {
        const [self, parent, level] = queue.shift();
        const children = self[childrenKey];
        const res = cb(self, parent, children, level);
        if (res === walkTreeNode.STOP) break;
        if (!Array.isArray(children)) continue;
        const arr = children.map(i => [i, self, level + 1]);
        queue = dfs
            ? [...arr, ...queue]
            : [...queue, ...arr]
    }
}
Object.defineProperty(walkTreeNode, 'STOP', {
    value: Symbol()
})


const a = 12.0128358864784, b = 0.542452259603295;

/*
*  获取滚动scrollValue值需要的时间,最多800ms
*  y=ax^b,
*/
function getScrollTotalTime(scrollValue) {
    return Math.min(a * Math.pow(scrollValue, b) >> 0, 800);
}

/**
 * 滚动动画
 * @param from, 开始值
 * @param to, 结束值
 * @param rafCb, 回调函数,每帧一次
 */
export function animationScrollTop(from, to, rafCb, isDone) {
    //总值
    const scrollValue = to - from;
    //总时间
    const totalTime = getScrollTotalTime(Math.abs(scrollValue));
    let timer;
    const res = {
        from: from,
        to: to,
        totalTime: totalTime,
        walkTime: 0,//已经走过时间
        value: from,//当前值,
        isDone: false, //是否已完成
        cancel: () => {
            timer && cancelAnimationFrame(timer);
        }
    }
    let now = performance.now(); //当前时间
    timer = requestAnimationFrame(function step() {
        let _now = performance.now(), cancel = false;
        const walkTime = (_now - now) >> 0;
        res.walkTime += walkTime;
        if (res.walkTime > res.totalTime) {
            res.walkTime = res.totalTime;
            cancel = true;
        }
        const percent = res.walkTime / res.totalTime;
        const [x, y] = threeBezier(percent, [0, 0], [1, 1], [0.5, 1], [0.5, 0]);
        res.value = (scrollValue * y >> 0) + from; //新值
        if (cancel) {
            res.cancel();
            res.isDone = true;
            isDone();
        } else {
            timer = requestAnimationFrame(step);
        }
        rafCb(res);
    })
}

/**
 * @desc 三阶贝塞尔
 * @param {number} t 当前百分比
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 * @param {Array} cp1 控制点1
 * @param {Array} cp2 控制点2
 */
function threeBezier(t, p1, cp1, cp2, p2) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const [cx1, cy1] = cp1;
    const [cx2, cy2] = cp2;
    let x =
        x1 * (1 - t) * (1 - t) * (1 - t) +
        3 * cx1 * t * (1 - t) * (1 - t) +
        3 * cx2 * t * t * (1 - t) +
        x2 * t * t * t;
    let y =
        y1 * (1 - t) * (1 - t) * (1 - t) +
        3 * cy1 * t * (1 - t) * (1 - t) +
        3 * cy2 * t * t * (1 - t) +
        y2 * t * t * t;
    return [x, y];
}
