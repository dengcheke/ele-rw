import Vue from 'vue'
import CustomTable from '../packages/table/index';

Vue.config.performance = true;

window.__vm = new Vue({
    data() {
        return {
            cols: [
                {key: '_expand', type: 'expand'},
                {key: '_check', type: 'check'},
                {key: 'id', label: '编号'},
                {
                    key: 'a', label: 'a', render: (h, {row, rowIndex, col, colIndex}) => {
                        return [row.a, rowIndex, col.key, colIndex].join("__")
                    },
                    cellClass: ['custom-class-a'],
                    headerCellStyle: function (obj) {
                        console.log(obj);
                        return {color: 'white'}
                    },
                    children: [
                        {key: 'a1', label: 'a1'},
                        {
                            key: 'a2', label: 'a2',
                            children: [
                                {key: 'a21', label: 'a21'},
                                {key: 'a22', label: 'a22'}
                            ]
                        },
                    ]
                },
                {key: 'b', label: 'b'}
            ],
            tableData: [
                {id: 1, a: 1, b: 0, a1: 11, a21: 21, a22: 22},
                {id: 2, a: 2, b: 0, a1: 11, a21: 21, a22: 22},
                {id: 3, a: 3, b: 0, a1: 11, a21: 21, a22: 22},
                {id: 4, a: 4, b: 0, a1: 11, a21: 21, a22: 22}
            ]
        }
    },
    render(h) {
        return h(CustomTable, {
            attrs: {
                tableCols: this.cols,
                tableData: this.tableData,
                height: '100%',
                rowKey: 'a',

                cellStyle:{height:'50px'},
                enableHighlightCol: true,
                highlightColHeaderCellStyle: {backgroundColor: 'red'},
                highlightColRowCellStyle: {fontSize: '16px', backgroundColor: 'red'},
                spanMethod: ({row, col, rowIndex, colIndex}) => {
                    if (colIndex === 4) {
                        if (rowIndex % 2 === 0) {
                            return [2, 1]
                        } else {
                            return [0, 0]
                        }
                    }
                },
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


