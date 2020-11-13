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
            tableBodyWidth: store => store.tableBodyWidth || 0,
        }),
        tableData(){
            return this.table.tableData || [];
        }
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
        'store.checkTrigger':{
            handler:function(){
                this.$nextTick(()=>{
                    const elms = this.$el.querySelectorAll('tr.row');
                    const map = this.store.checkMap;
                    this.tableData.forEach((row,idx)=>{
                        map.get(row)
                            ? addClass(elms[idx],'is-checked')
                            : removeClass(elms[idx],'is-checked')
                    })
                })
            }
        },
        'store.selectIdx': {
            handler: function (newRowIdx, oldRowIdx) {
                const rows = this.$el.querySelectorAll('tr.row');
                const oldRowDom = rows[oldRowIdx];
                const newRowDom = rows[newRowIdx];
                oldRowDom && removeClass(oldRowDom,'current-row');
                newRowDom && addClass(newRowDom,'current-row');
            },
        },
        'store.hoverIdx': {
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
