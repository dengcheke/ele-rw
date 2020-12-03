export const CheckRow = 'check-row';//fn( row, checked, checkSet)
export const CheckChange = 'check-change'; //fn (checkSet)

export const ExpandRow = 'expand-row';//fn(row, expanded, expandedSet)
export const ExpandChange = 'expand-change'; // fn(expandedSet)

export const ExpandTreeRow = 'expand-tree-row'; //fn (row, expanded, treeExpandSet)
export const TreeExpandChange = 'tree-expand-change'; // fn (treeExpandSet)

export const ClickRow = 'click-row';// fn ( { row, rowIndex, $rowIndex, col, event})
export const ChangeColSort = 'change-col-sort'; // fn(col,sort,allSortColNode);
export const SortChange = 'sort-change'; // fn (allSortColNode )
export const TableEvent = {
    CheckRow:CheckRow,
    CheckChange:CheckChange,
    ExpandRow:ExpandRow,
    ExpandChange:ExpandChange,
    ExpandTreeRow:ExpandTreeRow,
    TreeExpandChange:TreeExpandChange,
    ClickRow:ClickRow,
    SortChange:SortChange,
    ChangeColSort:ChangeColSort
}
