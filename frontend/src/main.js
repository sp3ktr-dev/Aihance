import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores';
import i18n from '@/translations';

createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .mount('#app');
