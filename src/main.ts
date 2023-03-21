import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router/index';
import App from '@/App.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/es/components/message/style/css';

import '@/assets/css/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
