import { ElMessage } from 'element-plus'; // 弹窗
import { useDict } from './dict'; // 字典工具
import { download } from './request'; // 下载工具
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from './utils.js'; // 工具方法



export default function (app) {
  app.config.globalProperties.useDict = useDict;
  app.config.globalProperties.download = download;
  app.config.globalProperties.parseTime = parseTime;
  app.config.globalProperties.resetForm = resetForm;
  app.config.globalProperties.handleTree = handleTree;
  app.config.globalProperties.addDateRange = addDateRange;
  app.config.globalProperties.selectDictLabel = selectDictLabel;
  app.config.globalProperties.selectDictLabels = selectDictLabels;
  app.config.globalProperties.$modal = ElMessage;
}