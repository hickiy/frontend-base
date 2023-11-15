/*  hickey 2023/11/7 */
import { ElUpload } from 'element-plus';
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
      default: (options) => {
        console.log(options);
      }
    }
  }
};
