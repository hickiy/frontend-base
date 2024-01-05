<template>
  <div class="w-full h-full bg-#fff p-10px">
    <el-table :data="list" title="测试列表" :setTable="[]">
      <el-table-column label="序号"></el-table-column>
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
      list: []
    };
  }
};
</script>
