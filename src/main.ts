import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import EVueEsrimap from './../packages/index.js';
import 'font-awesome/css/font-awesome.css';

Vue.use(EVueEsrimap);
Vue.config.productionTip = false;


new Vue({
    render: (h) => h(App),
}).$mount('#app');
