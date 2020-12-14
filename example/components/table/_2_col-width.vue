<template>
    <div class="demo-wrapper">
        <p class="tip">
            col指定width,列宽为定值(未指定则默认80),若宽度总和不够,右侧会出现空白
        </p>
        <ele-rw-table :table-data="tableData" :table-cols="cols1"/>
        <code-panel>
            <highlightjs language='javascript' :code="code1"/>
        </code-panel>

        <p class="tip">
            col指定minWidth即为自适应列,将平分剩余宽度
        </p>
        <ele-rw-table :table-data="tableData" :table-cols="cols"/>
        <code-panel>
            <highlightjs language='javascript' :code="code2"/>
        </code-panel>
    </div>
</template>

<script>
const data1 = [
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
];
const col = [
    {key: 'date', label: '日期', minWidth: 200},
    {key: 'name', label: '名称', minWidth: 150},
    {key: 'province', label: '省份', width: 100},
    {key: 'city', label: '市区', width: 100},
    {key: 'address', label: '地址', minWidth: 300},
    {key: 'zip', label: '邮编'},
];
const code1 = `
            ...
            data(){
                return {
                    cols: [
                        {key: 'date', label: '日期'},
                        {key: 'name', label: '名称'},
                        {key: 'province', label: '省份',width:100},
                        {key: 'city', label: '市区',width: 100},
                        {key: 'address', label: '地址'},
                        {key: 'zip', label: '邮编'},
                    ],
                ...
                },
            }
            ...
`
const code2 = `
            <script>
                 export default {
                     data(){
                         return {
                                cols: [
                                    {key: 'date', label: '日期',minWidth:200},
                                    {key: 'name', label: '名称',minWidth:150},
                                    {key: 'province', label: '省份',width:100},
                                    {key: 'city', label: '市区',width: 100},
                                    {key: 'address', label: '地址',minWidth: 300},
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
            <\/script>`
export default {
    name: "col-width",
    data() {
        return {
            cols: col,
            cols1: col.map(i => {
                const j = {...i};
                delete j.minWidth;
                return j;
            }),
            tableData: data1,
            code2: code2,
            code1: code1
        }
    }
}
</script>
