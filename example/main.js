import Vue from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/darcula.css';
Vue.use(hljs.vuePlugin);
import App from './app';
import router from './router'


import EleRwTable from '../packages/table/index';
Vue.use(EleRwTable);

import CodePanel from './components/code-panel';
Vue.component('code-panel',CodePanel);

import Scrollbar from '../packages/scrollbar/main';
Vue.component('scroll-bar',Scrollbar)

import Dialog from '../packages/dialog';
Vue.use(Dialog);

new Vue({
    el:'#app',
    router,
    render:(h)=>h(App)
})

