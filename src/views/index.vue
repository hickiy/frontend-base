<template>
  <div class="h-full bg-#fff p-10px flex flex-col">
    <el-input v-model="value"></el-input>
    <el-table :data="list" title="测试列表" :setTable="[]" height="100%" border>
      <el-table-column label="序号" type="index" width="60"></el-table-column>
      <el-table-column label="姓名"></el-table-column>
      <el-table-column label="性别"></el-table-column>
      <el-table-column label="职业"></el-table-column>
      <el-table-column label="工龄"></el-table-column>
      <el-table-column label="操作" #default="{ $index }">
        <el-button v-if="$index < 4" text>
          <router-link :to="{ path: `/index/${$index}` }">{{ `/index/${$index}` }}</router-link>
        </el-button>
        <el-button v-else text>
          <router-link to="/user/profile">/user/profile</router-link>
        </el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue';
let value = -1;
export default {
  name: 'Index',
  components: {
    Plus
  },
  data() {
    return {
      list: [{}, {}, {}, {}, {}],
      value: value++
    };
  }
};
</script>
