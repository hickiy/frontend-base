/*  hickey 2023/11/7 */
import { ElUpload, ElMessage, useFormItem } from 'element-plus';
import request from '@/utils/request';
import { getCurrentInstance } from 'vue';

export default {
  extends: ElUpload,
  props: {
    action: {
      type: String,
      default: '/file/upload'
    },
    listType: {
      type: String,
      default: 'picture-card'
    },
    beforeUpload: {
      default(props) {
        const instance = getCurrentInstance();
        return function (file) {
          // 当多个文件同时上传时，设置一个宏任务，在本次微任务循环结束执行，避免当多个文件验证不通过时，弹出多次验证弹窗问题
          instance.beforeUploadMsg = [];
          if (!instance.timer) {
            instance.timer = window.setTimeout(() => {
              if (instance.beforeUploadMsg?.length) {
                ElMessage.warning(instance.beforeUploadMsg[0]);
                instance.beforeUploadMsg = [];
              }
              window.clearTimeout(instance.timer);
              instance.timer = null;
            }, 0);
          }
          let regStr = `.(${props.accept.replace(/(,\s+)/g, '|').replace(/\./g, '')})$`;
          const lastFile = props.fileList.length >= 2 ? props.fileList[props.fileList.length - 2] : null;
          // 文件校验逻辑
          if (!new RegExp(regStr, 'i').test(file.name)) {
            instance.beforeUploadMsg.push('文件类型不正确!');
          } else if (file.size > instance.limitSize * 1024 * 1024) {
            instance.beforeUploadMsg.push(`文件超过${instance.limitSize}M!`);
          } else if (lastFile) {
            // 处理后台文件返回的fileName,没有返回name的兼容问题
            const name = lastFile.name || lastFile.fileName || '';
            const lastFileType = name ? name.replace(/^.+\./, '').toLowerCase() : '';
            const nextFileType = file.name.replace(/^.+\./, '').toLowerCase();
            if (/(pdf|zip|ofd)/i.test(lastFileType)) {
              if (lastFileType != nextFileType) instance.beforeUploadMsg.push(`${lastFileType}类型文件不能与${nextFileType}类型文件混传`);
            } else if (/(pdf|zip|ofd)/i.test(nextFileType)) {
              instance.beforeUploadMsg.push(`图片类型文件不能与${nextFileType}类型文件混传`);
            }
          }
          return !instance.beforeUploadMsg.length;
        };
      }
    },
    onSuccess: {
      default() {
        const instance = getCurrentInstance();
        return (res, file, fileList) => {
          fileList.splice(fileList.indexOf(file), 1, { ...res.data, url: file.url });
          instance.formItem?.validate?.('input');
        };
      }
    },
    onError: {
      type: Function,
      default(err) {
        ElMessage.error(err.msg || '文件上传失败');
      }
    },
    onExceed: {
      type: Function,
      default(file, fileList) {
        ElMessage.warning(`最多上传${fileList?.length}个文件`);
      }
    },
    onRemove: {
      default() {
        const instance = getCurrentInstance();
        return () => {
          instance.formItem?.validate?.('input');
        };
      }
    },
    httpRequest: {
      type: Function,
      default(option) {
        const formData = new FormData();
        if (option.data) {
          for (const [key, value] of Object.entries(option.data)) {
            if (isArray(value) && value.length) formData.append(key, ...value);
            else formData.append(key, value);
          }
        }
        formData.append(option.filename, option.file, option.file.name);
        request({
          url: option.action,
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            ...option.headers
          },
          withCredentials: option.withCredentials,
          onUploadProgress(evt) {
            evt.percent = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0;
            option.onProgress(evt);
          }
        })
          .then((res) => {
            option.onSuccess(res);
          })
          .catch((err) => {
            option.onError(err);
          });
      }
    }
  },
  setup(props, ctx) {
    const { form, formItem } = useFormItem();
    var instance = getCurrentInstance();
    instance.formItem = formItem;
    instance.form = form;
    return ElUpload.setup(props, ctx);
  }
};
