import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import EVueTest from './../packages/index.js';

Vue.use(EVueTest);
Vue.config.productionTip = false;


new Vue({
    render: (h) => h(App),
}).$mount('#app');
