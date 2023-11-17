/*  hickey 2023/11/7 */
import { ElUpload } from 'element-plus';
import request from '@/utils/request';
export default {
  ...ElUpload,
  props: {
    ...ElUpload.props,
    action: {
      type: String,
      default: '/file/upload'
    },
    httpRequest: {
      type: Function,
      default: (option) => {
        const formData = new FormData();
        if (option.data) {
          for (const [key, value] of Object.entries(option.data)) {
            if (isArray(value) && value.length) formData.append(key, ...value);
            else formData.append(key, value);
          }
        }
        formData.append(option.filename, option.file, option.file.name);
        return request({
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
  }
};
