<template>
  <div class="el-table-setting flex">
    <div v-if="title" class="title fs16 fw-b">{{ title }}</div>
    <div class="flex flex-row grow justify-end">
      <slot></slot>
      <div class="setting flex flex-row items-center justify-center cursor-pointer">
        <el-popover placement="bottom-start" width="240" trigger="click">
          <template #reference>
            <el-icon :size="22">
              <Tools />
            </el-icon>
          </template>
          <div class="popover-title">列表展示信息</div>
          <el-checkbox class="mb15" :indeterminate="true">全部（{{ ids.length + '/' + columns.length }}项）</el-checkbox>
          <el-checkbox-group v-model="ids" class="fl-c">
            <el-checkbox v-for="(c, i) in columns" :label="c.id" :key="c.id" :disabled="checkin(c)" :checked="true">{{ c.props.label }}</el-checkbox>
          </el-checkbox-group>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'table-setting',
  props: ['title', 'setTable'],
  data() {
    return {
      columns: [],
      ids: []
    };
  },
  computed: {
    canSet() {
      return Array.isArray(this.setTable);
    }
  },
  methods: {
    checkin(col) {
      return !!col.fixed || !col.property || col.type != 'default' || !col.canFilter;
    },
    setColumns(columns) {
      this.columns = columns;
    },
    columnChange(val, col, index) {
      const store = this.$parent.$refs['origin-table'].store;
      if (val) {
        store.commit('insertColumn', col, index, null);
      } else {
        store.commit('removeColumn', col, null);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table-setting {
  width: 100%;
  padding: 0 10px 10px 10px;
  min-height: 30px;
}
.title {
  color: #1e2e4e;
  height: 16px;
  line-height: 16px;
  border-left: 2px solid #0e36ac;
  text-indent: 8px;
}
.setting {
  width: 30px;
  border: 1px solid #e5e6eb;
}
.popover-title {
  font-size: 16px;
  font-weight: 400;
  color: #86909c;
  margin-bottom: 25px;
}
</style>
