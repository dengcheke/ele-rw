<template>
    <div class="ele-rw-table outer-wrapper" :uid="'table_uid_'+_globalTableId" :style="calcElStyle()">
        <!--innerWrap 宽高均为确定值-->
        <div class="inner-wrapper" :style="calcInnerStyle()" v-mousewheel="handleFixedMousewheel">
            <div class="table-main">
                <div class="table__header-wrapper" ref="scrollHeaderView">
                    <table-header/>
                </div>
                <div class="scroll-wrapper" ref="scrollWrap" v-show="!empty"
                     @mousewheel.stop @mouseleave="mouseLeaveTable">
                    <div class="scroll-view" ref="scrollBodyView"
                         @scroll.passive="handleScroll($event)"
                         :style="{width: `calc(100% + ${barWidth}px)`,height: `calc(100% + ${barWidth}px)`}">
                        <div class="table__body-wrapper" ref="bodyWrap">
                            <table-body/>
                        </div>
                    </div>
                </div>
                <div class="table__footer-wrapper" ref="scrollFooterView">
                    <table-footer/>
                </div>
            </div>
            <div class="table__fixed--left" v-if="fixedLeftCount"
                 :class="{'fixed-shadow':showLeftShadow}"
                 :style="{width:fixedLeftWidth+'px'}">
                <div class="table__header-wrapper fixed-left">
                    <table-header fixed="left"/>
                </div>
                <div class="table__body-wrapper fixed-left" ref="scrollBodyViewLeft"
                     :style="{height:scrollWrapHeight+'px'}">
                    <table-body fixed="left"/>
                </div>
                <div class="table__footer-wrapper fixed-left" ref="scrollFooterVideLeft">
                    <table-footer fixed="left"/>
                </div>
            </div>
            <div class="table__fixed--right" v-if="fixedRightCount"
                 :class="{'fixed-shadow':showRightShadow}"
                 :style="{ width:fixedRightWidth+'px'}">
                <div class="table__header-wrapper fixed-right"
                     :style="{height:headerWrapHeight+'px'}">
                    <table-header fixed="right" style="position: absolute;right: 0;top:0;"/>
                </div>
                <div class="table__body-wrapper fixed-right" ref="scrollBodyViewRight"
                     :style="{height:scrollWrapHeight+'px'}">
                    <table-body fixed="right" style="position: absolute;right: 0;top:0;"/>
                </div>
                <div class="table__footer-wrapper fixed-right" ref="scrollFooterVideRight">
                    <table-footer fixed="right"/>
                </div>
            </div>
            <bar vertical :move="moveY" :size="sizeHeight" ref="barY"
                 :style="{top:headerWrapHeight+'px',bottom:footerWrapHeight+'px'}"/>
            <bar :move="moveX" :size="sizeWidth" ref="barX"/>
            <empty-slot v-show="empty" style="color:white;flex:1 0 0"/>
        </div>
    </div>
</template>

<script type="text/babel">
import {clamp, isDefined, mapping, treeToArray} from "@src/utils/index";
import {MouseWheel} from "@src/directives/v-mousewheel";
import {TableEvent} from "./event-name";
import EmptySlot from '../../empty-slot/main';
import store from './store';
import TableHeader from './table-header';
import TableBody from './table-body';
import TableFooter from './table-footer';
import ResizeObserver from 'resize-observer-polyfill';
import Bar from '../../bar';
import {barWidthOb, getTableId} from "ele-rw-ui/packages/table/src/utils";

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
            desc: '每一行的id字段'
        },
        childrenKey: {
            type: String,
            default: 'children',
            desc: '树形展开的子节点列表字段'
        },
        treeNodeKey: {
            type: String,
            default: null,
            desc: '显示树形展开按钮的key'
        },
        tableCols: {
            type: Array,
            default: () => [],
            /*{
                type:'check'|'expand'|'text',
                key: 'col列键值',
                lable: '显示的名称',
                render: (h,{row,rowIndex,col,colIndex})=>'cell渲染函数，不指定则默认 row[key]',
                renderHeader: (h,{col,colIndex})=>'表头渲染，不指定默认label',
                sortable: true,//是否参与排序
                sort:'asc'|'desc',//初始排序，
                fixed:'left'|'right',//是否固定列,
                cellStyle: Object | Function({row,rowIndex,col,colIndex}),
                cellClass: string | Object | Array<string> | Function({row,rowIndex,col,colIndex})
                headerCellStyle: Object | Function({row,rowIndex,col,colIndex}),
                headerCellClass: string | Object |Array<string> | Function({row,rowIndex,col,colIndex})
            }*/
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
            desc: '定义height就表示外部高度固定了(有滚动条),不定义就是无限增长模式(无滚动条)'
        },
        maxHeight: {
            type: Number,
            default: null
        },
        minHeight: {
            type: Number,
            default: null
        },
        align: {
            type: String,
            default: 'left',//right center  同align-items
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
        //style
        rowStyle: {
            type: Object | Function,
            default: null,
            desc: 'tbody 行样式,fn({row,rowIndex)}'
        },
        rowClass: {
            type: String | Object | Array | Function,
            default: null,
            desc: 'tbody 行class,fn({row,rowIndex)}'
        },
        cellStyle: {
            type: Object | Function,
            default: null,
            desc: '单元格样式,fn({row,rowIndex,col,colIndex})'
        },
        cellClass: {
            type: String | Object | Array | Function,
            default: null,
            desc: '单元格class,fn({row,rowIndex,col,colIndex})'
        },
        headerRowStyle: {
            type: Object | Function,
            default: null,
            desc: '表头行style,fn({ row<col>, rowIndex })'
        },
        headerRowClass: {
            type: String | Object | Array | Function,
            default: null,
            desc: '表头行class,fn({ row<col>, rowIndex })'
        },
        headerCellStyle: {
            type: Object | Function,
            default: null,
            desc: '表头单元格样式,fn({ row<col>, rowIndex, col, colIndex })'
        },
        headerCellClass: {
            type: String | Object | Array | Function,
            default: null,
            desc: '表头单元格class,fn({ row<col>, rowIndex, col, colIndex })'
        },

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
        this.headerStyleElm = document.createElement('style');
        document.body.appendChild(this.headerStyleElm);
        this.headerStyleElm.setAttribute('use-for-table-' + this._globalTableId, "");
        this.$once('hook:beforeDestroy', () => {
            document.body.removeChild(this.headerStyleElm)
        })
        return {
            headerWrapHeight: 0, //header内容高度
            bodyWrapHeight: 0, //tbody内容高度
            bodyWrapWidth: 0,//tbody内容宽度
            scrollWrapHeight: 0, //滚动区域高度， 即可视区高度'
            scrollWrapWidth: 0,
            footerWrapHeight: 0,

            //滚动相关
            sizeWidth: 0, //滚动条thumb宽度百分比
            sizeHeight: 0, //滚动条thumb高度百分比
            moveX: 0, //已经移动的百分比 scrollLeft
            moveY: 0, //已经移动的百分比 scrollTop
            curScrollTarget: null,//当前是谁在滚动
            scrollLeft: 0,
            scrollTop: 0,
            scrollPosition: 'left',
        }
    },
    mounted() {
        window.__vm = this;
        requestAnimationFrame(() => {
            this.initEvent();
            this.updateScrollBar();
        });
    },
    computed: {
        barWidth() {
            return barWidthOb.barWidth;
        },
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
        ...mapping('store', {
            containerWidth: store => store.containerWidth || 0,
            fixedLeftCount: store => store.fixedLeftCount || 0,
            fixedLeftWidth: store => store.fixedLeftWidth || 0,
            fixedRightCount: store => store.fixedRightCount || 0,
            fixedRightWidth: store => store.fixedRightWidth || 0,
            tableBodyWidth: store => store.tableBodyWidth || 0,
        }),
        empty() {
            return !this.tableData || this.tableData.length === 0
        }
    },
    methods: {
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
            /*如果数据为空，bodyWrap不可见，宽度为0，用tableBody代替*/
            style.width = Math.min(W, (this.bodyWrapWidth || this.tableBodyWidth)) + 'px';
            if (this.height === 'auto') { //内容自增
                const min = this.minHeight, max = this.maxHeight;
                let contentH = this.headerWrapHeight + this.footerWrapHeight;
                if (!this.empty) {
                    contentH += this.bodyWrapHeight;
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
            const view = this.$refs.scrollBodyView,
                barX = this.$refs.barX,
                barY = this.$refs.barY;
            barX.wrap = barY.wrap = view;

            //监听size change
            const el = this.$el;
            const {scrollHeaderView, bodyWrap, scrollWrap, scrollFooterView} = this.$refs;
            const ro = new ResizeObserver((entries) => {
                //不可见就没必要更新
                if (!el.offsetHeight && !el.offsetWidth) return;
                entries.forEach(en => {
                    const target = en.target;
                    if (target === el) {
                        const w = el.clientWidth;
                        w && (this.store.containerWidth = w);
                    } else if (target === scrollHeaderView) {
                        this.headerWrapHeight = scrollHeaderView.offsetHeight;
                    } else if (target === bodyWrap) {
                        if (!this.empty) {
                            this.bodyWrapHeight = bodyWrap.offsetHeight;
                            this.bodyWrapWidth = bodyWrap.offsetWidth;
                        }
                    } else if (target === scrollFooterView) {
                        this.footerWrapHeight = scrollFooterView.offsetHeight;
                    } else if (target === scrollWrap) {
                        if (!this.empty) {
                            this.scrollWrapHeight = scrollWrap.offsetHeight;
                            this.scrollWrapWidth = scrollWrap.offsetWidth;
                        }
                    }
                })
                this.$nextTick(() => {
                    this.updateScrollBar();
                });
            });
            [el, scrollHeaderView, bodyWrap, scrollWrap, scrollFooterView].forEach(i => ro.observe(i));
            this.$once("hooK:beforeDestroy", () => {
                ro.disconnect();
            });
        },
        /*在中间非固定表滚动时*/
        handleScroll(e) {
            const target = this.$refs.scrollBodyView;
            this.scrollLeft = target.scrollLeft;
            this.scrollTop = target.scrollTop;
        },
        //更新滚动条宽高
        updateScrollBar() {
            let heightPercentage, widthPercentage;
            const wrap = this.$refs.scrollBodyView;
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
        /*在固定的列上滚动时*/
        handleFixedMousewheel(event, data) {
            const scrollBodyView = this.$refs.scrollBodyView;
            if (!scrollBodyView) return;
            if (!event.shiftKey && Math.abs(data.spinY) > 0) {
                scrollBodyView.scrollTop += Math.ceil(data.pixelY / 5);
            } else{
                //when wheel with shiftKey, why spinY is 120 but spinX is 0?
                let spin = Math.abs(data.spinX) || Math.abs(data.spinY);
                if(event.shiftKey && spin){
                    scrollBodyView.scrollLeft += Math.ceil((data.pixelX||data.pixelY) / 5);
                }
            }
        },
        /*鼠标离开组件时*/
        mouseLeaveTable() {
            this.store.hover$Idx = this.store.hoverRow = null;
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
                    return i === row;
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
                emit && this.dispatchEvent(TableEvent.CheckRow, row, checked, checkedSet /*readOnly*/);
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
                emit && this.dispatchEvent(TableEvent.ExpandRow, row, expanded, expandedSet/*readOnly*/);
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
                emit && this.dispatchEvent(TableEvent.ExpandTreeRow, row, expanded, store.treeExpandedSet/*readOnly*/);
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
            const {scrollBodyView, scrollBodyViewLeft, scrollBodyViewRight} = this.$refs;
            //update scroll bar
            this.moveY = ((this.scrollTop * 100) / scrollBodyView.clientHeight);
            //update scroll
            [scrollBodyViewLeft, scrollBodyView, scrollBodyViewRight].forEach(view => {
                view && (view.scrollTop = this.scrollTop);
            });
        },
        scrollLeft: function () {
            const {scrollBodyView, scrollHeaderView, scrollFooterView} = this.$refs;
            //update scroll bar
            this.moveX = ((this.scrollLeft * 100) / scrollBodyView.clientWidth);
            //calc 滚动位置，方便显示 固定列的左右shadow
            if (scrollBodyView.scrollWidth > scrollBodyView.clientWidth) { //存在滚动条
                if (this.scrollLeft === 0) {
                    this.scrollPosition = "left";
                } else if (this.scrollLeft === (scrollBodyView.scrollWidth - scrollBodyView.clientWidth)) {
                    this.scrollPosition = "right";
                } else {
                    this.scrollPosition = "middle";
                }
            }
            //update header
            scrollHeaderView && (scrollHeaderView.scrollLeft = this.scrollLeft);
            scrollFooterView && (scrollFooterView.scrollLeft = this.scrollLeft);
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
                newly !== older && this.$nextTick(() => {
                    const {scrollBodyView, scrollBodyViewLeft, scrollBodyViewRight} = this.$refs;
                    [scrollBodyView, scrollBodyViewLeft, scrollBodyViewRight].forEach(wrap => {
                        if (wrap) {
                            wrap.scrollTop = wrap.scrollLeft = 0;
                        }
                    })
                });
                this.store.handleTableDataChange();
            },
            immediate: true
        }
    },
}
</script>

<style lang="less">
@import './table.less';
</style>
