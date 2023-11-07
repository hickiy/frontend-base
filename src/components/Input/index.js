/*  hickey 2023/11/7 */
import { ElInput } from 'element-plus';
import { h, ref } from 'vue';

export default {
  ...ElInput,
  setup(props, ctx) {
    const { setup } = ElInput;
    ElInput.emits.keydown = (e) => {
      console.log(e);
    };
    return setup(props, ctx);
  }
};
