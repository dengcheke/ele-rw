<script type="text/jsx">
import {ASC, DESC} from "./store";
import {isDefined, mapping} from "@src/utils/index";
import {addClass, off, on, removeClass} from "@src/utils/dom";
import {objectToStyleString} from "@src/utils";
import {resolveClass, resolveStyle} from "./utils";
import {TABLE} from "./table-config";

export default {
    name: "table-header",
    inject: ['table', 'store'],
    props: {
        fixed: {
            default: "middle",
        }
    },
    computed: {
        ...mapping('store', {
            maxLevel: store => store.maxLevel || 0,
            columnLevelMap: store => store.columnLevelMap || {},
            leafColumns: store => store.leafColumns || [],
            tableBodyWidth: store => store.tableBodyWidth || 0,
        }),
        tableData() {
            return this.table.tableData || [];
        }
    },
    methods: {
        handleResizeCol(event, colNode, positiveDirec) {
            document.body.style.userSelect = 'none';
            const x = event.clientX; //当前页面点击X
            let finalX = null;
            this.table.isDragCol = true;
            const {innerWrap} = this.table.$refs;
            const wrapRect = innerWrap.getBoundingClientRect();
            const tdRect = event.currentTarget.parentNode.getBoundingClientRect();
            this.table.dragLineTop = tdRect.top - wrapRect.top;
            const left = this.table.dragLineLeft =
                tdRect.left - wrapRect.left + (positiveDirec === 'left' ? 0 : tdRect.width);
            const onMouseMove = (e) => {
                const colAdd = (e.clientX - x) * (positiveDirec === 'right' ? 1 : -1);
                const width = colNode.width + colAdd;
                //最低宽度32
                if (width < 32) return;
                //左右固定列最小间隔32
                const {fixedLeftWidth, fixedRightWidth} = this.store;
                if (fixedLeftWidth + fixedRightWidth + colAdd + 32 > wrapRect.width) return;
                finalX = e.clientX;
                this.table.dragLineLeft = left + e.clientX - x;
            }
            const onMouseUp = (e) => {
                document.body.style.userSelect = null;
                if (isDefined(finalX)) {
                    const colAdd = (finalX - x) * (positiveDirec === 'right' ? 1 : -1);
                    this.store.changeColWidth(colNode, colAdd);
                }
                this.table.isDragCol = false;
                this.table.dragLineTop = 0;
                this.table.dragLineLeft = 0;
                off(document, 'mousemove', onMouseMove);
                off(document, 'mouseup', onMouseUp);
            }
            on(document, 'mousemove', onMouseMove);
            on(document, 'mouseup', onMouseUp);
            return false;
        },
        handleMouseEnter(e) {
            //check prop
            const {enableHighlightCol, highlightColHeaderCellStyle, highlightColRowCellStyle} = this.table;
            if (!enableHighlightCol || (!highlightColHeaderCellStyle && !highlightColRowCellStyle)) return;
            //find col
            const target = e.currentTarget;
            const colUid = target.dataset.colUid, colLevel = target.dataset.colLevel;
            const _cols = this.columnLevelMap[colLevel];
            if (!_cols) return;
            const colNode = _cols.find(i => i._uid === colUid);
            if (!colNode) return;

            //go on
            const styleElm = this.table.headerStyleElm;
            let colUids = [colNode._uid], stack = [...colNode.children];
            while (stack.length) {
                const node = stack.shift();
                colUids.push(node._uid);
                stack = [...stack, ...node.children];
            }
            let hStyleStr = [], rStyleStr = [];
            if (colUids.length) {
                const headerStyle = objectToStyleString(highlightColHeaderCellStyle);
                const cellStyle = objectToStyleString(highlightColRowCellStyle);
                colUids.forEach(uid => {
                    headerStyle && hStyleStr.push(`.ele-rw-table[uid='table_uid_${this.table._globalTableId}'] thead tr td[data-col-uid='${uid}'] .cell`)
                    cellStyle && rStyleStr.push(`.ele-rw-table[uid='table_uid_${this.table._globalTableId}'] tbody tr td[data-col-uid='${uid}'] .cell`)
                })
                hStyleStr = hStyleStr.join(",\n") + `{\n${headerStyle}}`
                rStyleStr = rStyleStr.join(",\n") + `{\n${cellStyle}}`
                styleElm.innerHTML = hStyleStr + '\n' + rStyleStr;
            }
        },
        handleMouseLeave(e) {
            const styleElm = this.table.headerStyleElm;
            styleElm.innerHTML = "";
        },
        handleCheck(e) {
            e.stopPropagation();
            const checkNums = this.store.checkNums,
                totalNums = this.tableData.length;
            if (checkNums < totalNums) {
                this.table.setAllChecked(true);
            } else {
                this.table.setAllChecked(false);
            }
        },
        renderColGroup(h) {
            return <colgroup>
                {
                    this.leafColumns.map(leafNode => {
                        return <col key={leafNode.key} width={leafNode.width}/>
                    })
                }
            </colgroup>
        },
        getTrStyle(args) {
            return resolveStyle(this.table.headerRowStyle, args);
        },
        getTrClass(args) {
            return resolveClass(this.table.headerRowClass, args);
        },
        getCellStyle(colNode, args) {
            return {
                textAlign: colNode.headerAlign || this.table.align,
                ...resolveStyle(this.table.headerCellStyle, args),
                ...resolveStyle(colNode.col.headerCellStyle, args)
            }
        },
        getCellClass(colNode, args) {
            return {
                ...resolveClass(this.table.headerCellClass, args),
                ...resolveClass(colNode.col.headerCellClass, args)
            }
        },
        getCellContent(h, colNode, args, hasCheckCol) {
            let contentVnode = [];
            if (colNode.renderHeader && typeof colNode.renderHeader === "function") {
                contentVnode = [].concat(colNode.renderHeader(h, args));
                const idxSortCaret = contentVnode.findIndex(v => v === TABLE.$SortCaret);
                if (idxSortCaret >= 0) {
                    if (!colNode.sortable) throw new Error('only sortable col can use TABLE.$SortCaret !');
                    contentVnode[idxSortCaret] = this.genSortCaret(h, colNode);
                }
                const idxCheckBox = contentVnode.findIndex(v => v === TABLE.$CheckBox);
                if (idxCheckBox >= 0) {
                    if (colNode.type !== 'check') throw new Error('only check col can use TABLE.$CheckBox !');
                    contentVnode[idxCheckBox] = this.genCheckbox(h);
                }
            } else {
                if (colNode.type === 'text') {
                    contentVnode = [<span>{colNode.label}</span>];
                } else if (colNode.type === 'check' && colNode.isLeaf) {
                    hasCheckCol.count++;
                    contentVnode = [this.genCheckbox(h)];
                }
                if (colNode.sortable) {
                    contentVnode.push(this.genSortCaret(h, colNode));
                }
            }
            return contentVnode
        },
        genCheckbox(h) {
            return <span {...{
                class: ['cell-checkbox'],
                on: {
                    click: this.handleCheck
                }
            }}/>
        },
        genSortCaret(h, colNode) {
            const ascAttrs = {
                class: {
                    'sort-caret': true,
                    'asc': true,
                    'is-active': colNode.sort === ASC
                },
                on: {
                    click: (e) => {
                        this.table.setColumnSort(colNode, colNode.sort === ASC ? null : ASC);
                    }
                }
            }, descAttrs = {
                'class': {
                    'sort-caret': true,
                    'desc': true,
                    'is-active': colNode.sort === DESC
                },
                on: {
                    click: (e) => {
                        this.table.setColumnSort(colNode, colNode.sort === DESC ? null : DESC);
                    }
                }
            };
            return <span class="sort-caret-wrapper">
                 <i {...ascAttrs}/>
                 <i {...descAttrs}/>
            </span>
        }
    },
    render(h) {
        const colGroup = this.renderColGroup(h);
        const trs = [];
        for (let level = 0; level <= this.maxLevel; level++) {
            const columns = this.columnLevelMap[level];
            const cols = columns.map(i => i.col);
            let hasCheckCol = {count: 0};
            const tds = columns.map((colNode, colIndex) => {
                const args = {
                    row: cols,
                    $rowIndex: level,
                    col: colNode.col,
                    $colIndex: colIndex
                };
                const cellContent = this.getCellContent(h, colNode, args, hasCheckCol);
                const isHiddenCol = colNode.fixed !== this.fixed;
                const tdAttr = {
                    class: {
                        'is-hidden': isHiddenCol,
                        'is-leaf': colNode.isLeaf,
                        'no-right-border': colNode._noRightBorder,
                        'no-shadow-right': colNode._noShadowRightBorder,
                        ...this.getCellClass(colNode, args)
                    },
                    style: this.getCellStyle(colNode, args),
                    key: colNode.key,
                    attrs: {
                        rowspan: colNode.isLeaf ? this.maxLevel - colNode.level + 1 : 1,
                        colspan: colNode.leafNum || 1,
                        'data-col-uid': colNode._uid,
                        'data-col-level': colNode.level
                    },
                    on: {
                        mouseenter: this.handleMouseEnter,
                        mouseleave: this.handleMouseLeave
                    }
                };
                const children = [<div class="cell cell--header">{cellContent}</div>];
                if (this.table.resizable && !isHiddenCol && colNode.isLeaf) {
                    const pos = this.fixed === 'right' ? 'left' : 'right';
                    const resizeHandle = <div  {...{
                        class: ["resize-handle", `is-${pos}`],
                        on: {
                            mousedown: (e) => {
                                this.handleResizeCol(e, colNode, pos);
                            }
                        }
                    }}/>
                    children.push(resizeHandle)
                }
                return <td {...tdAttr}>{children}</td>
            });
            const args = {row: cols, $rowIndex: level};
            trs.push(<tr {...{
                class: {
                    ...this.getTrClass(args),
                    'has-check': !!hasCheckCol.count,
                    [`level-${level}`]: true,
                    'row': true,
                    'row--header': true
                },
                style: this.getTrStyle(args),
            }}>{tds}</tr>);
        }
        return <table {...{
            class: ['table__header'],
            style: {
                width: this.tableBodyWidth + 'px'
            },
            attrs: {
                cellspacing: "0",
                cellpadding: "0",
                border: "0"
            }
        }}>{colGroup}
            <thead>
            {trs}
            </thead>
        </table>
    },
    watch: {
        'store.checkTrigger': {
            handler: function () {
                this.$nextTick(() => {
                    const tr = this.$el.querySelector('tr.has-check');
                    if (!tr) return;
                    const checkNums = this.store.checkNums,
                        totalNums = this.store.flatDfsData.length;
                    if (checkNums === totalNums) {
                        addClass(tr, 'is-checked');
                        removeClass(tr, 'is-indeterminate');
                    } else if (checkNums && checkNums < totalNums) {
                        addClass(tr, 'is-indeterminate');
                        removeClass(tr, 'is-checked');
                    } else {
                        removeClass(tr, ['is-checked', 'is-indeterminate']);
                    }
                })

            }
        }
    }
}
</script>
