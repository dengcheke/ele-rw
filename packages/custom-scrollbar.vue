<template>
    <div class="custom-scrollbar" :style="calcElStyle()">
        <div class="scrollbar__wrap" ref="wrap" v-mousewheel="handleMouseWheel"
             :style="calcWrapStyle()" @scroll.passive="handleScroll($event)">
            <div class="scrollbar__view" :style="viewStyle" :class="viewClass" ref="view">
                <slot></slot>
            </div>
        </div>
        <Bar :move="moveX" :size="sizeWidth" ref="barX"/>
        <Bar vertical :move="moveY" :size="sizeHeight" ref="barY"/>
    </div>
</template>

<script>
import Bar from './bar';
import ResizeObserver from 'resize-observer-polyfill';
import {HOOK_BEFOREDESTROY} from "@config/global-const";
import {getScrollBarWidth, on} from "../src/utils/dom";
import {clamp} from "../src/utils/index";
import {MouseWheel} from "@src/plugins/vue/direc/v-mousewheel";

export default {
    name: "test-scrollbar",
    components: {Bar},
    directives: {
        'mousewheel': MouseWheel
    },
    props: {
        onMousewheel: {
            type: Function,
            default: null
        },
        viewClass: {
            type: Array | Object,
            default: () => []
        },
        viewStyle: {
            type: Object,
            default: () => {
                return {}
            }
        },
        height: {
            default: '100%',
            type: Number | String
        },
        minHeight: {
            default: null,
            type: Number
        },
        maxHeight: {
            default: null,
            type: Number
        }
    },
    data() {
        let barWidth = Math.ceil(getScrollBarWidth());
        return {
            barWidth: barWidth,//滚动条宽度
            dpr: window.devicePixelRatio, //dpr变化导致滚动条宽度也变了。
            sizeWidth: 0,
            sizeHeight: 0,
            moveX: 0,
            moveY: 0,
            viewHeight: 0,
            viewWidth: 0,
            scrollLeft:0,
            scrollTop:0,
        }
    },
    mounted() {
        const {barX, barY, wrap} = this.$refs;
        barX.wrap = barY.wrap = wrap;
        this.init();
    },
    methods: {
        handleMouseWheel(e, data) {
            if (this.onMousewheel) {
                this.onMousewheel(e, data)
            }
        },
        init() {
            const un = on(window, 'resize', () => {
                const dpr = window.devicePixelRatio;
                if (dpr != this.dpr) {
                    this.dpr = dpr;
                    this.barWidth = Math.ceil(getScrollBarWidth());
                }
            });
            const el = this.$el, view = this.$refs.view;
            const ro = new ResizeObserver(entries => {
                //if (el.clientHeight === 0 || el.clientWidth === 0) return;
                let update = false;
                const elEn = entries.find(i => i.target === el);
                if (elEn) {
                    update = true;
                }
                const viewEn = entries.find(i => i.target === view);
                if (viewEn) {
                    update = true;
                    this.viewWidth = view.offsetWidth;
                    this.viewHeight = view.offsetHeight;
                }
                update && this.$nextTick(() => this.updateScrollbar());
            });
            [el, view].forEach(i => ro.observe(i));
            this.$once('hook:beforeDestroy', () => {
                ro.disconnect();
                un();
            })
        },
        updateScrollbar() {
            let heightPercentage, widthPercentage;
            const wrap = this.$refs.wrap;
            if (!wrap) return;
            if (wrap.scrollHeight - wrap.clientHeight <= 1) {
                heightPercentage = 100;
            } else {
                heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
            }
            widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

            this.sizeHeight = (heightPercentage < 100) ? heightPercentage : 0;
            this.sizeWidth = (widthPercentage < 100) ? widthPercentage : 0;
        },
        handleScroll(e) {
            const wrap = this.$refs.wrap;
            const {scrollTop,scrollLeft,clientHeight,clientWidth} = wrap;
            this.scrollTop = scrollTop;
            this.scrollLeft = scrollLeft;
            this.moveY = ((scrollTop * 100) / clientHeight);
            this.moveX = ((scrollLeft * 100) / clientWidth);
        },
        calcElStyle() {
            const style = {}
            if (typeof this.height === 'number') {
                style.height = `${this.height}px`;
            } else if (this.height === 'auto') {
                const min = this.minHeight, max = this.maxHeight, h = this.viewHeight;
                if (min && max) {
                    style.height = clamp(h, min, max) + 'px';
                } else if (min && !max) {
                    style.height = Math.max(h, min) + 'px';
                } else if (!min && max) {
                    style.height = Math.min(h, max) + 'px';
                } else {
                    style.height = h + 'px';
                }
            } else {
                style.height = this.height;
            }
            this.minHeight && (style.minHeight = `${this.minHeight}px`);
            this.maxHeight && (style.maxHeight = `${this.maxHeight}px`);
            return style;
        },
        calcWrapStyle() {
            return {
                height: `calc(100% + ${this.barWidth}px)`,
                width: `calc(100% + ${this.barWidth}px)`,
            }
        },
        //滚动到最下面
        scrollToBottom(smooth) {
            const {wrap} = this.$refs;
            wrap && (wrap.scrollTo({
                top: wrap.scrollHeight,
                behavior: smooth ? "smooth" : "auto"
            }))
        }
    }
}
</script>

<style lang="less">
.custom-scrollbar {
    width: 100%;
    position: relative;
    overflow: hidden;

    &:hover {
        .scrollbar__bar {
            opacity: 1;
            transition: opacity 340ms ease-out;
        }
    }

    .scrollbar__wrap {
        overflow: scroll;
    }

    .scrollbar__bar {
        position: absolute;
        right: 2px;
        bottom: 2px;
        z-index: 1;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 120ms ease-out;

        &.is-vertical {
            width: 6px;
            top: 2px;

            & > div {
                width: 100%;
            }
        }

        &.is-horizontal {
            height: 6px;
            left: 2px;

            & > div {
                height: 100%;
            }
        }
    }

    .scrollbar__thumb {
        position: relative;
        display: block;
        width: 0;
        height: 0;
        cursor: pointer;
        border-radius: inherit;
        background-color: #30688b;
        transition: .3s background-color;

        &:hover {
            background-color: rgba(144, 147, 153, .5);
        }
    }
}

.custom-scrollbar.flexible {
    .scrollbar__view {
        min-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
