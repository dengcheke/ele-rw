import Vue from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/darcula.css';
Vue.use(hljs.vuePlugin);
import App from './app';
import router from './router'


import EleRwTable from '../lib/table';
import Scrollbar from '../lib/scrollbar';
import Dialog from '../lib/dialog';
Vue.component('scroll-bar',Scrollbar)
Vue.use(EleRwTable);
Vue.use(Dialog);
import CodePanel from './components/code-panel';
Vue.component('code-panel',CodePanel);

new Vue({
    el:'#app',
    router,
    render:(h)=>h(App)
})

