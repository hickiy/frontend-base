/*  hickey 2023/11/7 */
import { ElInput } from 'element-plus';
import { h, ref, getCurrentInstance } from 'vue';
export default {
  ...ElInput,
  props: {
    ...ElInput.props,
    decimal: Number
  },
  setup(props, ctx) {
    const instance = getCurrentInstance();
    console.log(instance);
    instance.vnode.props.onKeydown = (e) => {
      console.log('121221212');
      console.log(instance);
    };
    const { setup } = ElInput;
    return setup(props, ctx);
  }
};
