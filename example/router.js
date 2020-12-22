import VueRouter from "vue-router";
import Vue from 'vue';
import tableBase from './components/table/_1_base';
import tableColWidth from './components/table/_2_col-width';
import tableLayout from './components/table/_3_layout';
import tableStyleBorder from './components/table/_4_style-border';
import tableStyleRowCell from './components/table/_5_style-row-cell';
import tableFixedCol from './components/table/_6_fix-col';
import tableMultiHeader from './components/table/_7_multi-header';
import tableRender from './components/table/_8_render'
import tableCheckAndExpand from './components/table/_9_check-and-expand';
Vue.use(VueRouter)
const tableRoutes = [
    {path: '/table/1', component: tableBase},
    {path: '/table/2', component: tableColWidth},
    {path: '/table/3', component: tableLayout},
    {path: '/table/4', component: tableStyleBorder},
    {path: '/table/5', component: tableStyleRowCell},
    {path: '/table/6', component: tableFixedCol},
    {path: '/table/7', component: tableMultiHeader},
    {path: "/table/8", component: tableRender},
    {path: "/table/9", component: tableCheckAndExpand},
    {path: '*', redirect: '/table/1'}
]
const router = new VueRouter({
    routes: tableRoutes
})
export default router
