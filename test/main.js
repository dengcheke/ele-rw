import Vue from 'vue'
import CustomTable from '../packages/table/index';

Vue.config.performance = true;

const aCtor = Vue.extend(CustomTable)
let curRings = 1;
const cols = [
    {key: 'id', type: 'check'},
    {key: 'a', label:'a'},
    {key: 'b',label:'b'}
    /*...new Array(20).fill(1).map((v, idx) => {
        return {key: 'a_' + idx, label: '属性' + idx}
    })*/
]
const a = new aCtor({
    propsData: {
        //clickMode: 'multi',
        tableCols: cols,
        height: '100%',
        tableData: [
            {a:1,b:0},
            {a:2,b:0}
        ],/*new Array(100).fill(0).map((i, idx) => {
            return cols.reduce((res, cur) => {
                res[cur.key] = idx + 1;
                return res;
            }, {})
        })*/
    }
});
a.$mount('#app');
window.__vm = a;

