<template>
  <div class="px-12 py-2 flex flex-nowrap justify-between bor border-b border-gray-300">
    <img class="w-14 rounded-full" src="@/assets/img/favicon.jpg"/>
    <div class="flex flex-none items-center">
      <el-input class="w-60 mr-8" type="text" prefix-icon="el-icon-position"></el-input>
      <el-menu class="border-none" default-active="components" mode="horizontal" :ellipsis="false">
        <el-menu-item index="components">组件中心</el-menu-item>
        <el-menu-item index="documents">文档中心</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style></style>
