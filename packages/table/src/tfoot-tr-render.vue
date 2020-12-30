<script type="jsx">
import {mapping} from "@src/utils";
import {resolveClass, resolveStyle} from "./utils";

export default {
    name: "tfoot-tr-render",
    inject: ['table', 'store'],
    props: ['row', 'domIndex', 'index', 'fixed'],
    computed: {
        ...mapping('store', {
            leafColumns: store => store.leafColumns || [],
        }),
    },
    methods: {
        getCellContent(h, colNode, args) {
            let cellContent, fn = colNode.renderFooter;
            if (fn && typeof fn === "function") {
                cellContent = fn(h, args);
            } else if (colNode.type === 'text') {
                cellContent = this.row[colNode.key];
            }
            return cellContent
        },
        getCellStyle(colNode, args) {
            return {
                textAlign: colNode.footerAlign || this.table.align,
                ...resolveStyle(this.table.footerCellStyle, args),
                ...resolveStyle(colNode.col.footerCellStyle, args)
            }
        },
        getCellClass(colNode, args) {
            return {
                ...resolveClass(this.table.footerCellClass, args),
                ...resolveClass(colNode.col.footerCellClass, args)
            }
        },
        getTrClass() {
            const args = {row: this.row, rowIndex: this.index, $rowIndex: this.domIndex};
            return {
                ...resolveClass(this.table.footerRowClass, args),
                'row': true,
                'row--footer': true
            }
        },
        getTrStyle() {
            const args = {row: this.row, rowIndex: this.index, $rowIndex: this.domIndex};
            return resolveStyle(this.table.footerRowStyle, args);
        },
    },
    render: function (h) {
        const columns = this.leafColumns, {footerSpanMethod} = this.table,
            fixed = this.fixed, index = this.index,
            domIndex = this.domIndex, row = this.row;
        const trContent = columns.map((colNode, colIndex) => {
            const args = {row: row, rowIndex: index, $rowIndex: domIndex, col: colNode.col, $colIndex: colIndex};
            const tdAttr = {
                class: {
                    'is-hidden': colNode.fixed !== fixed,
                    'no-right-border': colNode._noRightBorder,
                    'no-shadow-right': colNode._noShadowRightBorder,
                    ...this.getCellClass(colNode, args)
                },
                style: this.getCellStyle(colNode, args),
                attrs: {
                    'data-col-uid': colNode._uid
                },
                key: colNode.key
            };

            //span method
            if (footerSpanMethod) {
                const res = footerSpanMethod(args)
                if (res) {
                    if (res[0] === 0 || res[1] === 0) return undefined;
                    tdAttr.attrs.rowspan = res[0];
                    tdAttr.attrs.colspan = res[1];
                }
            }
            //cell content
            const cellContent = this.getCellContent(h, colNode, args);
            return <td {...tdAttr}>
                <div class="cell cell--footer">{cellContent}</div>
            </td>
        }).filter(Boolean);
        const trAttr = {
            class: this.getTrClass(),
            style: this.getTrStyle(),
        };
        return <tr {...trAttr}>
            {trContent}
        </tr>
    },
}
</script>
