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
    props: ['row', 'index', 'domIndex'],
    computed: {
        ...mapping('store', {
            colNums: store => (store.leafColumns || []).length,
        })
    },
    render: function (h) {
        const colNums = this.colNums, row = this.row;
        const trAttr = {
            class: ['row','expand-row']
        };
        let fn = this.table.expandRender,
            args = {row: row, rowIndex: this.index, $rowIndex: this.domIndex},
            vnode;
        if (fn) {
            vnode = fn(h, args);
        } else if (fn = this.table.$scopedSlots.expand) {
            vnode = fn(args);
        } else {
            console.warn(`you use expandRow but don't specify expandRender or scopeSlot.expand`);
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
