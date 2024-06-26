/*  hickey 2023/11/7 */
import { ElInput } from 'element-plus';
export default {
  extends: ElInput,
  props: {
    decimal: Number
  },
  setup(props, ctx) {
    const { setup } = ElInput;
    const render = setup(props, ctx);
    return (...args) => {
      const vnode = render(...args);
      if (props.type == 'number' && props.decimal != null) {
        const propData = vnode.props;
        if (propData) {
          propData.onInput = (value) => {
            const [integer, decimal] = value.split('.');
            requestAnimationFrame(() => {
              if (decimal?.length > props.decimal) {
                ctx.emit('update:modelValue', `${integer}.${decimal.slice(0, props.decimal)}`);
              } else {
                ctx.emit('update:modelValue', value);
              }
            });
          };
        }
      }
      return vnode;
    };
  }
};
