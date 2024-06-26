<!-- hickey 2024/06/25 -->
<template>
  <div class="bg-white flex-1 p-4 m-2.5 flex flex-col overflow-hidden">
    <div class="ion-search-area--bg pt-4 pl-4 pr-4">
      <el-form :model="form" ref="form" label-width="80px" inline>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字"></el-input>
        </el-form-item>
        <template #append>
          <el-button type="primary">搜索</el-button>
          <el-button>重置</el-button>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: ''
      }
    };
  }
};
</script>

<style scoped lang="scss"></style>
