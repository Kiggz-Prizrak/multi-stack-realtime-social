import Vue3EasyDataTable from 'vue3-easy-data-table';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'vue3-easy-data-table/dist/style.css';

const app = createApp(App);
app.use(store);
app.use(router);
app.component('EasyDataTable', Vue3EasyDataTable);
app.mount('#app');
