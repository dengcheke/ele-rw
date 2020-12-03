<script type="jsx">
import {mapping} from "@src/utils";
import {resolveClass, resolveStyle} from "ele-rw-ui/packages/table/src/utils";

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
            let _cellStyle = {};
            if (this.table.footerCellStyle) {
                _cellStyle = resolveStyle(this.table.footerCellStyle, args);
            }
            if (colNode.col.footerCellStyle) {
                _cellStyle = {
                    ..._cellStyle,
                    ...resolveStyle(colNode.col.footerCellStyle, args)
                }
            }
            colNode.align && (_cellStyle.alignItems = colNode.footerAlign);
            return _cellStyle
        },
        getCellClass(colNode, args) {
            let _cellClass = {}
            if (this.table.footerCellClass) {
                _cellClass = resolveClass(this.table.footerCellClass, args);
            }
            if (colNode.col.footerCellClass) {
                _cellClass = {
                    ..._cellClass,
                    ...resolveClass(colNode.col.footerCellClass, args)
                }
            }
            _cellClass.cell = true;
            return _cellClass;
        },
        getTrClass() {
            const {footerRowClass} = this.table,
                args = {row: this.row, rowIndex: this.index, $rowIndex: this.domIndex};
            let trClass = {
                'row': true,
                'row--footer': true
            };
            if (footerRowClass) {
                trClass = {
                    ...trClass,
                    ...resolveClass(footerRowClass, args)
                };
            }
            return trClass
        },
        getTrStyle() {
            const {footerRowStyle} = this.table,
                args = {row: this.row, rowIndex: this.index, $rowIndex:this.domIndex};
            let trStyle = {};
            if (footerRowStyle) {
                trStyle = resolveStyle(footerRowStyle, args);
            }
            return trStyle;
        },
    },
    render: function (h) {
        const columns = this.leafColumns, {footerSpanMethod} = this.table,
            fixed = this.fixed, index = this.index,
            domIndex = this.domIndex, row = this.row;
        let trContent = columns.map((colNode, colIndex) => {
            let tdAttr = {
                class: {
                    'is-hidden': colNode.fixed !== fixed,
                    'no-right-border': colNode._noRightBorder,
                    'no-shadow-right': colNode._noShadowRightBorder
                },
                attrs: {
                    'data-col-uid': colNode._uid
                },
                key: colNode.key
            };
            const col = colNode.col;
            const args = {row: row, rowIndex: index, $rowIndex: domIndex, col: col, $colIndex: colIndex};
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
                <div {...{
                    style: this.getCellStyle(colNode, args),
                    class: this.getCellClass(colNode, args)
                }}>{cellContent}</div>
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
