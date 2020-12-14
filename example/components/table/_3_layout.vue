<template>
    <div class="demo-wrapper">
        <p class="tip">
            table高度分为2种模式, 一个是'auto'模式,一个是非'auto'模式
        </p>
        <p>
            <span style="color:red">auto</span>
            模式下,表格高度会无限增长,可以通过
            <b>minHeight</b>和<b>maxHeight</b>来限制
            <br/>
            <span style="color:red">非auto</span>
            模式下,表格高度固定,(min,max此时也生效)
        </p>
        <div style="margin-bottom: 10px">
            <span class="btn" @click="appendRow">添加row</span>
            <span class="btn" @click="removeRow">移除row</span>
            <span class="btn" @click="height=350">切换height固定350px</span>
            <span class="btn" @click="height='auto'">切换height为auto</span>
        </div>
        <div style="margin-bottom: 10px">当前模式:{{ height !== 'auto' ? '固定高度350px' : 'auto' }},min:200,max:400</div>
        <ele-rw-table style="box-shadow: 0 0 5px 1px black;"
                      :height="height"
                      :min-height="200"
                      :max-height="400"
                      :table-data="tableData"
                      :table-cols="cols"/>
        <code-panel>
            <highlightjs language='javascript' :code="code1"/>
        </code-panel>

        <p class="tip">
            table的宽高自动响应式,可受限制于父元素.
        </p>
        <p>自适应父容器,拖拽右下角黑色块改变父容器大小</p>
        <div style="padding: 0 20px 20px 0;position: relative;box-shadow: 0 0 0 1px black; height: 200px;width: 500px;
            min-width: 500px;min-height: 200px;max-height: 500px;max-width: 1200px">
            <ele-rw-table height="calc(100% - 50px)" :table-data="tableData1" :table-cols="cols"/>
            <div class="drag" @mousedown="handleDrag($event)"/>
        </div>
        <code-panel>
            <highlightjs language='javascript' :code="code2"/>
        </code-panel>
    </div>
</template>

<script>
let gid = 1;
const template = {
    date: "2016-05-1",
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: "上海市普陀区金沙江路 1511 弄",
    zip: 233333
}
const col = [
    {key: 'id', width: 100},
    {key: 'date', label: '日期', minWidth: 200},
    {key: 'name', label: '名称', minWidth: 150},
    {key: 'province', label: '省份', width: 100},
    {key: 'city', label: '市区', width: 100},
    {key: 'address', label: '地址', minWidth: 300},
    {key: 'zip', label: '邮编'},
];
const code1 = `
            <template>
                <div style="margin-bottom: 10px">
                    <span class="btn" @click="appendRow">添加row</span>
                    <span class="btn" @click="removeRow">移除row</span>
                    <span class="btn" @click="height=350">切换height固定350px</span>
                    <span class="btn" @click="height='auto'">切换height为auto</span>
                </div>
                <ele-rw-table style="box-shadow: 0 0 5px 1px black;"
                              :height="height"
                              :min-height="200"
                              :max-height="400"
                              :table-data="tableData"
                              :table-cols="cols"/>
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
                             height: 'auto',
                             cols: [
                                {key: 'id', width: 100},
                                {key: 'date', label: '日期', minWidth: 200},
                                {key: 'name', label: '名称', minWidth: 150},
                                {key: 'province', label: '省份', width: 100},
                                {key: 'city', label: '市区', width: 100},
                                {key: 'address', label: '地址', minWidth: 300},
                                {key: 'zip', label: '邮编'},
                             ],
                             tableData: new Array(3).fill(0).map(i => {
                                return {id: gid++, ...template}
                             }),
                         }
                     },
                     methods: {
                        appendRow() {
                            this.tableData.push({id: gid++, ...template})
                        },
                        removeRow() {
                            this.tableData.pop();
                        }
                    }
                 }
            <\/script>`;
const code2 = `
            <template>
               <div style="padding: 0 20px 20px 0;
                   position: relative;
                   box-shadow: 0 0 0 1px black;
                   height: 200px;width: 500px;
                   min-width: 500px;min-height: 200px;
                   max-width: 1200px;max-height: 500px;">
                   <ele-rw-table height="calc(100% - 50px)" :table-data="tableData" :table-cols="tableCols"/>
                   <div class="drag" @mousedown="handleDrag($event)"/>
               </div>
            </template>
            <script>
                 export default {
                     data(){
                         ...
                     },
                     methods: {
                        handleDrag(e) {
                            const target = e.currentTarget;
                            const parent = target.parentElement;
                            const x = e.clientX, y = e.clientY;
                            const rect = parent.getBoundingClientRect();
                            const mousemove = (e) => {
                                parent.style.width = rect.width + e.clientX - x + 'px';
                                parent.style.height = rect.height + e.clientY - y + 'px';
                            }
                            const mouseup = (e) => {
                                document.body.removeEventListener('mousemove', mousemove);
                                document.body.removeEventListener('mouseup', mouseup);
                            }
                            document.body.addEventListener('mousemove', mousemove);
                            document.body.addEventListener('mouseup', mouseup);
                        }
                     }
                 }
            <\/script>`
export default {
    name: "table-layout",
    data() {
        return {
            height: 'auto',
            cols: col,
            tableData: new Array(3).fill(0).map(i => {
                return {id: gid++, ...template}
            }),
            tableData1: new Array(8).fill(0).map(i => {
                return {id: gid++, ...template}
            }),
            code1: code1,
            code2: code2
        }
    },
    methods: {
        appendRow() {
            this.tableData.push({id: gid++, ...template})
        },
        removeRow() {
            this.tableData.pop();
        },
        handleDrag(e) {
            const target = e.currentTarget;
            const parent = target.parentElement;
            const x = e.clientX, y = e.clientY;
            const rect = parent.getBoundingClientRect();
            document.body.userSelect = 'none';
            const mousemove = (e) => {
                parent.style.width = rect.width + e.clientX - x + 'px';
                parent.style.height = rect.height + e.clientY - y + 'px';
            }
            const mouseup = (e) => {
                document.body.removeEventListener('mousemove', mousemove);
                document.body.removeEventListener('mouseup', mouseup);
                document.body.userSelect = 'auto';
            }
            document.body.addEventListener('mousemove', mousemove);
            document.body.addEventListener('mouseup', mouseup);
        }
    }
}
</script>
<style lang="less">
.drag {
    width: 20px;
    height: 20px;
    background-color: black;
    right: 0;
    bottom: 0;
    position: absolute;
}
</style>
