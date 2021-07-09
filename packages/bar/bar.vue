<template>
    <div :class="['scrollbar__bar', 'is-' + bar.key]">
        <div ref="thumb"
             class="scrollbar__thumb"
             @mousedown="clickThumbHandler"
             :style="renderThumbStyle({size, move, bar})">
        </div>
    </div>
</template>
<script>
const BAR_MAP = {
    vertical: {
        offset: 'offsetHeight',
        scroll: 'scrollTop',
        scrollSize: 'scrollHeight',
        size: 'height',
        key: 'vertical',
        axis: 'Y',
        client: 'clientY',
        direction: 'top'
    },
    horizontal: {
        offset: 'offsetWidth',
        scroll: 'scrollLeft',
        scrollSize: 'scrollWidth',
        size: 'width',
        key: 'horizontal',
        axis: 'X',
        client: 'clientX',
        direction: 'left'
    }
};
import {off, on} from "@src/utils/dom";
export default {
    name: 'EleRwBar',
    props: {
        vertical: Boolean,
        size: Number,//thumb 宽度 百分比
        move: Number,//移动的百分比
    },
    data() {
        return {
            wrap: null,
        }
    },
    computed: {
        bar() {
            return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
        },
    },
    methods: {
        renderThumbStyle({move, size, bar}) {
            const style = {};
            const translate = `translate${bar.axis}(${move}%)`;
            style[bar.size] = size ? size + '%' : 0;
            style.transform = translate;
            style.msTransform = translate;
            style.webkitTransform = translate;
            return style;
        },
        clickThumbHandler(e) {
            if (e.ctrlKey || e.button === 2) {
                return;
            }
            this.startDrag(e);
            const axis = this.bar.axis,
                thumb = e.currentTarget,
                rect = thumb.getBoundingClientRect();
            this[axis] = (thumb[this.bar.offset] - (e[this.bar.client] - rect[this.bar.direction]));
        },

        clickTrackHandler(e) {
            const wrap = this.wrap;
            if (!wrap) return;
            const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
            const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
            const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);
            wrap[this.bar.scroll] = (thumbPositionPercentage * wrap[this.bar.scrollSize] / 100);
        },

        startDrag(e) {
            e.stopPropagation();
            this.cursorDown = true;
            on(document, 'mousemove', this.mouseMoveDocumentHandler);
            on(document, 'mouseup', this.mouseUpDocumentHandler);
            document.onselectstart = () => false;
        },

        mouseMoveDocumentHandler(e) {
            const wrap = this.wrap;
            if (!wrap) return;
            if (this.cursorDown === false) return;
            const prevPage = this[this.bar.axis];

            if (!prevPage) return;

            const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
            const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
            const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);

            wrap[this.bar.scroll] = (thumbPositionPercentage * wrap[this.bar.scrollSize] / 100);
        },

        mouseUpDocumentHandler(e) {
            this.cursorDown = false;
            this[this.bar.axis] = 0;
            off(document, 'mousemove', this.mouseMoveDocumentHandler);
            document.onselectstart = null;
        }
    },
    destroyed() {
        off(document, 'mouseup', this.mouseUpDocumentHandler);
    },
}

</script>
