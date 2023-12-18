<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <navbar @setLayout="setLayout" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <app-main />
    </div>
    <settings ref="settingRef" />
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar/index.vue';
import Breadcrumb from '@/components/Breadcrumb';
import { AppMain, Navbar, Settings } from './components';

import useSettingsStore from '@/store/modules/settings';

const settingsStore = useSettingsStore();
const theme = computed(() => settingsStore.theme);

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  width: 100vw;
  height: 100vh;
}
</style>
