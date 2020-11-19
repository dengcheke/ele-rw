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
        }),
        tableData() {
            return this.table.tableData || [];
        }
    },
    render(h) {
        const columns = this.leafColumns,
            data = this.tableData,
            expandRender = this.table.expandRender || this.table.$scopedSlots.expand;
        const colGroup = (<colgroup>
            {
                columns.map(column => {
                    return <col key={column.key} width={column.width}/>
                })
            }
        </colgroup>);
        const trs = data.map((row, idx) => {
            const key = this.table.getRowKey(row);
            let trVnode, expandVnode;
            const trData = {
                attrs: {
                    row: row,
                    idx: idx,
                    fixed: this.fixed
                },
                key: key ? '_row_' + key : undefined,
            }
            trVnode = <BodyTrRender {...trData}/>;
            if (
                (expandRender || this.table.$scopedSlots.expand)
                && this.store.expandedRows.indexOf(row) !== -1
            ) {
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
        //tableData change will rerender,but expand row may not change
        'store.expandTrigger':{
            handler:function(){
                this.$nextTick(()=>{
                    const elms = this.$el.querySelectorAll('tr.row');
                    const expands = this.store.expandedRows;
                    this.tableData.forEach((row,idx)=>{
                        expands.indexOf(row) !== -1
                            ? addClass(elms[idx],'is-expanded')
                            : removeClass(elms[idx],'is-expanded')
                    })
                })
            }
        },
        'store.checkTrigger': {
            handler: function () {
                this.$nextTick(() => {
                    const elms = this.$el.querySelectorAll('tr.row');
                    const checks = this.store.checkedRows;
                    this.tableData.forEach((row, idx) => {
                        checks.indexOf(row) !== -1
                            ? addClass(elms[idx], 'is-checked')
                            : removeClass(elms[idx], 'is-checked')
                    })
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
