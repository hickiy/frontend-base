<template>
  <div class="app-container h-screen w-screen flex flex-col" :style="{ '--current-color': theme }">
    <navbar @setLayout="setLayout" />
    <div class="content-container flex flex-row flex-1">
      <sidebar class="sidebar-container h-full w-200px" />
      <div class="main-container flex flex-col flex-1">
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container w-full" />
        <app-main class="app-container" />
      </div>
    </div>
  </div>
  <settings ref="settingRef" />
</template>

<script setup>
import Sidebar from './components/Sidebar/index.vue';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import { AppMain, Navbar, Settings } from './components';
import useSettingsStore from '@/store/modules/settings';

const settingsStore = useSettingsStore();
const theme = computed(() => settingsStore.theme);

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}
</script>
