<template>
    <div class="demo-wrapper">
        <p class="tip">
            最简单的表格, 传入 tableCols 和 tableData 即可
        </p>
        <ele-rw-table :table-data="tableData" :table-cols="cols"/>
        <code-panel>
            <highlightjs language='javascript' :code="code1"/>
        </code-panel>

        <p class="tip">
            设置全局的align,和col单独的align/headerAlign, col上设置的可覆盖全局
        </p>
        <div style="margin-bottom: 10px">
            <span class="btn" @click="align='left'">靠左</span>
            <span class="btn" @click="align='center'">居中</span>
            <span class="btn" @click="align='right'">靠右</span>
        </div>
        <ele-rw-table :table-data="tableData1" :table-cols="cols1" :align="align"/>
        <code-panel>
            <highlightjs language='javascript' :code="code2"/>
        </code-panel>

        <p class="tip">
            高亮行默认开启,设置enableCurrentRow开关,点击一行,再次点击取消,或使用setCurrentRow方法
        </p>
        <div style="margin-bottom: 10px">
            <span class="btn" @click="selectRow">选中第1行</span>
        </div>
        <ele-rw-table class="table-hl-row" :table-data="tableData" :table-cols="cols"
                      row-key="name" ref="table"/>
        <code-panel>
            <highlightjs language='javascript' :code="code3"/>
        </code-panel>
    </div>
</template>

<script>
const data1 = [
    {
        date: "2016-05-1",
        name: '王大虎',
        province: '上海',
        city: '普陀区',
        address: "上海市普陀区金沙江路 1511 弄",
        zip: 233333
    },
    {
        date: "2016-05-2",
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: "上海市普陀区金沙江路 1512 弄",
        zip: 233333
    },
    {
        date: "2016-05-3",
        name: '王中虎',
        province: '上海',
        city: '普陀区',
        address: "上海市普陀区金沙江路 1513 弄",
        zip: 233333
    }
];
const cols = [
    {key: 'date', label: '日期'},
    {key: 'name', label: '名称'},
    {key: 'province', label: '省份'},
    {key: 'city', label: '市区'},
    {key: 'address', label: '地址'},
    {key: 'zip', label: '邮编'},
];
const cols1 = [
    {key: 'date', label: '日期'},
    {key: 'name', label: '名称'},
    {key: 'province', label: '省份'},
    {key: 'city', label: '市区'},
    {key: 'address', label: '地址'},
    {key: 'zip', label: '邮编'},
    {key: 'content', label: '靠右的表头', width: 200, align: 'left', headerAlign: 'right'}
];
const code1 = `
            <template>
                  <ele-rw-table :table-data="tableData" :table-cols="cols"/>
            <\/template>
            <script>
                 export default {
                     data(){
                         return {
                                cols: [
                                    {key: 'date', label: '日期'},
                                    {key: 'name', label: '名称'},
                                    {key: 'province', label: '省份'},
                                    {key: 'city', label: '市区'},
                                    {key: 'address', label: '地址'},
                                    {key: 'zip', label: '邮编'},
                                ],
                                tableData: [
                                    {
                                        date: "2016-05-1",
                                        name: '王小虎',
                                        province: '上海',
                                        city: '普陀区',
                                        address: "上海市普陀区金沙江路 1511 弄",
                                        zip: 233333
                                    },
                                    {
                                        date: "2016-05-2",
                                        name: '王小虎',
                                        province: '上海',
                                        city: '普陀区',
                                        address: "上海市普陀区金沙江路 1512 弄",
                                        zip: 233333
                                    },
                                    {
                                        date: "2016-05-3",
                                        name: '王小虎',
                                        province: '上海',
                                        city: '普陀区',
                                        address: "上海市普陀区金沙江路 1513 弄",
                                        zip: 233333
                                    }
                                ],
                         }
                     }
                 }
            <\/script>
`
const code2 = `
            <template>
                <div>
                    <div style="margin-bottom: 10px">
                        <span class="btn" @click="align='left'">靠左</span>
                        <span class="btn" @click="align='center'">居中</span>
                        <span class="btn" @click="align='right'">靠右</span>
                    </div>
                    <ele-rw-table :table-data="tableData" :table-cols="cols" :align="align"/>
                </div>
            <\/template>
            <script>
                export default {
                    data(){
                        return {
                            align:'left',
                            cols: [
                                {key: 'date', label: '日期'},
                                {key: 'name', label: '名称'},
                                {key: 'province', label: '省份',width:100},
                                {key: 'city', label: '市区',width: 100},
                                {key: 'address', label: '地址'},
                                {key: 'zip', label: '邮编'},
                                {
                                    key: 'content', label:'靠右的表头',width:200,
                                    align: 'left', //内容靠左
                                    headerAlign:'right', //表头靠右
                                }
                            ],
                            tableData: data1.map(i=>{
                                const j = {...i};
                                j.content = '靠左的内容';
                                return j;
                            })
                        },
                    }
                }
            <\/script>`
const code3 = `
            <template>
                <div style="margin-bottom: 10px">
                    <span class="btn" @click="selectRow">选中第1行</span>
                </div>
                <ele-rw-table :table-data="tableData" :table-cols="cols" row-key="name" ref="table"/>
            </template>
            <script>
                export default {
                    data() {
                        return {
                            cols: cols,
                            tableData: data,
                        }
                    },
                    methods:{
                        selectRow(){
                            this.$refs.table.setCurrentRow({name:'王大虎'});
                            //必须指定rowKey
                            //this.$refs.table.setCurrentRow('王大虎');
                            //直接传入对象
                            //this.$refs.table.setCurrentRow(this.tableData[0]);
                        }
                    }
                }
            <\/script>
            <style lang="less">
                //修改高亮行颜色
                .table-hl-row.ele-rw-table .table__body .row {
                    &.current-row {
                        background-color: #DD4A68;
                    }
                    &:hover{
                        background-color: #00b0e8;
                    }
                }
            </style>
`
export default {
    name: "table-base",
    data() {
        return {
            align: 'center',
            cols: cols,
            tableData: data1,
            cols1: cols1,
            tableData1: data1.map(i => {
                const j = {...i};
                j.content = '靠左的内容';
                return j;
            }),
            code1: code1,
            code2: code2,
            code3: code3
        }
    },
    methods: {
        selectRow() {
            this.$refs.table.setCurrentRow({name: '王大虎'});
        }
    }
}
</script>
<style lang="less">
.table-hl-row.ele-rw-table .table__body .row {
    &.current-row {
        background-color: #DD4A68;
    }
    &:hover{
        background-color: #00b0e8;
    }
}
</style>
