<template>
    <div class="demo-wrapper">
        <p class="tip">
            设置col的fixed开启固定列
        </p>
        <ele-rw-table no-border style="width: 800px"
                      :height="500"
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
    {key: 'date', label: '日期', minWidth: 200, fixed: 'left'},
    {key: 'name', label: '名称', minWidth: 150, fixed: 'left'},
    {key: 'province', label: '省份', width: 200},
    {key: 'city', label: '市区', width: 200},
    {key: 'address', label: '地址', minWidth: 300},
    {key: 'zip', label: '邮编', fixed: 'right'},
];
const code1 = `
            <template>
                <ele-rw-table no-border style="width: 800px"
                      :height="500"
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
                                {key: 'date', label: '日期', minWidth: 200, fixed: 'left'},
                                {key: 'name', label: '名称', minWidth: 150, fixed: 'left'},
                                {key: 'province', label: '省份', width: 200},
                                {key: 'city', label: '市区', width: 200},
                                {key: 'address', label: '地址', minWidth: 300},
                                {key: 'zip', label: '邮编', fixed: 'right'},
                             ],
                             tableData: new Array(20).fill(0).map(i => {
                                 return {...template}
                             }),
                         }
                     },
                 }
            <\/script>`;
export default {
    name: "fixed-col",
    data() {
        return {
            tableCols: col,
            tableData: new Array(20).fill(0).map(i => {
                return {...template}
            }),
            code1: code1,
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .ele-rw-table[no-border] {
    td {
        border: none !important;
    }
}
</style>
