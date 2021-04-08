<script type="text/jsx">
import {mapping, throttle} from "@src/utils/index";
import {resolveClass, resolveStyle} from "./utils";
import {TableEvent} from "./table-config";

export default {
    name: "tbody-tr-render",
    inject: ['table', 'store'],
    props: ['row', 'domIndex', 'index', 'fixed', 'treeNodeData'],
    computed: {
        ...mapping('store', {
            leafColumns: store => store.leafColumns || [],
        }),
    },
    methods: {
        handleClickCell(e) {
            const store = this.store;
            const target = e.currentTarget, id = target.dataset.colUid;
            const idx = store.leafColumns.findIndex(i => i._uid == id);
            const args = {
                row: this.row,
                rowIndex: this.index,
                $rowIndex: this.domIndex,
                col: idx !== -1 ? store.leafColumns[idx].col : null,
                $colIndex: idx !== -1 ? idx : null,
                event: e
            }
            this.table.dispatchEvent(TableEvent.CellClick, args);
        },
        handleClickRow(e) {
            const row = this.row, store = this.store;
            if (this.table.enableCurrentRow) {
                if (row === store.selectRow) {
                    store.selectRow = store.select$Idx = null;
                } else {
                    store.selectRow = row;
                    store.select$Idx = this.domIndex;
                }
            }
            let target = e.target, node;
            if (target.tagName.toLowerCase() === 'tr') {
                target = null;
            } else {
                while (target && target.tagName.toLowerCase() !== 'td') {
                    target = target.parentElement;
                }
            }
            if (target) {
                let id = target.dataset.colUid;
                id && (node = this.store.leafColumns.find(i => i._uid == id))
            }
            this.table.dispatchEvent(TableEvent.RowClick, {
                row: row,
                rowIndex: this.index,
                $rowIndex: this.domIndex,
                col: node ? node.col : null,
                event: e
            });
        },
        handleEnterRow: throttle(function (e) {
            this.store.hoverRow = this.row;
            this.store.hover$Idx = this.domIndex;
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
            const args = {row: this.row, rowIndex: this.index, $rowIndex: this.domIndex};
            const trStyle = resolveStyle(this.table.rowStyle, args);
            return trStyle;
        },
        getTrClass() {
            const args = {row: this.row, rowIndex: this.index, $rowIndex: this.domIndex};
            let trClass = {
                ...resolveClass(this.table.rowClass, args),
                row: true,
            };
            if (this.treeNodeData) {
                trClass[`row-level--${this.treeNodeData.level}`] = true;
            }
            return trClass
        },
        getCellClass(colNode, args) {
            return {
                ...resolveClass(this.table.cellClass, args),
                ...resolveClass(colNode.col.cellClass, args)
            }
        },
        getCellStyle(colNode, args) {
            return {
                textAlign: colNode.align || this.table.align,
                ...resolveStyle(this.table.cellStyle, args),
                ...resolveStyle(colNode.col.cellStyle, args)
            }
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
            index = this.index,
            domIndex = this.domIndex,
            row = this.row;
        const trAttr = {
            class: this.getTrClass(),
            style: this.getTrStyle(),
            on: {
                mouseenter: this.handleEnterRow,
                click: this.handleClickRow
            },
        };
        return <tr {...trAttr}>
            {columns.map((colNode, colIndex) => {
                const args = {
                    row: row,
                    rowIndex: index,
                    $rowIndex: domIndex,
                    col: colNode.col,
                    $colIndex: colIndex
                };
                let tdAttr = {
                    style: this.getCellStyle(colNode, args),
                    class: {
                        'is-hidden': colNode.fixed !== fixed,
                        'no-right-border': colNode._noRightBorder,
                        'no-shadow-right': colNode._noShadowRightBorder,
                        ...this.getCellClass(colNode, args),
                    },
                    attrs: {
                        'data-col-uid': colNode._uid
                    },
                    on: {
                        click: this.handleClickCell
                    },
                    key: colNode.key
                };
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
                    <div class="cell">{cellContent}</div>
                </td>
            }).filter(Boolean)}
        </tr>
    },
}
</script>
