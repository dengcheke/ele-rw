import Vue from 'vue';
import {isDefined, treeToArray} from "@src/utils/index";
import {
    getColId,
    isNotEmptyArray,
    moveItemNewHasInOld,
    parseWidth,
    walkTreeNode
} from "./utils";
import {TableEvent} from "./table-config";

export const LEFT = "left", Middle = "middle", RIGHT = "right";
export const ASC = "asc", DESC = 'desc';


export function ColumnNode(col) {
    const node = {
        type: col.type || 'text',//check expand
        key: col.key,//键,字段的值,
        label: col.label,//键名
        render: col.render,//渲染函数 cell
        renderHeader: col.renderHeader,//表头渲染函数
        renderFooter: col.renderFooter,//表尾渲染函数
        sortable: !!col.sortable,//是否排序
        align: col.align, //对齐方式
        headerAlign: col.headerAlign,
        footerAlign: col.footerAlign,
        fixed: col.fixed || Middle,//固定位置，默认中间
        col: col,//原始col对象

        sort: null,//当前排序方式 asc / desc
        level: 0,//节点等级,从上往下增加,根为0
        levelIndex: null, //在当前层的col索引位置 从0开始
        isLeaf: false,//是否是叶子节点
        leafNum: 0,//子节点中叶子数目
        width: 80,//真实宽度 px值
        parent: null,//父节点
        children: [],//子节点,columnNode

        _noRightBorder:false,//是父节点最后的一个子节点
        _noShadowRightBorder:false,
    };
    Object.defineProperty(node, '_uid', {
        value: `col_${getColId()}`,
    });
    return node;
}

const TableStore = Vue.extend({
    data() {
        this.table = null;
        ///don't use follow attr in computed or it can not update !!!!
        this.checkedSet = new Set();//所有勾选节点,checkrow 不影响渲染,只是添加标记class,非响应式
        this.treeExpandedSet = new Set();//所有的树形展开节点
        this.expandedSet = new Set(); //所有的展开行
        /*
            树形row的map集合,
            有子节点或者是非根叶子节点才会出现在里面
            row:{
                parent:,
                children:[],
                level:,
                show:,
                treeExpand:
            }*/
        this.treeData = new Map();
        return {
            containerWidth: 0,//容器宽度,列宽%以此为基准
            tableBodyWidth: 0,//tbody内容宽度
            defaultColWidth: 80,//col默认宽度

            //col info
            maxLevel: 0,//最大表头等级，（多级表头）
            columnLevelMap: {},//每一层节点信息 { 0:[col1,col2...],
                               //                1:[]       }
            leafColumns: [],//叶子节点数组,
            sortColumns: [],//所有排序的节点, sortable 为true的
            fixedLeftCount: 0,//左边固定列个数 ,一组算一个
            fixedRightCount: 0,//右边固定列个数
            fixedLeftWidth: 0,//左边固定总列宽
            fixedRightWidth: 0,//右边固定总列宽

            flatDfsData: [],//tableData深度遍历的展开数据,
            renderList: [],//当前渲染列表,tableData 展开数据一部分,包含treeExpand, expand
            renderListTrigger: 1,//渲染列表变化

            selectRow: null,
            select$Idx: null, //dom index

            hoverRow: null,
            hover$Idx: null, //dom index

            checkNums: 0,
            checkTrigger: 1, //勾选项变化,不影响renderList, table: emit event | tobody: update class
            expandTrigger: 1, //展开行变化,影响renderList,  table: emit event,
            treeExpandTrigger: 1,//树形展开变化,影响renderList, table: emit event
            sortChangeTrigger:1,
        }
    },
    methods: {
        _updateNodeWidthInfo(node) {
            node.width = computedWidth(node);

            function computedWidth(node) {
                if (node.isLeaf) {
                    return node.width;
                } else {
                    const w = node.children.reduce((pre, child) => {
                        pre += computedWidth(child);
                        return pre;
                    }, 0);
                    node.width = w;
                    return w;
                }
            }
        },
        _setNodeOtherInfo(nodes) {
            const last = nodes[nodes.length - 1];
            last._noRightBorder = true;
            nodes.find((item,idx)=>{
                let i = nodes[idx+1];
                if(item.fixed==='left' && i && i.fixed!=='left'){
                    return (item._noShadowRightBorder = true);
                }
            });
            const childs = last.children || [];
            childs.length && this._setNodeOtherInfo(childs);

        },
        checkFixedCol(cols) {
            const left = [], middle = [], right = [];
            cols.forEach(col => {
                const fixed = findFixed(col);
                if (fixed === LEFT) {
                    left.push(col);
                } else if (fixed === RIGHT) {
                    right.push(col);
                } else {
                    middle.push(col);
                }
            });
            const leftNodes = left.map(col => {
                const node = new ColumnNode(col);
                node.fixed = LEFT;
                return node;
            });
            const middleNodes = middle.map(col => {
                const node = new ColumnNode(col);
                node.fixed = Middle;
                return node;
            });
            const rightNodes = right.map(col => {
                const node = new ColumnNode(col);
                node.fixed = RIGHT;
                return node;
            });
            this.fixedLeftCount = leftNodes.length;
            this.fixedRightCount = rightNodes.length;
            return [...leftNodes, ...middleNodes, ...rightNodes];

            //查找列的fix信息,取第一个值
            function findFixed(col) {
                let fixed, stack = [col];
                while (!fixed && stack.length) {
                    const c = stack.shift();
                    fixed = c.fixed;
                    if (fixed) break;
                    c.children && c.children.forEach(child => {
                        stack.push(child);
                    });
                }
                return fixed;
            }
        },
        //计算col信息
        computedCols(cols) {
            const columnLevelMap = {}, leafColumns = [];
            const rootNodes = this.checkFixedCol(cols);
            const stack = [...rootNodes]; // 左  中 右
            let maxLevel = 0;
            while (stack.length) {
                const node = stack.shift();
                const col = node.col;
                node.sortable && this.sortColumns.push(node);

                if (node.parent) {
                    node.level = node.parent.level + 1;
                    node.fixed = node.parent.fixed;
                    maxLevel = Math.max(node.level, maxLevel); //更新 maxLevel
                } else {
                    node.level = 0;
                }
                if (columnLevelMap[node.level]) {
                    node.levelIndex = columnLevelMap[node.level].push(node) - 1;
                } else {
                    columnLevelMap[node.level] = [node];
                    node.levelIndex = 0;
                }
                if (col.children && col.children.length) {
                    node.isLeaf = false;
                    //don't use col.children.reverse(), col.children will change
                    for (let childCol of [...col.children].reverse()) {
                        const childNode = new ColumnNode(childCol);
                        stack.unshift(childNode);
                        childNode.parent = node;
                        node.children.unshift(childNode);
                    }
                } else {
                    node.isLeaf = true;
                    leafColumns.push(node);
                    let p = node.parent;
                    while (p) {
                        p.leafNum += 1; //更新每个父节点 的 叶子个数
                        p = p.parent;
                    }
                }
            }
            /*Object.keys(columnLevelMap).sort().forEach(level => {
                console.log(level, columnLevelMap[level].map(node => node.label));
            });*/
            //console.log(columnLevelMap);
            this.maxLevel = maxLevel;
            this.columnLevelMap = columnLevelMap;
            this.leafColumns = leafColumns;
        },
        //计算col宽度布局，决定table整体宽度
        computedColWidth() {
            let sumW = 0, W = this.containerWidth,
                flexWidthNum = 0, len = this.leafColumns.length;
            if (!W || !len) return;
            for (let i = 0; i < len; i++) {
                const node = this.leafColumns[i], col = node.col;
                if (isDefined(col.minWidth)) {
                    node.width = parseWidth(col.minWidth, W);
                    sumW += node.width;
                    flexWidthNum++;
                } else if (isDefined(col.width)) {
                    node.width = parseWidth(col.width, W);
                    sumW += node.width;
                } else {
                    node.width = this.defaultColWidth;
                    sumW += node.width;
                }
            }
            let leftWidth = W - sumW; //剩余可分配宽度
            if (flexWidthNum && leftWidth > 0) {
                const aver = (leftWidth / flexWidthNum) >> 0; //取整
                for (let i = 0; i < this.leafColumns.length; i++) {
                    const node = this.leafColumns[i];
                    if (isDefined(node.col.minWidth)) {
                        node.width += aver;
                        leftWidth -= aver;
                    }
                }
                //将剩余的分配掉,从前往后
                if (leftWidth > 0) {
                    let idx = 0;
                    while (leftWidth > 0) {
                        const node = this.leafColumns[idx];
                        if (node.col.minWidth) {
                            node.width += 1;
                            leftWidth -= 1;
                        }
                        idx += 1;
                    }
                }
            }
            let fixedLeft = 0, fixedRight = 0;
            this.tableBodyWidth = this.leafColumns.reduce((pre, cur) => {
                pre += cur.width;
                if (cur.fixed === LEFT) fixedLeft += cur.width;
                if (cur.fixed === RIGHT) fixedRight += cur.width;
                return pre;
            }, 0);
            this.fixedLeftWidth = fixedLeft;
            this.fixedRightWidth = fixedRight;
            //*********这一步可以不做
            const ROOTS = this.columnLevelMap[0];
            ROOTS.forEach(node => {
                !node.isLeaf && this._updateNodeWidthInfo(node);
            });
            this._setNodeOtherInfo(ROOTS);
            //********
        },

        //改变一列的宽度
        changeColWidth(colNode, delta) {
            const colIndex = this.leafColumns.indexOf(colNode);
            if (colIndex === -1) return;
            //更新colNode宽度
            colNode.width += delta;
            //tableBodyWidth,fixedLeftWidth,fixedRightWidth
            let fixedLeft = 0, fixedRight = 0;
            this.tableBodyWidth = this.leafColumns.reduce((pre, cur) => {
                pre += cur.width;
                if (cur.fixed === LEFT) fixedLeft += cur.width;
                if (cur.fixed === RIGHT) fixedRight += cur.width;
                return pre;
            }, 0);
            this.fixedLeftWidth = fixedLeft;
            this.fixedRightWidth = fixedRight;
            const ROOTS = this.columnLevelMap[0];
            ROOTS.forEach(node => {
                !node.isLeaf && this._updateNodeWidthInfo(node);
            });
        },

        handleTableDataChange() {
            this.hover$Idx = this.hoverRow = null;
            const {childrenKey} = this.table;
            //更新树节点map,要开启树结构必须指定childrenKey
            childrenKey && this.updateTreeDataMap();
            //更新树结构的深度遍历list, flat data ,拉平成一维数组
            this.flatDfsData = treeToArray(this.table.tableData, childrenKey, true);
            //更新check,expand,treeExpand 状态,
            this.updateTreeExpand();
            this.updateCheck();
            this.updateExpand();
            //更新渲染列表
            this.updateRenderList();
            //更新select，select只存在于渲染出的，在renderList之后更新
            this.updateSelect();
        },
        //更新树形map数据
        updateTreeDataMap() {
            const {tableData, childrenKey} = this.table;
            const oldMap = this.treeData;
            let map = this.treeData = new Map();
            walkTreeNode(tableData, (row, parent, children, level) => {
                if (isNotEmptyArray(children) || !!parent) {//有子节点或者是叶子节点
                    const treeNodeData = {
                        parent: parent,
                        children: children,
                        level: level,
                        isLeaf: !!parent && (!children || children.length === 0),
                        treeExpand: null,
                    }
                    const old = oldMap.get(row);
                    treeNodeData.treeExpand = old ? old.treeExpand : false;
                    map.set(row, treeNodeData);
                }
            }, childrenKey);
        },
        //update state
        updateTreeExpand() {
            const oldTreeExpands = this.treeExpandedSet;
            const newTreeExpands = this.treeExpandedSet = new Set();
            moveItemNewHasInOld(this.flatDfsData, oldTreeExpands, newTreeExpands);
            //don't use trigger, tbody has watch renderTrigger to update row class,
            //avoid trigger update twice
            oldTreeExpands.size && this.table.dispatchEvent(TableEvent.TreeExpandChange, newTreeExpands);
        },
        updateCheck() {
            const oldChecks = this.checkedSet;
            let newChecks = this.checkedSet = new Set();
            moveItemNewHasInOld(this.flatDfsData, oldChecks, newChecks);
            this.checkNums = newChecks.size;
            oldChecks.size && this.table.dispatchEvent(TableEvent.CheckChange, newChecks);
        },
        updateExpand() {
            const oldExpandRows = this.expandedSet;
            let newExpandRows = this.expandedSet = new Set();
            moveItemNewHasInOld(this.flatDfsData, oldExpandRows, newExpandRows);
            oldExpandRows.size && this.table.dispatchEvent(TableEvent.ExpandChange, newExpandRows);
        },
        //update renderList
        updateRenderList() {
            const treeMap = this.treeData, notExpandSet = new Set();
            const list = this.flatDfsData.map(row => {
                if (!treeMap.has(row)) { //非树形节点,一定会渲染
                    return row;
                } else { //树形节点
                    const selfNode = treeMap.get(row);
                    if (selfNode.level === 0) { //树节点的根一定显示
                        !selfNode.treeExpand && notExpandSet.add(row);
                        return row;
                    } else { //取决于父节点的treeExpand
                        if (notExpandSet.has(selfNode.parent)) { //父元素没展开,自己不会显示
                            notExpandSet.add(row);
                            return false;
                        } else { //父元素展开,自己可见
                            if (!selfNode.isLeaf && !selfNode.treeExpand) {
                                notExpandSet.add(row);
                            }
                            return row;
                        }
                    }
                }
            }).filter(Boolean);
            //插入expandrow
            for (let i = 0; i < list.length; i++) {
                const row = list[i];
                if (this.expandedSet.has(row)) {
                    list.splice(i + 1, 0, ['expand', row]);
                    i = i + 1;
                }
            }
            this.renderList = list;
            this.renderListTrigger++;
        },
        updateSelect() {
            const idx = this.renderList.indexOf(this.selectRow);
            if (idx !== -1) {
                this.select$Idx = idx;
            } else {
                this.selectRow = this.select$Idx = null;
            }
        },
    },
    watch: {
        containerWidth: function (v) {
            this.computedColWidth();//重新计算每列布局
        },
    }
});

export default TableStore;
