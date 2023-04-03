import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router/index';
import App from '@/App.vue';

import '@/assets/css/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// TODO: Remove this import，the folowing components ought to be imported on demand
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
