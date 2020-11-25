import Vue from 'vue'
import CustomTable from '../packages/table/index';

Vue.config.performance = true;

new Vue({
    data() {
        return {
            cols: [
                {key: '_expand', type: 'expand'},
                {key: '_check', type: 'check'},
                {
                    key: 'a', label: 'a', headerAlign: 'center', align: 'center',
                    /*render: (h, {row, rowIndex, col, colIndex}) => {
                        return row.a
                    },*/
                },
                {key: 'b', label: 'b'}
            ],
            tableData: [
                {
                    a: 1, children: [
                        {
                            a: '1-1', children: [
                                {a: '1-1-1'},
                                {a: '1-1-2'}
                            ]
                        },
                        {a: '1-2', children: []},
                        {
                            a: '1-3', children: [
                                {a: '1-3-1'}
                            ]
                        },
                    ]
                },
                {
                    a: 2, children: [
                        {a: '2-1'},
                        {a: '2-2', children: [{a:'2-2-1'}]},
                        {a: '2-3'}
                    ]
                },
                {a: 3},
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


