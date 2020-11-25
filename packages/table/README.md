### table attr
| 参数名 | 说明 | 类型 | 默认值 | 可选值 |
|---------------------|---------------------------------------------------------------------------------|------------------------------------------------------------------------------------|----------|-----------------------------|
| row\-key            | 行数据的key,用于指定key查找一行数据等 | String / Function\(row\) | | |
| children\-key       | 表示树形结构的子节点字段,设为null表示不开启树形 | String | children | |
| tree\-node\-key     | 显示树形展开按钮的字段名 | String | | |
| table\-data         | 表格数据 | Array\<row\> | \[\] | |
| table\-cols         | 表格列配置,column参数见后面 | Array\<columnObject\> | \[\] | |
| height              | 表格高度,为'auto'时表示自动高度,受minHeight,maxHeight限制,其它非'auto'字符串和数字表示高度受控 | String / Number | 'auto' | |
| min\-height         | 表格最小高度, | Number  | | |
| max\-height         | 表格最大高度 | Number | | |
| align               | 表格所有cell\(包括header\)的对齐方式，同css align\-items属性 | String | 'left' | 'left' / 'right' / 'center' |
| indent              | 树形结构的缩进 | Number | 16 | |
| expand\-render      | 展开行的渲染函数, 或者使用slot 如<template \#expand=\{row\}> | Function\( h, \{ row \} \) | | |
| span\-method        | 合并td方法 返回\[rowspan,colspan\],仅在常规col生效,内置的check和expand列不生效 | Function\( \{ row, rowIndex, col, colIndex \} \) | |  |
| enableCurrentRow    | 是否开启高亮当前行 | Boolean |True |
| row\-style          | 内容区域行样式 | Object / Function\( \{ row, rowIndex \) \} | | |
| row\-class          | 内容区域的行class | Object / String / Array\<String\> / Function\( \{ row, rowIndex \} \) | | |
| cell\-style         | 内容区cell单元格样式 | Object / Function\( \{ row, rowIndex, col, colIndex \} \) | |  |
| cell\-class         | 内容区cell单元格class | Object / String / Array\<String\> / Function\( \{ row, rowIndex, col, colIndex \} \) | | |
| header\-row\-style  | 表头行样式 | Object / Function\( \{ row<columnObject>, rowIndex \} \) | | |
| header\-row\-class  | 表头行class | Object / String / Array\<String\> / Function\( \{ row\<columnObject\>, rowIndex \} \) | | |
| header\-cell\-style | 表头cell单元格样式 | Object / Function\( \{ row\<columnObject\>, rowIndex , col, colIndex \} \) | | |
| header\-cell\-style | 表头cell单元格class | Object / Function\( \{ row\<columnObject\>, rowIndex, col, colIndex \} \) | | |
### table event
| 事件名                  | 说明                                                                                                        | 参数                                         |
|----------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------|
| check\-row        | 勾选row时，row当前行数据，checked 当前行的勾选状态， checkedSet 所有勾选row的集合 | function \( row, checked，checkedSet\)|
| check\-change | 勾选发生变化 ,checkedSet 所有勾选row的集合 | function \( checkedSet \) |
| expand\-row       | 展开row时，row当前行数据，expanded 当前行的展开状态， expandedSet 所有展开row的集合 | function \( row, expanded, expandedSet\)  |
| expand\-change | 展开变化时, expandedList 所有展开row的列表 | function \( expandedSet \) |
| expand\-tree\-row | 展开树形节点时, row 当前行数据， expanded 当前行的展开状态, treeExpandSet 所有展开树节点的结合| function \( row, expanded, treeExpandedSet\) |
| tree\-expand\-change | 展开树形节点时,  treeExpandedSet 所有展开树节点的集合 | function\( treeExpandedSet \) |
| click\-row           | 点击一行时,  row 当前行数据， col 点击cell位置对应的列， index 行索引（不包括tr\.expand\-row）| function \( \{ row, col, index, event \}\) |
| sort\-change         | 排序变化时，colNode 当前排序发生变化的字段，colNode\.sort ='asc' /'desc' / null , col = colNode\.col, allSortNode 所有参与排序的节点 | function \( colNode, allSortNode \)        |
### table methods
| 方法                 | 说明                                                                          | 参数                                     |
|--------------------|-----------------------------------------------------------------------------|----------------------------------------|
| setCurrentRow      | 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。可以是row对象 或者 id值（使用id时，rowKey必须指定） | function \( row \| rowid \)            |
| toggleRowChecked   | 切换行的勾选状态，不传checked， 则会切换状态                                                  | function \( row \| rowid , checked \)  |
| setAllChecked      | 设置所有的勾选状态                                                                   | function \( checked \)                 |
| toggleRowExpanded  | 展开一个节点，不传expanded，则切换展开，（当树节点没展开时，不会显示子节点的展开）                               | function \( row \| rowid , expanded \) |
| setAllExpanded     | 设置所有行的展开                                                                    | function \( expanded \)                |
| toggleTreeExpanded | 切换行的树形展开状态，不传expanded， 则会切换状态                                               | function \( row \| rowid, expanded \)  |

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
    render: (h, {row, rowIndex, col, colIndex}) => {
        //just return string
        return new Date(row.time).format('yyyy-MM-dd');
        //return vnode
        return h('span', new Date(row.time).format('yyyy-MM-dd'))
        //return vnode with jsx support
        return <span>{new Date(row.time).format('yyyy-MM-dd')}</span>
    },
    renderHeader: (h, {row, rowIndex, col, colIndex}) => {
        return <span style="color:red">{col.label}</span>
    },
}
```
#### columnObject
| 参数名          | 说明                                                                                                                           | 类型                                                             | 默认值      | 可选值                          |
|--------------|------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|----------|------------------------------|
| key          | 列的key字段                                                                                                                      | String                                                         |          |                              |
| label        | 表头显示label名称, headerCell 默认显示 label                                                                                           | String                                                         |          |                              |
| type         | 列的类型, 为'text'时可省略, 此时cell默认显示row\[key\]                                                                                      | String                                                         | 'text'   | 'text' / 'check' / 'expand'  |
| sortable     | 是否可排序                                                                                                                        | Boolean                                                        | false    |                              |
| align        | 内容cell的对齐方式，可覆盖table指定的align                                                                                                 | String                                                         |          | 'left' / 'center' / 'right'  |
| headerAlign  | 表头cell的对齐方式，可覆盖table指定的align                                                                                                 | String                                                         |          | 'left' / 'center' / 'right'  |
| width        | 列宽，固定值， 可以是 '14px' , 14 ,  '20%' 三种类型的值                                                                                      | String / Number                                                |          |                              |
| minWidth     | 最小列宽（width将失效），具有minWidth的列将平分剩余的宽度，可以是 '14px' , 14 ,  '20%' 三种类型的值                                                          | String / Number                                                |          |                              |
| fixed        | 固定列, 为middle时可省略                                                                                                             | String                                                         | 'middle' | 'left' / 'middle' /  'right' |
| children     | 嵌套列，多级表头，（多级表头的fixed属性由BFS遍历过程中的第一个有效fixed决定，例如\{key:'xx', children:\[\{fixed:'left'\},\{fixed:'right'\}\]\},的最终fixed均为left） | Array<columnObject>                                            |          |                              |
| render       | cell渲染函数，指定改选项时，type将失效，                                                                                                     | Function\(h, \{row, rowIndex, col, colIndex \}\)               |          |                              |
| renderHeader | headerCell 的渲染函数，指定该选项时，内置的sort，check，expand图标将失效，由客户端自己调用table方法实现，                                                              | Function\(h, \{row<columnObject>, rowIndex, col, colIndex \}\) |          |                              |
