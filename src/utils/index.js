import { ElMessage } from 'element-plus'; // 弹窗
import { useDict } from './dict'; // 字典工具
import { download } from './request'; // 下载工具

export default function (app) {
  app.config.globalProperties.useDict = useDict;
  app.config.globalProperties.download = download;
  app.config.globalProperties.$modal = ElMessage;
  app.config.globalProperties.parseTime = function () { };
  app.config.globalProperties.resetForm = function () { };
  app.config.globalProperties.handleTree = function () { };
  app.config.globalProperties.addDateRange = function () { };
  app.config.globalProperties.selectDictLabel = function () { };
  app.config.globalProperties.selectDictLabels = function () { };
}