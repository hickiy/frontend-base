<template>
  <div class="h-full bg-#fff p-10px flex flex-col">
    <div class="i-logos-vue text-3xl" />
    <el-table :data="list" title="测试列表" :setTable="[]" height="100%" border>
      <el-table-column label="序号" type="index" width="60"></el-table-column>
      <el-table-column label="姓名"></el-table-column>
      <el-table-column label="性别"></el-table-column>
      <el-table-column label="职业"></el-table-column>
      <el-table-column label="工龄"></el-table-column>
      <el-table-column label="年龄"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue';
export default {
  components: {
    Plus
  },
  data() {
    return {
      list: [{}]
    };
  }
};
</script>
