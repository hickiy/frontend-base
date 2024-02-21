<template>
  <div
    class="sidebar-container sidebar-wrap h-full"
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground,
      width: !isCollapse ? variables.sideBarWidth : variables.sideBarMiniWidth
    }"
  >
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
        :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
        :unique-opened="true"
        :active-text-color="theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
          :isCollapse="!isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup name="Sidebar">
import SidebarItem from './SidebarItem';
import variables from '/E:/learn/frontend-base/src/assets/styles/variables.module.scss';
import useAppStore from '@/store/modules/app';
import useSettingsStore from '@/store/modules/app';
import usePermissionStore from '@/store/modules/permission';

const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const isCollapse = computed(() => !appStore.sidebar.opened);

const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>
<style scoped lang="scss">
.sidebar-wrap:deep() {
  .el-menu-item {
    &.is-active {
      color: #fff;
      background-color: #0e36ac;
      &:hover{
        background-color: #282e3c !important;
      }
    }
  }
}
.sidebar-wrap {
  transition: width 0.28s;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}
</style>
