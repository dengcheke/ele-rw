<script type="text/jsx">
import {ASC, DESC} from "./store";
import {mapping} from "@src/utils/index";
import {addClass, removeClass} from "@src/utils/dom";

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
            let hasCheckCol = false;
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
                    <div class="cell">
                        {headerRender}
                    </div>
                </td>
            });
            trs.push(<tr class={{'has-check': hasCheckCol}}>{tds}</tr>);
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
