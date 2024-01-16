import locale from 'element-plus/lib/locale/lang/zh-cn'; // 中文语言
import 'element-plus/theme-chalk/index.css'; // element-plus css
import 'uno.css'; // uno.css
import 'nprogress/nprogress.css'; // progress bar style
import '@/assets/styles/index.scss'; // global css
import { createApp } from 'vue';
import ElementPlus from '@/element-plus';
import App from './App.vue';
import store from './store';
import router from './router';
import component from './components'; // global component
import directive from './directive'; // directive
import utils from './utils'; // utils
import './router/permission'; // permission control

// 创建应用
const app = createApp(App);
// 全局组件挂载
app.use(component);
// 指令挂载
app.use(directive);
// 工具挂载
app.use(utils);
// 启用路由、状态管理、插件
app.use(router);
app.use(store);
// element-plus 全量引入
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: 'default'
});
// 应用挂载
app.mount('#app');
// 全局处理未捕获的promise异常
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  console.warn('未捕获的promise异常: ', event.reason || '');
});
