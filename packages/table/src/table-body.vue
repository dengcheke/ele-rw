<script type="text/jsx">
import {mapping} from "@src/utils/index";
import BodyTrRender from './tbody-tr-render';
import {addClass, removeClass} from "@src/utils/dom";

export default {
    name: "table-body",
    inject: ['table', 'store'],
    components: {BodyTrRender},
    props: {
        fixed: {
            default: "middle",
        },
    },
    computed: {
        ...mapping('store', {
            leafColumns: store => store.leafColumns || [],
            tableData: store => store.tableData || [],
            tableBodyWidth: store => store.tableBodyWidth || 0,
        }),
    },
    render(h) {
        const columns = this.leafColumns, data = this.tableData;
        const colGroup = (<colgroup>
            {
                columns.map(column => {
                    return <col key={column.key} width={column.width}/>
                })
            }
        </colgroup>);
        const trs = data.map((row, idx) => {
            const data = {
                attrs: {
                    row: row,
                    idx: idx,
                    fixed: this.fixed
                }
            }
            this.table.rowKey && (data.key = row[this.table.rowKey]);
            return <BodyTrRender {...data}/>
        });
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
        'store.curSelectRows': {
            handler: function (rowSet) {
                this.$nextTick(() => {
                    const rowElms = Array.from(this.$el.querySelectorAll("tr.row"));
                    rowElms.forEach((elm, idx) => {
                        this.store.curSelectIdxs.indexOf(idx) !== -1
                            ? addClass(elm, 'is-selected')
                            : removeClass(elm, 'is-selected')
                    })
                })
            },
            immediate: true
        },
        'store.curHoverIdx': {
            handler: function (newRowIdx, oldRowIdx) {
                const rows = this.$el.querySelectorAll('tr.row');
                const oldRowDom = rows[oldRowIdx];
                const newRowDom = rows[newRowIdx];
                oldRowDom && removeClass(oldRowDom,'is-hover');
                newRowDom && addClass(newRowDom,'is-hover');
            }
        },
    }
}
</script>
