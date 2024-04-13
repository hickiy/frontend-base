<template>
  <dev class="h-full bg-#fff p-2.5 flex flex-col">
    <el-table :data="[]" border>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="" label="" min-width="120"></el-table-column>
      <el-table-column prop="" label="" min-width="120"></el-table-column>
      <el-table-column prop="" label="" min-width="120"></el-table-column>
    </el-table>
  </dev>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'; // 引入 Plus 图标
let value = -1;
export default {
  emits: ['update:modelValue'],
  name: 'Index',
  components: {
    Plus
  },
  data() {
    return {
      list: [{}, {}, {}, {}, {}], // 列表数据
      value: value++, // 0
      activeName: '1',
    };
  }
};
</script>
