import Table from './src/table';
import {TABLE} from "./src/table-config";

Table.install = function (Vue) {
    Vue.component(Table.name, Table);
};
export default Table;
export {TABLE};