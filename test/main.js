import Vue from 'vue'
import CustomTable from '../packages/table/index';

Vue.config.performance = true;

new Vue({
    data() {
        return {
            cols: [
                {key: '_expand', label:"expand", type: 'expand', width: 100,fixed:'left'},
                {key: '_check', label:"check", type: 'check', width: 100},
                {
                    key: 'a', label: 'a', minWidth: 200,
                    headerAlign: 'center', align: 'center',
                },
                {key: 'b', label: 'b', fixed:'right',minWidth: 200}
            ],
            tableData: new Array(20).fill(0).map((v,idx)=>{return {a:idx,b:'xxxx'}}),
            footerData: [
                {a: 'footer-1'},
                {a: 'footer-2'},
                {a: 'footer-3'},
            ]
        }
    },
    render(h) {
        const vnode =  h(CustomTable, {
            attrs: {
                tableCols: this.cols,
                tableData: this.tableData,
                footerData:this.footerData,
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
        });
        return vnode
    }
}).$mount('#app')


