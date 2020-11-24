import Vue from 'vue'
import CustomTable from '../packages/table/index';

Vue.config.performance = true;

window.__vm = new Vue({
    data() {
        return {
            cols: [
                {key: '_expand', type: 'expand'},
                {key: '_check', type: 'check'},
                {
                    key: 'a', label: 'a', headerAlign: 'center'
                    /*render: (h, {row, rowIndex, col, colIndex}) => {
                        return row.a
                    },*/
                },
                {key: 'b', label: 'b'}
            ],
            tableData: new Array(200).fill(0).map((i, idx) => {
                return {a: idx}
            })
        }
    },
    render(h) {
        return h(CustomTable, {
            attrs: {
                tableCols: this.cols,
                tableData: this.tableData,
                align: 'center',
                height: '100%',
                rowKey: 'a',
                treeNodeKey: '_check',
                enableHighlightCol: true,
                highlightColHeaderCellStyle: {backgroundColor: 'red'},
                highlightColRowCellStyle: {fontSize: '16px', backgroundColor: 'red'},
            },
            scopedSlots: {
                expand: ({row, idx}) => {
                    return <div class="aa-bb-cc" style="backgroundColor:yellow">
                        {row.a}
                    </div>
                }
            }
        })
    }
}).$mount('#app')
