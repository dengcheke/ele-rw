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
        s = style.apply(null, args);
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
        c = clazz.apply(null, args)
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
    value: window.Symbol ? Symbol() : '随便一个唯一值'
})


const baseFrameMap = [3, 6, 8, 9, 10, 11, 12, 13, 13, 14, 15, 15, 16, 17, 17]
const _fMap = {};

function getScrollTotalTimes(v) {
    if (_fMap[v / 20 >> 0]) return _fMap[v / 20 >> 0] * 16.66;
    let f = getFrame(v, Math.ceil(Math.log2(v / 300)));
    v > 160 && (f += 1);
    f = Math.min(40, f);
    return f * 16.66;

    function getFrame(v, e) {
        if (e <= 0) {
            return baseFrameMap[(v / 20 - 1) >> 0];
        } else {
            const idx = v / 20 >> 0;
            if (_fMap[idx]) return _fMap[idx];
            const _v = 300 * Math.pow(2, e - 1);
            const res = getFrame(_v, e - 1) + (v - _v) / (20 * (e + 1)) >> 0;
            _fMap[idx] = res;
            return res;
        }
    }
}

/**
 * 滚动动画
 * @param from, 开始值
 * @param to, 结束值
 * @param rafCb, 回调函数,每帧一次
 */
export function animationScrollValue(from, to, rafCb, isDone) {
    if(from===to) throw  new Error('from和to不能相同');
    if(typeof rafCb !== 'function') throw  new Error('rafcb must be function');
    //总值
    const scrollValue = to - from, absSv = Math.abs(scrollValue);
    //总时间
    const totalTime = absSv <= 10 ? 0 : getScrollTotalTimes(absSv);
    let timer;
    const res = {
        from: from,
        to: to,
        totalTime: totalTime,
        walkTime: 0,//已经走过时间
        delta: 0,
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
        now = _now;
        res.walkTime += walkTime;
        if (res.walkTime > res.totalTime) {
            res.walkTime = res.totalTime;
            cancel = true;
        }
        const percent = res.walkTime / res.totalTime;
        const [x, y] = threeBezier(percent,
            [0, 0], [1, 1],
            [0.5, 0.1], [0.5, 0.9]);
        let newValue = (scrollValue * y >> 0) + from; //新值
        res.delta = newValue - res.value;
        //console.log(res.delta)
        res.value = newValue;
        if (cancel) {
            res.cancel();
            res.isDone = true;
            isDone instanceof Function && isDone.call(res,res);
        } else {
            timer = requestAnimationFrame(step);
        }
        rafCb.call(res,res);
    });
    return res;
}

/**
 * @desc 三阶贝塞尔
 * @param {number} t 当前百分比
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 * @param {Array} cp1 控制点1
 * @param {Array} cp2 控制点2
 */
function threeBezier(t, p1, p2, cp1, cp2,) {
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
