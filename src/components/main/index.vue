<!-- hickey 2023 -->
<template>
  <div class="header">header</div>
  <div class="sidebar">
    <SideBar></SideBar>
  </div>
  <router-view></router-view>
</template>


<script setup lang="ts">
import SideBar from '@/components/sidbar/index.vue';

</script>

<style scoped>
  .header {
    height: 40px;
    background: blue;
  }
  .sidebar {
    width: 200px;
    height: 100px;
    background: yellowgreen;
  }
</style>