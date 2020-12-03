<template>
    <div class="demo-wrapper">
        <p class="tip">
            表格斑马纹
        </p>
        <ele-rw-table table-stripe :table-data="tableData" :table-cols="cols"/>
        <code-panel>
            <highlightjs language='less' :code="code1"/>
        </code-panel>

        <p class="tip">
            表格边框样式修改
        </p>
        <p>无边框</p>
        <ele-rw-table no-border :table-data="tableData" :table-cols="cols"/>
        <code-panel>
            <highlightjs language='less' :code="code2"/>
        </code-panel>
        <p>内边框</p>
        <ele-rw-table inner-border :table-data="tableData" :table-cols="cols" :footer-data="footerData"/>
        <code-panel>
            <highlightjs language='less' :code="code3"/>
        </code-panel>
        <p>外边框</p>
        <ele-rw-table outer-border :table-data="tableData" :table-cols="cols"/>
        <code-panel>
            <highlightjs language='less' :code="code4"/>
        </code-panel>
    </div>
</template>

<script>
const data = [
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
    {key: 'date', label: '日期', minWidth: 200},
    {key: 'name', label: '名称', minWidth: 150},
    {key: 'province', label: '省份', width: 100},
    {key: 'city', label: '市区', width: 100},
    {key: 'address', label: '地址', minWidth: 300},
    {key: 'zip', label: '邮编'},
];
const code1 = `
            <style lang="less">
                /*斑马纹*/
                .ele-rw-table .table__body{
                    tr.row {
                        &:nth-child(odd){
                            background-color: #01a3a3;
                        }
                        &:nth-child(even){
                            background-color: #9a6e3a;
                        }
                    }
               }
            </style>
`
const code2 = `
            <style lang="less">
                .ele-rw-table td {
                        border: none !important;
                }
            </style>`
const code3 = `
            <template>
                <ele-rw-table :table-data="tableData" :table-cols="cols" :footer-data="footerData"/>
            </template>

            <script>
                export default {
                    data(){
                        return {
                            cols : [
                                {key: 'date', label: '日期', minWidth: 200},
                                {key: 'name', label: '名称', minWidth: 150},
                                {key: 'province', label: '省份', width: 100},
                                {key: 'city', label: '市区', width: 100},
                                {key: 'address', label: '地址', minWidth: 300},
                                {key: 'zip', label: '邮编'},
                            ],
                            tableData:[...],
                            footerData:[
                                {
                                    date:'footer_1_date',
                                    name:'footer_1_name',
                                },
                                {
                                    date:'footer_2_date',
                                    name:'footer_2_name',
                                }
                            ]
                        }
                    }
                }
            <\/script>

            <style lang="less">
                  @borderStyle: 2px solid green;
                  .table__header td {
                    border-bottom: @borderStyle;
                    border-right: @borderStyle;
                  }

                  .table__body, .table__footer {
                    tr:not(:last-child) td {
                      border-bottom: @borderStyle;
                    }
                    td:not(:last-child) {
                      border-right: @borderStyle;
                    }
                  }
                  .table__footer tr:first-child td {
                    border-top: @borderStyle
                  }
            </style>`
const code4 = `
            <style lang="less">
                  .ele-rw-table{
                    box-shadow: 0 0 10px 2px black;
                  }
            </style>`
export default {
    name: "style-border",
    data() {
        return {
            cols: cols,
            tableData: data,
            footerData: [
                {
                    date:'footer_1_date',
                    name:'footer_1_name',
                },
                {
                    date:'footer_2_date',
                    name:'footer_2_name',
                }
            ],
            code1: code1,
            code2: code2,
            code3: code3,
            code4: code4
        }
    },
}
</script>

<style scoped lang="less">
/deep/ .ele-rw-table[table-stripe] .table__body {
    tr.row {
        &:nth-child(odd) {
            background-color: #01a3a3;
        }

        &:nth-child(even) {
            background-color: #9a6e3a;
        }
    }
}

/deep/ .ele-rw-table[no-border] {
    td {
        border: none !important;
    }
}

/deep/ .ele-rw-table[inner-border] {
    @borderStyle: 2px solid green;

    .table__header td {
        border-bottom: @borderStyle;
        border-right: @borderStyle;
    }

    .table__body, .table__footer {
        tr:not(:last-child) td {
            border-bottom: @borderStyle;
        }

        td:not(:last-child) {
            border-right: @borderStyle;
        }
    }

    .table__footer tr:first-child td {
        border-top: @borderStyle
    }
}

/deep/ .ele-rw-table[outer-border] {
    box-shadow: 0 0 10px 2px black;
}
</style>
