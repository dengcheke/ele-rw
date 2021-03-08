<script type="text/jsx">
import {mapping} from "@src/utils/index";
import TfootTrRender from './tfoot-tr-render'
export default {
    name: "table-footer",
    inject: ['table', 'store'],
    components:{TfootTrRender},
    props:{
        fixed:{
            default:"middle"
        }
    },
    computed: {
        ...mapping('store', {
            leafColumns: store => store.leafColumns || [],
            tableBodyWidth: store => store.tableBodyWidth || 0,
        }),
    },
    render(h){
        const columns = this.leafColumns,{footerData} = this.table;
        const colGroup = (<colgroup>
            {
                columns.map(colNode => {
                    return <col key={colNode.key} width={colNode.width}/>
                })
            }
        </colgroup>);
        const trs = footerData.map((row,domIndex)=>{
            const data = {
                attrs:{
                    row:row,
                    index:domIndex,
                    domIndex:domIndex,
                    fixed:this.fixed
                }
            };
            return <TfootTrRender {...data}/>
        });
        const tableAttr = {
            class:['table__footer'],
            style:{
                width: this.tableBodyWidth + 'px',
            },
            attrs: {
                cellspacing: "0",
                cellpadding: "0",
                border: "0"
            },
        }
        const table = <table {...tableAttr}>
            {colGroup}
            <tfoot>
            {trs}
            </tfoot>
        </table>
        return table;
    }
}
</script>
