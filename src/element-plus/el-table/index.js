import { ElTable } from 'element-plus';
import Prepend from './prepend.vue';
import { h } from 'vue';
export default {
  extends: ElTable,
  props: {
    setTable: {
      type: [Boolean, Array],
      default: undefined
    },
    title: {
      type: [String],
      default: ''
    }
  },
  setup(props, ctx) {
    return ElTable.setup(props, ctx);
  },
  render(...args) {
    const children = [ElTable.render.apply(this, args)];
    // table设置面板
    const setting = h(
      Prepend,
      {
        title: this.title,
        setTable: this.setTable,
        ref: 'table-setting'
      },
      {
        default: this.$slots.prepend
      }
    );
    if (this.setTable) {
      children.unshift(setting);
    }
    const style = {
      with: '100%',
      position: 'relative',
      overflow: 'hidden',
      flex: 1
    };
    if (this.$attrs.height) {
      typeof this.$attrs.height == 'number' && (style.height = this.$attrs.height + 'px');
      typeof this.$attrs.height == 'string' && (style.height = this.$attrs.height);
    }
    if (this.setTable) {
      style.display = 'flex';
      style.flexFlow = 'column ';
    }
    return h('div', { style }, children);
  },
};
