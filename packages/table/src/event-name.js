export const CheckRow = 'check-row';//fn( row, checked, checkSet)
export const CheckChange = 'check-change'; //fn (checkSet)

export const ExpandRow = 'expand-row';//fn(row, expanded, expandedRows)
export const ExpandChange = 'expand-change'; // fn(expandedRows)

export const ExpandTreeRow = 'expand-tree-row'; //fn (row, expanded, treeExpandSet)
export const TreeExpandChange = 'tree-expand-change'; // fn (treeExpandSet)

export const ClickRow = 'click-row';// fn ( { row, col, index, event})
export const SortChange = 'sort-change'; // fn ( colNode, allSortColNode )
export const TableEvent = {
    CheckRow:CheckRow,
    CheckChange:CheckChange,
    ExpandRow:ExpandRow,
    ExpandChange:ExpandChange,
    ExpandTreeRow:ExpandTreeRow,
    TreeExpandChange:TreeExpandChange,
    ClickRow:ClickRow,
    SortChange:SortChange
}
