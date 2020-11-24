<script type="text/jsx">
import {mapping} from "@src/utils/index";
import BodyTrRender from './tbody-tr-render';
import ExpandTrRender from './expand-tr-render';
import {addClass, removeClass} from "@src/utils/dom";

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
            renderList: 'renderList',
            flatDfsData: 'flatDfsData',
            treeData: 'treeData',
            expandedRows: 'expandedRows'
        }),
    },
    render(h) {
        const columns = this.leafColumns,
            expandRender = this.table.expandRender || this.table.$scopedSlots.expand;
        const colGroup = (<colgroup>
            {
                columns.map(column => {
                    return <col key={column.key} width={column.width}/>
                })
            }
        </colgroup>);
        const trs = this.renderList.map((row, idx) => {
            const key = this.table.getRowKey(row);
            let trVnode, expandVnode;
            const trData = {
                attrs: {
                    row: row,
                    idx: idx,
                    fixed: this.fixed,
                    treeNodeData: this.treeData.get(row),
                },
                key: key ? '_row_' + key : undefined,
            }
            trVnode = <BodyTrRender {...trData}/>;
            if (expandRender && this.expandedRows.indexOf(row) !== -1) {
                const expandData = {
                    attrs: {row: row, idx: idx},
                    key: key ? '_expand_row_' + key : undefined
                }
                expandVnode = <ExpandTrRender {...expandData}/>
            }
            return [trVnode, expandVnode]
        }).flat().filter(Boolean);
        const tableAttr = {
            'class': {
                'table__body': true
            },
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
    watch: {
        'store.treeExpandTrigger': {
            handler: function () {
                this.$nextTick(() => {
                    const elms = this.$el.querySelectorAll('tr.row');
                    const expands = this.store.treeExpandedSet;
                    this.renderList.forEach((row, idx) => {
                        expands.has(row)
                            ? addClass(elms[idx], 'is-tree-expanded')
                            : removeClass(elms[idx], 'is-tree-expanded')
                    });
                })
            }
        },
        'store.expandTrigger': {
            handler: function () {
                this.$nextTick(() => {
                    const elms = this.$el.querySelectorAll('tr.row');
                    const expands = this.store.expandedRows;
                    this.renderList.forEach((row, idx) => {
                        expands.indexOf(row) !== -1
                            ? addClass(elms[idx], 'is-expanded')
                            : removeClass(elms[idx], 'is-expanded')
                    })
                })
            }
        },
        'store.checkTrigger': {
            handler: function () {
                this.$nextTick(() => {
                    const elms = this.$el.querySelectorAll('tr.row');
                    const {checkedSet,treeData} = this.store;
                    this.renderList.forEach((row, idx) => {
                        let i = treeData.get(row);
                        if(i && !i.isLeaf){ //非叶子树节点
                            const children = i.children;
                            const check = children.find(item => checkedSet.has(item));
                            const uncheck = children.find(item => !checkedSet.has(item));
                            if(check && !uncheck){ //全选
                                addClass(elms[idx],'is-checked');
                                removeClass(elms[idx],'is-indeterminate');
                            }else if(check && uncheck){ //半选
                                addClass(elms[idx],'is-indeterminate');
                                removeClass(elms[idx],'is-checked');
                            }else{
                                removeClass(elms[idx],'is-checked');
                                removeClass(elms[idx],'is-indeterminate');
                            }
                            return;
                        }
                        checkedSet.has(row)
                            ? addClass(elms[idx], 'is-checked')
                            : removeClass(elms[idx], 'is-checked')
                    });
                })
            }
        },
        'store.selectIdx': {
            handler: function (newRowIdx, oldRowIdx) {
                const rows = this.$el.querySelectorAll('tr.row');
                const oldRowDom = rows[oldRowIdx];
                const newRowDom = rows[newRowIdx];
                oldRowDom && removeClass(oldRowDom, 'current-row');
                newRowDom && addClass(newRowDom, 'current-row');
            },
        },
        'store.hoverIdx': {
            handler: function (newRowIdx, oldRowIdx) {
                const rows = this.$el.querySelectorAll('tr.row');
                const oldRowDom = rows[oldRowIdx];
                const newRowDom = rows[newRowIdx];
                oldRowDom && removeClass(oldRowDom, 'is-hover');
                newRowDom && addClass(newRowDom, 'is-hover');
            }
        },
    }
}
</script>
