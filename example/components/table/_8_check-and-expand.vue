<template>
    <div class="demo-wrapper">
        <p class="tip">
            设置col的type（check/expand）,可以开启特殊列
        </p>
        <p>设置type为'check'开启勾选列，也可以调用方法设置勾选</p>
        <div style="margin-bottom: 10px">
            <span class="btn" @click="check1">勾选王小虎1(传id,必须指定rowKey)</span>
            <span class="btn" @click="check2">勾选王小虎2(传对象)</span>
            <span class="btn" @click="setAll">全选</span>
        </div>
        <ele-rw-table :height="500" ref="table" row-key="name"
                      :table-data="tableData"
                      :table-cols="tableCols"/>
        <code-panel>
            <highlightjs language='javascript' :code="code1"/>
        </code-panel>
    </div>
</template>

<script>
const template = {
    date: "2016-05-1",
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: "上海市普陀区金沙江路 1511 弄",
    zip: 233333
}
const col = [
    {key: '__check__', type: 'check'},
    {key: 'name', label: '名称', minWidth: 150},
    {key: 'date', label: '日期', width: 120},
    {key: 'province', label: '省份', width: 100},
    {key: 'city', label: '区', width: 100},
    {key: 'address', label: '地址', minWidth: 150},
];
const code1 = `
            <template>
                <div style="margin-bottom: 10px">
                    <span class="btn" @click="check1">勾选王小虎1(传id,必须指定rowKey)</span>
                    <span class="btn" @click="check2">勾选王小虎2(传对象)</span>
                    <span class="btn" @click="setAll">全选</span>
                </div>
                <ele-rw-table :height="500" ref="table" row-key="name"
                      :table-data="tableData"
                      :table-cols="tableCols"/>
            </template>
            <script>
                 const template = {
                    date: "2016-05-1",
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: "上海市普陀区金沙江路 1511 弄",
                    zip: 233333
                }
                 export default {
                     data(){
                         return {
                             cols: [
                                {key: '__check__', type: 'check'},
                                {key: 'name', label: '名称', minWidth: 150},
                                {key: 'date', label: '日期', width: 120},
                                {key: 'province', label: '省份', width: 100},
                                {key: 'city', label: '区', width: 100},
                                {key: 'address', label: '地址', minWidth: 150},
                             ],
                             tableData: new Array(20).fill(0).map((i,idx) => {
                                 return {...template,name:'王小虎'+idx}
                             }),
                             checkAll:false,
                         }
                     },
                     methods:{
                        setAll(){
                            this.checkAll = !this.checkAll;
                            //必须指定状态
                            this.$refs.table.setAllChecked(this.checkAll);
                        },
                        check1(){
                            //必须指定rowKey，指定状态则设置为对应状态，否则切换状态
                            this.$refs.table.toggleRowChecked('王小虎1');
                        },
                        check2(){
                            this.$refs.table.toggleRowChecked(this.tableData[2]);
                        }
                    }
                 }
            <\/script>`;
export default {
    name: "check-and-expand",
    data() {
        return {
            tableCols: col,
            tableData: new Array(20).fill(0).map((i,idx) => {
                return {...template,name:'王小虎'+idx}
            }),
            code1: code1,
            checkAll:false,
        }
    },
    methods:{
        setAll(){
            this.checkAll = !this.checkAll;
            //必须指定状态
            this.$refs.table.setAllChecked(this.checkAll);
        },
        check1(){
            //必须指定rowKey，指定状态则设置为对应状态，否则切换状态
            this.$refs.table.toggleRowChecked('王小虎1');
        },
        check2(){
            this.$refs.table.toggleRowChecked(this.tableData[2]);
        }
    }
}
</script>
<style lang="less" scoped>

</style>
