<!-- hickey 2023 -->
<template>
  <div>
    <div>{{ name }}</div>
    <el-button @click="modifyNmae">修改名称</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue';
let name: Ref<string | number> = ref('hickey');

const modifyNmae = () => {
  name.value = 111;
};
</script>

<style scoped></style>
