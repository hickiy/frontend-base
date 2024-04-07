// element-plus/icons-vue
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// svg图标组件
import SvgIcon from './SvgIcon/index.vue';
// 富文本组件
import Editor from './Editor/index.vue';
// 自定义树选择组件
import TreeSelect from './TreeSelect/index.vue';
// 字典标签组件
import DictTag from './DictTag/index.vue';

export default function (app) {
  // 全局自定义组件挂载
  app.component('DictTag', DictTag);
  app.component('TreeSelect', TreeSelect);
  app.component('Editor', Editor);
  app.component('svg-icon', SvgIcon);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
}
