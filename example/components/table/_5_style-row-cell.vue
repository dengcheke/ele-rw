<template>
    <div class="demo-wrapper">
        <p class="tip">
            表格全局样式,单元格样式,行样式,等,
            <span style="color:red">(当自定义样式之后可能会覆盖表格的样式，比如选中行等)</span>
        </p>
        <ele-rw-table no-border
                      header-row-class="header-row-class"
                      :footer-row-class="footerRowClass"
                      :cell-style="cellStyle"
                      :table-data="tableData"
                      :table-cols="cols"
                      :footer-data="footerData"/>
        <code-panel>
            <highlightjs language='javascript' :code="code1"/>
        </code-panel>
    </div>
</template>

<script>
const data = [
    {
        id: 1,
        date: "2016-05-1",
        name: '王大虎',
        province: '上海',
        city: '普陀区',
        address: "上海市普陀区金沙江路 1511 弄",
        zip: 233333
    },
    {
        id: 2,
        date: "2016-05-2",
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: "上海市普陀区金沙江路 1512 弄",
        zip: 233333
    },
    {
        id: 3,
        date: "2016-05-3",
        name: '王中虎',
        province: '上海',
        city: '普陀区',
        address: "上海市普陀区金沙江路 1513 弄",
        zip: 233333
    }
];
const cols = [
    {
        key: 'id', label: "", width: 100, align: 'center',
    },
    {
        key: 'date', label: '日期', minWidth: 200,
    },
    {
        key: 'name', label: '名称', minWidth: 150,
        headerCellStyle: {
            backgroundColor: 'white'
        }
    },
    {key: 'province', label: '省份', width: 100},
    {key: 'city', label: '市区', width: 100},
    {key: 'address', label: '地址', minWidth: 300},
    {
        key: 'zip', label: '邮编', cellStyle: () => {
            return {
                backgroundColor: 'black'
            }
        }
    },
];
const code1 = `
            <template>
                <ele-rw-table header-row-class="header-row-class"
                      :footer-row-class="footerRowClass"
                      :cell-style="cellStyle"
                      :table-data="tableData"
                      :table-cols="cols"
                      :footer-data="footerData"/>
            </template>

            <script>
                export default {
                    data(){
                        return {
                            cols : [
                                {
                                    key: 'id', label: "", width: 100, align: 'center',
                                },
                                {
                                    key: 'date', label: '日期', minWidth: 200,
                                },
                                {
                                    key: 'name', label: '名称', minWidth: 150,
                                    headerCellStyle: {
                                        backgroundColor: 'white'
                                    }
                                },
                                {key: 'province', label: '省份', width: 100},
                                {key: 'city', label: '市区', width: 100},
                                {key: 'address', label: '地址', minWidth: 300},
                                {
                                    key: 'zip', label: '邮编', cellStyle: () => {
                                        return {
                                            backgroundColor: 'black'
                                        }
                                    }
                                },
                            ],
                            tableData:[
                                {
                                    id: 1,
                                    date: "2016-05-1",
                                    name: '王大虎',
                                    province: '上海',
                                    city: '普陀区',
                                    address: "上海市普陀区金沙江路 1511 弄",
                                    zip: 233333
                                },
                                {
                                    id: 2,
                                    date: "2016-05-2",
                                    name: '王小虎',
                                    province: '上海',
                                    city: '普陀区',
                                    address: "上海市普陀区金沙江路 1512 弄",
                                    zip: 233333
                                },
                                {
                                    id: 3,
                                    date: "2016-05-3",
                                    name: '王中虎',
                                    province: '上海',
                                    city: '普陀区',
                                    address: "上海市普陀区金沙江路 1513 弄",
                                    zip: 233333
                                }
                            ],
                            footerData:[
                                {
                                    date:'footer_1_date',
                                    name:'footer_1_name',
                                },
                                {
                                    date:'footer_2_date',
                                    name:'footer_2_name',
                                }
                            ],
                            cellStyle: ({row, rowIndex, $rowIndex, col, $colIndex}) => {
                                const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].reverse();
                                return {
                                    backgroundColor: ($rowIndex + $colIndex) % 2 === 0
                                        ? colors[$colIndex]
                                        : null
                                }
                            },
                            footerRowClass: ({row, rowIndex, $rowIndex}) => {
                                return \`row-footer-\` + $rowIndex
                            },
                        }
                    }
                }
            <\/script>

            <style lang="less">
                .ele-rw-table {
                    td {
                        border: none !important;
                    }
                    .header-row-class {
                        background-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
                    }
                    [class^='row-footer-'] {
                        td {
                            text-align: right;
                        }
                    }
                }
            <\/style>`
export default {
    name: "style-row-cell",
    data() {
        return {
            cols: cols,
            tableData: data,
            footerData: [
                {
                    date: 'footer_1_date',
                    name: 'footer_1_name',
                },
                {
                    date: 'footer_2_date',
                    name: 'footer_2_name',
                }
            ],
            cellStyle: ({row, rowIndex, $rowIndex, col, $colIndex}) => {
                const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].reverse();
                return {
                    backgroundColor: ($rowIndex + $colIndex) % 2 === 0
                        ? colors[$colIndex]
                        : null
                }
            },
            footerRowClass: ({row, rowIndex, $rowIndex}) => {
                return `row-footer-` + $rowIndex
            },
            code1: code1,
        }
    },
}
</script>

<style scoped lang="less">
/deep/ .ele-rw-table[no-border] {
    td {
        border: none !important;
    }

    .header-row-class {
        background-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
    }

    [class^='row-footer-'] {
        td {
            text-align: right;
        }
    }
}
</style>
