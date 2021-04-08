import {randomString} from "@src/utils";

export const RowCheck = 'row-check';//fn( row, checked, checkSet)
export const CheckChange = 'check-change'; //fn (checkSet)

export const RowExpand = 'row-expand';//fn(row, expanded, expandedSet)
export const ExpandChange = 'expand-change'; // fn(expandedSet)

export const TreeRowExpand = 'tree-row-expand'; //fn (row, expanded, treeExpandSet)
export const TreeExpandChange = 'tree-expand-change'; // fn (treeExpandSet)

export const RowClick = 'row-click';// fn ( { row, rowIndex, $rowIndex, col, event})
export const CellClick = 'cell-click';// fn( { row, rowIndex, $rowIndex, col, $colIndex, event })
export const ColSortChange = 'change-col-sort'; // fn(col,sort,allSortColNode);
export const SortChange = 'sort-change'; // fn (allSortColNode )
export const TableEvent = {
    RowCheck:RowCheck,
    CheckChange:CheckChange,
    RowExpand:RowExpand,
    ExpandChange:ExpandChange,
    TreeRowExpand:TreeRowExpand,
    TreeExpandChange:TreeExpandChange,
    RowClick:RowClick,
    SortChange:SortChange,
    ColSortChange:ColSortChange,
    CellClick:CellClick
}


export const TABLE = Object.freeze({
    $SortCaret: randomString(16),
    $CheckBox: randomString(16)
})
