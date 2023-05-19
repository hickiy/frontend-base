<!-- hickey 2023 -->
<template>
  <div>
    <div>{{ name }}</div>
    <el-button type="primary" @click="modifyNmae">修改名称</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ElLoading } from 'element-plus';
let name: Ref<string | number> = ref('hickey');

const modifyNmae = () => {
  ElLoading.service({
    text: '正在修改名称',
    background: 'rgba(0, 0, 0, 0.7)'
  });
};
</script>

<style scoped></style>
