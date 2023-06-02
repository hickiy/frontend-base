<!-- hickey 2023 -->
<template>
  <el-form :model="form" inline>
    <el-form-item label="电话号码" prop="phoneNumber">
      <el-input
        v-model="form.phoneNumber"
        placeholder="请输入用户电话号码"
      ></el-input>
    </el-form-item>
    <el-form-item label="用户状态" prop="status">
      <el-select v-model="form.status" placeholder="请选择用户状态">
        <el-option value="正常">正常</el-option>
        <el-option value="停用">停用</el-option>
      </el-select>
    </el-form-item>
    <el-button type="primary">test</el-button>
  </el-form>
</template>

<script setup lang="ts">
const form = reactive({ phoneNumber: undefined, status: undefined });

</script>

<style scoped></style>
