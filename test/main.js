import Vue from 'vue'
import CustomTable from '../packages/table/index';

Vue.config.performance = true;

new Vue({
    data() {
        return {
            cols: [
                {key: '_expand', label: "expand", type: 'expand', width: 400, fixed: 'left'},
                {key: '_check', label: "check", type: 'check', width: 200},
                {
                    key: 'a', label: 'a', minWidth: 200,
                    headerAlign: 'center', align: 'center',
                },
                {
                    key: 'b', label: 'b', fixed: 'middle',children: [
                        {key: 'b1', label: 'b1',width:80},
                        {key: 'b2', label: 'b2',width:100},
                    ]
                }
            ],
            tableData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((v, idx) => {
                return {a: idx, b1: 'xxxx'}
            }),
            footerData: [
                {a: 'footer-1',b1:'xxxxxxxx'},
                {a: 'footer-2',b2:'xxxxxxxx'},
                {a: 'footer-3',b1:'xxxxxxxx'},
            ]
        }
    },
    render(h) {
        const vnode = h(CustomTable, {
            attrs: {
                tableCols: this.cols,
                tableData: this.tableData,
                footerData: this.footerData,
                align: 'center',
                height: 'auto',
                rowKey: 'a',
                treeNodeKey: '_check',
                minHeight: 300,
                maxHeight: 500,
                resizable: true
            },
            scopedSlots: {
                expand: ({row, idx}) => {
                    return <div class="aa-bb-cc">
                        {row.a}
                    </div>
                }
            }
        });
        return vnode
    }
}).$mount('#app')


