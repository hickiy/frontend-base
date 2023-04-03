<!-- hickey 2023 -->
<template>
  <el-sub-menu v-if="hasChildren" :index="menuItem.path">
    <template #title>
      <span>{{ menuItem.meta.title }}</span>
    </template>
    <menu-item v-for="child in menuItem.children" :key="child.path" :menuItem="child"></menu-item>
  </el-sub-menu>
  <el-menu-item v-else :index="index">{{ menuItem.meta.title }}</el-menu-item>
</template>

<script setup lang="ts">
const props = defineProps(['menuItem']);
const hasChildren = computed(() => {
  return props.menuItem.children && Array.isArray(props.menuItem.children) && props.menuItem.children.length > 0;
});
const index = computed(() => {
  return '/' + props.menuItem?.component;
});
</script>

<style scoped></style>
