<script>
import {addClass, removeClass} from "@src/utils/dom";

const className = 'ele-rw-collapse-transition';
const Transition = {
    beforeEnter: function beforeEnter(el) {
        addClass(el, className);
        if (!el.dataset) el.dataset = {};
        el.dataset.userSelect = el.style.userSelect;
        el.dataset.oldPaddingTop = el.style.paddingTop;
        el.dataset.oldPaddingBottom = el.style.paddingBottom;

        el.style.height = 0;
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
        el.style.userSelect = 'none';
    },
    enter: function enter(el) {
        el.dataset.oldOverflow = el.style.overflow;
        if (el.scrollHeight !== 0) {
            el.style.height = el.scrollHeight + 'px';
        } else {
            el.style.height = '';
        }
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
        el.style.overflow = 'hidden';
    },
    afterEnter: function afterEnter(el) {
        removeClass(el, className);
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow;
        el.style.userSelect = el.dataset.userSelect;
    },

    beforeLeave: function beforeLeave(el) {
        if (!el.dataset) el.dataset = {};
        el.dataset.oldPaddingTop = el.style.paddingTop;
        el.dataset.oldPaddingBottom = el.style.paddingBottom;
        el.dataset.oldOverflow = el.style.overflow;
        el.dataset.userSelect = el.style.userSelect;

        el.style.height = el.scrollHeight + 'px';
        el.style.overflow = 'hidden';
        el.style.userSelect = 'none';
    },
    leave: function leave(el) {
        if (el.scrollHeight !== 0) {
// for safari: add class after set height, or it will jump to zero height suddenly, weired
            addClass(el, className);
            el.style.height = 0;
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
        }
    },
    afterLeave: function afterLeave(el) {
        removeClass(el, className);
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow;
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
        el.style.userSelect = el.dataset.userSelect;
    }
}
export default {
    name: 'EleRwCollapseTransition',
    functional: true,
    render: function render(h, ctx) {
        const children = ctx.children;
        return h('transition', {on: {...Transition}}, children);
    }
}
</script>
<style>
.ele-rw-collapse-transition {
    transition: .3s height ease-in-out,
    .3s padding-top ease-in-out,
    .3s padding-bottom ease-in-out
}
</style>
