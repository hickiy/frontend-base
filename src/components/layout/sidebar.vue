<!-- hickey 2023 -->
<template>
  <el-menu :default-active="defaultActive" router>
    <MenuItem v-for="menu in userStore.menus" :key="menu.id" :menuItem="menu"></MenuItem>
  </el-menu>
</template>

<script setup lang="ts">
import MenuItem from './menu-item.vue';
import user from '@/store/user';
import router from '@/router';
const userStore: any = user();

const defaultActive = computed(() => {
  let path = router.currentRoute.value.path;
  if (path == '/') {
    let firstMenu = userStore.menus[0];
    while (firstMenu?.children?.length > 0) {
      firstMenu = firstMenu.children[0];
    }
    router.replace(firstMenu.component);
    return firstMenu.component;
  } else {
    return path;
  }
});
</script>

<style scoped></style>
