import Vue from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/androidstudio.css';
Vue.use(hljs.vuePlugin);

import EleRwTable from '../packages/table/index';
Vue.use(EleRwTable);

import CodePanel from './components/code-panel';
Vue.component('code-panel',CodePanel);

import Scrollbar from '../packages/custom-scrollbar';
Vue.component('scroll-bar',Scrollbar)
import App from './app';
new Vue({
    el:'#app',
    render:(h)=>h(App)
})


