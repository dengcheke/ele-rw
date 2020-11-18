<script type="text/jsx">
import {mapping} from "@src/utils/index";

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
                let id = target.dataset.uid;
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
        handleExpanded(e){
            e.stopPropagation();
            this.table.toggleExpanded(this.row);
        }
    },
    render: function (h) {
        const columns = this.leafColumns,
            fixed = this.fixed,
            idx = this.idx,
            row = this.row;
        console.log('render',row.a)
        const trAttr = {
            class: {row: true},
            attrs: {
                'data-row-index': idx
            },
            on: {
                mouseenter: this.handleEnterRow,
                click: this.handleClickRow
            },
        };
        return <tr {...trAttr}>
            {columns.map(colNode => {
                const tdAttr = {
                    'class': {
                        'is-hidden': colNode.fixed !== fixed
                    },
                    attrs: {
                        'data-uid': colNode._uid
                    },
                    key: colNode.key
                };
                let cellVnode;
                if (colNode.render && typeof colNode.render === "function") {
                    cellVnode = colNode.render(h, {row: row, $index: idx, col: colNode.col});
                } else if (colNode.type === 'text') {
                    cellVnode = row[colNode.key];
                } else if (colNode.type === 'check') {
                    cellVnode = <span {...{
                        class: ['cell-checkbox'],
                        on: {
                            click: this.handleCheck
                        }
                    }}/>
                }else if(colNode.type === 'expand'){
                    cellVnode = <span {...{
                        class:['cell-expand'],
                        on:{
                            click:this.handleExpanded
                        }
                    }}/>
                }
                //自定义cell class, String 或者 Array<String>
                const cellClass = colNode.col.cellClass ? [].concat(colNode.col.cellClass) : [];
                return <td {...tdAttr}>
                    <div {...{
                        style: {
                            ...(colNode.col.cellStyle || {})
                        },
                        class: {
                            "cell": true,
                            ...(cellClass.reduce((pre, cur) => {
                                pre[cur] = true;
                                return pre;
                            }, {}))
                        }
                    }}>{cellVnode}</div>
                </td>
            })}
        </tr>
    },
}
</script>
