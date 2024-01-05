import { ElTable as Table, ElTooltip as Tooltip, ElButton as Button } from 'element-plus';
import TableSetting from './table-setting.vue';
import { h } from 'vue';
export default {
  name: Table.name,
  inheritAttrs: false,
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
  data() {
    return {
      tooltipContent: ''
    };
  },
  mounted() {
    if (Array.isArray(this.setTable)) {
      this.$refs['table-setting'].setColumns(this.$slots.default());
    }
  },
  activated() {
    this.originTable.doLayout();
  },
  computed: {
    originTable() {
      return this.$refs['origin-table'];
    }
  },
  methods: {
    clearSelection(...arg) {
      this.originTable.clearSelection(...arg);
    },
    toggleRowSelection(...arg) {
      this.originTable.toggleRowSelection(...arg);
    },
    toggleAllSelection(...arg) {
      this.originTable.toggleAllSelection(...arg);
    },
    toggleRowExpansion(...arg) {
      this.originTable.toggleRowExpansion(...arg);
    },
    setCurrentRow(...arg) {
      this.originTable.setCurrentRow(...arg);
    },
    clearSort(...arg) {
      this.originTable.clearSort(...arg);
    },
    clearFilter(...arg) {
      this.originTable.clearFilter(...arg);
    },
    doLayout() {
      this.originTable.doLayout();
    },
    sort(...arg) {
      this.originTable.sort(...arg);
    }
  },
  render() {
    // table设置面板
    const setting = h(
      TableSetting,
      {
        title: this.title,
        setTable: this.setTable,
        ref: 'table-setting'
      },
      {
        default: this.$slots.prepend
      }
    );

    // el-table组件

    const table = h(
      Table,
      {
        ...this.$attrs,
        ref: 'origin-table'
      },
      {
        default: this.$slots.default
      }
    );

    const children = [table];
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
  }
};
