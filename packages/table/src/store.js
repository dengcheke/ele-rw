import Vue from 'vue';
import {isDefined} from "@src/utils/index";
import {
    getColId,
    isNotEmptyArray,
    moveItemNewHasInOld,
    parseWidth,
    walkTreeNode
} from "ele-rw-ui/packages/table/src/utils";

export const LEFT = "left", Middle = "middle", RIGHT = "right";
export const ASC = "asc", DESC = 'desc';


export function ColumnNode(col) {
    const node = {
        type: col.type || 'text',//check expand
        key: col.key,//键,字段的值,
        label: col.label,//键名
        render: col.render,//渲染函数 cell
        renderHeader: col.renderHeader,//表头渲染函数
        sortable: !!col.sortable,//是否排序
        sort: null,//当前排序方式 asc / desc
        level: 0,//节点等级,从上往下增加,根为0
        levelIndex: null, //在当前层的col索引位置 从0开始
        isLeaf: false,//是否是叶子节点
        leafNum: 0,//子节点中叶子数目
        align: col.align, //对齐方式
        headerAlign: col.headerAlign,
        width: 80,//真实宽度 px值
        fixed: col.fixed || Middle,//固定位置，默认中间
        parent: null,//父节点
        children: [],//子节点
        col: col,//原始col对象
        _noRightBorder: false, //表头td 没有右border
    };
    Object.defineProperty(node, '_uid', {
        value: `col_${getColId()}`,
    });
    return node;
}

const TableStore = Vue.extend({
    data() {
        this.table = null;
        this.checkedSet = new Set();//所有勾选节点,checkrow 不影响渲染,只是添加标记class,非响应式
        this.treeExpandedSet = new Set();//
        return {
            containerWidth: 0,//容器宽度,列宽%以此为基准

            tableBodyWidth: 0,//内容宽度

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

            flatDfsData: [],//tableData深度遍历的展开数据(包括动态添加的),
            renderList: [],//当前渲染列表,tableData 展开数据一部分,包含treeExpand
            renderListTrigger: 1,//更新renderlist trigger

            selectRow: null,
            selectIdx: null,

            hoverRow: null,
            hoverIdx: null,

            checkNums: 0,
            checkTrigger: 1, //勾选变化

            expandedRows: [], //所有的展开行，不是treeNode展开, use in tbody render
            expandTrigger: 1, //展开行变化


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
            treeData: new Map(),
            treeExpandTrigger: 1
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
        _setBorderFlag(nodes) {
            const last = nodes[nodes.length - 1];
            last._noRightBorder = true;
            const childs = last.children || [];
            childs.length && this._setBorderFlag(childs);
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
            let sumW = 0, W = this.containerWidth, flexNum = 0, len = this.leafColumns.length;
            if (!W || !len) return;
            for (let i = 0; i < len; i++) {
                const node = this.leafColumns[i], col = node.col;
                if (isDefined(col.minWidth)) {
                    node.width = parseWidth(col.minWidth, W);
                    sumW += node.width;
                    flexNum++;
                } else if (isDefined(col.width)) {
                    node.width = parseWidth(col.width, W);
                    sumW += node.width;
                } else {
                    node.width = this.defaultColWidth;
                    sumW += node.width;
                }
            }
            let leftWidth = W - sumW; //剩余可分配宽度
            if (flexNum && leftWidth > 0) {
                const aver = (leftWidth / flexNum) >> 0; //每列分得平均宽度 取整
                for (let i = 0; i < this.leafColumns.length; i++) {
                    const node = this.leafColumns[i];
                    if (isDefined(node.col.minWidth)) {
                        if (flexNum > 1) {
                            node.width += aver;
                            flexNum -= 1;
                            leftWidth -= aver;
                        } else {
                            node.width += leftWidth; //所有的小数误差都分给最后一列
                        }
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

            //*********这一步可以不做
            const ROOTS = this.columnLevelMap[0];
            ROOTS.forEach(node => {
                !node.isLeaf && this._updateNodeWidthInfo(node);
            });
            this._setBorderFlag(ROOTS);
            //*********
            this.fixedLeftWidth = fixedLeft;
            this.fixedRightWidth = fixedRight;
        },

        //when tableData change
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
                        isLeaf: !!parent && !isDefined(children),
                        show: null, //树节点是否可见
                        treeExpand: null, //树节点是否展开(不可见也是可以展开的,保存展开状态)
                    }
                    const old = oldMap.get(row);
                    if (old) {
                        treeNodeData.show = old.show;
                        treeNodeData.treeExpand = old.treeExpand;
                    } else {
                        treeNodeData.show = !treeNodeData.isLeaf;//根节点必定可见
                        treeNodeData.treeExpand = false;
                    }
                    map.set(row, treeNodeData);
                }
            }, childrenKey);
        },
        updateRenderList() {
            const treeMap = this.treeData, notExpandSet = new Set();
            this.renderList = this.flatDfsData.map(row => {
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
        },
        //after treeMap and renderList update
        updateSelect(){
            const idx = this.renderList.indexOf(this.selectRow);
            if (idx !== -1) {
                this.selectIdx = idx;
            } else {
                this.selectRow = this.selectIdx = null;
            }
        },
        updateTreeExpand(){
            const oldTreeExpands = this.treeExpandedSet;
            const newTreeExpands = this.treeExpandedSet = new Set();
            moveItemNewHasInOld(this.flatDfsData,oldTreeExpands,newTreeExpands);
            this.treeExpandTrigger++;
        },
        updateCheck(){
            const oldChecks = this.checkedSet;
            let newChecks = this.checkedSet = new Set();
            moveItemNewHasInOld(this.flatDfsData,oldChecks,newChecks);
            this.checkNums = newChecks.size;
            this.checkTrigger++;
        },
        updateExpand(){
            const oldExpandRows = this.expandedRows;
            let newExpandRows = this.expandedRows = [];
            moveItemNewHasInOld(this.flatDfsData,oldExpandRows,newExpandRows);
            this.expandTrigger++;
        }
    },
    watch: {
        containerWidth: function (v) {
            this.computedColWidth();//重新计算每列布局
        },
        renderListTrigger: function () {
            this.updateRenderList();
            this.updateSelect();
            this.updateTreeExpand();
            this.updateCheck();
            this.updateExpand();
        }
    }
});

export default TableStore;
