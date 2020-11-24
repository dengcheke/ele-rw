export function isDefined(obj) {
    return !(obj === null || obj === undefined)
}


//async包装器,异步转同步写法,无需try捕获错误
/*
    e.g
        let [res,err] = await asyncWrap(asyncApi(xx));
        if(res){
            // handle success
        }else{
            // handle error
        }

    equals to
        try{
            let res = await asyncApi(xx);
            //handle success
        }catch(err){
            //handle error
        }
    or
        asyncApi(xx).then(res=>{
            //handle success
        }).catch( err=> {
            //hanlde error
        })
*/
export async function asyncWrap(promiseLike) {
    if (promiseLike instanceof Promise) {
        return promiseLike.then(res => [res, undefined]).catch(e => [undefined, e]);
    } else if (promiseLike && promiseLike.then && typeof promiseLike.then === 'function') {
        return new Promise((resolve, reject) => {
            try {
                promiseLike.then(_res => resolve([_res, undefined]));
            } catch (e) {
                resolve([undefined, e]);
            }
        });
    } else if (promiseLike instanceof Error) {
        return [undefined, promiseLike]; // equal to  return Promise.resolve([undef,res]);
    } else {
        return [promiseLike, undefined]; // equal to  return Promise.resolve([res,undef]);
    }
}

//节流的帧版本
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
                    console.error(e);
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

//转驼峰
export function getKebabCase(str) {
    let res = String(str).replace(/[A-Z]/g, function (item) {
        return '-' + item.toLowerCase()
    })
    if (res[0] === "-") {
        res = res.substring(1)
    }
    return res;
}

//object 转 style字符串
export function objectToStyleString(obj) {
    return Object.keys(obj).reduce((res, key) => {
        res += `${getKebabCase(key)}:${obj[key]};\n`
        return res;
    }, '')
}

// array diff 算法， 返回[ resA,resCommon,resB ]
// resA, resCommon, resB 均为数组，
// 内容每一项为以下：
// [item, item index in arrayA, item index in arrayB]
const _equals = (a, b) => a === b;
export function arrayDiff(A, B, equals = _equals) {
    debugger
    if (!Array.isArray(A) || !Array.isArray(B)) throw new Error('invalid params');
    let arrA = [...A], arrB = [...B];
    let aStart = 0, aEnd = arrA.length - 1,
        aStartObj = arrA[0], aEndObj = arrA[aEnd],
        bStart = 0, bEnd = arrB.length - 1,
        bStartObj = arrB[0], bEndObj = arrB[bEnd];
    let onlyA = [], common = [], onlyB = [];
    while (aStart <= aEnd && bStart <= bEnd) {
        if (!isDefined(aStartObj)) {
            aStartObj = arrA[++aStart];
        } else if (!isDefined(bStartObj)) {
            bStartObj = arrB[++bStart];
        } else if (equals(aStartObj, bStartObj)) {
            common.push([aStartObj, aStart,/*index in arrA*/ bStart /*index in arrB*/]);
            aStartObj = arrA[++aStart];
            bStartObj = arrB[++bStart];
        } else if (equals(aEndObj, bEndObj)) {
            common.push([aEndObj, aEnd, bEnd])
            aEndObj = arrA[--aEnd];
            bEndObj = arrB[--bEnd];
        } else if (equals(aStartObj, bEndObj)) {
            common.push([aStartObj, aStart, bEnd])
            aStartObj = arrA[++aStart];
            bEndObj = arrB[--bEnd];
        } else if (equals(aEndObj, bStartObj)) {
            common.push([aEndObj, aEnd, bStart]);
            aEndObj = arrA[--aEnd];
            bStartObj = arrB[++bStart];
        } else {
            let find = false;
            //在 astart ~ aend之间寻找 bstartObj
            for (let i = aStart + 1; i <= aEnd - 1; i++) {
                let objA = arrA[i];
                if (equals(objA, bStartObj)) {//finded
                    find = true;
                    common.push([bStartObj, i, bStart]);
                    arrA[i] = undefined; //找到后标记为undefined
                    bStartObj = arrB[++bStart];
                    break;
                }
            }
            if (!find) {
                onlyB.push([bStartObj, undefined, bStart]);
                bStartObj = arrB[++bStart];
            }
        }
    }
    if (aStart > aEnd) {
        for (let i = bStart; i <= bEnd; i++) {
            arrB[i] && onlyB.push(arrB[i], undefined, i);
        }
    } else if (bStart > bEnd) {
        for (let i = aStart; i <= aEnd; i++) {
            arrA[i] && onlyA.push([arrA[i], i, undefined]);
        }
    }
    return [onlyA,common,onlyB];
}

export function treeToArray(root,childKey='children',dfs=true){
    let queue = [].concat(root), res = [];
    while(queue.length){
        const first = queue.shift();
        res.push(first);
        if(first[childKey] && Array.isArray(first[childKey])){
            queue = dfs
                ? [...first[childKey],...queue] //深度
                : [...queue,...first[childKey]] //广度
        }
    }
    return res;
}
export function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

export const throttle = require('loadsh/throttle.js');
export const cloneDeep = require('loadsh/cloneDeep');
export const clone = require('loadsh/clone');
export const debounce = require('loadsh/debounce');
export const get = require('loadsh/get');
export const isObject = require('loadsh/isObject');
