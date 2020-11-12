<script type="text/jsx">
import {mapping} from "@src/utils/index";
const noop = function(){};
export default {
    name: "expand-tr-render",
    inject: ['table', 'store'],
    props: ['row', 'idx'],
    computed: {
        ...mapping('store', {
            colNums: store => (store.leafColumns || []).length,
            curHoverIdx: store => store.curHoverIdx,
        })
    },
    render: function (h) {
        const colNums = this.colNums,
            idx = this.idx,row = this.row;
        const trAttr = {
            'class': { 'expand-row': true },
            key: 'expand_row_' + idx
        };
        return <tr {...trAttr}>
            <td class="expand-cell" colspan={colNums}>
                {(this.table.expandRender || noop).call(this.table,h,{row:row,idx:idx})}
            </td>
        </tr>
    }
}
</script>
