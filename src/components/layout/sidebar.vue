<!-- hickey 2023 -->
<template>
  <el-menu default-active="1" class="el-menu-vertical-demo">
    <MenuItem v-for="menu in userStore.menus" :key="menu.id" :menuItem="menu"></MenuItem>
  </el-menu>
</template>

<script setup lang="ts">
import MenuItem from './menu-item.vue';
import user from '@/store/user';
const userStore: any = user();
</script>

<style scoped></style>
