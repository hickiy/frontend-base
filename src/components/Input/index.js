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
    instance.emitsOptions.keydown = (e) => {
      if (e.target.value.length > props.decimal) {
        e.preventDefault();
      }
      return true;
    };
    const { setup } = ElInput;
    return setup(props, ctx);
  }
};
