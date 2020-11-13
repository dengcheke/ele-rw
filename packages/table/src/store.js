import Vue from 'vue';
import {isDefined} from "@src/utils/index";

const LEFT = "left", Middle = "middle", RIGHT = "right";
export const ASC = "asc", DESC = 'desc';

let id = 0;

function ColumnNode(col) {
    const node = {
        type: col.type || 'text',//check expand
        key: col.key,//键,字段的值,
        label: col.label,//键名
        render: col.render,//渲染函数 cell
        renderHeader: col.renderHeader,//表头渲染函数
        sortable: !!col.sortable,//是否排序
        sort: null,//当前排序方式 asc / desc
        level: 1,//节点等级,从上往下增加,根为1
        isLeaf: false,//是否是叶子节点
        leafNum: 0,//子节点中叶子数目
        width: 80,//真实宽度 px值
        fixed: Middle,//固定位置，默认中间
        parent: null,//父节点
        children: [],//子节点
        col: col,//原始col对象
        _noRightBorder: false, //表头td 没有右border
    };
    Object.defineProperty(node, '_uid', {
        value: `col_${++id}`,
    });
    return node;
}

/**
 * 获取宽度
 * @param v 当前宽度
 * @param W 整体宽度值
 * @returns {number}
 */
function parseWidth(v, W) {
    const vStr = String(v);
    v = parseFloat(vStr);
    if (isNaN(v)) return 0;
    if (vStr.indexOf('px') !== -1) { //100.5px, v = 100.5; 取整
        return v >> 0;
    } else if (vStr.indexOf('%') !== -1) { //20.5% v = 20.5, W * 20.5% 然后取整
        return (W * v / 100) >> 0;
    } else {
        return v >> 0;
    }
}

export function mapping(attrName, mapper) {
    const res = {};
    Object.keys(mapper).forEach(key => {
        const value = mapper[key];
        let fn;
        if (typeof value === 'string') {
            fn = function () {
                return this[attrName] ? this[attrName][value] : null;
            };
        } else if (typeof value === 'function') {
            fn = function () {
                return value.call(this, this[attrName]);
            };
        } else {
            console.error('invalid value type');
        }
        if (fn) {
            res[key] = fn;
        }
    });
    return res;
}

const TableStore = Vue.extend({
    data() {
        this.table = null;
        return {
            containerWidth: 0,//容器宽度,列宽%以此为基准

            tableBodyWidth: 0,//内容宽度
            tableBodyHeight: 0,//内容高度

            defaultColWidth: 80,//col默认宽度

            //col info
            maxLevel: 0,//最大表头等级，（多级表头）
            columnLevelMap: {},//每一层节点信息 { 1:[col1,col2...],
                               //                2:[]       }
            leafColumns: [],//叶子节点数组,
            sortColumns: [],//所有排序的节点, sortable 为true的
            fixedLeftCount: 0,//左边固定列个数 ,一组算一个
            fixedRightCount: 0,//右边固定列个数
            fixedLeftWidth: 0,//左边固定总列宽
            fixedRightWidth: 0,//右边固定总列宽

            selectRow: null,
            selectIdx: null,

            hoverRow: null,
            hoverIdx: null,


            checkMap: new Map(),//所有勾选节点
            checkNums:0,
            checkTrigger:1
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
            let maxLevel = 1;
            while (stack.length) {
                const node = stack.shift();
                const col = node.col;
                node.sortable && this.sortColumns.push(node);

                if (node.parent) {
                    node.level = node.parent.level + 1;
                    node.fixed = node.parent.fixed;
                    maxLevel = Math.max(node.level, maxLevel); //更新 maxLevel
                } else {
                    node.level = 1;
                }
                if (columnLevelMap[node.level]) {
                    columnLevelMap[node.level].push(node);
                } else {
                    columnLevelMap[node.level] = [node];
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
            const ROOTS = this.columnLevelMap[1];
            ROOTS.forEach(node => {
                !node.isLeaf && this._updateNodeWidthInfo(node);
            });
            this._setBorderFlag(ROOTS);
            //*********
            this.fixedLeftWidth = fixedLeft;
            this.fixedRightWidth = fixedRight;
        },



        clearState() {
            this.selectRow = null;
            this.selectIdx = null;
            this.hoverIdx = null;
            this.hoverRow = null;
        },
    },
    watch: {
        containerWidth: function (v) {
            this.computedColWidth();//重新计算每列布局
        },
    }
});

export default TableStore;
