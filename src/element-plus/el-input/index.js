/*  hickey 2023/11/7 */
import { ElInput } from 'element-plus';
export default {
  ...ElInput,
  props: {
    ...ElInput.props,
    decimal: Number
  },
  setup(props, ctx) {
    const { setup } = ElInput;
    const render = setup(props, ctx);
    return (...args) => {
      const vnode = render(...args);
      if (props.type == 'number' && props.decimal != null) {
        const propData = vnode.ctx?.vnode?.props;
        const originKeydown = propData?.onKeydown;
        if (propData) {
          propData.onKeydown = (e) => {
            const value = e.target.value;
            const reg = new RegExp(`^\\d{0,15}(\\.\\d{0,${props.decimal - 1}})?$`);
            // 判断是否按下了数字键，限制最多输入15位整数和
            if (e.key >= '0' && e.key <= '9' && !reg.test(value)) {
              e.preventDefault();
            }
            originKeydown?.(e);
          };
        }
      }
      return vnode;
    };
  }
};
