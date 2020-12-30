<template>
    <div class="demo-wrapper">
        <p class="tip">
            append 为追加的内容,body的最后一行, footer 之前
        </p>
        <p>利用append和
            <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" style="color:red">
                IntersectionObserver
            </a>
            实现无限滚动加载，如下
        </p>
        <p>设置resetScrollOnDataChange 阻止当数据更新时回到顶部</p>
        <ele-rw-table height="auto" :max-height="500" ref="table"
                      :reset-scroll-on-data-change="false"
                      :table-data="tableData"
                      :table-cols="tableCols">
            <template #append>
                <div v-visible="load" style="height: 80px;text-align: center;background-color: black">
                    正在加载数据。。。{{ leftTime }}
                </div>
            </template>
        </ele-rw-table>
        <code-panel>
            <highlightjs language='javascript' :code="code1"/>
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
    {key: '__index__', width: 50, render: (h, {row, rowIndex}) => rowIndex + 1},
    {key: 'date', label: '日期', minWidth: 200},
    {key: 'name', label: '名称', minWidth: 150},
    {key: 'province', label: '省份', width: 200},
    {key: 'city', label: '市区', width: 200},
    {key: 'address', label: '地址', minWidth: 300},
    {key: 'zip', label: '邮编'},
];
const code1 = `
            <template>
                <ele-rw-table height="auto" :max-height="500" ref="table"
                      :reset-scroll-on-data-change="false"
                      :table-data="tableData"
                      :table-cols="tableCols">
                    <template #append>
                        <div v-visible="load" style="height: 80px;text-align: center;background-color: black">
                            正在加载数据。。。{{ leftTime }}
                        </div>
                    </template>
                </ele-rw-table>
            </template>
            <script>
                 import 'intersection-observer';
                 const template = {
                    date: "2016-05-1",
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: "上海市普陀区金沙江路 1511 弄",
                    zip: 233333
                 }
                 export default {
                     directives: {
                        visible: {
                            bind: function (el, binding) {
                                const fn = binding.value;
                                const io = new IntersectionObserver((entries) => {
                                    const entry = entries[0];
                                    entry.isIntersecting && fn && fn();
                                }, {threshold: [0.8]});
                                io.observe(el);
                                el.__intersectionObserver__ = io;
                            },
                            unbind: function (el, binding) {
                                el.__intersectionObserver__ && el.__intersectionObserver__.disconnect();
                                el.__intersectionObserver__ = null;
                            }
                        }
                    },
                    data() {
                        return {
                            tableCols: col,
                            tableData: new Array(20).fill(0).map(i => {
                                return {...template}
                            }),
                            isLoad: false,
                            leftTime: null,
                        }
                    },
                    methods: {
                        load() {
                            if (this.isLoad) return;
                            this.isLoad = true;
                            this.leftTime = 3;
                            const timer = setInterval(() => {
                                this.leftTime -= 1;
                            }, 1000)
                            setTimeout(() => {
                                this.tableData = [
                                    ...this.tableData,
                                    ...new Array(3).fill(0).map(i => {
                                        return {...template}
                                    })
                                ]
                                this.isLoad = false;
                                this.leftTime = null;
                                clearInterval(timer);
                            }, 3000)
                        }
                    }
                 }
            <\/script>`;
import 'intersection-observer';

export default {
    name: "append-content",
    directives: {
        visible: {
            bind: function (el, binding) {
                const fn = binding.value;
                const io = new IntersectionObserver((entries) => {
                    const entry = entries[0];
                    entry.isIntersecting && fn && fn();
                }, {threshold: [0.8]});
                io.observe(el);
                el.__intersectionObserver__ = io;
            },
            unbind: function (el, binding) {
                el.__intersectionObserver__ && el.__intersectionObserver__.disconnect();
                el.__intersectionObserver__ = null;
            }
        }
    },
    data() {
        return {
            tableCols: col,
            tableData: new Array(20).fill(0).map(i => {
                return {...template}
            }),
            isLoad: false,
            leftTime: null,
            code1: code1,
        }
    },
    methods: {
        load() {
            if (this.isLoad) return;
            this.isLoad = true;
            this.leftTime = 3;
            const timer = setInterval(() => {
                this.leftTime -= 1;
            }, 1000)
            setTimeout(() => {
                this.tableData = [
                    ...this.tableData,
                    ...new Array(3).fill(0).map(i => {
                        return {...template}
                    })
                ]
                this.isLoad = false;
                this.leftTime = null;
                clearInterval(timer);
            }, 3000)
        }
    }
}
</script>
