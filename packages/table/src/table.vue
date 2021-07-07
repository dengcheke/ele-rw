<template>
    <div class="ele-rw-table outer-wrapper" :uid="'table_uid_'+_globalTableId"
         :style="calcElStyle()">
        <div class="inner-wrapper" :style="calcInnerStyle()" ref="innerWrap"
             style="z-index: 0" v-mousewheel="handleMousewheel">
            <div class="table-main">
                <div class="table__header-wrapper" ref="headerWrap" v-show="showHeader">
                    <table-header/>
                </div>
                <div class="table__body-wrapper" ref="bodyWrap"
                     @scroll.passive="handleScroll($event)"
                     @mouseleave="mouseLeaveTable">
                    <!--监听table变化,resize-observer-polyfill无法监听table,包装一下-->
                    <div class="resize-observer-wrapper" ref="bodyResizeWrap"
                         style="display: inline-block;vertical-align: top">
                        <table-body/>
                    </div>
                </div>
                <div class="table__footer-wrapper" ref="footerWrap">
                    <table-footer/>
                </div>
            </div>
            <div class="table__fixed--left" style="z-index: 1" v-if="fixedLeftCount"
                 :class="{'fixed-shadow':showLeftShadow}"
                 :style="{width:fixedLeftWidth+'px'}">
                <div class="table__header-wrapper fixed-left" v-show="showHeader">
                    <table-header fixed="left"/>
                </div>
                <div class="table__body-wrapper fixed-left" ref="bodyWrapLeft"
                     :style="{height:bodyWrapHeight+'px'}">
                    <table-body fixed="left"/>
                </div>
                <div class="table__footer-wrapper fixed-left">
                    <table-footer fixed="left"/>
                </div>
            </div>
            <div class="table__fixed--right" style="z-index: 2" v-if="fixedRightCount"
                 :class="{'fixed-shadow':showRightShadow}"
                 :style="{ width:fixedRightWidth+'px'}">
                <div class="table__header-wrapper fixed-right" v-show="showHeader"
                     :style="{height:headerWrapHeight+'px'}">
                    <table-header fixed="right" style="position: absolute;right: 0;top:0;"/>
                </div>
                <div class="table__body-wrapper fixed-right" ref="bodyWrapRight"
                     :style="{height:bodyWrapHeight+'px'}">
                    <table-body fixed="right" style="position: absolute;right: 0;top:0;"/>
                </div>
                <div class="table__footer-wrapper fixed-right"
                     :style="{height: footerWrapHeight+'px'}">
                    <table-footer fixed="right" style="position: absolute;right: 0;top:0;"/>
                </div>
            </div>
            <bar vertical :move="moveY" :size="sizeHeight" ref="barY" style="z-index: 3"
                 :style="{top:headerWrapHeight+'px',bottom:footerWrapHeight+'px'}"/>
            <bar :move="moveX" :size="sizeWidth" ref="barX" style="z-index: 3"/>
            <empty-slot v-show="empty" :style="calcEmptyStyle()" style="z-index: 4"/>
            <div v-if="isDragCol" class="drag-line" style="z-index: 5"
                 :style="{top:dragLineTop+'px',left:dragLineLeft+'px'}"/>
        </div>
    </div>
</template>

<script type="text/babel">
import {clamp, isDefined, mapping, treeToArray} from "@src/utils/index";
import {MouseWheel} from "@src/directives/v-mousewheel";
import {TableEvent} from "./table-config";
import EmptySlot from '@packages/empty-slot/index';
import store from './store';
import TableHeader from './table-header';
import TableBody from './table-body';
import TableFooter from './table-footer';
import ResizeObserver from 'resize-observer-polyfill';
import Bar from '../../bar';
import {animationScrollValue, getTableId} from "./utils";

export default {
    name: "EleRwTable",
    directives: {
        'mousewheel': MouseWheel
    },
    provide() {
        return {
            table: this,
            store: this.store
        }
    },
    props: {
        rowKey: {
            type: String | Function,
            default: null,
        },
        childrenKey: {
            type: String,
            default: 'children',
        },
        treeNodeKey: {
            type: String,
            default: null,
        },
        tableCols: {
            type: Array,
            default: () => [],
        },
        tableData: {
            type: Array,
            default: () => []
        },
        footerData: {
            type: Array,
            default: () => []
        },
        height: {
            type: Number | String,
            default: 'auto',
        },
        maxHeight: {
            type: Number,
            default: null
        },
        minHeight: {
            type: Number,
            default: null
        },
        resizable: {
            type: Boolean,
            default: false
        },
        align: {
            type: String,
            default: null,//left right center  同text-align
        },
        indent: {
            type: Number,
            default: 16
        },
        expandRender: {
            type: Function,
            default: null,
            desc: "展开render(h,{row})或者 template #expand={row} "
        },
        spanMethod: {
            type: Function,
            default: null,
            desc: '合并td方法 返回[rowspan,colspan],仅在常规col生效,check和expand不生效'
        },
        enableCurrentRow: {
            type: Boolean,
            default: true
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        resetScrollOnDataChange: {
            // 数据变化时,是否将滚动重置到左上角,
            // 改变data才会触发，tabeleData = [...tableData] 会触发，
            // tableData.push(xxx) 不会触发
            type: Boolean,
            default: true
        },

        //style
        rowStyle: {
            type: Object | Function,
            default: null,
        },
        rowClass: {
            type: String | Object | Array | Function,
            default: null,
        },
        cellStyle: {
            type: Object | Function,
            default: null,
        },
        cellClass: {
            type: String | Object | Array | Function,
            default: null,
        },
        headerRowStyle: {
            type: Object | Function,
            default: null,
        },
        headerRowClass: {
            type: String | Object | Array | Function,
            default: null,
        },
        headerCellStyle: {
            type: Object | Function,
            default: null,
        },
        headerCellClass: {
            type: String | Object | Array | Function,
            default: null,
        },
        footerRowStyle: {
            type: Object | Function,
            default: null,
        },
        footerRowClass: {
            type: String | Object | Array | Function,
            default: null,
        },
        footerCellStyle: {
            type: Object | Function,
            default: null,
        },
        footerCellClass: {
            type: String | Object | Array | Function,
            default: null,
        },

        //test
        enableHighlightCol: {
            type: Boolean,
            default: false,
        },
        highlightColHeaderCellStyle: {
            type: Object,
            default: null
        },
        highlightColRowCellStyle: {
            type: Object,
            default: null
        },
    },
    components: {
        EmptySlot, TableHeader, TableBody, TableFooter, Bar
    },
    data() {
        this.store = new store();
        this.store.table = this;
        this._globalTableId = getTableId();
        //---test only---
        this.headerStyleElm = document.createElement('style');
        document.body.appendChild(this.headerStyleElm);
        this.headerStyleElm.setAttribute('use-for-table-' + this._globalTableId, "");
        this.$once('hook:beforeDestroy', () => {
            document.body.removeChild(this.headerStyleElm)
        })
        //---------------
        this._animScrollTop = this._animScrollLeft = null;
        return {
            headerWrapHeight: 0, //header容器高度
            bodyWrapHeight: 0, //body容器高度
            tableBodyHeight: 0,//tableBody的高度
            footerWrapHeight: 0,//footer 容器高度

            //滚动相关
            sizeWidth: 0, //滚动条thumb宽度百分比
            sizeHeight: 0, //滚动条thumb高度百分比
            moveX: 0, //已经移动的百分比 scrollLeft
            moveY: 0, //已经移动的百分比 scrollTop
            scrollLeft: 0, //当前scrollLeft值
            scrollTop: 0, //当前scrollTop值
            scrollPosition: 'left',

            isDragCol: false,//在拖拽列
            dragLineLeft: 0,//拖拽线位置
            dragLineTop: 0,
        }
    },
    mounted() {
        requestAnimationFrame(() => {
            this.initEvent();
            this.updateScrollBar();
        });
    },
    computed: {
        ...mapping('store', {
            containerWidth: store => store.containerWidth || 0,
            fixedLeftCount: store => store.fixedLeftCount || 0,
            fixedLeftWidth: store => store.fixedLeftWidth || 0,
            fixedRightCount: store => store.fixedRightCount || 0,
            fixedRightWidth: store => store.fixedRightWidth || 0,
            tableBodyWidth: store => store.tableBodyWidth || 0,
        }),
        showLeftShadow() {
            const scrollX = Number(this.sizeWidth), //水平可滚动
                scrollPosition = this.scrollPosition,
                empty = this.empty;
            return scrollX && scrollPosition !== 'left' && !empty;
        },
        showRightShadow() {
            const scrollX = Number(this.sizeWidth),
                scrollPosition = this.scrollPosition,
                empty = this.empty;
            return scrollX && scrollPosition !== 'right' && !empty;
        },
        empty() {
            return !this.tableData || this.tableData.length === 0
        }
    },
    methods: {
        calcEmptyStyle() {
            return {
                color: 'white',
                position: 'absolute',
                top: this.headerWrapHeight + 'px',
                bottom: this.footerWrapHeight + 'px',
                left: 0,
                right: 0,
                height: 'auto',
                width: 'auto',
                backgroundColor: '#021828'
            }
        },
        /// layout and event
        calcElStyle() {
            const style = {};
            style.height = typeof this.height === 'number' ? `${this.height}px` : this.height;
            if (this.minHeight) style.minHeight = this.minHeight + 'px';
            if (this.maxHeight) style.maxHeight = this.maxHeight + 'px';
            return style;
        },
        //内部wrap样式
        calcInnerStyle() {
            const style = {}, W = this.containerWidth;
            if (!W) return;
            const fixedWidth = this.fixedLeftWidth + this.fixedRightWidth;
            style.width = clamp(this.tableBodyWidth, 0, Math.max(fixedWidth, W)) + 'px';
            if (this.height === 'auto') { //内容自增
                const min = this.minHeight, max = this.maxHeight;
                let contentH = this.headerWrapHeight + this.footerWrapHeight;
                if (!this.empty) {
                    contentH += this.tableBodyHeight;
                }
                if (min && !max) {
                    style.height = Math.max(contentH, min) + 'px';
                } else if (!min && max) {
                    style.height = Math.min(contentH, max) + 'px';
                } else if (min && max) {
                    style.height = clamp(contentH, min, max) + 'px';
                } else {
                    style.height = contentH + 'px';
                }
            } else { //高度受限于外部
                style.height = '100%';
            }
            return style;
        },
        //初始化
        initEvent() {
            //初始化滚动组件关联
            const {bodyWrap, barX, barY} = this.$refs;
            barX.wrap = barY.wrap = bodyWrap;

            //监听size change
            const el = this.$el;
            const {headerWrap, bodyResizeWrap, footerWrap} = this.$refs;
            const ro = new ResizeObserver((entries) => {
                //不可见(display:none)就没必要更新
                if (!el.offsetHeight && !el.offsetWidth) return;
                entries.forEach(en => {
                    const target = en.target;
                    if (target === el) {
                        const w = el.clientWidth;
                        w && (this.store.containerWidth = w);
                    } else if (target === headerWrap) {
                        this.headerWrapHeight = headerWrap.offsetHeight;
                    } else if (target === bodyWrap) {
                        this.bodyWrapHeight = bodyWrap.offsetHeight;
                    } else if (target === footerWrap) {
                        this.footerWrapHeight = footerWrap.offsetHeight;
                    } else if (target === bodyResizeWrap) {
                        this.tableBodyHeight = bodyResizeWrap.clientHeight;
                    }
                });
                this.$nextTick(() => {
                    this.updateScrollBar();
                });
            });
            [el, headerWrap, bodyWrap, bodyResizeWrap, footerWrap].forEach(i => ro.observe(i));
            this.$once("hooK:beforeDestroy", () => {
                ro.disconnect();
            });
        },
        /*在中间非固定表滚动时*/
        handleScroll(e) {
            const target = this.$refs.bodyWrap;
            this.scrollLeft = target.scrollLeft;
            this.scrollTop = target.scrollTop;
        },
        //更新滚动条宽高
        updateScrollBar() {
            let heightPercentage, widthPercentage;
            const wrap = this.$refs.bodyWrap;
            if (!wrap) return;
            //bug ? chrome 表格高度为 144px, scrollHeight却有145px;
            if (wrap.scrollHeight - wrap.clientHeight <= 1) {
                heightPercentage = 100;
            } else {
                heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
            }
            widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

            this.sizeHeight = (heightPercentage < 100) ? heightPercentage : 0;
            this.sizeWidth = (widthPercentage < 100) ? widthPercentage : 0;
        },
        //用mousewheel模拟滚动
        handleMousewheel(event, data) {
            const bodyWrap = this.$refs.bodyWrap;
            if (!bodyWrap) return;
            let prevent = true;
            if (!event.shiftKey && Math.abs(data.spinY) > 0) {
                const maxScrollTop = bodyWrap.scrollHeight - bodyWrap.clientHeight;
                let newTop, scrollv = data.spinY * 100; //向下正值
                //取消之前的
                if (this._animScrollTop) {
                    this._animScrollTop.cancel();
                    //在之前的预期结果上继续
                    const {from, to} = this._animScrollTop;
                    if ((from - to) * scrollv > 0) { //同方向
                        newTop = this.scrollTop + scrollv;
                    } else {
                        newTop = this._animScrollTop.to + scrollv;
                    }
                } else {
                    //在当前的结果上继续
                    newTop = this.scrollTop + scrollv;
                }
                //格式化越界值
                newTop = clamp(newTop, 0, maxScrollTop);
                //开始新的动画
                if (Math.abs(newTop - this.scrollTop) > 1) {
                    this._animScrollTop = animationScrollValue(this.scrollTop, newTop, (res) => {
                        this.scrollTop = res.value;
                    }, () => {
                        this._animScrollTop = null;
                    })
                }
                if (
                    (Math.abs(this.scrollTop - maxScrollTop) < 1 && scrollv > 0)
                    || (this.scrollTop < 1 && scrollv < 0)
                ) {
                    prevent = false;
                }
            } else {
                //when wheel with shiftKey, why spinY is 1 but spinX is 0?
                let spin = Math.abs(data.spinX) || Math.abs(data.spinY);
                if (event.shiftKey && spin) {
                    const maxScrollLeft = bodyWrap.scrollWidth - bodyWrap.clientWidth;
                    let newLeft, scrollv = (data.spinX || data.spinY) * 100;
                    if (this._animScrollLeft) {
                        this._animScrollLeft.cancel();
                        newLeft = this._animScrollLeft.to + scrollv;
                    } else {
                        newLeft = this.scrollLeft + scrollv;
                    }
                    newLeft = clamp(newLeft, 0, maxScrollLeft);
                    if (newLeft !== this.scrollLeft) {
                        this._animScrollLeft = animationScrollValue(this.scrollLeft, newLeft, (res) => {
                            this.scrollLeft = res.value;
                        }, () => {
                            this._animScrollLeft = null;
                        });
                    }
                    if (
                        (this.scrollLeft === maxScrollLeft && scrollv > 0)
                        || (this.scrollLeft === 0 && scrollv < 0)
                    ) {
                        prevent = false;
                    }
                }
            }
            prevent && event.preventDefault();
        },
        //鼠标离开组件时
        mouseLeaveTable() {
            this.store.hover$Idx = this.store.hoverRow = null;
        },
        //重置滚动位置
        resetScroll(cross = "left", down = 'top') {
            this.$nextTick(() => {
                const {bodyWrap, bodyWrapLeft, bodyWrapRight} = this.$refs;
                let scrollLeft = this._parseCross(cross),
                    scrollTop = this._parseDown(down);
                [bodyWrap, bodyWrapLeft, bodyWrapRight].forEach(wrap => {
                    if (wrap) {
                        scrollTop !== undefined && (wrap.scrollTop = scrollTop);
                        scrollLeft !== undefined && (wrap.scrollLeft = scrollLeft);
                    }
                });
            })
        },
        _parseCross(cross) {
            const {bodyWrap} = this.$refs;
            if (typeof cross === 'number') {
                return cross
            } else if (cross === 'right') {
                return bodyWrap ? bodyWrap.scrollWidth - bodyWrap.clientWidth : 0;
            } else if (cross === 'left') {
                return 0
            } else {
                return undefined
            }
        },
        _parseDown(down) {
            const {bodyWrap} = this.$refs;
            if (typeof down === 'number') {
                return down
            } else if (down === 'bottom') {
                return bodyWrap ? bodyWrap.scrollHeight - bodyWrap.clientHeight : 0;
            } else if (down === 'top') {
                return 0
            } else {
                return undefined
            }
        },
        /*代理子组件事件*/
        dispatchEvent(topic, ...args) {
            this.$emit(topic, ...args);
        },


        //获得一个row的key值
        getRowKey(row) {
            if (typeof this.rowKey === 'string') {
                return row[this.rowKey];
            } else if (typeof this.rowKey === 'function') {
                return this.rowKey(row);
            } else {
                return null;
            }
        },
        //获取一个row,可以是key值
        getRow(row) {
            return this.store.flatDfsData.find(i => {
                if (!row) return false;
                if (typeof row === 'object') {
                    if (i === row) {
                        return true
                    } else {
                        let a = this.getRowKey(i), b = this.getRowKey(row);
                        return a && b && a === b;
                    }
                } else { //默认row是id值
                    return this.getRowKey(i) === row;
                }
            })
        },


        //设置当前行,不传则取消当前行
        setCurrentRow(row) {
            const store = this.store;
            row = this.getRow(row);
            if (!row) {
                store.selectRow = store.select$Idx = null;
            } else {
                if (row !== store.selectRow) {
                    store.selectRow = row;
                    store.select$Idx = store.renderList.findIndex(i => i === row);
                } else {
                    store.selectRow = store.select$Idx = null;
                }
            }
        },
        //设置一列的排序,
        setColumnSort(col, sort = null, emit = true) {
            const node = this.store.sortColumns.find(i => {
                return i.key === col.key /*object has key*/
                    || i.key === col   /*string*/
                    || i.col === col; /*object ===*/
            });
            if (node.sort !== sort) {
                node.sort = sort;
                this.store.sortChangeTrigger++;
                emit && this.dispatchEvent(TableEvent.ColSortChange, node.col, node.sort, this.store.sortColumns);
            }
        },
        //移除所有的排序
        clearAllSort() {
            let change = false;
            this.store.sortColumns.forEach(node => {
                isDefined(node.sort) && (change = true) && (node.sort = null);
            });
            change && this.store.sortChangeTrigger++;
        },

        //勾选节点，不改变渲染列表，只改变class
        toggleRowChecked(row, checked, emit = true) {
            const store = this.store, checkedSet = store.checkedSet, self = this;
            row = this.getRow(row);
            if (!row) return;
            let change = false, has = checkedSet.has(row);
            if (isDefined(checked)) { //指定了状态
                checked = Boolean(checked)
            } else { //未指定，toggle
                checked = !has
            }
            if (checked && !has) {
                checkedSet.add(row);
                change = true;
            } else if (!checked && has) {
                checkedSet.delete(row);
                change = true;
            }
            if (change) {
                const treeNode = store.treeData.get(row);
                if (treeNode) { //是树形节点
                    //process children
                    const children = row[this.childrenKey];
                    if (children && children.length) {
                        const flatChildren = treeToArray(children, this.childrenKey);
                        flatChildren.forEach(child => {
                            checkedSet[checked ? 'add' : 'delete'](child);
                        })
                    }
                    //process parent
                    let parent = treeNode.parent;
                    while (parent) {
                        const oldStatus = checkedSet.has(parent);
                        const newStatus = checkParent(parent);
                        if (oldStatus === newStatus) break;
                        if (newStatus) { //之前没勾选.现在勾选
                            checkedSet.add(parent);
                        } else { //现在不勾选
                            checkedSet.delete(parent);
                        }
                        const pNode = store.treeData.get(parent);
                        pNode && (parent = pNode.parent);
                    }
                }
                store.checkNums = checkedSet.size;
                store.checkTrigger++;
                emit && this.dispatchEvent(TableEvent.RowCheck, row, checked, checkedSet /*readOnly*/);
            }

            function checkParent(parent) {
                const children = parent[self.childrenKey];
                const checkItem = children.find(child => checkedSet.has(child));
                const unCheckItem = children.find(child => !checkedSet.has(child));
                return checkItem && !unCheckItem
            }
        },
        setAllChecked(check) {
            const store = this.store;
            check = Boolean(check);
            const oldAllCheck = store.checkNums === store.flatDfsData.length; //之前是否全选
            if ((oldAllCheck && check) || (!store.checkNums && !check)) return;
            store.checkedSet = check ? new Set(store.flatDfsData) : new Set();
            store.checkNums = check ? store.flatDfsData.length : 0;
            store.checkTrigger++;
        },

        //展开节点, 影响渲染列表
        toggleRowExpanded(row, expanded, emit = true) {
            const store = this.store, expandedSet = store.expandedSet;
            row = this.getRow(row);
            if (!row) return;
            let change = false, has = expandedSet.has(row);
            if (isDefined(expanded)) { //指定了状态
                expanded = Boolean(expanded)
            } else { //未指定，toggle
                expanded = !has
            }
            if (expanded && !has) {
                expandedSet.add(row);
                change = true;
            } else if (!expanded && has) {
                expandedSet.delete(row);
                change = true;
            }
            if (change) {
                store.expandTrigger++;
                store.updateRenderList();
                store.updateSelect();
                emit && this.dispatchEvent(TableEvent.RowExpand, row, expanded, expandedSet/*readOnly*/);
            }
        },
        setAllExpanded(expanded) {
            expanded = Boolean(expanded);
            const store = this.store;
            let oldAllExpanded = store.expandedSet.size === store.flatDfsData.length;
            if ((oldAllExpanded && expanded) || (!store.expandedSet.size && !expanded)) return;
            this.store.expandedSet = expanded ? new Set(this.store.flatDfsData) : new Set();
            this.store.expandTrigger++;
            this.store.updateRenderList();
            this.store.updateSelect();
        },

        //展开树节点
        toggleTreeExpanded(row, expanded, emit = true) {
            const store = this.store, treeMap = store.treeData;
            row = this.getRow(row);
            if (!row) return;
            const treeNode = treeMap.get(row);
            if (!treeNode) return;
            if (isDefined(expanded)) {
                expanded = Boolean(expanded)
            } else {
                expanded = !treeNode.treeExpand
            }
            let change = false;
            if (expanded && !treeNode.treeExpand) { //展开,顺着父节点一直展开到root
                if (!treeNode.isLeaf) { //叶子节点不可展开
                    treeNode.treeExpand = true;
                    store.treeExpandedSet.add(row);
                }
                let p = treeNode.parent;
                while (p) {
                    store.treeExpandedSet.add(p);
                    const pNode = treeMap.get(p);
                    pNode.treeExpand = true;
                    p = pNode.parent
                }
                change = true;
            } else if (!expanded && treeNode.treeExpand && !treeNode.isLeaf) {
                treeNode.treeExpand = false;
                store.treeExpandedSet.delete(row);
                change = true;
            }
            if (change) {
                store.treeExpandTrigger++;
                store.updateRenderList();
                store.updateSelect();
                emit && this.dispatchEvent(TableEvent.TreeRowExpand, row, expanded, store.treeExpandedSet/*readOnly*/);
            }
        },
        setAllTreeExpanded(expanded) {
            expanded = Boolean(expanded);
            const store = this.store, {treeData, treeExpandedSet} = store;
            let change = false;
            if (expanded) { //全部展开
                //找到一个非叶子的未展开节点
                const unExpandOne = Array.from(treeData).find(item => {
                    const [row, treeNode] = item;
                    return !treeNode.isLeaf && !treeNode.treeExpand;
                });
                if (unExpandOne) change = true;
                //do update
                const _set = store.treeExpandedSet = new Set();
                treeData.forEach((treeNode, row) => {
                    if (!treeNode.isLeaf) {
                        _set.add(row);
                        treeNode.treeExpand = true
                    }
                });
            } else { //全部不展开
                const expandOne = Array.from(treeData).find(item => {
                    const [row, treeNode] = item;
                    return !treeNode.isLeaf && treeNode.treeExpand;
                });
                if (expandOne) change = true;
                treeExpandedSet.clear();
                treeData.forEach(treeNode => {
                    treeNode.treeExpand = false;
                });
            }
            if (change) {
                store.treeExpandTrigger++;
                store.updateRenderList();
                store.updateSelect();
            }
        },

        //获取排序的列节点
        getSortColumnNodes() {
            return this.store.sortColumns;
        },

    },
    watch: {
        scrollTop: function () {
            const {bodyWrap, bodyWrapLeft, bodyWrapRight} = this.$refs;
            //update scroll bar
            this.moveY = ((this.scrollTop * 100) / bodyWrap.clientHeight);
            //update scroll
            [bodyWrapLeft, bodyWrap, bodyWrapRight].forEach(view => {
                view && (view.scrollTop = this.scrollTop);
            });
        },
        scrollLeft: function () {
            const {bodyWrap, headerWrap, footerWrap} = this.$refs;
            //update scroll bar
            this.moveX = ((this.scrollLeft * 100) / bodyWrap.clientWidth);
            //calc 滚动位置，方便显示 固定列的左右shadow
            if (bodyWrap.scrollWidth > bodyWrap.clientWidth) { //存在滚动条
                if (this.scrollLeft <= 2) {
                    this.scrollPosition = "left";
                } else if ((bodyWrap.scrollWidth - bodyWrap.clientWidth - this.scrollLeft) <= 2) {
                    this.scrollPosition = "right";
                } else {
                    this.scrollPosition = "middle";
                }
            }
            //update header
            [bodyWrap, headerWrap, footerWrap].forEach(i => {
                i && (i.scrollLeft = this.scrollLeft);
            });
        },
        tableCols: {
            handler: function (cols) {
                if (cols && cols.length) {
                    this.store.computedCols(cols);//计算列信息
                    this.store.computedColWidth();//计算table宽度
                }
            },
            immediate: true
        },
        tableData: {
            handler: function (newly, older) {
                //重新赋值,滚动到左上角
                newly !== older && this.resetScrollOnDataChange && this.resetScroll(0,0);
                this.store.handleTableDataChange();
            },
            immediate: true
        },
        'store.checkTrigger': function () {
            this.dispatchEvent(TableEvent.CheckChange, this.store.checkedSet /*readOnly*/);
        },
        'store.expandTrigger': function () {
            this.dispatchEvent(TableEvent.ExpandChange, this.store.expandedSet /*readOnly*/);
        },
        'store.treeExpandTrigger': function () {
            this.dispatchEvent(TableEvent.TreeExpandChange, this.store.treeExpandedSet /*readOnly*/);
        },
        'store.sortChangeTrigger': function () {
            this.dispatchEvent(TableEvent.SortChange, this.store.sortColumns);
        },
    },
}
</script>

<style lang="less">
@import './table.less';
</style>
