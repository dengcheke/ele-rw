<template>
    <div class="demo-wrapper">
        <p class="tip">
            设置col的children渲染为多级表头, 设置fixed可多级表头整体固定
        </p>
        <ele-rw-table  style="width: 800px"
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
    name: '王小虎',
    nian: '2012',
    yue: '8',
    ri: '8',
    height: 180,
    weight: 120,
    l: 60,
    h: 130,
    v1: '正常',
    v2: '异常'
}
const col = [
    {key: 'name', label: '名称', minWidth: 150, fixed: 'left'},
    {
        key: 'date', label: '检查日期',
        children: [
            {key: 'nian', label: '年', width: 100},
            {key: 'yue', label: '月', width: 100},
            {key: 'ri', label: '日', width: 100},
        ]
    },
    {
        key: '_1', label: '检查项',
        children: [
            {key: 'height', label: '身高', width: 100},
            {key: 'weight', label: '体重', width: 100},
            {
                key: 'xueya', label: '血压',
                children: [
                    {key: 'l', label: 'low', width: 80},
                    {key: 'h', label: 'high', width: 80}
                ]
            },
        ]
    },
    {
        key: 'conclusion', label: '结果', width: 100, fixed: 'right',
        children: [
            {key:'v1',label:'指标1',cellStyle:{color:'green'}},
            {key:'v2',label:'指标2',cellStyle:{color:'red'}}
        ]
    }
];
const code1 = `
            <template>
                <ele-rw-table style="width: 800px"
                      :height="500"
                      :table-data="tableData"
                      :table-cols="tableCols"/>
            </template>
            <script>
                 const template = {
                    name: '王小虎',
                    nian: '2012',
                    yue: '8',
                    ri: '8',
                    height: 180,
                    weight: 120,
                    l: 60,
                    h: 130,
                    v1: '正常',
                    v2: '异常'
                }
                 export default {
                     data(){
                         return {
                             cols: [
                                {key: 'name', label: '名称', minWidth: 150, fixed: 'left'},
                                {
                                    key: 'date', label: '检查日期',
                                    children: [
                                        {key: 'nian', label: '年', width: 100},
                                        {key: 'yue', label: '月', width: 100},
                                        {key: 'ri', label: '日', width: 100},
                                    ]
                                },
                                {
                                    key: '_1', label: '检查项',
                                    children: [
                                        {key: 'height', label: '身高', width: 100},
                                        {key: 'weight', label: '体重', width: 100},
                                        {
                                            key: 'xueya', label: '血压',
                                            children: [
                                                {key: 'l', label: 'low', width: 80},
                                                {key: 'h', label: 'high', width: 80}
                                            ]
                                        },
                                    ]
                                },
                                {
                                    key: 'conclusion', label: '结果', width: 100, fixed: 'right',
                                    children: [
                                        {key:'v1',label:'指标1',cellStyle:{color:'green'}},
                                        {key:'v2',label:'指标2',cellStyle:{color:'red'}}
                                    ]
                                }
                             ],
                             tableData: new Array(20).fill(0).map(i => {
                                 return {...template}
                             }),
                         }
                     },
                 }
            <\/script>`;
export default {
    name: "multi-header",
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

</style>
