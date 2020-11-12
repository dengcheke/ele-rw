<template>
    <div style="height: 100%;width: 100%;position: relative;">
        <div @click="curRings+=1" style="position: absolute">下一轮</div>
        <ele-rw-table height="400px" ref="table" style="margin-left: 50px;width: 300px"
                      :table-cols="tableCols" :table-data="tableData"/>
    </div>
</template>

<script type="text/jsx">
let i = 1;
export default {
    name: "app",
    data() {
        const render = (h, {row, col}) => {
            const data = row[col.key];
            return <span style="color:yellow"
                         class={{'join': data === 1, 'not-join': data === 0}}>{data === 2 ? '队' : ""}</span>
        }
        return {
            lastLeader: null,
            curRings: 1,
            tableCols: [
                {
                    key: 'id', label: "", width: 100,
                    fixed:"left",
                    render: (h, {rowIndex}) => {
                        const idx = this.curRings <= 10 ? this.curRings : (this.curRings - 11) % 18 + 11;
                        const isCur = idx == rowIndex + 1;
                        return [
                            <span>{rowIndex + 1}</span>,
                            <span style="color:yellow">{isCur ? '当前轮' : ''}</span>
                        ]
                    }
                },
                {key: 'a', label: 'a', width: 150, render: render},
                {key: 'b', label: 'b', width: 150, render: render},
                {key: 'c', label: 'c', width: 150, render: render},
                {key: 'd', label: 'd', width: 150, render: render},
                {key: 'e', label: 'e', width: 150, render: render},
            ],
            tableData: [
                {a: 1, b: 0, c: 0},
                {a: 1, b: 0, c: 0},
                {a: 1, b: 0, c: 0},
                {a: 1, b: 0, c: 0},

                {a: 2, b: 1, c: 1},
                {a: 2, b: 1, c: 1},
                {a: 2, b: 1, c: 1},
                {a: 2, b: 1, c: 1},
                {a: 2, b: 0, c: 0},
                {a: 2, b: 0, c: 0},

                //loop 1
                {a: 1, b: 2, c: 0},
                {a: 1, b: 2, c: 0},
                {a: 1, b: 2, c: 0},
                {a: 1, b: 2, c: 0},
                {a: 0, b: 2, c: 0},
                {a: 0, b: 2, c: 0},
                //loop 2
                {a: 0, b: 1, c: 2},
                {a: 0, b: 1, c: 2},
                {a: 0, b: 1, c: 2},
                {a: 0, b: 1, c: 2},
                {a: 0, b: 0, c: 2},
                {a: 0, b: 0, c: 2},
                //loop 3
                {a: 2, b: 0, c: 1},
                {a: 2, b: 0, c: 1},
                {a: 2, b: 0, c: 1},
                {a: 2, b: 0, c: 1},
                {a: 2, b: 0, c: 0},
                {a: 2, b: 0, c: 0},
            ]
        }
    },
}
</script>

<style lang="less">
.custom-table {
    tr {
        height: 40px;
    }

    .join, .not-join {
        display: inline-block;
        width: 32px;
        height: 32px;
        background-size: 100% 100%;
    }

    .join {
        background-image: url("./right.svg");
    }

    .not-join {
        background-image: url("./error.svg");
    }

    .table__body {
        tr:not(:last-child) {
            td {
                border-bottom: 1px solid cyan;
            }
        }
        tr:nth-child(-n+10){
            background-color: #607d8b !important;
        }
        /*td:not(:last-child) {
            border-right: 1px solid cyan;
        }*/
    }
}
</style>
