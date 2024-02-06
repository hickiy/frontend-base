<template>
  <div class="app-container h-screen w-screen flex flex-col" :style="{ '--current-color': theme }">
    <navbar />
    <div class="content-container flex flex-row flex-1 overflow-hidden">
      <sidebar />
      <div class="main-container flex flex-col flex-1 overflow-hidden">
        <breadcrumb />
        <app-main />
      </div>
    </div>
  </div>
</template>

<script setup name="Layout">
import Sidebar from './Sidebar/index.vue';
import Breadcrumb from './Breadcrumb/index.vue';
import AppMain from './AppMain/index.vue';
import Navbar from './Navbar/index.vue';
import useSettingsStore from '@/store/modules/app';

const settingsStore = useSettingsStore();
const theme = computed(() => settingsStore.theme);
</script>
