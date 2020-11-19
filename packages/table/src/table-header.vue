<script type="text/jsx">
import {ASC, DESC, resolveClass, resolveStyle} from "./store";
import {mapping} from "@src/utils/index";
import {addClass, removeClass} from "@src/utils/dom";
import {objectToStyleString} from "@src/utils";

export default {
    name: "table-header",
    inject: ['table', 'store'],
    props: {
        fixed: {
            default: "middle",
        }
    },
    computed: {
        ...mapping('store', {
            maxLevel: store => store.maxLevel || 0,
            columnLevelMap: store => store.columnLevelMap || {},
            leafColumns: store => store.leafColumns || [],
            tableBodyWidth: store => store.tableBodyWidth || 0,
            checkedRows: store => store.checkedRows,
        }),
        tableData() {
            return this.table.tableData || [];
        }
    },
    methods: {
        handleCheck(e) {
            e.stopPropagation();
            const checkNums = this.store.checkNums,
                totalNums = this.tableData.length;
            if (checkNums < totalNums) {
                this.table.setAllChecked(true);
            } else {
                this.table.setAllChecked(false);
            }
        }
    },
    render(h) {
        const table = this.table,
            {
                headerRowStyle,
                headerRowClass,
                headerCellStyle,
                headerCellClass
            } = table;
        const colGroup = (<colgroup>
            {
                this.leafColumns.map(leafNode => {
                    return <col key={leafNode.key} width={leafNode.width}/>
                })
            }
        </colgroup>);
        const trs = [];
        for (let level = 1; level <= this.maxLevel; level++) {
            const columns = this.columnLevelMap[level], cols = columns.map(i => i.col);
            let hasCheckCol = false;
            const tds = columns.map((colNode, colIndex) => {
                const col = colNode.col;
                let cellStyle = {}, cellClass = {}, args = {
                    row: cols,
                    rowIndex: level - 1,
                    col: col,
                    colIndex: colIndex
                };
                if (headerCellStyle) { //global
                    cellStyle = resolveStyle(headerCellStyle, args)
                }
                if (col.headerCellStyle) {
                    cellStyle = {
                        ...cellStyle,
                        ...resolveStyle(col.headerCellStyle, args)
                    }
                }
                if (headerCellClass) {
                    cellClass = resolveClass(cellClass, args);
                }
                if (col.headerCellClass) {
                    cellClass = {
                        ...cellClass,
                        ...resolveClass(col.headerCellClass, args)
                    }
                }
                const tdAttr = {
                    'class': {
                        'is-hidden': colNode.fixed !== this.fixed,
                        'is-leaf': colNode.isLeaf,
                    },
                    style: {
                        borderRight: colNode._noRightBorder ? 'none' : null,
                        textAlign: colNode.align || 'center',
                    },
                    key: colNode.key,
                    attrs: {
                        rowspan: colNode.isLeaf ? this.maxLevel - colNode.level + 1 : 1,
                        colspan: colNode.leafNum || 1,
                        'data-col-uid': colNode._uid
                    },
                    on: {
                        mouseenter: (e) => {
                            const {
                                enableHighlightCol,
                                highlightColHeaderCellStyle,
                                highlightColRowCellStyle
                            } = this.table;
                            if (!enableHighlightCol || (!highlightColHeaderCellStyle && !highlightColRowCellStyle)) return;
                            const styleElm = this.table.headerStyleElm;
                            let colUids = [colNode._uid], stack = [...colNode.children];
                            while (stack.length) {
                                const node = stack.shift();
                                colUids.push(node._uid);
                                stack = [...stack, ...node.children];
                            }
                            let hStyleStr = [], rStyleStr = [];
                            if (colUids.length) {
                                const headerStyle = objectToStyleString(highlightColHeaderCellStyle);
                                const cellStyle = objectToStyleString(highlightColRowCellStyle);
                                colUids.forEach(uid => {
                                    headerStyle && hStyleStr.push(`.ele-rw-table[uid='table_uid_${this.table._globalTableId}'] thead tr td[data-col-uid='${uid}'] .cell`)
                                    cellStyle && rStyleStr.push(`.ele-rw-table[uid='table_uid_${this.table._globalTableId}'] tbody tr td[data-col-uid='${uid}'] .cell`)
                                })
                                hStyleStr = hStyleStr.join(",\n") + `{\n${headerStyle}}`
                                rStyleStr = rStyleStr.join(",\n") + `{\n${cellStyle}}`
                                styleElm.innerHTML = hStyleStr + '\n' + rStyleStr;
                            }
                        },
                        mouseleave: (e) => {
                            const styleElm = this.table.headerStyleElm;
                            styleElm.innerHTML = "";
                        }
                    }
                };
                let headerRender = [];
                if (colNode.renderHeader && typeof colNode.renderHeader === "function") {
                    headerRender = [colNode.renderHeader(h, {col: colNode.col, colIndex: colIndex})];
                } else if (colNode.type === 'text') {
                    headerRender = [<span>{colNode.label}</span>];
                } else if (colNode.type === 'check') {
                    hasCheckCol = true;
                    headerRender = [<span {...{
                        class: {
                            'cell-checkbox': true,
                        },
                        on: {
                            click: this.handleCheck
                        }
                    }}/>]
                }
                /*排序按钮*/
                if (colNode.sortable) {
                    const ascAttrs = {
                            'class': {
                                'sort-caret': true,
                                'asc': true,
                                'is-active': colNode.sort === ASC
                            },
                            on: {
                                click: (e) => {
                                    if (colNode.sort === ASC) {
                                        colNode.sort = null;
                                    } else {
                                        colNode.sort = ASC;
                                    }
                                    this.table.dispatchEvent('sort-change', colNode, this.store.sortColumns);
                                }
                            }
                        },
                        descAttrs = {
                            'class': {
                                'sort-caret': true,
                                'desc': true,
                                'is-active': colNode.sort === DESC
                            },
                            on: {
                                click: (e) => {
                                    if (colNode.sort === DESC) {
                                        colNode.sort = null;
                                    } else {
                                        colNode.sort = DESC;
                                    }
                                    this.table.dispatchEvent('sort-change', colNode, this.store.sortColumns);
                                }
                            }
                        };
                    const cartWrapper = <span class="sort-caret-wrapper">
                                <i {...ascAttrs}></i>
                                <i {...descAttrs}></i>
                            </span>;
                    headerRender = [...headerRender, cartWrapper]
                }
                return <td {...tdAttr}>
                    <div {...{
                        class: {
                            cell: true,
                            ...cellClass
                        },
                        style: cellStyle
                    }}>
                        {headerRender}
                    </div>
                </td>
            });
            let rowStyle = {}, rowClass = {}, args = {
                row: cols,
                rowIndex: level - 1,
            };
            if (headerRowStyle) {
                rowStyle = resolveStyle(headerRowStyle, args);
            }
            if (headerRowClass) {
                rowClass = resolveClass(headerRowClass, args);
            }
            trs.push(<tr {...{
                class: {
                    'has-check': hasCheckCol,
                    ...rowClass
                },
                style: rowStyle,
            }}>{tds}</tr>);
        }
        return <table class="table__header"
                      attrs={{
                          cellspacing: "0",
                          cellpadding: "0",
                          border: "0"
                      }}
                      style={{width: this.tableBodyWidth + 'px'}}>
            {colGroup}
            <thead>
            {trs}
            </thead>
        </table>
    },
    watch: {
        'store.checkTrigger': {
            handler: function () {
                this.$nextTick(() => {
                    const tr = this.$el.querySelector('tr.has-check');
                    if (!tr) return;
                    const checkNums = this.store.checkNums,
                        totalNums = this.tableData.length;
                    removeClass(tr, ['is-checked', 'is-indeterminate']);
                    if (checkNums === totalNums) {
                        addClass(tr, 'is-checked');
                    } else if (checkNums && checkNums < totalNums) {
                        addClass(tr, 'is-indeterminate');
                    }
                })

            }
        }
    }
}
</script>
