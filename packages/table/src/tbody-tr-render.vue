<script type="text/jsx">
import {mapping} from "@src/utils/index";

export default {
    name: "tbody-tr-render",
    inject: ['table', 'store'],
    props: ['row','idx','fixed'],
    computed: {
        ...mapping('store', {
            leafColumns: store => store.leafColumns || [],
            curHoverIdx: store => store.curHoverIdx,
            tableData: store => store.tableData
        }),
        isChecked() {
            return this.store.checkedRows.indexOf(this.row) !== -1
        }
    },
    methods: {
        handleClickRow(e) {
            const mode = this.table.clickMode,
                rowSet = this.store.curSelectRows,
                idxSet = this.store.curSelectIdxs,
                row = this.row,
                idx = this.idx;
            let i = rowSet.indexOf(row);
            if (mode === 'single') {
                if (i !== -1) {//已经存在,移除
                    rowSet.splice(0);
                    idxSet.splice(0);
                } else { //之前不存在
                    rowSet.splice(0); //只能有一个
                    idxSet.splice(0);
                    rowSet.push(row);
                    idxSet.push(idx);
                }
            } else if (mode === 'multi') {
                if (i !== -1) {
                    rowSet.splice(i, 1);
                    idxSet.splice(i, 1);
                } else {
                    rowSet.push(row);
                    idxSet.push(idx);
                }
            }
            let target = e.target,col;
            if(target.tagName.toLowerCase() === 'tr'){
                target = null;
            }else{
                while(target && target.tagName.toLowerCase()!=='td'){
                    target = target.parentElement;
                }
            }
            if(target){
                let id = target.dataset.uid;
                id && (col = this.store.leafColumns.find(i=>i._uid==id))
            }
            this.table.dispatchEvent('click-row', {row: row, column: col,event: e});
        },
        handleEnterRow(e){
            this.store.curHoverIdx = this.idx;
            this.store.curHoverRow = this.row;
        },
        handleChecked(e){

        }
    },
    render: function (h) {
        const columns = this.leafColumns,
            fixed = this.fixed,
            idx = this.idx,
            row = this.row;
        const trAttr = {
            class: {row: true},
            attrs:{
                'data-row-index':idx
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
                    attrs:{
                        'data-uid': colNode._uid
                    },
                    key: colNode.key
                };
                let renderCell;
                if (colNode.render && typeof colNode.render === "function") {
                    renderCell = colNode.render(h, {row: row, $index: idx, col: colNode.col});
                } else if (colNode.type === 'text') {
                    renderCell = row[colNode.key];
                } else if (colNode.type === 'check') {
                    renderCell = <span {...{
                        class: {
                            'cell-checkbox': true,
                            'is-checked': this.isChecked
                        },
                        on: {
                            click: (e) => {
                                e.stopPropagation();
                                let i = this.store.checkedRows.indexOf(row);
                                i !== -1
                                    ? this.store.checkedRows.splice(i, 1)
                                    : this.store.checkedRows.push(row);
                            }
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
                    }}>{renderCell}</div>
                </td>
            })}
        </tr>
    },
}
</script>
