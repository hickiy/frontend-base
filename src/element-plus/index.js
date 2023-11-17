import * as ElementPlus from 'element-plus';
import MyInput from './el-input';
import MyUpload from './el-upload';
// 重写ElementPlus的install方法，将自定义的组件也注册到Vue中
const { ElInput, ElUpload, ...component } = ElementPlus;
export default {
  install(app, options) {
    if (app[ElementPlus.INSTALLED_KEY]) return;
    app[ElementPlus.INSTALLED_KEY] = true;
    Object.keys(component).forEach((key) => {
      if (/^El.+/.test(key) && component[key].install) {
        app.use(component[key]);
      }
    });
    app.component('ElInput', MyInput);
    app.component('ElUpload', MyUpload);
    if (options) ElementPlus.provideGlobalConfig(options, app, true);
  },
  version: ElementPlus.version
};
