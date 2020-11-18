import Vue from 'vue'
import CustomTable from '../packages/table/index';

Vue.config.performance = true;

const cols = [
    {key:'_expand',type:'expand'},
    {key: 'id', type: 'check'},
    {key: 'a', label: 'a'},
    {key: 'b', label: 'b'}
]
new Vue({
    render: (h) => {
        return h(CustomTable, {
            attrs: {
                tableCols: cols,
                tableData: [
                    {a: 1, b: 0},
                    {a: 2, b: 0}
                ],
                height: '100%',
                rowKey:'a',
            },
            scopedSlots:{
                expand:({row,idx})=>{
                    return <div class="aa-bb-cc" style="backgroundColor:yellow">
                        {row.a}
                    </div>
                }
            }
        })
    }
}).$mount('#app')


