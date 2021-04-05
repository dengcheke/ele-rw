import normalizeWheel from 'normalize-wheel';
import {on} from "../utils/dom";

const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const bindMousewheel = function (element, callback) {
    return on(element, isFirefox ? 'DOMMouseScroll' : 'mousewheel', function (event) {
        const normalized = normalizeWheel(event);
        callback && callback.apply(this, [event, normalized]);
    });
};

export const MouseWheel = {
    bind(el, binding) {
        const off = bindMousewheel(el, binding.value);
        el.__mouseWheelHandle__ = off;
    },
    unbind(el){
        el.__mouseWheelHandle__ && el.__mouseWheelHandle__();
        delete el.__mouseWheelHandle__;
    }
};
