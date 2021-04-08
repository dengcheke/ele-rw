### table attr

| 参数名              | 说明                                                                                                                                       | 类型                                                                                            | 默认值   | 可选值                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------- | --------------------------- |
| row\-key            | 行数据的 key,用于指定 key 查找一行数据等                                                                                                   | String / Function\(row\)                                                                        |          |                             |
| children\-key       | 表示树形结构的子节点字段,设为 null 表示不开启树形                                                                                          | String                                                                                          | children |                             |
| tree\-node\-key     | 显示树形展开按钮的字段名                                                                                                                   | String                                                                                          |          |                             |
| children-key   | 树形结构的子组数字段名| String | 'children' |
| table\-data         | 表格数据                                                                                                                                   | Array\<row\>                                                                                    | \[\]     |
| footer\-data        | 表尾数据                                                                                                                                   | Array\<row\>                                                                                    | []       |
| table\-cols         | 表格列配置,columnObject 参数见后面                                                                                                         | Array\<columnObject\>                                                                           | \[\]     |                             |
| height              | 表格高度,为'auto'时表示自动高度,其它非'auto'字符串和数字(例如 100%, 100, 100px, calc(100% - 40px))表示高度受控 | String / Number                                                                                 | 'auto'   |                             |
| min\-height         | 表格最小高度                                                                                                                               | Number                                                                                          |          |                             |
| max\-height         | 表格最大高度                                                                                                                               | Number                                                                                          |          |                             |
| align               | 表格所有 cell\(包括 header footer\)的对齐方式，同 css text-align 属性                                                                           | String                                                                                          |   | 'left' / 'right' / 'center' |
| indent              | 树形结构的缩进                                                                                                                             | Number                                                                                          | 16       |                             |
| expand\-render      | 展开行的渲染函数, 或者使用 scopeSlot 如<template \#expand=\{row\}>                                                                         | Function\( h, \{ row ,rowIndex, $rowIndex\} \)                                                                      |          |                             |
| span\-method        | 合并 td 方法,函数返回\[rowspan,colspan\],仅在常规 col 生效,内置的 check 和 expand 列不生效                                                 | Function\( \{ row, rowIndex, col, colIndex \} \)                                                |          |                             |
| resizable           | 是否开启列拖拽                                                                                                                             | Boolean                                                                                         | false    |
| enable\-current\-row    | 是否开启高亮当前行                                                                                                                         | Boolean                                                                                         | True     |
| show-header | 是否显示表头| Boolean | true |
| reset-scroll-on-data-change | 当tableData发生变化时（Array变化生效例如data = [...data],Array不变的如Array.push(xxx)等不生效 ）,是否重置滚动到左上角 |Boolean | true |  
| row\-style          | 内容区域行样式, 为函数时:<br/> row: 行数据, <br/>rowIndex: row 在 tableData 中的 index,<br/> $rowIndex:tr 在 table 中的 dom index          | Object / Function\( \{ row, rowIndex, $rowIndex \) \}                                           |          |                             |
| row\-class          | 内容区域的行 class,参数同 row-style                                                                                                        | Object / String / Array\<String\> / Function\( \{ row, rowIndex,\$rowIndex \} \)                |          |                             |
| cell\-style         | 内容区 单元格样式,参数:<br/> col:列对象 columnObject,<br/> $colIndex:td 在 tr 中的索引                                                | Object / Function\( \{ row, rowIndex, $rowIndex, col, $colIndex \} \)                           |          |                             |
| cell\-class         | 内容区 单元格 class,参数同 cell-style                                                                                                 | Object / String / Array\<String\> / Function\( \{ row, rowIndex,$rowIndex, col, $colIndex \} \) |          |                             |
| header\-row\-style  | 表头行样式,参数:<br/>row:当前行所有列对象 Array\<columnObject\>,<br/>\$rowIndex:dom 索引,第几行,                                           | Object / Function\( \{ row, \$rowIndex \} \)                                                    |          |                             |
| header\-row\-class  | 表头行 class,参数同 header-row-style                                                                                                       | Object / String / Array\<String\> / Function\( \{ row<columnObject>, $rowIndex \} \)            |          |                             |
| header\-cell\-style | 表头单元格样式,参数:<br/> row:Array\<columnObject\>,<br/>$rowIndex:第几行,<br/>col:列对象,<br/>$colIndex:列 dom 索引,第几列          | Object / Function\( \{ row, $rowIndex , col, $colIndex \} \)                                    |          |                             |
| header\-cell\-class | 表头单元格 class,同 header-cell-style                                                                                                | Object / String / Array<String> / Function\( \{ row, $rowIndex, col, $colIndex \} \)            |          |                             |
| footer-cell-style   | 表尾区单元格 样式, 参数同 row-style, rowIndex 为 footerData, | Object / Function\( \{ row, rowIndex, $rowIndex \) \} | | |
| footer-cell-class   | 表尾区单元格 class, 同 cell-class  | Object / String / Array\<String\> / Function\( \{ row, rowIndex,$rowIndex, col, $colIndex \} \) |          |                             |
| footer-row-style    | 同row-style
| footer-row-class    | 同row-class
### table event

| 事件名               | 说明                                                                                                                                     | 参数                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| row-check           | 勾选 row 时，row 当前行数据，checked 当前行的勾选状态， checkedSet 所有勾选 row 的集合                                                   | function \( row, checked，checkedSet\)                   |
| check-change        | 勾选发生变化 ,checkedSet 所有勾选 row 的集合                                                                                             | function \( checkedSet \)                                |
| row-expand          | 展开 row 时，row 当前行数据，expanded 当前行的展开状态， expandedSet 所有展开 row 的集合                                                 | function \( row, expanded, expandedSet\)                 |
| expand-change       | 展开变化时, expandedList 所有展开 row 的列表                                                                                             | function \( expandedSet \)                               |
| tree-row-expand     | 展开树形节点时, row 当前行数据， expanded 当前行的展开状态, treeExpandSet 所有展开树节点的结合                                           | function \( row, expanded, treeExpandedSet\)             |
| tree-expand-change  | 展开树形节点时, treeExpandedSet 所有展开树节点的集合                                                                                     | function\( treeExpandedSet \)                            |
| row-click           | 点击一行时, row 当前行数据， col 点击 cell 位置对应的列， rowIndex 行数据索引, $rowIndex 行 dom 索引                                     | function \( \{ row, rowIndex, $rowIndex, col, event \}\) |
| cell-click          | 点击一个cell, row 当前行数据, rowIndex 行数据索引, $rowIndex 行 dom 索引, col 点击 cell 位置对应的列，$colIndex 列 dom 索引,             | function \( \{ row, rowIndex, $rowIndex, col, $colIndex, event \}\) |
| col-sort-change     | 列排序变化时, col 列对象, sort 列的排序('asc'/'desc'/null), allSortNode 所有可排序的节点列表(col = node.col, sort = node.sort)| function( col, sort, allSortNode)
| sort-change         | 排序变化时，allSortNode 所有可排序的节点列表 | function \( allSortNode \)                      |

### table methods

| 方法               | 说明                                                                                                                                          | 参数                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| setCurrentRow      | 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。可以是 row 对象 或者 id 值（使用 id 时，rowKey 必须指定） | function \( row / rowid \)                      |
| toggleRowChecked   | 切换行的勾选状态，不传 checked， 则会切换状态, emit:是否触发 'check-row' 事件                                                                 | function \( row / rowid , checked ,emit=true \) |
| setAllChecked      | 设置所有的勾选状态                                                                                                                            | function \( checked \)                          |
| toggleRowExpanded  | 展开一个节点，不传 expanded，则切换展开，（当树节点没展开时，不会显示子节点的展开）,emit:是否触发 'expand-row'事件                            | function \( row / rowid , expanded,emit=true \) |
| setAllExpanded     | 设置所有行的展开                                                                                                                              | function \( expanded \)                         |
| toggleTreeExpanded | 切换行的树形展开状态，不传 expanded， 则会切换状态, emit:是否触发 'expand-tree-row' 事件                                                      | function \( row / rowid, expanded, emit=true \) |
| setAllTreeExpanded | 设置所有行的树形展开                                                                                                                          | function( expanded )                            |
| setColumnSort      | 设置col的sort |  function( col, sort, emit=true)

### columnObject 配置

一个完整的配置如下(仅列出所有选项)

```javascript
{
    key: 'time',
    label: '日期',
    type: 'text',
    sortable:true,
    align:'center',
    headerAlign:'left',
    width:100,
    minWidth:200,
    fixed:'left',
    children: [
        { key:'year', label: '年' },
        { key:'month', label: '月' },
    ],
    render: (h, {row, rowIndex, $rowIndex, col, $colIndex}) => {
        //just return string
        return new Date(row.time).format('yyyy-MM-dd');
        //return vnode
        return h('span', new Date(row.time).format('yyyy-MM-dd'))
        //return vnode with jsx support
        return <span>{new Date(row.time).format('yyyy-MM-dd')}</span>
    },
    renderFooter:(h, {row, rowIndex, $rowIndex, col, $colIndex}){
        if($colIndex===0){
            return '合计'
        }else{
            return this.tableData.reduce((res,cur)=>{
                return (res += cur[col.key])
            },0)
        }
    },
    renderHeader: (h, {row, $rowIndex, col, $colIndex}) => {
        return <span style="color:red">{col.label}</span>
    },
    //可覆盖全局的cellStyle
    cellStyle: {
        fontSize: '16px'
    },
    //可覆盖全局的cellClass
    cellClass: ({row, rowIndex, $rowIndex, col, $colIndex}) => {
        return ['cell-class'];
    },
    //可覆盖全局的headerCellStyle
    headerCellStyle: {
        background: 'black'
    },
    //可覆盖全局的headerCellClass
    headerCellClass: ({row, $rowIndex, col, $colIndex}) => {
        return {'header-cell-class': true}
    },
    footerCellStyle:{
        fontSize:'20px'
    },
    footerCellClass:{
        'class-1':true
    }   
}
```

#### columnObject

| 参数名       | 说明                                                                                                                                                                          | 类型                                                        | 默认值   | 可选值                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------- | --------------------------- |
| key          | 列的 key 字段                                                                                                                                                                 | String                                                      |          |                             |
| label        | 表头显示 label 名称, headerCell 默认显示 label                                                                                                                                | String                                                      |          |                             |
| type         | 列的类型, 为'text'时可省略, 此时 cell 默认显示 row\[key\]                                                                                                                     | String                                                      | 'text'   | 'text' / 'check' / 'expand' |
| sortable     | 是否可排序                                                                                                                                                                    | Boolean                                                     | false    |                             |
| align        | 内容 cell 的对齐方式，可覆盖 table 指定的 align                                                                                                                               | String                                                      |          | 'left' / 'center' / 'right' |
| headerAlign  | 表头 cell 的对齐方式，可覆盖 table 指定的 align                                                                                                                               | String                                                      |          | 'left' / 'center' / 'right' |
| width        | 列宽，固定值， 可以是 '14px' , 14 , '20%' 三种类型的值                                                                                                                        | String / Number                                             |          |                             |
| minWidth     | 最小列宽（width 将失效），具有 minWidth 的列将平分剩余的宽度，可以是 '14px' , 14 , '20%' 三种类型的值                                                                         | String / Number                                             |          |                             |
| fixed        | 固定列, 为 middle 时可省略                                                                                                                                                    | String                                                      | 'middle' | 'left' / 'middle' / 'right' |
| children     | 嵌套列，多级表头，（多级表头的 fixed 属性由 BFS 遍历过程中的第一个有效 fixed 决定，例如\{key:'xx', children:\[\{fixed:'left'\},\{fixed:'right'\}\]\},的最终 fixed 均为 left） | Array\<columnObject\>                                       |          |                             |
| render       | cell 渲染函数，指定 render 时，type 将失效，内容完全由客户端指定                                                                                                              | Function\(h, \{row, rowIndex,$rowIndex, col, $colIndex \}\) |          |                             |
| renderFooter | footerCell 渲染函数  | Function\(h, \{row, rowIndex,$rowIndex, col, $colIndex \}\) |          |                             |
| renderHeader | headerCell 的渲染函数，指定该选项时，内置的 sort，check，expand 图标将失效，由客户端自己调用 table 方法实现，                                                                 | Function\(h, \{row, $rowIndex, col, $colIndex \}\)          |          |                             |

#### slot

| 参数名       | 说明       | 参数 |
| ------------ | -----------| ----------|
| expand       | 行的展开内容  | {row ,rowIndex, $rowIndex} |
| append        | 追加到body最后一行，footer之前 的内容 | |
