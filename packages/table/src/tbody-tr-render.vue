<script type="text/jsx">
import {mapping, throttle} from "@src/utils/index";
import {resolveClass, resolveStyle} from "ele-rw-ui/packages/table/src/utils";
import {TableEvent} from "./event-name";

export default {
    name: "tbody-tr-render",
    inject: ['table', 'store'],
    props: ['row', 'idx', 'fixed', 'treeNodeData'],
    computed: {
        ...mapping('store', {
            leafColumns: store => store.leafColumns || [],
        }),
    },
    methods: {
        handleClickRow(e) {
            const row = this.row, store = this.store;
            if (this.table.enableCurrentRow) {
                if (row === store.selectRow) {
                    store.selectRow = store.selectIdx = null;
                } else {
                    store.selectRow = row;
                    store.selectIdx = this.idx;
                }
            }
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
            this.table.dispatchEvent(TableEvent.ClickRow, {row: row, index: this.idx, col: col, event: e});
        },
        handleEnterRow: throttle(function (e) {
            this.store.hoverRow = this.row;
            this.store.hoverIdx = this.idx;
        }, 30, {leading: true, trailing: false}),
        handleCheck(e) {
            e.stopPropagation();
            this.table.toggleRowChecked(this.row);
        },
        handleExpanded(e) {
            e.stopPropagation();
            this.table.toggleRowExpanded(this.row);
        },
        handleTreeExpanded(e) {
            e.stopPropagation();
            this.table.toggleTreeExpanded(this.row)
        },
        getTrStyle() {
            const {rowStyle} = this.table, args = {row: this.row, rowIndex: this.idx};
            let trStyle = {};
            if (rowStyle) {
                trStyle = resolveStyle(rowStyle, args);
            }
            return trStyle;
        },
        getTrClass() {
            const {rowClass} = this.table, args = {row: this.row, rowIndex: this.idx};
            let trClass = {row: true};
            if (rowClass) {
                trClass = {
                    ...trClass,
                    ...resolveClass(rowClass, args)
                };
            }
            if (this.treeNodeData) {
                trClass[`row-level--${this.treeNodeData.level}`] = true;
            }
            return trClass
        },
        getCellClass(colNode, args) {
            let _cellClass = {}
            if (this.table.cellClass) {
                _cellClass = resolveClass(this.table.cellClass, args);
            }
            if (colNode.col.cellClass) {
                _cellClass = {
                    ..._cellClass,
                    ...resolveClass(colNode.col.cellClass, args)
                }
            }
            _cellClass.cell = true;
            return _cellClass;
        },
        getCellStyle(colNode, args) {
            let _cellStyle = {};
            if (this.table.cellStyle) {
                _cellStyle = resolveStyle(this.table.cellStyle, args);
            }
            if (colNode.col.cellStyle) {
                _cellStyle = {
                    ..._cellStyle,
                    ...resolveStyle(colNode.col.cellStyle, args)
                }
            }
            colNode.align && (_cellStyle.alignItems = colNode.align);
            return _cellStyle
        },
        getCellContent(h, colNode, args) {
            let cellContent, addExpandNode = false;
            if (colNode.render && typeof colNode.render === "function") {
                cellContent = colNode.render(h, args);
            } else if (colNode.type === 'text') {
                cellContent = this.row[colNode.key];
                addExpandNode = true;
            } else if (colNode.type === 'check') {
                cellContent = <span {...{
                    class: ['cell-checkbox'],
                    on: {
                        click: this.handleCheck
                    }
                }}/>
                addExpandNode = true;
            } else if (colNode.type === 'expand') {
                cellContent = <span {...{
                    class: ['iconfont', 'icon-expand', 'use-for-expand'],
                    style: {
                        display: 'inline-block',
                        fontSize: '18px',
                    },
                    on: {
                        click: this.handleExpanded
                    }
                }}/>
            }
            //对于展开的节点列 文本列和check添加展开按钮
            if (addExpandNode && this.table.treeNodeKey === colNode.key) {
                const level = this.treeNodeData ? this.treeNodeData.level : 0;
                cellContent = <div style={{
                    marginLeft: this.table.indent * level + 'px',
                    paddingLeft: '22px',
                    position: "relative"
                }}>
                    {[<span {...{
                        class: {
                            iconfont: true,
                            'icon-expand': this.treeNodeData && !this.treeNodeData.isLeaf,
                            'use-for-tree': true
                        },
                        on: {
                            click: this.handleTreeExpanded
                        }
                    }}/>, cellContent]}
                </div>
            }
            return cellContent
        }
    },
    render: function (h) {
        const columns = this.leafColumns,
            fixed = this.fixed,
            idx = this.idx,
            row = this.row;
        const trAttr = {
            class: this.getTrClass(),
            style: this.getTrStyle(),
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
                const args = {row: row, rowIndex: idx, col: col, colIndex: colIndex};
                //span method
                if (this.table.spanMethod && colNode.type === 'text') {
                    const res = this.table.spanMethod.call(null, args)
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
            }).filter(Boolean)}
        </tr>
    },
}
</script>
