<!-- hickey 2023 -->
<template>
  <div v-if="inIframe">
    <router-view></router-view>
  </div>
  <div v-else>
    <Header></Header>
    <el-container>
      <SideBar></SideBar>
      <router-view></router-view>
    </el-container>
  </div>
</template>


<script setup lang="ts">

import Header from '@/components/layout/header.vue';
import SideBar from '@/components/layout/sidebar.vue';

const inIframe: Boolean = self !== top;

</script>

<style scoped>

</style>