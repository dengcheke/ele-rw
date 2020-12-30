<script type="text/jsx">
import {mapping} from "@src/utils/index";
import BodyTrRender from './tbody-tr-render';
import ExpandTrRender from './expand-tr-render';
import {addClass, removeClass} from "@src/utils/dom";
import {walkTreeNode} from "./utils";

export default {
    name: "table-body",
    inject: ['table', 'store'],
    components: {BodyTrRender, ExpandTrRender},
    props: {
        fixed: {
            default: "middle",
        },
    },
    computed: {
        ...mapping('store', {
            leafColumns: store => store.leafColumns || [],
            tableBodyWidth: store => store.tableBodyWidth || 0,
            renderList: store => store.renderList,
            flatDfsData: store => store.flatDfsData,
        }),
    },
    render(h) {
        const columns = this.leafColumns, {getRowKey, tableData} = this.table;
        const colGroup = (<colgroup>
            {
                columns.map(column => {
                    return <col key={column.key} width={column.width}/>
                })
            }
        </colgroup>);
        const trs = this.renderList.map((_row, domIdx) => {
            let vnode, type, row;
            if (Array.isArray(_row)) {
                type = _row[0];
                row = _row[1];
            } else {
                type = 'row';
                row = _row;
            }
            const key = getRowKey(row);
            const index = tableData.indexOf(row);
            if (type === 'row') {
                const trData = {
                    attrs: {
                        row: row,
                        index: index, //数据index
                        domIndex: domIdx, //dom index
                        fixed: this.fixed,
                        treeNodeData: this.store.treeData.get(row),
                    },
                    key: key ? '_row_' + key : undefined,
                }
                vnode = <BodyTrRender {...trData}/>;
            } else if (type === 'expand') {
                const expandData = {
                    attrs: {
                        row: row,
                        index: index,
                        domIndex: domIdx
                    },
                    key: key ? '_expand_row_' + key : undefined
                }
                vnode = <ExpandTrRender {...expandData}/>
            } else {
                throw new Error('Unexpected type');
            }
            return vnode;
        });
        let $append = this.table.$scopedSlots.append;
        if ($append) {
            trs.push(<tr class="append-row">
                <td class="append-cell" colSpan={columns.length}>
                    {$append() || null}
                </td>
            </tr>);
        }
        const tableAttr = {
            class: ['table__body'],
            style: {
                width: this.tableBodyWidth + 'px',
            },
            attrs: {
                cellspacing: "0",
                cellpadding: "0",
                border: "0"
            },
        };
        const table = <table {...tableAttr}>
            {colGroup}
            <tbody>
            {trs}
            </tbody>
        </table>
        return table;
    },
    methods: {
        updateTreeExpandClass() {
            this.$nextTick(() => {
                const elms = this.$el.querySelectorAll('tr.row');
                const expands = this.store.treeExpandedSet;
                this.renderList.forEach((row, idx) => {
                    expands.has(row)
                        ? addClass(elms[idx], 'is-tree-expanded')
                        : removeClass(elms[idx], 'is-tree-expanded')
                });
            })
        },
        updateExpandClass() {
            this.$nextTick(() => {
                const elms = this.$el.querySelectorAll('tr.row');
                const expands = this.store.expandedSet;
                this.renderList.forEach((row, idx) => {
                    if (idx <= 0) return;
                    row[0] === 'expand' && expands.has(row[1])
                        ? addClass(elms[idx - 1], 'is-expanded')
                        : removeClass(elms[idx - 1], 'is-expanded')
                })
            })
        },
        updateCheckClass() {
            this.$nextTick(() => {
                const elms = this.$el.querySelectorAll('tr.row');
                const {checkedSet, treeData} = this.store;
                const {childrenKey} = this.table;
                this.renderList.forEach((row, idx) => {
                    if (Array.isArray(row)) return;
                    let i = treeData.get(row);
                    if (i && !i.isLeaf) { //非叶子树节点
                        const children = i.children;
                        let check, uncheck;
                        walkTreeNode(children, (row) => {
                            if (checkedSet.has(row)) {
                                check = true;
                            } else {
                                uncheck = true;
                            }
                            if (check && uncheck) return walkTreeNode.STOP;
                        }, childrenKey, false);
                        if (check && !uncheck) { //全选
                            addClass(elms[idx], 'is-checked');
                            removeClass(elms[idx], 'is-indeterminate');
                        } else if (check && uncheck) { //半选
                            addClass(elms[idx], 'is-indeterminate');
                            removeClass(elms[idx], 'is-checked');
                        } else {
                            removeClass(elms[idx], 'is-checked');
                            removeClass(elms[idx], 'is-indeterminate');
                        }
                        return;
                    }
                    checkedSet.has(row)
                        ? addClass(elms[idx], 'is-checked')
                        : removeClass(elms[idx], 'is-checked')
                });
            })
        },
    },

    watch: {
        // renderList更新后 即使state未变，但行索引可能变化
        'store.renderListTrigger': {
            handler: function () {
                this.updateTreeExpandClass();
                this.updateCheckClass();
                this.updateExpandClass();
            }
        },
        'store.checkTrigger': {
            handler: function () {
                this.updateCheckClass();
            }
        },
        'store.select$Idx': {
            handler: function (newRowIdx, oldRowIdx) {
                this.$nextTick(() => {
                    const rows = this.$el.querySelectorAll('tr.row');
                    const oldRowDom = rows[oldRowIdx];
                    const newRowDom = rows[newRowIdx];
                    oldRowDom && removeClass(oldRowDom, 'current-row');
                    newRowDom && addClass(newRowDom, 'current-row');
                });
            },
        },
        'store.hover$Idx': {
            handler: function (newRowIdx, oldRowIdx) {
                this.$nextTick(() => {
                    const rows = this.$el.querySelectorAll('tr.row');
                    const oldRowDom = rows[oldRowIdx];
                    const newRowDom = rows[newRowIdx];
                    oldRowDom && removeClass(oldRowDom, 'is-hover');
                    newRowDom && addClass(newRowDom, 'is-hover');
                })
            }
        },
    }
}
</script>
