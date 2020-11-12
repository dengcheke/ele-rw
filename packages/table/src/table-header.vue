<script type="text/jsx">
import {ASC, DESC} from "./store";
import {mapping} from "@src/utils/index";

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
            tableData: store => store.tableData
        })
    },
    render(h) {
        const colGroup = (<colgroup>
            {
                this.leafColumns.map(leafNode => {
                    return <col key={leafNode.key} width={leafNode.width}/>
                })
            }
        </colgroup>);
        const trs = [];
        for (let i = 1; i <= this.maxLevel; i++) {
            const columns = this.columnLevelMap[i];
            const tds = columns.map(colNode => {
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
                        colspan: colNode.leafNum || 1
                    }
                };
                let headerRender = [];
                if (colNode.renderHeader && typeof colNode.renderHeader === "function") {
                    headerRender = [colNode.renderHeader(h, {col: colNode.col})];
                } else if (colNode === 'text') {
                    headerRender = [<span>{colNode.label}</span>];
                } else if (colNode.type === 'check') {
                    const checkNums = this.checkedRows.length,
                        totalNums = this.tableData.length;
                    headerRender = [<span {...{
                        class: {
                            'cell-checkbox': true,
                            'is-checked': checkNums === totalNums,
                            'is-indeterminate': checkNums && checkNums < totalNums
                        },
                        on: {
                            click: (e) => {
                                e.stopPropagation();
                                const checkNums = this.checkedRows.length;
                                if (checkNums === 0) {
                                    this.store.checkedRows = this.tableData;
                                } else {
                                    this.store.checkedRows = [];
                                }
                            }
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
                    <div class="cell">
                        {headerRender}
                    </div>
                </td>
            });
            trs.push(<tr>{tds}</tr>);
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
    }
}
</script>
