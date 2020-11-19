<template>
    <div class="ele-rw-table outer-wrapper" :uid="'table_uid_'+_globalTableId" :style="calcElStyle()">
        <div class="inner-wrapper" :style="calcInnerStyle()">
            <div class="table-middle">
                <div class="table__header-wrapper" ref="headerWrap">
                    <table-header/>
                </div>
                <div class="scroll-wrapper" ref="scrollWrap" v-show="!empty"
                     @mouseleave="mouseLeaveTable">
                    <div class="scroll-view" ref="scrollView"
                         @scroll.passive="handleScroll($event)"
                         :style="{
                        width: `calc(100% + ${barWidth}px)`,
                        height: `calc(100% + ${barWidth}px)`,
                     }">
                        <div class="table__body-wrapper" ref="bodyWrap">
                            <table-body ref="tbody"/>
                        </div>
                    </div>
                    <bar :move="moveX" :size="sizeWidth" ref="barX"/>
                    <bar vertical :move="moveY" :size="sizeHeight" ref="barY"/>
                </div>
                <empty-slot v-show="empty" style="color:white;flex:1 0 0"/>
            </div>
            <div class="table__fixed-left" v-if="fixedLeftCount"
                 :class="{'fixed-shadow':showLeftShadow}"
                 :style="{width:fixedLeftWidth+'px'}">
                <div class="table__header-wrapper fixed-left">
                    <table-header fixed="left"/>
                </div>
                <div class="table__body-wrapper fixed-left" ref="leftScrollWrap"
                     :style="{height:scrollWrapHeight+'px'}"
                     v-mousewheel="handleFixedMousewheel">
                    <table-body fixed="left"/>
                </div>
            </div>
            <div class="table__fixed-right" v-if="fixedRightCount"
                 :class="{'fixed-shadow':showRightShadow}"
                 :style="{ width:fixedRightWidth+'px'}">
                <div class="table__header-wrapper fixed-right"
                     :style="{height:headerWrapHeight+'px'}">
                    <table-header fixed="right" style="position: absolute;right: 0;top:0;"/>
                </div>
                <div class="table__body-wrapper fixed-right" ref="rightScrollWrap"
                     :style="{height:scrollWrapHeight+'px'}"
                     v-mousewheel="handleFixedMousewheel">
                    <table-body fixed="right" style="position: absolute;right: 0;top:0;"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
import {clamp, isDefined, mapping} from "@src/utils/index";
import {MouseWheel} from "@src/directives/v-mousewheel";
import EmptySlot from '../../empty-slot/main';
import store, {barWidthOb, getTableId} from './store';
import TableHeader from './table-header';
import TableBody from './table-body';
import ResizeObserver from 'resize-observer-polyfill';
import Bar from '../../bar';
/* $emit
*      click-row:  {row: 当前点击row, idx: row索引(第几行), event: 点击事件},
*      sort-change:  column:当前排序变化的列node, sortColumns:所有排序的列的node
*/
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
        expandRender: {
            type: Function,
            default: null,
            desc: "展开render(h,{row,idx})或者 template #expand={row,index} "
        },
        spanMethod:{
            type:Function,
            default:null,
            desc:'合并td方法 返回[rowspan,colspan],仅在常规col生效,check和expand不生效'
        },

        //style
        rowStyle:{
            type:Object|Function,
            default:null,
            desc:'tbody 行样式,fn({row,rowIndex)}'
        },
        rowClass:{
            type:String|Object|Array|Function,
            default:null,
            desc:'tbody 行class,fn({row,rowIndex)}'
        },
        cellStyle:{
            type:Object|Function,
            default:null,
            desc:'单元格样式,fn({row,rowIndex,col,colIndex})'
        },
        cellClass:{
            type:String|Object|Array|Function,
            default:null,
            desc:'单元格class,fn({row,rowIndex,col,colIndex})'
        },
        headerRowStyle:{
            type:Object|Function,
            default:null,
            desc:'表头 行样式,fn({row,rowIndex)}'
        },
        headerRowClass:{
            type:String|Object|Array|Function,
            default:null,
            desc:'表头行class,fn({row,rowIndex)}'
        },
        headerCellStyle:{
            type:Object|Function,
            default:null,
            desc:'表头单元格样式,fn({row,rowIndex,col,colIndex})'
        },
        headerCellClass:{
            type:String|Object|Array|Function,
            default:null,
            desc:'表头单元格class,fn({row,rowIndex,col,colIndex})'
        },

        enableHighlightCol:{
            type:Boolean,
            default:false,
        },
        highlightColHeaderCellStyle:{
            type:Object,
            default:null
        },
        highlightColRowCellStyle:{
            type:Object,
            default:null
        },
    },
    components: {
        EmptySlot, TableHeader, TableBody, Bar
    },
    data() {
        this.store = new store();
        this.store.table = this;
        this._globalTableId = getTableId();
        this.headerStyleElm = document.createElement('style');
        document.body.appendChild(this.headerStyleElm);
        this.headerStyleElm.setAttribute('use-for-table-'+this._globalTableId,"");
        this.$once('hook:beforeDestroy',()=>{
            document.body.removeChild(this.headerStyleElm)
        })
        return {
            headerWrapHeight: 0, //header内容高度

            bodyWrapHeight: 0, //bodywrap内容高度
            bodyWrapWidth: 0,//bodywrap内容宽度

            scrollWrapHeight: 0, //滚动区域高度， fixed left/right body 高度应该与此一致，

            //滚动相关
            sizeWidth: 0, //滚动条宽度
            sizeHeight: 0, //滚动条高度
            moveX: 0,
            moveY: 0,
            scrollLeft: 0,
            scrollTop: 0,
            scrollPosition: 'left',
        }
    },
    mounted() {
        this.initEvent();
        setTimeout(() => {
            this.updateScrollBar();
        })
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
            style.width = Math.min(W, (this.bodyWrapWidth || this.tableBodyWidth)) + 'px';
            if (this.height === 'auto') { //内容增长模式
                const min = this.minHeight, max = this.maxHeight;
                let contentH;
                if (this.empty) {
                    contentH = this.headerWrapHeight; //内容高度
                } else {
                    contentH = this.headerWrapHeight + this.bodyWrapHeight; //内容高度
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
            const view = this.$refs.scrollView,
                barX = this.$refs.barX,
                barY = this.$refs.barY;
            barX.wrap = barY.wrap = view;

            //监听size change
            const el = this.$el;
            const headerWrap = this.$refs.headerWrap;
            const bodyWrap = this.$refs.bodyWrap;
            const scrollWrap = this.$refs.scrollWrap;

            const ro = new ResizeObserver((entries) => {
                //not visible
                if (!el.offsetHeight || !el.offsetWidth) return;

                const elEn = entries.find(en => en.target === el);
                if (elEn) {
                    const w = el.clientWidth, h = el.clientHeight;
                    if (w && h) {
                        this.store.containerWidth = w;
                    }
                }

                const hwEn = entries.find(en => en.target === headerWrap);
                if (hwEn) {
                    this.headerWrapHeight = headerWrap.offsetHeight;
                }

                const bwEn = entries.find(en => en.target === bodyWrap);
                if (bwEn && !this.empty) {
                    this.bodyWrapHeight = bodyWrap.offsetHeight;
                    this.bodyWrapWidth = bodyWrap.offsetWidth;
                }

                const swEn = entries.find(en => en.target === scrollWrap);
                if (swEn && !this.empty) {
                    this.scrollWrapHeight = scrollWrap.offsetHeight;
                }
                this.$nextTick(() => {
                    this.updateScrollBar();
                });
            });
            ro.observe(el);
            ro.observe(headerWrap);
            ro.observe(bodyWrap);
            ro.observe(scrollWrap);
            this.$once("hooK:beforeDestroy", () => {
                ro.disconnect();
            });
        },
        /*在中间非固定表滚动时*/
        handleScroll(e) {
            const target = this.$refs.scrollView,
                leftWrap = this.$refs.leftScrollWrap,
                rightWrap = this.$refs.rightScrollWrap,
                header = this.$refs.headerWrap;
            this.scrollLeft = target.scrollLeft;
            this.scrollTop = target.scrollTop;
            if (target.scrollWidth > target.clientWidth) { //存在滚动条
                if (this.scrollLeft === 0) {
                    this.scrollPosition = "left";
                } else if (this.scrollLeft === (target.scrollWidth - target.clientWidth)) {
                    this.scrollPosition = "right";
                } else {
                    this.scrollPosition = "middle";
                }
            }
            this.moveX = ((target.scrollLeft * 100) / target.clientWidth);
            this.moveY = ((target.scrollTop * 100) / target.clientHeight);
            [leftWrap, rightWrap].forEach(w => {
                if (w) {
                    w.scrollTop = this.scrollTop;
                }
            });
            if (header) {
                header.scrollLeft = this.scrollLeft;
            }
        },
        //更新滚动条宽高
        updateScrollBar() {
            let heightPercentage, widthPercentage;
            const wrap = this.$refs.scrollView;
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
            const scrollView = this.$refs.scrollView;
            if (!scrollView) return;
            if (Math.abs(data.spinY) > 0) {
                const currentScrollTop = scrollView.scrollTop;
                if (data.pixelY < 0 && currentScrollTop !== 0) {
                    event.preventDefault();
                }
                if (data.pixelY > 0 && (scrollView.scrollHeight - scrollView.clientHeight > currentScrollTop)) {
                    event.preventDefault();
                }
                scrollView.scrollTop += Math.ceil(data.pixelY / 5);
            } else {
                scrollView.scrollLeft += Math.ceil(data.pixelX / 5);
            }
        },
        /*鼠标离开组件时*/
        mouseLeaveTable() {
            this.store.hoverIdx = this.store.hoverRow = null;
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
        getRow(row) {
            return this.tableData.find(i => {
                if (!row) return false;
                if (typeof row === 'object') {
                    if (i === row) {
                        return true;
                    } else {
                        let key1 = this.getRowKey(i), key2 = this.getRowKey(row);
                        return !!(isDefined(key1) && isDefined(key2) && key1 === key2);
                    }
                } else { //默认row是id值
                    return this.getRowKey(i) === row;
                }
            })
        },

        //设置当前行
        setCurrentRow(row) {
            const store = this.store;
            row = this.getRow(row);
            if (!row) return;
            if (row !== store.selectRow) {
                store.selectRow = row;
                store.selectIdx = this.tableData.findIndex(i => i === row);
            } else {
                store.selectRow = null;
                store.selectIdx = null;
            }
        },
        //清空选中对象
        clearCurrentRow() {
            this.store.selectRow = this.store.selectIdx = null;
        },

        //勾选节点
        toggleRowChecked(row, checked) {
            const store = this.store, checkedRows = store.checkedRows;
            row = this.getRow(row);
            if (!row) return;
            let change = false, i = checkedRows.indexOf(row);
            if (isDefined(checked)) { //指定了状态
                checked = Boolean(checked)
            } else { //未指定，toggle
                checked = i === -1
            }
            if (checked && i === -1) {
                checkedRows.push(row);
                store.checkNums++;
                change = true;
            } else if (!checked && i !== -1) {
                checkedRows.splice(i, 1);
                store.checkNums--;
                change = true;
            }
            change && this.store.checkTrigger++;
        },
        setAllChecked(check) {
            check = Boolean(check);
            this.store.checkedRows = check ? [...this.tableData] : [];
            this.store.checkNums = check ? this.tableData.length : 0;
            this.store.checkTrigger++;
        },
        //展开节点
        toggleRowExpanded(row, expanded) {
            const store = this.store, expandedRows = store.expandedRows;
            row = this.getRow(row);
            if (!row) return;
            let change = false, i = expandedRows.indexOf(row);
            if (isDefined(expanded)) { //指定了状态
                expanded = Boolean(expanded)
            } else { //未指定，toggle
                expanded = i === -1
            }
            if (expanded && i === -1) {
                expandedRows.push(row);
                change = true;
            } else if (!expanded && i !== -1) {
                expandedRows.splice(i, 1);
                change = true;
            }
            change && this.store.expandTrigger++;
        },
        setAllExpanded(expanded) {
            expanded = Boolean(expanded);
            this.store.expandedRows = expanded ? [...this.tableData] : [];
        },
        //获取排序的列节点
        getSortColumnNodes() {
            return this.store.sortColumns;
        },

        _handleTableDataChange(newly, older) {
            //重新赋值,滚动到左上角
            newly !== older && this.$nextTick(() => {
                const {scrollView, leftScrollWrap, rightScrollWrap} = this.$refs;
                [scrollView, leftScrollWrap, rightScrollWrap].forEach(wrap => {
                    if (wrap) {
                        wrap.scrollTop = wrap.scrollLeft = 0;
                    }
                })
            });
            const store = this.store;
            store.hoverIdx = store.hoverRow = null;
            //update select
            {
                const idx = newly.indexOf(store.selectRow);
                if (idx !== -1) {
                    store.selectIdx = idx;
                } else {
                    store.selectRow = store.selectIdx = null;
                }
            }
            //update check
            {
                const oldChecks = store.checkedRows;
                let newChecks = store.checkedRows = [];
                this.tableData.forEach(row => {
                    let i = oldChecks.indexOf(row);
                    if (i !== -1) {
                        newChecks.push(row);
                        oldChecks.splice(i, 1);
                    }
                });
                this.store.checkNums = newChecks.length;
                oldChecks.length && this.store.checkTrigger++;
            }
            //update expand
            {
                const oldExpandRows = store.expandedRows;
                let newExpandRows = store.expandedRows = [];
                this.tableData.forEach(row => {
                    let i = oldExpandRows.indexOf(row);
                    if (i !== -1) {
                        newExpandRows.push(row);
                        oldExpandRows.splice(i, 1);
                    }
                });
                oldExpandRows.length && this.store.expandTrigger++;
            }
        },
    },
    watch: {
        'store.checkTrigger': {
            handler: function () {
                this.$emit('check-change', [...this.store.checkedRows]);
            }
        },
        'store.expandTrigger': {
            handler: function () {
                this.$emit('expand-change', [...this.store.expandedRows]);
            }
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
                this._handleTableDataChange(newly, older);
            },
            immediate: true
        }
    },
}
</script>

<style lang="less">
@import './table.less';
</style>
