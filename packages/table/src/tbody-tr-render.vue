<script type="text/jsx">
import {mapping} from "@src/utils/index";
import {resolveClass, resolveStyle} from "ele-rw-ui/packages/table/src/store";

export default {
    name: "tbody-tr-render",
    inject: ['table', 'store'],
    props: ['row', 'idx', 'fixed'],
    computed: {
        ...mapping('store', {
            leafColumns: store => store.leafColumns || [],
        }),
    },
    methods: {
        handleClickRow(e) {
            const row = this.row;
            this.table.setCurrentRow(row);
            let target = e.target, col;
            if (target.tagName.toLowerCase() === 'tr') {
                target = null;
            } else {
                while (target && target.tagName.toLowerCase() !== 'td') {
                    target = target.parentElement;
                }
            }
            if (target) {
                let id = target.dataset.colUid;
                id && (col = this.store.leafColumns.find(i => i._uid == id))
            }
            this.table.dispatchEvent('click-row', {row: row, column: col, event: e});
        },
        handleEnterRow(e) {
            this.store.hoverRow = this.row;
            this.store.hoverIdx = this.idx;
        },
        handleCheck(e) {
            e.stopPropagation();
            this.table.toggleRowChecked(this.row);
        },
        handleExpanded(e) {
            e.stopPropagation();
            this.table.toggleRowExpanded(this.row);
        }
    },
    render: function (h) {
        const columns = this.leafColumns,
            fixed = this.fixed,
            idx = this.idx,
            row = this.row,
            {rowStyle, rowClass, cellStyle, cellClass} = this.table;
        let trStyle = {}, trClass = {}, args = {row: row, rowIndex: idx};
        if (rowStyle) {
            trStyle = resolveStyle(rowStyle, args);
        }
        if (rowClass) {
            trClass = resolveClass(rowClass, args);
        }
        const trAttr = {
            class: {
                row: true,
                ...trClass
            },
            style: trStyle,
            attrs: {
                'data-row-index': idx
            },
            on: {
                mouseenter: this.handleEnterRow,
                click: this.handleClickRow
            },
        };
        return <tr {...trAttr}>
            {columns.map((colNode, colIndex) => {
                let tdAttr = {
                    'class': {
                        'is-hidden': colNode.fixed !== fixed,
                    },
                    attrs: {
                        'data-col-uid': colNode._uid
                    },
                    key: colNode.key
                };
                const col = colNode.col;
                let _cellStyle = {}, _cellClass = {}, args = {row: row, rowIndex: idx, col: col, colIndex: colIndex};
                //span method
                if (this.table.spanMethod && colNode.type === 'text') {
                    const res = this.table.spanMethod.call(null, args)
                    if (res) {
                        if(res[0]===0||res[1]===0) return undefined;
                        tdAttr.attrs.rowspan = res[0];
                        tdAttr.attrs.colspan = res[1];
                    }
                }
                //cell style
                if (cellStyle) {
                    _cellStyle = resolveStyle(cellStyle, args);
                }
                if (col.cellStyle) {
                    _cellStyle = {
                        ..._cellStyle,
                        ...resolveStyle(col.cellStyle, args)
                    }
                }
                if (cellClass) {
                    _cellClass = resolveClass(cellClass, args);
                }
                if (col.cellClass) {
                    _cellClass = {
                        ..._cellClass,
                        ...resolveClass(col.cellClass, args)
                    }
                }

                //cell content
                let cellContent;
                if (colNode.render && typeof colNode.render === "function") {
                    cellContent = colNode.render(h, args);
                } else if (colNode.type === 'text') {
                    cellContent = row[colNode.key];
                } else if (colNode.type === 'check') {
                    cellContent = <span {...{
                        class: ['cell-checkbox'],
                        on: {
                            click: this.handleCheck
                        }
                    }}/>
                } else if (colNode.type === 'expand') {
                    cellContent = <span {...{
                        class: ['cell-expand'],
                        on: {
                            click: this.handleExpanded
                        }
                    }}/>
                }

                return <td {...tdAttr}>
                    <div {...{
                        style: _cellStyle,
                        class: {
                            "cell": true,
                            ..._cellClass
                        }
                    }}>{cellContent}</div>
                </td>
            }).filter(Boolean)}
        </tr>
    },
}
</script>
