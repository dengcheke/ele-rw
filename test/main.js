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
            tableData: [
                {
                    a: 1, children: [
                        {a: 11, children: [{a: 111}, {a: 112}]},
                        {a: 12, children: [{a: 121}, {a: 122}]},
                    ]
                },
                {a: 2},
                {a: 3},
                {a: 4}
            ]
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
