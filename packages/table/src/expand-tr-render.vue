<script type="text/jsx">
import {mapping} from "@src/utils/index";
import CollapseTransition from '../../collapse-transition';

const noop = function (h) {
    return h('div', 'your expandContent here!')
};
export default {
    name: "expand-tr-render",
    components: {CollapseTransition},
    inject: ['table', 'store'],
    props: ['row', 'idx'],
    computed: {
        ...mapping('store', {
            colNums: store => (store.leafColumns || []).length,
        })
    },
    render: function (h) {
        const colNums = this.colNums, idx = this.idx, row = this.row;
        const trAttr = {
            class: ['expand-row'],
            attrs:{
                'data-parent-row-index': idx
            }
        };
        let fn = this.table.expandRender, vnode;
        if (fn) {
            vnode = fn(h, {row: row, index: idx});
        } else if (fn = this.table.$scopedSlots.expand) {
            vnode = fn({row: row, index: idx});
        } else {
            vnode = null;
        }
        return <tr {...trAttr}>
            <td class="expand-cell" colspan={colNums}>
                {vnode}
            </td>
        </tr>
    }
}
</script>
