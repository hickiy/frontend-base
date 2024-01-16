// element-plus/icons-vue
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// svg图标组件
import SvgIcon from './SvgIcon/index.vue';
// 分页组件
import Pagination from './Pagination/index.vue';
// 自定义表格工具组件
import RightToolbar from './RightToolbar/index.vue';
// 富文本组件
import Editor from './Editor/index.vue';
// 文件上传组件
import FileUpload from './FileUpload/index.vue';
// 图片上传组件
import ImageUpload from './ImageUpload/index.vue';
// 图片预览组件
import ImagePreview from './ImagePreview/index.vue';
// 自定义树选择组件
import TreeSelect from './TreeSelect/index.vue';
// 字典标签组件
import DictTag from './DictTag/index.vue';

export default function (app) {
  // 全局自定义组件挂载
  app.component('DictTag', DictTag);
  app.component('Pagination', Pagination);
  app.component('TreeSelect', TreeSelect);
  app.component('FileUpload', FileUpload);
  app.component('ImageUpload', ImageUpload);
  app.component('ImagePreview', ImagePreview);
  app.component('RightToolbar', RightToolbar);
  app.component('Editor', Editor);
  app.component('svg-icon', SvgIcon);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
}
