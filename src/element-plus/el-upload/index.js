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
          if (props.accept && !new RegExp(regStr, 'i').test(file.name)) {
            // 校验文件类型，不符合则提示，如果不存在accept属性，则不校验
            instance.beforeUploadMsg.push('文件类型不正确!');
          } else if (instance.limitSize && file.size > instance.limitSize * 1024 * 1024) {
            // 校验文件大小，不符合则提示，如果不存在limitSize属性，则不校验
            instance.beforeUploadMsg.push(`文件超过${instance.limitSize}M!`);
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
