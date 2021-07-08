<template>
    <div class="custom-steps is-vertical"
         :style="calcStyle()">
        <div class="scroll-wrapper" ref="scrollWrapper"
             v-show="!isEmpty" @scroll="handleScroll($event)"
             :style="{height: `calc(100% + ${barWidth}px)`,width: `calc(100% + ${barWidth}px)`}">
            <ul ref="ul">
                <li v-for="(item,idx) in stepList" class="step__item"
                    :class="calcLiClass(item)"
                    :key="keyField?item[keyField]:idx">
                    <div class="step__item-icon">
                        <div class="icon"></div>
                    </div>
                    <div class="step__item-content">
                        <slot name="item" :item="item">
                            <div>{{ item.label }}</div>
                        </slot>
                    </div>
                </li>
            </ul>
        </div>
        <bar :move="moveX" :size="sizeWidth" ref="barX"/>
        <bar vertical :move="moveY" :size="sizeHeight" ref="barY"/>
        <empty-slot :show="isEmpty" :style="{minHeight:this.minHeight?this.minHeight+'px':'none'}"></empty-slot>
    </div>
</template>

<script>
import EmptySlot from './empty-slot/empty-slot';
import {addResizeListener, getScrollBarWidth} from "../src/utils/dom";
import Bar from './bar/main';
import {HOOK_BEFOREDESTROY} from "@config/global-const";

export default {
    name: "custom-vertical-steps",
    components: {
        EmptySlot, Bar
    },
    data() {
        let barWidth = Math.ceil(getScrollBarWidth());
        if (barWidth & 0b1 === 1) { //奇数
            barWidth += 1;
        }
        return {
            barWidth: barWidth,
            sizeWidth: 0, //滚动条宽度
            sizeHeight: 0, //滚动条高度
            moveX: 0,
            moveY: 0,
        }
    },
    props: {
        stepList: {
            type: Array,
            default: () => []
        },
        keyField: {
            default: null
        },
        //指定非auto值的height,则整体高度会受限制,auto则为无限增长模式
        height: {
            default: 'auto',
            type: String | Number
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
    computed: {
        isEmpty() {
            return this.stepList.length === 0;
        },
        fixedH() {
            return this.height !== 'auto';
        },
        calcHeight() {
            const h = this.height;
            if (typeof h === 'number') {
                return `${h}px`
            } else {
                return h;
            }
        },
    },
    mounted() {
        const el = this.$el, ul = this.$refs.ul;
        const wrap = this.$refs.scrollWrapper,
            barX = this.$refs.barX,
            barY = this.$refs.barY;
        barX.wrap = barY.wrap = wrap;
        //监听内容变化
        const un = addResizeListener(ul, ({contentRect}) => {
            const h = contentRect.height;
            if (!h) return;
            if (!this.fixedH) {
                el.style.height = `${h}px`
            }
            this.updateScrollBar();
        });
        this.$once(HOOK_BEFOREDESTROY, () => {
            un && un();
        });
    },
    methods: {
        calcStyle() {
            const style = {};
            this.minHeight && (style.minHeight = `${this.minHeight}px`);
            this.maxHeight && (style.maxHeight = `${this.maxHeight}px`);
            this.fixedH && (style.height = this.calcHeight);
            return style;
        },
        calcLiClass(item) {
            return item.rowClass ? [].concat(item.rowClass) : [];
        },
        calcLiStyle(item) {
            return item.rowStyle || {};
        },
        updateScrollBar() {
            let heightPercentage, widthPercentage;
            const wrap = this.$refs.scrollWrapper;
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
            const target = this.$refs.scrollWrapper;
            this.moveX = ((target.scrollLeft * 100) / target.clientWidth);
            this.moveY = ((target.scrollTop * 100) / target.clientHeight);
        }
    },
}
</script>

<style lang="less">
@top: 6px;
@radius: 6px;
.custom-steps.is-vertical {
    position: relative;
    box-sizing: content-box;
    overflow: hidden;
    width: 100%;

    .scroll-wrapper {
        overflow: scroll;
    }

    .step__item {
        display: flex;
        align-items: stretch;
        font-size: 15px;

        &:hover {
            background-color: rgba(19, 62, 88, 1);
        }

        &:first-child {
            .step__item-icon::before {
                display: none;
            }
        }

        &:last-child {
            .step__item-icon::after {
                display: none;
            }
        }
    }

    .step__item-icon {
        width: 24px;
        flex: none;
        position: relative;

        &::before, &::after {
            content: "";
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            background-color: rgba(66, 138, 159, 0.8);
        }

        &::before {
            top: 0;
            height: @top;
        }

        &::after {
            top: @top + 2 * @radius;
            bottom: 0;
        }

        .icon {
            display: block;
            background-color: rgba(110, 243, 229, 1);
            width: 2*@radius;
            height: 2*@radius;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: @top;
            z-index: 1;
            transform: translateX(-50%);
        }
    }

    .step__item-content {
        flex: 1;
    }

    &:hover {
        .scrollbar__bar {
            opacity: 1;
            transition: opacity 340ms ease-out;
        }
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
</style>
