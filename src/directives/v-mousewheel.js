import normalizeWheel from 'normalize-wheel';
import {on} from "../utils/dom";

const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const bindMousewheel = function (element, callback, opts) {
    return on(element, isFirefox ? 'DOMMouseScroll' : 'mousewheel', function (event) {
        const normalized = normalizeWheel(event);
        callback && callback.apply(this, [event, normalized]);
    }, opts);
};

export const MouseWheel = {
    bind(el, binding) {
        const off = bindMousewheel(el, binding.value, {
            passive: binding.modifiers.passive || false,
            capture: binding.modifiers.capture || false,
        });
        el.__mouseWheelHandle__ = off;
    },
    unbind(el) {
        el.__mouseWheelHandle__ && el.__mouseWheelHandle__();
        delete el.__mouseWheelHandle__;
    }
};
