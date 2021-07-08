let passiveSupported = false;
try {
    const options = Object.defineProperty({}, "passive", {
        get: function() {
            passiveSupported = true;
        }
    });
    window.addEventListener("passive-test", null, options);
} catch(err) {
    console.log(err)
}
export const on = (function () {
    if (document.addEventListener) {
        return function (element, event, handler,opts) {
            if (element && event && handler) {
                element.addEventListener(event, handler, passiveSupported ? opts : false);
                return function () {
                    element.removeEventListener(event, handler, passiveSupported ? opts : false);
                }
            }
        };
    } else {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler);
                return function (element, event, handler) {
                    element.detachEvent('on' + event, handler);
                }
            }
        };
    }
})();
export const off = (function () {
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
})();

/*-------intersect observer----------*/
require('intersection-observer');
export const IntersectionObserver = window.IntersectionObserver;
const intersectHandler = function (entries) {
    for (let entry of entries) {
        const listeners = entry.target.__intersectListeners__ || [];
        if (listeners.length) {
            listeners.forEach(fn => {
                fn(entry);
            });
        }
    }
}
export const addIntersectListener = function (element, fn, opts) {
    if (typeof fn !== 'function' || !(element instanceof HTMLElement)) return;
    if (!element.__intersectListeners__) {
        element.__intersectListeners__ = [];
        const io = element.__intersectObserver__ = new IntersectionObserver(intersectHandler, opts || {});
        io.observe(element);
    }
    element.__intersectListeners__.push(fn);
    return function () {
        removeIntersectListener(element, fn);
    }
}
export const removeIntersectListener = function (element, fn) {
    const listeners = element.__intersectListeners__;
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
import ResizeObserver from 'resize-observer-polyfill';
//即使listener为空，observer仍然存在
const resizeHandler = function (entries) {
    for (let entry of entries) {
        const listeners = entry.target.__resizeListeners__ || [];
        if (listeners.length) {
            listeners.forEach(function(fn){
                fn(entry);
            });
        }
    }
};
export const addResizeListener = function (element, fn) {
    if (typeof fn !== 'function' || !(element instanceof HTMLElement)) return;
    if (!element.__resizeListeners__) {
        element.__resizeListeners__ = [];
        const ro = element.__resizeObserver__ = new ResizeObserver(resizeHandler);
        ro.observe(element);
    }
    element.__resizeListeners__.push(fn);
    return function () {
        removeResizeListener(element, fn);
    }
};
export const removeResizeListener = function (element, fn) {
    const listeners = element.__resizeListeners__;
    if (!element || !listeners) return;
    if (fn) {
        listeners.splice(listeners.indexOf(fn), 1);
    } else {
        element.__resizeListeners__ = null;
        element.__resizeObserver__.disconnect();
        element.__resizeObserver__ = null;
    }
};


export function getScrollBarWidth() {
    let noScroll, scroll, oDiv = document.createElement('div');
    oDiv.style.cssText = 'position:absolute; top:-9999px;width:100px; height:100px; overflow:hidden;visibility:hidden';
    noScroll = document.body.appendChild(oDiv).clientWidth;
    oDiv.style.overflowY = 'scroll';
    scroll = oDiv.clientWidth;
    document.body.removeChild(oDiv);
    return noScroll - scroll;//向上取整 不缓存
}

//获得样式
export const getStyle = (function () {
    if (window.document.currentStyle) {
        return (dom, attr) => {
            return attr ? dom.currentStyle[attr] : dom.currentStyle;
        };
    } else {
        return (dom, attr) => {
            return attr ? getComputedStyle(dom, false)[attr]
                : getComputedStyle(dom, false);
        }
    }
})();


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
export function addClass(el, cls) {
    if (!el) return;
    let curClass = el.className, classes;
    if (Array.isArray(cls)) {
        classes = cls;
    } else if (typeof cls === 'string') {
        classes = (cls || '').split(' ');
    } else {
        throw new Error(`无效的格式,应为 Array<String> 或者 String(空格分隔)`);
    }

    for (let i = 0, j = classes.length; i < j; i++) {
        let clsName = classes[i];
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
export function removeClass(el, cls) {
    if (!el || !cls) return;
    let classes;
    if (Array.isArray(cls)) {
        classes = cls;
    } else if(typeof cls === 'string'){
        classes = cls.split(' ');
    }else{
        throw new Error(`无效的格式,应为 Array<String> 或者 String(空格分隔)`);
    }
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        let clsName = classes[i];
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
