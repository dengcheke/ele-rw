<template>
    <div class="demo-wrapper">
        <p class="tip">
            设置col的type（check/expand）,可以开启特殊列
        </p>
        <p>1. 设置type为'check'开启勾选列，也可以调用方法设置勾选</p>
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

        <p>2.设置type为'expand'开启展开列（需要设置展开内容），也可以调用方法设置展开行</p>
        <div style="margin-bottom: 10px">
            <span class="btn" @click="expand1">展开王小虎1(传id,必须指定rowKey)</span>
            <span class="btn" @click="expand2">展开王小虎2(传对象)</span>
            <span class="btn" @click="setAllExpand">全展开</span>
        </div>
        <p>通过设置scopeSlot的方式设置展开行内容</p>
        <ele-rw-table :height="500" ref="table1" row-key="name"
                      :table-data="tableData"
                      :table-cols="tableCols2">
            <template #expand="{row,rowIndex,$rowIndex}">
                <div v-for="key in Object.keys(row)" style="padding: 10px 20px">
                    <span style="color:cyan">{{ (tableCols2.find(i=>i.key===key) || {}).label}}</span>
                    <span style="margin-left: 10px">:{{row[key]}}</span>
                </div>
            </template>
        </ele-rw-table>
        <code-panel>
            <highlightjs language='javascript' :code="code2"/>
        </code-panel>
        <p>通过设置expandRender的方式设置展开行内容</p>
        <ele-rw-table :height="500" ref="table2" row-key="name"
                      :expand-render="renderExpand"
                      :table-data="tableData"
                      :table-cols="tableCols2">
        </ele-rw-table>
        <code-panel>
            <highlightjs language='javascript' :code="code3"/>
        </code-panel>
    </div>
</template>

<script type="text/jsx">
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
const col2 = [
    {key: '__expand__', type: 'expand'},
    {key: 'name', label: '名称', minWidth: 150},
    {key: 'date', label: '日期', width: 120},
    {key: 'province', label: '省份', width: 100},
    {key: 'city', label: '区', width: 100},
    {key: 'address', label: '地址', minWidth: 150},
]
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
                                {key: '__expand__', type: 'expand'},
                                {key: 'name', label: '名称', minWidth: 150},
                                {key: 'date', label: '日期', width: 120},
                                {key: 'province', label: '省份', width: 100},
                                {key: 'city', label: '区', width: 100},
                                {key: 'address', label: '地址', minWidth: 150},
                             ],
                             tableData: new Array(20).fill(0).map((i,idx) => {
                                 return {...template,name:'王小虎'+idx}
                             }),
                             expandAll:false,
                         }
                     },
                     methods:{
                        expand1(){
                            this.$refs.table.toggleRowExpanded('王小虎1');
                        },
                        expand2(){
                            this.$refs.table.toggleRowExpanded(this.tableData[2]);
                        },
                        setAllExpand(){
                            this.expandAll = !this.expandAll;
                            //必须指定状态
                            this.$refs.table.setAllExpanded(this.expandAll);
                        }
                    }
                 }
            <\/script>`;
const code2 = `
            <template>
                <div style="margin-bottom: 10px">
                    <span class="btn" @click="expand1">展开王小虎1(传id,必须指定rowKey)</span>
                    <span class="btn" @click="expand2">展开王小虎2(传对象)</span>
                    <span class="btn" @click="setAllExpand">全展开</span>
                </div>
                <ele-rw-table :height="500" ref="table" row-key="name"
                      :table-data="tableData"
                      :table-cols="tableCols">
                    <template #expand="{row,rowIndex,$rowIndex}">
                        <div v-for="key in Object.keys(row)" style="padding: 10px 20px">
                            <span style="color:cyan">{{ (tableCols.find(i=>i.key===key) || {}).label}}</span>
                            <span style="margin-left: 10px">:{{row[key]}}</span>
                        </div>
                    </template>
                </ele-rw-table>
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
const code3 = `
            <template>
                <div style="margin-bottom: 10px">
                    <span class="btn" @click="expand1">展开王小虎1(传id,必须指定rowKey)</span>
                    <span class="btn" @click="expand2">展开王小虎2(传对象)</span>
                    <span class="btn" @click="setAllExpand">全展开</span>
                </div>
                <ele-rw-table :height="500" ref="table" row-key="name"
                      :expand-render="renderExpand"
                      :table-data="tableData"
                      :table-cols="tableCols">
                </ele-rw-table>
            </template>
            <script type="text/jsx">
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
                             renderExpand:(h,{row,rowIndex,$rowIndex})=>{
                                 //need jsx support
                                return Object.keys(row).map(key=>{
                                    return <div style="padding: 10px 20px">
                                        <span style="color:cyan">{(this.tableCols.find(i=>i.key===key) || {}).label}</span>
                                        <span style="margin-left: 10px">:{row[key]}</span>
                                    </div>
                                })
                            }
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

            tableCols2:col2,
            renderExpand:(h,{row,rowIndex,$rowIndex})=>{
                return Object.keys(row).map(key=>{
                    return <div style="padding: 10px 20px">
                        <span style="color:cyan">{(this.tableCols.find(i=>i.key===key) || {}).label}</span>
                        <span style="margin-left: 10px">:{row[key]}</span>
                    </div>
                })
            },
            code2:code2,
            code3:code3
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
        },
        expand1(){
            this.$refs.table1.toggleRowExpanded('王小虎1');
        },
        expand2(){
            this.$refs.table1.toggleRowExpanded(this.tableData[2]);
        },
        setAllExpand(){
            this.expandAll = !this.expandAll;
            //必须指定状态
            this.$refs.table1.setAllExpanded(this.expandAll);
        }
    }
}
</script>
