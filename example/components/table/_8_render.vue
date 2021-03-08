<template>
    <div class="demo-wrapper">
        <p class="tip">
            设置col render,renderHeader,renderFooter(会覆盖check,expand列的默认内容),自定义渲染内容
        </p>
        <ele-rw-table :height="500" :table-data="tableData" :footer-data="footerData"
                      :table-cols="tableCols"/>
        <code-panel>
            <highlightjs language='javascript' :code="code1"/>
        </code-panel>
    </div>
</template>

<script type="text/jsx">
import {TABLE} from "../../../packages/table";

const template = {
    date: "2016-05-1",
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: "上海市普陀区金沙江路 1511 弄",
    zip: 233333
}
const code1 = `
            <template>
                <ele-rw-table :height="500" :table-data="tableData" :footer-data="footerData"
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
                 import {TABLE} from '@packages/table'
                 export default {
                    name: "check-and-expand",
                    data() {
                        return {
                            tableCols: [
                                {
                                    key: '__check__', type: 'check', width: 100, fixed: 'left',
                                    render: (h) => {
                                        return <div style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;"
                                                    title={'这会使原生的默认渲染内容失效'}>这会使原生的默认渲染内容失效</div>
                                    },
                                    renderFooter: (h, {row}) => {
                                        return row.__check__ || '合计'
                                    }
                                },
                                {
                                    key: 'name', label: '名称', minWidth: 150,
                                    render: (h, {row}) => {
                                        //渲染其他信息,覆盖默认的 row.name
                                        return row.zip;
                                    },
                                    renderFooter: (h) => {
                                        return "共" + this.tableData.length + "人";
                                    }
                                },
                                {
                                    key: 'date', label: '日期', width: 240,
                                    renderHeader: (h, {row}) => {
                                        return <span style="color:red;font-weight:18px">自定义头部</span>
                                    },
                                    render: (h, {row}) => {
                                        return new Date(row.date).getTime();
                                    },
                                    renderFooter: (h) => {
                                        return <span style="color:cyan">自定义尾部内容</span>
                                    }
                                },
                                {
                                    key: 'province', label: '省份', width: 300, sortable:true, type: 'check',
                                    renderHeader: (h, {row}) => {
                                        return ['省份',TABLE.$SortCaret,'xxxxx',TABLE.$CheckBox]
                                    }
                                },
                                {key: 'city', label: '区', width: 300},
                                {key: 'address', label: '地址', width: 250},
                                {
                                    key: '__oper__', width: 80, fixed: 'right',
                                    renderHeader: () => '操作',
                                    render: (h, {row}) => {
                                        return <span class="btn" style="margin:0" onClick={(e) => {
                                            console.log('你点击了:', row);
                                        }}>详情</span>
                                    }
                                },
                                {
                                    key: '__gutter__', width: 10,
                                    cellClass: 'gutter', fixed: 'right'
                                }
                            ],
                            footerData: [
                                {},
                                {__check__: '自定义其他内容'}
                            ],
                            tableData: new Array(20).fill(0).map((i, idx) => {
                                return {...template, name: '王小虎' + idx}
                            }),
                        }
                    },
                }
            <\/script>`;
export default {
    name: "check-and-expand",
    data() {
        return {
            tableCols: [
                {
                    key: '__check__', type: 'check', width: 100, fixed: 'left',
                    render: (h) => {
                        return <div style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;"
                                    title={'这会使原生的默认渲染内容失效'}>这会使原生的默认渲染内容失效</div>
                    },
                    renderFooter: (h, {row}) => {
                        return row.__check__ || '合计'
                    }
                },
                {
                    key: 'name', label: '名称', minWidth: 150,
                    render: (h, {row}) => {
                        //渲染其他信息,覆盖默认的 row.name
                        return row.zip;
                    },
                    renderFooter: (h) => {
                        return `共${this.tableData.length}人`;
                    }
                },
                {
                    key: 'date', label: '日期', width: 240,
                    renderHeader: (h, {row}) => {
                        return <span style="color:red;font-weight:18px">自定义头部</span>
                    },
                    render: (h, {row}) => {
                        return new Date(row.date).getTime();
                    },
                    renderFooter: (h) => {
                        return <span style="color:cyan">自定义尾部内容</span>
                    }
                },
                {
                    key: 'province', label: '省份', width: 300, sortable:true, type: 'check',
                    renderHeader: (h, {row}) => {
                        return ['省份',TABLE.$SortCaret,'xxxxx',TABLE.$CheckBox]
                    }
                },
                {key: 'city', label: '区', width: 300},
                {key: 'address', label: '地址', width: 250},
                {
                    key: '__oper__', width: 80, fixed: 'right',
                    renderHeader: () => '操作',
                    render: (h, {row}) => {
                        return <span class="btn" style="margin:0" onClick={(e) => {
                            console.log('你点击了:', row);
                        }}>详情</span>
                    }
                },
                {
                    key: '__gutter__', width: 10,
                    cellClass: 'gutter', fixed: 'right'
                }
            ],
            footerData: [{}, {__check__: '自定义其他内容'}],
            tableData: new Array(20).fill(0).map((i, idx) => {
                return {...template, name: '王小虎' + idx}
            }),
            code1: code1,
        }
    },
}
</script>
